'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole, MetricsOverview } from '@/types/dashboard';
import styles from './SLOWidget.module.css';

interface SLOWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

export default function SLOWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: SLOWidgetProps) {
  const [data, setData] = useState<MetricsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Загрузка данных
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      const params = new URLSearchParams({
        from: filters.timeRange.from,
        to: filters.timeRange.to,
        env: filters.env || 'prod',
        ...(filters.project && { project: filters.project }),
        ...(filters.version && { version: filters.version })
      });

      const response = await fetch(`/api/metrics/overview?${params}`, {
        headers: {
          'Authorization': 'Bearer demo-token',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'ok') {
        setData(result.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(result.error?.message || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

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

  // Расчет статуса SLO
  const getSLOStatus = (actual: number, target: number, budgetUsed: number) => {
    if (actual >= target) {
      return 'healthy';
    } else if (budgetUsed < 80) {
      return 'warning';
    } else {
      return 'critical';
    }
  };

  // Цвет для процента использования budget
  const getBudgetColor = (budgetUsed: number) => {
    if (budgetUsed < 50) return '#10b981'; // green
    if (budgetUsed < 80) return '#f59e0b'; // yellow  
    return '#ef4444'; // red
  };

  if (loading && !data) {
    return (
      <div className={styles.widget}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Загрузка SLO метрик...</span>
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

  if (!data) {
    return (
      <div className={styles.widget}>
        <div className={styles.noData}>
          Нет данных для отображения
        </div>
      </div>
    );
  }

  const sloStatus = getSLOStatus(data.slo.actual, data.slo.target, data.slo.errorBudgetUsedPct);
  const budgetColor = getBudgetColor(data.slo.errorBudgetUsedPct);
  const shouldFreezeReleases = data.slo.errorBudgetUsedPct > 90;

  return (
    <div className={styles.widget}>
      <div className={styles.content}>
        {/* Основная SLO метрика */}
        <div className={styles.mainMetric}>
          <div className={`${styles.sloIndicator} ${styles[sloStatus]}`}>
            <div className={styles.sloValue}>
              {data.slo.actual.toFixed(2)}%
            </div>
            <div className={styles.sloTarget}>
              Цель: {data.slo.target}%
            </div>
          </div>
          
          <div className={styles.sloDetails}>
            <h3>Service Level Objective</h3>
            <p className={styles.period}>За период: {data.slo.period}</p>
            
            {/* Статус и алерт */}
            <div className={`${styles.statusBadge} ${styles[sloStatus]}`}>
              {sloStatus === 'healthy' && '✅ Здоровое состояние'}
              {sloStatus === 'warning' && '⚠️ Требует внимания'}
              {sloStatus === 'critical' && '🚨 Критическое состояние'}
            </div>

            {shouldFreezeReleases && (
              <div className={styles.freezeAlert}>
                <span className={styles.freezeIcon}>🧊</span>
                <strong>FREEZE РЕЛИЗОВ</strong>
                <p>Error budget исчерпан. Новые релизы заблокированы до восстановления SLO.</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Budget */}
        <div className={styles.errorBudget}>
          <div className={styles.budgetHeader}>
            <h4>Error Budget</h4>
            <span 
              className={styles.budgetValue}
              style={{ color: budgetColor }}
            >
              {data.slo.errorBudgetUsedPct.toFixed(1)}%
            </span>
          </div>
          
          <div className={styles.budgetBar}>
            <div 
              className={styles.budgetProgress}
              style={{ 
                width: `${Math.min(data.slo.errorBudgetUsedPct, 100)}%`,
                backgroundColor: budgetColor
              }}
            ></div>
          </div>
          
          <div className={styles.budgetLabels}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Аптайм метрики */}
        <div className={styles.uptimeMetrics}>
          <h4>Аптайм</h4>
          <div className={styles.uptimeGrid}>
            <div className={styles.uptimeItem}>
              <span className={styles.uptimeLabel}>1 час</span>
              <span className={styles.uptimeValue}>
                {data.uptime.last1h.toFixed(2)}%
              </span>
            </div>
            <div className={styles.uptimeItem}>
              <span className={styles.uptimeLabel}>24 часа</span>
              <span className={styles.uptimeValue}>
                {data.uptime.last24h.toFixed(2)}%
              </span>
            </div>
            <div className={styles.uptimeItem}>
              <span className={styles.uptimeLabel}>30 дней</span>
              <span className={styles.uptimeValue}>
                {data.uptime.last30d.toFixed(2)}%
              </span>
            </div>
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