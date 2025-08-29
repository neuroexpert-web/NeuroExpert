'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './BusinessMetricsWidget.module.css';

interface BusinessMetricsWidgetProps {
  filters: any;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  onMove?: (position: { x: number; y: number }) => void;
  onResize?: (size: 'small' | 'medium' | 'large') => void;
  onToggle?: () => void;
  size?: 'small' | 'medium' | 'large';
  position?: { x: number; y: number };
}

interface BusinessData {
  revenue: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  visitors: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  conversion: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  avgSpeed: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
    percentage: number;
  };
  recommendation: string;
}

export default function BusinessMetricsWidget({
  filters,
  connectionStatus,
  size = 'medium'
}: BusinessMetricsWidgetProps) {
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  // Симуляция загрузки данных
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: BusinessData = {
        revenue: {
          current: 2850000,
          previous: 2654000,
          trend: 'up',
          percentage: 7.4
        },
        visitors: {
          current: 45720,
          previous: 42100,
          trend: 'up',
          percentage: 8.6
        },
        conversion: {
          current: 3.2,
          previous: 2.9,
          trend: 'up',
          percentage: 10.3
        },
        avgSpeed: {
          current: 1.8,
          previous: 2.2,
          trend: 'up',
          percentage: 18.2
        },
        recommendation: "Рекомендуем сосредоточиться на мобильной оптимизации - потенциальный рост конверсии на 15%"
      };
      
      setData(mockData);
      setLoading(false);
    };

    fetchData();
    
    // Автообновление каждые 15 секунд
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [filters]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  if (loading || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Загрузка метрик...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Основные метрики */}
      <div className={styles.metricsGrid}>
        {/* Выручка */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>💰</span>
            <span className={styles.metricLabel}>Выручка</span>
          </div>
          <div className={styles.metricValue}>
            {formatCurrency(data.revenue.current)}
          </div>
          <div className={`${styles.metricTrend} ${styles[data.revenue.trend]}`}>
            <span className={styles.trendIcon}>
              {data.revenue.trend === 'up' ? '↗️' : '↘️'}
            </span>
            <span className={styles.trendText}>
              {data.revenue.percentage > 0 ? '+' : ''}{data.revenue.percentage}%
            </span>
          </div>
        </div>

        {/* Посетители */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>👥</span>
            <span className={styles.metricLabel}>Посетители</span>
          </div>
          <div className={styles.metricValue}>
            {formatNumber(data.visitors.current)}
          </div>
          <div className={`${styles.metricTrend} ${styles[data.visitors.trend]}`}>
            <span className={styles.trendIcon}>
              {data.visitors.trend === 'up' ? '↗️' : '↘️'}
            </span>
            <span className={styles.trendText}>
              {data.visitors.percentage > 0 ? '+' : ''}{data.visitors.percentage}%
            </span>
          </div>
        </div>

        {/* Конверсия */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>🎯</span>
            <span className={styles.metricLabel}>Конверсия</span>
          </div>
          <div className={styles.metricValue}>
            {data.conversion.current}%
          </div>
          <div className={`${styles.metricTrend} ${styles[data.conversion.trend]}`}>
            <span className={styles.trendIcon}>
              {data.conversion.trend === 'up' ? '↗️' : '↘️'}
            </span>
            <span className={styles.trendText}>
              {data.conversion.percentage > 0 ? '+' : ''}{data.conversion.percentage}%
            </span>
          </div>
        </div>

        {/* Скорость */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>⚡</span>
            <span className={styles.metricLabel}>Скорость</span>
          </div>
          <div className={styles.metricValue}>
            {data.avgSpeed.current}с
          </div>
          <div className={`${styles.metricTrend} ${styles[data.avgSpeed.trend]}`}>
            <span className={styles.trendIcon}>
              {data.avgSpeed.trend === 'up' ? '⬇️' : '⬆️'}
            </span>
            <span className={styles.trendText}>
              {data.avgSpeed.percentage > 0 ? '-' : '+'}{Math.abs(data.avgSpeed.percentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* AI рекомендация */}
      <div className={styles.recommendation}>
        <div className={styles.recommendationHeader}>
          <span className={styles.aiIcon}>🤖</span>
          <span className={styles.recommendationTitle}>AI Рекомендация</span>
        </div>
        <p className={styles.recommendationText}>{data.recommendation}</p>
      </div>

      {/* Статус подключения */}
      <div className={styles.connectionStatus}>
        <span className={`${styles.statusDot} ${styles[connectionStatus]}`}></span>
        <span className={styles.statusText}>
          {connectionStatus === 'connected' ? 'Данные актуальны' : 
           connectionStatus === 'connecting' ? 'Обновление...' : 
           'Нет соединения'}
        </span>
      </div>
    </motion.div>
  );
}