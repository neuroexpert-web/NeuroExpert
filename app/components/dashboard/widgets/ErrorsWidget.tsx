'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './ErrorsWidget.module.css';

interface ErrorsWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

export default function ErrorsWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: ErrorsWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Демо данные для ошибок
  const [errorsData] = useState({
    totalErrors: 89,
    errorRate: 0.24,
    p95Latency: 420,
    p99Latency: 860,
    topIssues: [
      { 
        key: 'AUTH-401', 
        title: 'Unauthorized on /api/auth', 
        events: 32, 
        users: 25, 
        severity: 'error',
        trend: 'up'
      },
      { 
        key: 'TIMEOUT-API', 
        title: 'Timeout calling CRM API', 
        events: 18, 
        users: 16, 
        severity: 'warning',
        trend: 'down'
      },
      { 
        key: 'DB-CONNECTION', 
        title: 'Database connection failed', 
        events: 12, 
        users: 8, 
        severity: 'critical',
        trend: 'stable'
      },
      { 
        key: 'VALIDATION-ERROR', 
        title: 'Form validation failed', 
        events: 27, 
        users: 22, 
        severity: 'warning',
        trend: 'up'
      }
    ],
    performanceMetrics: [
      { endpoint: '/api/auth/login', p95: 180, p99: 350, rps: 35, errorRate: 0.2 },
      { endpoint: '/api/data/users', p95: 520, p99: 900, rps: 18, errorRate: 0.4 },
      { endpoint: '/api/analytics', p95: 290, p99: 650, rps: 12, errorRate: 0.1 }
    ],
    errorsByType: {
      '5xx': 15,
      '4xx': 42,
      'timeout': 8,
      'validation': 24
    }
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

  // Получение цвета по severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'error': return '#f59e0b';
      case 'warning': return '#eab308';
      default: return '#6b7280';
    }
  };

  // Получение иконки тренда
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  if (loading && !errorsData) {
    return (
      <div className={styles.widget}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Загрузка данных ошибок...</span>
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
        {/* Основные метрики ошибок */}
        <div className={styles.errorMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>🚨</div>
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>{errorsData.totalErrors}</div>
              <div className={styles.metricLabel}>Всего ошибок</div>
            </div>
            <div className={`${styles.trendBadge} ${styles.negative}`}>
              +5
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>📊</div>
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>{errorsData.errorRate}%</div>
              <div className={styles.metricLabel}>Error Rate</div>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>⚡</div>
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>{errorsData.p95Latency}ms</div>
              <div className={styles.metricLabel}>P95 Latency</div>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>🐌</div>
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>{errorsData.p99Latency}ms</div>
              <div className={styles.metricLabel}>P99 Latency</div>
            </div>
          </div>
        </div>

        {/* Топ проблем */}
        <div className={styles.topIssues}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🔍</span>
            Критические проблемы
          </h4>
          
          <div className={styles.issuesList}>
            {errorsData.topIssues.map((issue, index) => (
              <div key={index} className={styles.issueItem}>
                <div className={styles.issueHeader}>
                  <div className={styles.issueInfo}>
                    <span 
                      className={styles.severityBadge}
                      style={{ backgroundColor: getSeverityColor(issue.severity) }}
                    >
                      {issue.severity}
                    </span>
                    <span className={styles.issueKey}>{issue.key}</span>
                    <span className={styles.trendIcon}>{getTrendIcon(issue.trend)}</span>
                  </div>
                  <div className={styles.issueStats}>
                    <span className={styles.issueEvents}>{issue.events} событий</span>
                    <span className={styles.issueUsers}>{issue.users} пользователей</span>
                  </div>
                </div>
                <div className={styles.issueTitle}>{issue.title}</div>
                {userRole !== 'Client' && (
                  <div className={styles.issueActions}>
                    <button className={styles.actionButton}>Drill-down</button>
                    <button className={styles.actionButton}>Создать тикет</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance метрики */}
        {userRole !== 'Client' && (
          <div className={styles.performanceMetrics}>
            <h4 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>⚡</span>
              Performance по эндпоинтам
            </h4>
            
            <div className={styles.endpointsList}>
              {errorsData.performanceMetrics.map((endpoint, index) => (
                <div key={index} className={styles.endpointItem}>
                  <div className={styles.endpointPath}>{endpoint.endpoint}</div>
                  <div className={styles.endpointMetrics}>
                    <div className={styles.endpointMetric}>
                      <span className={styles.metricLabel}>P95</span>
                      <span className={styles.metricValue}>{endpoint.p95}ms</span>
                    </div>
                    <div className={styles.endpointMetric}>
                      <span className={styles.metricLabel}>RPS</span>
                      <span className={styles.metricValue}>{endpoint.rps}</span>
                    </div>
                    <div className={styles.endpointMetric}>
                      <span className={styles.metricLabel}>Errors</span>
                      <span 
                        className={styles.metricValue}
                        style={{ 
                          color: endpoint.errorRate > 0.5 ? '#ef4444' : endpoint.errorRate > 0.2 ? '#f59e0b' : '#10b981' 
                        }}
                      >
                        {endpoint.errorRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ошибки по типам */}
        <div className={styles.errorsByType}>
          <h4 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📋</span>
            Распределение по типам
          </h4>
          
          <div className={styles.typesList}>
            {Object.entries(errorsData.errorsByType).map(([type, count]) => (
              <div key={type} className={styles.typeItem}>
                <span className={styles.typeName}>{type}</span>
                <span className={styles.typeCount}>{count}</span>
                <div className={styles.typeBar}>
                  <div 
                    className={styles.typeProgress}
                    style={{ 
                      width: `${(count / Math.max(...Object.values(errorsData.errorsByType))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
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