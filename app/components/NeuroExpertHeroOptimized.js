'use client';

import { useEffect, useRef } from 'react';

export default function NeuroExpertHeroOptimized() {
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
        this.pulse += config.pulseSpeed;
        
        // Притяжение к мыши
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < config.mouseRadius) {
          const force = (1 - dist / config.mouseRadius) * 0.5;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
        
        // Обновление позиции
        this.x += this.vx;
        this.y += this.vy;
        
        // Границы
        if (this.x < 0 || this.x > width) this.vx *= -0.9;
        if (this.y < 0 || this.y > height) this.vy *= -0.9;
        
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
        
        // Затухание
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Обновление энергии
        this.energy = 0.5 + Math.sin(this.pulse) * 0.5;
        
        // След частицы
        if (config.particleTrails && this.type === 'core') {
          this.trail.push({ x: this.x, y: this.y, age: 0 });
          this.trail = this.trail.filter(t => {
            t.age += 0.02;
            return t.age < 1;
          });
        }
      }

      draw(ctx) {
        // Рисуем след
        if (this.trail.length > 1) {
          ctx.beginPath();
          this.trail.forEach((point, i) => {
            const opacity = (1 - point.age) * 0.3;
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, 0.2)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        // Аура узла
        const auraSize = this.radius * (3 + this.energy * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, auraSize
        );
        
        const intensity = this.brightness * this.energy * config.glowIntensity;
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${intensity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 60%, ${intensity * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, auraSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Ядро узла
        ctx.fillStyle = `hsla(${this.hue}, 100%, 90%, ${0.8 + this.energy * 0.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Блик
        if (this.type === 'core') {
          ctx.fillStyle = `hsla(${this.hue}, 100%, 100%, ${0.6 * this.energy})`;
          ctx.beginPath();
          ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Класс для электрических дуг
    class ElectricArc {
      constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.life = 1;
        this.segments = 8;
        this.amplitude = 20;
      }

      update() {
        this.life -= 0.02;
        return this.life > 0;
      }

      draw(ctx) {
        const dx = this.node2.x - this.node1.x;
        const dy = this.node2.y - this.node1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        ctx.beginPath();
        ctx.moveTo(this.node1.x, this.node1.y);
        
        for (let i = 1; i < this.segments; i++) {
          const t = i / this.segments;
          const x = this.node1.x + dx * t;
          const y = this.node1.y + dy * t;
          
          // Добавляем случайное отклонение
          const perpX = -dy / dist;
          const perpY = dx / dist;
          const offset = (Math.random() - 0.5) * this.amplitude * Math.sin(t * Math.PI);
          
          ctx.lineTo(x + perpX * offset, y + perpY * offset);
        }
        
        ctx.lineTo(this.node2.x, this.node2.y);
        
        ctx.strokeStyle = `hsla(190, 100%, 70%, ${this.life * 0.8})`;
        ctx.lineWidth = 2 * this.life;
        ctx.stroke();
        
        // Свечение
        ctx.shadowBlur = 20 * this.life;
        ctx.shadowColor = `hsla(190, 100%, 70%, ${this.life})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Создаем узлы
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(new SuperNode(
        Math.random() * width,
        Math.random() * height
      ));
    }

    // Эффект мыши
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ
    let animationId;
    const animate = () => {
      // Фон с градиентом
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#0A051A');
      bgGradient.addColorStop(0.5, '#0F0820');
      bgGradient.addColorStop(1, '#0A051A');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Обновляем узлы
      nodes.forEach(node => {
        node.update(mouseRef.current.x, mouseRef.current.y);
      });
      
      // Рисуем связи
      ctx.lineWidth = 1;
      nodes.forEach((node1, i) => {
        nodes.slice(i + 1).forEach(node2 => {
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < config.connectionDistance) {
            const opacity = (1 - dist / config.connectionDistance) * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            
            const gradient = ctx.createLinearGradient(
              node1.x, node1.y, node2.x, node2.y
            );
            gradient.addColorStop(0, `hsla(${node1.hue}, 100%, 60%, ${opacity})`);
            gradient.addColorStop(1, `hsla(${node2.hue}, 100%, 60%, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.stroke();
            
            // Создаем электрические дуги между близкими core узлами
            if (config.electricArcs && 
                node1.type === 'core' && 
                node2.type === 'core' && 
                Math.random() < 0.001) {
              electricArcs.push(new ElectricArc(node1, node2));
            }
          }
        });
      });
      
      // Обновляем и рисуем электрические дуги
      electricArcs.forEach((arc, index) => {
        if (!arc.update()) {
          electricArcs.splice(index, 1);
        } else {
          arc.draw(ctx);
        }
      });
      
      // Рисуем узлы
      nodes.forEach(node => node.draw(ctx));
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Адаптация под размер экрана
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
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

        .hero-section {
          position: relative;
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          background: #0A051A;
        }

        .neural-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          cursor: crosshair;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: clamp(10px, 2vh, 20px);
        }

        .pre-header {
          font-family: 'Orbitron', monospace;
          font-weight: 400;
          font-size: clamp(14px, 1.2vw, 16px);
          color: #60A5FA;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          margin: 0;
          opacity: 0;
          animation: slideInTop 1s 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          text-shadow: 0 0 30px rgba(96, 165, 250, 0.6);
        }

        .main-header {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          font-size: clamp(60px, 12vw, 120px);
          margin: 0;
          line-height: 1;
          text-transform: uppercase;
          opacity: 0;
          animation: slideInLeft 1.2s 0.5s ease-out forwards;
          position: relative;
          letter-spacing: -0.02em;
        }

        .letter-wrapper {
          display: inline-block;
          position: relative;
          transform-style: preserve-3d;
          animation: floatLetter 6s ease-in-out infinite;
        }

        .letter-3d {
          display: inline-block;
          background: linear-gradient(135deg, #00ffff 0%, #6366f1 50%, #ff00ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 
            0 0 40px rgba(0, 255, 255, 0.8),
            0 0 80px rgba(99, 102, 241, 0.6),
            0 0 120px rgba(255, 0, 255, 0.4);
          transform: translateZ(20px);
        }

        .sub-header {
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          font-size: clamp(18px, 3vw, 32px);
          color: #e0e7ff;
          margin: 0;
          opacity: 0;
          animation: slideInRight 1s 0.7s ease-out forwards;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-shadow: 0 0 20px rgba(224, 231, 255, 0.5);
        }

        .description {
          font-size: clamp(16px, 1.8vw, 20px);
          line-height: 1.6;
          color: #a0a0a0;
          max-width: 800px;
          margin: clamp(10px, 2vh, 20px) auto;
          opacity: 0;
          animation: fadeIn 1s 0.9s ease-out forwards;
        }

        .cta-button {
          display: inline-block;
          margin-top: clamp(20px, 3vh, 40px);
          padding: clamp(16px, 2vw, 20px) clamp(40px, 5vw, 60px);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          font-size: clamp(16px, 1.4vw, 18px);
          border-radius: 50px;
          letter-spacing: 0.1em;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          opacity: 0;
          animation: pulseIn 1s 1.1s ease-out forwards;
          box-shadow: 
            0 5px 20px rgba(102, 126, 234, 0.4),
            0 10px 40px rgba(118, 75, 162, 0.3);
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 10px 30px rgba(102, 126, 234, 0.6),
            0 20px 60px rgba(118, 75, 162, 0.4);
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button span {
          position: relative;
          z-index: 1;
        }

        /* Анимации */
        @keyframes floatLetter {
          0%, 100% {
            transform: translateY(0) rotateX(0) rotateY(0);
          }
          25% {
            transform: translateY(-10px) rotateX(10deg) rotateY(-5deg);
          }
          75% {
            transform: translateY(5px) rotateX(-5deg) rotateY(10deg);
          }
        }

        @keyframes slideInTop {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInBottom {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulseIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Эффект глитча для заголовка */
        @keyframes glitch {
          0%, 100% {
            text-shadow: 
              0 0 40px rgba(0, 255, 255, 0.8),
              0 0 80px rgba(99, 102, 241, 0.6);
          }
          20% {
            text-shadow: 
              2px 2px 40px rgba(255, 0, 255, 0.8),
              -2px -2px 80px rgba(0, 255, 255, 0.6);
          }
          40% {
            text-shadow: 
              -2px 2px 40px rgba(0, 255, 255, 0.8),
              2px -2px 80px rgba(255, 255, 0, 0.6);
          }
        }

        .main-header:hover .letter-3d {
          animation: glitch 0.3s ease-in-out infinite;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-content {
            padding: 20px;
            gap: 15px;
          }

          .pre-header {
            font-size: 14px;
            letter-spacing: 0.3em;
          }

          .main-header {
            font-size: 60px;
          }

          .sub-header {
            font-size: 20px;
            letter-spacing: 0.15em;
          }

          .cta-button {
            padding: 16px 40px;
            font-size: 16px;
            margin-top: 30px;
          }

          .description {
            font-size: 16px;
            margin: 15px auto;
            padding: 0 20px;
          }
        }

        /* Ультра широкие экраны */
        @media (min-width: 1920px) {
          .hero-content {
            gap: 25px;
          }
          
          .main-header {
            font-size: clamp(100px, 10vw, 140px);
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