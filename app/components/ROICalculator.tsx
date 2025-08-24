'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIFormData, ROIResults } from '../../types';
import ROIResultModal from './ROIResultModal';
import styles from './ROICalculator.module.css';

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
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

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

  // Дополнительные факторы для более точных расчетов
  const industryGrowthFactors: Record<ROIFormData['industry'], number> = {
    retail: 0.25,
    services: 0.30,
    production: 0.20,
    it: 0.40,
    other: 0.15
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? Number(value) : value
    } as ROIFormData));
    
    // Показываем предварительный просмотр при изменении данных
    if (formData.budget > 0) {
      setShowPreview(true);
    }
  };

  // Предварительный расчет для отображения в реальном времени
  useEffect(() => {
    if (showPreview && formData.budget > 0) {
      const { businessSize, industry, budget } = formData;
      const baseROI = sizeMultipliers[businessSize] * industryMultipliers[industry];
      const previewROI = Math.round(baseROI * 100);
      
      // Обновляем превью без открытия модального окна
      setResults(prev => ({ ...prev, roi: previewROI }));
    }
  }, [formData, showPreview]);

  const calculateROI = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Имитация расчета с анимацией
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { businessSize, industry, budget } = formData;
    
    // Расчеты на основе множителей
    const baseROI = sizeMultipliers[businessSize] * industryMultipliers[industry];
    const growthFactor = industryGrowthFactors[industry];
    
    // Более детальные расчеты
    const roi = Math.round(baseROI * 100);
    const savings = Math.round(budget * 0.35 * (1 + growthFactor));
    const growth = Math.round(budget * baseROI * (1 + growthFactor));
    const payback = Math.round(budget / (savings / 12));
    
    setResults({ roi, savings, growth, payback });
    setIsCalculating(false);
    setShowResult(true);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Прогресс-индикатор для шагов формы
  const renderProgressIndicator = () => (
    <div className={styles.progressIndicator}>
      {[1, 2, 3].map((step) => (
        <motion.div
          key={step}
          className={`${styles.progressStep} ${currentStep >= step ? styles.active : ''}`}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ 
            scale: currentStep >= step ? 1 : 0.8,
            opacity: currentStep >= step ? 1 : 0.5
          }}
          transition={{ duration: 0.3 }}
        >
          <span>{step}</span>
        </motion.div>
      ))}
    </div>
  );

  // Интерактивный превью результатов
  const renderPreviewMetrics = () => (
    <AnimatePresence>
      {showPreview && formData.budget > 0 && (
        <motion.div
          className={styles.previewMetrics}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.previewCard}>
            <span className={styles.previewLabel}>Ожидаемый ROI</span>
            <motion.span 
              className={styles.previewValue}
              key={results.roi}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              ~{results.roi}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section className={styles.calculator}>
      <div className={styles.scrollableContent}>
        <div className={styles.container}>
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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L13.09 8.26L19 7L15.45 11.82L21 16L14.81 16.59L13.09 23L12 17L10.91 23L9.19 16.59L3 16L8.55 11.82L5 7L10.91 8.26L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
          <h2 className={styles.title}>
            <span className={styles.gradient}>Рассчитайте ROI</span> вашего проекта
          </h2>
          <p className={styles.subtitle}>
            Узнайте, какую выгоду принесет внедрение AI в ваш бизнес
          </p>
        </motion.div>

        {renderProgressIndicator()}

        <motion.div 
          className={styles.calculatorCard}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <form className={styles.form} onSubmit={(e) => calculateROI(e)}>
            <motion.div 
              className={styles.field}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              onFocus={() => setCurrentStep(1)}
            >
              <label htmlFor="budget" className={styles.label}>
                <svg className={styles.fieldIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Ваш бюджет на автоматизацию (₽)
              </label>
              <motion.input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Например: 500000"
                required
                min="50000"
                max="10000000"
                step="10000"
                whileFocus={{ scale: 1.02 }}
              />
              <div className={styles.inputHint}>
                Рекомендуемый бюджет: от {formatCurrency(100000)} до {formatCurrency(1000000)}
              </div>
            </motion.div>

            <motion.div 
              className={styles.field}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              onFocus={() => setCurrentStep(2)}
            >
              <label htmlFor="businessSize" className={styles.label}>
                <svg className={styles.fieldIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 13h2l3 9 4-17 3 8h2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Размер вашего бизнеса
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
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              onFocus={() => setCurrentStep(3)}
            >
              <label htmlFor="industry" className={styles.label}>
                <svg className={styles.fieldIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                  <path d="M9 9h6M9 12h6M9 15h6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Ваша отрасль
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
                <option value="services">Услуги</option>
                <option value="production">Производство</option>
                <option value="it">IT и технологии</option>
                <option value="other">Другое</option>
              </motion.select>
            </motion.div>

            {renderPreviewMetrics()}

            <motion.button
              type="submit"
              className={styles.submitButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <motion.div
                  className={styles.loadingSpinner}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 12a9 9 0 11-6.219-8.56" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </motion.div>
              ) : (
                <>
                  <span className={styles.buttonText}>
                    Рассчитать ROI
                  </span>
                  <motion.svg
                    className={styles.buttonIcon}
                    width="20" height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </motion.svg>
                </>
              )}
            </motion.button>
          </form>

          {/* Анимированные декоративные элементы */}
          <motion.div 
            className={styles.floatingElement1}
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className={styles.floatingElement2}
            animate={{ 
              y: [10, -10, 10],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Информационные карточки с преимуществами */}
        <motion.div 
          className={styles.benefitsGrid}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[
            { title: "Быстрая окупаемость", value: "3-6 месяцев", icon: "⚡" },
            { title: "Рост эффективности", value: "до 300%", icon: "📈" },
            { title: "Экономия времени", value: "80% задач", icon: "⏱️" }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className={styles.benefitCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className={styles.benefitIcon}>{benefit.icon}</span>
              <h4>{benefit.title}</h4>
              <p>{benefit.value}</p>
            </motion.div>
          ))}
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
      </div>
    </section>
  );
}