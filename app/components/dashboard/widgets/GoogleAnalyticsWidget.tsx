'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './GoogleAnalyticsWidget.module.css';

interface GoogleAnalyticsWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface GoogleAnalyticsData {
  activeUsers: number;
  sessions: number;
  avgSessionDuration: number;
  pageviewsPerSession: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  topCountries: Array<{
    country: string;
    users: number;
    percent: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    users: number;
    percent: number;
  }>;
  acquisitionChannels: Array<{
    channel: string;
    users: number;
    percent: number;
  }>;
}

export default function GoogleAnalyticsWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: GoogleAnalyticsWidgetProps) {
  const [data, setData] = useState<GoogleAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData: GoogleAnalyticsData = {
        activeUsers: Math.floor(Math.random() * 700) + 150,
        sessions: Math.floor(Math.random() * 2500) + 600,
        avgSessionDuration: Math.floor(Math.random() * (300 - 60) + 60),
        pageviewsPerSession: parseFloat((Math.random() * (5 - 2) + 2).toFixed(1)),
        topPages: [
          { path: '/', views: Math.floor(Math.random() * 300) + 100 },
          { path: '/analytics', views: Math.floor(Math.random() * 200) + 50 },
          { path: '/solutions', views: Math.floor(Math.random() * 150) + 30 },
        ],
        topCountries: [
          { country: 'Россия', users: 456, percent: 62.3 },
          { country: 'Казахстан', users: 123, percent: 16.8 },
          { country: 'Беларусь', users: 89, percent: 12.1 },
          { country: 'Украина', users: 45, percent: 6.1 },
          { country: 'Другие', users: 19, percent: 2.6 }
        ],
        deviceBreakdown: [
          { device: 'Desktop', users: 423, percent: 57.8 },
          { device: 'Mobile', users: 267, percent: 36.5 },
          { device: 'Tablet', users: 42, percent: 5.7 }
        ],
        acquisitionChannels: [
          { channel: 'Organic Search', users: 312, percent: 42.6 },
          { channel: 'Direct', users: 234, percent: 32.0 },
          { channel: 'Social', users: 98, percent: 13.4 },
          { channel: 'Referral', users: 56, percent: 7.7 },
          { channel: 'Paid Search', users: 32, percent: 4.4 }
        ]
      };

      setData(mockData);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Ошибка загрузки данных Google Analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    if (filters.liveMode) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, filters.liveMode, refreshInterval]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('ru-RU');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Загрузка Google Analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.widget}>
        <div className={styles.error}>
          <span>❌ {error || 'Не удалось загрузить данные'}</span>
          <button onClick={fetchData} className={styles.retryButton}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      {/* Заголовок */}
      <div className={styles.header}>
        <h3>📊 Google Analytics</h3>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          <span>В сети</span>
        </div>
      </div>

      {/* Основные метрики */}
      <div className={styles.mainMetrics}>
        <div className={styles.metric}>
          <span className={styles.metricIcon}>👥</span>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{formatNumber(data.activeUsers)}</span>
            <span className={styles.metricLabel}>Активных пользователей</span>
          </div>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricIcon}>📈</span>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{formatNumber(data.sessions)}</span>
            <span className={styles.metricLabel}>Сессий сегодня</span>
          </div>
        </div>
      </div>

      {/* Дополнительные метрики */}
      <div className={styles.additionalMetrics}>
        <div className={styles.additionalMetric}>
          <span className={styles.addMetricLabel}>Время на сайте</span>
          <span className={styles.addMetricValue}>{formatDuration(data.avgSessionDuration)}</span>
        </div>
        <div className={styles.additionalMetric}>
          <span className={styles.addMetricLabel}>Страниц за сессию</span>
          <span className={styles.addMetricValue}>{data.pageviewsPerSession}</span>
        </div>
      </div>

      {/* Топ страницы */}
      <div className={styles.topPages}>
        <h4>📄 Популярные страницы</h4>
        <div className={styles.pagesList}>
          {data.topPages.map((page, index) => (
            <div key={index} className={styles.pageItem}>
              <span className={styles.pagePath}>{page.path}</span>
              <span className={styles.pageViews}>{formatNumber(page.views)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* География */}
      <div className={styles.geography}>
        <h4>🌍 География</h4>
        <div className={styles.countriesList}>
          {data.topCountries.slice(0, 3).map((country, index) => (
            <div key={index} className={styles.countryItem}>
              <div className={styles.countryInfo}>
                <span className={styles.countryName}>{country.country}</span>
                <span className={styles.countryPercent}>{country.percent}%</span>
              </div>
              <div className={styles.countryBar}>
                <div 
                  className={styles.countryProgress}
                  style={{ width: `${country.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Устройства */}
      <div className={styles.devices}>
        <h4>📱 Устройства</h4>
        <div className={styles.devicesList}>
          {data.deviceBreakdown.map((device, index) => (
            <div key={index} className={styles.deviceItem}>
              <span className={styles.deviceName}>{device.device}</span>
              <span className={styles.devicePercent}>{device.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Источники трафика */}
      <div className={styles.sources}>
        <h4>🔗 Источники трафика</h4>
        <div className={styles.sourcesList}>
          {data.acquisitionChannels.slice(0, 3).map((source, index) => (
            <div key={index} className={styles.sourceItem}>
              <span className={styles.sourceName}>{source.channel}</span>
              <span className={styles.sourceUsers}>{formatNumber(source.users)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Последнее обновление */}
      <div className={styles.lastUpdate}>
        Обновлено: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
}