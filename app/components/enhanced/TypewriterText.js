'use client';

import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

export default function TypewriterText({ 
  sequence,
  wrapper = 'span',
  speed = 50,
  deletionSpeed = 30,
  repeat = Infinity,
  cursor = true,
  className = '',
  gradient = true,
  glowEffect = true,
  ...props
}) {
  const defaultSequence = [
    'Увеличьте продажи на 40%',
    2000,
    'Автоматизируйте бизнес-процессы',
    2000,
    'Оптимизируйте расходы',
    2000,
    'Масштабируйте бизнес с AI',
    2000,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`typewriter-container ${className}`}
    >
      <TypeAnimation
        sequence={sequence || defaultSequence}
        wrapper={wrapper}
        speed={speed}
        deletionSpeed={deletionSpeed}
        repeat={repeat}
        cursor={cursor}
        className={`typewriter-text ${gradient ? 'gradient-text' : ''} ${glowEffect ? 'glow-effect' : ''}`}
        {...props}
      />
      
      <style jsx>{`
        .typewriter-container {
          position: relative;
          display: inline-block;
        }
        
        :global(.typewriter-text) {
          font-size: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
        
        :global(.gradient-text) {
          background: linear-gradient(
            135deg,
            #fbbf24 0%,
            #f59e0b 25%,
            #fbbf24 50%,
            #f59e0b 75%,
            #fbbf24 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }
        
        :global(.glow-effect) {
          filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.5));
          animation: glow-pulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes glow-pulse {
          from {
            filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.5));
          }
          to {
            filter: drop-shadow(0 0 30px rgba(251, 191, 36, 0.8));
          }
        }
        
        :global(.TypeAnimation__cursor) {
          color: var(--gold-500, #fbbf24);
          animation: cursor-blink 1s infinite;
        }
        
        @keyframes cursor-blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </motion.div>
  );
}