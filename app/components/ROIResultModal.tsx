'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function ROIResultModal({ isOpen, onClose, results, formData }: ROIResultModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
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
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(180deg, rgba(20, 20, 40, 0.95) 0%, rgba(30, 30, 60, 0.95) 100%)',
              borderRadius: isMobile ? '16px' : '32px',
              padding: isMobile ? '24px' : '48px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
              maxWidth: '800px',
              width: isMobile ? '95%' : '90%',
              maxHeight: isMobile ? '85vh' : '90vh',
              overflow: 'auto',
              zIndex: 1001,
              WebkitOverflowScrolling: 'touch'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '40px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                style={{ fontSize: isMobile ? '60px' : '80px', marginBottom: isMobile ? '16px' : '20px' }}
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
              <p style={{ color: '#a0a0a0', fontSize: '18px' }}>
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
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '32px',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}
            >
              <h3 style={{ color: '#667eea', marginBottom: '16px', fontSize: '20px' }}>
                📊 Ваши параметры:
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ color: '#e0e7ff' }}>
                  <span style={{ color: '#a0a0a0' }}>Размер компании:</span> {getBusinessSizeText(formData.businessSize)}
                </div>
                <div style={{ color: '#e0e7ff' }}>
                  <span style={{ color: '#a0a0a0' }}>Отрасль:</span> {getIndustryText(formData.industry)}
                </div>
                <div style={{ color: '#e0e7ff' }}>
                  <span style={{ color: '#a0a0a0' }}>Инвестиции в цифровизацию:</span> {formatCurrency(formData.budget)}
                </div>
              </div>
            </motion.div>

            {/* Main Results */}
            <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
              {/* ROI */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                  padding: '32px',
                  borderRadius: '20px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  textAlign: 'center'
                }}
              >
                <h3 style={{ color: '#a0a0a0', marginBottom: '8px', fontSize: '18px' }}>
                  Возврат инвестиций (ROI)
                </h3>
                <div style={{
                  fontSize: '64px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '8px'
                }}>
                  {results.roi}%
                </div>
                <p style={{ color: '#e0e7ff', fontSize: '16px' }}>
                  за 3 года работы с нами
                </p>
              </motion.div>

              {/* Detailed Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  style={{
                    background: 'rgba(66, 153, 225, 0.1)',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(66, 153, 225, 0.3)'
                  }}
                >
                  <div style={{ color: '#4299e1', fontSize: '32px', marginBottom: '8px' }}>📈</div>
                  <h4 style={{ color: '#e0e7ff', marginBottom: '8px' }}>Рост доходов</h4>
                  <div style={{ fontSize: '24px', fontWeight: '600', color: '#4299e1' }}>
                    {formatCurrency(results.growth)}
                  </div>
                  <p style={{ color: '#a0a0a0', fontSize: '14px', marginTop: '4px' }}>
                    дополнительной прибыли
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
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
              </div>
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                background: 'rgba(118, 75, 162, 0.1)',
                padding: '32px',
                borderRadius: '20px',
                marginBottom: '32px',
                border: '1px solid rgba(118, 75, 162, 0.2)'
              }}
            >
              <h3 style={{ color: '#764ba2', marginBottom: '20px', fontSize: '24px' }}>
                🚀 Что вы получите с NeuroExpert:
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <span style={{ color: '#e0e7ff' }}>Автоматизация до 80% рутинных операций</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <span style={{ color: '#e0e7ff' }}>Увеличение конверсии на 40-60%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <span style={{ color: '#e0e7ff' }}>Снижение затрат на маркетинг до 35%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <span style={{ color: '#e0e7ff' }}>Рост лояльности клиентов на 50%</span>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{ color: '#e0e7ff', marginBottom: '24px', fontSize: '18px' }}>
                Готовы увеличить прибыль на {results.roi}%?
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    import('@/app/utils/aiChat').then(({ openAIChat }) => {
                      openAIChat(`Здравствуйте! Я рассчитал ROI и получил впечатляющие ${results.roi}% за 3 года. Хочу узнать подробнее о вашем предложении для ${getIndustryText(formData.industry)}.`);
                    });
                    onClose();
                  }}
                  style={{
                    padding: '16px 40px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  💬 Обсудить с AI директором
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    onClose();
                  }}
                  style={{
                    padding: '16px 40px',
                    background: 'transparent',
                    border: '2px solid rgba(102, 126, 234, 0.5)',
                    borderRadius: '50px',
                    color: '#667eea',
                    fontSize: '18px',
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
                top: '24px',
                right: '24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#a0a0a0',
                fontSize: '20px'
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