'use client';
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';

function SmartFloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  // История сообщений хранится в localStorage -> диалог не пропадает после перезагрузки
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('ai_messages') || '[]');
    } catch {
      return [];
    }
  });
  const [context, setContext] = useState({
    industry: null,
    companySize: null,
    urgency: null,
    previousInteractions: 0,
    userProfile: {}
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude'); // 'gemini' или 'claude' - Claude по умолчанию
  const [dialogHistory, setDialogHistory] = useState([]); // История диалога для текущей модели
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

  // Сохраняем историю сообщений при каждом изменении
  useEffect(() => {
    if (messages && messages.length) {
      try {
        localStorage.setItem('ai_messages', JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Быстрые вопросы - только 2 самых важных
  const quickQuestions = [
    "Увеличить продажи на 20% за 3 месяца",
    "Автоматизировать обработку заказов"
  ];

  // Динамическое приветствие при открытии чата
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'day' : 'evening';
      
      const greetings = {
        morning: "Доброе утро! ☀️ Александр Нейронов, управляющий директор NeuroExpert. Рад видеть вас так рано - это признак амбициозных людей! Чем могу помочь с вашим бизнесом?",
        day: "Добрый день! 👋 Александр Нейронов на связи. Самое продуктивное время для больших решений! Расскажите о вашем проекте.",
        evening: "Добрый вечер! 🌙 Александр здесь. Даже в позднее время готов помочь с вашим проектом. Что вас интересует?"
      };
      
      setTimeout(() => {
        typewriterEffect(greetings[timeOfDay], 'system');
      }, 500);
    }
  }, [isOpen]);

  // Слушаем событие открытия чата
  useEffect(() => {
    const handleOpenChat = (event) => {
      setIsOpen(true);
      // Если есть предзаполненное сообщение, отправляем его автоматически
      if (event.detail && event.detail.message) {
        setTimeout(() => {
          // Создаем сообщение пользователя без заполнения поля ввода
          const userMessage = event.detail.message;
          setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
          // Отправляем запрос к API
          handleAutoMessage(userMessage);
        }, 100);
      }
    };
    window.addEventListener('openAIChat', handleOpenChat);
    return () => window.removeEventListener('openAIChat', handleOpenChat);
  }, [selectedModel, dialogHistory, context, isLoading, isTyping]);

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
    }, 5); // Ускорено с 20мс до 5мс - в 4 раза быстрее
  };

  const handleAutoMessage = async (userMessage) => {
    if (isLoading || isTyping) return;
    
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-neuroexpert-csrf': 'browser'
        },
        body: JSON.stringify({ 
          userMessage: userMessage,
          model: selectedModel,
          history: dialogHistory,
          context: {
            ...context,
            previousInteractions: context.previousInteractions + 1
          }
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const responseTime = data.responseTime || (Date.now() - startTime);
      
      setContext(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + responseTime,
        totalTokens: prev.totalTokens + (data.tokensUsed || 0),
        averageResponseTime: (prev.averageResponseTime * prev.previousInteractions + responseTime) / (prev.previousInteractions + 1),
        ...data.context
      }));
      
      // Обновляем историю диалога
      setDialogHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: data.response }
      ]);
      
      typewriterEffect(data.response || 'Извините, произошла ошибка.', selectedModel);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        text: 'Извините, произошла ошибка. Попробуйте еще раз.',
        model: selectedModel
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);
    
    const startTime = Date.now();

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-neuroexpert-csrf': 'browser' // Добавляем CSRF заголовок
        },
        body: JSON.stringify({ 
          userMessage: userMessage, // Изменено с 'question' на 'userMessage'
          model: selectedModel,
          history: dialogHistory, // Передаем историю диалога
          context: {
            ...context,
            previousInteractions: context.previousInteractions + 1
          }
        })
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const responseTime = data.responseTime || (Date.now() - startTime);
      
      // Обновляем контекст и статистику
      setContext(prev => ({
        ...prev,
        previousInteractions: prev.previousInteractions + 1
      }));
      
      setStats(prev => ({
        totalQuestions: prev.totalQuestions + 1,
        avgResponseTime: Math.round(
          (prev.avgResponseTime * prev.totalQuestions + responseTime) / 
          (prev.totalQuestions + 1)
        ),
        satisfaction: prev.satisfaction
      }));

      setIsLoading(false);
      
      // Обновляем историю диалога из ответа сервера
      if (data.updated_history) {
        setDialogHistory(data.updated_history);
      }
      
      typewriterEffect(data.reply || data.answer || 'Извините, не удалось получить ответ.', data.model || selectedModel);

      // Сохраняем в истории чатов
      const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      history.push({
        timestamp: new Date().toISOString(),
        userMessage,
        aiResponse: data.answer,
        model: data.model || selectedModel,
        context: data.context
      });
      // Ограничиваем историю 50 записями
      if (history.length > 50) history.shift();
      localStorage.setItem('chatHistory', JSON.stringify(history));

    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      typewriterEffect(
        'Извините, произошла ошибка при подключении к AI. Пожалуйста, попробуйте еще раз или переключитесь на другую модель.',
        selectedModel
      );
    }
  }, [input, isLoading, isTyping, selectedModel, dialogHistory, context]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Очистка истории диалога
  const clearHistory = () => {
    setMessages([]);
    setDialogHistory([]); // Очищаем историю Gemini
    try {
      localStorage.removeItem('ai_messages');
      localStorage.removeItem('chatHistory');
    } catch {}
  };

  return (
    <>
      {/* Кнопка открытия чата */}
      <button
        className={`ai-float-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Открыть AI помощника"
      >
        <div className="ai-button-content">
          <span className="ai-icon">🤖</span>
          <span className="ai-pulse"></span>
        </div>
        <div className="ai-tooltip">AI помощник</div>
      </button>

      {/* Окно чата */}
      <div className={`ai-chat-window ${isOpen ? 'open' : ''}`}>
        <div className="ai-chat-container">
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-avatar-circle">
                <span className="ai-avatar-emoji">👨‍💼</span>
                <span className="ai-status-dot"></span>
              </div>
              <div className="ai-header-info">
                <h3>Управляющий NeuroExpert v3.2</h3>
                <p className="ai-subtitle">Ваш стратегический командный центр</p>
              </div>
            </div>
            <div className="ai-header-right">
              <button 
                className={`model-btn ${selectedModel === 'gemini' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedModel('gemini');
                  setDialogHistory([]); // Очищаем историю при смене модели
                }}
                title="Google Gemini Pro"
              >
                ✨
              </button>
              <button 
                className={`model-btn ${selectedModel === 'claude' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedModel('claude');
                  setDialogHistory([]); // Очищаем историю при смене модели
                }}
                title="Claude 3"
              >
                🧠
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="ai-close-btn"
                aria-label="Закрыть чат"
                title="Закрыть"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="ai-messages" ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <div key={index} className={`ai-message ${message.type}`}>
                {message.type === 'assistant' && (
                  <div className="ai-message-avatar">
                    <span>👨‍💼</span>
                  </div>
                )}
                <div className="ai-message-content">
                  <div className="ai-message-text">{message.text}</div>
                  {message.type === 'assistant' && message.model && (
                    <div className="ai-message-model">
                      {message.model === 'claude' ? '🧠 Claude' : '✨ Gemini'}
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="ai-message-avatar">
                    <span>👤</span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="ai-message assistant">
                <div className="ai-message-avatar">
                  <span>👨‍💼</span>
                </div>
                <div className="ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Показываем быстрые вопросы только если нет сообщений */}
          {messages.length === 0 && (
            <div className="ai-quick-questions">
              <p>Быстрый старт:</p>
              <div className="ai-quick-buttons">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMessages(prev => [...prev, { type: 'user', text: q }]);
                      handleAutoMessage(q);
                    }}
                    disabled={isLoading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ai-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите ваш вопрос..."
              disabled={isLoading || isTyping}
            />
            <button
              onClick={sendMessage}
              className="ai-send-button"
              disabled={isLoading || isTyping || !input.trim()}
            >
              <span>➤</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ai-float-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(96, 165, 250, 0.3);
          transition: all 0.3s ease;
          z-index: 1000;
          overflow: hidden;
        }

        .ai-float-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 30px rgba(96, 165, 250, 0.4);
        }

        .ai-float-button.hidden {
          transform: scale(0);
          opacity: 0;
          pointer-events: none;
        }

        .ai-button-content {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-icon {
          font-size: 32px;
          z-index: 2;
        }

        .ai-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        .ai-tooltip {
          position: absolute;
          bottom: 100%;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          margin-bottom: 10px;
        }

        .ai-float-button:hover .ai-tooltip {
          opacity: 1;
        }

        .ai-chat-window {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 480px;
          height: 700px;
          max-height: calc(100vh - 40px);
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          transform: scale(0);
          opacity: 0;
          transform-origin: bottom right;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .ai-chat-window.open {
          transform: scale(1);
          opacity: 1;
        }

        @media (max-width: 640px) {
          .ai-chat-window {
            width: calc(100vw - 30px);
            height: calc(100vh - 100px);
            bottom: 10px;
            right: 15px;
            left: 15px;
          }
          
          .ai-chat-header {
            padding: 10px;
            border-radius: 20px 20px 0 0;
            gap: 8px;
          }
          
          .ai-header-right {
            gap: 6px;
          }
          
          .ai-close-btn {
            width: 32px;
            height: 32px;
            margin-right: 0;
            border-radius: 8px;
          }
          
          .ai-close-btn svg {
            width: 12px;
            height: 12px;
          }
          
          .ai-header-info h3 {
            font-size: 15px;
          }
          
          .ai-header-left {
            gap: 8px;
          }
          
          .ai-avatar-circle {
            width: 36px;
            height: 36px;
          }
          
          .ai-avatar-emoji {
            font-size: 20px;
          }
          
          .model-selector {
            gap: 4px;
          }
          
          .model-btn {
            padding: 6px 10px;
            font-size: 12px;
          }
          
          .ai-subtitle {
            display: none;
          }
        }

        .ai-chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: transparent;
        }

        .ai-chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 41, 59, 0.5);
          border-radius: 24px 24px 0 0;
        }

        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-avatar-circle {
          position: relative;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-avatar-emoji {
          font-size: 22px;
        }

        .ai-status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid #0f172a;
        }

        .ai-header-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: white;
        }

        .ai-subtitle {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #94a3b8;
        }

        .ai-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .model-selector {
          display: flex;
          gap: 8px;
        }

        .model-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #94a3b8;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .model-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: scale(1.05);
        }

        .model-btn.active {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          border-color: transparent;
          color: white;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .8;
          }
        }

        .model-icon {
          font-size: 16px;
        }

        .model-text {
          @media (max-width: 480px) {
            display: none;
          }
        }

        .ai-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .ai-close-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #ef4444;
          transform: scale(1.05);
        }
        
        .ai-close-btn svg {
          transition: transform 0.3s ease;
        }
        
        .ai-close-btn:hover svg {
          transform: rotate(90deg);
        }

        @media (max-width: 480px) {
          .ai-chat-window {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          
          .ai-header-right {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
          }
          
          .model-btn,
          .ai-close-btn {
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
            font-size: 16px !important;
            padding: 0 !important;
            margin: 0 !important;
            position: relative !important;
            top: auto !important;
            right: auto !important;
            z-index: auto !important;
          }
          
          .ai-close-btn {
            background: rgba(239, 68, 68, 0.1) !important;
            border-color: rgba(239, 68, 68, 0.2) !important;
          }
        }

        .ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scroll-behavior: smooth;
        }

        .ai-messages::-webkit-scrollbar {
          width: 6px;
        }

        .ai-messages::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .ai-messages::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .ai-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .ai-message {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          animation: messageSlide 0.3s ease;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ai-message.user {
          justify-content: flex-end;
        }

        .ai-message-avatar {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .ai-message.user .ai-message-avatar {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
        }

        .ai-message-content {
          max-width: 75%;
        }

        .ai-message-text {
          background: rgba(255, 255, 255, 0.05);
          padding: 14px 18px;
          border-radius: 20px;
          color: #e2e8f0;
          font-size: 15px;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .ai-message.user .ai-message-text {
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          color: white;
        }

        .ai-message-model {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 6px;
          padding-left: 18px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ai-typing {
          display: flex;
          gap: 4px;
          padding: 14px 18px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }

        .ai-typing span {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .ai-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .ai-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        .ai-quick-questions {
          padding: 16px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 41, 59, 0.3);
        }

        .ai-quick-questions p {
          margin: 0 0 10px 0;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
        }

        .ai-quick-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ai-quick-buttons button {
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: #e2e8f0;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ai-quick-buttons button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .ai-quick-buttons button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-input-area {
          display: flex;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(30, 41, 59, 0.3);
          border-radius: 0 0 24px 24px;
        }

        .ai-input-area input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 14px 20px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.2s ease;
        }

        .ai-input-area input:focus {
          border-color: rgba(96, 165, 250, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .ai-input-area input::placeholder {
          color: #64748b;
        }

        .ai-send-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-send-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(96, 165, 250, 0.3);
        }

        .ai-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}

export default memo(SmartFloatingAI);