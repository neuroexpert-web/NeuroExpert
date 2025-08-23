'use client';

import { motion } from 'framer-motion';
import styles from './AILoader.module.css';

interface AILoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  variant?: 'neural' | 'pulse' | 'quantum' | 'data-stream';
}

export default function AILoader({
  size = 'medium',
  text = 'AI обрабатывает данные...',
  variant = 'neural'
}: AILoaderProps) {
  const sizeMap = {
    small: 60,
    medium: 100,
    large: 150
  };

  const loaderSize = sizeMap[size];

  if (variant === 'neural') {
    return (
      <div className={`${styles.loaderContainer} ${styles[size]}`}>
        <svg
          width={loaderSize}
          height={loaderSize}
          viewBox="0 0 100 100"
          className={styles.neuralNetwork}
        >
          {/* Центральный узел */}
          <circle
            cx="50"
            cy="50"
            r="8"
            className={styles.centralNode}
          />
          
          {/* Внешние узлы */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * (Math.PI / 180);
            const x = 50 + 30 * Math.cos(angle);
            const y = 50 + 30 * Math.sin(angle);
            
            return (
              <g key={i}>
                <line
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  className={styles.connection}
                  style={{
                    animationDelay: `${i * 0.1}s`
                  }}
                />
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  className={styles.outerNode}
                  style={{
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              </g>
            );
          })}
          
          {/* Пульсирующие круги */}
          <circle
            cx="50"
            cy="50"
            r="20"
            className={styles.pulseRing}
            style={{ animationDelay: '0s' }}
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            className={styles.pulseRing}
            style={{ animationDelay: '0.5s' }}
          />
        </svg>
        {text && <p className={styles.loaderText}>{text}</p>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`${styles.loaderContainer} ${styles[size]}`}>
        <div className={styles.pulseLoader}>
          <div className={styles.pulseDot} />
          <div className={styles.pulseDot} />
          <div className={styles.pulseDot} />
        </div>
        {text && <p className={styles.loaderText}>{text}</p>}
      </div>
    );
  }

  if (variant === 'quantum') {
    return (
      <div className={`${styles.loaderContainer} ${styles[size]}`}>
        <div className={styles.quantumLoader}>
          <motion.div
            className={styles.quantumOrbit}
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className={styles.quantumParticle} />
          </motion.div>
          <motion.div
            className={styles.quantumOrbit}
            animate={{
              rotate: -360
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className={styles.quantumParticle} />
          </motion.div>
          <div className={styles.quantumCore} />
        </div>
        {text && <p className={styles.loaderText}>{text}</p>}
      </div>
    );
  }

  // Data stream variant
  return (
    <div className={`${styles.loaderContainer} ${styles[size]}`}>
      <div className={styles.dataStreamLoader}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={styles.dataStream}
            style={{
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
      {text && <p className={styles.loaderText}>{text}</p>}
    </div>
  );
}