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
        this.size = Math.random() * 2;
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
        ctx.fillStyle = '#6366f1';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#6366f1';
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < 100; i++) {
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
    <section className="relative min-h-[80vh] py-20 flex items-center justify-center overflow-hidden premium-bg">
      {/* 3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ opacity: 0.6 }}
      />

      {/* Gradient Orbs */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '80px',
        width: '384px',
        height: '384px',
        background: 'linear-gradient(to right, #a855f7, #ec4899)',
        borderRadius: '50%',
        filter: 'blur(48px)',
        opacity: 0.2,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '80px',
        width: '384px',
        height: '384px',
        background: 'linear-gradient(to right, #3b82f6, #14b8a6)',
        borderRadius: '50%',
        filter: 'blur(48px)',
        opacity: 0.2,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: '2s'
      }}></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="badge-premium mb-6 inline-block">
            AI-Powered Platform
          </span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="gradient-text">NeuroExpert</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Премиум платформа для создания интеллектуальных бизнес-решений
          с использованием передовых AI технологий
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="btn-premium group">
            <span className="relative z-10">Начать сейчас</span>
            <svg className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <button className="glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all">
            Узнать больше
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="glass p-6 rounded-2xl hover-lift">
            <h3 className="text-4xl font-bold gradient-text mb-2">2-4</h3>
            <p className="text-gray-400">Недели до запуска</p>
          </div>
          <div className="glass p-6 rounded-2xl hover-lift">
            <h3 className="text-4xl font-bold gradient-text mb-2">40%</h3>
            <p className="text-gray-400">Рост конверсии</p>
          </div>
          <div className="glass p-6 rounded-2xl hover-lift">
            <h3 className="text-4xl font-bold gradient-text mb-2">24/7</h3>
            <p className="text-gray-400">AI поддержка</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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