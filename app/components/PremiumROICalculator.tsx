'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  industry: string;
  employeeRange: string;
  investmentAmount: number | string;
}

interface Results {
  profit: number;
  roi: number;
  calculated: boolean;
}

// Коэффициенты отраслей
const industryCoefficients: Record<string, number> = {
  'retail': 1.8,      // Розничная торговля
  'manufacturing': 2.1, // Производство
  'it_telecom': 2.5,   // IT и телеком
  'finance': 2.3,      // Финансовые услуги
  'construction': 1.9, // Строительство
  'healthcare': 2.2,   // Медицина
  'logistics': 2.0,    // Логистика
  'education': 1.7,    // Образование
  'hospitality': 1.8,  // Гостиничный бизнес
  'other': 1.6        // Другое
};

// Коэффициенты масштаба
const scaleCoefficients: Record<string, number> = {
  'small': 1.1,    // до 10
  'medium': 1.3,   // 11-50
  'large': 1.5,    // 51-250
  'xlarge': 1.7    // 250+
};

export default function PremiumROICalculator(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    industry: '',
    employeeRange: '',
    investmentAmount: ''
  });
  
  const [results, setResults] = useState<Results>({
    profit: 0,
    roi: 0,
    calculated: false
  });
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Форматирование числа с разделением разрядов
  const formatNumber = (value: string): string => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Обработка изменения суммы инвестиций
  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value)) {
      setFormData({
        ...formData,
        investmentAmount: value
      });
      setErrors({ ...errors, investmentAmount: '' });
    }
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.industry) {
      newErrors.industry = 'Выберите отрасль';
    }
    
    if (!formData.employeeRange) {
      newErrors.employeeRange = 'Выберите количество сотрудников';
    }
    
    if (!formData.investmentAmount || Number(formData.investmentAmount) <= 0) {
      newErrors.investmentAmount = 'Введите сумму инвестиций';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Расчет ROI
  const calculateROI = async () => {
    if (!validateForm()) return;
    
    setIsCalculating(true);
    
    // Имитация загрузки для эффекта
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const investment = Number(formData.investmentAmount);
    const kIndustry = industryCoefficients[formData.industry];
    const kScale = scaleCoefficients[formData.employeeRange];
    
    // Формула расчета
    const profit = investment * kIndustry * kScale - investment;
    const roi = (profit / investment) * 100;
    
    setResults({
      profit: Math.round(profit),
      roi: Math.round(roi),
      calculated: true
    });
    
    setIsCalculating(false);
    setShowResults(true);
  };

  // Форматирование валюты
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Проверка заполненности формы
  const isFormComplete = formData.industry && formData.employeeRange && formData.investmentAmount;

  return (
    <section className="py-20 px-4" id="roi-calculator" style={{ background: 'var(--bg-dark)', position: 'relative' }}>
      {/* Фоновые эффекты */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div className="max-w-5xl mx-auto">
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
              NeuroExpert: Оценка потенциала роста
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Рассчитайте финансовую выгоду от инвестиций в цифровую трансформацию
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.9) 0%, rgba(30, 30, 50, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Декоративные элементы */}
          <div style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }} />
          
          {!showResults ? (
            <div>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Поле 1: Отрасль */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-lg font-medium mb-3" style={{ color: '#e0e7ff' }}>
                    Отрасль вашего бизнеса
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => {
                      setFormData({ ...formData, industry: e.target.value });
                      setErrors({ ...errors, industry: '' });
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: `2px solid ${errors.industry ? 'rgba(239, 68, 68, 0.5)' : 'rgba(102, 126, 234, 0.3)'}`,
                      borderRadius: '16px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                      e.target.style.background = 'rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.industry ? 'rgba(239, 68, 68, 0.5)' : 'rgba(102, 126, 234, 0.3)';
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    }}
                  >
                    <option value="" style={{ background: '#1a1a2e' }}>Выберите отрасль</option>
                    <option value="retail" style={{ background: '#1a1a2e' }}>Розничная торговля</option>
                    <option value="manufacturing" style={{ background: '#1a1a2e' }}>Производство</option>
                    <option value="it_telecom" style={{ background: '#1a1a2e' }}>IT и телеком</option>
                    <option value="finance" style={{ background: '#1a1a2e' }}>Финансовые услуги</option>
                    <option value="construction" style={{ background: '#1a1a2e' }}>Строительство</option>
                    <option value="healthcare" style={{ background: '#1a1a2e' }}>Медицина</option>
                    <option value="logistics" style={{ background: '#1a1a2e' }}>Логистика</option>
                    <option value="education" style={{ background: '#1a1a2e' }}>Образование</option>
                    <option value="hospitality" style={{ background: '#1a1a2e' }}>Гостиничный бизнес</option>
                    <option value="other" style={{ background: '#1a1a2e' }}>Другое</option>
                  </select>
                  {errors.industry && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {errors.industry}
                    </motion.p>
                  )}
                </motion.div>

                {/* Поле 2: Количество сотрудников */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-lg font-medium mb-3" style={{ color: '#e0e7ff' }}>
                    Количество сотрудников
                  </label>
                  <select
                    value={formData.employeeRange}
                    onChange={(e) => {
                      setFormData({ ...formData, employeeRange: e.target.value });
                      setErrors({ ...errors, employeeRange: '' });
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: `2px solid ${errors.employeeRange ? 'rgba(239, 68, 68, 0.5)' : 'rgba(102, 126, 234, 0.3)'}`,
                      borderRadius: '16px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                      e.target.style.background = 'rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.employeeRange ? 'rgba(239, 68, 68, 0.5)' : 'rgba(102, 126, 234, 0.3)';
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    }}
                  >
                    <option value="" style={{ background: '#1a1a2e' }}>Выберите диапазон</option>
                    <option value="small" style={{ background: '#1a1a2e' }}>до 10</option>
                    <option value="medium" style={{ background: '#1a1a2e' }}>11-50</option>
                    <option value="large" style={{ background: '#1a1a2e' }}>51-250</option>
                    <option value="xlarge" style={{ background: '#1a1a2e' }}>250+</option>
                  </select>
                  {errors.employeeRange && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {errors.employeeRange}
                    </motion.p>
                  )}
                </motion.div>

                {/* Поле 3: Сумма инвестиций */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-lg font-medium mb-3" style={{ color: '#e0e7ff' }}>
                    Планируемая сумма инвестиций, ₽
                  </label>
                  <input
                    type="text"
                    value={formatNumber(String(formData.investmentAmount))}
                    onChange={handleInvestmentChange}
                    placeholder="1 000 000"
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: `2px solid ${errors.investmentAmount ? 'rgba(239, 68, 68, 0.5)' : 'rgba(102, 126, 234, 0.3)'}`,
                      borderRadius: '16px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                      e.target.style.background = 'rgba(102, 126, 234, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.investmentAmount ? 'rgba(239, 68, 68, 0.5)' : 'rgba(102, 126, 234, 0.3)';
                      e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    }}
                  />
                  {errors.investmentAmount && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {errors.investmentAmount}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Кнопка расчета */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <motion.button
                  onClick={calculateROI}
                  disabled={!isFormComplete || isCalculating}
                  whileHover={isFormComplete && !isCalculating ? { scale: 1.05 } : {}}
                  whileTap={isFormComplete && !isCalculating ? { scale: 0.95 } : {}}
                  style={{
                    padding: '20px 60px',
                    background: isFormComplete && !isCalculating
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: isFormComplete && !isCalculating ? 'pointer' : 'not-allowed',
                    boxShadow: isFormComplete && !isCalculating 
                      ? '0 10px 40px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Эффект волны при клике */}
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {isCalculating ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          ⚡
                        </motion.div>
                        Рассчитываем потенциал...
                      </div>
                    ) : (
                      'Рассчитать потенциал'
                    )}
                  </span>
                  
                  {/* Анимированный фон кнопки */}
                  {isFormComplete && !isCalculating && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}
                </motion.button>
                
                {/* Подсказка */}
                {!isFormComplete && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm mt-4"
                    style={{ color: '#a0a9cc' }}
                  >
                    Заполните все поля для расчета потенциала
                  </motion.p>
                )}
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Заголовок результатов */}
                <motion.h3 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-center mb-8"
                  style={{ color: '#e0e7ff' }}
                >
                  Ваш потенциал роста с NeuroExpert
                </motion.h3>
                
                {/* Карточки с результатами */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Потенциальная прибыль */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(102, 126, 234, 0.1))',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '24px',
                      padding: '32px',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 150,
                      height: 150,
                      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(40px)'
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="text-lg mb-2" style={{ color: '#a0a9cc' }}>
                        Потенциальная годовая прибыль
                      </div>
                      <motion.div 
                        className="text-5xl font-bold mb-2"
                        style={{ color: '#10b981' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                      >
                        + {formatCurrency(results.profit)}
                      </motion.div>
                      <div className="text-sm" style={{ color: '#6b7280' }}>
                        чистой прибыли в первый год
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* ROI */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '24px',
                      padding: '32px',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: -50,
                      left: -50,
                      width: 150,
                      height: 150,
                      background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(40px)'
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="text-lg mb-2" style={{ color: '#a0a9cc' }}>
                        Возврат на инвестиции (ROI)
                      </div>
                      <motion.div 
                        className="text-5xl font-bold mb-2"
                        style={{ color: '#667eea' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                      >
                        {results.roi}%
                      </motion.div>
                      <div className="text-sm" style={{ color: '#6b7280' }}>
                        рентабельность инвестиций
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Сопроводительный текст */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mb-8 p-6 rounded-2xl"
                  style={{
                    background: 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <p className="text-lg" style={{ color: '#e0e7ff' }}>
                    Инвестировав <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                      {formatCurrency(Number(formData.investmentAmount))}
                    </span>, вы можете получить до <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                      {formatCurrency(results.profit)}
                    </span> чистой прибыли в первый год, 
                    что соответствует возврату на инвестиции в <span style={{ color: '#667eea', fontWeight: 'bold' }}>
                      {results.roi}%
                    </span>
                  </p>
                </motion.div>
                
                {/* Визуализация роста */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mb-8"
                >
                  <div style={{
                    height: '200px',
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-around',
                      height: '100%',
                      padding: '0 20px 20px'
                    }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '40%' }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{
                          width: '30%',
                          background: 'rgba(102, 126, 234, 0.3)',
                          borderRadius: '8px 8px 0 0',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '-30px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: '#a0a9cc',
                          fontSize: '14px',
                          whiteSpace: 'nowrap'
                        }}>
                          Инвестиции
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(results.roi / 5, 90)}%` }}
                        transition={{ delay: 1, duration: 0.5 }}
                        style={{
                          width: '30%',
                          background: 'linear-gradient(to top, #10b981, #059669)',
                          borderRadius: '8px 8px 0 0',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '-30px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap'
                        }}>
                          Прибыль +{results.roi}%
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                
                {/* CTA кнопки */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      contactSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      padding: '20px 40px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '16px',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    Обсудить проект с экспертом →
                  </motion.button>
                  
                  <button
                    onClick={() => {
                      setShowResults(false);
                      setFormData({
                        industry: '',
                        employeeRange: '',
                        investmentAmount: ''
                      });
                      setResults({
                        profit: 0,
                        roi: 0,
                        calculated: false
                      });
                    }}
                    style={{
                      padding: '16px 32px',
                      background: 'transparent',
                      border: '2px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '16px',
                      color: '#667eea',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    ← Рассчитать заново
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
}