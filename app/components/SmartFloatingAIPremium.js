'use client';
import { useState, useEffect, useRef } from 'react';

export default function SmartFloatingAIPremium() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('ai_messages') || '[]');
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude');
  const [stats, setStats] = useState({
    totalQuestions: 0,
    avgResponseTime: 0,
    satisfaction: 95
  });
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Сохраняем историю сообщений
  useEffect(() => {
    if (messages && messages.length) {
      try {
        localStorage.setItem('ai_messages', JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Быстрые вопросы
  const quickQuestions = [
    "Увеличить продажи на 20%",
    "Автоматизировать процессы"
  ];

  // Приветствие при открытии
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'day' : 'evening';
      
      const greetings = {
        morning: "Доброе утро! ☀️ Александр Нейронов, управляющий директор NeuroExpert. Рад видеть вас так рано! Чем могу помочь?",
        day: "Добрый день! 👋 Александр Нейронов на связи. Расскажите о вашем проекте.",
        evening: "Добрый вечер! 🌙 Александр здесь. Готов помочь с вашим проектом."
      };
      
      setTimeout(() => {
        typewriterEffect(greetings[timeOfDay], 'system');
      }, 500);
    }
  }, [isOpen]);

  // Слушаем событие открытия чата и глобальную переменную
  useEffect(() => {
    const handleOpenChat = (event) => {
      setIsOpen(true);
      if (event.detail && event.detail.message) {
        setTimeout(() => {
          setInput(event.detail.message);
          setTimeout(() => {
            sendMessage();
          }, 200);
        }, 100);
      }
    };
    
    // Проверяем глобальную переменную при монтировании
    if (window.openAIChat) {
      setIsOpen(true);
      window.openAIChat = false;
    }
    
    window.addEventListener('openAIChat', handleOpenChat);
    
    // Добавляем глобальную функцию для открытия чата
    window.openAIAssistant = () => {
      setIsOpen(true);
    };
    
    return () => {
      window.removeEventListener('openAIChat', handleOpenChat);
      delete window.openAIAssistant;
    };
  }, []);

  const typewriterEffect = (text, model, callback) => {
    let i = 0;
    setIsTyping(true);
    const tempMessage = { type: 'assistant', text: '', model };
    setMessages(prev => [...prev, tempMessage]);
    
    const timer = setInterval(() => {
      if (i < text.length) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = text.substring(0, i + 1);
          return newMessages;
        });
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 30);
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);
    setStats(prev => ({ ...prev, totalQuestions: prev.totalQuestions + 1 }));

    const startTime = Date.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          model: selectedModel,
          context: messages.slice(-10)
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      setStats(prev => ({
        ...prev,
        avgResponseTime: Math.round((prev.avgResponseTime + responseTime) / 2)
      }));

      typewriterEffect(data.message, selectedModel);
    } catch (error) {
      console.error('Chat error:', error);
      typewriterEffect('Извините, произошла ошибка. Попробуйте еще раз.', selectedModel);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <>
      {/* Кнопка открытия чата с неоновым эффектом */}
      <button
        className={`smart-floating-ai ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Открыть AI управляющего"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <span className="robot-icon">🤖</span>
      </button>

      {/* Окно чата с премиум дизайном */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Заголовок */}
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-avatar">
                <span>👨‍💼</span>
              </div>
              <div className="chat-info">
                <h3>Александр Нейронов</h3>
                <p><span className="status-dot"></span> AI Управляющий • Онлайн</p>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат"
            >
              ✕
            </button>
          </div>

          {/* Селектор модели */}
          <div className="model-selector">
            <button
              className={`model-btn ${selectedModel === 'claude' ? 'active' : ''}`}
              onClick={() => setSelectedModel('claude')}
            >
              <span>🌟</span> Claude
            </button>
            <button
              className={`model-btn ${selectedModel === 'gemini' ? 'active' : ''}`}
              onClick={() => setSelectedModel('gemini')}
            >
              <span>⚡</span> Gemini
            </button>
          </div>

          {/* Сообщения */}
          <div className="chat-messages" ref={messagesContainerRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.text}
                  {msg.model && <div className="message-model">via {msg.model}</div>}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Быстрые вопросы */}
          {messages.length === 0 && !isLoading && (
            <div className="quick-questions">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="quick-question-btn"
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Форма ввода */}
          <div className="chat-input-container">
            <form onSubmit={sendMessage} className="chat-input-form">
              <input
                type="text"
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Задайте вопрос о вашем бизнесе..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <span className="loading-spinner"></span> : '➤'}
              </button>
            </form>
          </div>

          {/* Статистика */}
          <div className="chat-stats">
            <div className="stat-item">
              <div className="stat-value">{stats.totalQuestions}</div>
              <div>вопросов</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.avgResponseTime}ms</div>
              <div>скорость</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.satisfaction}%</div>
              <div>довольны</div>
            </div>
          </div>
          
          {/* Прогресс-бар при генерации */}
          {isLoading && (
            <div className="generation-progress">
              <div className="generation-progress-bar"></div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .hidden {
          display: none !important;
        }
      `}</style>
    </>
  );
}