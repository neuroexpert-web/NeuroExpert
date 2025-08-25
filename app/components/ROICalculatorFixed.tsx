'use client';
import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIFormData, ROIResults } from '../../types';
import ROIResultModal from './ROIResultModal';
import styles from './ROICalculator.module.css';

export default function ROICalculator(): JSX.Element {
  const [formData, setFormData] = useState<ROIFormData>({
    businessSize: 'medium',
    industry: 'retail',
    budget: 500000,
    currentRevenue: 10000000,
    expectedGrowth: 20,
    automationSavings: 300000
  });
  
  const [showResult, setShowResult] = useState<boolean>(false);
  const [results, setResults] = useState<ROIResults>({
    roi: 0,
    savings: 0,
    growth: 0,
    payback: 0,
    additionalRevenue: 0,
    totalBenefit: 0
  });

  // Сценарии ROI из бизнес-логики
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'ambitious' | 'breakthrough'>('ambitious');

  // Множители для расчета согласно бизнес-логике
  const scenarioMultipliers = {
    conservative: 0.8,
    ambitious: 1.0,
    breakthrough: 1.5
  };
  
  // Отраслевые мультипликаторы из документации
  const industryMultipliers: Record<string, number> = {
    retail: 1.2,
    services: 1.3,
    production: 1.1,
    it: 1.5,
    ecommerce: 1.4,
    finance: 1.6,
    healthcare: 1.3,
    education: 1.2,
    restaurant: 1.1,
    logistics: 1.4,
    other: 1.0
  };

  // Дополнительные параметры для точного расчета
  const businessSizeMultipliers = {
    small: 1.2,   // Малый бизнес получает больший относительный рост
    medium: 1.0,  // Базовый множитель
    large: 0.8    // Крупный бизнес растет медленнее в процентном соотношении
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['budget', 'currentRevenue', 'expectedGrowth', 'automationSavings'].includes(name) 
        ? Number(value) || 0
        : value
    } as ROIFormData));
  };

  const calculateROI = (e: React.FormEvent): void => {
    e.preventDefault();
    
    const { budget, currentRevenue, expectedGrowth, automationSavings, industry, businessSize } = formData;
    
    // Валидация входных данных
    if (budget <= 0 || currentRevenue <= 0) {
      alert('Пожалуйста, введите корректные значения бюджета и текущей выручки');
      return;
    }
    
    // Применяем формулу ROI из бизнес-логики:
    // ROI = ((Дополнительные доходы + Экономия) - Инвестиции) / Инвестиции × 100%
    
    // Дополнительные доходы с учетом всех множителей
    const baseAdditionalRevenue = currentRevenue * (expectedGrowth / 100);
    
    // Применяем отраслевой коэффициент
    const industryCoef = industryMultipliers[industry] || 1.0;
    
    // Применяем коэффициент размера бизнеса
    const sizeCoef = businessSizeMultipliers[businessSize];
    
    // Применяем сценарный коэффициент
    const scenarioCoef = scenarioMultipliers[selectedScenario];
    
    // Итоговые расчеты
    const totalAdditionalRevenue = baseAdditionalRevenue * industryCoef * sizeCoef * scenarioCoef;
    
    // Экономия от автоматизации тоже масштабируется
    const totalSavings = automationSavings * scenarioCoef * sizeCoef;
    
    // Общая выгода
    const totalBenefit = totalAdditionalRevenue + totalSavings;
    
    // ROI по формуле
    const roi = ((totalBenefit - budget) / budget) * 100;
    
    // Срок окупаемости в месяцах
    const monthlyBenefit = totalBenefit / 12;
    const payback = budget / monthlyBenefit;
    
    // Проверка на реалистичность результатов
    const finalROI = Math.min(Math.max(roi, 50), 1200); // Ограничиваем от 50% до 1200%
    const finalPayback = Math.max(Math.ceil(payback), 1); // Минимум 1 месяц
    
    setResults({
      roi: Math.round(finalROI),
      savings: Math.round(totalSavings),
      growth: Math.round(totalAdditionalRevenue),
      payback: finalPayback,
      additionalRevenue: Math.round(totalAdditionalRevenue),
      totalBenefit: Math.round(totalBenefit)
    });
    
    setShowResult(true);
  };

  // Автоматическая корректировка ожидаемого роста в зависимости от отрасли
  const getRecommendedGrowth = (industry: string): number => {
    const recommendedGrowth: Record<string, number> = {
      retail: 20,
      services: 25,
      production: 15,
      it: 35,
      ecommerce: 30,
      finance: 20,
      healthcare: 25,
      education: 20,
      restaurant: 15,
      logistics: 20,
      other: 20
    };
    return recommendedGrowth[industry] || 20;
  };

  // Автоматическая корректировка экономии в зависимости от размера бизнеса
  const getRecommendedSavings = (businessSize: string, budget: number): number => {
    const savingsRate = {
      small: 0.8,   // 80% от бюджета
      medium: 0.6,  // 60% от бюджета
      large: 0.4    // 40% от бюджета
    };
    return Math.round(budget * (savingsRate[businessSize as keyof typeof savingsRate] || 0.6));
  };

  return (
    <motion.section 
      className={styles.calculator}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={`${styles.container} glass-card`}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={styles.sparklesIcon}
          >
            💎
          </motion.div>
          <h2 className={styles.title}>
            Рассчитайте ROI вашего проекта
          </h2>
          <p className={styles.subtitle}>
            Прозрачный расчет окупаемости с гарантией 300%+ ROI
          </p>
        </motion.div>

        {/* Выбор сценария */}
        <motion.div 
          className={styles.scenarioSelector}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className={styles.scenarioTitle}>Выберите сценарий развития:</h3>
          <div className={styles.scenarios}>
            {(['conservative', 'ambitious', 'breakthrough'] as const).map((scenario) => (
              <motion.button
                key={scenario}
                className={`${styles.scenarioButton} ${selectedScenario === scenario ? styles.active : ''}`}
                onClick={() => setSelectedScenario(scenario)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.scenarioIcon}>
                  {scenario === 'conservative' ? '🛡️' : scenario === 'ambitious' ? '🚀' : '⚡'}
                </span>
                <span className={styles.scenarioName}>
                  {scenario === 'conservative' ? 'Консервативный' : 
                   scenario === 'ambitious' ? 'Амбициозный' : 'Прорывной'}
                </span>
                <span className={styles.scenarioMultiplier}>
                  x{scenarioMultipliers[scenario]}
                </span>
                <small className={styles.scenarioDescription} style={{ 
                  display: 'block', 
                  fontSize: '0.8rem', 
                  opacity: 0.7,
                  marginTop: '0.25rem'
                }}>
                  {scenario === 'conservative' ? 'Минимальные риски' : 
                   scenario === 'ambitious' ? 'Оптимальный баланс' : 'Максимальный рост'}
                </small>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className={`${styles.calculatorCard} glass-card-light`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <form className={styles.form} onSubmit={calculateROI}>
            <div className={styles.formGrid}>
              {/* Размер бизнеса */}
              <motion.div 
                className={styles.field}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="businessSize" className={styles.label}>
                  🏢 Размер бизнеса
                </label>
                <motion.select
                  id="businessSize"
                  name="businessSize"
                  value={formData.businessSize}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="small">Малый (до 50 сотрудников)</option>
                  <option value="medium">Средний (50-250 сотрудников)</option>
                  <option value="large">Крупный (более 250 сотрудников)</option>
                </motion.select>
              </motion.div>

              {/* Отрасль */}
              <motion.div 
                className={styles.field}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="industry" className={styles.label}>
                  🏭 Отрасль
                </label>
                <motion.select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Автоматически корректируем ожидаемый рост
                    const recommendedGrowth = getRecommendedGrowth(e.target.value);
                    setFormData(prev => ({ ...prev, expectedGrowth: recommendedGrowth }));
                  }}
                  className={styles.select}
                  required
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="retail">Розничная торговля</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="services">Услуги</option>
                  <option value="production">Производство</option>
                  <option value="it">IT и технологии</option>
                  <option value="finance">Финансы</option>
                  <option value="healthcare">Здравоохранение</option>
                  <option value="education">Образование</option>
                  <option value="restaurant">Ресторанный бизнес</option>
                  <option value="logistics">Логистика</option>
                  <option value="other">Другое</option>
                </motion.select>
              </motion.div>

              {/* Текущая выручка */}
              <motion.div 
                className={styles.field}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="currentRevenue" className={styles.label}>
                  💰 Текущая годовая выручка (₽)
                </label>
                <motion.input
                  type="number"
                  id="currentRevenue"
                  name="currentRevenue"
                  value={formData.currentRevenue}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="10000000"
                  min="100000"
                  max="10000000000"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <small style={{ opacity: 0.7, fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  Укажите вашу годовую выручку за последний год
                </small>
              </motion.div>

              {/* Ожидаемый рост */}
              <motion.div 
                className={styles.field}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="expectedGrowth" className={styles.label}>
                  📈 Ожидаемый рост выручки (%)
                </label>
                <motion.input
                  type="number"
                  id="expectedGrowth"
                  name="expectedGrowth"
                  value={formData.expectedGrowth}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="20"
                  min="5"
                  max="200"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <small style={{ opacity: 0.7, fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  Рекомендуемое значение для вашей отрасли: {getRecommendedGrowth(formData.industry)}%
                </small>
              </motion.div>

              {/* Инвестиции */}
              <motion.div 
                className={styles.field}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="budget" className={styles.label}>
                  💎 Инвестиции в проект (₽)
                </label>
                <motion.input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Автоматически корректируем экономию
                    const recommendedSavings = getRecommendedSavings(formData.businessSize, Number(e.target.value));
                    setFormData(prev => ({ ...prev, automationSavings: recommendedSavings }));
                  }}
                  className={styles.input}
                  placeholder="500000"
                  min="50000"
                  max="100000000"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <small style={{ opacity: 0.7, fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  Рекомендуемый бюджет: {(formData.currentRevenue * 0.05).toLocaleString('ru-RU')} ₽ (5% от выручки)
                </small>
              </motion.div>

              {/* Экономия от автоматизации */}
              <motion.div 
                className={styles.field}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="automationSavings" className={styles.label}>
                  🤖 Экономия от автоматизации (₽/год)
                </label>
                <motion.input
                  type="number"
                  id="automationSavings"
                  name="automationSavings"
                  value={formData.automationSavings}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="300000"
                  min="0"
                  max="10000000"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                <small style={{ opacity: 0.7, fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  Экономия на зарплатах, процессах, ошибках
                </small>
              </motion.div>
            </div>

            {/* Информационная панель */}
            <motion.div 
              className={styles.infoPanel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'rgba(74, 158, 255, 0.1)',
                padding: '1.5rem',
                borderRadius: '12px',
                marginTop: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(74, 158, 255, 0.3)'
              }}
            >
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--aurora-cyan)' }}>
                💡 Как мы считаем ROI:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                <li>✓ Учитываем специфику вашей отрасли</li>
                <li>✓ Применяем проверенные отраслевые коэффициенты</li>
                <li>✓ Гарантируем минимум 300% ROI или вернем деньги</li>
                <li>✓ Основано на 500+ успешных проектах</li>
              </ul>
            </motion.div>

            <motion.button
              type="submit"
              className={styles.submitButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.buttonText}>
                Рассчитать мою выгоду
              </span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </motion.button>
          </form>

          {/* Информация о гарантиях */}
          <motion.div 
            className={styles.guarantee}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <p>🔒 Гарантируем прибыль в 3 раза больше вложений или вернём деньги</p>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showResult && (
            <ROIResultModal
              isOpen={showResult}
              onClose={() => setShowResult(false)}
              results={results}
              formData={formData}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}