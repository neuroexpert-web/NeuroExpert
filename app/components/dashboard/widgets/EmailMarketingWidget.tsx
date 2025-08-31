'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './EmailMarketingWidget.module.css';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'scheduled' | 'completed';
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  date: Date;
}

interface EmailMarketingWidgetProps {
  filters: any;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export default function EmailMarketingWidget({ filters, connectionStatus }: EmailMarketingWidgetProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Новогодняя рассылка',
      status: 'completed',
      sent: 12450,
      opened: 3088,
      clicked: 642,
      converted: 128,
      revenue: 384000,
      date: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: '2',
      name: 'Welcome-серия',
      status: 'active',
      sent: 3280,
      opened: 1968,
      clicked: 492,
      converted: 98,
      revenue: 147000,
      date: new Date()
    },
    {
      id: '3',
      name: 'Реактивация клиентов',
      status: 'scheduled',
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      date: new Date(Date.now() + 86400000)
    }
  ]);

  const [totalStats, setTotalStats] = useState({
    totalSent: 45680,
    avgOpenRate: 24.8,
    avgClickRate: 5.2,
    totalRevenue: 1245000,
    activeSubscribers: 18942
  });

  // Симуляция обновления данных для активных кампаний
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => prev.map(campaign => {
        if (campaign.status === 'active') {
          const newSent = campaign.sent + Math.floor(Math.random() * 50);
          const newOpened = campaign.opened + Math.floor(Math.random() * 20);
          const newClicked = campaign.clicked + Math.floor(Math.random() * 5);
          const newConverted = campaign.converted + Math.floor(Math.random() * 2);
          
          return {
            ...campaign,
            sent: newSent,
            opened: newOpened,
            clicked: newClicked,
            converted: newConverted,
            revenue: campaign.revenue + (newConverted * 1500)
          };
        }
        return campaign;
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'scheduled': return '#f59e0b';
      case 'completed': return '#94a3b8';
    }
  };

  const getStatusLabel = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'scheduled': return 'Запланирована';
      case 'completed': return 'Завершена';
    }
  };

  const calculateOpenRate = (opened: number, sent: number) => {
    if (sent === 0) return 0;
    return ((opened / sent) * 100).toFixed(1);
  };

  const calculateClickRate = (clicked: number, opened: number) => {
    if (opened === 0) return 0;
    return ((clicked / opened) * 100).toFixed(1);
  };

  const formatRevenue = (revenue: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(revenue);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.header}>
        <div className={styles.mainStats}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📧</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalStats.activeSubscribers.toLocaleString('ru-RU')}</span>
              <span className={styles.statLabel}>Активных подписчиков</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalStats.avgOpenRate}%</span>
              <span className={styles.statLabel}>Открываемость</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💰</div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatRevenue(totalStats.totalRevenue)}</span>
              <span className={styles.statLabel}>Доход за месяц</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.campaignsList}>
        <h4 className={styles.sectionTitle}>📨 Кампании</h4>
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            className={styles.campaignCard}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={styles.campaignHeader}>
              <div className={styles.campaignInfo}>
                <span className={styles.campaignName}>{campaign.name}</span>
                <span 
                  className={styles.campaignStatus}
                  style={{ backgroundColor: getStatusColor(campaign.status) }}
                >
                  {getStatusLabel(campaign.status)}
                </span>
              </div>
              <span className={styles.campaignDate}>
                {campaign.date.toLocaleDateString('ru-RU')}
              </span>
            </div>

            {campaign.status !== 'scheduled' && (
              <div className={styles.campaignStats}>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Отправлено</span>
                  <span className={styles.statItemValue}>{campaign.sent.toLocaleString('ru-RU')}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Открытия</span>
                  <span className={styles.statItemValue}>
                    {calculateOpenRate(campaign.opened, campaign.sent)}%
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Клики</span>
                  <span className={styles.statItemValue}>
                    {calculateClickRate(campaign.clicked, campaign.opened)}%
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Доход</span>
                  <span className={styles.statItemValue} style={{ color: '#22c55e' }}>
                    {formatRevenue(campaign.revenue)}
                  </span>
                </div>
              </div>
            )}

            {campaign.status === 'active' && (
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${(campaign.opened / campaign.sent) * 100}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.createBtn}>
          ✉️ Новая кампания
        </button>
        <div className={styles.connectionStatus}>
          <div className={styles.statusDot} style={{
            backgroundColor: connectionStatus === 'connected' ? '#22c55e' : '#f59e0b'
          }} />
          <span>Синхронизировано</span>
        </div>
      </div>
    </motion.div>
  );
}