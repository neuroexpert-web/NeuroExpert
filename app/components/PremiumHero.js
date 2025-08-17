'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function PremiumHero() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Добавляем стили анимаций
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.3; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      @keyframes neonPulse {
        0%, 100% {
          box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2);
        }
        50% {
          box-shadow: 0 0 60px rgba(102, 126, 234, 0.9), inset 0 0 30px rgba(255, 255, 255, 0.4);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Node class для нейронной сети
    class Node {
      constructor() {
        const speedScale = window.innerWidth < 768 ? 0.2 : 0.5;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * speedScale;
        this.vy = (Math.random() - 0.5) * speedScale;
        this.radius = Math.random() * 1.5 + 0.5;
        this.connections = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction (ослаблено на мобильном)
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxMouseRadius = window.innerWidth < 768 ? 90 : 150;
        const forceScale = window.innerWidth < 768 ? 0.001 : 0.002;
        if (distance < maxMouseRadius) {
          const force = (maxMouseRadius - distance) / maxMouseRadius;
          this.vx += dx * force * forceScale;
          this.vy += dy * force * forceScale;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.6)';
        ctx.fill();
        
        // Subtle glow
        ctx.shadowBlur = window.innerWidth < 768 ? 4 : 10;
        ctx.shadowColor = 'rgba(102, 126, 234, 0.5)';
      }

      connectTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = window.innerWidth < 768 ? 90 : 120;
        if (distance < maxDist) {
          const opacity = (1 - distance / maxDist) * 0.25;
          
          // Gradient line
          const gradient = ctx.createLinearGradient(this.x, this.y, other.x, other.y);
          gradient.addColorStop(0, `rgba(102, 126, 234, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(118, 75, 162, ${opacity})`);
          gradient.addColorStop(1, `rgba(102, 126, 234, ${opacity})`);
          
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Create nodes для нейронной сети
    const nodes = [];
    const nodeCount = window.innerWidth < 768 ? 8 : 20;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
    particlesRef.current = nodes;

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          nodes[i].connectTo(nodes[j]);
        }
      }
      
      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle mouse move
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Параметры анимаций фона в зависимости от устройства
  const bgAmp = isMobile ? 30 : 100;
  const bgAmpSmall = isMobile ? 20 : 50;

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, #0a0a1e 0%, #1a1a2e 100%)'
    }}>


      {/* Жидкий градиент фон */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        filter: isMobile ? 'blur(60px)' : 'blur(80px)',
        opacity: isMobile ? 0.22 : 0.3
      }}>
        <motion.div
          animate={{
            x: [0, bgAmp, 0],
            y: [0, -bgAmp, 0],
          }}
          transition={{
            duration: isMobile ? 30 : 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%)',
          }}
        />
        <motion.div
          animate={{
            x: [0, -bgAmp, 0],
            y: [0, bgAmp, 0],
          }}
          transition={{
            duration: isMobile ? 28 : 15,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 80% 50%, #764ba2 0%, transparent 50%)',
          }}
        />
        <motion.div
          animate={{
            x: [0, bgAmpSmall, 0],
            y: [0, bgAmpSmall, 0],
          }}
          transition={{
            duration: isMobile ? 32 : 18,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle at 50% 50%, #667eea 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Нейронная сеть */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          opacity: isMobile ? 0.3 : 0.6
        }}
      />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: isMobile ? '0 16px' : '0 24px',
        maxWidth: '1152px',
        margin: '0 auto'
      }}>


        <motion.h1
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 'bold',
            marginBottom: '16px',
            lineHeight: 1.1
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span
            className="gradient-text-anim"
            style={{ animationDuration: isMobile ? '20s' : '12s', display: 'inline-block' }}
            animate={{ y: [0, -3, 0, 3, 0] }}
            transition={{ duration: isMobile ? 14 : 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            NeuroExpert
          </motion.span>
        </motion.h1>

        <motion.h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: isMobile ? '16px' : '24px',
            lineHeight: 1.2,
            background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.25))'
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          AI‑платформа для роста продаж и автоматизации
        </motion.h2>

        {/* Local styles for animated logo */}
        <style jsx>{`
          .gradient-text-anim {
            background: linear-gradient(120deg, #667eea 0%, #764ba2 25%, #14b8a6 50%, #667eea 75%, #764ba2 100%);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 6s ease-in-out infinite;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={() => {
              // Скролл к секции с ценами
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            animate={isMobile ? undefined : {
              boxShadow: [
                '0 0 30px rgba(102, 126, 234, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1)',
                '0 0 50px rgba(118, 75, 162, 0.7), inset 0 0 25px rgba(255, 255, 255, 0.2)',
                '0 0 30px rgba(102, 126, 234, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1)'
              ]
            }}
            transition={isMobile ? undefined : {
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            style={{
              position: 'relative',
              padding: isMobile ? '12px 20px' : '16px 40px',
              fontWeight: '700',
              fontSize: isMobile ? '15px' : '18px',
              letterSpacing: '0.02em',
              color: 'white',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              borderRadius: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            whileHover={isMobile ? undefined : { 
              scale: 1.05,
              boxShadow: '0 0 80px rgba(102, 126, 234, 0.9), 0 0 120px rgba(118, 75, 162, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={isMobile ? undefined : {
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 0 20px rgba(102, 126, 234, 0.8), 0 0 40px rgba(102, 126, 234, 0.6)',
                  '0 0 30px rgba(118, 75, 162, 0.8), 0 0 50px rgba(118, 75, 162, 0.6)',
                  '0 0 20px rgba(102, 126, 234, 0.8), 0 0 40px rgba(102, 126, 234, 0.6)'
                ]
              }}
              transition={isMobile ? undefined : {
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                background: 'linear-gradient(90deg, #fff, #f0f0ff, #e0e7ff, #f0f0ff, #fff)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.6))',
                fontWeight: '700'
              }}
            >
              Начать сейчас
            </motion.span>
            <motion.svg 
              width="20" 
              height="20" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </motion.svg>
          </motion.button>
          
          <motion.button
            onClick={() => {
              // Скролл к секции "Почему мы"
              document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' });
            }}
            animate={isMobile ? undefined : {
              boxShadow: [
                '0 0 20px rgba(102, 126, 234, 0.3), inset 0 0 10px rgba(102, 126, 234, 0.1)',
                '0 0 35px rgba(118, 75, 162, 0.5), inset 0 0 15px rgba(118, 75, 162, 0.2)',
                '0 0 20px rgba(102, 126, 234, 0.3), inset 0 0 10px rgba(102, 126, 234, 0.1)'
              ]
            }}
            transition={isMobile ? undefined : {
              boxShadow: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            style={{
              position: 'relative',
              padding: isMobile ? '12px 20px' : '16px 40px',
              fontWeight: '600',
              fontSize: isMobile ? '15px' : '18px',
              color: 'white',
              background: 'transparent',
              border: '2px solid transparent',
              borderRadius: '50px',
              cursor: 'pointer',
              backgroundImage: 'linear-gradient(#0a0e27, #0a0e27), linear-gradient(135deg, #667eea, #764ba2)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              overflow: 'hidden'
            }}
            whileHover={isMobile ? undefined : { 
              scale: 1.05,
              boxShadow: '0 0 50px rgba(102, 126, 234, 0.7), 0 0 80px rgba(118, 75, 162, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              style={{ 
                position: 'relative', 
                zIndex: 1,
                background: 'linear-gradient(90deg, #fff, #e0e7ff, #f0f0ff, #e0e7ff, #fff)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 6px rgba(102, 126, 234, 0.5))',
                fontWeight: '700'
              }}
              animate={isMobile ? undefined : {
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 0 15px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.4)',
                  '0 0 25px rgba(118, 75, 162, 0.7), 0 0 40px rgba(118, 75, 162, 0.5)',
                  '0 0 15px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.4)'
                ]
              }}
              transition={isMobile ? undefined : {
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              Узнать больше
            </motion.span>
            <motion.div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
                opacity: 0
              }}
              animate={isMobile ? undefined : {
                opacity: [0, 0.5, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={isMobile ? undefined : {
                duration: 2,
                repeat: Infinity
              }}
            />
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
            gap: isMobile ? '12px' : '32px',
            marginTop: isMobile ? '24px' : '80px',
            maxWidth: isMobile ? '100%' : '800px',
            margin: isMobile ? '24px auto 0' : '80px auto 0'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div style={{
            padding: isMobile ? '16px' : '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: isMobile ? '1.75rem' : '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>⏰✨ 2–4</h3>
            <p style={{ color: '#94a3b8' }}>Недели до запуска</p>
          </div>
          <div style={{
            padding: isMobile ? '16px' : '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: isMobile ? '1.75rem' : '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>📈🚀 40%</h3>
            <p style={{ color: '#94a3b8' }}>Рост конверсии</p>
          </div>
          <div style={{
            padding: isMobile ? '16px' : '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: isMobile ? '1.75rem' : '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>🤖⚡ 24/7</h3>
            <p style={{ color: '#94a3b8' }}>AI поддержка</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator removed as requested */}
    </section>
  );
}