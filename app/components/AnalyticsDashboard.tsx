'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AnalyticsDashboard.module.css';

interface MetricData {
  users: number;
  revenue: number;
  conversion: number;
  growth: number;
  sessions: number;
  aiTasks: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<MetricData>({
    users: 1247,
    revenue: 284500,
    conversion: 12.4,
    growth: 23.7,
    sessions: 8432,
    aiTasks: 15678
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Генерация данных для графика
  const generateChartData = (): ChartData => {
    const labels = selectedPeriod === '7d' 
      ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
      : ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];

    return {
      labels,
      datasets: [
        {
          label: 'Доход',
          data: labels.map(() => Math.floor(Math.random() * 50000 + 30000)),
          borderColor: '#9945ff',
          backgroundColor: 'rgba(153, 69, 255, 0.1)'
        },
        {
          label: 'AI задачи',
          data: labels.map(() => Math.floor(Math.random() * 3000 + 2000)),
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)'
        }
      ]
    };
  };

  useEffect(() => {
    // Анимация загрузки
    setTimeout(() => setIsLoading(false), 1000);
    
    // Обновление метрик в реальном времени
    const interval = setInterval(() => {
      setMetrics(prev => ({
        users: prev.users + Math.floor(Math.random() * 10 - 3),
        revenue: prev.revenue + Math.floor(Math.random() * 2000 - 500),
        conversion: Math.max(0, Math.min(100, prev.conversion + (Math.random() * 2 - 1))),
        growth: Math.max(-100, Math.min(100, prev.growth + (Math.random() * 4 - 2))),
        sessions: prev.sessions + Math.floor(Math.random() * 20 - 5),
        aiTasks: prev.aiTasks + Math.floor(Math.random() * 50 - 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Отрисовка графика на canvas
  useEffect(() => {
    if (!isLoading && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const canvas = chartRef.current;
      const width = canvas.width = canvas.offsetWidth * 2;
      const height = canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);

      // Очистка canvas
      ctx.clearRect(0, 0, width, height);

      // Данные для графика
      const chartData = generateChartData();
      const padding = 40;
      const chartWidth = canvas.offsetWidth - padding * 2;
      const chartHeight = canvas.offsetHeight - padding * 2;

      // Рисуем сетку
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
      }

      // Рисуем линии графика
      chartData.datasets.forEach((dataset, datasetIndex) => {
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();

        dataset.data.forEach((value, index) => {
          const x = padding + (chartWidth / (dataset.data.length - 1)) * index;
          const maxValue = Math.max(...dataset.data);
          const y = padding + chartHeight - (value / maxValue) * chartHeight;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();

        // Рисуем точки
        dataset.data.forEach((value, index) => {
          const x = padding + (chartWidth / (dataset.data.length - 1)) * index;
          const maxValue = Math.max(...dataset.data);
          const y = padding + chartHeight - (value / maxValue) * chartHeight;

          ctx.fillStyle = dataset.borderColor;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Подписи осей
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Space Grotesk';
      chartData.labels.forEach((label, index) => {
        const x = padding + (chartWidth / (chartData.labels.length - 1)) * index;
        ctx.fillText(label, x - 10, canvas.offsetHeight - 10);
      });
    }
  }, [isLoading, selectedPeriod]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        <p className={styles.loadingText}>Загрузка аналитики...</p>
      </div>
    );
  }

  return (
    <section className={styles.analyticsDashboard}>
      {/* Заголовок с периодом */}
      <div className={styles.dashboardHeader}>
        <motion.h2 
          className={styles.dashboardTitle}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Аналитика в реальном времени
        </motion.h2>
        
        <div className={styles.periodSelector}>
          {['24h', '7d', '30d', '6m'].map((period) => (
            <button
              key={period}
              className={`${styles.periodButton} ${selectedPeriod === period ? styles.active : ''}`}
              onClick={() => setSelectedPeriod(period)}
            >
              {period === '24h' ? '24 часа' : 
               period === '7d' ? '7 дней' :
               period === '30d' ? '30 дней' : '6 месяцев'}
            </button>
          ))}
        </div>
      </div>

      {/* Основные метрики */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Активные пользователи"
          value={metrics.users.toLocaleString()}
          change={12}
          icon="users"
          color="blue"
          delay={0.1}
        />
        <MetricCard
          title="Общий доход"
          value={`₽${metrics.revenue.toLocaleString()}`}
          change={metrics.growth}
          icon="revenue"
          color="green"
          delay={0.2}
        />
        <MetricCard
          title="Конверсия"
          value={`${metrics.conversion.toFixed(1)}%`}
          change={5.2}
          icon="conversion"
          color="purple"
          delay={0.3}
        />
        <MetricCard
          title="AI задачи"
          value={metrics.aiTasks.toLocaleString()}
          change={28.4}
          icon="ai"
          color="cyan"
          delay={0.4}
        />
      </div>

      {/* График */}
      <motion.div 
        className={styles.chartContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className={styles.chartHeader}>
          <h3>Динамика показателей</h3>
          <div className={styles.chartLegend}>
            <span className={styles.legendItem} data-color="purple">
              <span className={styles.legendDot}></span>
              Доход
            </span>
            <span className={styles.legendItem} data-color="cyan">
              <span className={styles.legendDot}></span>
              AI задачи
            </span>
          </div>
        </div>
        <canvas 
          ref={chartRef} 
          className={styles.chart}
          width={800}
          height={300}
        />
      </motion.div>

      {/* Дополнительная статистика */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Среднее время сессии"
          value="8м 42с"
          trend="up"
          description="На 23% больше чем вчера"
        />
        <StatCard
          title="Отказы"
          value="12.3%"
          trend="down"
          description="Снижение на 5% за неделю"
        />
        <StatCard
          title="Новые пользователи"
          value="342"
          trend="up"
          description="+18% к прошлой неделе"
        />
      </div>
    </section>
  );
}

// Компонент метрики
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
  delay: number;
}

function MetricCard({ title, value, change, icon, color, delay }: MetricCardProps) {
  const iconComponents = {
    users: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 19C3 16.2386 5.23858 14 8 14H10C12.7614 14 15 16.2386 15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="17" cy="7" r="2" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
        <path d="M21 19C21 17.3431 19.6569 16 18 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    revenue: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    conversion: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      </svg>
    ),
    ai: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 2V6M12 18V22M22 12H18M6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
    )
  };

  return (
    <motion.div 
      className={`${styles.metricCard} ${styles[color]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
    >
      <div className={styles.metricIcon}>
        {iconComponents[icon as keyof typeof iconComponents]}
      </div>
      <div className={styles.metricContent}>
        <h3 className={styles.metricTitle}>{title}</h3>
        <div className={styles.metricValue}>{value}</div>
        <div className={`${styles.metricChange} ${change >= 0 ? styles.positive : styles.negative}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
      <div className={styles.metricGlow}></div>
    </motion.div>
  );
}

// Компонент статистики
interface StatCardProps {
  title: string;
  value: string;
  trend: 'up' | 'down';
  description: string;
}

function StatCard({ title, value, trend, description }: StatCardProps) {
  return (
    <motion.div 
      className={styles.statCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <h4 className={styles.statTitle}>{title}</h4>
      <div className={styles.statValue}>
        {value}
        <span className={`${styles.statTrend} ${styles[trend]}`}>
          {trend === 'up' ? '↗' : '↘'}
        </span>
      </div>
      <p className={styles.statDescription}>{description}</p>
    </motion.div>
  );
}