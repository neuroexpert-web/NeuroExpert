'use client';
import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIFormData, ROIResults } from '../../types';
import ROIResultModal from './ROIResultModal';

export default function ROICalculator(): JSX.Element {
  const [formData, setFormData] = useState<ROIFormData>({
    businessSize: 'small',
    industry: 'retail',
    budget: 200000
  });
  
  const [showResult, setShowResult] = useState<boolean>(false);
  const [results, setResults] = useState<ROIResults>({
    roi: 0,
    savings: 0,
    growth: 0,
    payback: 0
  });

  // Множители для расчета
  const sizeMultipliers: Record<ROIFormData['businessSize'], number> = {
    small: 3.2,
    medium: 4.5,
    large: 6.0
  };
  
  const industryMultipliers: Record<ROIFormData['industry'], number> = {
    retail: 1.2,
    services: 1.3,
    production: 1.1,
    it: 1.5,
    other: 1.0
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value
    } as ROIFormData));
  };

  const calculateROI = async (): Promise<void> => {
    const { businessSize, industry, budget } = formData;
    
    // Расчеты на основе множителей
    const baseROI = sizeMultipliers[businessSize] * industryMultipliers[industry];
    const roi = Math.round(baseROI * 100);
    const savings = Math.round(budget * 0.35);
    const growth = Math.round(budget * baseROI);
    const payback = Math.round(budget / (savings / 12));
    
    setResults({ roi, savings, growth, payback });
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
              Калькулятор ROI
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Узнайте вашу выгоду от внедрения наших решений
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
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Форма ввода */}
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#e0e7ff' }}>
                Введите данные о вашем бизнесе
              </h3>
              
              <div className="space-y-6">
                {/* Размер бизнеса */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc' }}>
                    Размер бизнеса
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
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  >
                    <option value="small" style={{ background: '#1a1a2e' }}>Малый (до 50 сотрудников)</option>
                    <option value="medium" style={{ background: '#1a1a2e' }}>Средний (50-250 сотрудников)</option>
                    <option value="large" style={{ background: '#1a1a2e' }}>Крупный (250+ сотрудников)</option>
                  </select>
                </motion.div>

                {/* Отрасль */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc' }}>
                    Отрасль
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
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  >
                    <option value="retail" style={{ background: '#1a1a2e' }}>Розничная торговля</option>
                    <option value="services" style={{ background: '#1a1a2e' }}>Услуги</option>
                    <option value="production" style={{ background: '#1a1a2e' }}>Производство</option>
                    <option value="it" style={{ background: '#1a1a2e' }}>IT и технологии</option>
                    <option value="other" style={{ background: '#1a1a2e' }}>Другое</option>
                  </select>
                </motion.div>

                {/* Желаемые инвестиции в цифровизацию */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc' }}>
                    Желаемые инвестиции в цифровизацию (₽)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="0"
                    step="10000"
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
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  />
                </motion.div>

                {/* Кнопка расчета */}
                <motion.button
                  onClick={calculateROI}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                    padding: '18px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '32px'
                  }}
                >
                  Рассчитать ROI
                </motion.button>
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
    </section>
  );
}