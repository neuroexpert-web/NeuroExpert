'use client';
import { useState, useEffect, useRef } from 'react';
import './EnhancedFloatingAI.css';

export default function EnhancedFloatingAI() {
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
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [aiPersonality, setAiPersonality] = useState('strategic'); // strategic, technical, creative
  const [stats, setStats] = useState({
    totalQuestions: 0,
    avgResponseTime: 0,
    satisfaction: 89,
    successfulSolutions: 12
  });
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const aiAvatarRef = useRef(null);

  // Анимация аватара - дыхание AI
  useEffect(() => {
    const avatar = aiAvatarRef.current;
    if (!avatar) return;

    const breathe = () => {
      avatar.style.transform = 'scale(1.05)';
      setTimeout(() => {
        if (avatar) avatar.style.transform = 'scale(1)';
      }, 1000);
    };

    const interval = setInterval(breathe, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Сохранение истории
  useEffect(() => {
    if (messages && messages.length) {
      try {
        localStorage.setItem('ai_messages', JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Продвинутые быстрые действия
  const quickActions = [
    { 
      icon: '🚀', 
      text: 'Увеличить прибыль на 40%', 
      prompt: 'Как увеличить прибыль моей компании на 40% с помощью AI?',
      category: 'growth'
    },
    { 
      icon: '⚡', 
      text: 'Автоматизация процессов', 
      prompt: 'Какие процессы в моем бизнесе можно автоматизировать в первую очередь?',
      category: 'automation'
    },
    { 
      icon: '📊', 
      text: 'Аналитика и данные', 
      prompt: 'Как настроить аналитику для принятия data-driven решений?',
      category: 'analytics'
    },
    { 
      icon: '🎯', 
      text: 'ROI калькулятор', 
      prompt: 'Рассчитайте ROI от внедрения AI в мою компанию',
      category: 'roi'
    },
    { 
      icon: '🔗', 
      text: 'Интеграции CRM', 
      prompt: 'Как интегрировать AI с моей CRM системой?',
      category: 'integration'
    },
    { 
      icon: '🛡️', 
      text: 'Безопасность AI', 
      prompt: 'Как обеспечить безопасность при внедрении AI решений?',
      category: 'security'
    }
  ];

  // Персонализированное приветствие
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'day' : 'evening';
      
      const greetings = {
        morning: "🌅 Доброе утро! Я Александр Нейронов, ваш AI-помощник NeuroExpert. Готов помочь развивать ваш проект!",
        day: "⚡ Добрый день! Александр на связи. Как могу помочь с вашим бизнесом?",
        evening: "🌙 Добрый вечер! Работаю круглосуточно. О чём хотите поговорить?"
      };
      
      setTimeout(() => {
        typewriterEffect(greetings[timeOfDay], 'ai');
      }, 800);
    }
  }, [isOpen]);

  // Эффект печатной машинки
  const typewriterEffect = (text, sender) => {
    setIsTyping(true);
    let currentText = '';
    let i = 0;
    
    const typing = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].sender === sender && newMessages[newMessages.length - 1].isTyping) {
            newMessages[newMessages.length - 1].text = currentText;
          } else {
            newMessages.push({
              text: currentText,
              sender: sender,
              timestamp: new Date().toISOString(),
              isTyping: true
            });
          }
          return newMessages;
        });
        i++;
      } else {
        clearInterval(typing);
        setIsTyping(false);
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1].isTyping = false;
          }
          return newMessages;
        });
      }
    }, 30);
  };

  // Отправка сообщения
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    const userMessage = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const startTime = Date.now();
      
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          message: messageText,
          context: 'general',
          personality: aiPersonality,
          model: selectedModel === 'gpt' ? 'gemini' : selectedModel // GPT пока использует Gemini
        }),
      });

      const data = await response.json();
      const responseTime = Date.now() - startTime;

      // Обновляем статистику
      setStats(prev => ({
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        avgResponseTime: Math.round((prev.avgResponseTime + responseTime) / 2)
      }));

      if (data.success || data.reply) {
        setTimeout(() => {
          typewriterEffect(data.response || data.reply, 'ai');
        }, 500);
      } else {
        const fallbackMessage = "🤔 Извините, сейчас у меня технические сложности. Но я уже думаю над вашим вопросом! Попробуйте переформулировать или задать вопрос иначе.";
        setTimeout(() => {
          typewriterEffect(fallbackMessage, 'ai');
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = "⚠️ Упс! Похоже на сбой связи. Но не волнуйтесь - я быстро восстанавливаюсь! Попробуйте еще раз через минуту.";
      setTimeout(() => {
        typewriterEffect(errorMessage, 'ai');
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  // Быстрое действие
  const handleQuickAction = (action) => {
    setInput(action.prompt);
    
    // Имитируем отправку сообщения напрямую
    const userMessage = {
      text: action.prompt,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const startTime = Date.now();
        
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            message: action.prompt,
            context: 'general',
            personality: aiPersonality,
            model: selectedModel === 'gpt' ? 'gemini' : selectedModel // GPT пока использует Gemini
          }),
        });

        const data = await response.json();
        const responseTime = Date.now() - startTime;

        // Обновляем статистику
        setStats(prev => ({
          ...prev,
          totalQuestions: prev.totalQuestions + 1,
          avgResponseTime: Math.round((prev.avgResponseTime + responseTime) / 2)
        }));

        if (data.success || data.reply) {
          setTimeout(() => {
            typewriterEffect(data.response || data.reply, 'ai');
          }, 500);
        } else {
          const fallbackMessage = "🤔 Извините, сейчас у меня технические сложности. Но я уже думаю над вашим вопросом! Попробуйте переформулировать или задать вопрос иначе.";
          setTimeout(() => {
            typewriterEffect(fallbackMessage, 'ai');
          }, 500);
        }
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = "⚠️ Упс! Похоже на сбой связи. Но не волнуйтесь - я быстро восстанавливаюсь! Попробуйте еще раз через минуту.";
        setTimeout(() => {
          typewriterEffect(errorMessage, 'ai');
        }, 500);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  // AI Avatar компонент с крутыми эффектами
  const AIAvatar = ({ isActive, personality }) => {
    const [particles, setParticles] = useState([]);
    const [eyeGlow, setEyeGlow] = useState(false);

    useEffect(() => {
      if (isActive) {
        const interval = setInterval(() => {
          setEyeGlow(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
      }
    }, [isActive]);

    return (
      <div className={`ai-avatar-container ${isActive ? 'active' : ''}`} ref={aiAvatarRef}>
        {/* Энергетическое поле */}
        <div className="energy-field">
          <div className="energy-ring ring-1"></div>
          <div className="energy-ring ring-2"></div>
          <div className="energy-ring ring-3"></div>
        </div>
        
        {/* Основной аватар */}
        <div className={`ai-avatar personality-${personality}`}>
          {/* Голова */}
          <div className="ai-head">
            <div className="neural-mesh">
              <div className="mesh-line mesh-1"></div>
              <div className="mesh-line mesh-2"></div>
              <div className="mesh-line mesh-3"></div>
              <div className="mesh-line mesh-4"></div>
            </div>
            
            {/* Глаза */}
            <div className="ai-eyes">
              <div className={`ai-eye left ${eyeGlow ? 'glow' : ''}`}>
                <div className="pupil"></div>
                <div className="iris"></div>
              </div>
              <div className={`ai-eye right ${eyeGlow ? 'glow' : ''}`}>
                <div className="pupil"></div>
                <div className="iris"></div>
              </div>
            </div>
            
            {/* Центральный процессор */}
            <div className="central-processor">
              <div className="processor-core"></div>
              <div className="data-flow flow-1"></div>
              <div className="data-flow flow-2"></div>
              <div className="data-flow flow-3"></div>
            </div>
          </div>
          
          {/* Плечи/корпус */}
          <div className="ai-body">
            <div className="shoulder left"></div>
            <div className="shoulder right"></div>
            <div className="chest-panel">
              <div className="status-indicator"></div>
            </div>
          </div>
        </div>
        
        {/* Частицы данных */}
        <div className="data-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}></div>
          ))}
        </div>
        
        {/* Статус индикатор */}
        <div className="status-badge">
          <span className="status-dot"></span>
          <span className="status-text">Online</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Кнопка запуска чата */}
      <button 
        className={`ai-chat-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ bottom: position.y, right: position.x }}
      >
        <AIAvatar isActive={isOpen} personality={aiPersonality} />
        
        {/* Уведомление о новых возможностях */}
        {!isOpen && (
          <div className="notification-pulse">
            <span className="notification-text">AI v4.0</span>
          </div>
        )}
      </button>

      {/* Диалоговое окно */}
      {isOpen && (
        <div className="enhanced-ai-chat-container">
          {/* Заголовок с AI аватаром */}
          <div className="enhanced-chat-header">
            <div className="header-avatar">
              <AIAvatar isActive={true} personality={aiPersonality} />
            </div>
            <div className="header-info">
              <h3 className="ai-name">Александр Нейронов</h3>
              <p className="ai-title">AI-Помощник NeuroExpert v4.0</p>
              <div className="ai-stats">
                <span className="stat">
                  <span className="stat-icon">💼</span>
                  <span className="stat-value">{stats.successfulSolutions}+</span>
                  <span className="stat-label">решений</span>
                </span>
                <span className="stat">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-value">{stats.avgResponseTime}ms</span>
                  <span className="stat-label">ответ</span>
                </span>
                <span className="stat">
                  <span className="stat-icon">⭐</span>
                  <span className="stat-value">{stats.satisfaction}%</span>
                  <span className="stat-label">успех</span>
                </span>
              </div>
            </div>
            <div className="header-controls">
              {/* Выбор модели AI */}
              <div className="model-selector">
                <button 
                  className={`model-btn ${selectedModel === 'gemini' ? 'active' : ''}`}
                  onClick={() => setSelectedModel('gemini')}
                  title="Google Gemini"
                >
                  <span className="model-icon">G</span>
                  <span className="model-name">Gemini</span>
                </button>
                <button 
                  className={`model-btn ${selectedModel === 'claude' ? 'active' : ''}`}
                  onClick={() => setSelectedModel('claude')}
                  title="Anthropic Claude"
                >
                  <span className="model-icon">C</span>
                  <span className="model-name">Claude</span>
                </button>
                <button 
                  className={`model-btn ${selectedModel === 'gpt' ? 'active' : ''}`}
                  onClick={() => setSelectedModel('gpt')}
                  title="OpenAI GPT"
                >
                  <span className="model-icon">O</span>
                  <span className="model-name">GPT-4</span>
                </button>
              </div>

              {/* Переключатель персональности */}
              <div className="personality-selector">
                <button 
                  className={`personality-btn ${aiPersonality === 'strategic' ? 'active' : ''}`}
                  onClick={() => setAiPersonality('strategic')}
                  title="Стратегический режим"
                >
                  🎯
                </button>
                <button 
                  className={`personality-btn ${aiPersonality === 'technical' ? 'active' : ''}`}
                  onClick={() => setAiPersonality('technical')}
                  title="Технический режим"
                >
                  🔧
                </button>
                <button 
                  className={`personality-btn ${aiPersonality === 'creative' ? 'active' : ''}`}
                  onClick={() => setAiPersonality('creative')}
                  title="Креативный режим"
                >
                  💡
                </button>
              </div>
              
              <button 
                className="close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Закрыть чат"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Область сообщений */}
          <div className="enhanced-chat-messages" ref={messagesContainerRef}>
            {messages.length === 0 && (
              <div className="welcome-screen">
                <div className="welcome-avatar">
                  <AIAvatar isActive={true} personality={aiPersonality} />
                </div>
                <h3>Добро пожаловать в NeuroExpert AI v4.0!</h3>
                <p>Готов трансформировать ваш бизнес с помощью искусственного интеллекта</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`message-wrapper ${message.sender}`}>
                {message.sender === 'ai' && (
                  <div className="message-avatar">
                    <AIAvatar isActive={message.isTyping} personality={aiPersonality} />
                  </div>
                )}
                <div className={`message ${message.sender} ${message.isTyping ? 'typing' : ''}`}>
                  <div className="message-content">
                    {message.text}
                    {message.isTyping && <span className="typing-cursor">|</span>}
                  </div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message-wrapper ai">
                <div className="message-avatar">
                  <AIAvatar isActive={true} personality={aiPersonality} />
                </div>
                <div className="message ai typing">
                  <div className="thinking-animation">
                    <div className="thinking-dot"></div>
                    <div className="thinking-dot"></div>
                    <div className="thinking-dot"></div>
                  </div>
                  <span className="thinking-text">Обрабатываю ваш запрос...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Быстрые действия */}
          {messages.length === 0 && (
            <div className="quick-actions-panel">
              <h4>Чем могу помочь сегодня?</h4>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`quick-action-btn category-${action.category}`}
                    onClick={() => handleQuickAction(action)}
                  >
                    <span className="action-icon">{action.icon}</span>
                    <span className="action-text">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Поле ввода */}
          <div className="enhanced-chat-input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Опишите ваш бизнес-вызов или задайте вопрос..."
                className="enhanced-chat-input"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="send-btn"
                aria-label="Отправить сообщение"
              >
                <span className="send-icon">🚀</span>
              </button>
            </div>
            
            {/* Индикатор печатания */}
            {isTyping && (
              <div className="ai-typing-indicator">
                <AIAvatar isActive={true} personality={aiPersonality} />
                <span>Александр печатает...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}