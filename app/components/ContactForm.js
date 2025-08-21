'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: ''
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false, message: '' });

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-neuroexpert-csrf': '1'
        },
        body: JSON.stringify({
          ...formData,
          email: '',
          company: '',
          message: ''
        })
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: '✅ Заявка отправлена! Звоним через 5 минут.'
        });
        
        setFormData({ name: '', phone: '' });
        
        setTimeout(() => {
          setStatus({ loading: false, success: false, error: false, message: '' });
        }, 5000);
      } else {
        setStatus({
          loading: false,
          success: false,
          error: true,
          message: result.error || '❌ Ошибка. Попробуйте еще раз.'
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: '❌ Проверьте интернет-соединение.'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" style={{ padding: isMobile ? '0' : '80px 20px' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px'
          }}
        >
          {/* Заголовок */}
          <div style={{ textAlign: 'center', maxWidth: '700px' }}>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: isMobile ? '36px' : '52px',
                fontWeight: '700',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                padding: isMobile ? '0 16px' : '0'
              }}
            >
              Оставьте заявку за 30 секунд
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '40px',
                marginTop: '24px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: isMobile ? '16px' : '18px',
                color: '#94a3b8'
              }}>
                <span style={{ fontSize: '24px' }}>⚡</span>
                <span>Звонок через 5 минут</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: isMobile ? '16px' : '18px',
                color: '#94a3b8'
              }}>
                <span style={{ fontSize: '24px' }}>🎯</span>
                <span>Бесплатная консультация</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: isMobile ? '16px' : '18px',
                color: '#94a3b8'
              }}>
                <span style={{ fontSize: '24px' }}>🚀</span>
                <span>Расчет ROI за 1 день</span>
              </div>
            </motion.div>
          </div>

          {/* Форма */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
              backdropFilter: 'blur(20px)',
              borderRadius: isMobile ? '0' : '32px',
              padding: isMobile ? '32px 16px' : '48px',
              border: '1px solid rgba(96, 165, 250, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(96, 165, 250, 0.1)',
              width: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Декоративный градиент */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #60a5fa)',
              backgroundSize: '200% 100%',
              animation: 'gradient 3s ease infinite'
            }} />

            <form onSubmit={handleSubmit} className="contact-form">
              {/* Поле имени */}
              <motion.div 
                style={{ marginBottom: '24px' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '16px',
                  color: '#e2e8f0',
                  fontWeight: '600'
                }}>
                  <span style={{ fontSize: '20px' }}>👤</span>
                  <span>Как вас зовут?</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Иван"
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    fontSize: '18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </motion.div>

              {/* Поле телефона */}
              <motion.div 
                style={{ marginBottom: '32px' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  fontSize: '16px',
                  color: '#e2e8f0',
                  fontWeight: '600'
                }}>
                  <span style={{ fontSize: '20px' }}>📱</span>
                  <span>Ваш телефон</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+7 (999) 123-45-67"
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    fontSize: '18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </motion.div>

              {/* Сообщение о статусе */}
              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      marginBottom: '24px',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      backgroundColor: status.success 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : 'rgba(239, 68, 68, 0.1)',
                      border: `2px solid ${status.success 
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
                disabled={status.loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                style={{
                  width: '100%',
                  padding: '20px',
                  fontSize: '20px',
                  fontWeight: '700',
                  background: status.loading 
                    ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.5), rgba(167, 139, 250, 0.5))' 
                    : 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  cursor: status.loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: status.loading 
                    ? 'none'
                    : '0 8px 24px rgba(96, 165, 250, 0.4), 0 0 40px rgba(167, 139, 250, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {status.loading ? (
                  <>
                    <span>Отправляем</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '3px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%'
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>Получить консультацию</span>
                    <motion.span 
                      style={{ fontSize: '24px' }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </>
                )}
              </motion.button>

              {/* Текст под кнопкой */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  fontSize: '14px',
                  color: '#94a3b8'
                }}
              >
                Нажимая кнопку, вы соглашаетесь с обработкой данных
              </motion.p>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @media (max-width: 768px) {
          #contact {
            padding: 0 !important;
          }
          
          input {
            font-size: 16px !important;
            -webkit-text-size-adjust: 100%;
          }
        }
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px rgba(30, 41, 59, 0.9) inset;
          -webkit-text-fill-color: white;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </section>
  );
}
