'use client';
import { useState, useEffect, useRef } from 'react';

export default function SmartFloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: 'Привет! Я AI-помощник NeuroExpert. Как я могу помочь вам с цифровизацией бизнеса?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "Сколько стоит цифровизация?",
    "Какой ROI я получу?",
    "Сколько времени займет?",
    "С чего начать?"
  ];

  const typewriterEffect = (text, callback) => {
    let i = 0;
    setIsTyping(true);
    const tempMessage = { type: 'assistant', text: '' };
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

  const sendMessage = async (message = input) => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      });

      const data = await response.json();
      
      if (response.ok) {
        typewriterEffect(data.answer);
      } else {
        setMessages(prev => [...prev, {
          type: 'assistant',
          text: '⚠️ Извините, произошла ошибка. Попробуйте позже или позвоните нам: +7 (800) 555-35-35'
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: '⚠️ Проблема с подключением. Проверьте интернет-соединение.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
        <div className="ai-header">
          <div className="ai-header-info">
            <div className="ai-avatar">
              <span>🤖</span>
              <div className="ai-status"></div>
            </div>
            <div className="ai-header-text">
              <h3>AI Помощник</h3>
              <p>Онлайн • Отвечает мгновенно</p>
            </div>
          </div>
          <button
            className="ai-close"
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть чат"
          >
            ✕
          </button>
        </div>

        <div className="ai-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message ${msg.type}`}>
              {msg.type === 'assistant' && (
                <div className="ai-message-avatar">🤖</div>
              )}
              <div className="ai-message-content">
                <div className="ai-message-text">{msg.text}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="ai-quick-questions">
            <p>Популярные вопросы:</p>
            <div className="ai-quick-buttons">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
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
            onKeyPress={handleKeyPress}
            placeholder="Введите ваш вопрос..."
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="ai-send-button"
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .ai-float-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
        }

        .ai-float-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(79, 70, 229, 0.6);
        }

        .ai-float-button.hidden {
          transform: scale(0);
          opacity: 0;
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
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .ai-tooltip {
          position: absolute;
          bottom: 100%;
          right: 0;
          background: #1e293b;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .ai-float-button:hover .ai-tooltip {
          opacity: 1;
          transform: translateY(-10px);
        }

        .ai-chat-window {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 380px;
          height: 600px;
          background: #0f172a;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          transform: scale(0);
          opacity: 0;
          transform-origin: bottom right;
          transition: all 0.3s ease;
          z-index: 1001;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ai-chat-window.open {
          transform: scale(1);
          opacity: 1;
        }

        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border-radius: 20px 20px 0 0;
        }

        .ai-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ai-avatar {
          position: relative;
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .ai-status {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid #0f172a;
        }

        .ai-header-text h3 {
          margin: 0;
          font-size: 18px;
          color: white;
        }

        .ai-header-text p {
          margin: 0;
          font-size: 12px;
          color: #94a3b8;
        }

        .ai-close {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 24px;
          cursor: pointer;
          transition: color 0.3s ease;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-close:hover {
          color: white;
        }

        .ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ai-message {
          display: flex;
          gap: 12px;
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
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .ai-message-content {
          max-width: 70%;
        }

        .ai-message-text {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          border-radius: 18px;
          color: white;
          font-size: 14px;
          line-height: 1.5;
        }

        .ai-message.user .ai-message-text {
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
        }

        .ai-typing {
          display: flex;
          gap: 4px;
          padding: 0 20px;
        }

        .ai-typing span {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .ai-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .ai-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .ai-quick-questions {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ai-quick-questions p {
          margin: 0 0 12px 0;
          color: #94a3b8;
          font-size: 14px;
        }

        .ai-quick-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ai-quick-buttons button {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          color: white;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .ai-quick-buttons button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
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
        }

        .ai-input-area input {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          padding: 12px 20px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .ai-input-area input:focus {
          border-color: #4f46e5;
          background: rgba(255, 255, 255, 0.15);
        }

        .ai-input-area input::placeholder {
          color: #94a3b8;
        }

        .ai-send-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-send-button:hover:not(:disabled) {
          transform: scale(1.1);
        }

        .ai-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .ai-chat-window {
            width: calc(100vw - 20px);
            height: calc(100vh - 100px);
            right: 10px;
            bottom: 10px;
          }
        }
      `}</style>
    </>
  );
}