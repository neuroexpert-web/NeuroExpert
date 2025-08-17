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
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
        this.connections = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.vx += dx * force * 0.002;
          this.vy += dy * force * 0.002;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.6)';
        ctx.fill();
        
        // Subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(102, 126, 234, 0.5)';
      }

      connectTo(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.3;
          
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
    const nodeCount = window.innerWidth < 768 ? 10 : 20;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
    particlesRef.current = nodes;

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.05)';
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
        filter: 'blur(80px)',
        opacity: 0.3
      }}>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
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
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
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
            x: [0, 50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
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
          opacity: 0.6
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
            animate={{
              boxShadow: [
                '0 0 30px rgba(102, 126, 234, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1)',
                '0 0 50px rgba(118, 75, 162, 0.7), inset 0 0 25px rgba(255, 255, 255, 0.2)',
                '0 0 30px rgba(102, 126, 234, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.1)'
              ]
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            style={{
              position: 'relative',
              padding: isMobile ? '14px 28px' : '16px 40px',
              fontWeight: '700',
              fontSize: isMobile ? '16px' : '18px',
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
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 80px rgba(102, 126, 234, 0.9), 0 0 120px rgba(118, 75, 162, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 0 20px rgba(102, 126, 234, 0.8), 0 0 40px rgba(102, 126, 234, 0.6)',
                  '0 0 30px rgba(118, 75, 162, 0.8), 0 0 50px rgba(118, 75, 162, 0.6)',
                  '0 0 20px rgba(102, 126, 234, 0.8), 0 0 40px rgba(102, 126, 234, 0.6)'
                ]
              }}
              transition={{
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
            animate={{
              boxShadow: [
                '0 0 20px rgba(102, 126, 234, 0.3), inset 0 0 10px rgba(102, 126, 234, 0.1)',
                '0 0 35px rgba(118, 75, 162, 0.5), inset 0 0 15px rgba(118, 75, 162, 0.2)',
                '0 0 20px rgba(102, 126, 234, 0.3), inset 0 0 10px rgba(102, 126, 234, 0.1)'
              ]
            }}
            transition={{
              boxShadow: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            style={{
              position: 'relative',
              padding: isMobile ? '14px 28px' : '16px 40px',
              fontWeight: '600',
              fontSize: isMobile ? '16px' : '18px',
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
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                textShadow: [
                  '0 0 15px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.4)',
                  '0 0 25px rgba(118, 75, 162, 0.7), 0 0 40px rgba(118, 75, 162, 0.5)',
                  '0 0 15px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.4)'
                ]
              }}
              transition={{
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