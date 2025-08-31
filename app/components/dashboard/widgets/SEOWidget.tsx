'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './SEOWidget.module.css';

interface SEOMetric {
  label: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  change: string;
}

interface SEOWidgetProps {
  filters: any;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export default function SEOWidget({ filters, connectionStatus }: SEOWidgetProps) {
  const [metrics, setMetrics] = useState<SEOMetric[]>([
    { label: 'Позиции в ТОП-10', value: 247, trend: 'up', change: '+15' },
    { label: 'Органический трафик', value: '45.2K', trend: 'up', change: '+12%' },
    { label: 'Средний CTR', value: '5.8%', trend: 'stable', change: '+0.2%' },
    { label: 'Видимость', value: '78%', trend: 'up', change: '+3%' }
  ]);

  const [keywords, setKeywords] = useState([
    { word: 'AI автоматизация', position: 3, change: 2 },
    { word: 'цифровизация бизнеса', position: 5, change: -1 },
    { word: 'нейросети для бизнеса', position: 8, change: 5 },
    { word: 'ROI калькулятор', position: 2, change: 0 }
  ]);

  // Симуляция обновления данных
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: typeof metric.value === 'number' 
          ? metric.value + Math.floor(Math.random() * 10 - 5)
          : metric.value
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '#22c55e';
      case 'down': return '#ef4444';
      case 'stable': return '#f59e0b';
    }
  };

  const getPositionColor = (change: number) => {
    if (change > 0) return '#22c55e';
    if (change < 0) return '#ef4444';
    return '#94a3b8';
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <motion.div 
            key={metric.label}
            className={styles.metricCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.metricHeader}>
              <span className={styles.metricLabel}>{metric.label}</span>
              <span className={styles.trendIcon}>{getTrendIcon(metric.trend)}</span>
            </div>
            <div className={styles.metricValue}>{metric.value}</div>
            <div 
              className={styles.metricChange}
              style={{ color: getTrendColor(metric.trend) }}
            >
              {metric.change}
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.keywordsSection}>
        <h4 className={styles.sectionTitle}>🔑 Ключевые слова</h4>
        <div className={styles.keywordsList}>
          {keywords.map((keyword, index) => (
            <motion.div 
              key={keyword.word}
              className={styles.keywordItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className={styles.keywordText}>{keyword.word}</span>
              <div className={styles.keywordStats}>
                <span className={styles.position}>#{keyword.position}</span>
                <span 
                  className={styles.positionChange}
                  style={{ color: getPositionColor(keyword.change) }}
                >
                  {keyword.change > 0 && '+'}
                  {keyword.change !== 0 ? keyword.change : '−'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.reportBtn}>
          📊 Полный отчет
        </button>
        <span className={styles.updateTime}>
          Обновлено: {new Date().toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </motion.div>
  );
}