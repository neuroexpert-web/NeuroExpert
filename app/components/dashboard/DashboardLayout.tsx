'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DashboardFilters as DashboardFiltersType, UserRole, WidgetConfig } from '@/types/dashboard';
import styles from './DashboardLayout.module.css';

// Импорт виджетов
import SLOWidget from './widgets/SLOWidget';
import TrafficWidget from './widgets/TrafficWidget';
import ErrorsWidget from './widgets/ErrorsWidget';
import SystemWidget from './widgets/SystemWidget';
import DashboardFilters from './DashboardFilters';

interface DashboardLayoutProps {
  userRole: UserRole;
  initialFilters?: Partial<DashboardFiltersType>;
}

export default function DashboardLayout({ 
  userRole, 
  initialFilters 
}: DashboardLayoutProps) {
  // Состояние фильтров
  const [filters, setFilters] = useState<DashboardFiltersType>({
    timeRange: {
      from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      to: new Date().toISOString()
    },
    env: 'prod',
    refreshInterval: 15000,
    liveMode: true,
    ...initialFilters
  });

  // Состояние виджетов
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    {
      id: 'slo-overview',
      type: 'slo',
      title: 'SLO & Аптайм',
      size: 'medium',
      position: { x: 0, y: 0 },
      refreshInterval: 15000,
      visible: true,
      pinned: true
    },
    {
      id: 'traffic-overview', 
      type: 'traffic',
      title: 'Трафик & Конверсии',
      size: 'medium',
      position: { x: 1, y: 0 },
      refreshInterval: 30000,
      visible: true
    },
    {
      id: 'errors-overview',
      type: 'errors', 
      title: 'Ошибки & Performance',
      size: 'medium',
      position: { x: 0, y: 1 },
      refreshInterval: 15000,
      visible: true
    },
    {
      id: 'system-overview',
      type: 'system',
      title: 'Здоровье Сервисов',
      size: 'medium', 
      position: { x: 1, y: 1 },
      refreshInterval: 15000,
      visible: true
    }
  ]);

  // Активная вкладка
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Состояние подключения
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  // Real-time обновления
  useEffect(() => {
    if (!filters.liveMode) return;

    const interval = setInterval(() => {
      // Триггер обновления для виджетов
      setWidgets(prev => prev.map(w => ({ ...w })));
    }, filters.refreshInterval);

    setConnectionStatus('connected');

    return () => {
      clearInterval(interval);
      setConnectionStatus('disconnected');
    };
  }, [filters.liveMode, filters.refreshInterval]);

  // Обработка изменения фильтров
  const handleFiltersChange = useCallback((newFilters: Partial<DashboardFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Переключение виджета
  const toggleWidget = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ));
  }, []);

  // Рендер виджета
  const renderWidget = (widget: WidgetConfig) => {
    if (!widget.visible) return null;

    const commonProps = {
      key: widget.id,
      filters,
      userRole,
      refreshInterval: widget.refreshInterval
    };

    switch (widget.type) {
      case 'slo':
        return <SLOWidget {...commonProps} />;
      case 'traffic':
        return <TrafficWidget {...commonProps} />;
      case 'errors':
        return <ErrorsWidget {...commonProps} />;
      case 'system':
        return <SystemWidget {...commonProps} />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: '📊' },
    { id: 'users', label: 'Пользователи', icon: '👥' },
    { id: 'errors', label: 'Ошибки', icon: '🐛' },
    { id: 'performance', label: 'Производительность', icon: '⚡' },
    { id: 'infrastructure', label: 'Инфраструктура', icon: '🖥️' },
    { id: 'logs', label: 'Логи', icon: '📝' },
    { id: 'ux', label: 'UX-сессии', icon: '🎥' },
    { id: 'roi', label: 'ROI/KPI', icon: '💰' }
  ];

  return (
    <div className={styles.dashboardLayout}>
      {/* Заголовок */}
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <span className={styles.icon}>🎛️</span>
            Визуальная Студия Мониторинга
          </h1>
          <div className={styles.statusBar}>
            <div className={`${styles.connectionStatus} ${styles[connectionStatus]}`}>
              <span className={styles.statusDot}></span>
              {connectionStatus === 'connected' && 'Live'}
              {connectionStatus === 'connecting' && 'Подключение...'}
              {connectionStatus === 'disconnected' && 'Офлайн'}
            </div>
            <div className={styles.userRole}>
              Роль: <span className={styles.roleTag}>{userRole}</span>
            </div>
          </div>
        </div>

        {/* Навигация по вкладкам */}
        <nav className={styles.tabsNavigation}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Панель фильтров */}
      <div className={styles.filtersPanel}>
        <DashboardFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          userRole={userRole}
        />
      </div>

      {/* Контент дашборда */}
      <main className={styles.dashboardContent}>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.widgetsGrid}
            >
              {widgets.map(widget => (
                <div
                  key={widget.id}
                  className={`${styles.widgetContainer} ${styles[widget.size]}`}
                  style={{
                    gridColumn: widget.position.x + 1,
                    gridRow: widget.position.y + 1
                  }}
                >
                  <div className={styles.widgetHeader}>
                    <h3 className={styles.widgetTitle}>{widget.title}</h3>
                    <div className={styles.widgetControls}>
                      {widget.pinned && (
                        <span className={styles.pinnedIcon} title="Закреплено">📌</span>
                      )}
                      <button
                        className={styles.toggleButton}
                        onClick={() => toggleWidget(widget.id)}
                        title={widget.visible ? 'Скрыть' : 'Показать'}
                      >
                        {widget.visible ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  {renderWidget(widget)}
                </div>
              ))}
            </motion.div>
          )}

          {activeTab !== 'overview' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={styles.tabContent}
            >
              <div className={styles.comingSoon}>
                <h2>🚧 {tabs.find(t => t.id === activeTab)?.label}</h2>
                <p>Вкладка в разработке. Скоро будет доступна!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Футер с информацией */}
      <footer className={styles.footer}>
        <div className={styles.footerStats}>
          <span>Виджетов активно: {widgets.filter(w => w.visible).length}</span>
          <span>Обновление каждые {(filters.refreshInterval || 15000) / 1000}с</span>
          <span>Окружение: {filters.env}</span>
        </div>
      </footer>
    </div>
  );
}