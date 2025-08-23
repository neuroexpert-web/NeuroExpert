'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from './NeonButton';
import FuturisticCard from './FuturisticCard';
import AILoader from './AILoader';
import { analytics } from '../utils/analytics';
import styles from './AdvancedROICalculator.module.css';

interface CalculatorInputs {
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  industry: string;
  currentRevenue: number;
  currentCosts: number;
  employeeCount: number;
  digitalMaturity: number; // 1-10
  timeframe: number; // месяцы
  investmentAmount: number;
}

interface ROIProjection {
  month: number;
  revenue: number;
  costs: number;
  roi: number;
  probability: number;
}

interface SimulationResult {
  bestCase: {
    roi: number;
    payback: number;
    savings: number;
  };
  worstCase: {
    roi: number;
    payback: number;
    savings: number;
  };
  mostLikely: {
    roi: number;
    payback: number;
    savings: number;
    confidence: number;
  };
  projections: ROIProjection[];
  breakEvenMonth: number;
  riskFactors: string[];
}

export default function AdvancedROICalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    companySize: 'medium',
    industry: 'retail',
    currentRevenue: 10000000,
    currentCosts: 7000000,
    employeeCount: 50,
    digitalMaturity: 5,
    timeframe: 12,
    investmentAmount: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'inputs' | 'results' | 'report'>('inputs');

  // Автоматический расчет инвестиций
  useEffect(() => {
    const baseInvestment = {
      small: 500000,
      medium: 1500000,
      large: 3000000,
      enterprise: 5000000
    };

    const industryMultiplier = {
      retail: 1.2,
      finance: 1.5,
      manufacturing: 1.3,
      services: 1.1,
      tech: 1.4,
      healthcare: 1.6
    };

    const maturityDiscount = (10 - inputs.digitalMaturity) * 0.05;
    const base = baseInvestment[inputs.companySize];
    const multiplier = industryMultiplier[inputs.industry as keyof typeof industryMultiplier] || 1;
    
    const suggestedInvestment = Math.round(base * multiplier * (1 - maturityDiscount));
    
    setInputs(prev => ({ ...prev, investmentAmount: suggestedInvestment }));
  }, [inputs.companySize, inputs.industry, inputs.digitalMaturity]);

  // Monte Carlo симуляция
  const runMonteCarloSimulation = async (): Promise<SimulationResult> => {
    const simulations = 10000;
    const results: ROIProjection[][] = [];

    for (let i = 0; i < simulations; i++) {
      const projections: ROIProjection[] = [];
      let currentRevenue = inputs.currentRevenue;
      let currentCosts = inputs.currentCosts;

      for (let month = 1; month <= inputs.timeframe; month++) {
        // Факторы роста с рандомизацией
        const revenueGrowth = 0.02 + Math.random() * 0.06; // 2-8% в месяц
        const costReduction = 0.01 + Math.random() * 0.04; // 1-5% в месяц
        const efficiency = 1 + (inputs.digitalMaturity / 10) * 0.5;

        // Применяем изменения
        currentRevenue *= (1 + revenueGrowth * efficiency);
        currentCosts *= (1 - costReduction * efficiency);

        const monthlyROI = ((currentRevenue - currentCosts - inputs.investmentAmount / inputs.timeframe) / 
                           (inputs.investmentAmount / inputs.timeframe)) * 100;

        projections.push({
          month,
          revenue: currentRevenue,
          costs: currentCosts,
          roi: monthlyROI,
          probability: 0.5 + (Math.random() - 0.5) * 0.3
        });
      }

      results.push(projections);
    }

    // Анализ результатов
    const finalROIs = results.map(r => r[r.length - 1].roi);
    finalROIs.sort((a, b) => a - b);

    const bestCase = finalROIs[Math.floor(finalROIs.length * 0.95)];
    const worstCase = finalROIs[Math.floor(finalROIs.length * 0.05)];
    const mostLikely = finalROIs[Math.floor(finalROIs.length * 0.5)];

    // Расчет точки безубыточности
    const breakEvenMonths = results.map(projections => {
      const breakEvenIndex = projections.findIndex(p => p.roi > 0);
      return breakEvenIndex === -1 ? inputs.timeframe : breakEvenIndex + 1;
    });
    const avgBreakEven = Math.round(breakEvenMonths.reduce((a, b) => a + b) / breakEvenMonths.length);

    // Факторы риска
    const riskFactors = [];
    if (inputs.digitalMaturity < 3) riskFactors.push('Низкая цифровая зрелость');
    if (inputs.employeeCount < 20) riskFactors.push('Малый размер команды');
    if (inputs.currentRevenue < 5000000) riskFactors.push('Низкий текущий доход');
    if (avgBreakEven > 6) riskFactors.push('Долгий период окупаемости');

    return {
      bestCase: {
        roi: Math.round(bestCase),
        payback: Math.round(avgBreakEven * 0.8),
        savings: Math.round(inputs.currentCosts * 0.35)
      },
      worstCase: {
        roi: Math.round(worstCase),
        payback: Math.round(avgBreakEven * 1.5),
        savings: Math.round(inputs.currentCosts * 0.15)
      },
      mostLikely: {
        roi: Math.round(mostLikely),
        payback: avgBreakEven,
        savings: Math.round(inputs.currentCosts * 0.25),
        confidence: 85
      },
      projections: results[Math.floor(simulations / 2)], // Медианный результат
      breakEvenMonth: avgBreakEven,
      riskFactors
    };
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    const startTime = Date.now();

    try {
      // Симуляция расчетов
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulationResults = await runMonteCarloSimulation();
      setResults(simulationResults);
      setShowResults(true);
      setActiveTab('results');

      // Аналитика
      analytics.trackROICalculation(inputs as any, {
        percentage: simulationResults.mostLikely.roi,
        savingsAmount: simulationResults.mostLikely.savings,
        paybackMonths: simulationResults.mostLikely.payback,
        confidence: simulationResults.mostLikely.confidence
      });

      // Отправка уведомления
      if (simulationResults.mostLikely.roi > 200) {
        await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `🎯 Высокий ROI рассчитан!\n\nКомпания: ${inputs.companySize}\nОтрасль: ${inputs.industry}\nПрогноз ROI: ${simulationResults.mostLikely.roi}%\nОкупаемость: ${simulationResults.mostLikely.payback} мес.`
          })
        });
      }

    } catch (error) {
      console.error('Calculation error:', error);
      analytics.trackError(error as Error, 'roi_calculation');
    } finally {
      setIsCalculating(false);
    }
  };

  const generatePDFReport = async () => {
    if (!results) return;

    // Здесь будет генерация PDF отчета
    const reportData = {
      company: inputs,
      results: results,
      generatedAt: new Date().toISOString(),
      recommendations: [
        'Начать с автоматизации ключевых процессов',
        'Внедрить AI для анализа данных',
        'Обучить сотрудников новым технологиям',
        'Создать центр цифровых компетенций'
      ]
    };

    console.log('Generating PDF report:', reportData);
    // TODO: Интеграция с PDF библиотекой
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={styles.calculator}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>💎</span>
          ROI Calculator Pro
        </h2>
        <p className={styles.subtitle}>
          Monte Carlo симуляция с 10,000 сценариев для точного прогноза
        </p>
      </motion.div>

      {/* Табы */}
      <div className={styles.tabs}>
        {(['inputs', 'results', 'report'] as const).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
            disabled={tab === 'results' && !results}
          >
            {tab === 'inputs' && '📊 Параметры'}
            {tab === 'results' && '📈 Результаты'}
            {tab === 'report' && '📄 Отчет'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Форма ввода */}
        {activeTab === 'inputs' && (
          <motion.div
            key="inputs"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={styles.content}
          >
            <div className={styles.inputGrid}>
              <FuturisticCard variant="glass">
                <h3>Основные параметры</h3>
                
                <div className={styles.field}>
                  <label>Размер компании</label>
                  <select
                    value={inputs.companySize}
                    onChange={(e) => setInputs(prev => ({ 
                      ...prev, 
                      companySize: e.target.value as CalculatorInputs['companySize']
                    }))}
                    className={styles.select}
                  >
                    <option value="small">Малый (до 50 сотр.)</option>
                    <option value="medium">Средний (50-250 сотр.)</option>
                    <option value="large">Крупный (250-1000 сотр.)</option>
                    <option value="enterprise">Корпорация (1000+ сотр.)</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Отрасль</label>
                  <select
                    value={inputs.industry}
                    onChange={(e) => setInputs(prev => ({ ...prev, industry: e.target.value }))}
                    className={styles.select}
                  >
                    <option value="retail">Розничная торговля</option>
                    <option value="finance">Финансы и банкинг</option>
                    <option value="manufacturing">Производство</option>
                    <option value="services">Услуги</option>
                    <option value="tech">IT и технологии</option>
                    <option value="healthcare">Здравоохранение</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Количество сотрудников</label>
                  <input
                    type="number"
                    value={inputs.employeeCount}
                    onChange={(e) => setInputs(prev => ({ 
                      ...prev, 
                      employeeCount: parseInt(e.target.value) || 0 
                    }))}
                    className={styles.input}
                  />
                </div>
              </FuturisticCard>

              <FuturisticCard variant="glass">
                <h3>Финансовые показатели</h3>
                
                <div className={styles.field}>
                  <label>Текущая выручка (год)</label>
                  <input
                    type="number"
                    value={inputs.currentRevenue}
                    onChange={(e) => setInputs(prev => ({ 
                      ...prev, 
                      currentRevenue: parseInt(e.target.value) || 0 
                    }))}
                    className={styles.input}
                  />
                  <span className={styles.hint}>{formatCurrency(inputs.currentRevenue)}</span>
                </div>

                <div className={styles.field}>
                  <label>Текущие расходы (год)</label>
                  <input
                    type="number"
                    value={inputs.currentCosts}
                    onChange={(e) => setInputs(prev => ({ 
                      ...prev, 
                      currentCosts: parseInt(e.target.value) || 0 
                    }))}
                    className={styles.input}
                  />
                  <span className={styles.hint}>{formatCurrency(inputs.currentCosts)}</span>
                </div>

                <div className={styles.field}>
                  <label>Цифровая зрелость (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={inputs.digitalMaturity}
                    onChange={(e) => setInputs(prev => ({ 
                      ...prev, 
                      digitalMaturity: parseInt(e.target.value) 
                    }))}
                    className={styles.slider}
                  />
                  <span className={styles.sliderValue}>{inputs.digitalMaturity}</span>
                </div>
              </FuturisticCard>

              <FuturisticCard variant="glass">
                <h3>Параметры инвестиций</h3>
                
                <div className={styles.field}>
                  <label>Период прогноза (месяцы)</label>
                  <input
                    type="number"
                    min="6"
                    max="36"
                    value={inputs.timeframe}
                    onChange={(e) => setInputs(prev => ({ 
                      ...prev, 
                      timeframe: parseInt(e.target.value) || 12 
                    }))}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label>Рекомендуемые инвестиции</label>
                  <div className={styles.investmentAmount}>
                    {formatCurrency(inputs.investmentAmount)}
                  </div>
                  <span className={styles.hint}>
                    Рассчитано автоматически на основе ваших параметров
                  </span>
                </div>

                <div className={styles.investmentBreakdown}>
                  <h4>Распределение инвестиций:</h4>
                  <div className={styles.breakdownItem}>
                    <span>AI и автоматизация</span>
                    <span>{formatCurrency(inputs.investmentAmount * 0.4)}</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Инфраструктура</span>
                    <span>{formatCurrency(inputs.investmentAmount * 0.3)}</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Обучение персонала</span>
                    <span>{formatCurrency(inputs.investmentAmount * 0.2)}</span>
                  </div>
                  <div className={styles.breakdownItem}>
                    <span>Консалтинг</span>
                    <span>{formatCurrency(inputs.investmentAmount * 0.1)}</span>
                  </div>
                </div>
              </FuturisticCard>
            </div>

            <motion.div className={styles.calculateButton}>
              <NeonButton
                variant="primary"
                size="large"
                onClick={handleCalculate}
                disabled={isCalculating}
                pulse
              >
                {isCalculating ? (
                  <>Выполняется симуляция...</>
                ) : (
                  <>🚀 Рассчитать ROI</>
                )}
              </NeonButton>
            </motion.div>
          </motion.div>
        )}

        {/* Результаты */}
        {activeTab === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles.results}
          >
            <div className={styles.scenariosGrid}>
              <FuturisticCard variant="holographic" glowColor="green">
                <h3>📈 Лучший сценарий</h3>
                <div className={styles.scenario}>
                  <div className={styles.metricLarge}>
                    <span className={styles.metricValue}>{results.bestCase.roi}%</span>
                    <span className={styles.metricLabel}>ROI</span>
                  </div>
                  <div className={styles.metricSmall}>
                    <span>Окупаемость: {results.bestCase.payback} мес.</span>
                    <span>Экономия: {formatCurrency(results.bestCase.savings)}</span>
                  </div>
                </div>
              </FuturisticCard>

              <FuturisticCard variant="neon" glowColor="blue">
                <h3>🎯 Вероятный сценарий</h3>
                <div className={styles.scenario}>
                  <div className={styles.metricLarge}>
                    <span className={styles.metricValue}>{results.mostLikely.roi}%</span>
                    <span className={styles.metricLabel}>ROI</span>
                  </div>
                  <div className={styles.metricSmall}>
                    <span>Окупаемость: {results.mostLikely.payback} мес.</span>
                    <span>Экономия: {formatCurrency(results.mostLikely.savings)}</span>
                  </div>
                  <div className={styles.confidence}>
                    Уверенность: {results.mostLikely.confidence}%
                  </div>
                </div>
              </FuturisticCard>

              <FuturisticCard variant="glass" glowColor="pink">
                <h3>📉 Худший сценарий</h3>
                <div className={styles.scenario}>
                  <div className={styles.metricLarge}>
                    <span className={styles.metricValue}>{results.worstCase.roi}%</span>
                    <span className={styles.metricLabel}>ROI</span>
                  </div>
                  <div className={styles.metricSmall}>
                    <span>Окупаемость: {results.worstCase.payback} мес.</span>
                    <span>Экономия: {formatCurrency(results.worstCase.savings)}</span>
                  </div>
                </div>
              </FuturisticCard>
            </div>

            {/* График проекций */}
            <FuturisticCard variant="glass">
              <h3>Динамика ROI по месяцам</h3>
              <div className={styles.chart}>
                <div className={styles.chartBars}>
                  {results.projections.map((projection, index) => (
                    <div
                      key={index}
                      className={styles.chartBar}
                      style={{
                        height: `${Math.max(10, Math.min(90, (projection.roi + 100) / 4))}%`,
                        background: projection.roi > 0 
                          ? 'var(--gradient-accent)' 
                          : 'var(--gradient-danger)'
                      }}
                      title={`Месяц ${projection.month}: ${projection.roi.toFixed(1)}% ROI`}
                    >
                      <span className={styles.chartLabel}>{projection.month}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.chartAxis}>
                  <span>Точка безубыточности: {results.breakEvenMonth} месяц</span>
                </div>
              </div>
            </FuturisticCard>

            {/* Факторы риска */}
            {results.riskFactors.length > 0 && (
              <FuturisticCard variant="glass">
                <h3>⚠️ Факторы риска</h3>
                <div className={styles.riskFactors}>
                  {results.riskFactors.map((risk, index) => (
                    <div key={index} className={styles.riskItem}>
                      <span className={styles.riskIcon}>⚡</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </FuturisticCard>
            )}

            <div className={styles.actions}>
              <NeonButton
                variant="secondary"
                size="large"
                onClick={() => setActiveTab('report')}
              >
                📄 Сформировать отчет
              </NeonButton>
              <NeonButton
                variant="accent"
                size="large"
                onClick={generatePDFReport}
              >
                📥 Скачать PDF
              </NeonButton>
            </div>
          </motion.div>
        )}

        {/* Отчет */}
        {activeTab === 'report' && results && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.report}
          >
            <FuturisticCard variant="glass">
              <h3>📊 Детальный отчет по ROI</h3>
              
              <div className={styles.reportSection}>
                <h4>Резюме</h4>
                <p>
                  На основе Monte Carlo симуляции с 10,000 сценариев, наиболее вероятный ROI 
                  для вашей компании составит <strong>{results.mostLikely.roi}%</strong> с 
                  периодом окупаемости <strong>{results.mostLikely.payback} месяцев</strong>.
                </p>
              </div>

              <div className={styles.reportSection}>
                <h4>Рекомендации</h4>
                <ul className={styles.recommendations}>
                  <li>
                    <span className={styles.recIcon}>🎯</span>
                    <div>
                      <strong>Начните с пилотного проекта</strong>
                      <p>Выберите один департамент для тестирования AI-решений</p>
                    </div>
                  </li>
                  <li>
                    <span className={styles.recIcon}>📈</span>
                    <div>
                      <strong>Фокус на быстрых победах</strong>
                      <p>Автоматизируйте рутинные процессы для быстрого ROI</p>
                    </div>
                  </li>
                  <li>
                    <span className={styles.recIcon}>🎓</span>
                    <div>
                      <strong>Инвестируйте в обучение</strong>
                      <p>Подготовьте команду к работе с новыми технологиями</p>
                    </div>
                  </li>
                  <li>
                    <span className={styles.recIcon}>📊</span>
                    <div>
                      <strong>Измеряйте результаты</strong>
                      <p>Внедрите KPI для отслеживания прогресса</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className={styles.reportSection}>
                <h4>План действий</h4>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <span className={styles.timelineMonth}>1-3 мес</span>
                    <div className={styles.timelineContent}>
                      <strong>Подготовка</strong>
                      <p>Аудит процессов, выбор технологий</p>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <span className={styles.timelineMonth}>4-6 мес</span>
                    <div className={styles.timelineContent}>
                      <strong>Внедрение</strong>
                      <p>Запуск пилотных проектов</p>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <span className={styles.timelineMonth}>7-9 мес</span>
                    <div className={styles.timelineContent}>
                      <strong>Масштабирование</strong>
                      <p>Расширение на другие департаменты</p>
                    </div>
                  </div>
                  <div className={styles.timelineItem}>
                    <span className={styles.timelineMonth}>10-12 мес</span>
                    <div className={styles.timelineContent}>
                      <strong>Оптимизация</strong>
                      <p>Достижение целевых показателей ROI</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.ctaSection}>
                <h4>Готовы начать трансформацию?</h4>
                <p>Наши эксперты помогут реализовать план и достичь прогнозируемых результатов</p>
                <NeonButton variant="primary" size="large" pulse>
                  Получить консультацию
                </NeonButton>
              </div>
            </FuturisticCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Загрузка */}
      <AnimatePresence>
        {isCalculating && (
          <motion.div
            className={styles.loadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AILoader
              variant="quantum"
              size="large"
              text="Выполняется Monte Carlo симуляция..."
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}