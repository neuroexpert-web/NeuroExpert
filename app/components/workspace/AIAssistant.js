'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

export default function AIAssistant() {
  const { addNotification, userProfile } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: 'Привет! Я ваш AI-ассистент. Как я могу помочь вам сегодня?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState(null);
  const messagesEndRef = useRef(null);

  const aiModels = [
    { 
      id: 'gpt-4', 
      name: 'GPT-4', 
      provider: 'OpenAI',
      description: 'Самая мощная модель для сложных задач',
      icon: '🧠',
      status: 'active'
    },
    { 
      id: 'claude-3', 
      name: 'Claude 3', 
      provider: 'Anthropic',
      description: 'Отличается точностью и безопасностью',
      icon: '🎯',
      status: 'active'
    },
    { 
      id: 'gemini-pro', 
      name: 'Gemini Pro', 
      provider: 'Google',
      description: 'Быстрая обработка и анализ данных',
      icon: '⚡',
      status: 'active'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModelSelector && !event.target.closest('.model-selector')) {
        setShowModelSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModelSelector]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    setApiError(null);

    try {
      // Вызываем API в зависимости от выбранной модели
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          message: currentInput,
          context: 'business_dashboard',
          history: messages.slice(-5) // Последние 5 сообщений для контекста
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: data.response || 'Извините, произошла ошибка при обработке вашего запроса.',
        model: selectedModel
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('AI API Error:', error);
      setApiError(error.message);
      
      // Fallback к mock ответам при ошибке API
      const fallbackResponses = [
        'Извините, в данный момент у меня проблемы с подключением. Анализирую ваши данные локально...',
        'Временно работаю в автономном режиме. Рекомендую обратить внимание на основные метрики в дашборде.',
        'Соединение с AI-сервисом восстанавливается. Пока могу предложить базовую аналитику ваших данных.',
      ];

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        model: selectedModel,
        isOffline: true
      };

      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);

      // Добавляем уведомление о новом сообщении
      if (!isOpen) {
        addNotification({
          id: Date.now(),
          type: 'info',
          title: 'AI Ассистент',
          message: 'У вас новое сообщение',
          timestamp: new Date()
        });
      }
    }
  };

  const quickActions = [
    { id: 1, text: 'Создать отчет', action: 'report' },
    { id: 2, text: 'Анализ данных', action: 'analyze' },
    { id: 3, text: 'Рекомендации', action: 'recommend' },
    { id: 4, text: 'Помощь', action: 'help' }
  ];

  const handleQuickAction = (action) => {
    const actionTexts = {
      report: 'Создайте отчет по продажам за последний месяц',
      analyze: 'Проанализируйте эффективность маркетинговых кампаний',
      recommend: 'Дайте рекомендации по улучшению конверсии',
      help: 'Как мне использовать личный кабинет эффективнее?'
    };
    
    setInputValue(actionTexts[action]);
  };

  return (
    <div className="ai-assistant">
      <button 
        className="ai-assistant-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Ассистент"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div className="ai-chat-window">
          <div className="chat-header">
            <div className="chat-header-left">
              <h3>AI Ассистент</h3>
              <span className="chat-status">
                <span className={`status-dot ${apiError ? 'error' : 'online'}`}></span>
                {apiError ? 'Автономно' : 'Онлайн'}
              </span>
            </div>
            
            <div className="chat-header-center">
              <div className="model-selector">
                <button 
                  className="current-model"
                  onClick={() => {
                    console.log('Model selector clicked, current state:', showModelSelector);
                    setShowModelSelector(!showModelSelector);
                  }}
                >
                  {aiModels.find(m => m.id === selectedModel)?.icon} {aiModels.find(m => m.id === selectedModel)?.name}
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showModelSelector && (
                  <div className="model-dropdown">
                    {console.log('Rendering dropdown with models:', aiModels)}
                    {aiModels.map(model => (
                      <button
                        key={model.id}
                        className={`model-option ${selectedModel === model.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelSelector(false);
                        }}
                      >
                        <div className="model-info">
                          <span className="model-icon">{model.icon}</span>
                          <div className="model-details">
                            <span className="model-name">{model.name}</span>
                            <span className="model-provider">{model.provider}</span>
                          </div>
                        </div>
                        <span className={`model-status ${model.status}`}>●</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button 
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат"
              title="Закрыть чат"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`chat-message ${message.type} ${message.isOffline ? 'offline' : ''}`}
              >
                <div className="message-avatar">
                  {message.type === 'assistant' ? 
                    (message.model ? aiModels.find(m => m.id === message.model)?.icon || '🤖' : '🤖') : 
                    userProfile.avatar
                  }
                </div>
                <div className="message-content">
                  {message.type === 'assistant' && message.model && (
                    <div className="message-model">
                      {aiModels.find(m => m.id === message.model)?.name}
                      {message.isOffline && <span className="offline-badge">Автономно</span>}
                    </div>
                  )}
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message assistant">
                <div className="message-avatar">🤖</div>
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-quick-actions">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="quick-action-chip"
                onClick={() => handleQuickAction(action.action)}
              >
                {action.text}
              </button>
            ))}
          </div>

          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Задайте вопрос..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              aria-label="Отправить сообщение"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}