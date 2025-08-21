'use client';
import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIFormData, ROIResults } from '../../types';
import ROIResultModal from './ROIResultModal';
import { 
  calculateSimpleROI, 
  INDUSTRY_COEFFICIENTS, 
  SCALE_COEFFICIENTS 
} from '../utils/roi-calculations';

export default function ROICalculator(): JSX.Element {
  const [formData, setFormData] = useState<ROIFormData>({
    businessSize: 'small',
    industry: 'retail',
    budget: 500000
  });
  
  const [showResult, setShowResult] = useState<boolean>(false);
  const [results, setResults] = useState<ROIResults>({
    roi: 0,
    savings: 0,
    growth: 0,
    payback: 0
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value
    } as ROIFormData));
  };

  const calculateROI = async (): Promise<void> => {
    const { businessSize, industry, budget } = formData;
    
    // Используем новую продвинутую систему расчетов
    const calculatedResults = calculateSimpleROI(budget, industry, businessSize);
    
    setResults(calculatedResults);
    setShowResult(true);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <section className="py-20 px-4" id="roi-calculator">
      <div className="max-w-6xl mx-auto">
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
              Калькулятор потенциала роста
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Оценка эффективности цифровой трансформации на основе реальных данных рынка
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'rgba(20, 20, 40, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(102, 126, 234, 0.2)'
          }}
          className="roi-calculator-container"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Форма ввода */}
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#e0e7ff' }}>
                Параметры вашего бизнеса
              </h3>
              
              <div className="space-y-6">
                {/* Отрасль */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc' }}>
                    Отрасль вашего бизнеса
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    className="roi-select"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  >
                    {Object.entries(INDUSTRY_COEFFICIENTS).map(([key, data]) => (
                      <option key={key} value={key} style={{ background: '#1a1a2e' }}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs" style={{ color: '#64748b' }}>
                    {INDUSTRY_COEFFICIENTS[formData.industry]?.description}
                  </p>
                </motion.div>

                {/* Размер компании */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc' }}>
                    Количество сотрудников
                  </label>
                  <select
                    name="businessSize"
                    value={formData.businessSize}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    className="roi-select"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  >
                    {Object.entries(SCALE_COEFFICIENTS).map(([key, data]) => (
                      <option key={key} value={key} style={{ background: '#1a1a2e' }}>
                        {data.name} сотрудников
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs" style={{ color: '#64748b' }}>
                    Срок внедрения: ~{SCALE_COEFFICIENTS[formData.businessSize]?.implementationSpeed} месяцев
                  </p>
                </motion.div>

                {/* Планируемые инвестиции */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc' }}>
                    Планируемая сумма инвестиций (₽)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="100000"
                    step="50000"
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    className="roi-input"
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  />
                  <p className="mt-2 text-xs" style={{ color: '#64748b' }}>
                    Рекомендуемый минимум: {formatCurrency(100000)}
                  </p>
                </motion.div>

                {/* Кнопка расчета */}
                <motion.button
                  onClick={calculateROI}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={formData.budget < 100000}
                  animate={{
                    boxShadow: formData.budget >= 100000 ? [
                      '0 0 20px rgba(102, 126, 234, 0.4)',
                      '0 0 40px rgba(118, 75, 162, 0.6)',
                      '0 0 20px rgba(102, 126, 234, 0.4)'
                    ] : '0 0 10px rgba(102, 126, 234, 0.2)'
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: formData.budget >= 100000 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: formData.budget >= 100000 ? 'pointer' : 'not-allowed',
                    marginTop: '32px',
                    opacity: formData.budget >= 100000 ? 1 : 0.6
                  }}
                  className="roi-calculate-btn"
                >
                  Рассчитать потенциал
                </motion.button>
              </div>
            </div>

            {/* Информационная панель */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#e0e7ff' }}>
                Как это работает?
              </h3>
              
              <div className="space-y-4">
                <motion.div 
                  className="info-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <h4 style={{ color: '#667eea', marginBottom: '8px', fontWeight: '600' }}>
                    📊 Основано на реальных данных
                  </h4>
                  <p style={{ color: '#a0a9cc', fontSize: '14px' }}>
                    Используем бенчмарки McKinsey, Gartner и IDC для точной оценки потенциала вашей отрасли
                  </p>
                </motion.div>

                <motion.div 
                  className="info-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    background: 'rgba(72, 187, 120, 0.1)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(72, 187, 120, 0.2)'
                  }}
                >
                  <h4 style={{ color: '#48bb78', marginBottom: '8px', fontWeight: '600' }}>
                    💰 Комплексный анализ ROI
                  </h4>
                  <p style={{ color: '#a0a9cc', fontSize: '14px' }}>
                    Учитываем операционную экономию, рост выручки и повышение эффективности процессов
                  </p>
                </motion.div>

                <motion.div 
                  className="info-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    background: 'rgba(237, 137, 54, 0.1)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(237, 137, 54, 0.2)'
                  }}
                >
                  <h4 style={{ color: '#ed8936', marginBottom: '8px', fontWeight: '600' }}>
                    ⚡ Адаптация под ваш бизнес
                  </h4>
                  <p style={{ color: '#a0a9cc', fontSize: '14px' }}>
                    Коэффициенты масштаба и отраслевая специфика для максимально точного прогноза
                  </p>
                </motion.div>
              </div>

              <div style={{
                marginTop: '32px',
                padding: '16px',
                background: 'rgba(66, 153, 225, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(66, 153, 225, 0.2)'
              }}>
                <p style={{ color: '#4299e1', fontSize: '13px', textAlign: 'center' }}>
                  💡 <strong>Совет:</strong> Результаты основаны на 3-летнем периоде внедрения и оптимизации цифровых решений
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Модальное окно с результатами */}
        <ROIResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          results={results}
          formData={formData}
        />
      </div>

      {/* Адаптивные стили */}
      <style jsx>{`
        @media (max-width: 768px) {
          .roi-calculator-container {
            padding: 24px !important;
          }
          
          .roi-select,
          .roi-input {
            font-size: 14px !important;
            padding: 12px !important;
          }
          
          .roi-calculate-btn {
            font-size: 16px !important;
            padding: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}