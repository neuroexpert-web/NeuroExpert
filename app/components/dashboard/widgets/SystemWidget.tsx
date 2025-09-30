'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole, SystemMetrics } from '@/types/dashboard';
import styles from './SystemWidget.module.css';

interface SystemWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

export default function SystemWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: SystemWidgetProps) {
  const [data, setData] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Загрузка данных
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      const params = new URLSearchParams({
        env: filters.env || 'prod'
      });

      const response = await fetch(`/api/systemmetrics?${params}`, {
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
  }, [filters.env]);

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

  // Получение статуса по значению
  const getStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'critical';
    if (value >= thresholds.warning) return 'warning';
    return 'healthy';
  };

  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#64748b';
    }
  };

  // Форматирование времени аптайма
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}д ${hours}ч`;
    if (hours > 0) return `${hours}ч ${mins}м`;
    return `${mins}м`;
  };

  if (loading && !data) {
    return (
      <div className={styles.widget}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Загрузка системных метрик...</span>
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

  const cpuStatus = getStatus(data.host.cpuPct, { warning: 70, critical: 85 });
  const ramStatus = getStatus(data.host.ramUsedPct, { warning: 80, critical: 90 });
  const errorRateStatus = getStatus(data.app.errorRatePct, { warning: 0.5, critical: 1.0 });

  return (
    <div className={styles.widget}>
      <div className={styles.content}>
        {/* Заголовок с общим статусом */}
        <div className={styles.header}>
          <div className={styles.overallStatus}>
            <div className={`${styles.statusDot} ${styles[cpuStatus === 'critical' || ramStatus === 'critical' || errorRateStatus === 'critical' ? 'critical' : cpuStatus === 'warning' || ramStatus === 'warning' || errorRateStatus === 'warning' ? 'warning' : 'healthy']}`}></div>
            <span>Система {cpuStatus === 'critical' || ramStatus === 'critical' || errorRateStatus === 'critical' ? 'критична' : cpuStatus === 'warning' || ramStatus === 'warning' || errorRateStatus === 'warning' ? 'требует внимания' : 'здорова'}</span>
          </div>
          <div className={styles.buildInfo}>
            <span className={styles.version}>v{data.build.version}</span>
            <span className={styles.uptime}>⏱ {formatUptime(data.build.uptimeSec)}</span>
          </div>
        </div>

        {/* Основные метрики */}
        <div className={styles.metricsGrid}>
          {/* Хост метрики */}
          <div className={styles.metricsSection}>
            <h4 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🖥️</span>
              Хост
            </h4>
            
            <div className={styles.metricItem}>
              <div className={styles.metricHeader}>
                <span>CPU</span>
                <span className={styles.metricValue} style={{ color: getStatusColor(cpuStatus) }}>
                  {data.host.cpuPct.toFixed(1)}%
                </span>
              </div>
              <div className={styles.metricBar}>
                <div 
                  className={styles.metricProgress}
                  style={{ 
                    width: `${data.host.cpuPct}%`,
                    backgroundColor: getStatusColor(cpuStatus)
                  }}
                ></div>
              </div>
            </div>

            <div className={styles.metricItem}>
              <div className={styles.metricHeader}>
                <span>RAM</span>
                <span className={styles.metricValue} style={{ color: getStatusColor(ramStatus) }}>
                  {data.host.ramUsedPct.toFixed(1)}%
                </span>
              </div>
              <div className={styles.metricBar}>
                <div 
                  className={styles.metricProgress}
                  style={{ 
                    width: `${data.host.ramUsedPct}%`,
                    backgroundColor: getStatusColor(ramStatus)
                  }}
                ></div>
              </div>
            </div>

            {/* Сетевая активность */}
            <div className={styles.networkStats}>
              <div className={styles.networkItem}>
                <span className={styles.networkLabel}>↓ IN</span>
                <span className={styles.networkValue}>{data.host.net.inMbps.toFixed(1)} Mbps</span>
              </div>
              <div className={styles.networkItem}>
                <span className={styles.networkLabel}>↑ OUT</span>
                <span className={styles.networkValue}>{data.host.net.outMbps.toFixed(1)} Mbps</span>
              </div>
            </div>
          </div>

          {/* Приложение метрики */}
          <div className={styles.metricsSection}>
            <h4 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🚀</span>
              Приложение
            </h4>
            
            <div className={styles.appStats}>
              <div className={styles.appStat}>
                <span className={styles.appLabel}>RPS</span>
                <span className={styles.appValue}>{data.app.rps}</span>
              </div>
              <div className={styles.appStat}>
                <span className={styles.appLabel}>P95</span>
                <span className={styles.appValue}>{data.app.latencyMs.p95}ms</span>
              </div>
              <div className={styles.appStat}>
                <span className={styles.appLabel}>Errors</span>
                <span 
                  className={styles.appValue}
                  style={{ color: getStatusColor(errorRateStatus) }}
                >
                  {data.app.errorRatePct.toFixed(2)}%
                </span>
              </div>
              {userRole !== 'Client' && (
                <div className={styles.appStat}>
                  <span className={styles.appLabel}>Queue</span>
                  <span className={styles.appValue}>{data.app.queues.requests}</span>
                </div>
              )}
            </div>
          </div>

          {/* База данных */}
          {userRole !== 'Client' && (
            <div className={styles.metricsSection}>
              <h4 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🗄️</span>
                База данных
              </h4>
              
              <div className={styles.dbStats}>
                <div className={styles.dbStat}>
                  <span className={styles.dbLabel}>Connections</span>
                  <span className={styles.dbValue}>{data.db.connections}</span>
                </div>
                <div className={styles.dbStat}>
                  <span className={styles.dbLabel}>Cache Hit</span>
                  <span className={styles.dbValue}>{data.db.cacheHitPct.toFixed(1)}%</span>
                </div>
                <div className={styles.dbStat}>
                  <span className={styles.dbLabel}>Slow Queries</span>
                  <span className={styles.dbValue}>{data.db.slowQueries}</span>
                </div>
                <div className={styles.dbStat}>
                  <span className={styles.dbLabel}>Replication</span>
                  <span className={styles.dbValue}>{data.db.replicationLagSec}s</span>
                </div>
              </div>
            </div>
          )}

          {/* Диски (только для Admin/Manager) */}
          {userRole !== 'Client' && data.host.disk.length > 0 && (
            <div className={styles.metricsSection}>
              <h4 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>💾</span>
                Хранилище
              </h4>
              
              <div className={styles.diskStats}>
                {data.host.disk.map((disk, index) => {
                  const diskStatus = getStatus(disk.usedPct, { warning: 80, critical: 90 });
                  return (
                    <div key={index} className={styles.diskItem}>
                      <div className={styles.diskHeader}>
                        <span className={styles.diskMount}>{disk.mount}</span>
                        <span 
                          className={styles.diskUsage}
                          style={{ color: getStatusColor(diskStatus) }}
                        >
                          {disk.usedPct.toFixed(1)}%
                        </span>
                      </div>
                      {userRole === 'Admin' && (
                        <div className={styles.diskDetails}>
                          <span>IOPS: {disk.iops}</span>
                          <span>Latency: {disk.latencyMs.toFixed(1)}ms</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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