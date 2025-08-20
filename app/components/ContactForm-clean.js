'use client';

import React, { useState } from 'react';
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

  const [currentStep, setCurrentStep] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        message: error.message || 'Произошла ошибка. Попробуйте позже.'
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    background: 'rgba(17, 24, 39, 0.5)',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '12px',
    color: '#fff',
    transition: 'all 0.3s ease',
    fontFamily: 'Inter, sans-serif',
    outline: 'none'
  };

  const buttonStyle = {
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Inter, sans-serif',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    minWidth: '200px'
  };

  return (
    <section id="contact" style={{
      padding: isMobile ? '40px 20px' : '80px 20px',
      background: 'linear-gradient(180deg, rgba(5, 7, 15, 0.9) 0%, rgba(15, 20, 40, 0.95) 100%)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }

        .mobile-focused input:focus,
        .mobile-focused textarea:focus {
          font-size: 16px !important;
        }

        input, textarea, select {
          font-size: 16px !important;
        }

        @media (max-width: 768px) {
          input, textarea {
            font-size: 16px !important;
            -webkit-text-size-adjust: 100%;
          }
        }
      `}</style>

      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          zIndex: 10
        }}
        className={isMobile ? 'mobile-focused' : ''}
      >
        <h2 style={{
          fontSize: isMobile ? '32px' : '48px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}>
          Начните трансформацию
        </h2>

        <p style={{
          fontSize: isMobile ? '16px' : '18px',
          color: '#94a3b8',
          textAlign: 'center',
          marginBottom: '48px',
          lineHeight: '1.6',
          fontFamily: 'Inter, sans-serif'
        }}>
          Оставьте заявку и получите персональную консультацию по внедрению AI
        </p>

        <div style={{
          background: 'rgba(17, 24, 39, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: isMobile ? '32px 24px' : '48px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '32px',
            position: 'relative'
          }}>
            {[1, 2, 3].map((step) => (
              <div key={step} style={{
                flex: 1,
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: currentStep >= step ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.2)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}>
                  {step}
                </div>
                <span style={{
                  fontSize: '12px',
                  color: currentStep >= step ? '#667eea' : '#64748b',
                  fontWeight: '500'
                }}>
                  {step === 1 ? 'Контакты' : step === 2 ? 'Детали' : 'Сообщение'}
                </span>
                {step < 3 && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    width: 'calc(100% - 40px)',
                    height: '2px',
                    background: currentStep > step ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.2)',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#e2e8f0',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Как вас зовут? *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Иван Иванов"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                          e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#e2e8f0',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Телефон *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+7 (999) 123-45-67"
                        style={inputStyle}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                          e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    style={buttonStyle}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Далее
                    <span>→</span>
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#e2e8f0',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@company.com"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                        e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#e2e8f0',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Компания
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Название компании"
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                        e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      style={{
                        ...buttonStyle,
                        background: 'rgba(102, 126, 234, 0.2)',
                        minWidth: '120px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                      }}
                    >
                      ← Назад
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      style={buttonStyle}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Далее
                      <span>→</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#e2e8f0',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Расскажите о вашем проекте
                    </label>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Опишите вашу задачу или вопрос..."
                        style={{
                          ...inputStyle,
                          resize: 'vertical',
                          minHeight: '120px'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#667eea';
                          e.target.style.background = 'rgba(17, 24, 39, 0.8)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                          e.target.style.background = 'rgba(17, 24, 39, 0.5)';
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      style={{
                        ...buttonStyle,
                        background: 'rgba(102, 126, 234, 0.2)',
                        minWidth: '120px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(102, 126, 234, 0.2)';
                      }}
                    >
                      ← Назад
                    </button>
                    <button
                      type="submit"
                      disabled={status.loading}
                      style={{
                        ...buttonStyle,
                        opacity: status.loading ? 0.7 : 1,
                        cursor: status.loading ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!status.loading) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {status.loading ? (
                        <>
                          <span style={{
                            display: 'inline-block',
                            width: '20px',
                            height: '20px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          Отправка...
                        </>
                      ) : (
                        <>
                          Отправить заявку
                          <span>✓</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {status.success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    color: '#22c55e',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  ✓ {status.message}
                </motion.div>
              )}

              {status.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    color: '#ef4444',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  ✗ {status.message}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}