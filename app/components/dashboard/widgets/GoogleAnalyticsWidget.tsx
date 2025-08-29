'use client';

import React, { useState, useEffect } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './GoogleAnalyticsWidget.module.css';

interface GoogleAnalyticsWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface GoogleAnalyticsData {
  activeUsers: number;
  sessionsToday: number;
  pageviewsToday: number;
  sessionDuration: string;
  newUsers: number;
  returningUsers: number;
  conversionRate: number;
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
  hourlyData: Array<{
    hour: string;
    users: number;
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

  // Имитация загрузки данных из Google Analytics
  useEffect(() => {
    const loadAnalyticsData = () => {
      setLoading(true);
      
      // Симуляция API вызова к Google Analytics
      setTimeout(() => {
        try {
          const baseUsers = Math.floor(Math.random() * 80) + 30;
          
          setData({
            activeUsers: baseUsers + Math.floor(Math.random() * 15),
            sessionsToday: 2156 + Math.floor(Math.random() * 150),
            pageviewsToday: 4321 + Math.floor(Math.random() * 300),
            sessionDuration: `${Math.floor(Math.random() * 2) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            newUsers: 1234 + Math.floor(Math.random() * 100),
            returningUsers: 922 + Math.floor(Math.random() * 50),
            conversionRate: 2.8 + (Math.random() * 1.4 - 0.7),
            topCountries: [
              { country: 'Россия', users: 1456, percent: 67.5 },
              { country: 'Беларусь', users: 234, percent: 10.8 },
              { country: 'Казахстан', users: 189, percent: 8.8 },
              { country: 'Украина', users: 156, percent: 7.2 },
              { country: 'Другие', users: 121, percent: 5.7 }
            ],
            deviceBreakdown: [
              { device: 'Мобильные', users: 1345, percent: 62.4 },
              { device: 'Компьютеры', users: 567, percent: 26.3 },
              { device: 'Планшеты', users: 244, percent: 11.3 }
            ],
            acquisitionChannels: [
              { channel: 'Органический поиск', users: 867, percent: 40.2 },
              { channel: 'Прямой трафик', users: 543, percent: 25.2 },
              { channel: 'Социальные сети', users: 321, percent: 14.9 },
              { channel: 'Контекстная реклама', users: 278, percent: 12.9 },
              { channel: 'Email', users: 147, percent: 6.8 }
            ],
            hourlyData: Array.from({ length: 24 }, (_, i) => ({
              hour: `${String(i).padStart(2, '0')}:00`,
              users: Math.floor(Math.random() * 100) + 20
            }))
          });
          
          setError(null);
        } catch (err) {
          setError('Ошибка загрузки данных Google Analytics');
        } finally {
          setLoading(false);
        }
      }, 900);
    };

    loadAnalyticsData();

    // Автообновление данных
    if (filters.liveMode) {
      const interval = setInterval(loadAnalyticsData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [filters.liveMode, refreshInterval]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU');
  };

  const formatPercent = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Загрузка данных Google Analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.widget}>
        <div className={styles.error}>
          <span>❌ {error || 'Не удалось загрузить данные'}</span>
          <small>Проверьте настройки Google Analytics API</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      {/* Заголовок с логотипом */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.googleLogo}>G</span>
          <span className={styles.serviceName}>Analytics</span>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          <span>В реальном времени</span>
        </div>
      </div>

      {/* Основные метрики */}
      <div className={styles.mainMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{data.activeUsers}</div>
          <div className={styles.metricLabel}>Активные пользователи</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{formatNumber(data.sessionsToday)}</div>
          <div className={styles.metricLabel}>Сессии сегодня</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{formatNumber(data.pageviewsToday)}</div>
          <div className={styles.metricLabel}>Просмотры страниц</div>
        </div>
      </div>

      {/* Пользователи */}
      <div className={styles.usersSection}>
        <div className={styles.userMetric}>
          <span className={styles.userLabel}>Новые</span>
          <span className={styles.userValue}>{formatNumber(data.newUsers)}</span>
        </div>
        <div className={styles.userMetric}>
          <span className={styles.userLabel}>Возвращаются</span>
          <span className={styles.userValue}>{formatNumber(data.returningUsers)}</span>
        </div>
        <div className={styles.userMetric}>
          <span className={styles.userLabel}>Конверсия</span>
          <span className={styles.userValue}>{formatPercent(data.conversionRate)}</span>
        </div>
      </div>

      {/* География */}
      <div className={styles.section}>
        <h4>География пользователей</h4>
        <div className={styles.countries}>
          {data.topCountries.slice(0, 4).map((country, index) => (
            <div key={index} className={styles.countryItem}>
              <span className={styles.countryName}>{country.country}</span>
              <div className={styles.countryStats}>
                <span className={styles.countryUsers}>{formatNumber(country.users)}</span>
                <div className={styles.countryBar}>
                  <div 
                    className={styles.countryBarFill} 
                    style={{ width: `${country.percent}%` }}
                  ></div>
                </div>
                <span className={styles.countryPercent}>{formatPercent(country.percent)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Устройства */}
      <div className={styles.section}>
        <h4>Устройства</h4>
        <div className={styles.devices}>
          {data.deviceBreakdown.map((device, index) => (
            <div key={index} className={styles.deviceItem}>
              <div className={styles.deviceInfo}>
                <span className={styles.deviceName}>{device.device}</span>
                <span className={styles.devicePercent}>{formatPercent(device.percent)}</span>
              </div>
              <div className={styles.deviceBar}>
                <div 
                  className={styles.deviceBarFill} 
                  style={{ width: `${device.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Источники трафика */}
      <div className={styles.section}>
        <h4>Каналы привлечения</h4>
        <div className={styles.channels}>
          {data.acquisitionChannels.slice(0, 3).map((channel, index) => (
            <div key={index} className={styles.channelItem}>
              <div className={styles.channelName}>{channel.channel}</div>
              <div className={styles.channelStats}>
                <span className={styles.channelUsers}>{formatNumber(channel.users)}</span>
                <span className={styles.channelPercent}>{formatPercent(channel.percent)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* График активности */}
      <div className={styles.section}>
        <h4>Активность по часам</h4>
        <div className={styles.hourlyChart}>
          {data.hourlyData.slice(-12).map((point, index) => (
            <div 
              key={index} 
              className={styles.hourlyBar}
              style={{ 
                height: `${(point.users / 120) * 100}%`,
                opacity: 0.4 + (point.users / 120) * 0.6
              }}
              title={`${point.hour}: ${point.users} пользователей`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}