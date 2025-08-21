'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

export default function CountUpAnimation({
  end,
  start = 0,
  duration = 2.5,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  decimal = '.',
  delay = 0,
  className = '',
  enableScrollSpy = true,
  scrollSpyDelay = 0,
  scrollSpyOnce = true,
  useEasing = true,
  easingFn = null,
  formattingFn = null,
  onStart,
  onEnd,
  ...props
}) {
  const countUpRef = useRef(null);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: scrollSpyOnce,
  });

  return (
    <div ref={ref} className={`countup-container ${className}`}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: scrollSpyDelay }}
      >
        <CountUp
          ref={countUpRef}
          start={start}
          end={end}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          separator={separator}
          decimal={decimal}
          delay={delay}
          enableScrollSpy={enableScrollSpy && inView}
          scrollSpyDelay={scrollSpyDelay}
          scrollSpyOnce={scrollSpyOnce}
          useEasing={useEasing}
          easingFn={easingFn}
          formattingFn={formattingFn}
          onStart={onStart}
          onEnd={onEnd}
          {...props}
        >
          {({ countUpRef, start }) => (
            <span 
              ref={countUpRef} 
              className="countup-text"
              onClick={start}
              style={{ cursor: 'pointer' }}
            />
          )}
        </CountUp>
      </motion.div>
      
      <style jsx>{`
        .countup-container {
          display: inline-block;
        }
        
        :global(.countup-text) {
          font-variant-numeric: tabular-nums;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 3rem;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(251, 191, 36, 0.3);
        }
      `}</style>
    </div>
  );
}