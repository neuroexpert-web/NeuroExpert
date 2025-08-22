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

  useEffect(() => {
    // Определяем мобильное устройство
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
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: result.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.'
        });
        setFormData({ name: '', phone: '', email: '', company: '', message: '' });
      } else {
        throw new Error(result.error || 'Ошибка отправки формы');
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
      className="contact-section"
      style={{
        padding: isMobile ? '40px 0' : '80px 20px',
        backgroundColor: 'transparent'
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="contact-wrapper"
          style={{
            maxWidth: isMobile ? '100%' : '600px',
            margin: '0 auto',
            padding: isMobile ? '0' : '0 20px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              padding: isMobile ? '0 16px' : '0'
            }}>
              Начните прямо сейчас
            </h2>
            <p style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#a0a0a0',
              lineHeight: '1.6',
              padding: isMobile ? '0 16px' : '0'
            }}>
              Оставьте заявку и мы свяжемся с вами в течение 15 минут
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: 'rgba(20, 20, 40, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: isMobile ? '0' : '24px',
              padding: isMobile ? '32px 16px' : '48px',
              border: isMobile ? 'none' : '1px solid rgba(102, 126, 234, 0.2)',
              boxShadow: isMobile ? 'none' : '0 20px 40px rgba(0, 0, 0, 0.3)',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '100%' : '600px',
              minHeight: isMobile ? '100vh' : 'auto'
            }}
          >
            <form onSubmit={handleSubmit} className="contact-form">
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#a0a0a0',
                  fontWeight: '500'
                }}>
                  Ваше имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Иван Иванов"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#a0a0a0',
                  fontWeight: '500'
                }}>
                  Телефон *
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
                    padding: '16px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#a0a0a0',
                  fontWeight: '500'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="ivan@company.ru"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#a0a0a0',
                  fontWeight: '500'
                }}>
                  Компания
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="ООО Компания"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  color: '#a0a0a0',
                  fontWeight: '500'
                }}>
                  Сообщение
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Расскажите о вашей задаче..."
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    resize: 'vertical',
                    minHeight: '120px',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
              </div>

              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      marginBottom: '24px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: status.success 
                        ? 'rgba(72, 187, 120, 0.1)' 
                        : 'rgba(245, 101, 101, 0.1)',
                      border: `1px solid ${status.success 
                        ? 'rgba(72, 187, 120, 0.3)' 
                        : 'rgba(245, 101, 101, 0.3)'}`,
                      color: status.success ? '#48bb78' : '#f56565'
                    }}
                  >
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={status.loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '600',
                  background: status.loading 
                    ? 'rgba(102, 126, 234, 0.5)' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  cursor: status.loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
              >
                {status.loading ? (
                  <>
                    <span>Отправка...</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%'
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>Отправить заявку</span>
                    <span style={{ fontSize: '24px' }}>→</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          #contact {
            padding: 0 !important;
          }
          
          #contact > div {
            border-radius: 0 !important;
          }
          
          input, textarea {
            font-size: 16px !important;
            -webkit-text-size-adjust: 100%;
          }
        }
        
        input:focus, textarea:focus {
          border-color: rgba(102, 126, 234, 0.5) !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        
        input::placeholder, textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
}