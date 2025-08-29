'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './GoogleAnalyticsWidget.module.css';

export default function GoogleAnalyticsWidget({ filters, connectionStatus }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/analytics/google');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Google Analytics error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [filters]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Загрузка Google Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div className={styles.container} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.googleIcon}>📊</span>
          <span className={styles.title}>Google Analytics</span>
        </div>
        <div className={styles.realTimeLabel}>Real-time</div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <span className={styles.label}>Активные пользователи</span>
          <span className={styles.value}>{data?.activeUsers || '342'}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Просмотры страниц</span>
          <span className={styles.value}>{data?.pageViews || '1,847'}</span>
        </div>
      </div>

      <div className={styles.iframe}>
        <div className={styles.iframeHeader}>
          <span>📈 Трафик по источникам</span>
        </div>
        <div className={styles.iframeContent}>
          <div className={styles.sourcesList}>
            <div className={styles.source}>
              <span className={styles.sourceName}>Organic Search</span>
              <span className={styles.sourcePercent}>45%</span>
            </div>
            <div className={styles.source}>
              <span className={styles.sourceName}>Direct</span>
              <span className={styles.sourcePercent}>28%</span>
            </div>
            <div className={styles.source}>
              <span className={styles.sourceName}>Social</span>
              <span className={styles.sourcePercent}>15%</span>
            </div>
            <div className={styles.source}>
              <span className={styles.sourceName}>Referral</span>
              <span className={styles.sourcePercent}>12%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}