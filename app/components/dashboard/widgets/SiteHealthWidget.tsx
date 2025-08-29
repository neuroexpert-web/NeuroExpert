'use client';

import React, { useState, useEffect } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './SiteHealthWidget.module.css';

interface SiteHealthWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface SiteHealthData {
  uptime: {
    current: number;
    last24h: number;
    last30d: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
  };
  performance: {
    pageSpeed: number;
    loadTime: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
    status: 'excellent' | 'good' | 'warning' | 'critical';
  };
  errors: {
    count: number;
    rate: number;
    criticalErrors: number;
    lastError: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
  };
  security: {
    sslStatus: 'valid' | 'expiring' | 'expired';
    sslDaysLeft: number;
    vulnerabilities: number;
    lastScan: string;
    status: 'excellent' | 'good' | 'warning' | 'critical';
  };
  monitoring: {
    checks: Array<{
      name: string;
      status: 'online' | 'offline' | 'warning';
      responseTime: number;
      lastCheck: string;
    }>;
  };
}

export default function SiteHealthWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: SiteHealthWidgetProps) {
  const [data, setData] = useState<SiteHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHealthData = () => {
      setLoading(true);
      
      setTimeout(() => {
        try {
          const mockData: SiteHealthData = {
            uptime: {
              current: 99.95,
              last24h: 99.98,
              last30d: 99.87,
              status: 'excellent'
            },
            performance: {
              pageSpeed: 89,
              loadTime: 1.2,
              coreWebVitals: {
                lcp: 1.8,
                fid: 45,
                cls: 0.05
              },
              status: 'good'
            },
            errors: {
              count: 3,
              rate: 0.12,
              criticalErrors: 0,
              lastError: '2 часа назад',
              status: 'good'
            },
            security: {
              sslStatus: 'valid',
              sslDaysLeft: 78,
              vulnerabilities: 0,
              lastScan: 'вчера',
              status: 'excellent'
            },
            monitoring: {
              checks: [
                { name: 'Главная страница', status: 'online', responseTime: 320, lastCheck: '30 сек назад' },
                { name: 'API сервер', status: 'online', responseTime: 180, lastCheck: '30 сек назад' },
                { name: 'База данных', status: 'online', responseTime: 45, lastCheck: '30 сек назад' },
                { name: 'CDN', status: 'online', responseTime: 98, lastCheck: '30 сек назад' }
              ]
            }
          };
          
          setData(mockData);
          setError(null);
        } catch (err) {
          setError('Ошибка загрузки данных мониторинга');
        } finally {
          setLoading(false);
        }
      }, 700);
    };

    loadHealthData();

    if (filters.liveMode) {
      const interval = setInterval(loadHealthData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [filters.liveMode, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#22c55e';
      case 'good': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Отлично';
      case 'good': return 'Хорошо';
      case 'warning': return 'Внимание';
      case 'critical': return 'Критично';
      default: return 'Неизвестно';
    }
  };

  const getOverallHealth = () => {
    if (!data) return { score: 0, status: 'unknown' };
    
    const scores = {
      excellent: 100,
      good: 75,
      warning: 50,
      critical: 25
    };
    
    const avgScore = (
      scores[data.uptime.status] +
      scores[data.performance.status] +
      scores[data.errors.status] +
      scores[data.security.status]
    ) / 4;
    
    if (avgScore >= 90) return { score: avgScore, status: 'excellent' };
    if (avgScore >= 70) return { score: avgScore, status: 'good' };
    if (avgScore >= 50) return { score: avgScore, status: 'warning' };
    return { score: avgScore, status: 'critical' };
  };

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Проверяем здоровье сайта...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.widget}>
        <div className={styles.error}>
          <span>❌ {error || 'Не удалось загрузить данные'}</span>
        </div>
      </div>
    );
  }

  const overallHealth = getOverallHealth();

  return (
    <div className={styles.widget}>
      {/* Общее здоровье */}
      <div className={styles.overallHealth}>
        <div className={styles.healthScore}>
          <div 
            className={styles.scoreCircle}
            style={{ '--score': overallHealth.score, '--color': getStatusColor(overallHealth.status) } as any}
          >
            <span className={styles.scoreValue}>{Math.round(overallHealth.score)}</span>
            <span className={styles.scoreLabel}>%</span>
          </div>
        </div>
        <div className={styles.healthStatus}>
          <h3>Здоровье сайта</h3>
          <p style={{ color: getStatusColor(overallHealth.status) }}>
            {getStatusText(overallHealth.status)}
          </p>
        </div>
      </div>

      {/* Метрики здоровья */}
      <div className={styles.healthMetrics}>
        
        {/* Аптайм */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>🔄</span>
            <span className={styles.metricTitle}>Доступность</span>
          </div>
          <div className={styles.metricValue}>
            {data.uptime.current}%
          </div>
          <div className={styles.metricDetails}>
            <div className={styles.metricRow}>
              <span>За 24 часа:</span>
              <span>{data.uptime.last24h}%</span>
            </div>
            <div className={styles.metricRow}>
              <span>За 30 дней:</span>
              <span>{data.uptime.last30d}%</span>
            </div>
          </div>
          <div 
            className={styles.metricStatus}
            style={{ color: getStatusColor(data.uptime.status) }}
          >
            {getStatusText(data.uptime.status)}
          </div>
        </div>

        {/* Производительность */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>⚡</span>
            <span className={styles.metricTitle}>Скорость</span>
          </div>
          <div className={styles.metricValue}>
            {data.performance.loadTime}с
          </div>
          <div className={styles.metricDetails}>
            <div className={styles.metricRow}>
              <span>PageSpeed:</span>
              <span>{data.performance.pageSpeed}/100</span>
            </div>
            <div className={styles.metricRow}>
              <span>Core Web Vitals:</span>
              <span>✅</span>
            </div>
          </div>
          <div 
            className={styles.metricStatus}
            style={{ color: getStatusColor(data.performance.status) }}
          >
            {getStatusText(data.performance.status)}
          </div>
        </div>

        {/* Ошибки */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>🐛</span>
            <span className={styles.metricTitle}>Ошибки</span>
          </div>
          <div className={styles.metricValue}>
            {data.errors.count}
          </div>
          <div className={styles.metricDetails}>
            <div className={styles.metricRow}>
              <span>Частота:</span>
              <span>{data.errors.rate}%</span>
            </div>
            <div className={styles.metricRow}>
              <span>Последняя:</span>
              <span>{data.errors.lastError}</span>
            </div>
          </div>
          <div 
            className={styles.metricStatus}
            style={{ color: getStatusColor(data.errors.status) }}
          >
            {getStatusText(data.errors.status)}
          </div>
        </div>

        {/* Безопасность */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>🔒</span>
            <span className={styles.metricTitle}>Безопасность</span>
          </div>
          <div className={styles.metricValue}>
            SSL
          </div>
          <div className={styles.metricDetails}>
            <div className={styles.metricRow}>
              <span>Сертификат:</span>
              <span>Действителен</span>
            </div>
            <div className={styles.metricRow}>
              <span>Истекает через:</span>
              <span>{data.security.sslDaysLeft} дней</span>
            </div>
          </div>
          <div 
            className={styles.metricStatus}
            style={{ color: getStatusColor(data.security.status) }}
          >
            {getStatusText(data.security.status)}
          </div>
        </div>

      </div>

      {/* Мониторинг сервисов */}
      <div className={styles.servicesMonitoring}>
        <h4>Состояние сервисов</h4>
        <div className={styles.servicesList}>
          {data.monitoring.checks.map((check, index) => (
            <div key={index} className={styles.serviceItem}>
              <div className={styles.serviceInfo}>
                <span 
                  className={styles.serviceStatus}
                  style={{ 
                    backgroundColor: check.status === 'online' ? '#22c55e' : 
                                   check.status === 'warning' ? '#f59e0b' : '#ef4444'
                  }}
                ></span>
                <span className={styles.serviceName}>{check.name}</span>
              </div>
              <div className={styles.serviceMetrics}>
                <span className={styles.responseTime}>{check.responseTime}ms</span>
                <span className={styles.lastCheck}>{check.lastCheck}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Рекомендации */}
      <div className={styles.recommendations}>
        <h4>💡 Рекомендации</h4>
        <div className={styles.recommendationsList}>
          {data.performance.pageSpeed < 90 && (
            <div className={styles.recommendation}>
              <span className={styles.recIcon}>⚡</span>
              <span>Оптимизируйте изображения для увеличения скорости</span>
            </div>
          )}
          {data.security.sslDaysLeft < 30 && (
            <div className={styles.recommendation}>
              <span className={styles.recIcon}>🔒</span>
              <span>Обновите SSL сертификат в ближайшее время</span>
            </div>
          )}
          {data.errors.count > 0 && (
            <div className={styles.recommendation}>
              <span className={styles.recIcon}>🐛</span>
              <span>Исправьте ошибки для улучшения пользовательского опыта</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}