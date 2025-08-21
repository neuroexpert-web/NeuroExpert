'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIResults, ROIFormData } from '../../types';

interface ROIResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ROIResults;
  formData: ROIFormData;
}

export default function ROIResultModal({ isOpen, onClose, results, formData }: ROIResultModalProps) {
  // Определяем мобильное устройство
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  const getEmployeeCountText = (count: string) => {
    switch(count) {
      case 'up10': return 'до 10 сотрудников';
      case 'from11to50': return '11-50 сотрудников';
      case 'from51to250': return '51-250 сотрудников';
      case 'over250': return '250+ сотрудников';
      default: return count;
    }
  };

  const getIndustryText = (industry: string) => {
    switch(industry) {
      case 'retail': return 'Розничная торговля';
      case 'production': return 'Производство';
      case 'it': return 'IT и телеком';
      case 'finance': return 'Финансовые услуги';
      case 'construction': return 'Строительство';
      case 'medicine': return 'Медицина';
      case 'logistics': return 'Логистика';
      case 'services': return 'Услуги';
      case 'other': return 'Другое';
      default: return industry;
    }
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
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: isMobile ? '20px' : '50%',
              left: isMobile ? '20px' : '50%',
              right: isMobile ? '20px' : 'auto',
              bottom: isMobile ? '20px' : 'auto',
              transform: isMobile ? 'none' : 'translate(-50%, -50%)',
              background: 'linear-gradient(180deg, rgba(20, 20, 40, 0.98) 0%, rgba(30, 30, 60, 0.98) 100%)',
              borderRadius: isMobile ? '16px' : '32px',
              padding: isMobile ? '24px' : '48px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
              maxWidth: isMobile ? 'calc(100% - 40px)' : '800px',
              width: isMobile ? 'auto' : '90%',
              maxHeight: isMobile ? 'calc(100vh - 40px)' : '90vh',
              height: 'auto',
              overflow: 'auto',
              zIndex: 1001,
              WebkitOverflowScrolling: 'touch'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button for mobile */}
            {isMobile && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#a0a0a0',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                ×
              </motion.button>
            )}
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{ fontSize: isMobile ? '60px' : '80px', marginBottom: isMobile ? '12px' : '20px' }}
              >
                🎉
              </motion.div>
              <h2 style={{
                fontSize: isMobile ? '24px' : '36px',
                fontWeight: '700',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Ваш потенциал роста с NeuroExpert
              </h2>
            </div>

            {/* Input Summary */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                padding: isMobile ? '16px' : '24px',
                borderRadius: '16px',
                marginBottom: isMobile ? '20px' : '32px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}
            >
              <h3 style={{ color: '#667eea', marginBottom: '16px', fontSize: isMobile ? '18px' : '20px' }}>
                📊 Ваши параметры:
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ color: '#e0e7ff' }}>
                  <span style={{ color: '#a0a0a0' }}>Отрасль:</span> {getIndustryText(formData.industry)}
                </div>
                <div style={{ color: '#e0e7ff' }}>
                  <span style={{ color: '#a0a0a0' }}>Количество сотрудников:</span> {getEmployeeCountText(formData.employeeCount)}
                </div>
                <div style={{ color: '#e0e7ff' }}>
                  <span style={{ color: '#a0a0a0' }}>Планируемая сумма инвестиций:</span> {formatCurrency(formData.investment)}
                </div>
              </div>
            </motion.div>

            {/* Main Results */}
            <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
              {/* Потенциальная годовая прибыль */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                  padding: isMobile ? '20px' : '32px',
                  borderRadius: '20px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ color: '#a0a0a0', marginBottom: '8px', fontSize: isMobile ? '16px' : '18px' }}>
                  Потенциальная годовая прибыль
                </h3>
                <div style={{
                  fontSize: isMobile ? '32px' : '48px',
                  fontWeight: '700',
                  color: '#48bb78',
                  marginBottom: '8px'
                }}>
                  + {formatCurrency(results.profit)}
                </div>
              </motion.div>

              {/* ROI */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  background: 'rgba(72, 187, 120, 0.1)',
                  padding: isMobile ? '20px' : '32px',
                  borderRadius: '20px',
                  border: '1px solid rgba(72, 187, 120, 0.3)',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ color: '#a0a0a0', marginBottom: '8px', fontSize: isMobile ? '16px' : '18px' }}>
                  Возврат на инвестиции (ROI)
                </h3>
                <div style={{
                  fontSize: isMobile ? '48px' : '64px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {results.roi}%
                </div>
              </motion.div>

              {/* Сопроводительный текст */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                style={{
                  background: 'rgba(102, 126, 234, 0.05)',
                  padding: '24px',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}
              >
                <p style={{ color: '#e0e7ff', fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8' }}>
                  Инвестировав <strong>{formatCurrency(formData.investment)}</strong>, 
                  вы можете получить до <strong>{formatCurrency(results.profit)}</strong> чистой 
                  прибыли в первый год, что соответствует возврату на инвестиции 
                  в <strong>{results.roi}%</strong>
                </p>
              </motion.div>

              {/* Дополнительные метрики (если есть) */}
              {(results.savings || results.growth || results.payback) && (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? '12px' : '16px' }}>
                  {results.savings && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      style={{
                        background: 'rgba(72, 187, 120, 0.1)',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '1px solid rgba(72, 187, 120, 0.3)'
                      }}
                    >
                      <div style={{ color: '#48bb78', fontSize: '32px', marginBottom: '8px' }}>💰</div>
                      <h4 style={{ color: '#e0e7ff', marginBottom: '8px' }}>Годовая экономия</h4>
                      <div style={{ fontSize: '24px', fontWeight: '600', color: '#48bb78' }}>
                        {formatCurrency(results.savings)}
                      </div>
                      <p style={{ color: '#a0a0a0', fontSize: '14px', marginTop: '4px' }}>
                        на оптимизации процессов
                      </p>
                    </motion.div>
                  )}

                  {results.payback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      style={{
                        background: 'rgba(237, 137, 54, 0.1)',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '1px solid rgba(237, 137, 54, 0.3)'
                      }}
                    >
                      <div style={{ color: '#ed8936', fontSize: '32px', marginBottom: '8px' }}>⏱️</div>
                      <h4 style={{ color: '#e0e7ff', marginBottom: '8px' }}>Окупаемость</h4>
                      <div style={{ fontSize: '24px', fontWeight: '600', color: '#ed8936' }}>
                        {results.payback} мес.
                      </div>
                      <p style={{ color: '#a0a0a0', fontSize: '14px', marginTop: '4px' }}>
                        полный возврат инвестиций
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              style={{
                background: 'rgba(118, 75, 162, 0.1)',
                padding: isMobile ? '20px' : '32px',
                borderRadius: '20px',
                marginBottom: isMobile ? '20px' : '32px',
                border: '1px solid rgba(118, 75, 162, 0.2)'
              }}
            >
              <h3 style={{ color: '#764ba2', marginBottom: isMobile ? '16px' : '20px', fontSize: isMobile ? '20px' : '24px' }}>
                🚀 Что вы получите с NeuroExpert:
              </h3>
              <div style={{ display: 'grid', gap: isMobile ? '12px' : '16px' }}>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '8px' : '12px' }}>
                  <span style={{ fontSize: isMobile ? '20px' : '24px', flexShrink: 0 }}>✅</span>
                  <span style={{ color: '#e0e7ff', fontSize: isMobile ? '14px' : '16px', lineHeight: '1.5' }}>Автоматизация до 80% рутинных операций</span>
                </div>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '8px' : '12px' }}>
                  <span style={{ fontSize: isMobile ? '20px' : '24px', flexShrink: 0 }}>✅</span>
                  <span style={{ color: '#e0e7ff', fontSize: isMobile ? '14px' : '16px', lineHeight: '1.5' }}>Увеличение конверсии на 40-60%</span>
                </div>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '8px' : '12px' }}>
                  <span style={{ fontSize: isMobile ? '20px' : '24px', flexShrink: 0 }}>✅</span>
                  <span style={{ color: '#e0e7ff', fontSize: isMobile ? '14px' : '16px', lineHeight: '1.5' }}>Снижение затрат на маркетинг до 35%</span>
                </div>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '8px' : '12px' }}>
                  <span style={{ fontSize: isMobile ? '20px' : '24px', flexShrink: 0 }}>✅</span>
                  <span style={{ color: '#e0e7ff', fontSize: isMobile ? '14px' : '16px', lineHeight: '1.5' }}>Рост лояльности клиентов на 50%</span>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{ color: '#e0e7ff', marginBottom: '24px', fontSize: isMobile ? '16px' : '18px' }}>
                Готовы увеличить прибыль на {results.roi}%?
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Открываем чат с предзаполненным сообщением
                    const message = `Здравствуйте! Я рассчитал ROI для ${getIndustryText(formData.industry)} и получил впечатляющие ${results.roi}%. Хочу узнать подробнее о вашем предложении.`;
                    
                    // Создаем событие для открытия чата
                    const event = new CustomEvent('openAIChat', { 
                      detail: { message } 
                    });
                    window.dispatchEvent(event);
                    
                    onClose();
                  }}
                  style={{
                    padding: isMobile ? '14px 24px' : '16px 40px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  💬 Обсудить проект с экспертом
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }}
                  style={{
                    padding: isMobile ? '14px 24px' : '16px 40px',
                    background: 'transparent',
                    border: '2px solid rgba(102, 126, 234, 0.5)',
                    borderRadius: '50px',
                    color: '#667eea',
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📞 Получить консультацию
                </motion.button>
              </div>
            </motion.div>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                position: 'absolute',
                top: isMobile ? '16px' : '24px',
                right: isMobile ? '16px' : '24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: isMobile ? '36px' : '40px',
                height: isMobile ? '36px' : '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#a0a0a0',
                fontSize: isMobile ? '18px' : '20px',
                zIndex: 1002
              }}
            >
              ✕
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}