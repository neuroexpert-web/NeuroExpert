'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LeadsWidget.module.css';

interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  value: number;
  timestamp: Date;
}

interface LeadsWidgetProps {
  filters: any;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export default function LeadsWidget({ filters, connectionStatus }: LeadsWidgetProps) {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Александр Петров',
      email: 'a.petrov@company.ru',
      source: 'Сайт',
      status: 'new',
      value: 150000,
      timestamp: new Date()
    },
    {
      id: '2',
      name: 'Мария Иванова',
      email: 'm.ivanova@corp.ru',
      source: 'Реклама',
      status: 'contacted',
      value: 250000,
      timestamp: new Date(Date.now() - 3600000)
    }
  ]);

  const [stats, setStats] = useState({
    total: 47,
    new: 12,
    qualified: 8,
    conversion: 23.5
  });

  // Симуляция новых лидов
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Сергей', 'Елена', 'Дмитрий', 'Ольга', 'Николай'];
      const surnames = ['Смирнов', 'Козлова', 'Новиков', 'Морозова', 'Волков'];
      const sources = ['Сайт', 'Реклама', 'Email', 'Соцсети', 'Партнеры'];
      
      const newLead: Lead = {
        id: Date.now().toString(),
        name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
        email: `user${Math.floor(Math.random() * 1000)}@example.ru`,
        source: sources[Math.floor(Math.random() * sources.length)],
        status: 'new',
        value: Math.floor(Math.random() * 500000) + 50000,
        timestamp: new Date()
      };

      setLeads(prev => [newLead, ...prev.slice(0, 4)]);
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        new: prev.new + 1
      }));
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return '#22c55e';
      case 'contacted': return '#3b82f6';
      case 'qualified': return '#f59e0b';
      case 'converted': return '#a855f7';
    }
  };

  const getStatusLabel = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'contacted': return 'Контакт';
      case 'qualified': return 'Квалифицирован';
      case 'converted': return 'Конвертирован';
    }
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.header}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Всего лидов</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: '#22c55e' }}>{stats.new}</span>
            <span className={styles.statLabel}>Новых</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: '#f59e0b' }}>{stats.qualified}</span>
            <span className={styles.statLabel}>Квалиф.</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue} style={{ color: '#a855f7' }}>{stats.conversion}%</span>
            <span className={styles.statLabel}>Конверсия</span>
          </div>
        </div>
      </div>

      <div className={styles.leadsList}>
        <AnimatePresence>
          {leads.map((lead, index) => (
            <motion.div
              key={lead.id}
              className={styles.leadItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.leadInfo}>
                <div className={styles.leadHeader}>
                  <span className={styles.leadName}>{lead.name}</span>
                  <span 
                    className={styles.leadStatus}
                    style={{ backgroundColor: getStatusColor(lead.status) }}
                  >
                    {getStatusLabel(lead.status)}
                  </span>
                </div>
                <div className={styles.leadDetails}>
                  <span className={styles.leadEmail}>{lead.email}</span>
                  <span className={styles.leadSource}>📌 {lead.source}</span>
                </div>
              </div>
              <div className={styles.leadValue}>
                <span className={styles.value}>{formatValue(lead.value)}</span>
                <span className={styles.timestamp}>
                  {new Date(lead.timestamp).toLocaleTimeString('ru-RU', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.footer}>
        <button className={styles.viewAllBtn}>
          Все лиды →
        </button>
        <div className={styles.liveIndicator}>
          <div className={styles.liveDot} style={{
            backgroundColor: connectionStatus === 'connected' ? '#22c55e' : '#f59e0b'
          }} />
          <span>Live обновления</span>
        </div>
      </div>
    </motion.div>
  );
}