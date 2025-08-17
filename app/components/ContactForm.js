'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: ''
  });

  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Определяем мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Обработка фокуса для мобильных
    const handleFocus = () => setIsFormFocused(true);
    const handleBlur = (e) => {
      // Проверяем, что фокус ушел за пределы формы
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setTimeout(() => setIsFormFocused(false), 200);
      }
    };
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Инициализация Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'ru-RU';

      recognition.onstart = () => {
        console.log('Голосовой ввод начат');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (activeField) {
          setFormData(prev => ({
            ...prev,
            [activeField]: activeField === 'phone' ? transcript.replace(/\s/g, '') : transcript
          }));
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Ошибка распознавания:', event.error);
        setIsListening(false);
        
        // Показываем ошибку пользователю
        let errorMessage = 'Ошибка распознавания речи';
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'Речь не обнаружена. Попробуйте ещё раз.';
            break;
          case 'not-allowed':
            errorMessage = 'Доступ к микрофону запрещён. Разрешите доступ в настройках браузера.';
            break;
          case 'network':
            errorMessage = 'Ошибка сети. Проверьте интернет-соединение.';
            break;
        }
        
        setStatus({
          loading: false,
          success: false,
          error: true,
          message: errorMessage
        });
        
        // Очищаем сообщение через 5 секунд
        setTimeout(() => {
          setStatus({ loading: false, success: false, error: false, message: '' });
        }, 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

        recognitionRef.current = recognition;
      }
    }
  }, [activeField]);

  const startListening = (fieldName) => {
    if (recognitionRef.current && !isListening) {
      setActiveField(fieldName);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false, message: '' });

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: result.message || 'Заявка успешно отправлена!'
        });
        setFormData({ name: '', phone: '', email: '', company: '', message: '' });
      } else {
        throw new Error(result.error || 'Ошибка отправки');
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: error.message || 'Ошибка отправки. Попробуйте позже.'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section 
      id="contact" 
      className={`contact-section ${isMobile && isFormFocused ? 'mobile-focused' : ''}`}
      style={{
        padding: isMobile ? '40px 16px' : '80px 20px',
        background: '#0b0f17',
        minHeight: isMobile && isFormFocused ? '100vh' : 'auto',
        position: 'relative'
      }}
    >
      <style jsx>{`
        .contact-section {
          transition: all 0.3s ease;
        }
        
        .contact-section.mobile-focused {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          overflow-y: auto;
          background: rgba(11, 15, 23, 0.98);
          backdrop-filter: blur(20px);
        }
        
        .mobile-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }
        
        .form-container {
          transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .contact-section {
            padding: 20px 16px !important;
          }
          
          .form-container {
            padding: 24px 16px !important;
            margin: 0 !important;
          }
          
          input, textarea {
            font-size: 16px !important;
            padding: 16px !important;
          }
          
          .mobile-focused .form-container {
            max-width: 100% !important;
            width: 100% !important;
            padding: 32px 20px !important;
            margin-top: 60px !important;
          }
          
          .mobile-focused input,
          .mobile-focused textarea {
            font-size: 16px !important;
            padding: 20px !important;
            height: 56px !important;
          }
          
          .mobile-focused textarea {
            height: 120px !important;
            min-height: 120px !important;
          }
          
          .mobile-focused .form-field {
            margin-bottom: 20px !important;
          }
          
          .mobile-focused .voice-btn {
            width: 48px !important;
            height: 48px !important;
            font-size: 24px !important;
          }
          
          .mobile-focused .submit-btn {
            height: 60px !important;
            font-size: 18px !important;
            margin-top: 24px !important;
          }
          
          .contact-info {
            display: none;
          }
          
          .mobile-focused .contact-info {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="container mx-auto">
        {/* Кнопка закрытия для мобильной версии */}
        {isMobile && isFormFocused && (
          <motion.button
            className="mobile-close-btn"
            onClick={() => setIsFormFocused(false)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            ✕
          </motion.button>
        )}
        
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          style={{ display: isMobile && isFormFocused ? 'none' : 'block' }}
        >
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            Начните трансформацию
          </h2>
          <p style={{ fontSize: '20px', color: '#a0a9cc' }}>
            Оставьте заявку и получите персональную консультацию
          </p>
        </motion.div>

        {/* Форма */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="form-container"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(102, 126, 234, 0.3)'
          }}
        >
          <form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            onFocus={() => isMobile && setIsFormFocused(true)}
          >
            {/* Поле Имя */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="form-field"
            >
              <label 
                htmlFor="name" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#e0e7ff',
                  fontWeight: '600'
                }}
              >
                Ваше имя
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Александр"
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingRight: '60px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.8)';
                    e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                  }}
                />
                <motion.button
                  type="button"
                  className="voice-btn"
                  onClick={() => startListening('name')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isListening && activeField === 'name' ? {
                    scale: [1, 1.2, 1],
                    backgroundColor: ['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.4)', 'rgba(102, 126, 234, 0.2)']
                  } : {}}
                  transition={{ duration: 1, repeat: isListening && activeField === 'name' ? Infinity : 0 }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(102, 126, 234, 0.2)',
                    border: '1px solid rgba(102, 126, 234, 0.4)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  🎤
                </motion.button>
              </div>
            </motion.div>

            {/* Поле Телефон */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="form-field"
            >
              <label 
                htmlFor="phone" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#e0e7ff',
                  fontWeight: '600'
                }}
              >
                Телефон
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+7 (999) 123-45-67"
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingRight: '60px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.8)';
                    e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                  }}
                />
                <motion.button
                  type="button"
                  className="voice-btn"
                  onClick={() => startListening('phone')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isListening && activeField === 'phone' ? {
                    scale: [1, 1.2, 1],
                    backgroundColor: ['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.4)', 'rgba(102, 126, 234, 0.2)']
                  } : {}}
                  transition={{ duration: 1, repeat: isListening && activeField === 'phone' ? Infinity : 0 }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(102, 126, 234, 0.2)',
                    border: '1px solid rgba(102, 126, 234, 0.4)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  🎤
                </motion.button>
              </div>
            </motion.div>

            {/* Поле Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="form-field"
            >
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#e0e7ff',
                  fontWeight: '600'
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="alex@company.ru"
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'rgba(17, 24, 39, 0.5)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.8)';
                  e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                  e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                }}
              />
            </motion.div>

            {/* Поле Компания */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="form-field"
            >
              <label 
                htmlFor="company" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#e0e7ff',
                  fontWeight: '600'
                }}
              >
                Компания (необязательно)
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="ООО Рога и Копыта"
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'rgba(17, 24, 39, 0.5)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.8)';
                  e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                  e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                }}
              />
            </motion.div>

            {/* Поле Сообщение */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="form-field"
            >
              <label 
                htmlFor="message" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#e0e7ff',
                  fontWeight: '600'
                }}
              >
                Сообщение
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Расскажите о вашем проекте..."
                  style={{
                    width: '100%',
                    padding: '16px',
                    paddingRight: '60px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.8)';
                    e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                    e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                  }}
                />
                <motion.button
                  type="button"
                  className="voice-btn"
                  onClick={() => startListening('message')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isListening && activeField === 'message' ? {
                    scale: [1, 1.2, 1],
                    backgroundColor: ['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.4)', 'rgba(102, 126, 234, 0.2)']
                  } : {}}
                  transition={{ duration: 1, repeat: isListening && activeField === 'message' ? Infinity : 0 }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(102, 126, 234, 0.2)',
                    border: '1px solid rgba(102, 126, 234, 0.4)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  🎤
                </motion.button>
              </div>
            </motion.div>

            {/* Статус сообщения */}
            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    background: status.success 
                      ? 'rgba(34, 197, 94, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${status.success 
                      ? 'rgba(34, 197, 94, 0.3)'
                      : 'rgba(239, 68, 68, 0.3)'}`,
                    color: status.success ? '#22c55e' : '#ef4444'
                  }}
                >
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Кнопка отправки */}
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={status.loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(102, 126, 234, 0.4)',
                  '0 0 40px rgba(118, 75, 162, 0.6)',
                  '0 0 20px rgba(102, 126, 234, 0.4)'
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity
                }
              }}
              style={{
                width: '100%',
                padding: '18px',
                background: status.loading 
                  ? 'rgba(102, 126, 234, 0.5)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                cursor: status.loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              {status.loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.div>
                  Отправка...
                </>
              ) : (
                <>
                  Отправить заявку
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </motion.button>

            {/* Подсказка о голосовом вводе */}
            {recognitionRef.current && !isMobile && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-sm mt-4"
                style={{ color: '#a0a9cc' }}
              >
                💡 Нажмите на микрофон 🎤 для голосового ввода
              </motion.p>
            )}
          </form>
        </motion.div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="contact-info mt-12 text-center"
          style={{ display: isMobile && isFormFocused ? 'none' : 'block' }}
        >
          <p style={{ color: '#a0a9cc', marginBottom: '16px' }}>
            Или свяжитесь с нами напрямую:
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <motion.a
              href="tel:+79960096334"
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#667eea',
                textDecoration: 'none'
              }}
            >
              📞 +7 (996) 009-63-34
            </motion.a>
            <motion.a
              href="mailto:neuroexpertai@gmail.com"
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#667eea',
                textDecoration: 'none'
              }}
            >
              ✉️ neuroexpertai@gmail.com
            </motion.a>
            <motion.button
              onClick={() => {
                import('@/app/utils/aiChat').then(({ openAIChat, AI_CHAT_MESSAGES }) => {
                  openAIChat(AI_CHAT_MESSAGES.CONTACT_SUPPORT);
                });
              }}
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#667eea',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              💬 Чат с AI директором
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}