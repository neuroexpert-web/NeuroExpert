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
  
  const industryMultipliers: Record<string, number> = {
    retail: 1.2,
    services: 1.3,
    production: 1.1,
    it: 1.5,
    ecommerce: 1.4,
    finance: 1.6,
    healthcare: 1.3,
    education: 1.2,
    other: 1.0
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['budget', 'currentRevenue', 'expectedGrowth', 'automationSavings'].includes(name) 
        ? Number(value) 
        : value
    } as ROIFormData));
  };

  const calculateROI = (e: React.FormEvent): void => {
    e.preventDefault();
    
    const { budget, currentRevenue = 10000000, expectedGrowth = 20, automationSavings = 300000, industry } = formData;
    
    // Применяем формулу ROI из бизнес-логики:
    // ROI = ((Дополнительные доходы + Экономия) - Инвестиции) / Инвестиции × 100%
    
    // Дополнительные доходы
    const additionalRevenue = currentRevenue * (expectedGrowth / 100);
    
    // Применяем отраслевой коэффициент
    const industryCoef = industryMultipliers[industry] || 1.0;
    
    // Применяем сценарный коэффициент
    const scenarioCoef = scenarioMultipliers[selectedScenario];
    
    // Итоговые расчеты
    const totalAdditionalRevenue = additionalRevenue * industryCoef * scenarioCoef;
    const totalSavings = automationSavings * scenarioCoef;
    const totalBenefit = totalAdditionalRevenue + totalSavings;
    
    // ROI по формуле
    const roi = ((totalBenefit - budget) / budget) * 100;
    
    // Срок окупаемости в месяцах
    const monthlyBenefit = totalBenefit / 12;
    const payback = Math.ceil(budget / monthlyBenefit);
    
    setResults({
      roi: Math.round(roi),
      savings: Math.round(totalSavings),
      growth: Math.round(totalAdditionalRevenue),
      payback: payback,
      additionalRevenue: Math.round(totalAdditionalRevenue),
      totalBenefit: Math.round(totalBenefit)
    });
    
    setShowResult(true);
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
            <span className="aurora-text">Рассчитайте ROI</span> вашего проекта
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
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

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
                  min="0"
                  max="200"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

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
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

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
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="500000"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

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
                  onChange={handleInputChange}
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
                  <option value="other">Другое</option>
                </motion.select>
              </motion.div>
            </div>

            <motion.button
              type="submit"
              className={styles.submitButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.buttonText}>
                Узнать мою выгоду
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