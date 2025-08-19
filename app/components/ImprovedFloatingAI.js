'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImprovedFloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const buttonRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Показываем подсказку при первом посещении
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('ai_tooltip_seen');
    if (!hasSeenTooltip) {
      setTimeout(() => {
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('ai_tooltip_seen', 'true');
        }, 5000);
      }, 3000);
    } else {
      setShowTooltip(false);
    }
  }, []);

  // Автоматическое приветствие через 10 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && messages.length === 0) {
        setHasNewMessage(true);
        setUnreadCount(1);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Перетаскивание кнопки
  const handleDragStart = (e) => {
    if (isOpen) return;
    setIsDragging(true);
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    dragStartPos.current = {
      x: clientX - buttonPosition.x,
      y: clientY - buttonPosition.y
    };
  };

  const handleDragMove = (e) => {
    if (!isDragging || isOpen) return;
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    
    const newX = clientX - dragStartPos.current.x;
    const newY = clientY - dragStartPos.current.y;
    
    // Ограничиваем движение в пределах экрана
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;
    
    setButtonPosition({
      x: Math.max(20, Math.min(newX, maxX)),
      y: Math.max(20, Math.min(newY, maxY))
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Прилипание к краям
    const centerX = buttonPosition.x + 40;
    const screenCenterX = window.innerWidth / 2;
    
    setButtonPosition(prev => ({
      ...prev,
      x: centerX < screenCenterX ? 20 : window.innerWidth - 80
    }));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove);
      document.addEventListener('touchend', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
    setUnreadCount(0);
    setShowTooltip(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    
    // Симуляция ответа AI
    setTimeout(() => {
      const aiResponse = {
        type: 'assistant',
        text: 'Спасибо за ваш вопрос! Я анализирую информацию и подготовлю для вас персональное решение. Это демо-версия ответа.'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {/* Главная кнопка */}
      <motion.button
        ref={buttonRef}
        className="ai-float-button"
        style={{
          position: 'fixed',
          bottom: `${buttonPosition.y}px`,
          right: `${buttonPosition.x}px`,
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: 'none',
          cursor: isDragging ? 'grabbing' : 'pointer',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          overflow: 'visible',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        onClick={!isDragging ? handleOpen : undefined}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          rotate: isOpen ? 180 : 0
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Иконка */}
        <motion.div
          animate={{
            rotate: hasNewMessage ? [0, -10, 10, -10, 10, 0] : 0
          }}
          transition={{
            duration: 0.5,
            repeat: hasNewMessage ? Infinity : 0,
            repeatDelay: 3
          }}
        >
          {isOpen ? '✕' : '🤖'}
        </motion.div>
        
        {/* Индикатор новых сообщений */}
        <AnimatePresence>
          {unreadCount > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#ef4444',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
              }}
            >
              {unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Пульсирующий эффект */}
        {hasNewMessage && !isOpen && (
          <>
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgba(102, 126, 234, 0.3)',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgba(102, 126, 234, 0.3)',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: [1, 1.3, 1.3],
                opacity: [0.5, 0, 0]
              }}
              transition={{
                duration: 2,
                delay: 0.5,
                repeat: Infinity
              }}
            />
          </>
        )}
        
        {/* Индикатор печатания */}
        {isTyping && isOpen && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '4px',
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '6px 10px',
              borderRadius: '12px'
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'white'
                }}
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  repeat: Infinity
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.button>
      
      {/* Подсказка */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
              position: 'fixed',
              bottom: `${buttonPosition.y + 15}px`,
              right: `${buttonPosition.x + 80}px`,
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              whiteSpace: 'nowrap',
              zIndex: 9998,
              maxWidth: '250px'
            }}
          >
            👋 Привет! Я ваш AI-помощник. Нажмите, чтобы начать!
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-6px',
                transform: 'translateY(-50%)',
                width: '0',
                height: '0',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: '6px solid rgba(0, 0, 0, 0.9)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Окно чата */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: `${buttonPosition.y + 90}px`,
              right: `${buttonPosition.x}px`,
              width: '380px',
              maxWidth: 'calc(100vw - 40px)',
              height: isMinimized ? 'auto' : '600px',
              maxHeight: 'calc(100vh - 140px)',
              background: 'rgba(20, 20, 40, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9998
            }}
          >
            {/* Заголовок чата */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
              background: 'rgba(102, 126, 234, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🤖
                </div>
                <div>
                  <div style={{ color: '#e0e7ff', fontWeight: '600' }}>AI Управляющий</div>
                  <div style={{ color: '#a0a9cc', fontSize: '12px' }}>
                    {isTyping ? 'Печатает...' : 'Онлайн'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isMinimized ? '⬆' : '⬇'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            
            {!isMinimized && (
              <>
                {/* Сообщения */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {messages.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      color: '#a0a9cc',
                      padding: '40px 20px'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                        Добро пожаловать!
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        Я помогу вам с любыми вопросами по автоматизации и развитию бизнеса
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          padding: '12px 16px',
                          borderRadius: '16px',
                          background: msg.type === 'user' 
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                            : 'rgba(255, 255, 255, 0.1)',
                          color: 'white'
                        }}
                      >
                        {msg.text}
                      </motion.div>
                    ))
                  )}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '12px 16px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        gap: '6px'
                      }}
                    >
                      <div className="typing-dot" />
                      <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                      <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                    </motion.div>
                  )}
                </div>
                
                {/* Быстрые действия */}
                <div style={{
                  padding: '12px 20px',
                  borderTop: '1px solid rgba(102, 126, 234, 0.2)',
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto'
                }}>
                  {['ROI калькулятор', 'Консультация', 'Примеры работ'].map((action) => (
                    <button
                      key={action}
                      onClick={() => setInput(action)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: '#e0e7ff',
                        fontSize: '14px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
                
                {/* Поле ввода */}
                <div style={{
                  padding: '20px',
                  borderTop: '1px solid rgba(102, 126, 234, 0.2)',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Напишите ваш вопрос..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      background: 'rgba(17, 24, 39, 0.5)',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: input.trim() && !isLoading
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'rgba(102, 126, 234, 0.3)',
                      color: 'white',
                      cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    {isLoading ? '...' : '→'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          animation: typing 1.4s infinite;
        }
        
        @keyframes typing {
          0%, 60%, 100% {
            opacity: 0.2;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}