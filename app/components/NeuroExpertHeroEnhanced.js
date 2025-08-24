'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NeuroExpertHeroEnhanced() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // ПАРАЛЛАКС ЭФФЕКТ
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      
      mouseRef.current = { x: clientX, y: clientY };
      
      // Параллакс для фоновых элементов
      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll('[data-parallax]');
        elements.forEach((el) => {
          const speed = el.dataset.parallax || 1;
          const translateX = x * speed * 20;
          const translateY = y * speed * 20;
          el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // УСИЛЕННАЯ НЕЙРОСЕТЬ
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // КОНФИГУРАЦИЯ ФУТУРИСТИЧЕСКИХ ЭФФЕКТОВ
    const config = {
      nodeCount: width > 768 ? 200 : 100,
      nodeSize: 4,
      connectionDistance: 250,
      mouseRadius: 400,
      baseSpeed: 0.4,
      pulseSpeed: 0.03,
      glowIntensity: 2,
      particleTrails: true,
      electricArcs: true,
      quantumFluctuations: true,
      holographicWaves: true
    };

    const nodes = [];
    const electricArcs = [];
    const quantumParticles = [];
    const holographicWaves = [];
    let globalPulse = 0;

    // УЛУЧШЕННЫЙ КЛАСС УЗЛА
    class QuantumNode {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = (Math.random() - 0.5) * config.baseSpeed;
        this.radius = config.nodeSize + Math.random() * 2;
        this.energy = Math.random();
        this.pulse = Math.random() * Math.PI * 2;
        this.type = Math.random() < 0.15 ? 'quantum' : Math.random() < 0.3 ? 'core' : 'normal';
        this.connections = [];
        this.hue = this.type === 'quantum' ? 280 : this.type === 'core' ? 180 : 200 + Math.random() * 60;
        this.brightness = 0.6 + Math.random() * 0.4;
        this.trail = [];
        this.quantumState = Math.random() > 0.5;
        this.glitchOffset = 0;
      }

      update(mouseX, mouseY) {
        // Квантовые флуктуации
        if (this.type === 'quantum' && Math.random() < 0.02) {
          this.x = this.baseX + (Math.random() - 0.5) * 100;
          this.y = this.baseY + (Math.random() - 0.5) * 100;
          this.quantumState = !this.quantumState;
          
          // Создаем квантовую вспышку
          for (let i = 0; i < 5; i++) {
            quantumParticles.push({
              x: this.x,
              y: this.y,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              life: 1,
              hue: this.hue
            });
          }
        }

        // Улучшенная физика
        this.x += this.vx;
        this.y += this.vy;

        // Гравитационные волны от курсора
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.mouseRadius) {
          const force = (1 - distance / config.mouseRadius) * 0.15;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
          
          // Энергетический импульс
          this.energy = Math.min(1, this.energy + force * 0.5);
        }

        // Границы с отталкиванием
        const margin = 100;
        if (this.x < margin) this.vx += (margin - this.x) * 0.01;
        if (this.x > width - margin) this.vx -= (this.x - width + margin) * 0.01;
        if (this.y < margin) this.vy += (margin - this.y) * 0.01;
        if (this.y > height - margin) this.vy -= (this.y - height + margin) * 0.01;

        // Ограничение скорости
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = this.type === 'quantum' ? 4 : 2.5;
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }

        // Пульсация энергии
        this.pulse += config.pulseSpeed * (this.type === 'core' ? 2 : 1);
        this.energy = Math.max(0.3, this.energy * 0.99);
        
        // Голографический глитч
        if (Math.random() < 0.005) {
          this.glitchOffset = (Math.random() - 0.5) * 20;
        } else {
          this.glitchOffset *= 0.9;
        }

        // След частицы
        if (config.particleTrails && this.energy > 0.5 && Math.random() < 0.2) {
          this.trail.push({ 
            x: this.x + this.glitchOffset, 
            y: this.y, 
            life: 1,
            energy: this.energy
          });
        }
        
        this.trail = this.trail.filter(point => {
          point.life -= 0.03;
          return point.life > 0;
        });
      }

      draw() {
        const currentRadius = this.radius * (0.8 + this.energy * 0.4);
        const glowRadius = currentRadius * config.glowIntensity * (1 + Math.sin(this.pulse) * 0.3);

        // Квантовое свечение
        if (this.type === 'quantum') {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          
          // Внешнее квантовое поле
          const gradient = ctx.createRadialGradient(
            this.x + this.glitchOffset, this.y, 0,
            this.x + this.glitchOffset, this.y, glowRadius * 3
          );
          gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.energy * 0.3})`);
          gradient.addColorStop(0.5, `hsla(${this.hue + 60}, 100%, 50%, ${this.energy * 0.1})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(
            this.x - glowRadius * 3, 
            this.y - glowRadius * 3, 
            glowRadius * 6, 
            glowRadius * 6
          );
          ctx.restore();
        }

        // Основное свечение
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        for (let i = 3; i > 0; i--) {
          const alpha = (this.energy * 0.3) / i;
          const size = glowRadius * i;
          
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, size
          );
          gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${70 + i * 10}%, ${alpha})`);
          gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 60%, ${alpha * 0.5})`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ядро узла
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `hsl(${this.hue}, 100%, ${90}%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Внутреннее свечение
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `hsla(${this.hue}, 100%, 100%, ${this.energy})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Рисуем след
        if (this.trail.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          
          this.trail.forEach((point, i) => {
            const opacity = point.life * point.energy * 0.5;
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${opacity})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        }
      }
    }

    // Создание узлов
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(new QuantumNode(
        Math.random() * width,
        Math.random() * height
      ));
    }

    // ГОЛОГРАФИЧЕСКИЕ ВОЛНЫ
    class HolographicWave {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 300 + Math.random() * 200;
        this.speed = 2 + Math.random() * 2;
        this.hue = 180 + Math.random() * 60;
        this.life = 1;
      }

      update() {
        this.radius += this.speed;
        this.life = 1 - (this.radius / this.maxRadius);
        return this.life > 0;
      }

      draw() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, this.radius * 0.8,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.7, `hsla(${this.hue}, 100%, 50%, ${this.life * 0.1})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 70%, ${this.life * 0.3})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
      }
    }

    // ОСНОВНОЙ ЦИКЛ АНИМАЦИИ
    function animate() {
      // Очистка с эффектом следа
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, width, height);

      globalPulse += 0.01;

      // Создание голографических волн
      if (config.holographicWaves && Math.random() < 0.02) {
        holographicWaves.push(new HolographicWave(
          Math.random() * width,
          Math.random() * height
        ));
      }

      // Обновление и отрисовка волн
      holographicWaves.forEach((wave, index) => {
        if (!wave.update()) {
          holographicWaves.splice(index, 1);
        } else {
          wave.draw();
        }
      });

      // Обновление узлов
      nodes.forEach(node => {
        node.update(mouseRef.current.x, mouseRef.current.y);
      });

      // Соединения между узлами
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            const opacity = (1 - distance / config.connectionDistance) * 
                          Math.min(nodes[i].energy, nodes[j].energy) * 0.5;
            
            // Электрические дуги для близких соединений
            if (distance < 100 && Math.random() < 0.1) {
              drawElectricArc(nodes[i], nodes[j], opacity);
            } else {
              // Обычное соединение с градиентом
              const gradient = ctx.createLinearGradient(
                nodes[i].x, nodes[i].y,
                nodes[j].x, nodes[j].y
              );
              gradient.addColorStop(0, `hsla(${nodes[i].hue}, 100%, 70%, ${opacity})`);
              gradient.addColorStop(0.5, `hsla(${(nodes[i].hue + nodes[j].hue) / 2}, 100%, 50%, ${opacity * 0.5})`);
              gradient.addColorStop(1, `hsla(${nodes[j].hue}, 100%, 70%, ${opacity})`);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1 + opacity * 2;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.restore();

      // Рисуем узлы
      nodes.forEach(node => {
        node.draw();
      });

      // Обновление квантовых частиц
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      quantumParticles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        if (particle.life <= 0) {
          quantumParticles.splice(index, 1);
        } else {
          ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.life})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 3 * particle.life, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    }

    // Функция рисования электрической дуги
    function drawElectricArc(node1, node2, opacity) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      const segments = 8;
      const variance = 20;
      
      ctx.strokeStyle = `hsla(200, 100%, 70%, ${opacity * 2})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsla(200, 100%, 50%, ${opacity})`;
      
      ctx.beginPath();
      ctx.moveTo(node1.x, node1.y);
      
      for (let i = 1; i < segments; i++) {
        const progress = i / segments;
        const x = node1.x + (node2.x - node1.x) * progress + (Math.random() - 0.5) * variance;
        const y = node1.y + (node2.y - node1.y) * progress + (Math.random() - 0.5) * variance;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(node2.x, node2.y);
      ctx.stroke();
      ctx.restore();
    }

    animate();

    // Обработка изменения размера
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="hero-section-enhanced" ref={containerRef}>
      {/* Canvas фон */}
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Mesh градиент оверлей */}
      <div 
        className="mesh-gradient-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--gradient-mesh-1)',
          opacity: 0.3,
          zIndex: 2,
          mixBlendMode: 'screen',
        }}
      />

      {/* Контент */}
      <div className="hero-content" style={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="hero-text-container"
            >
              {/* Glitch эффект для заголовка */}
              <motion.h1 
                className="hero-title glitch"
                data-text="NeuroExpert"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <span className="text-gradient-neuro">Neuro</span>
                <span className="text-neon">Expert</span>
              </motion.h1>

              {/* Подзаголовок с анимацией печатания */}
              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <span className="typing-effect">
                  Центр цифровых компетенций будущего
                </span>
              </motion.p>

              {/* CTA кнопки */}
              <motion.div 
                className="hero-cta-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <button className="btn-neuro btn-primary">
                  <span>Войти в платформу</span>
                  <div className="btn-energy-flow" />
                </button>
                
                <button className="btn-neuro btn-secondary">
                  <span>AI управляющий</span>
                  <div className="btn-pulse" />
                </button>
              </motion.div>

              {/* Индикаторы метрик */}
              <motion.div 
                className="hero-metrics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                <div className="metric-item" data-parallax="2">
                  <span className="metric-value text-neon">40%</span>
                  <span className="metric-label">Рост прибыли</span>
                </div>
                <div className="metric-item" data-parallax="3">
                  <span className="metric-value text-neon">24/7</span>
                  <span className="metric-label">AI поддержка</span>
                </div>
                <div className="metric-item" data-parallax="2.5">
                  <span className="metric-value text-neon">500+</span>
                  <span className="metric-label">Решений</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Дополнительные визуальные элементы */}
      <div className="hero-decorations">
        {/* Неоновые линии */}
        <div className="neon-line neon-line-1" />
        <div className="neon-line neon-line-2" />
        
        {/* Плавающие частицы */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                '--delay': `${i * 0.5}s`,
                '--duration': `${20 + Math.random() * 10}s`,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-section-enhanced {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--noir-900);
        }

        .hero-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 90%;
          max-width: 1200px;
        }

        .hero-title {
          font-family: var(--font-orbitron);
          font-size: clamp(3rem, 10vw, 8rem);
          font-weight: 900;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .hero-subtitle {
          font-family: var(--font-space-grotesk);
          font-size: clamp(1.2rem, 3vw, 2rem);
          margin: 2rem 0 3rem;
          color: var(--neon-cyan);
          text-shadow: var(--glow-cyan);
          opacity: 0.9;
        }

        .typing-effect {
          display: inline-block;
          border-right: 3px solid var(--neon-cyan);
          animation: typing 3s steps(30, end), blink 0.5s step-end infinite alternate;
        }

        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }

        @keyframes blink {
          50% { border-color: transparent }
        }

        .hero-cta-container {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin: 3rem 0;
        }

        .btn-primary {
          background: var(--gradient-ai);
          border-color: var(--accent-primary);
        }

        .btn-secondary {
          background: var(--gradient-energy);
          border-color: var(--neon-cyan);
        }

        .btn-energy-flow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .btn-neuro:hover .btn-energy-flow {
          left: 100%;
        }

        .hero-metrics {
          display: flex;
          gap: 4rem;
          justify-content: center;
          margin-top: 4rem;
        }

        .metric-item {
          text-align: center;
          transition: transform 0.3s ease;
        }

        .metric-value {
          display: block;
          font-family: var(--font-orbitron);
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-family: var(--font-tech);
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .neon-line {
          position: absolute;
          background: var(--gradient-energy);
          box-shadow: var(--glow-cyan);
          opacity: 0.5;
        }

        .neon-line-1 {
          top: 10%;
          left: -10%;
          width: 120%;
          height: 1px;
          transform: rotate(-5deg);
          animation: pulse-line 4s ease-in-out infinite;
        }

        .neon-line-2 {
          bottom: 15%;
          right: -10%;
          width: 80%;
          height: 1px;
          transform: rotate(3deg);
          animation: pulse-line 4s ease-in-out infinite 2s;
        }

        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; transform: scaleX(1) rotate(var(--rotation, 0deg)); }
          50% { opacity: 1; transform: scaleX(1.1) rotate(var(--rotation, 0deg)); }
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--neon-cyan);
          border-radius: 50%;
          box-shadow: var(--glow-cyan);
          animation: float-particle var(--duration) ease-in-out infinite var(--delay);
          left: var(--x);
          top: var(--y);
        }

        @media (max-width: 768px) {
          .hero-cta-container {
            flex-direction: column;
            align-items: center;
          }

          .hero-metrics {
            flex-direction: column;
            gap: 2rem;
          }

          .btn-neuro {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </section>
  );
}