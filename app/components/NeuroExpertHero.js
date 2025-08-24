'use client';

import { useEffect, useRef } from 'react';

export default function NeuroExpertHero() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Супер анимация заголовка
    const animateTitle = () => {
      const title = document.getElementById('animated-main-header');
      if (title) {
        const text = title.textContent;
        title.innerHTML = '';
        
        // Создаем 3D эффект для каждой буквы
        text.split('').forEach((char, i) => {
          const wrapper = document.createElement('span');
          wrapper.className = 'letter-wrapper';
          wrapper.style.cssText = `
            display: inline-block;
            position: relative;
            transform-style: preserve-3d;
            animation-delay: ${i * 50}ms;
          `;
          
          const letter = document.createElement('span');
          letter.className = 'letter-3d';
          letter.textContent = char;
          letter.style.cssText = `
            display: inline-block;
            position: relative;
          `;
          
          wrapper.appendChild(letter);
          title.appendChild(wrapper);
        });
      }
    };

    setTimeout(animateTitle, 100);

    // МОЩНАЯ НЕЙРОСЕТЬ
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Оптимизация для производительности
    ctx.imageSmoothingEnabled = false;

    // ПАРАМЕТРЫ МОЩНОЙ ВИЗУАЛИЗАЦИИ
    const config = {
      nodeCount: width > 768 ? 150 : 80,
      nodeSize: 3,
      connectionDistance: 200,
      mouseRadius: 300,
      baseSpeed: 0.3,
      pulseSpeed: 0.02,
      glowIntensity: 1.5,
      particleTrails: true,
      electricArcs: true
    };

    const nodes = [];
    const electricArcs = [];
    const particles = [];
    const connections = new Map();

    // СУПЕРУЗЕЛ
    class SuperNode {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = (Math.random() - 0.5) * config.baseSpeed;
        this.radius = config.nodeSize;
        this.energy = Math.random();
        this.pulse = Math.random() * Math.PI * 2;
        this.type = Math.random() < 0.1 ? 'core' : 'normal';
        this.connections = [];
        this.hue = this.type === 'core' ? 180 : 200 + Math.random() * 60;
        this.brightness = 0.5 + Math.random() * 0.5;
        this.trail = [];
      }

      update(mouseX, mouseY) {
        // Физика движения
        this.x += this.vx;
        this.y += this.vy;

        // Отталкивание от краев
        if (this.x < 50) this.vx += 0.5;
        if (this.x > width - 50) this.vx -= 0.5;
        if (this.y < 50) this.vy += 0.5;
        if (this.y > height - 50) this.vy -= 0.5;

        // Магнитное притяжение к мыши
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.mouseRadius) {
          const force = (1 - distance / config.mouseRadius) * 0.1;
          this.vx += dx * force * 0.01;
          this.vy += dy * force * 0.01;
        }

        // Ограничение скорости
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 2) {
          this.vx = (this.vx / speed) * 2;
          this.vy = (this.vy / speed) * 2;
        }

        // Пульсация энергии
        this.pulse += config.pulseSpeed;
        this.energy = 0.5 + Math.sin(this.pulse) * 0.3 + Math.random() * 0.2;
        
        // След частицы
        if (config.particleTrails && Math.random() < 0.1) {
          this.trail.push({ x: this.x, y: this.y, life: 1 });
        }
        
        this.trail = this.trail.filter(point => {
          point.life -= 0.02;
          return point.life > 0;
        });
      }

      draw() {
        // Рисуем след
        if (this.trail.length > 0) {
          ctx.save();
          this.trail.forEach((point, i) => {
            const opacity = point.life * 0.3;
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${opacity})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        }

        // ЭПИЧЕСКОЕ СВЕЧЕНИЕ
        const glowSize = this.radius * (this.type === 'core' ? 30 : 20) * this.energy;
        
        // Внешнее свечение
        const outerGlow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowSize
        );
        outerGlow.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${0.1 * this.energy})`);
        outerGlow.addColorStop(0.5, `hsla(${this.hue}, 80%, 40%, ${0.05 * this.energy})`);
        outerGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = outerGlow;
        ctx.fillRect(this.x - glowSize, this.y - glowSize, glowSize * 2, glowSize * 2);

        // Среднее свечение
        const midGlow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowSize * 0.5
        );
        midGlow.addColorStop(0, `hsla(${this.hue}, 100%, 60%, ${0.3 * this.energy})`);
        midGlow.addColorStop(0.7, `hsla(${this.hue}, 100%, 50%, ${0.1 * this.energy})`);
        midGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = midGlow;
        ctx.fillRect(this.x - glowSize/2, this.y - glowSize/2, glowSize, glowSize);

        // Яркое ядро
        if (this.type === 'core') {
          // Дополнительные кольца для core узлов
          for (let i = 0; i < 3; i++) {
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${0.3 * this.energy / (i + 1)})`;
            ctx.lineWidth = 2 - i * 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * (3 + i * 2), 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // Центральное ядро
        const coreGradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3
        );
        coreGradient.addColorStop(0, `hsla(0, 0%, 100%, ${this.brightness})`);
        coreGradient.addColorStop(0.3, `hsla(${this.hue}, 100%, 70%, ${this.brightness})`);
        coreGradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, ${this.brightness * 0.5})`);
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Белая точка в центре
        ctx.fillStyle = `hsla(0, 0%, 100%, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ЭЛЕКТРИЧЕСКИЕ ДУГИ
    class ElectricArc {
      constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.life = 0.5 + Math.random() * 0.5;
        this.segments = 8;
        this.amplitude = 20;
      }

      update() {
        this.life -= 0.02;
      }

      draw() {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = `hsla(190, 100%, 70%, ${this.life})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(190, 100%, 70%, ${this.life})`;

        ctx.beginPath();
        ctx.moveTo(this.node1.x, this.node1.y);

        const dx = this.node2.x - this.node1.x;
        const dy = this.node2.y - this.node1.y;

        for (let i = 1; i <= this.segments; i++) {
          const t = i / this.segments;
          const offset = Math.sin(t * Math.PI) * this.amplitude * (Math.random() - 0.5);
          const perpX = -dy / Math.sqrt(dx * dx + dy * dy);
          const perpY = dx / Math.sqrt(dx * dx + dy * dy);
          
          ctx.lineTo(
            this.node1.x + dx * t + perpX * offset,
            this.node1.y + dy * t + perpY * offset
          );
        }

        ctx.stroke();
        ctx.restore();
      }
    }

    // Создаем узлы
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(new SuperNode(
        Math.random() * width,
        Math.random() * height
      ));
    }

    // Отслеживание мыши
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ
    function animate() {
      // Очистка с эффектом следа
      ctx.fillStyle = 'rgba(10, 5, 26, 0.05)';
      ctx.fillRect(0, 0, width, height);

      // Обновляем и находим соединения
      connections.clear();
      
      nodes.forEach((node, i) => {
        node.update(mouseRef.current.x, mouseRef.current.y);
        
        // Поиск ближайших узлов
        nodes.slice(i + 1).forEach(other => {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.connectionDistance) {
            const strength = 1 - distance / config.connectionDistance;
            connections.set(`${i}-${nodes.indexOf(other)}`, { node, other, strength, distance });
            
            // Создаем электрические дуги
            if (config.electricArcs && Math.random() < 0.001 && electricArcs.length < 5) {
              electricArcs.push(new ElectricArc(node, other));
            }
          }
        });
      });

      // Рисуем соединения
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      connections.forEach(({ node, other, strength }) => {
        const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
        gradient.addColorStop(0, `hsla(${node.hue}, 100%, 50%, ${strength * 0.3})`);
        gradient.addColorStop(0.5, `hsla(${(node.hue + other.hue) / 2}, 100%, 60%, ${strength * 0.5})`);
        gradient.addColorStop(1, `hsla(${other.hue}, 100%, 50%, ${strength * 0.3})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(0.5, strength * 2);
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      });
      
      ctx.restore();

      // Рисуем электрические дуги
      electricArcs.forEach((arc, index) => {
        arc.update();
        arc.draw();
        if (arc.life <= 0) {
          electricArcs.splice(index, 1);
        }
      });

      // Рисуем узлы
      nodes.forEach(node => node.draw());

      requestAnimationFrame(animate);
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
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--noir-900, #0a0e1a);
          overflow: hidden;
        }

        .neural-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: var(--z-background, -1);
          opacity: 0.8;
        }

        .hero-content {
          position: relative;
          z-index: var(--z-content, 1);
          text-align: center;
          max-width: 1200px;
          padding: var(--space-xl, 2rem);
          margin: 0 auto;
        }

        .pre-header {
          font-family: var(--font-cyber, 'Orbitron', monospace);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neon-cyan, #06ffa5);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: var(--space-lg, 1.5rem);
          text-shadow: var(--glow-cyan, 0 0 20px rgba(6, 255, 165, 0.5));
          animation: electric-flow 3s ease-in-out infinite;
        }

        .main-header {
          font-family: var(--font-cyber, 'Orbitron', monospace);
          font-size: clamp(3rem, 8vw, 8rem);
          font-weight: 900;
          background: var(--gradient-neuro, linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ff0080 100%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-lg, 1.5rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          position: relative;
          animation: neural-pulse 4s ease-in-out infinite;
        }

        .main-header::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--gradient-neuro, linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ff0080 100%));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: blur(20px);
          opacity: 0.3;
          z-index: -1;
        }

        .sub-header {
          font-family: var(--font-cyber, 'Orbitron', monospace);
          font-size: clamp(1.25rem, 3vw, 2rem);
          font-weight: 700;
          color: var(--neon-blue, #00d4ff);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--space-xl, 2rem);
          text-shadow: var(--glow-blue, 0 0 20px rgba(0, 212, 255, 0.5));
        }

        .description {
          font-family: var(--font-neural, 'Inter', sans-serif);
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
          margin-bottom: var(--space-3xl, 4rem);
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: var(--space-md, 1rem);
          padding: var(--space-lg, 1.5rem) var(--space-3xl, 4rem);
          background: var(--glass-bg, rgba(255, 255, 255, 0.05));
          border: 2px solid var(--neon-cyan, #06ffa5);
          border-radius: var(--radius-lg, 1.5rem);
          color: var(--neon-cyan, #06ffa5);
          font-family: var(--font-cyber, 'Orbitron', monospace);
          font-size: 1.25rem;
          font-weight: 700;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          transition: all 0.4s var(--ease-neural, cubic-bezier(0.23, 1, 0.32, 1));
          backdrop-filter: var(--glass-blur, blur(20px));
          box-shadow: var(--glow-cyan, 0 0 20px rgba(6, 255, 165, 0.3));
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: var(--gradient-energy, linear-gradient(90deg, #00ff88 0%, #00d4ff 100%));
          transition: left 0.5s var(--ease-electric, cubic-bezier(0.68, -0.55, 0.265, 1.55));
          z-index: -1;
        }

        .cta-button:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: var(--neon-electric, #00ff88);
          color: var(--noir-900, #0a0e1a);
          box-shadow: var(--glow-cyan, 0 0 40px rgba(6, 255, 165, 0.6));
        }

        .cta-button:hover::before {
          left: 0;
        }

        .cta-button:active {
          transform: translateY(-2px) scale(1.01);
          animation: quantum-shake 0.5s ease-in-out;
        }

        /* Анимированные письма для заголовка */
        .letter-wrapper {
          display: inline-block;
          position: relative;
          animation: letter-float 6s ease-in-out infinite;
        }

        .letter-wrapper:nth-child(odd) {
          animation-delay: 0.1s;
        }

        .letter-wrapper:nth-child(even) {
          animation-delay: 0.3s;
        }

        .letter-3d {
          display: inline-block;
          position: relative;
          transform-style: preserve-3d;
          transition: all 0.3s var(--ease-neural, cubic-bezier(0.23, 1, 0.32, 1));
        }

        @keyframes letter-float {
          0%, 100% {
            transform: translateY(0) rotateY(0deg);
          }
          25% {
            transform: translateY(-10px) rotateY(5deg);
          }
          50% {
            transform: translateY(0) rotateY(0deg);
          }
          75% {
            transform: translateY(-5px) rotateY(-5deg);
          }
        }

        @keyframes electric-flow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        @keyframes neural-pulse {
          0%, 100% {
            filter: brightness(1) contrast(1);
          }
          50% {
            filter: brightness(1.2) contrast(1.1);
          }
        }

        @keyframes quantum-shake {
          0%, 100% { transform: translateY(-4px) scale(1.02) translateX(0); }
          10% { transform: translateY(-4px) scale(1.02) translateX(-2px) rotate(-1deg); }
          20% { transform: translateY(-4px) scale(1.02) translateX(2px) rotate(1deg); }
          30% { transform: translateY(-4px) scale(1.02) translateX(-2px) rotate(-1deg); }
          40% { transform: translateY(-4px) scale(1.02) translateX(2px) rotate(1deg); }
          50% { transform: translateY(-4px) scale(1.02) translateX(-1px) rotate(-0.5deg); }
          60% { transform: translateY(-4px) scale(1.02) translateX(1px) rotate(0.5deg); }
          70% { transform: translateY(-4px) scale(1.02) translateX(-1px) rotate(-0.5deg); }
          80% { transform: translateY(-4px) scale(1.02) translateX(1px) rotate(0.5deg); }
          90% { transform: translateY(-4px) scale(1.02) translateX(0) rotate(0deg); }
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .hero-content {
            padding: var(--space-lg, 1.5rem);
          }

          .cta-button {
            padding: var(--space-md, 1rem) var(--space-xl, 2rem);
            font-size: 1rem;
          }

          .description {
            margin-bottom: var(--space-2xl, 3rem);
          }
        }

        @media (max-width: 480px) {
          .pre-header {
            font-size: 0.75rem;
            letter-spacing: 0.15em;
          }

          .cta-button {
            padding: var(--space-sm, 0.5rem) var(--space-lg, 1.5rem);
            font-size: 0.9rem;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .main-header,
          .pre-header,
          .letter-wrapper,
          .cta-button {
            animation: none;
          }

          .cta-button {
            transition: none;
          }
        }
      `}</style>

      <section className="hero-section">
        <canvas ref={canvasRef} className="neural-canvas" />
        <div className="hero-content">
          <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
          <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
          <h2 className="sub-header">СОЗДАЙТЕ ЦИФРОВОЕ ПОЗИЦИОНИРОВАНИЕ</h2>
          <p className="description">
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов с помощью передовых ИИ технологий.
          </p>
          <a href="/smart-ai" className="cta-button">
            <span>НАЧАТЬ БЕСПЛАТНО</span>
          </a>
        </div>
      </section>
    </>
  );
}