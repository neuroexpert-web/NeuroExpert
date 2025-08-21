'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function AnimatedCard3D({ 
  children, 
  className = '',
  glareEnable = true,
  glareMaxOpacity = 0.5,
  maxTilt = 25,
  perspective = 1000,
  scale = 1.05,
  speed = 1000,
  ...props 
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ["17.5deg", "-17.5deg"]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ["-17.5deg", "17.5deg"]
  );

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Tilt
      className={`animated-card-3d ${className}`}
      tiltMaxAngleX={maxTilt}
      tiltMaxAngleY={maxTilt}
      perspective={perspective}
      scale={scale}
      transitionSpeed={speed}
      gyroscope={true}
      glareEnable={glareEnable}
      glareMaxOpacity={glareMaxOpacity}
      glareColor="#fbbf24"
      glarePosition="all"
      glareBorderRadius="12px"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="card-inner"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
        
        {/* Holographic effect overlay */}
        <div className="holographic-overlay" />
      </motion.div>
      
      <style jsx>{`
        .animated-card-3d {
          background: linear-gradient(
            135deg,
            rgba(251, 191, 36, 0.1) 0%,
            rgba(251, 191, 36, 0.05) 50%,
            rgba(251, 191, 36, 0.1) 100%
          );
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(251, 191, 36, 0.2);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .holographic-overlay {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(251, 191, 36, 0.1) 50%,
            transparent 70%
          );
          transform: rotate(45deg);
          animation: holographic 3s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
        
        @keyframes holographic {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
      `}</style>
    </Tilt>
  );
}