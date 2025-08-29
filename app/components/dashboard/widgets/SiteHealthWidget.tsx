'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './SiteHealthWidget.module.css';

export default function SiteHealthWidget({ filters, connectionStatus }: any) {
  return (
    <motion.div className={styles.container} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className={styles.header}>
        <span className={styles.icon}>🏥</span>
        <span className={styles.title}>Здоровье сайта</span>
      </div>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.label}>Аптайм</span>
          <span className={styles.value} style={{color: '#22c55e'}}>99.9%</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.label}>Скорость</span>
          <span className={styles.value} style={{color: '#f59e0b'}}>1.2с</span>
        </div>
      </div>
    </motion.div>
  );
}
