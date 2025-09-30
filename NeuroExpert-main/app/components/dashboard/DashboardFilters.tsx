'use client';

import React, { useState, useCallback } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './DashboardFilters.module.css';

interface DashboardFiltersProps {
  filters: DashboardFiltersType;
  onFiltersChange: (filters: Partial<DashboardFiltersType>) => void;
  userRole: UserRole;
}

export default function DashboardFilters({
  filters,
  onFiltersChange,
  userRole
}: DashboardFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Предустановленные временные диапазоны
  const timePresets = [
    { label: '1 час', value: 1 * 60 * 60 * 1000 },
    { label: '6 часов', value: 6 * 60 * 60 * 1000 },
    { label: '24 часа', value: 24 * 60 * 60 * 1000 },
    { label: '7 дней', value: 7 * 24 * 60 * 60 * 1000 },
    { label: '30 дней', value: 30 * 24 * 60 * 60 * 1000 }
  ];

  // Обработка изменения временного диапазона
  const handleTimePreset = useCallback((milliseconds: number) => {
    const to = new Date().toISOString();
    const from = new Date(Date.now() - milliseconds).toISOString();
    
    onFiltersChange({
      timeRange: { from, to }
    });
  }, [onFiltersChange]);

  // Обработка изменения среды
  const handleEnvChange = useCallback((env: string) => {
    onFiltersChange({ env: env as 'dev' | 'stage' | 'prod' });
  }, [onFiltersChange]);

  // Переключение live режима
  const toggleLiveMode = useCallback(() => {
    onFiltersChange({ liveMode: !filters.liveMode });
  }, [filters.liveMode, onFiltersChange]);

  // Изменение интервала обновления
  const handleRefreshInterval = useCallback((interval: number) => {
    onFiltersChange({ refreshInterval: interval });
  }, [onFiltersChange]);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    onFiltersChange({
      timeRange: {
        from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString()
      },
      env: 'prod',
      project: undefined,
      version: undefined,
      segment: undefined,
      refreshInterval: 15000,
      liveMode: true
    });
  }, [onFiltersChange]);

  // Форматирование даты для input
  const formatDateForInput = (isoString: string) => {
    return new Date(isoString).toISOString().slice(0, 16);
  };

  return (
    <div className={styles.filtersContainer}>
      {/* Основные фильтры */}
      <div className={styles.mainFilters}>
        {/* Временной диапазон */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <span className={styles.labelIcon}>⏰</span>
            Период
          </label>
          <div className={styles.timePresets}>
            {timePresets.map(preset => (
              <button
                key={preset.label}
                className={styles.presetButton}
                onClick={() => handleTimePreset(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Среда */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <span className={styles.labelIcon}>🌐</span>
            Среда
          </label>
          <div className={styles.envButtons}>
            {['dev', 'stage', 'prod'].map(env => (
              <button
                key={env}
                className={`${styles.envButton} ${filters.env === env ? styles.active : ''}`}
                onClick={() => handleEnvChange(env)}
                disabled={userRole === 'Client' && env !== 'prod'}
              >
                {env.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Live режим */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <span className={styles.labelIcon}>📡</span>
            Real-time
          </label>
          <button
            className={`${styles.liveToggle} ${filters.liveMode ? styles.active : ''}`}
            onClick={toggleLiveMode}
          >
            <span className={styles.toggleDot}></span>
            {filters.liveMode ? 'Live' : 'Статично'}
          </button>
        </div>

        {/* Интервал обновления */}
        {filters.liveMode && (
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              <span className={styles.labelIcon}>⚡</span>
              Обновление
            </label>
            <select
              className={styles.refreshSelect}
              value={filters.refreshInterval}
              onChange={(e) => handleRefreshInterval(Number(e.target.value))}
            >
              <option value={5000}>5 сек</option>
              <option value={15000}>15 сек</option>
              <option value={30000}>30 сек</option>
              <option value={60000}>1 мин</option>
            </select>
          </div>
        )}
      </div>

      {/* Дополнительные фильтры */}
      <div className={styles.additionalFilters}>
        <button
          className={styles.advancedToggle}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className={styles.labelIcon}>⚙️</span>
          Дополнительно
          <span className={`${styles.chevron} ${showAdvanced ? styles.rotated : ''}`}>
            ▼
          </span>
        </button>

        {showAdvanced && (
          <div className={styles.advancedPanel}>
            {/* Кастомный временной диапазон */}
            <div className={styles.customTimeRange}>
              <div className={styles.timeInput}>
                <label>От:</label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(filters.timeRange.from)}
                  onChange={(e) => onFiltersChange({
                    timeRange: {
                      ...filters.timeRange,
                      from: new Date(e.target.value).toISOString()
                    }
                  })}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.timeInput}>
                <label>До:</label>
                <input
                  type="datetime-local"
                  value={formatDateForInput(filters.timeRange.to)}
                  onChange={(e) => onFiltersChange({
                    timeRange: {
                      ...filters.timeRange,
                      to: new Date(e.target.value).toISOString()
                    }
                  })}
                  className={styles.dateInput}
                />
              </div>
            </div>

            {/* Проект и версия (только для Admin/Manager) */}
            {userRole !== 'Client' && (
              <div className={styles.projectFilters}>
                <div className={styles.projectInput}>
                  <label>Проект:</label>
                  <input
                    type="text"
                    value={filters.project || ''}
                    onChange={(e) => onFiltersChange({ project: e.target.value || undefined })}
                    placeholder="neuroexpert"
                    className={styles.textInput}
                  />
                </div>
                <div className={styles.versionInput}>
                  <label>Версия:</label>
                  <input
                    type="text"
                    value={filters.version || ''}
                    onChange={(e) => onFiltersChange({ version: e.target.value || undefined })}
                    placeholder="2025.08.29"
                    className={styles.textInput}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Действия */}
        <div className={styles.actions}>
          <button
            className={styles.resetButton}
            onClick={resetFilters}
            title="Сбросить все фильтры"
          >
            <span className={styles.labelIcon}>🔄</span>
            Сброс
          </button>
        </div>
      </div>
    </div>
  );
}