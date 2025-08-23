'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
// Временно отключаем JSON Vault для деплоя
// import { getVault } from '../lib/jsonVault.js';
import styles from './AdvancedROICalculator.module.css';

interface ServicePricing {
  audit: { min: number; max: number };
  strategy: { min: number; max: number };
  design: { min: number; max: number };
  development: { min: number; max: number };
  aiIntegration: { min: number; max: number };
  support: { min: number; max: number };
}

interface MonteCarloResult {
  mean: number;
  median: number;
  percentile5: number;
  percentile95: number;
  standardDeviation: number;
}

interface CalculationResult {
  baseROI: number;
  optimisticROI: number;
  pessimisticROI: number;
  savings: number;
  paybackPeriod: number;
  npv: number;
  irr: number;
  breakEvenPoint: number;
  monteCarloResult: MonteCarloResult;
  recommendedPrice: number;
  services: string[];
}

// Цены из ТЗ (в рублях)
const SERVICE_PRICING: ServicePricing = {
  audit: { min: 200000, max: 400000 },
  strategy: { min: 270000, max: 670000 },
  design: { min: 400000, max: 930000 },
  development: { min: 670000, max: 2000000 },
  aiIntegration: { min: 530000, max: 1070000 },
  support: { min: 400000, max: 800000 }
};

export default function AdvancedROICalculator() {
  const [formData, setFormData] = useState({
    businessSize: 'medium',
    industry: 'retail',
    revenue: 50000000,
    employees: 50,
    currentDigitalSpend: 1000000,
    growthTarget: 30,
    timeframe: 12,
    riskTolerance: 'moderate'
  });

  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResult | null>(null);

  // Monte Carlo симуляция
  const runMonteCarloSimulation = useCallback((baseROI: number, iterations: number = 10000): MonteCarloResult => {
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      // Добавляем случайные факторы
      const marketFactor = 0.8 + Math.random() * 0.4; // 80-120%
      const executionFactor = 0.7 + Math.random() * 0.5; // 70-120%
      const competitionFactor = 0.9 + Math.random() * 0.2; // 90-110%
      const economicFactor = 0.85 + Math.random() * 0.3; // 85-115%
      
      const simulatedROI = baseROI * marketFactor * executionFactor * competitionFactor * economicFactor;
      results.push(simulatedROI);
    }
    
    // Сортируем для расчета перцентилей
    results.sort((a, b) => a - b);
    
    const mean = results.reduce((a, b) => a + b, 0) / results.length;
    const median = results[Math.floor(results.length / 2)];
    const percentile5 = results[Math.floor(results.length * 0.05)];
    const percentile95 = results[Math.floor(results.length * 0.95)];
    
    // Стандартное отклонение
    const variance = results.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / results.length;
    const standardDeviation = Math.sqrt(variance);
    
    return { mean, median, percentile5, percentile95, standardDeviation };
  }, []);

  // Расчет NPV (Net Present Value)
  const calculateNPV = useCallback((cashFlows: number[], discountRate: number): number => {
    return cashFlows.reduce((npv, cashFlow, t) => {
      return npv + cashFlow / Math.pow(1 + discountRate, t);
    }, 0);
  }, []);

  // Расчет IRR (Internal Rate of Return)
  const calculateIRR = useCallback((cashFlows: number[]): number => {
    let rate = 0.1;
    let lastNPV = 0;
    
    for (let i = 0; i < 100; i++) {
      const npv = calculateNPV(cashFlows, rate);
      if (Math.abs(npv) < 0.01) return rate;
      
      if (npv > 0) {
        rate += 0.01;
      } else {
        rate -= 0.001;
      }
      
      if (Math.abs(npv - lastNPV) < 0.0001) break;
      lastNPV = npv;
    }
    
    return rate;
  }, [calculateNPV]);

  // Автоматическое ценообразование
  const calculatePricing = useCallback((formData: any): { price: number; services: string[] } => {
    const services: string[] = [];
    let totalPrice = 0;
    
    // Всегда включаем аудит
    services.push('Аудит цифровой зрелости');
    totalPrice += (SERVICE_PRICING.audit.min + SERVICE_PRICING.audit.max) / 2;
    
    // Стратегия для средних и крупных компаний
    if (['medium', 'large'].includes(formData.businessSize)) {
      services.push('Стратегия цифровой трансформации');
      totalPrice += (SERVICE_PRICING.strategy.min + SERVICE_PRICING.strategy.max) / 2;
    }
    
    // Дизайн и разработка в зависимости от целей роста
    if (formData.growthTarget > 20) {
      services.push('UX/UI Дизайн');
      totalPrice += (SERVICE_PRICING.design.min + SERVICE_PRICING.design.max) / 2;
      
      services.push('Разработка платформы');
      totalPrice += (SERVICE_PRICING.development.min + SERVICE_PRICING.development.max) / 2;
    }
    
    // AI интеграция для инновационных компаний
    if (['it', 'services'].includes(formData.industry) || formData.growthTarget > 30) {
      services.push('Интеграция AI и автоматизация');
      totalPrice += (SERVICE_PRICING.aiIntegration.min + SERVICE_PRICING.aiIntegration.max) / 2;
    }
    
    // Поддержка всегда включена
    services.push('Поддержка и мониторинг (12 мес)');
    totalPrice += SERVICE_PRICING.support.min;
    
    // Скидка за полный пакет
    if (services.length >= 5) {
      totalPrice *= 0.85; // 15% скидка
    }
    
    return { price: Math.round(totalPrice), services };
  }, []);

  // Основной расчет
  const calculateAdvancedROI = useCallback(async () => {
    setIsCalculating(true);
    
    // Эмуляция времени расчета
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Базовые расчеты
    const digitalMaturityMultiplier = formData.businessSize === 'small' ? 3.5 : 
                                     formData.businessSize === 'medium' ? 4.2 : 5.0;
    
    const industryMultiplier = {
      retail: 1.2,
      services: 1.4,
      production: 1.1,
      it: 1.6,
      other: 1.0
    }[formData.industry] || 1.0;
    
    const baseROI = digitalMaturityMultiplier * industryMultiplier * 100;
    
    // Monte Carlo симуляция
    const monteCarloResult = runMonteCarloSimulation(baseROI);
    
    // Ценообразование
    const { price: recommendedPrice, services } = calculatePricing(formData);
    
    // Расчет экономии и cash flow
    const annualSavings = formData.revenue * 0.15; // 15% экономия
    const annualGrowth = formData.revenue * (formData.growthTarget / 100);
    const totalBenefit = annualSavings + annualGrowth;
    
    // Cash flow для NPV и IRR
    const cashFlows = [-recommendedPrice];
    for (let i = 1; i <= formData.timeframe; i++) {
      cashFlows.push(totalBenefit * Math.pow(1.05, i - 1)); // 5% ежегодный рост
    }
    
    const npv = calculateNPV(cashFlows, 0.1); // 10% ставка дисконтирования
    const irr = calculateIRR(cashFlows);
    
    // Точка безубыточности
    const breakEvenPoint = Math.ceil(recommendedPrice / (totalBenefit / 12));
    
    const result: CalculationResult = {
      baseROI: Math.round(baseROI),
      optimisticROI: Math.round(monteCarloResult.percentile95),
      pessimisticROI: Math.round(monteCarloResult.percentile5),
      savings: Math.round(annualSavings),
      paybackPeriod: Math.round(recommendedPrice / totalBenefit * 12),
      npv: Math.round(npv),
      irr: Math.round(irr * 100),
      breakEvenPoint,
      monteCarloResult,
      recommendedPrice,
      services
    };
    
    setResults(result);
    setShowResults(true);
    setIsCalculating(false);
    
    // Временно отключено для деплоя
    // const vault = getVault();
    // vault.saveROICalculation({
    //   businessSize: formData.businessSize,
    //   industry: formData.industry,
    //   baseROI: result.baseROI,
    //   optimisticROI: result.optimisticROI,
    //   pessimisticROI: result.pessimisticROI,
    //   recommendedPrice: result.recommendedPrice,
    //   services: result.services
    // });
    
    // vault.recordAnalyticsEvent('roi_calculation', {
    //   businessSize: formData.businessSize,
    //   industry: formData.industry,
    //   baseROI: result.baseROI
    // });
  }, [formData, runMonteCarloSimulation, calculatePricing, calculateNPV, calculateIRR]);

  // Генерация PDF с коммерческим предложением
  const generatePDF = useCallback(() => {
    if (!results) return;
    
    const doc = new jsPDF();
    
    // Заголовок
    doc.setFontSize(24);
    doc.text('Коммерческое предложение', 20, 30);
    doc.setFontSize(16);
    doc.text('NeuroExpert - Цифровая трансформация', 20, 40);
    
    // Информация о клиенте
    doc.setFontSize(12);
    doc.text(`Размер бизнеса: ${formData.businessSize}`, 20, 60);
    doc.text(`Отрасль: ${formData.industry}`, 20, 70);
    doc.text(`Текущая выручка: ${formData.revenue.toLocaleString('ru-RU')} ₽`, 20, 80);
    
    // Предложение
    doc.setFontSize(14);
    doc.text('Рекомендуемые услуги:', 20, 100);
    
    let yPos = 110;
    results.services.forEach((service, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${service}`, 30, yPos);
      yPos += 10;
    });
    
    // Финансовые показатели
    doc.setFontSize(14);
    doc.text('Прогнозируемые результаты:', 20, yPos + 10);
    
    doc.setFontSize(12);
    doc.text(`ROI: ${results.baseROI}% (${results.pessimisticROI}% - ${results.optimisticROI}%)`, 30, yPos + 20);
    doc.text(`Экономия: ${results.savings.toLocaleString('ru-RU')} ₽/год`, 30, yPos + 30);
    doc.text(`Срок окупаемости: ${results.paybackPeriod} мес.`, 30, yPos + 40);
    doc.text(`NPV: ${results.npv.toLocaleString('ru-RU')} ₽`, 30, yPos + 50);
    doc.text(`IRR: ${results.irr}%`, 30, yPos + 60);
    
    // Стоимость
    doc.setFontSize(16);
    doc.text(`Стоимость проекта: ${results.recommendedPrice.toLocaleString('ru-RU')} ₽`, 20, yPos + 80);
    
    // Скидка
    if (results.services.length >= 5) {
      doc.setFontSize(12);
      doc.text('*Включена скидка 15% за комплексный пакет', 20, yPos + 90);
    }
    
    // Сохранение
    doc.save(`КП_NeuroExpert_${new Date().toLocaleDateString('ru-RU')}.pdf`);
  }, [results, formData]);

  return (
    <div className={styles.calculator}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.title}>
          Продвинутый <span className="neon-text">ROI калькулятор</span>
        </h2>
        <p className={styles.subtitle}>
          С Monte Carlo симуляцией и автоматическим ценообразованием
        </p>
      </motion.div>

      {!showResults ? (
        <motion.form 
          className={styles.form}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Размер бизнеса</label>
              <select 
                value={formData.businessSize}
                onChange={(e) => setFormData({...formData, businessSize: e.target.value})}
                className={styles.select}
              >
                <option value="small">Малый (до 100 млн ₽)</option>
                <option value="medium">Средний (100-500 млн ₽)</option>
                <option value="large">Крупный (500+ млн ₽)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Отрасль</label>
              <select 
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className={styles.select}
              >
                <option value="retail">Розничная торговля</option>
                <option value="services">Услуги</option>
                <option value="production">Производство</option>
                <option value="it">IT и технологии</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Годовая выручка (₽)</label>
              <input 
                type="number"
                value={formData.revenue}
                onChange={(e) => setFormData({...formData, revenue: Number(e.target.value)})}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Количество сотрудников</label>
              <input 
                type="number"
                value={formData.employees}
                onChange={(e) => setFormData({...formData, employees: Number(e.target.value)})}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Текущие расходы на цифровизацию (₽/год)</label>
              <input 
                type="number"
                value={formData.currentDigitalSpend}
                onChange={(e) => setFormData({...formData, currentDigitalSpend: Number(e.target.value)})}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Целевой рост (%)</label>
              <input 
                type="number"
                value={formData.growthTarget}
                onChange={(e) => setFormData({...formData, growthTarget: Number(e.target.value)})}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Период расчета (мес)</label>
              <input 
                type="number"
                value={formData.timeframe}
                onChange={(e) => setFormData({...formData, timeframe: Number(e.target.value)})}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Толерантность к риску</label>
              <select 
                value={formData.riskTolerance}
                onChange={(e) => setFormData({...formData, riskTolerance: e.target.value})}
                className={styles.select}
              >
                <option value="low">Низкая</option>
                <option value="moderate">Умеренная</option>
                <option value="high">Высокая</option>
              </select>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={calculateAdvancedROI}
            className={`${styles.calculateButton} neon-button`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>Анализируем данные...</>
            ) : (
              <>Рассчитать ROI с Monte Carlo</>
            )}
          </motion.button>
        </motion.form>
      ) : (
        <motion.div 
          className={styles.results}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className={styles.resultsTitle}>Результаты анализа</h3>
          
          <div className={styles.resultsGrid}>
            <motion.div 
              className={`${styles.resultCard} neon-card`}
              whileHover={{ scale: 1.02 }}
            >
              <h4>ROI (Monte Carlo)</h4>
              <div className={styles.roiRange}>
                <span className={styles.pessimistic}>{results?.pessimisticROI}%</span>
                <span className={styles.base}>{results?.baseROI}%</span>
                <span className={styles.optimistic}>{results?.optimisticROI}%</span>
              </div>
              <p className={styles.resultLabel}>Пессимистичный • Базовый • Оптимистичный</p>
            </motion.div>

            <motion.div 
              className={`${styles.resultCard} neon-card`}
              whileHover={{ scale: 1.02 }}
            >
              <h4>Финансовые показатели</h4>
              <div className={styles.metrics}>
                <div>
                  <span className={styles.metricValue}>{results?.savings.toLocaleString('ru-RU')} ₽</span>
                  <span className={styles.metricLabel}>Годовая экономия</span>
                </div>
                <div>
                  <span className={styles.metricValue}>{results?.paybackPeriod} мес</span>
                  <span className={styles.metricLabel}>Окупаемость</span>
                </div>
                <div>
                  <span className={styles.metricValue}>{results?.irr}%</span>
                  <span className={styles.metricLabel}>IRR</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className={`${styles.resultCard} neon-card`}
              whileHover={{ scale: 1.02 }}
            >
              <h4>Рекомендованный пакет услуг</h4>
              <ul className={styles.servicesList}>
                {results?.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
              <div className={styles.price}>
                <span className={styles.priceLabel}>Инвестиции:</span>
                <span className={styles.priceValue}>
                  {results?.recommendedPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </motion.div>
          </div>

          <div className={styles.actions}>
            <motion.button
              onClick={generatePDF}
              className={`${styles.actionButton} neon-button`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Скачать коммерческое предложение (PDF)
            </motion.button>
            
            <motion.button
              onClick={() => setShowResults(false)}
              className={styles.backButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Новый расчет
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}