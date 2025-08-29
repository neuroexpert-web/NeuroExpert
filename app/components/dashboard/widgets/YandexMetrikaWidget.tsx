'use client';

import React, { useState, useEffect } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './YandexMetrikaWidget.module.css';

interface YandexMetrikaWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface YandexMetrikaData {
  onlineUsers: number;
  todayVisits: number;
  todayViews: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: Array<{
    url: string;
    title: string;
    visits: number;
    percent: number;
  }>;
  trafficSources: Array<{
    source: string;
    visits: number;
    percent: number;
  }>;
  realTimeData: Array<{
    time: string;
    visitors: number;
  }>;
}

export default function YandexMetrikaWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: YandexMetrikaWidgetProps) {
  const [data, setData] = useState<YandexMetrikaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Имитация загрузки данных из Яндекс.Метрики
  useEffect(() => {
    const loadYandexData = () => {
      setLoading(true);
      
      // Симуляция API вызова к Яндекс.Метрике
      setTimeout(() => {
        try {
          // Генерация реалистичных данных
          const currentHour = new Date().getHours();
          const baseVisitors = Math.floor(Math.random() * 50) + 20;
          
          setData({
            onlineUsers: baseVisitors + Math.floor(Math.random() * 10),
            todayVisits: 1847 + Math.floor(Math.random() * 100),
            todayViews: 3245 + Math.floor(Math.random() * 200),
            bounceRate: 42.5 + (Math.random() * 10 - 5),
            avgSessionDuration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            topPages: [
              { url: '/', title: 'Главная страница', visits: 567, percent: 31.2 },
              { url: '/catalog', title: 'Каталог товаров', visits: 234, percent: 12.8 },
              { url: '/about', title: 'О компании', visits: 189, percent: 10.4 },
              { url: '/contacts', title: 'Контакты', visits: 145, percent: 8.0 },
              { url: '/services', title: 'Услуги', visits: 123, percent: 6.8 }
            ],
            trafficSources: [
              { source: 'Яндекс (поиск)', visits: 685, percent: 37.1 },
              { source: 'Прямые заходы', visits: 423, percent: 22.9 },
              { source: 'Социальные сети', visits: 298, percent: 16.1 },
              { source: 'Google (поиск)', visits: 234, percent: 12.7 },
              { source: 'Реферальные сайты', visits: 207, percent: 11.2 }
            ],
            realTimeData: Array.from({ length: 24 }, (_, i) => ({
              time: `${String(i).padStart(2, '0')}:00`,
              visitors: Math.floor(Math.random() * 80) + 10
            }))
          });
          
          setError(null);
        } catch (err) {
          setError('Ошибка загрузки данных Яндекс.Метрики');
        } finally {
          setLoading(false);
        }
      }, 800);
    };

    loadYandexData();

    // Автообновление данных
    if (filters.liveMode) {
      const interval = setInterval(loadYandexData, refreshInterval);
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
          <span>Загрузка данных Яндекс.Метрики...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.widget}>
        <div className={styles.error}>
          <span>❌ {error || 'Не удалось загрузить данные'}</span>
          <small>Проверьте настройки API Яндекс.Метрики</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      {/* Заголовок с логотипом */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.yandexLogo}>Я</span>
          <span className={styles.serviceName}>Метрика</span>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          <span>В реальном времени</span>
        </div>
      </div>

      {/* Основные метрики */}
      <div className={styles.mainMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{data.onlineUsers}</div>
          <div className={styles.metricLabel}>Онлайн сейчас</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{formatNumber(data.todayVisits)}</div>
          <div className={styles.metricLabel}>Визиты сегодня</div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{formatNumber(data.todayViews)}</div>
          <div className={styles.metricLabel}>Просмотры сегодня</div>
        </div>
      </div>

      {/* Дополнительные метрики */}
      <div className={styles.additionalMetrics}>
        <div className={styles.metric}>
          <span className={styles.metricName}>Отказы</span>
          <span className={styles.metricValue}>{formatPercent(data.bounceRate)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricName}>Время на сайте</span>
          <span className={styles.metricValue}>{data.avgSessionDuration}</span>
        </div>
      </div>

      {/* Топ страниц */}
      <div className={styles.section}>
        <h4>Популярные страницы</h4>
        <div className={styles.topPages}>
          {data.topPages.slice(0, 3).map((page, index) => (
            <div key={index} className={styles.pageItem}>
              <div className={styles.pageInfo}>
                <div className={styles.pageTitle}>{page.title}</div>
                <div className={styles.pageUrl}>{page.url}</div>
              </div>
              <div className={styles.pageStats}>
                <div className={styles.pageVisits}>{formatNumber(page.visits)}</div>
                <div className={styles.pagePercent}>{formatPercent(page.percent)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Источники трафика */}
      <div className={styles.section}>
        <h4>Источники трафика</h4>
        <div className={styles.trafficSources}>
          {data.trafficSources.slice(0, 3).map((source, index) => (
            <div key={index} className={styles.sourceItem}>
              <div className={styles.sourceName}>{source.source}</div>
              <div className={styles.sourceStats}>
                <div className={styles.sourceVisits}>{formatNumber(source.visits)}</div>
                <div className={styles.sourceBar}>
                  <div 
                    className={styles.sourceBarFill} 
                    style={{ width: `${source.percent}%` }}
                  ></div>
                </div>
                <div className={styles.sourcePercent}>{formatPercent(source.percent)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Мини-график активности */}
      <div className={styles.section}>
        <h4>Активность за сутки</h4>
        <div className={styles.miniChart}>
          {data.realTimeData.slice(-12).map((point, index) => (
            <div 
              key={index} 
              className={styles.chartBar}
              style={{ 
                height: `${(point.visitors / 80) * 100}%`,
                opacity: 0.3 + (point.visitors / 80) * 0.7
              }}
              title={`${point.time}: ${point.visitors} посетителей`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}