'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIResults } from '../../types';
import './ROIResultModal.css';

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

  // Предотвращаем скролл body когда модалка открыта
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="roi-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="roi-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="roi-modal-header">
                <motion.span
                  className="roi-modal-emoji"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  🎉
                </motion.span>
                <h2 className="roi-modal-title">
                  Ваш потенциал роста
                </h2>
                <p className="roi-modal-subtitle">
                  Персональный расчет эффективности цифровизации
                </p>
              </div>

              {/* Input Summary */}
              <motion.div
                className="roi-summary-box"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="roi-summary-title">
                  📊 Ваши параметры:
                </h3>
                <div className="roi-summary-grid">
                  <div className="roi-summary-item">
                    <span className="roi-summary-label">Размер компании:</span> {getBusinessSizeText(formData.businessSize)}
                  </div>
                  <div className="roi-summary-item">
                    <span className="roi-summary-label">Отрасль:</span> {getIndustryText(formData.industry)}
                  </div>
                  <div className="roi-summary-item">
                    <span className="roi-summary-label">Инвестиции в цифровизацию:</span> {formatCurrency(formData.budget)}
                  </div>
                </div>
              </motion.div>

              {/* Main Results */}
              <div>
                {/* ROI */}
                <motion.div
                  className="roi-main-result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="roi-result-label">
                    Возврат инвестиций (ROI)
                  </h3>
                  <div className="roi-result-value">
                    {results.roi}%
                  </div>
                  <p className="roi-result-period">
                    за 3 года работы с нами
                  </p>
                </motion.div>

                {/* Detailed Metrics */}
                <div className="roi-metrics-grid">
                  <motion.div
                    className="roi-metric-card savings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="roi-metric-icon">💰</div>
                    <h4 className="roi-metric-label">Годовая экономия</h4>
                    <div className="roi-metric-value">
                      {formatCurrency(results.savings)}
                    </div>
                    <p className="roi-metric-desc">
                      на оптимизации процессов
                    </p>
                  </motion.div>

                  <motion.div
                    className="roi-metric-card growth"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="roi-metric-icon">📈</div>
                    <h4 className="roi-metric-label">Рост доходов</h4>
                    <div className="roi-metric-value">
                      {formatCurrency(results.growth)}
                    </div>
                    <p className="roi-metric-desc">
                      дополнительной прибыли
                    </p>
                  </motion.div>

                  <motion.div
                    className="roi-metric-card payback"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="roi-metric-icon">⏱️</div>
                    <h4 className="roi-metric-label">Окупаемость</h4>
                    <div className="roi-metric-value">
                      {results.payback} мес.
                    </div>
                    <p className="roi-metric-desc">
                      полный возврат инвестиций
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Benefits */}
              <motion.div
                className="roi-benefits"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="roi-benefits-title">
                  🚀 Что вы получите с NeuroExpert:
                </h3>
                <div className="roi-benefits-list">
                  <div className="roi-benefit-item">
                    <span className="roi-benefit-icon">✅</span>
                    <span className="roi-benefit-text">Автоматизация до 80% рутинных операций</span>
                  </div>
                  <div className="roi-benefit-item">
                    <span className="roi-benefit-icon">✅</span>
                    <span className="roi-benefit-text">Увеличение конверсии на 40-60%</span>
                  </div>
                  <div className="roi-benefit-item">
                    <span className="roi-benefit-icon">✅</span>
                    <span className="roi-benefit-text">Снижение затрат на маркетинг до 35%</span>
                  </div>
                  <div className="roi-benefit-item">
                    <span className="roi-benefit-icon">✅</span>
                    <span className="roi-benefit-text">Рост лояльности клиентов на 50%</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                className="roi-cta-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="roi-cta-text">
                  Готовы увеличить прибыль на {results.roi}%?
                </p>
                <div className="roi-cta-buttons">
                  <motion.button
                    className="roi-cta-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      import('@/app/utils/aiChat').then(({ openAIChat }) => {
                        openAIChat(`Здравствуйте! Я рассчитал ROI и получил впечатляющие ${results.roi}% за 3 года. Хочу узнать подробнее о вашем предложении для ${getIndustryText(formData.industry)}.`);
                      });
                      onClose();
                    }}
                  >
                    💬 Обсудить с AI управляющим платформы
                  </motion.button>
                  <motion.button
                    className="roi-cta-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      onClose();
                    }}
                  >
                    📞 Получить консультацию
                  </motion.button>
                </div>
              </motion.div>

              {/* Close button */}
              <motion.button
                className="roi-close-btn"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Закрыть"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}