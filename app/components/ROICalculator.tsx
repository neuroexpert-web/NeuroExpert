'use client';
import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROIFormData, ROIResults } from '../../types';
import ROIResultModal from './ROIResultModal';
import styles from './ROICalculator.module.css';
import NeonButton from './NeonButton';

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
    <motion.section 
      className={styles.calculator}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
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
            {/* <Sparkles className={styles.icon} /> */}
          </motion.div>
          <h2 className={styles.title}>
            <span className={styles.gradient}>Рассчитайте ROI</span> вашего проекта
          </h2>
          <p className={styles.subtitle}>
            Узнайте, какую выгоду принесет внедрение AI в ваш бизнес
          </p>
        </motion.div>

        <motion.div 
          className={styles.calculatorCard}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <form className={styles.form} onSubmit={calculateROI}>
            <motion.div 
              className={styles.field}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="budget" className={styles.label}>
                {/* <DollarSign className={styles.fieldIcon} /> */}
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
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div 
              className={styles.field}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="businessSize" className={styles.label}>
                {/* <TrendingUp className={styles.fieldIcon} /> */}
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
                <option value="">Выберите размер</option>
                <option value="small">Малый (до 50 сотрудников)</option>
                <option value="medium">Средний (50-250 сотрудников)</option>
                <option value="large">Крупный (более 250 сотрудников)</option>
              </motion.select>
            </motion.div>

            <motion.div 
              className={styles.field}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="industry" className={styles.label}>
                {/* <Clock className={styles.fieldIcon} /> */}
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
                <option value="">Выберите отрасль</option>
                <option value="retail">Розничная торговля</option>
                <option value="services">Услуги</option>
                <option value="production">Производство</option>
                <option value="it">IT и технологии</option>
                <option value="other">Другое</option>
              </motion.select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginTop: '2rem' }}
            >
              <NeonButton
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                pulse
                onClick={calculateROI}
              >
                Рассчитать ROI
              </NeonButton>
            </motion.div>
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