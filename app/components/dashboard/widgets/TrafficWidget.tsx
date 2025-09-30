'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './TrafficWidget.module.css';

interface TrafficWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

export default function TrafficWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: TrafficWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Демо данные для трафика
  const [trafficData] = useState({
    usersOnline: 147,
    sessionsToday: 2834,
    conversionRate: 3.8,
    bounceRate: 42.3,
    avgSessionDuration: 245, // секунды
    topPages: [
      { page: '/', views: 1234, conversionRate: 4.2 },
      { page: '/pricing', views: 856, conversionRate: 8.1 },
      { page: '/features', views: 723, conversionRate: 2.9 }
    ],
    trafficSources: [
      { source: 'Organic', percent: 42.5, users: 1203 },
      { source: 'Direct', percent: 28.3, users: 802 },
      { source: 'Paid', percent: 18.7, users: 529 },
      { source: 'Social', percent: 10.5, users: 297 }
    ]
  });

  // Имитация загрузки данных
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Первоначальная загрузка
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Автообновление
  useEffect(() => {
    if (!filters.liveMode) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [filters.liveMode, refreshInterval, fetchData]);

  // Форматирование времени сессии
  const formatSessionDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}м ${secs}с`;
  };

  if (loading && !trafficData) {
    return (
      <div className={styles.widget}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Загрузка данных трафика...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.widget}>
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠️</span>
          <div>
            <h4>Ошибка загрузки</h4>
            <p>{error}</p>
            <button onClick={fetchData} className={styles.retryButton}>
              Повторить
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.content}>
        {/* Основные метрики */}
        <div className={styles.mainMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>👥</div>
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>{trafficData.usersOnline}</div>
              <div className={styles.metricLabel}>Онлайн сейчас</div>
            </div>
            <div className={styles.liveIndicator}>
              <span className={styles.liveDot}></span>
              Live
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>📈</div>
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>{trafficData.sessionsToday.toLocaleString()}</div>
              <div className={styles.metricLabel}>Сессии сегодня</div>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>🎯</div>
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>{trafficData.conversionRate}%</div>
              <div className={styles.metricLabel}>Конверсия</div>
            </div>
            <div className={`${styles.trendBadge} ${styles.positive}`}>
              +0.3%
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>⏱️</div>
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>{formatSessionDuration(trafficData.avgSessionDuration)}</div>
              <div className={styles.metricLabel}>Среднее время</div>
            </div>
          </div>
        </div>

        {/* Источники трафика */}
        <div className={styles.trafficSources}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🌐</span>
            Источники трафика
          </h4>
          
          <div className={styles.sourcesList}>
            {trafficData.trafficSources.map((source, index) => (
              <div key={index} className={styles.sourceItem}>
                <div className={styles.sourceHeader}>
                  <span className={styles.sourceName}>{source.source}</span>
                  <span className={styles.sourcePercent}>{source.percent}%</span>
                </div>
                <div className={styles.sourceBar}>
                  <div 
                    className={styles.sourceProgress}
                    style={{ width: `${source.percent}%` }}
                  ></div>
                </div>
                <div className={styles.sourceUsers}>
                  {source.users.toLocaleString()} пользователей
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Топ страницы */}
        <div className={styles.topPages}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📄</span>
            Популярные страницы
          </h4>
          
          <div className={styles.pagesList}>
            {trafficData.topPages.map((page, index) => (
              <div key={index} className={styles.pageItem}>
                <div className={styles.pageRank}>#{index + 1}</div>
                <div className={styles.pageInfo}>
                  <div className={styles.pagePath}>{page.page}</div>
                  <div className={styles.pageStats}>
                    <span>{page.views.toLocaleString()} просмотров</span>
                    <span className={styles.pageConversion}>
                      {page.conversionRate}% конверсия
                    </span>
                  </div>
                </div>
                <div className={styles.pageChart}>
                  {/* Мини-спарклайн */}
                  <div className={styles.sparkline}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <div 
                        key={i}
                        className={styles.sparkBar}
                        style={{ 
                          height: `${20 + Math.random() * 60}%`,
                          backgroundColor: page.conversionRate > 5 ? '#10b981' : page.conversionRate > 3 ? '#f59e0b' : '#6b7280'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Дополнительные метрики */}
        <div className={styles.additionalMetrics}>
          <div className={styles.additionalMetric}>
            <span className={styles.additionalLabel}>Bounce Rate</span>
            <span className={styles.additionalValue}>{trafficData.bounceRate}%</span>
          </div>
          <div className={styles.additionalMetric}>
            <span className={styles.additionalLabel}>New vs Returning</span>
            <span className={styles.additionalValue}>64% / 36%</span>
          </div>
          <div className={styles.additionalMetric}>
            <span className={styles.additionalLabel}>Mobile Traffic</span>
            <span className={styles.additionalValue}>68%</span>
          </div>
        </div>

        {/* Статус обновления */}
        <div className={styles.updateStatus}>
          <span className={styles.updateIcon}>
            {filters.liveMode ? '📡' : '⏸️'}
          </span>
          <span className={styles.updateText}>
            {filters.liveMode 
              ? `Обновлено ${lastUpdate.toLocaleTimeString()}`
              : 'Автообновление отключено'
            }
          </span>
        </div>
      </div>
    </div>
  );
}