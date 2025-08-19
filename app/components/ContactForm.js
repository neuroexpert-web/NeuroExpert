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

  const [isMobile, setIsMobile] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);

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
    
    // Предотвращаем зум на iOS при фокусе на input
    if (isMobile) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
      }
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      // Возвращаем viewport в исходное состояние
      if (isMobile) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1');
        }
      }
    };
  }, [isMobile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false, message: '' });

    try {
      const response = await fetch('/.netlify/functions/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          company: '',
          message: ''
        });
      } else {
        throw new Error(data.error || 'Ошибка при отправке формы');
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: error.message || 'Произошла ошибка. Попробуйте позже.'
      });
    }

    // Очистка статуса через 5 секунд
    setTimeout(() => {
      setStatus({ loading: false, success: false, error: false, message: '' });
    }, 5000);
  };

  return (
    <motion.div 
      className={`contact-form-container ${isMobile && isFormFocused ? 'mobile-focused' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <style jsx>{`
        .contact-form-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        /* Увеличенная ширина формы */
        .contact-form {
          background: var(--dark-card);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid var(--dark-border);
          max-width: 100%;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .form-group {
          position: relative;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
        }
        
        input,
        textarea {
          width: 100%;
          padding: ${isMobile ? '16px' : '14px'} 20px;
          background: var(--dark-bg);
          border: 2px solid var(--dark-border);
          border-radius: ${isMobile ? '16px' : '12px'};
          color: var(--text-primary);
          font-size: ${isMobile ? '18px' : '16px'};
          transition: all 0.3s ease;
          -webkit-appearance: none;
        }
        
        input::placeholder,
        textarea::placeholder {
          color: var(--text-muted);
        }
        
        input:focus,
        textarea:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        textarea {
          resize: vertical;
          min-height: ${isMobile ? '140px' : '120px'};
          max-height: 300px;
          font-family: inherit;
        }
        
        .submit-btn {
          width: 100%;
          padding: ${isMobile ? '18px' : '16px'} 32px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: ${isMobile ? '16px' : '12px'};
          font-size: ${isMobile ? '18px' : '16px'};
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-height: ${isMobile ? '60px' : '52px'};
          margin-top: ${isMobile ? '24px' : '16px'};
          box-shadow: ${isMobile ? '0 6px 20px rgba(99, 102, 241, 0.3)' : '0 4px 16px rgba(99, 102, 241, 0.2)'};
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(99, 102, 241, 0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .status-message {
          margin-top: 16px;
          padding: 12px 20px;
          border-radius: 8px;
          text-align: center;
          font-size: 14px;
          animation: slideUp 0.3s ease;
        }
        
        .status-message.success {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .status-message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Адаптация для мобильных */
        @media (max-width: 768px) {
          .contact-form-container {
            padding: 20px 16px;
          }
          
          .contact-form {
            padding: 24px 20px;
            border-radius: 20px;
          }
          
          .form-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          input,
          textarea {
            font-size: 18px;
            padding: 16px;
            border-radius: 16px;
          }
          
          .submit-btn {
            font-size: 18px;
            padding: 18px;
            border-radius: 16px;
          }
        }
        
        /* Режим фокуса для мобильных */
        .mobile-focused {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          background: var(--dark-bg);
          padding: 20px;
          overflow-y: auto;
        }
        
        .mobile-focused .contact-form {
          margin-top: 20px;
          box-shadow: none;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="contact-form">
        <h3 style={{ 
          fontSize: isMobile ? '24px' : '28px', 
          marginBottom: '32px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Оставьте заявку на консультацию
        </h3>

        <div className="form-row">
          <motion.div 
            className="form-group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <label htmlFor="name">Ваше имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Иван Иванов"
              required
              style={{
                width: isMobile ? '100%' : 'calc(100% - 40px)'
              }}
            />
          </motion.div>

          <motion.div 
            className="form-group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-45-67"
              required
              style={{
                width: isMobile ? '100%' : 'calc(100% - 40px)'
              }}
            />
          </motion.div>
        </div>

        <div className="form-row">
          <motion.div 
            className="form-group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.ru"
            />
          </motion.div>

          <motion.div 
            className="form-group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <label htmlFor="company">Компания</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Название компании"
            />
          </motion.div>
        </div>

        <motion.div 
          className="form-group"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <label htmlFor="message">Сообщение</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Расскажите о вашем проекте..."
            rows={4}
            style={{
              width: isMobile ? '100%' : 'calc(100% - 40px)'
            }}
          />
        </motion.div>

        <motion.button
          type="submit"
          className="submit-btn"
          disabled={status.loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {status.loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Отправка...
              </motion.span>
            ) : (
              <motion.span
                key="submit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Отправить заявку
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {status.message && (
            <motion.div
              className={`status-message ${status.success ? 'success' : 'error'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}