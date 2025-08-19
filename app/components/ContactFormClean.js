'use client';
import { useState, useEffect } from 'react';
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
    
    // Предотвращаем зум на iOS при фокусе на input
    if (isMobile) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
      }
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

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
          message: 'Спасибо! Мы свяжемся с вами в ближайшее время.'
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          company: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Ошибка отправки');
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Произошла ошибка. Попробуйте позже.'
      });
    }

    setTimeout(() => {
      setStatus({ loading: false, success: false, error: false, message: '' });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section 
      id="contact" 
      className="contact-section"
      style={{
        minHeight: '100vh',
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #0b0f17 0%, #1a1f2e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Фоновые декоративные элементы */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />

      <div className="contact-container">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
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
            maxWidth: '900px',
            margin: '0 auto',
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(102, 126, 234, 0.3)'
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Сетка полей 2 колонки */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '24px',
              marginBottom: '24px'
            }}>
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
                    padding: isMobile ? '20px' : '16px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: isMobile ? '16px' : '12px',
                    color: 'white',
                    fontSize: isMobile ? '18px' : '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none'
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

              {/* Поле Телефон */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
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
                    padding: isMobile ? '20px' : '16px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: isMobile ? '16px' : '12px',
                    color: 'white',
                    fontSize: isMobile ? '18px' : '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none'
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
                  placeholder="example@mail.com"
                  style={{
                    width: '100%',
                    padding: isMobile ? '20px' : '16px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: isMobile ? '16px' : '12px',
                    color: 'white',
                    fontSize: isMobile ? '18px' : '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none'
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
                initial={{ opacity: 0, x: 20 }}
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
                  Компания
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Название компании"
                  style={{
                    width: '100%',
                    padding: isMobile ? '20px' : '16px',
                    background: 'rgba(17, 24, 39, 0.5)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: isMobile ? '16px' : '12px',
                    color: 'white',
                    fontSize: isMobile ? '18px' : '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none'
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
            </div>

            {/* Поле Сообщение на всю ширину */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="form-field"
              style={{ marginBottom: '32px' }}
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
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={isMobile ? "5" : "4"}
                placeholder="Расскажите о вашем проекте..."
                style={{
                  width: '100%',
                  padding: isMobile ? '20px' : '16px',
                  background: 'rgba(17, 24, 39, 0.5)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: isMobile ? '16px' : '12px',
                  color: 'white',
                  fontSize: isMobile ? '18px' : '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  minHeight: isMobile ? '120px' : '100px',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none'
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

            {/* Статус сообщения */}
            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="form-status"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    textAlign: 'center',
                    fontWeight: '600',
                    background: status.success 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    border: status.success 
                      ? '1px solid rgba(16, 185, 129, 0.3)' 
                      : '1px solid rgba(239, 68, 68, 0.3)',
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
                padding: isMobile ? '22px' : '18px',
                background: status.loading 
                  ? 'rgba(102, 126, 234, 0.5)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: isMobile ? '16px' : '50px',
                color: 'white',
                fontSize: isMobile ? '18px' : '18px',
                fontWeight: '700',
                cursor: status.loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                minHeight: isMobile ? '60px' : 'auto',
                marginTop: isMobile ? '20px' : '0',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
              }}
            >
              {status.loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⚡
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

            <p className="form-disclaimer" style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '14px',
              color: '#a0a9cc'
            }}>
              Нажимая кнопку, вы соглашаетесь с{' '}
              <a href="/privacy" style={{ color: '#667eea', textDecoration: 'underline' }}>
                политикой конфиденциальности
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}