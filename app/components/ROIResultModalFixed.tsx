'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ROIResults } from '../../types';

interface ROIResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ROIResults;
  formData: {
    businessSize: string;
    industry: string;
    budget: number;
  };
}

export default function ROIResultModalFixed({ isOpen, onClose, results, formData }: ROIResultModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Блокируем скролл body когда модалка открыта
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getBusinessSizeText = (size: string) => {
    switch(size) {
      case 'small': return 'Малый бизнес (до 50 сотрудников)';
      case 'medium': return 'Средний бизнес (50-250 сотрудников)';
      case 'large': return 'Крупный бизнес (250+ сотрудников)';
      default: return size;
    }
  };

  const getIndustryText = (industry: string) => {
    switch(industry) {
      case 'retail': return 'Розничная торговля';
      case 'services': return 'Услуги';
      case 'production': return 'Производство';
      case 'it': return 'IT и технологии';
      case 'other': return 'Другое';
      default: return industry;
    }
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: isMobile ? '0' : '2vh',
    left: isMobile ? '0' : '50%',
    right: isMobile ? '0' : 'auto',
    bottom: isMobile ? '0' : 'auto',
    transform: isMobile ? 'none' : 'translateX(-50%)',
    background: 'linear-gradient(180deg, rgba(20, 20, 40, 0.98) 0%, rgba(30, 30, 60, 0.98) 100%)',
    borderRadius: isMobile ? '0' : '24px',
    padding: isMobile ? '20px' : '40px',
    paddingTop: isMobile ? '60px' : '40px',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
    maxWidth: isMobile ? '100%' : '800px',
    width: isMobile ? '100%' : '90%',
    height: isMobile ? '100%' : 'auto',
    maxHeight: isMobile ? '100%' : '96vh',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    zIndex: 1001,
    WebkitOverflowScrolling: 'touch',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: isMobile ? 1 : 0.8, y: isMobile ? 100 : 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: isMobile ? 1 : 0.8, y: isMobile ? 100 : 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Fixed Position */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                position: isMobile ? 'fixed' : 'absolute',
                top: isMobile ? '20px' : '24px',
                right: isMobile ? '20px' : '24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '20px',
                zIndex: 1002
              }}
            >
              ✕
            </motion.button>

            {/* Content Container */}
            <div style={{ 
              maxWidth: '720px', 
              margin: '0 auto',
              paddingBottom: isMobile ? '40px' : '0'
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  style={{ fontSize: isMobile ? '60px' : '80px', marginBottom: '20px' }}
                >
                  🎉
                </motion.div>
                <h2 style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Ваш потенциал роста
                </h2>
                <p style={{ color: '#a0a0a0', fontSize: isMobile ? '16px' : '18px' }}>
                  Персональный расчет эффективности цифровизации
                </p>
              </div>

              {/* Input Summary */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  padding: isMobile ? '20px' : '24px',
                  borderRadius: '16px',
                  marginBottom: isMobile ? '24px' : '32px',
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}
              >
                <h3 style={{ 
                  color: '#667eea', 
                  marginBottom: '16px', 
                  fontSize: isMobile ? '18px' : '20px' 
                }}>
                  📊 Ваши параметры:
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ color: '#e0e7ff', fontSize: isMobile ? '14px' : '16px' }}>
                    <span style={{ color: '#a0a0a0' }}>Размер компании:</span> {getBusinessSizeText(formData.businessSize)}
                  </div>
                  <div style={{ color: '#e0e7ff', fontSize: isMobile ? '14px' : '16px' }}>
                    <span style={{ color: '#a0a0a0' }}>Отрасль:</span> {getIndustryText(formData.industry)}
                  </div>
                  <div style={{ color: '#e0e7ff', fontSize: isMobile ? '14px' : '16px' }}>
                    <span style={{ color: '#a0a0a0' }}>Инвестиции в цифровизацию:</span> {formatCurrency(formData.budget)}
                  </div>
                </div>
              </motion.div>

              {/* Main Results */}
              <div style={{ display: 'grid', gap: isMobile ? '16px' : '24px', marginBottom: '32px' }}>
                {/* ROI */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    padding: isMobile ? '20px' : '32px',
                    borderRadius: '20px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ color: '#22c55e', marginBottom: '8px', fontSize: isMobile ? '18px' : '20px' }}>
                    Возврат инвестиций (ROI)
                  </h3>
                  <div style={{ 
                    fontSize: isMobile ? '48px' : '64px', 
                    fontWeight: '800', 
                    color: '#22c55e' 
                  }}>
                    {results.roi}%
                  </div>
                  <p style={{ color: '#a0a0a0', marginTop: '8px', fontSize: isMobile ? '14px' : '16px' }}>
                    за первые 12 месяцев
                  </p>
                </motion.div>

                {/* Savings & Revenue Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                  gap: isMobile ? '16px' : '24px' 
                }}>
                  {/* Savings */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      padding: isMobile ? '20px' : '24px',
                      borderRadius: '16px',
                      border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}
                  >
                    <h4 style={{ 
                      color: '#667eea', 
                      marginBottom: '12px', 
                      fontSize: isMobile ? '16px' : '18px' 
                    }}>
                      💰 Экономия за 3 года
                    </h4>
                    <div style={{ 
                      fontSize: isMobile ? '24px' : '32px', 
                      fontWeight: '700', 
                      color: '#e0e7ff' 
                    }}>
                      {formatCurrency(results.savings)}
                    </div>
                  </motion.div>

                  {/* Growth */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                      background: 'rgba(168, 85, 247, 0.1)',
                      padding: isMobile ? '20px' : '24px',
                      borderRadius: '16px',
                      border: '1px solid rgba(168, 85, 247, 0.2)'
                    }}
                  >
                    <h4 style={{ 
                      color: '#a855f7', 
                      marginBottom: '12px', 
                      fontSize: isMobile ? '16px' : '18px' 
                    }}>
                      📈 Рост выручки
                    </h4>
                    <div style={{ 
                      fontSize: isMobile ? '24px' : '32px', 
                      fontWeight: '700', 
                      color: '#e9d5ff' 
                    }}>
                      {formatCurrency(results.growth)}
                    </div>
                  </motion.div>
                </div>

                {/* Payback Period */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(237, 137, 54, 0.1) 0%, rgba(236, 201, 75, 0.1) 100%)',
                    padding: isMobile ? '20px' : '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(237, 137, 54, 0.3)',
                    textAlign: 'center'
                  }}
                >
                  <h4 style={{ 
                    color: '#ed8936', 
                    marginBottom: '8px', 
                    fontSize: isMobile ? '16px' : '18px' 
                  }}>
                    ⏰ Срок окупаемости
                  </h4>
                  <div style={{ 
                    fontSize: isMobile ? '32px' : '40px', 
                    fontWeight: '700', 
                    color: '#fbd38d' 
                  }}>
                    {results.payback} мес.
                  </div>
                </motion.div>
              </div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: isMobile ? '20px' : '32px',
                  borderRadius: '20px',
                  marginBottom: '32px'
                }}
              >
                <h3 style={{ 
                  marginBottom: '24px', 
                  fontSize: isMobile ? '20px' : '24px' 
                }}>
                  🎯 Что вы получите:
                </h3>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { icon: '⏱️', text: `Экономия времени на рутинных операциях до 40%` },
                    { icon: '🚀', text: `Рост эффективности бизнес-процессов на ${Math.round(results.roi / 3)}%` },
                    { icon: '💡', text: 'Автоматизация отчетности и аналитики' },
                    { icon: '🎯', text: 'Персональный цифровой дуправляющий 24/7' },
                    { icon: '📊', text: `Окупаемость всего за ${results.payback} месяцев` }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                    >
                      <span style={{ fontSize: '24px' }}>{benefit.icon}</span>
                      <span style={{ 
                        color: '#e0e7ff', 
                        fontSize: isMobile ? '14px' : '16px' 
                      }}>
                        {benefit.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: isMobile ? '24px' : '32px',
                  borderRadius: '20px',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ 
                  fontSize: isMobile ? '20px' : '24px', 
                  marginBottom: '16px' 
                }}>
                  🚀 Готовы начать трансформацию?
                </h3>
                <p style={{ 
                  marginBottom: '24px', 
                  opacity: 0.9,
                  fontSize: isMobile ? '14px' : '16px'
                }}>
                  Получите персональную консультацию и дорожную карту внедрения
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onClose();
                    // Прокрутка к форме контактов
                    const contactSection = document.getElementById('consultation');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  style={{
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    padding: isMobile ? '14px 28px' : '16px 40px',
                    borderRadius: '50px',
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Получить консультацию
                  <span style={{ fontSize: '20px' }}>→</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}