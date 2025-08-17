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
  const recognitionRef = useRef(null);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return phone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Пожалуйста, заполните обязательные поля'
      });
      return;
    }

    setStatus({ loading: true, success: false, error: false, message: '' });

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: formatPhone(formData.phone)
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: 'Спасибо! Мы свяжемся с вами в течение 15 минут.'
        });

        setFormData({
          name: '',
          phone: '',
          email: '',
          company: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Произошла ошибка');
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: error.message || 'Произошла ошибка при отправке формы'
      });
    }
  };

  const inputStyle = {
    width: '100%',
    padding: isMobile ? '18px' : '16px',
    paddingRight: '60px',
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: isMobile ? '16px' : '12px',
    color: 'white',
    fontSize: isMobile ? '17px' : '16px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  return (
    <section className="contact-form-section py-20 px-4" id="contact">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Начните цифровизацию сегодня
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Оставьте заявку и получите бесплатную консультацию
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: 'rgba(20, 20, 40, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: isMobile ? '24px' : '32px',
            padding: isMobile ? '24px' : '48px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(102, 126, 234, 0.2)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Имя */}
            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }} style={{ position: 'relative' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc', fontSize: isMobile ? '14px' : '13px' }}>
                Ваше имя *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Например: Иван Иванов"
                  style={inputStyle}
                  inputMode="text"
                  onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                />
                <motion.button
                  type="button"
                  onClick={() => startListening('name')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isListening && activeField === 'name' ? {
                    scale: [1, 1.15, 1],
                    backgroundColor: ['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.35)', 'rgba(102, 126, 234, 0.2)']
                  } : {}}
                  transition={{ duration: 1.2, repeat: isListening && activeField === 'name' ? Infinity : 0 }}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    width: isMobile ? '44px' : '40px', height: isMobile ? '44px' : '40px', borderRadius: '50%',
                    background: 'rgba(102, 126, 234, 0.2)', border: '1px solid rgba(102, 126, 234, 0.4)',
                    color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  🎤
                </motion.button>
              </div>
            </motion.div>

            {/* Телефон */}
            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }} style={{ position: 'relative' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc', fontSize: isMobile ? '14px' : '13px' }}>
                Телефон *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (996) 009-63-34"
                  style={inputStyle}
                  inputMode="tel"
                  onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                />
                <motion.button
                  type="button"
                  onClick={() => startListening('phone')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isListening && activeField === 'phone' ? {
                    scale: [1, 1.15, 1],
                    backgroundColor: ['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.35)', 'rgba(102, 126, 234, 0.2)']
                  } : {}}
                  transition={{ duration: 1.2, repeat: isListening && activeField === 'phone' ? Infinity : 0 }}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    width: isMobile ? '44px' : '40px', height: isMobile ? '44px' : '40px', borderRadius: '50%',
                    background: 'rgba(102, 126, 234, 0.2)', border: '1px solid rgba(102, 126, 234, 0.4)',
                    color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  🎤
                </motion.button>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
              <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc', fontSize: isMobile ? '14px' : '13px' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@company.ru"
                style={inputStyle}
                inputMode="email"
                onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
              />
            </motion.div>

            {/* Компания */}
            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
              <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc', fontSize: isMobile ? '14px' : '13px' }}>
                Компания
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Название вашей компании"
                style={inputStyle}
                inputMode="text"
                onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
              />
            </motion.div>

            {/* Сообщение */}
            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }} style={{ position: 'relative' }}>
              <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc', fontSize: isMobile ? '14px' : '13px' }}>
                Сообщение
              </label>
              <div style={{ position: 'relative' }}>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Расскажите о вашем проекте..."
                  rows={isMobile ? 5 : 4}
                  style={{ ...inputStyle, resize: 'none', paddingTop: isMobile ? '18px' : '16px' }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                />
                <motion.button
                  type="button"
                  onClick={() => startListening('message')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isListening && activeField === 'message' ? {
                    scale: [1, 1.15, 1],
                    backgroundColor: ['rgba(102, 126, 234, 0.2)', 'rgba(102, 126, 234, 0.35)', 'rgba(102, 126, 234, 0.2)']
                  } : {}}
                  transition={{ duration: 1.2, repeat: isListening && activeField === 'message' ? Infinity : 0 }}
                  style={{
                    position: 'absolute', right: '12px', top: '12px',
                    width: isMobile ? '44px' : '40px', height: isMobile ? '44px' : '40px', borderRadius: '50%',
                    background: 'rgba(102, 126, 234, 0.2)', border: '1px solid rgba(102, 126, 234, 0.4)',
                    color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
                    padding: isMobile ? '18px' : '16px', borderRadius: isMobile ? '16px' : '12px', textAlign: 'center',
                    background: status.success ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${status.success ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
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
              disabled={status.loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{ boxShadow: ['0 0 20px rgba(102, 126, 234, 0.4)', '0 0 40px rgba(118, 75, 162, 0.6)', '0 0 20px rgba(102, 126, 234, 0.4)'] }}
              transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
              style={{
                width: '100%', padding: isMobile ? '20px' : '18px',
                background: status.loading ? 'rgba(102, 126, 234, 0.5)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none', borderRadius: '50px', color: 'white', fontSize: isMobile ? '18px' : '18px', fontWeight: '700',
                cursor: status.loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
              }}
            >
              {status.loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    ⏳
                  </motion.div>
                  Отправка...
                </>
              ) : (
                <>
                  Отправить заявку
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    →
                  </motion.span>
                </>
              )}
            </motion.button>

            {/* Подсказка о голосовом вводе */}
            {recognitionRef.current && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-sm mt-4" style={{ color: '#a0a9cc' }}>
                💡 Нажмите на микрофон 🎤 для голосового ввода
              </motion.p>
            )}
          </form>
        </motion.div>

        {/* Дополнительная информация */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 text-center">
          <p style={{ color: '#a0a9cc', marginBottom: '16px' }}>
            Или свяжитесь с нами напрямую:
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <motion.a href="tel:+79960096334" whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667eea', textDecoration: 'none' }}>
              📞 +7 (996) 009-63-34
            </motion.a>
            <motion.a href="mailto:neuroexpertai@gmail.com" whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667eea', textDecoration: 'none' }}>
              ✉️ neuroexpertai@gmail.com
            </motion.a>
            <motion.button onClick={() => { const event = new CustomEvent('openAIChat'); window.dispatchEvent(event); }} whileHover={{ scale: 1.05 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
              💬 Чат с AI директором
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}