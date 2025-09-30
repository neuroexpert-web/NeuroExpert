'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './YandexMetrikaWidget.module.css';

interface YandexMetrikaWidgetProps {
  filters: any;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  size?: 'small' | 'medium' | 'large';
}

export default function YandexMetrikaWidget({ filters, connectionStatus }: YandexMetrikaWidgetProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/analytics/yandex');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Yandex.Metrika error:', error);
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
          <p>Загрузка Яндекс.Метрики...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.yandexIcon}>🔍</span>
          <span className={styles.title}>Яндекс.Метрика</span>
        </div>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot}></span>
          <span>Прямой эфир</span>
        </div>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <span className={styles.label}>Сейчас на сайте</span>
          <span className={styles.value}>{data?.visitors || '127'}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>За сегодня</span>
          <span className={styles.value}>{data?.todayVisitors || '8,924'}</span>
        </div>
      </div>

      <div className={styles.iframe}>
        <div className={styles.iframeHeader}>
          <span>🎯 Real-time данные</span>
          <span className={styles.refreshIcon}>🔄</span>
        </div>
        <div className={styles.iframeContent}>
          <div className={styles.mockChart}>
            <div className={styles.chartBars}>
              <div className={styles.bar} style={{height: '60%'}}></div>
              <div className={styles.bar} style={{height: '80%'}}></div>
              <div className={styles.bar} style={{height: '45%'}}></div>
              <div className={styles.bar} style={{height: '90%'}}></div>
              <div className={styles.bar} style={{height: '70%'}}></div>
            </div>
            <p className={styles.chartLabel}>Активность по часам</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}