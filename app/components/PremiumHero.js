'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function PremiumHero() {
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
      @keyframes twinkle {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      @keyframes shootingstar {
        0% {
          transform: translateX(0) translateY(0) rotate(45deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateX(400px) translateY(400px) rotate(45deg);
          opacity: 0;
        }
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

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.speedZ = Math.random() * 0.5;
        this.opacity = Math.random();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.z -= this.speedZ;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        if (this.z <= 0) this.z = 1000;

        // Mouse interaction
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.x += dx * force * 0.03;
          this.y += dy * force * 0.03;
        }
      }

      draw() {
        const perspective = 1000 / (1000 - this.z);
        const x = (this.x - canvas.width / 2) * perspective + canvas.width / 2;
        const y = (this.y - canvas.height / 2) * perspective + canvas.height / 2;
        const size = this.size * perspective;

        ctx.globalAlpha = this.opacity * (1 - this.z / 1000);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles (космическая пыль)
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
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

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at center, #0a0e27 0%, #020515 100%)'
    }}>
      {/* 3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.6
        }}
      />

      {/* Космические звёзды */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Генерируем звёзды */}
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              background: 'white',
              borderRadius: '50%',
              opacity: Math.random(),
              animation: `twinkle ${Math.random() * 5 + 5}s infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        {/* Падающие звёзды */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            style={{
              position: 'absolute',
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 50 - 50}%`,
              width: '2px',
              height: '100px',
              background: 'linear-gradient(to bottom, white, transparent)',
              opacity: 0,
              animation: `shootingstar ${3 + i}s linear infinite`,
              animationDelay: `${i * 7}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 16px',
        maxWidth: '1152px',
        margin: '0 auto'
      }}>


        <motion.h1
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: 'bold',
            marginBottom: '24px',
            lineHeight: 1.1
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>NeuroExpert</span>
        </motion.h1>

        <motion.p
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            color: '#cbd5e1',
            marginBottom: '32px',
            maxWidth: '768px',
            margin: '0 auto 32px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Премиум платформа для создания интеллектуальных бизнес-решений
          с использованием передовых AI технологий
        </motion.p>

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
            style={{
              position: 'relative',
              padding: '16px 40px',
              fontWeight: '700',
              fontSize: '18px',
              letterSpacing: '0.02em',
              color: 'white',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 0 40px rgba(102, 126, 234, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 60px rgba(102, 126, 234, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                background: 'linear-gradient(90deg, #fff, #e0e7ff, #fff)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
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
            style={{
              position: 'relative',
              padding: '16px 40px',
              fontWeight: '600',
              fontSize: '18px',
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
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(102, 126, 234, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              style={{ position: 'relative', zIndex: 1 }}
              animate={{
                color: ['#ffffff', '#e0e7ff', '#ffffff']
              }}
              transition={{
                duration: 2,
                repeat: Infinity
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
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginTop: '80px',
            maxWidth: '800px',
            margin: '80px auto 0'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>2-4</h3>
            <p style={{ color: '#94a3b8' }}>Недели до запуска</p>
          </div>
          <div style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>40%</h3>
            <p style={{ color: '#94a3b8' }}>Рост конверсии</p>
          </div>
          <div style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>24/7</h3>
            <p style={{ color: '#94a3b8' }}>AI поддержка</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div style={{
          width: '24px',
          height: '40px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '4px',
            height: '12px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '2px',
            marginTop: '8px',
            animation: 'bounce 2s infinite'
          }}></div>
        </div>
      </motion.div>
    </section>
  );
}