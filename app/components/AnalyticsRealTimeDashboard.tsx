'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AnalyticsRealTimeDashboard.module.css';

// Types
interface ServiceMetrics {
  serviceName: string;
  isActive: boolean;
  lastUpdate: Date;
  metrics: {
    activeUsers: number;
    pageViews: number;
    events: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  realtimeData?: {
    timestamp: number;
    value: number;
  }[];
}

interface SwipeMetrics {
  totalSwipes: number;
  swipesByDirection: {
    left: number;
    right: number;
  };
  swipesByMethod: {
    touch: number;
    keyboard: number;
    button: number;
  };
  mostVisitedSections: {
    section: string;
    visits: number;
    avgDuration: number;
  }[];
}

export default function AnalyticsRealTimeDashboard() {
  const [services, setServices] = useState<ServiceMetrics[]>([
    {
      serviceName: 'Google Analytics',
      isActive: true,
      lastUpdate: new Date(),
      metrics: {
        activeUsers: 0,
        pageViews: 0,
        events: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0
      }
    },
    {
      serviceName: 'Яндекс.Метрика',
      isActive: true,
      lastUpdate: new Date(),
      metrics: {
        activeUsers: 0,
        pageViews: 0,
        events: 0,
        avgSessionDuration: 0,
        bounceRate: 0,
        conversionRate: 0
      }
    }
  ]);

  const [swipeMetrics, setSwipeMetrics] = useState<SwipeMetrics>({
    totalSwipes: 0,
    swipesByDirection: { left: 0, right: 0 },
    swipesByMethod: { touch: 0, keyboard: 0, button: 0 },
    mostVisitedSections: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('realtime');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real-time data
  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/dashboard/realtime', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        updateMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
    }
  };

  // Update metrics from API response
  const updateMetrics = (data: any) => {
    // Update service metrics
    if (data.services) {
      setServices(prevServices => 
        prevServices.map(service => {
          const newData = data.services[service.serviceName.toLowerCase().replace(/\s+/g, '_')];
          if (newData) {
            return {
              ...service,
              lastUpdate: new Date(),
              metrics: newData.metrics || service.metrics,
              realtimeData: newData.realtimeData || service.realtimeData
            };
          }
          return service;
        })
      );
    }

    // Update swipe metrics
    if (data.swipeMetrics) {
      setSwipeMetrics(data.swipeMetrics);
    }
  };

  // Auto refresh effect
  useEffect(() => {
    fetchRealtimeData();
    setIsLoading(false);

    if (autoRefresh) {
      const interval = setInterval(fetchRealtimeData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Scroll handling for the analytics section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Enable vertical scrolling for this section
    container.style.overflowY = 'auto';
    container.style.height = '100vh';
    
    return () => {
      container.style.overflowY = 'hidden';
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        <p className={styles.loadingText}>Загрузка метрик...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>Аналитика</span>
            <span className={styles.titleSub}>Real-time метрики</span>
          </h1>
          
          <div className={styles.controls}>
            <div className={styles.timeRangeSelector}>
              {['realtime', '1h', '24h', '7d', '30d'].map(range => (
                <button
                  key={range}
                  className={`${styles.timeButton} ${selectedTimeRange === range ? styles.active : ''}`}
                  onClick={() => setSelectedTimeRange(range)}
                >
                  {range === 'realtime' ? 'Сейчас' :
                   range === '1h' ? '1 час' :
                   range === '24h' ? '24 часа' :
                   range === '7d' ? '7 дней' : '30 дней'}
                </button>
              ))}
            </div>

            <button
              className={`${styles.refreshToggle} ${autoRefresh ? styles.active : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? '⏸ Пауза' : '▶ Обновлять'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className={styles.mainContent}>
        {/* Overview Stats */}
        <section className={styles.overviewSection}>
          <h2 className={styles.sectionTitle}>Общая статистика</h2>
          <div className={styles.statsGrid}>
            <StatCard
              title="Всего пользователей"
              value={services.reduce((sum, s) => sum + s.metrics.activeUsers, 0)}
              change={12.5}
              icon="👥"
              color="blue"
            />
            <StatCard
              title="Просмотры страниц"
              value={services.reduce((sum, s) => sum + s.metrics.pageViews, 0)}
              change={8.2}
              icon="📄"
              color="green"
            />
            <StatCard
              title="Всего свайпов"
              value={swipeMetrics.totalSwipes}
              change={15.7}
              icon="👆"
              color="purple"
            />
            <StatCard
              title="Средняя сессия"
              value={`${Math.round(services.reduce((sum, s) => sum + s.metrics.avgSessionDuration, 0) / services.length)}с`}
              change={-2.3}
              icon="⏱"
              color="orange"
            />
          </div>
        </section>

        {/* Swipe Analytics */}
        <section className={styles.swipeSection}>
          <h2 className={styles.sectionTitle}>Аналитика свайпов</h2>
          <div className={styles.swipeContent}>
            <div className={styles.swipeChart}>
              <h3>Направления свайпов</h3>
              <div className={styles.directionBars}>
                <div className={styles.barItem}>
                  <span className={styles.barLabel}>← Влево</span>
                  <div className={styles.barContainer}>
                    <motion.div 
                      className={styles.barFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${(swipeMetrics.swipesByDirection.left / swipeMetrics.totalSwipes) * 100}%` }}
                      style={{ backgroundColor: '#9945ff' }}
                    />
                  </div>
                  <span className={styles.barValue}>{swipeMetrics.swipesByDirection.left}</span>
                </div>
                <div className={styles.barItem}>
                  <span className={styles.barLabel}>Вправо →</span>
                  <div className={styles.barContainer}>
                    <motion.div 
                      className={styles.barFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${(swipeMetrics.swipesByDirection.right / swipeMetrics.totalSwipes) * 100}%` }}
                      style={{ backgroundColor: '#00d4ff' }}
                    />
                  </div>
                  <span className={styles.barValue}>{swipeMetrics.swipesByDirection.right}</span>
                </div>
              </div>
            </div>

            <div className={styles.swipeMethod}>
              <h3>Методы навигации</h3>
              <div className={styles.methodGrid}>
                <div className={styles.methodCard}>
                  <span className={styles.methodIcon}>👆</span>
                  <span className={styles.methodName}>Touch</span>
                  <span className={styles.methodValue}>{swipeMetrics.swipesByMethod.touch}</span>
                </div>
                <div className={styles.methodCard}>
                  <span className={styles.methodIcon}>⌨️</span>
                  <span className={styles.methodName}>Keyboard</span>
                  <span className={styles.methodValue}>{swipeMetrics.swipesByMethod.keyboard}</span>
                </div>
                <div className={styles.methodCard}>
                  <span className={styles.methodIcon}>🖱️</span>
                  <span className={styles.methodName}>Button</span>
                  <span className={styles.methodValue}>{swipeMetrics.swipesByMethod.button}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Most Visited Sections */}
          <div className={styles.visitedSections}>
            <h3>Популярные разделы</h3>
            <div className={styles.sectionsList}>
              {swipeMetrics.mostVisitedSections.map((section, index) => (
                <motion.div 
                  key={section.section}
                  className={styles.sectionItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className={styles.sectionRank}>{index + 1}</span>
                  <span className={styles.sectionName}>{section.section}</span>
                  <span className={styles.sectionVisits}>{section.visits} посещений</span>
                  <span className={styles.sectionDuration}>{Math.round(section.avgDuration / 1000)}с</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service-specific metrics */}
        {services.map((service, index) => (
          <ServiceMetricsSection 
            key={service.serviceName}
            service={service}
            index={index}
          />
        ))}

        {/* Real-time Activity Feed */}
        <section className={styles.activitySection}>
          <h2 className={styles.sectionTitle}>Активность в реальном времени</h2>
          <ActivityFeed />
        </section>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, change, icon, color }: any) {
  return (
    <motion.div 
      className={`${styles.statCard} ${styles[color]}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statContent}>
        <h4 className={styles.statTitle}>{title}</h4>
        <div className={styles.statValue}>{value}</div>
        <div className={`${styles.statChange} ${change >= 0 ? styles.positive : styles.negative}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
    </motion.div>
  );
}

// Service Metrics Section
function ServiceMetricsSection({ service, index }: { service: ServiceMetrics; index: number }) {
  return (
    <motion.section 
      className={styles.serviceSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      <div className={styles.serviceHeader}>
        <h2 className={styles.serviceName}>
          {service.serviceName}
          <span className={`${styles.serviceStatus} ${service.isActive ? styles.active : styles.inactive}`}>
            {service.isActive ? '● Активен' : '○ Неактивен'}
          </span>
        </h2>
        <span className={styles.lastUpdate}>
          Обновлено: {service.lastUpdate.toLocaleTimeString()}
        </span>
      </div>

      <div className={styles.serviceMetrics}>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Активные пользователи</span>
          <span className={styles.metricValue}>{service.metrics.activeUsers}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Просмотры</span>
          <span className={styles.metricValue}>{service.metrics.pageViews}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>События</span>
          <span className={styles.metricValue}>{service.metrics.events}</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Отказы</span>
          <span className={styles.metricValue}>{service.metrics.bounceRate.toFixed(1)}%</span>
        </div>
        <div className={styles.metricItem}>
          <span className={styles.metricLabel}>Конверсия</span>
          <span className={styles.metricValue}>{service.metrics.conversionRate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Real-time chart placeholder */}
      {service.realtimeData && (
        <div className={styles.realtimeChart}>
          <canvas className={styles.chartCanvas} />
        </div>
      )}
    </motion.section>
  );
}

// Activity Feed Component
function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time activities
    const generateActivity = () => {
      const types = ['page_view', 'swipe', 'click', 'conversion'];
      const sections = ['Главная', 'Аналитика', 'ROI-калькулятор', 'AI управляющий'];
      
      return {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        section: sections[Math.floor(Math.random() * sections.length)],
        timestamp: new Date(),
        user: `User${Math.floor(Math.random() * 1000)}`
      };
    };

    const interval = setInterval(() => {
      setActivities(prev => [generateActivity(), ...prev.slice(0, 9)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.activityFeed}>
      <AnimatePresence>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            className={styles.activityItem}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <span className={styles.activityTime}>
              {activity.timestamp.toLocaleTimeString()}
            </span>
            <span className={styles.activityType}>
              {activity.type === 'page_view' ? '👁' :
               activity.type === 'swipe' ? '👆' :
               activity.type === 'click' ? '👆' : '🎯'}
            </span>
            <span className={styles.activityText}>
              {activity.user} - {activity.type} на {activity.section}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}