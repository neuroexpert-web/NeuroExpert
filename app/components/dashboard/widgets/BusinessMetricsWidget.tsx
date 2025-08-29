'use client';

import React, { useState, useEffect } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './BusinessMetricsWidget.module.css';

interface BusinessMetricsWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface BusinessMetrics {
  revenue: {
    current: number;
    change: number;
    period: string;
  };
  visitors: {
    current: number;
    change: number;
    period: string;
  };
  conversion: {
    current: number;
    change: number;
    status: 'good' | 'warning' | 'bad';
  };
  speed: {
    current: number;
    status: 'fast' | 'normal' | 'slow';
    description: string;
  };
}

export default function BusinessMetricsWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: BusinessMetricsWidgetProps) {
  const [data, setData] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Имитация загрузки данных
  useEffect(() => {
    const loadData = () => {
      // Симуляция API вызова с реалистичными данными
      setTimeout(() => {
        setData({
          revenue: {
            current: 125000,
            change: 8.5,
            period: 'за неделю'
          },
          visitors: {
            current: 2340,
            change: 12.3,
            period: 'сегодня'
          },
          conversion: {
            current: 3.2,
            change: 0.4,
            status: 'good'
          },
          speed: {
            current: 0.8,
            status: 'fast',
            description: 'Быстро'
          }
        });
        setLoading(false);
      }, 1000);
    };

    loadData();

    // Автообновление данных
    if (filters.liveMode) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [filters.liveMode, refreshInterval]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString('ru-RU');
  };

  const formatCurrency = (num: number) => {
    return `₽ ${formatNumber(num)}`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '→';
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return styles.positive;
    if (change < 0) return styles.negative;
    return styles.neutral;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'fast':
        return styles.good;
      case 'warning':
      case 'normal':
        return styles.warning;
      case 'bad':
      case 'slow':
        return styles.bad;
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Загружаем ваши данные...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.widget}>
        <div className={styles.error}>
          <span>❌ Не удалось загрузить данные</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
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
          <div className={styles.metricPeriod}>
            {data.revenue.period}
          </div>
          <div className={`${styles.metricChange} ${getChangeColor(data.revenue.change)}`}>
            <span className={styles.changeIcon}>{getChangeIcon(data.revenue.change)}</span>
            <span>{Math.abs(data.revenue.change)}%</span>
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
          <div className={styles.metricPeriod}>
            {data.visitors.period}
          </div>
          <div className={`${styles.metricChange} ${getChangeColor(data.visitors.change)}`}>
            <span className={styles.changeIcon}>{getChangeIcon(data.visitors.change)}</span>
            <span>{Math.abs(data.visitors.change)}%</span>
          </div>
        </div>

        {/* Конверсия */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>🎯</span>
            <span className={styles.metricLabel}>Конверсия в продажи</span>
          </div>
          <div className={styles.metricValue}>
            {data.conversion.current}%
          </div>
          <div className={styles.metricPeriod}>
            из посетителей
          </div>
          <div className={`${styles.metricStatus} ${getStatusColor(data.conversion.status)}`}>
            {data.conversion.status === 'good' ? 'Отлично' : 
             data.conversion.status === 'warning' ? 'Норма' : 'Низко'}
          </div>
        </div>

        {/* Скорость */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>⚡</span>
            <span className={styles.metricLabel}>Скорость сайта</span>
          </div>
          <div className={styles.metricValue}>
            {data.speed.current}с
          </div>
          <div className={styles.metricPeriod}>
            время загрузки
          </div>
          <div className={`${styles.metricStatus} ${getStatusColor(data.speed.status)}`}>
            {data.speed.description}
          </div>
        </div>

      </div>

      {/* AI Рекомендация */}
      <div className={styles.recommendation}>
        <div className={styles.recommendationHeader}>
          <span className={styles.aiIcon}>🤖</span>
          <span className={styles.recommendationTitle}>Рекомендация от ИИ</span>
        </div>
        <div className={styles.recommendationContent}>
          <p>
            <strong>💡 Увеличьте конверсию на 15%</strong><br/>
            Оптимизируйте мобильную версию сайта - 40% пользователей уходят на этапе оформления заказа.
          </p>
          <button className={styles.recommendationButton}>
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
}