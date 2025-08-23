'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './FuturisticCard.module.css';

interface FuturisticCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'glass' | 'holographic' | 'neon';
  hoverable?: boolean;
  glowColor?: 'blue' | 'purple' | 'green' | 'pink';
  className?: string;
}

export default function FuturisticCard({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  hoverable = true,
  glowColor = 'blue',
  className = ''
}: FuturisticCardProps) {
  const cardVariants = {
    initial: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
    },
    hover: {
      scale: hoverable ? 1.02 : 1,
      rotateX: hoverable ? 5 : 0,
      rotateY: hoverable ? -5 : 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  const glowVariants = {
    initial: {
      opacity: 0.5,
    },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      className={`${styles.cardWrapper} ${styles[variant]} ${styles[`glow-${glowColor}`]} ${className}`}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className={styles.cardBackground} />
      
      <motion.div 
        className={styles.cardGlow}
        variants={glowVariants}
      />
      
      <div className={styles.cardContent}>
        {(title || subtitle || icon) && (
          <div className={styles.cardHeader}>
            {icon && <div className={styles.cardIcon}>{icon}</div>}
            <div className={styles.cardTitles}>
              {title && <h3 className={styles.cardTitle}>{title}</h3>}
              {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
            </div>
          </div>
        )}
        
        <div className={styles.cardBody}>
          {children}
        </div>
      </div>
      
      <div className={styles.cardBorder} />
      
      {variant === 'holographic' && (
        <div className={styles.holographicOverlay} />
      )}
      
      {variant === 'neon' && (
        <>
          <div className={styles.neonCorner} data-corner="top-left" />
          <div className={styles.neonCorner} data-corner="top-right" />
          <div className={styles.neonCorner} data-corner="bottom-left" />
          <div className={styles.neonCorner} data-corner="bottom-right" />
        </>
      )}
    </motion.div>
  );
}