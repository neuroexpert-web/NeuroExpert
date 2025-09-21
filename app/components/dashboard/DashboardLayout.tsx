'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DashboardFilters as DashboardFiltersType, UserRole, WidgetConfig } from '@/types/dashboard';
import styles from './DashboardLayout.module.css';

// Импорт новых виджетов
import BusinessMetricsWidget from './widgets/BusinessMetricsWidget';
import YandexMetrikaWidget from './widgets/YandexMetrikaWidget';
import GoogleAnalyticsWidget from './widgets/GoogleAnalyticsWidget';
import SiteHealthWidget from './widgets/SiteHealthWidget';
import SocialMediaWidget from './widgets/SocialMediaWidget';
import EmailMarketingWidget from './widgets/EmailMarketingWidget';
import LeadsWidget from './widgets/LeadsWidget';
import SEOWidget from './widgets/SEOWidget';
import DashboardFilters from './DashboardFilters';

// Импорт компонента Workspace для AI Assistant
import dynamic from 'next/dynamic';
const WorkspaceProvider = dynamic(() => import('../workspace/WorkspaceProvider'), { ssr: false });

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
    liveMode: true,
    refreshInterval: 15000,
    ...initialFilters
  });

  // Состояние вкладок
  const tabs = [
    { id: 'overview', name: 'Обзор', icon: '📊' }
  ];

  // Состояние виджетов - полная конфигурация
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    {
      id: 'business-overview',
      type: 'roi',
      title: 'Обзор бизнеса',
      size: 'medium',
      position: { x: 0, y: 0 },
      visible: true,
      refreshInterval: 30000
    },
    {
      id: 'site-health',
      type: 'system',
      title: 'Здоровье сайта',
      size: 'medium',
      position: { x: 1, y: 0 },
      visible: true,
      refreshInterval: 15000
    }
  ]);

  // Активная вкладка
  const [activeTab, setActiveTab] = useState('overview');
  
  // Состояние подключения
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');

  // Обработчики для фильтров
  const handleFiltersChange = useCallback((newFilters: Partial<DashboardFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleWidgetMove = useCallback((widgetId: string, position: { x: number; y: number }) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, position } : widget
    ));
  }, []);

  const handleWidgetResize = useCallback((widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, size } : widget
    ));
  }, []);

  const handleWidgetToggle = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    ));
  }, []);

  // Рендер виджета по типу
  const renderWidget = (widget: WidgetConfig) => {
    const commonProps = {
      key: widget.id,
      filters,
      connectionStatus,
      onMove: (position: { x: number; y: number }) => handleWidgetMove(widget.id, position),
      onResize: (size: 'small' | 'medium' | 'large') => handleWidgetResize(widget.id, size),
      onToggle: () => handleWidgetToggle(widget.id),
      size: widget.size === 'full' ? 'large' : widget.size as 'small' | 'medium' | 'large',
      position: widget.position
    };

    switch (widget.type) {
      case 'roi':
        return <BusinessMetricsWidget {...commonProps} />;
      case 'system':
        return <SiteHealthWidget {...commonProps} />;
      case 'traffic':
        return <YandexMetrikaWidget {...commonProps} />;
      case 'slo':
        return <GoogleAnalyticsWidget {...commonProps} />;
      default:
        return <div>Неизвестный тип виджета: {widget.type}</div>;
    }
  };

  // Эффект для автообновления при включенном live режиме
  useEffect(() => {
    if (!filters.liveMode) return;

    const interval = setInterval(() => {
      setConnectionStatus('connecting');
      // Здесь будет логика обновления данных
      setTimeout(() => setConnectionStatus('connected'), 500);
    }, filters.refreshInterval);

    return () => clearInterval(interval);
  }, [filters.liveMode, filters.refreshInterval]);

  return (
    <WorkspaceProvider>
      <div className={styles.dashboardContainer}>
        {/* Заголовок */}
        <motion.header 
          className={styles.dashboardHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.headerLeft}>
            <h1 className={styles.dashboardTitle}>🚀 НОВАЯ ПАНЕЛЬ УПРАВЛЕНИЯ v3.1.1 🚀</h1>
            <div className={styles.connectionIndicator}>
              <span className={`${styles.statusDot} ${styles[connectionStatus]}`}></span>
              <span className={styles.statusText}>
                {connectionStatus === 'connected' ? 'В сети' : 
                 connectionStatus === 'connecting' ? 'Подключение...' : 
                 'Отключен'}
              </span>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.userProfile}>
              <span className={styles.userRole}>{userRole}</span>
              <div className={styles.userAvatar}>👤</div>
            </div>
          </div>
        </motion.header>

        {/* Навигация по вкладкам */}
        <nav className={styles.dashboardNav}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navTab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabName}>{tab.name}</span>
            </button>
          ))}
        </nav>

        {/* Фильтры */}
        <motion.div 
          className={styles.filtersContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardFilters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
            userRole={userRole}
          />
        </motion.div>

        {/* Контент вкладок */}
        <main className={styles.dashboardMain}>
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                className={styles.widgetsGrid}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {widgets
                  .filter(widget => widget.visible)
                  .map(widget => (
                    <motion.div
                      key={widget.id}
                      className={`${styles.widgetContainer} ${styles[widget.size]}`}
                      style={{
                        gridColumn: widget.position.x + 1,
                        gridRow: widget.position.y + 1
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className={styles.widgetHeader}>
                        <div className={styles.widgetTitleSection}>
                          <h3 className={styles.widgetTitle}>{widget.title}</h3>
                        </div>
                        
                        <div className={styles.widgetControls}>
                          <button 
                            className={styles.refreshButton}
                            onClick={() => {/* логика обновления */}}
                            title="Обновить"
                          >
                            🔄
                          </button>
                          <button 
                            className={styles.settingsButton}
                            onClick={() => {/* логика настроек */}}
                            title="Настройки"
                          >
                            ⚙️
                          </button>
                        </div>
                      </div>
                      
                      <div className={styles.widgetContent}>
                        {renderWidget(widget)}
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </WorkspaceProvider>
  );
}