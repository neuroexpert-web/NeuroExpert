'use client';

import { useState, useRef, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

export default function AIAssistant() {
  const { addNotification, userProfile } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: 'Привет! Я ваш AI-ассистент. Как я могу помочь вам сегодня?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Симуляция ответа AI
    setTimeout(() => {
      const responses = [
        'Анализирую ваши данные... Вижу рост конверсии на 15% за последнюю неделю!',
        'Рекомендую обратить внимание на сегмент "Новые пользователи" - там есть потенциал роста.',
        'Могу создать для вас детальный отчет по этому вопросу. Хотите, чтобы я это сделал?',
        'Обнаружил аномалию в данных за вчерашний день. Давайте разберем подробнее.',
        'Ваш уровень использования AI достиг нового рекорда! Поздравляю с достижением!'
      ];

      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        text: responses[Math.floor(Math.random() * responses.length)]
      };

      setMessages(prev => [...prev, aiMessage]);
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
    }, 1500);
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
            <div className="chat-header-info">
              <h3>AI Ассистент</h3>
              <span className="chat-status">
                <span className="status-dot"></span>
                Онлайн
              </span>
            </div>
            <button 
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат"
            >
              ×
            </button>
          </div>

          <div className="chat-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`chat-message ${message.type}`}
              >
                <div className="message-avatar">
                  {message.type === 'assistant' ? '🤖' : userProfile.avatar}
                </div>
                <div className="message-content">
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