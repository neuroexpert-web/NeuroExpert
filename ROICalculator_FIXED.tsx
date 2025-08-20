'use client';
import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ROIResultModal from './ROIResultModal';

// Типы согласно ТЗ
interface ROIFormData {
  industry: string;
  employeeCount: string;
  investment: number;
}

interface ROIResults {
  profit: number;
  roi: number;
}

export default function ROICalculator(): JSX.Element {
  const [formData, setFormData] = useState<ROIFormData>({
    industry: '',
    employeeCount: '',
    investment: 0
  });
  
  const [showResult, setShowResult] = useState<boolean>(false);
  const [results, setResults] = useState<ROIResults>({
    profit: 0,
    roi: 0
  });

  // Коэффициенты отрасли согласно ТЗ
  const industryCoefficients: Record<string, number> = {
    'retail': 1.8,        // Розничная торговля
    'production': 2.1,    // Производство
    'it': 2.5,           // IT и телеком
    'finance': 2.2,      // Финансовые услуги (предположительно)
    'construction': 1.9, // Строительство (предположительно)
    'medicine': 2.3,     // Медицина (предположительно)
    'logistics': 2.0,    // Логистика (предположительно)
    'services': 1.7,     // Услуги (предположительно)
    'other': 1.5        // Другое
  };
  
  // Коэффициенты масштаба согласно ТЗ
  const scaleCoefficients: Record<string, number> = {
    'up10': 1.1,        // до 10
    'from11to50': 1.3,  // 11-50
    'from51to250': 1.5, // 51-250
    'over250': 1.7      // 250+ (предположительно)
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'investment' ? Number(value) : value
    }));
  };

  // Расчет согласно формуле из ТЗ
  const calculateROI = async (): Promise<void> => {
    const { industry, employeeCount, investment } = formData;
    
    // Получаем коэффициенты
    const k_industry = industryCoefficients[industry] || 1.5;
    const k_scale = scaleCoefficients[employeeCount] || 1.1;
    
    // Формула из ТЗ: Profit = Сумма_Инвестиций * K_industry * K_scale - Сумма_Инвестиций
    const profit = investment * k_industry * k_scale - investment;
    
    // Формула из ТЗ: ROI (%) = (Profit / Сумма_Инвестиций) * 100
    const roi = (profit / investment) * 100;
    
    setResults({ 
      profit: Math.round(profit), 
      roi: Math.round(roi) 
    });
    setShowResult(true);
  };

  // Форматирование валюты с разделением разрядов
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Форматирование числа при вводе
  const formatNumberInput = (value: string): string => {
    const number = value.replace(/\D/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
            borderRadius: '32px',
            padding: '48px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(102, 126, 234, 0.2)'
          }}
          className="calculator-responsive"
        >
          <div className="grid md:grid-cols-2 gap-8">
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
                    placeholder="Например: 500 000"
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
            <div className="hidden md:flex items-center justify-center">
              <div className="text-center">
                <div style={{ fontSize: '120px', marginBottom: '20px' }}>📈</div>
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

        {/* Модальное окно с результатами (нужно обновить) */}
        <AnimatePresence>
          {showResult && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowResult(false)}
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
                  borderRadius: '32px',
                  padding: '48px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
                  maxWidth: '600px',
                  width: '90%',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  zIndex: 1001
                }}
                className="modal-responsive"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <h2 style={{
                    fontSize: '36px',
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

                {/* Основные результаты */}
                <div style={{ marginBottom: '32px' }}>
                  {/* Потенциальная годовая прибыль */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                    padding: '32px',
                    borderRadius: '20px',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    textAlign: 'center',
                    marginBottom: '24px'
                  }}>
                    <h3 style={{ color: '#a0a0a0', marginBottom: '8px', fontSize: '18px' }}>
                      Потенциальная годовая прибыль
                    </h3>
                    <div style={{
                      fontSize: '48px',
                      fontWeight: '700',
                      color: '#48bb78',
                      marginBottom: '8px'
                    }}>
                      + {formatCurrency(results.profit)}
                    </div>
                  </div>

                  {/* ROI */}
                  <div style={{
                    background: 'rgba(72, 187, 120, 0.1)',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(72, 187, 120, 0.3)',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ color: '#a0a0a0', marginBottom: '8px', fontSize: '18px' }}>
                      Возврат на инвестиции (ROI)
                    </h3>
                    <div style={{
                      fontSize: '56px',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {results.roi}%
                    </div>
                  </div>
                </div>

                {/* Сопроводительный текст */}
                <div style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  padding: '24px',
                  borderRadius: '16px',
                  marginBottom: '32px',
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  <p style={{ color: '#e0e7ff', fontSize: '18px', lineHeight: '1.8', textAlign: 'center' }}>
                    Инвестировав <strong>{formatCurrency(formData.investment)}</strong>, 
                    вы можете получить до <strong>{formatCurrency(results.profit)}</strong> чистой 
                    прибыли в первый год, что соответствует возврату на инвестиции 
                    в <strong>{results.roi}%</strong>
                  </p>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Открыть чат с AI или перейти к форме контакта
                      setShowResult(false);
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
                    Обсудить проект с экспертом
                  </motion.button>
                </div>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowResult(false)}
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
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .calculator-responsive {
            padding: 24px !important;
          }
          
          .modal-responsive {
            padding: 24px !important;
          }
          
          .modal-responsive h2 {
            font-size: 28px !important;
          }
          
          .modal-responsive h3 {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}