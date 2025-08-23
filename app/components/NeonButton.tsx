'use client';

import { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import styles from './NeonButton.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type MotionButtonProps = MotionProps & ButtonProps;

interface NeonButtonProps extends MotionButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  pulse?: boolean;
  glitch?: boolean;
  icon?: ReactNode;
}

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  pulse = true,
  glitch = false,
  icon,
  className = '',
  ...props
}: NeonButtonProps) {
  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0 0 30px rgba(0, 217, 255, 0.8), 0 0 60px rgba(0, 217, 255, 0.6)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    tap: {
      scale: 0.95,
      boxShadow: '0 0 10px rgba(0, 217, 255, 0.4)',
      transition: {
        duration: 0.1
      }
    }
  };

  const glitchVariants = {
    hover: {
      x: [0, -2, 2, -2, 2, 0],
      y: [0, 2, -2, 2, -2, 0],
      filter: [
        'hue-rotate(0deg)',
        'hue-rotate(90deg)',
        'hue-rotate(180deg)',
        'hue-rotate(270deg)',
        'hue-rotate(360deg)',
        'hue-rotate(0deg)'
      ],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  // Извлекаем motion-специфичные пропсы
  const { 
    animate, initial, exit, transition, whileHover, whileTap, whileDrag,
    whileFocus, whileInView, drag, dragConstraints, dragElastic,
    dragMomentum, dragTransition, onDrag, onDragEnd, onDragStart,
    layoutId, style, ...buttonProps 
  } = props;

  const motionProps = {
    animate, initial, exit, transition, whileHover, whileTap, whileDrag,
    whileFocus, whileInView, drag, dragConstraints, dragElastic,
    dragMomentum, dragTransition, onDrag, onDragEnd, onDragStart,
    layoutId, style
  };

  return (
    <motion.button
      className={`
        ${styles.neonButton} 
        ${styles[variant]} 
        ${styles[size]} 
        ${fullWidth ? styles.fullWidth : ''} 
        ${pulse ? styles.pulse : ''} 
        ${className}
      `}
      variants={glitch ? glitchVariants : buttonVariants}
      whileHover="hover"
      whileTap="tap"
      {...motionProps}
      {...buttonProps}
    >
      <span className={styles.buttonContent}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.text}>{children}</span>
      </span>
      <span className={styles.buttonGlow} />
      <span className={styles.buttonEdge} />
    </motion.button>
  );
}