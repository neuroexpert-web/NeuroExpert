'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SocialMediaWidget.module.css';

interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  color: string;
  followers: number;
  growth: number;
  engagement: number;
  posts: number;
}

interface SocialMediaWidgetProps {
  filters: any;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export default function SocialMediaWidget({ filters, connectionStatus }: SocialMediaWidgetProps) {
  const [networks, setNetworks] = useState<SocialNetwork[]>([
    {
      id: 'vk',
      name: 'ВКонтакте',
      icon: '🔵',
      color: '#0077ff',
      followers: 12543,
      growth: 2.5,
      engagement: 4.8,
      posts: 148
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      color: '#0088cc',
      followers: 3287,
      growth: 5.2,
      engagement: 7.3,
      posts: 89
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '📺',
      color: '#ff0000',
      followers: 8921,
      growth: 3.8,
      engagement: 5.6,
      posts: 42
    },
    {
      id: 'dzen',
      name: 'Дзен',
      icon: '🟡',
      color: '#ffa500',
      followers: 5632,
      growth: 8.1,
      engagement: 6.2,
      posts: 67
    }
  ]);

  const [totalReach, setTotalReach] = useState(158420);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  // Симуляция обновления данных
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworks(prev => prev.map(network => ({
        ...network,
        followers: network.followers + Math.floor(Math.random() * 20 - 5),
        engagement: Math.max(0, network.engagement + (Math.random() * 0.4 - 0.2))
      })));
      
      setTotalReach(prev => prev + Math.floor(Math.random() * 1000));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '↗️';
    if (growth < 0) return '↘️';
    return '→';
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.header}>
        <div className={styles.totalStats}>
          <div className={styles.totalReach}>
            <span className={styles.totalLabel}>Общий охват</span>
            <span className={styles.totalValue}>{formatNumber(totalReach)}</span>
          </div>
          <div className={styles.avgEngagement}>
            <span className={styles.avgLabel}>Ср. вовлеченность</span>
            <span className={styles.avgValue}>5.9%</span>
          </div>
        </div>
      </div>

      <div className={styles.networksList}>
        <AnimatePresence>
          {networks.map((network, index) => (
            <motion.div
              key={network.id}
              className={`${styles.networkCard} ${selectedNetwork === network.id ? styles.selected : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedNetwork(network.id === selectedNetwork ? null : network.id)}
            >
              <div className={styles.networkHeader}>
                <div className={styles.networkInfo}>
                  <span className={styles.networkIcon}>{network.icon}</span>
                  <span className={styles.networkName}>{network.name}</span>
                </div>
                <div 
                  className={styles.growthBadge}
                  style={{ 
                    backgroundColor: network.growth > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: network.growth > 0 ? '#22c55e' : '#ef4444'
                  }}
                >
                  {getGrowthIcon(network.growth)} {Math.abs(network.growth)}%
                </div>
              </div>

              <div className={styles.networkStats}>
                <div className={styles.followersCount}>
                  <span className={styles.followersValue} style={{ color: network.color }}>
                    {formatNumber(network.followers)}
                  </span>
                  <span className={styles.followersLabel}>подписчиков</span>
                </div>

                <div className={styles.miniStats}>
                  <div className={styles.miniStat}>
                    <span className={styles.miniStatIcon}>💬</span>
                    <span className={styles.miniStatValue}>{network.engagement.toFixed(1)}%</span>
                  </div>
                  <div className={styles.miniStat}>
                    <span className={styles.miniStatIcon}>📝</span>
                    <span className={styles.miniStatValue}>{network.posts}</span>
                  </div>
                </div>
              </div>

              {selectedNetwork === network.id && (
                <motion.div 
                  className={styles.expandedInfo}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className={styles.expandedStats}>
                    <span>Новые за неделю: +{Math.floor(network.followers * 0.025)}</span>
                    <span>Активная аудитория: {Math.floor(network.followers * network.engagement / 100)}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.footer}>
        <button className={styles.scheduleBtn}>
          📅 Планировщик
        </button>
        <div className={styles.updateIndicator}>
          <div className={styles.updateDot} style={{
            backgroundColor: connectionStatus === 'connected' ? '#22c55e' : '#f59e0b'
          }} />
          <span>Обновлено</span>
        </div>
      </div>
    </motion.div>
  );
}