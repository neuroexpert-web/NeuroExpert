'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfettiEffect({ 
  active = false,
  duration = 5000,
  numberOfPieces = 200,
  gravity = 0.1,
  colors = ['#fbbf24', '#f59e0b', '#d97706', '#fcd34d', '#fde68a'],
  onComplete,
  ...props
}) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [showConfetti, setShowConfetti] = useState(active);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setShowConfetti(active);

    if (active && duration > 0) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  return (
    <AnimatePresence>
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            numberOfPieces={numberOfPieces}
            gravity={gravity}
            colors={colors}
            recycle={false}
            {...props}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Хук для управления конфетти
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const trigger = (duration = 5000) => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), duration);
  };

  return { isActive, trigger };
}