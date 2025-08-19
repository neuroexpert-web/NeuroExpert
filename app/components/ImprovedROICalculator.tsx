'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ROIFormData {
  employees: number;
  averageSalary: number;
  taskHours: number;
  errorRate: number;
  currentTools: string;
}

interface ROIResults {
  monthlySavings: number;
  yearlySavings: number;
  roi: number;
  paybackMonths: number;
  productivityGain: number;
}

export default function ImprovedROICalculator(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ROIFormData>({
    employees: 10,
    averageSalary: 100000,
    taskHours: 20,
    errorRate: 10,
    currentTools: 'basic'
  });
  
  const [showResult, setShowResult] = useState<boolean>(false);
  const [results, setResults] = useState<ROIResults>({
    monthlySavings: 0,
    yearlySavings: 0,
    roi: 0,
    paybackMonths: 0,
    productivityGain: 0
  });

  // Автоматический расчет при изменении данных
  useEffect(() => {
    calculateROI();
  }, [formData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const calculateROI = (): void => {
    const { employees, averageSalary, taskHours, errorRate, currentTools } = formData;
    
    // Базовые расчеты
    const hourlyRate = averageSalary / (22 * 8 * 12); // Месячная ставка
    const currentMonthlyCost = employees * taskHours * hourlyRate;
    
    // Коэффициенты улучшения в зависимости от текущих инструментов
    const improvementRates = {
      none: 0.7,      // 70% экономии времени
      basic: 0.5,     // 50% экономии времени
      advanced: 0.3   // 30% экономии времени
    };
    
    const timeSavings = improvementRates[currentTools as keyof typeof improvementRates] || 0.5;
    const errorReduction = 0.8; // 80% снижение ошибок
    
    // Расчет экономии
    const timeSaved = taskHours * timeSavings * employees;
    const moneySavedFromTime = timeSaved * hourlyRate;
    const moneySavedFromErrors = (errorRate / 100) * currentMonthlyCost * errorReduction;
    
    const monthlySavings = moneySavedFromTime + moneySavedFromErrors;
    const yearlySavings = monthlySavings * 12;
    
    // Стоимость внедрения (примерная)
    const implementationCost = employees * 5000 + 50000; // Базовая стоимость + на сотрудника
    
    // ROI и окупаемость
    const roi = ((yearlySavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = implementationCost / monthlySavings;
    const productivityGain = timeSavings * 100;
    
    setResults({
      monthlySavings: Math.round(monthlySavings),
      yearlySavings: Math.round(yearlySavings),
      roi: Math.round(roi),
      paybackMonths: Math.ceil(paybackMonths),
      productivityGain: Math.round(productivityGain)
    });
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#e0e7ff' }}>
              Шаг 1: Информация о команде
            </h3>
            
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: '#a0a9cc' }}>
                Сколько сотрудников в вашей команде?
              </label>
              <div className="relative">
                <input
                  type="range"
                  name="employees"
                  min="1"
                  max="100"
                  value={formData.employees}
                  onChange={handleInputChange}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #667eea 0%, #667eea ${formData.employees}%, rgba(102, 126, 234, 0.2) ${formData.employees}%, rgba(102, 126, 234, 0.2) 100%)`,
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
                <div className="flex justify-between text-sm mt-2" style={{ color: '#a0a9cc' }}>
                  <span>1</span>
                  <span className="text-2xl font-bold" style={{ color: '#667eea' }}>{formData.employees}</span>
                  <span>100</span>
                </div>
              </div>
              <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
                💡 Учитывайте всех, кто будет использовать AI-решения
              </p>
            </div>

            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: '#a0a9cc' }}>
                Средняя зарплата сотрудника в месяц
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[50000, 100000, 150000, 200000].map((salary) => (
                  <button
                    key={salary}
                    onClick={() => setFormData({...formData, averageSalary: salary})}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.averageSalary === salary 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-lg font-bold">{formatCurrency(salary)}</div>
                  </button>
                ))}
              </div>
              <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
                💡 Это поможет рассчитать экономию на фонде оплаты труда
              </p>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#e0e7ff' }}>
              Шаг 2: Текущие процессы
            </h3>
            
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: '#a0a9cc' }}>
                Сколько часов в неделю тратится на рутинные задачи?
              </label>
              <div className="relative">
                <input
                  type="range"
                  name="taskHours"
                  min="5"
                  max="40"
                  value={formData.taskHours}
                  onChange={handleInputChange}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, #667eea 0%, #667eea ${(formData.taskHours - 5) / 35 * 100}%, rgba(102, 126, 234, 0.2) ${(formData.taskHours - 5) / 35 * 100}%, rgba(102, 126, 234, 0.2) 100%)`,
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    WebkitAppearance: 'none'
                  }}
                />
                <div className="flex justify-between text-sm mt-2" style={{ color: '#a0a9cc' }}>
                  <span>5 часов</span>
                  <span className="text-2xl font-bold" style={{ color: '#667eea' }}>{formData.taskHours} часов</span>
                  <span>40 часов</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <span className="text-sm">📊 Отчеты и аналитика</span>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <span className="text-sm">📧 Обработка email</span>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <span className="text-sm">📝 Создание контента</span>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <span className="text-sm">🔍 Поиск информации</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: '#a0a9cc' }}>
                Процент ошибок из-за человеческого фактора
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[5, 10, 15, 20].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setFormData({...formData, errorRate: rate})}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.errorRate === rate 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-2xl font-bold">{rate}%</div>
                  </button>
                ))}
              </div>
              <p className="text-sm mt-2" style={{ color: '#6b7280' }}>
                💡 AI снижает количество ошибок на 80-90%
              </p>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#e0e7ff' }}>
              Шаг 3: Текущие инструменты
            </h3>
            
            <div>
              <label className="block text-lg font-medium mb-3" style={{ color: '#a0a9cc' }}>
                Какие инструменты автоматизации вы используете сейчас?
              </label>
              <div className="space-y-3">
                {[
                  { value: 'none', label: 'Не используем автоматизацию', icon: '❌', desc: 'Все процессы выполняются вручную' },
                  { value: 'basic', label: 'Базовые инструменты', icon: '⚙️', desc: 'Excel, простые скрипты, шаблоны' },
                  { value: 'advanced', label: 'Продвинутые системы', icon: '🚀', desc: 'CRM, ERP, специализированное ПО' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({...formData, currentTools: option.value})}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                      formData.currentTools === option.value 
                        ? 'border-purple-500 bg-purple-500/20' 
                        : 'border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{option.icon}</span>
                      <div>
                        <div className="text-lg font-bold mb-1">{option.label}</div>
                        <div className="text-sm" style={{ color: '#6b7280' }}>{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm">
                ✅ На основе ваших данных мы рассчитаем точную экономию от внедрения AI
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <section className="py-20 px-4" id="roi-calculator">
      <div className="max-w-4xl mx-auto">
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
              Калькулятор экономии с AI
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Узнайте, сколько вы сэкономите за 3 простых шага
          </p>
        </motion.div>

        {/* Прогресс бар */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div 
                key={step}
                className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
              >
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {currentStep > step ? '✓' : step}
                </div>
                {step < 3 && (
                  <div 
                    className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > step ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: currentStep >= 1 ? '#667eea' : '#6b7280' }}>Команда</span>
            <span style={{ color: currentStep >= 2 ? '#667eea' : '#6b7280' }}>Процессы</span>
            <span style={{ color: currentStep >= 3 ? '#667eea' : '#6b7280' }}>Инструменты</span>
          </div>
        </div>

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
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}
        >
          {!showResult ? (
            <>
              <AnimatePresence mode="wait">
                {getStepContent()}
              </AnimatePresence>
              
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <motion.button
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl border-2 border-gray-600 hover:border-purple-400 transition-all"
                  >
                    ← Назад
                  </motion.button>
                )}
                <motion.button
                  onClick={nextStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  {currentStep === 3 ? 'Рассчитать экономию' : 'Далее →'}
                </motion.button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl font-bold mb-8 text-center" style={{ color: '#e0e7ff' }}>
                Ваша экономия с NeuroExpert
              </h3>
              
              {/* Главный результат */}
              <div className="text-center mb-8 p-8 rounded-2xl" style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(102, 126, 234, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div className="text-5xl font-bold mb-2" style={{ color: '#10b981' }}>
                  {formatCurrency(results.yearlySavings)}
                </div>
                <div className="text-xl" style={{ color: '#a0a9cc' }}>
                  экономия в год
                </div>
              </div>
              
              {/* Детальные метрики */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div 
                  className="p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">💰</div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#667eea' }}>
                        {formatCurrency(results.monthlySavings)}
                      </div>
                      <div className="text-sm" style={{ color: '#a0a9cc' }}>
                        экономия в месяц
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">📈</div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#667eea' }}>
                        {results.roi}%
                      </div>
                      <div className="text-sm" style={{ color: '#a0a9cc' }}>
                        возврат инвестиций (ROI)
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">⏱️</div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#667eea' }}>
                        {results.paybackMonths} мес.
                      </div>
                      <div className="text-sm" style={{ color: '#a0a9cc' }}>
                        срок окупаемости
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">🚀</div>
                    <div>
                      <div className="text-2xl font-bold" style={{ color: '#667eea' }}>
                        +{results.productivityGain}%
                      </div>
                      <div className="text-sm" style={{ color: '#a0a9cc' }}>
                        рост продуктивности
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* График визуализации */}
              <div className="mb-8 p-6 rounded-xl bg-gray-800/50">
                <h4 className="text-lg font-bold mb-4" style={{ color: '#e0e7ff' }}>
                  Что вы получите:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Автоматизация {formData.taskHours * formData.employees} часов работы в неделю</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Снижение ошибок на {Math.round(formData.errorRate * 0.8)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Освобождение времени для стратегических задач</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Масштабирование без увеличения штата</span>
                  </div>
                </div>
              </div>
              
              {/* CTA кнопки */}
              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 rounded-xl font-bold text-lg text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
                  }}
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Получить персональный расчет
                </motion.button>
                
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentStep(1);
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-all"
                >
                  ← Пересчитать
                </button>
              </div>
              
              <p className="text-center text-sm mt-6" style={{ color: '#6b7280' }}>
                * Расчет основан на средних показателях наших клиентов
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}