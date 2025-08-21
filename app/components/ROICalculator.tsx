'use client';
import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIFormData, ROIResults } from '../../types';
import ROIResultModal from './ROIResultModal';

export default function ROICalculator(): JSX.Element {
  const [formData, setFormData] = useState<ROIFormData>({
    industry: '' as any,
    employeeCount: '' as any,
    investment: 0
  });
  
  const [showResult, setShowResult] = useState<boolean>(false);
  const [results, setResults] = useState<ROIResults>({
    roi: 0,
    profit: 0
  });
  
  // Определяем мобильное устройство
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Проверка на мобильное устройство
  if (typeof window !== 'undefined') {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkMobile);
    checkMobile();
  }

  // Более реалистичные коэффициенты отрасли
  const industryCoefficients: Record<ROIFormData['industry'], number> = {
    'retail': 1.3,        // Розничная торговля (было 1.8)
    'production': 1.4,    // Производство (было 2.1)
    'it': 1.6,           // IT и телеком (было 2.5)
    'finance': 1.5,      // Финансовые услуги (было 2.2)
    'construction': 1.35, // Строительство (было 1.9)
    'medicine': 1.55,    // Медицина (было 2.3)
    'logistics': 1.4,    // Логистика (было 2.0)
    'services': 1.25,    // Услуги (было 1.7)
    'other': 1.2        // Другое (было 1.5)
  };
  
  // Более реалистичные коэффициенты масштаба
  const scaleCoefficients: Record<ROIFormData['employeeCount'], number> = {
    'up10': 1.05,        // до 10 (было 1.1)
    'from11to50': 1.15,  // 11-50 (было 1.3)
    'from51to250': 1.25, // 51-250 (было 1.5)
    'over250': 1.35      // 250+ (было 1.7)
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    // Дополнительная валидация для суммы инвестиций
    if (name === 'investment') {
      const numValue = Number(value);
      // Ограничиваем сумму от 100 тыс до 100 млн
      if (numValue < 0) return; // Не позволяем отрицательные числа
      if (numValue > 100000000) return; // Максимум 100 млн
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'investment' ? Number(value) : value
    } as ROIFormData));
  };

  // Улучшенный расчет с более реалистичными показателями
  const calculateROI = async (): Promise<void> => {
    const { industry, employeeCount, investment } = formData;
    
    // Проверка минимальной суммы
    if (investment < 100000) {
      alert('Минимальная сумма инвестиций - 100 000 руб.');
      return;
    }
    
    // Получаем коэффициенты
    const k_industry = industryCoefficients[industry];
    const k_scale = scaleCoefficients[employeeCount];
    
    // Добавляем временной коэффициент (чем дольше, тем больше эффект)
    const k_time = 1.2; // Коэффициент за год использования
    
    // Улучшенная формула с учетом времени
    const yearProfit = investment * k_industry * k_scale * k_time - investment;
    
    // ROI за год
    const roi = (yearProfit / investment) * 100;
    
    // Дополнительные реалистичные метрики
    const savings = Math.round(investment * 0.25); // 25% экономия на операциях
    const growth = Math.round(yearProfit * 0.7); // 70% от прибыли - реальный рост
    const payback = Math.round((investment / (yearProfit / 12))); // Месяцы окупаемости
    
    setResults({ 
      roi: Math.round(roi), 
      profit: Math.round(yearProfit),
      savings,
      growth,
      payback: Math.min(payback, 36) // Максимум 36 месяцев
    });
    setShowResult(true);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Проверка валидности формы
  const isFormValid = formData.industry && formData.employeeCount && formData.investment > 0;

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
            background: 'rgba(20, 20, 40, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: isMobile ? '16px' : '32px',
            padding: isMobile ? '24px 16px' : '48px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(102, 126, 234, 0.2)'
          }}
        >
          <div className={isMobile ? "space-y-8" : "grid md:grid-cols-2 gap-8"}>
            {/* Форма ввода */}
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#e0e7ff' }}>
                Введите данные о вашем бизнесе
              </h3>
              
              <div className="space-y-6">
                {/* Поле 1: Отрасль вашего бизнеса */}
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
                      padding: isMobile ? '18px' : '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: isMobile ? '18px' : '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  >
                    <option value="" style={{ background: '#1a1a2e' }}>Выберите отрасль</option>
                    <option value="retail" style={{ background: '#1a1a2e' }}>Розничная торговля</option>
                    <option value="production" style={{ background: '#1a1a2e' }}>Производство</option>
                    <option value="it" style={{ background: '#1a1a2e' }}>IT и телеком</option>
                    <option value="finance" style={{ background: '#1a1a2e' }}>Финансовые услуги</option>
                    <option value="construction" style={{ background: '#1a1a2e' }}>Строительство</option>
                    <option value="medicine" style={{ background: '#1a1a2e' }}>Медицина</option>
                    <option value="logistics" style={{ background: '#1a1a2e' }}>Логистика</option>
                    <option value="services" style={{ background: '#1a1a2e' }}>Услуги</option>
                    <option value="other" style={{ background: '#1a1a2e' }}>Другое</option>
                  </select>
                </motion.div>

                {/* Поле 2: Количество сотрудников */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc' }}>
                    Количество сотрудников
                  </label>
                  <select
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: isMobile ? '18px' : '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: isMobile ? '18px' : '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  >
                    <option value="" style={{ background: '#1a1a2e' }}>Выберите диапазон</option>
                    <option value="up10" style={{ background: '#1a1a2e' }}>до 10</option>
                    <option value="from11to50" style={{ background: '#1a1a2e' }}>11-50</option>
                    <option value="from51to250" style={{ background: '#1a1a2e' }}>51-250</option>
                    <option value="over250" style={{ background: '#1a1a2e' }}>250+</option>
                  </select>
                </motion.div>

                {/* Поле 3: Планируемая сумма инвестиций */}
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#a0a9cc' }}>
                    Планируемая сумма инвестиций, ₽
                  </label>
                  <input
                    type="number"
                    name="investment"
                    value={formData.investment || ''}
                    onChange={handleInputChange}
                    placeholder="Например: 500000"
                    min="100000"
                    max="100000000"
                    step="50000"
                    style={{
                      width: '100%',
                      padding: isMobile ? '18px' : '16px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: isMobile ? '18px' : '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)'}
                  />
                </motion.div>

                {/* Кнопка расчета */}
                <motion.button
                  onClick={calculateROI}
                  disabled={!isFormValid}
                  whileHover={isFormValid ? { scale: 1.05 } : {}}
                  whileTap={isFormValid ? { scale: 0.95 } : {}}
                  animate={isFormValid ? {
                    boxShadow: [
                      '0 0 20px rgba(102, 126, 234, 0.4)',
                      '0 0 40px rgba(118, 75, 162, 0.6)',
                      '0 0 20px rgba(102, 126, 234, 0.4)'
                    ]
                  } : {}}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: isFormValid 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'rgba(102, 126, 234, 0.3)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                    marginTop: '32px',
                    opacity: isFormValid ? 1 : 0.6,
                    transition: 'all 0.3s ease'
                  }}
                >
                  Рассчитать потенциал
                </motion.button>
              </div>
            </div>

            {/* Информационный блок */}
            <div className={isMobile ? "text-center mt-8" : "hidden md:flex items-center justify-center"}>
              <div className="text-center">
                <div style={{ fontSize: isMobile ? '60px' : '120px', marginBottom: '20px' }}>📈</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#e0e7ff' }}>
                  Откройте потенциал вашего бизнеса
                </h3>
                <p style={{ color: '#a0a9cc', lineHeight: '1.8' }}>
                  Наш калькулятор поможет оценить финансовую выгоду от внедрения 
                  цифровых решений NeuroExpert на основе параметров вашего бизнеса
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
    </section>
  );
}