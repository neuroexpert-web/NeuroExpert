'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from './NeonButton';
import FuturisticCard from './FuturisticCard';
import AILoader from './AILoader';
import { analytics } from '../utils/analytics';
import styles from './MetricsDashboard.module.css';

interface Metrics {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    completedProjects: number;
    avgROI: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
  kpi: any;
  serviceDistribution: any[];
  geoDistribution: any[];
  teamPerformance: any;
  aiMetrics: any;
  financial: any;
  timeline: any;
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [activeTab, setActiveTab] = useState<'overview' | 'kpi' | 'ai' | 'financial'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Загрузка метрик
  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/metrics?period=${period}`);
      const data = await response.json();
      
      console.log('Metrics API Response:', data); // Для отладки
      
      if (data.success) {
        setMetrics(data.data);
      } else {
        console.error('API returned error:', data);
        setMetrics(null);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
      analytics.trackError(error as Error, 'metrics_dashboard_load');
      setMetrics(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // Автообновление каждые 30 секунд
    if (autoRefresh) {
      const interval = setInterval(loadMetrics, 30000);
      return () => clearInterval(interval);
    }
  }, [period, autoRefresh]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <AILoader variant="neural" size="large" text="Загрузка метрик..." />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={styles.errorContainer}>
        <p>Не удалось загрузить метрики</p>
        <NeonButton onClick={loadMetrics}>Повторить</NeonButton>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>
            <span className={styles.titleIcon}>📊</span>
            Дашборд метрик
          </h2>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            <span>Реальное время</span>
          </div>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.periodSelector}>
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(p => (
              <button
                key={p}
                className={`${styles.periodButton} ${period === p ? styles.active : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === 'daily' ? 'День' : 
                 p === 'weekly' ? 'Неделя' : 
                 p === 'monthly' ? 'Месяц' : 'Год'}
              </button>
            ))}
          </div>
          
          <button
            className={`${styles.refreshButton} ${autoRefresh ? styles.active : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            🔄 {autoRefresh ? 'Авто' : 'Ручное'}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        <FuturisticCard variant="glass" glowColor="blue">
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>👥</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricValue}>
                {formatNumber(metrics.overview.activeUsers)}
              </h3>
              <p className={styles.metricLabel}>Активных пользователей</p>
              <span className={styles.metricChange}>
                +{metrics.overview.monthlyGrowth}% за месяц
              </span>
            </div>
          </div>
        </FuturisticCard>

        <FuturisticCard variant="glass" glowColor="green">
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>💰</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricValue}>
                {formatCurrency(metrics.overview.totalRevenue)}
              </h3>
              <p className={styles.metricLabel}>Общий доход</p>
              <span className={styles.metricChange}>
                ROI {metrics.overview.avgROI}%
              </span>
            </div>
          </div>
        </FuturisticCard>

        <FuturisticCard variant="glass" glowColor="purple">
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>📈</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricValue}>
                {metrics.overview.completedProjects}
              </h3>
              <p className={styles.metricLabel}>Завершенных проектов</p>
              <span className={styles.metricChange}>
                из {metrics.overview.totalProjects} всего
              </span>
            </div>
          </div>
        </FuturisticCard>

        <FuturisticCard variant="glass" glowColor="pink">
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>🤖</div>
            <div className={styles.metricContent}>
              <h3 className={styles.metricValue}>
                {formatNumber(metrics.aiMetrics.totalInteractions)}
              </h3>
              <p className={styles.metricLabel}>AI взаимодействий</p>
              <span className={styles.metricChange}>
                {metrics.aiMetrics.userSatisfaction}% довольны
              </span>
            </div>
          </div>
        </FuturisticCard>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['overview', 'kpi', 'ai', 'financial'] as const).map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? '📊 Обзор' :
             tab === 'kpi' ? '🎯 KPI' :
             tab === 'ai' ? '🤖 AI Метрики' : '💰 Финансы'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.tabContent}
          >
            {/* Service Distribution */}
            <FuturisticCard variant="neon" glowColor="blue">
              <h3 className={styles.sectionTitle}>Распределение по услугам</h3>
              <div className={styles.distributionChart}>
                {metrics.serviceDistribution.map((service, index) => (
                  <div key={index} className={styles.distributionItem}>
                    <div className={styles.distributionHeader}>
                      <span className={styles.serviceName}>{service.name}</span>
                      <span className={styles.serviceValue}>{service.value}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${service.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{
                          background: `var(--gradient-${
                            index === 0 ? 'primary' : 
                            index === 1 ? 'secondary' : 
                            index === 2 ? 'accent' : 
                            index === 3 ? 'holographic' : 'neon'
                          })`
                        }}
                      />
                    </div>
                    <span className={styles.serviceRevenue}>
                      {formatCurrency(service.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </FuturisticCard>

            {/* Timeline Chart */}
            <FuturisticCard variant="glass">
              <h3 className={styles.sectionTitle}>Динамика активности</h3>
              <div className={styles.timelineChart}>
                <div className={styles.chartBars}>
                  {metrics.timeline[period].map((point: any, index: number) => (
                    <div key={index} className={styles.chartBar}>
                      <motion.div
                        className={styles.bar}
                        initial={{ height: 0 }}
                        animate={{ height: `${(point.value / 200) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        style={{
                          background: point.value > 120 
                            ? 'var(--gradient-accent)' 
                            : 'var(--gradient-primary)'
                        }}
                      />
                      <span className={styles.barLabel}>{point.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FuturisticCard>
          </motion.div>
        )}

        {activeTab === 'kpi' && (
          <motion.div
            key="kpi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.tabContent}
          >
            <div className={styles.kpiGrid}>
              {Object.entries(metrics.kpi).map(([key, kpi]: [string, any]) => (
                <FuturisticCard key={key} variant="holographic" glowColor="purple">
                  <div className={styles.kpiCard}>
                    <h4 className={styles.kpiName}>
                      {key === 'conversionRate' ? 'Конверсия' :
                       key === 'customerSatisfaction' ? 'Удовлетворенность' :
                       key === 'projectDeliveryTime' ? 'Время доставки' :
                       'Время ответа поддержки'}
                    </h4>
                    <div className={styles.kpiValue}>
                      <span className={styles.kpiNumber}>{kpi.value}</span>
                      <span className={styles.kpiUnit}>
                        {key === 'conversionRate' ? '%' :
                         key === 'customerSatisfaction' ? '/5' :
                         key === 'projectDeliveryTime' ? ' мес' : ' мин'}
                      </span>
                    </div>
                    <div className={styles.kpiTarget}>
                      Цель: {kpi.target}
                      {key === 'conversionRate' ? '%' :
                       key === 'customerSatisfaction' ? '/5' :
                       key === 'projectDeliveryTime' ? ' мес' : ' мин'}
                    </div>
                    <div className={`${styles.kpiTrend} ${styles[kpi.trend]}`}>
                      {kpi.trend === 'up' ? '↑' : '↓'} {Math.abs(kpi.change)}%
                    </div>
                    <div className={styles.kpiProgress}>
                      <div 
                        className={styles.kpiProgressFill}
                        style={{ 
                          width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`,
                          background: kpi.value >= kpi.target 
                            ? 'var(--gradient-accent)' 
                            : 'var(--gradient-danger)'
                        }}
                      />
                    </div>
                  </div>
                </FuturisticCard>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.tabContent}
          >
            <div className={styles.aiMetricsGrid}>
              <FuturisticCard variant="neon" glowColor="blue">
                <div className={styles.aiStat}>
                  <h4>Успешность ответов</h4>
                  <div className={styles.circularProgress}>
                    <svg viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="5"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="5"
                        strokeDasharray={`${(metrics.aiMetrics.successfulResponses / metrics.aiMetrics.totalInteractions) * 283} 283`}
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="gradient">
                          <stop offset="0%" stopColor="#00D9FF" />
                          <stop offset="100%" stopColor="#BD00FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className={styles.circularValue}>
                      {Math.round((metrics.aiMetrics.successfulResponses / metrics.aiMetrics.totalInteractions) * 100)}%
                    </div>
                  </div>
                </div>
              </FuturisticCard>

              <FuturisticCard variant="glass">
                <div className={styles.aiStatList}>
                  <div className={styles.aiStatItem}>
                    <span>Среднее время ответа</span>
                    <strong>{metrics.aiMetrics.avgResponseTime}с</strong>
                  </div>
                  <div className={styles.aiStatItem}>
                    <span>Автоматизировано задач</span>
                    <strong>{formatNumber(metrics.aiMetrics.tasksAutomated)}</strong>
                  </div>
                  <div className={styles.aiStatItem}>
                    <span>Сэкономлено времени</span>
                    <strong>{formatNumber(metrics.aiMetrics.timeSaved)} ч</strong>
                  </div>
                  <div className={styles.aiStatItem}>
                    <span>Сэкономлено средств</span>
                    <strong>{formatCurrency(metrics.aiMetrics.costSaved)}</strong>
                  </div>
                </div>
              </FuturisticCard>
            </div>
          </motion.div>
        )}

        {activeTab === 'financial' && (
          <motion.div
            key="financial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.tabContent}
          >
            <div className={styles.financialGrid}>
              <FuturisticCard variant="holographic" glowColor="green">
                <div className={styles.financialCard}>
                  <h4>MRR</h4>
                  <p className={styles.financialValue}>
                    {formatCurrency(metrics.financial.mrr)}
                  </p>
                  <span className={styles.financialLabel}>в месяц</span>
                </div>
              </FuturisticCard>

              <FuturisticCard variant="holographic" glowColor="purple">
                <div className={styles.financialCard}>
                  <h4>ARR</h4>
                  <p className={styles.financialValue}>
                    {formatCurrency(metrics.financial.arr)}
                  </p>
                  <span className={styles.financialLabel}>в год</span>
                </div>
              </FuturisticCard>

              <FuturisticCard variant="glass">
                <div className={styles.financialCard}>
                  <h4>LTV:CAC</h4>
                  <p className={styles.financialValue}>
                    {metrics.financial.ltvCacRatio}:1
                  </p>
                  <span className={styles.financialLabel}>коэффициент</span>
                </div>
              </FuturisticCard>

              <FuturisticCard variant="glass">
                <div className={styles.financialCard}>
                  <h4>Churn Rate</h4>
                  <p className={styles.financialValue}>
                    {metrics.financial.churnRate}%
                  </p>
                  <span className={styles.financialLabel}>отток</span>
                </div>
              </FuturisticCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Button */}
      <div className={styles.exportSection}>
        <NeonButton
          variant="secondary"
          size="medium"
          onClick={() => {
            analytics.trackEvent('metrics_exported', { period, tab: activeTab });
            const dataStr = JSON.stringify(metrics, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `metrics-${period}-${new Date().toISOString()}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
        >
          📥 Экспортировать данные
        </NeonButton>
      </div>
    </div>
  );
}