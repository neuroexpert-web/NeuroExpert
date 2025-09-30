'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SEOWidget({ filters, connectionStatus }: any) {
  return (
    <motion.div 
      style={{
        background: 'rgba(15, 15, 25, 0.95)',
        border: '2px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        color: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>🔍</span>
        <span style={{ fontWeight: 600, color: '#22c55e' }}>SEO мониторинг</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '12px',
          background: 'rgba(30, 30, 45, 0.8)',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Позиции ТОП-10</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>156</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '12px',
          background: 'rgba(30, 30, 45, 0.8)',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>Органика</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>2.8K</span>
        </div>
      </div>
    </motion.div>
  );
}