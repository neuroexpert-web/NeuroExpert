'use client';

import { useEffect, useRef, useState } from 'react';

export default function PremiumGlassBackground() {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Плавный параллакс при скролле
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    // Отслеживание мыши для тонких эффектов
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="premium-glass-background" ref={containerRef}>
      {/* Основной градиентный слой */}
      <div 
        className="gradient-layer gradient-primary"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />
      
      {/* Глубокий слой с размытием */}
      <div 
        className="gradient-layer gradient-deep"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      />
      
      {/* Акцентные световые пятна */}
      <div 
        className="light-orb orb-1"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />
      <div 
        className="light-orb orb-2"
        style={{
          transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`,
        }}
      />
      
      {/* Матовое стекло */}
      <div className="glass-layer" />
      
      {/* Тонкая сетка для премиальности */}
      <div className="premium-grid" />

      <style jsx>{`
        .premium-glass-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          overflow: hidden;
          background: #0a0e1a;
        }

        .gradient-layer {
          position: absolute;
          width: 120%;
          height: 120%;
          top: -10%;
          left: -10%;
          opacity: 0.8;
          mix-blend-mode: normal;
          will-change: transform;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gradient-primary {
          background: radial-gradient(
            ellipse at 20% 0%,
            rgba(99, 102, 241, 0.15) 0%,
            transparent 50%
          ),
          radial-gradient(
            ellipse at 80% 100%,
            rgba(139, 92, 246, 0.1) 0%,
            transparent 50%
          ),
          radial-gradient(
            ellipse at 50% 50%,
            rgba(59, 130, 246, 0.05) 0%,
            transparent 70%
          );
          filter: blur(40px);
        }

        .gradient-deep {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(15, 23, 42, 0) 0%,
            rgba(10, 14, 26, 0.8) 50%,
            rgba(5, 7, 13, 0.95) 100%
          );
          filter: blur(80px);
        }

        .light-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.6;
          will-change: transform;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          left: -200px;
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.3) 0%,
            rgba(99, 102, 241, 0.1) 40%,
            transparent 70%
          );
        }

        .orb-2 {
          width: 800px;
          height: 800px;
          bottom: -300px;
          right: -300px;
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.2) 0%,
            rgba(139, 92, 246, 0.05) 40%,
            transparent 70%
          );
        }

        .glass-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.01) 0%,
            rgba(255, 255, 255, 0.02) 50%,
            rgba(255, 255, 255, 0.01) 100%
          );
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
        }

        .premium-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
          background-size: 100px 100px;
          opacity: 0.5;
        }

        /* Адаптивность для мобильных */
        @media (max-width: 768px) {
          .light-orb {
            filter: blur(80px);
          }
          
          .orb-1 {
            width: 400px;
            height: 400px;
          }
          
          .orb-2 {
            width: 500px;
            height: 500px;
          }
          
          .premium-grid {
            background-size: 50px 50px;
          }
        }

        /* Режим производительности для слабых устройств */
        @media (prefers-reduced-motion: reduce) {
          .gradient-layer,
          .light-orb {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}