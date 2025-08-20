'use client';
import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIFormData, ROIResults } from '../../types';

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

            {/* Результаты */}
            <AnimatePresence mode="wait">
              {showResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#e0e7ff' }}>
                    Ваши результаты
                  </h3>
                  
                  <div className="space-y-4">
                    {/* ROI */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                        padding: '24px',
                        borderRadius: '20px',
                        border: '1px solid rgba(102, 126, 234, 0.4)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#a0a9cc' }}>ROI за 3 года</span>
                        <span className="text-3xl font-bold" style={{
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          {results.roi}%
                        </span>
                      </div>
                    </motion.div>

                    {/* Экономия */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#a0a9cc' }}>Годовая экономия</span>
                        <span className="text-xl font-semibold" style={{ color: '#667eea' }}>
                          {formatCurrency(results.savings)}
                        </span>
                      </div>
                    </motion.div>

                    {/* Рост доходов */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#a0a9cc' }}>Рост доходов</span>
                        <span className="text-xl font-semibold" style={{ color: '#667eea' }}>
                          {formatCurrency(results.growth)}
                        </span>
                      </div>
                    </motion.div>

                    {/* Окупаемость */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#a0a9cc' }}>Окупаемость</span>
                        <span className="text-xl font-semibold" style={{ color: '#667eea' }}>
                          {results.payback} мес.
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 p-6 rounded-2xl text-center"
                    style={{
                      background: 'rgba(118, 75, 162, 0.1)',
                      border: '1px solid rgba(118, 75, 162, 0.3)'
                    }}
                  >
                    <p className="mb-4" style={{ color: '#e0e7ff' }}>
                      Хотите достичь таких результатов?
                    </p>
                    <motion.button
                      onClick={() => {
                        import('@/app/utils/aiChat').then(({ openAIChat }) => {
                          openAIChat(`Здравствуйте! Я рассчитал ROI и получил ${results.roi}% за 3 года. Расскажите подробнее, как вы можете помочь достичь таких результатов?`);
                        });
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '12px 32px',
                        background: 'linear-gradient(135deg, #764ba2, #667eea)',
                        border: 'none',
                        borderRadius: '50px',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Обсудить с AI директором
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                      className="text-6xl mb-4"
                    >
                      📊
                    </motion.div>
                    <p style={{ color: '#a0a9cc' }}>
                      Заполните форму для расчета вашего ROI
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}