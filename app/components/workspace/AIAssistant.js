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
      text: 'Привет! Я ваш AI-ассистент. Выберите модель и задайте вопрос!',
      model: 'gpt-4'
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
      if (showModelSelector && !event.target.closest('.ai-model-selector')) {
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
          history: messages.slice(-5)
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: data.response || 'Ответ получен успешно!',
        model: selectedModel
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('AI API Error:', error);
      setApiError(error.message);
      
      // Fallback к mock ответам при ошибке API
      const modelResponses = {
        'gpt-4': 'Анализирую ваши данные... Рекомендую обратить внимание на конверсию - есть потенциал роста!',
        'claude-3': 'Безопасно могу сказать: ваши метрики показывают стабильный рост. Предлагаю оптимизировать воронку продаж.',
        'gemini-pro': '⚡ Быстрый анализ: оптимизируйте SEO для увеличения органического трафика на 40%!'
      };

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: modelResponses[selectedModel] || 'Временно работаю в автономном режиме. Анализирую ваши данные...',
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
    <div className="ai-assistant-new">
      <button 
        className="ai-assistant-trigger-new"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AI Ассистент"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <div className="ai-chat-window-new">
          <div className="ai-chat-header-new">
            {/* Левая часть - название и статус */}
            <div className="ai-header-left">
              <h3>AI Ассистент</h3>
              <span className="ai-status">
                <span className={`ai-status-dot ${apiError ? 'error' : 'online'}`}></span>
                {apiError ? 'Автономно' : 'Онлайн'}
              </span>
            </div>
            
            {/* Центральная часть - селектор моделей */}
            <div className="ai-header-center">
              <div className="ai-model-selector">
                <button 
                  className="ai-current-model"
                  onClick={() => setShowModelSelector(!showModelSelector)}
                >
                  <span className="ai-model-icon">
                    {aiModels.find(m => m.id === selectedModel)?.icon}
                  </span>
                  <span className="ai-model-name">
                    {aiModels.find(m => m.id === selectedModel)?.name}
                  </span>
                  <span className="ai-dropdown-arrow">▼</span>
                </button>
                
                {showModelSelector && (
                  <div className="ai-model-dropdown">
                    {aiModels.map(model => (
                      <button
                        key={model.id}
                        className={`ai-model-option ${selectedModel === model.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelSelector(false);
                        }}
                      >
                        <div className="ai-model-info">
                          <span className="ai-model-icon-large">{model.icon}</span>
                          <div className="ai-model-details">
                            <span className="ai-model-title">{model.name}</span>
                            <span className="ai-model-provider">{model.provider}</span>
                          </div>
                        </div>
                        <span className="ai-model-status">●</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Правая часть - кнопка закрытия */}
            <button 
              className="ai-chat-close-new"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат"
              title="Закрыть чат"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Сообщения */}
          <div className="ai-chat-messages-new">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`ai-chat-message ${message.type} ${message.isOffline ? 'offline' : ''}`}
              >
                <div className="ai-message-avatar">
                  {message.type === 'assistant' ? 
                    (message.model ? aiModels.find(m => m.id === message.model)?.icon || '🤖' : '🤖') : 
                    (userProfile?.avatar || '👤')
                  }
                </div>
                <div className="ai-message-content">
                  {message.type === 'assistant' && message.model && (
                    <div className="ai-message-model">
                      {aiModels.find(m => m.id === message.model)?.name}
                      {message.isOffline && <span className="ai-offline-badge">Автономно</span>}
                    </div>
                  )}
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="ai-chat-message assistant">
                <div className="ai-message-avatar">🤖</div>
                <div className="ai-message-content ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Быстрые действия */}
          <div className="ai-quick-actions-new">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="ai-quick-action-chip"
                onClick={() => handleQuickAction(action.action)}
              >
                {action.text}
              </button>
            ))}
          </div>

          {/* Форма ввода */}
          <form className="ai-chat-input-form-new" onSubmit={handleSend}>
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