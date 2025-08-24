'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function NeuroExpertHeroPro() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated background
  useEffect(() => {
    setIsLoaded(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Gradient mesh animation
    const animate = () => {
      time += 0.001;
      
      // Dynamic gradient
      const gradient = ctx.createLinearGradient(
        0, 0, 
        canvas.width, canvas.height
      );
      
      gradient.addColorStop(0, `hsla(280, 100%, 10%, 1)`);
      gradient.addColorStop(0.25, `hsla(260, 100%, 15%, 1)`);
      gradient.addColorStop(0.5, `hsla(220, 100%, 10%, 1)`);
      gradient.addColorStop(0.75, `hsla(280, 100%, 15%, 1)`);
      gradient.addColorStop(1, `hsla(320, 100%, 10%, 1)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Animated orbs
      const drawOrb = (x, y, radius, color) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color.replace('0.3', '0.1'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      };
      
      // Moving orbs
      drawOrb(
        canvas.width * 0.2 + Math.sin(time) * 100,
        canvas.height * 0.3 + Math.cos(time * 0.7) * 50,
        200,
        'rgba(99, 102, 241, 0.3)'
      );
      
      drawOrb(
        canvas.width * 0.8 + Math.cos(time * 0.8) * 80,
        canvas.height * 0.7 + Math.sin(time * 0.6) * 60,
        250,
        'rgba(168, 85, 247, 0.3)'
      );
      
      drawOrb(
        canvas.width * 0.5 + Math.sin(time * 0.5) * 120,
        canvas.height * 0.5 + Math.cos(time * 0.9) * 80,
        300,
        'rgba(0, 212, 255, 0.2)'
      );
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.8,
      filter: 'blur(10px)'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.01, -0.05, 0.95]
      }
    }
  };

  return (
    <section className="hero-container" ref={containerRef}>
      {/* Animated background canvas */}
      <canvas 
        ref={canvasRef} 
        className="hero-canvas"
        style={{ opacity }}
      />
      
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      
      {/* Grid pattern */}
      <div className="grid-pattern" />
      
      {/* Main content */}
      <motion.div 
        className="hero-content"
        style={{ y }}
      >
        <AnimatePresence>
          {isLoaded && (
            <>
              {/* Logo/Brand mark */}
              <motion.div 
                className="brand-mark"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="brand-icon">
                  <svg viewBox="0 0 100 100" fill="none">
                    <defs>
                      <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                    <path d="M50 10 L80 30 L80 70 L50 90 L20 70 L20 30 Z" 
                          stroke="url(#brand-gradient)" 
                          strokeWidth="2"
                          fill="none" />
                    <circle cx="50" cy="50" r="20" 
                            fill="url(#brand-gradient)" 
                            opacity="0.3" />
                    <circle cx="50" cy="50" r="10" 
                            fill="url(#brand-gradient)" />
                  </svg>
                </div>
              </motion.div>

              {/* Main title with individual letter animations */}
              <motion.div 
                className="hero-title-wrapper"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                <h1 className="hero-title">
                  <span className="title-word">
                    {"NEURO".split('').map((letter, i) => (
                      <motion.span 
                        key={i} 
                        className="title-letter"
                        variants={letterVariants}
                        style={{
                          transform: `translateX(${mousePosition.x * (i + 1) * 2}px) translateY(${mousePosition.y * (i + 1) * 2}px)`
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                  <span className="title-word expert">
                    {"EXPERT".split('').map((letter, i) => (
                      <motion.span 
                        key={i} 
                        className="title-letter gradient"
                        variants={letterVariants}
                        style={{
                          transform: `translateX(${mousePosition.x * (i + 1) * -2}px) translateY(${mousePosition.y * (i + 1) * -2}px)`
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                ARTIFICIAL INTELLIGENCE • DIGITAL TRANSFORMATION • FUTURE
              </motion.p>

              {/* Description */}
              <motion.div 
                className="hero-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                <p>Создаем будущее с искусственным интеллектом.</p>
                <p>Трансформируем бизнес. Автоматизируем процессы. Увеличиваем прибыль.</p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="hero-actions"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <button className="cta-button primary">
                  <span className="button-text">НАЧАТЬ ТРАНСФОРМАЦИЮ</span>
                  <span className="button-glow"></span>
                  <span className="button-particles"></span>
                </button>
                
                <button className="cta-button secondary">
                  <span className="button-text">СМОТРЕТЬ ДЕМО</span>
                  <span className="button-border"></span>
                </button>
              </motion.div>

              {/* Floating badges */}
              <motion.div 
                className="floating-badges"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <div className="badge" style={{ 
                  transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` 
                }}>
                  <span className="badge-number">40%</span>
                  <span className="badge-text">Рост эффективности</span>
                </div>
                <div className="badge" style={{ 
                  transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)` 
                }}>
                  <span className="badge-number">24/7</span>
                  <span className="badge-text">AI поддержка</span>
                </div>
                <div className="badge" style={{ 
                  transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * -25}px)` 
                }}>
                  <span className="badge-number">500+</span>
                  <span className="badge-text">Готовых решений</span>
                </div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div 
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
              >
                <div className="mouse">
                  <div className="wheel"></div>
                </div>
                <div className="arrows">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .hero-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        .hero-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .noise-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E");
        }

        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 3;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .brand-mark {
          margin-bottom: 3rem;
          position: relative;
        }

        .brand-icon {
          width: 120px;
          height: 120px;
          position: relative;
        }

        .brand-icon::before {
          content: '';
          position: absolute;
          inset: -20px;
          background: conic-gradient(from 0deg, #6366F1, #A855F7, #EC4899, #6366F1);
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(20px);
          animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        .hero-title-wrapper {
          margin-bottom: 2rem;
          perspective: 1000px;
        }

        .hero-title {
          font-size: clamp(4rem, 15vw, 10rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.05em;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title-word {
          display: flex;
          position: relative;
        }

        .title-letter {
          display: inline-block;
          position: relative;
          transition: transform 0.3s ease-out;
          font-family: 'Orbitron', sans-serif;
        }

        .title-word:first-child .title-letter {
          color: #fff;
          text-shadow: 
            0 0 30px rgba(99, 102, 241, 0.8),
            0 0 60px rgba(99, 102, 241, 0.5),
            0 0 90px rgba(99, 102, 241, 0.3);
        }

        .title-letter.gradient {
          background: linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.5));
        }

        .hero-subtitle {
          font-size: clamp(0.9rem, 2vw, 1.2rem);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 2rem;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 300;
        }

        .hero-description {
          text-align: center;
          max-width: 800px;
          margin-bottom: 3rem;
        }

        .hero-description p {
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          margin: 0.5rem 0;
          font-family: 'Exo 2', sans-serif;
          font-weight: 300;
        }

        .hero-actions {
          display: flex;
          gap: 2rem;
          margin-bottom: 4rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cta-button {
          position: relative;
          padding: 1.5rem 3rem;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          background: none;
          color: #fff;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          font-family: 'Orbitron', sans-serif;
        }

        .cta-button.primary {
          background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
          box-shadow: 
            0 0 40px rgba(99, 102, 241, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.1);
        }

        .button-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.6s ease;
        }

        .cta-button:hover .button-glow {
          transform: translate(-50%, -50%) scale(1);
        }

        .button-particles {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 2%),
            radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 2%),
            radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 2%);
          background-size: 10% 10%;
          background-position: 0% 0%;
          animation: particles 3s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-button:hover .button-particles {
          opacity: 1;
        }

        @keyframes particles {
          to {
            background-position: 100% 100%;
          }
        }

        .cta-button.secondary {
          position: relative;
          background: transparent;
          border: 2px solid transparent;
          background-image: linear-gradient(#000, #000),
                            linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }

        .button-border {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%);
          border-radius: 4px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-button.secondary:hover .button-border {
          opacity: 1;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
        }

        .floating-badges {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .badge {
          position: absolute;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          transition: transform 0.3s ease-out;
        }

        .badge:nth-child(1) {
          top: 20%;
          left: 10%;
        }

        .badge:nth-child(2) {
          top: 20%;
          right: 10%;
        }

        .badge:nth-child(3) {
          bottom: 30%;
          left: 50%;
          transform: translateX(-50%);
        }

        .badge-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          font-family: 'Orbitron', sans-serif;
        }

        .badge-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: 'Space Grotesk', sans-serif;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .mouse {
          width: 30px;
          height: 50px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          position: relative;
        }

        .wheel {
          width: 4px;
          height: 10px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 2px;
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          animation: scroll 2s ease-in-out infinite;
        }

        @keyframes scroll {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          50% { transform: translateX(-50%) translateY(15px); opacity: 0; }
        }

        .arrows {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .arrows span {
          display: block;
          width: 15px;
          height: 15px;
          border-right: 2px solid rgba(255, 255, 255, 0.3);
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          transform: rotate(45deg);
          animation: arrow 2s ease-in-out infinite;
        }

        .arrows span:nth-child(2) {
          animation-delay: -0.2s;
        }

        .arrows span:nth-child(3) {
          animation-delay: -0.4s;
        }

        @keyframes arrow {
          0%, 100% { opacity: 0; transform: rotate(45deg) translate(-5px, -5px); }
          50% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(3rem, 20vw, 6rem);
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
            width: 100%;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
          }

          .badge {
            display: none;
          }

          .brand-icon {
            width: 80px;
            height: 80px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .title-letter,
          .badge,
          .button-glow,
          .button-particles {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}