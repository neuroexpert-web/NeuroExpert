'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './SiteHealthWidget.module.css';

interface SiteHealthWidgetProps {
  filters: any;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export default function SiteHealthWidget({ filters, connectionStatus }: SiteHealthWidgetProps) {
  const [healthScore, setHealthScore] = useState(98);
  const [metrics, setMetrics] = useState({
    uptime: 99.99,
    responseTime: 142,
    errorRate: 0.02,
    sslStatus: 'valid',
    lastCheck: new Date().toLocaleTimeString('ru-RU')
  });

  // Симуляция обновления данных
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthScore(Math.floor(Math.random() * 5) + 95);
      setMetrics(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 100) + 100,
        errorRate: Math.random() * 0.1,
        lastCheck: new Date().toLocaleTimeString('ru-RU')
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 95) return '#10b981';
    if (score >= 80) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.healthScore}>
        <div 
          className={styles.scoreCircle}
          style={{ 
            background: `conic-gradient(${getHealthColor(healthScore)} ${healthScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
          }}
        >
          <div className={styles.scoreInner}>
            <span className={styles.scoreValue}>{healthScore}</span>
            <span className={styles.scoreLabel}>Health Score</span>
          </div>
        </div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metricItem}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>⏱️</span>
            <span className={styles.metricLabel}>Uptime</span>
          </div>
          <span className={styles.metricValue}>{metrics.uptime}%</span>
        </div>

        <div className={styles.metricItem}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>⚡</span>
            <span className={styles.metricLabel}>Время отклика</span>
          </div>
          <span className={styles.metricValue}>{metrics.responseTime}ms</span>
        </div>

        <div className={styles.metricItem}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>⚠️</span>
            <span className={styles.metricLabel}>Ошибки</span>
          </div>
          <span className={styles.metricValue}>{metrics.errorRate}%</span>
        </div>

        <div className={styles.metricItem}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>🔒</span>
            <span className={styles.metricLabel}>SSL</span>
          </div>
          <span className={styles.metricValue} style={{ color: '#10b981' }}>Active</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.lastUpdate}>Обновлено: {metrics.lastCheck}</span>
        <div className={styles.statusDot} style={{ 
          backgroundColor: connectionStatus === 'connected' ? '#10b981' : '#f59e0b' 
        }} />
      </div>
    </motion.div>
  );
}