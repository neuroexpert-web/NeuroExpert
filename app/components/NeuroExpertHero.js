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
      connectionDistance: 250,
      mouseRadius: 300,
      baseSpeed: 0.2,
      pulseSpeed: 0.015,
      glowIntensity: 1.5,
      particleTrails: true,
      electricArcs: true,
      connectionOpacity: 0.15,
      signalSpeed: 0.005,
      maxConnections: 4
    };

    const nodes = [];
    const electricArcs = [];
    const particles = [];
    const connections = new Map();
    const signals = [];

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

    // НЕЙРОННЫЕ СИГНАЛЫ
    class NeuralSignal {
      constructor(startNode, endNode) {
        this.start = startNode;
        this.end = endNode;
        this.progress = 0;
        this.speed = config.signalSpeed + Math.random() * 0.003;
        this.size = 2 + Math.random() * 2;
        this.hue = 180 + Math.random() * 40;
        this.trail = [];
        this.maxTrailLength = 20;
      }

      update() {
        this.progress += this.speed;
        
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;
        
        this.trail.push({ x, y, life: 1 });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }
        
        this.trail.forEach(point => {
          point.life -= 0.05;
        });
      }

      draw() {
        // Рисуем след
        this.trail.forEach((point, index) => {
          const opacity = point.life * 0.5 * (index / this.trail.length);
          ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${opacity})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, this.size * (index / this.trail.length), 0, Math.PI * 2);
          ctx.fill();
        });

        // Рисуем сам сигнал
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;

        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 1)`;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size * 3);
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 100%, 1)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 70%, 0.8)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ЭЛЕКТРИЧЕСКИЕ ДУГИ
    class ElectricArc {
      constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.life = 0.5 + Math.random() * 0.5;
        this.segments = 12;
        this.amplitude = 15;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.life -= 0.02;
        this.phase += 0.1;
      }

      draw() {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = `hsla(190, 100%, 70%, ${this.life * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsla(190, 100%, 70%, ${this.life})`;

        ctx.beginPath();
        ctx.moveTo(this.node1.x, this.node1.y);

        const dx = this.node2.x - this.node1.x;
        const dy = this.node2.y - this.node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        for (let i = 1; i <= this.segments; i++) {
          const t = i / this.segments;
          const offset = Math.sin(t * Math.PI + this.phase) * this.amplitude * (1 - t) * Math.sin(this.life * Math.PI);
          const perpX = -dy / distance;
          const perpY = dx / distance;
          
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
        
        // Поиск ближайших узлов с ограничением количества
        let nodeConnections = 0;
        const nearbyNodes = nodes
          .filter((other, j) => j !== i)
          .map(other => {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return { other, distance };
          })
          .filter(({ distance }) => distance < config.connectionDistance)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, config.maxConnections);
        
        nearbyNodes.forEach(({ other, distance }) => {
          const strength = 1 - distance / config.connectionDistance;
          const key = `${Math.min(i, nodes.indexOf(other))}-${Math.max(i, nodes.indexOf(other))}`;
          
          if (!connections.has(key)) {
            connections.set(key, { node, other, strength, distance });
            
            // Создаем электрические дуги для сильных связей
            if (config.electricArcs && strength > 0.7 && Math.random() < 0.002 && electricArcs.length < 3) {
              electricArcs.push(new ElectricArc(node, other));
            }
          }
        });
      });

      // Рисуем соединения с плавными кривыми
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      connections.forEach(({ node, other, strength, distance }) => {
        // Рассчитываем контрольные точки для кривой Безье
        const dx = other.x - node.x;
        const dy = other.y - node.y;
        const midX = (node.x + other.x) / 2;
        const midY = (node.y + other.y) / 2;
        
        // Добавляем небольшое искривление для реализма
        const curve = Math.sin(Date.now() * 0.0001 + node.x + other.y) * 20;
        const perpX = -dy / distance * curve;
        const perpY = dx / distance * curve;
        
        // Мягкий градиент для связи
        const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
        const opacity = strength * config.connectionOpacity;
        gradient.addColorStop(0, `hsla(${node.hue}, 70%, 60%, ${opacity})`);
        gradient.addColorStop(0.3, `hsla(${node.hue}, 80%, 65%, ${opacity * 1.2})`);
        gradient.addColorStop(0.7, `hsla(${other.hue}, 80%, 65%, ${opacity * 1.2})`);
        gradient.addColorStop(1, `hsla(${other.hue}, 70%, 60%, ${opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(0.3, strength * 1.5);
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.quadraticCurveTo(midX + perpX, midY + perpY, other.x, other.y);
        ctx.stroke();
        
        // Создаем сигналы для активных связей
        if (Math.random() < 0.001 && signals.length < 30) {
          signals.push(new NeuralSignal(node, other));
        }
      });
      
      ctx.restore();

      // Рисуем сигналы
      signals.forEach((signal, index) => {
        signal.update();
        signal.draw();
        if (signal.progress > 1) {
          signals.splice(index, 1);
        }
      });

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
          padding: 40px 20px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 40px;
        }

        .pre-header {
          font-family: 'Orbitron', monospace;
          font-weight: 400;
          font-size: 16px;
          color: #60A5FA;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          margin-bottom: 50px;
          opacity: 0;
          animation: slideInTop 1s 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          text-shadow: 0 0 30px rgba(96, 165, 250, 0.6);
        }

        .main-header {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          font-size: clamp(80px, 14vw, 140px);
          margin: 0;
          line-height: 1;
          text-transform: uppercase;
          margin-bottom: 60px;
          perspective: 1000px;
          letter-spacing: 0.05em;
        }

        .letter-wrapper {
          animation: letterFloat 3s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .letter-3d {
          background: linear-gradient(135deg, #00FFFF, #6366F1, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 
            0 0 40px rgba(0, 255, 255, 0.8),
            0 0 80px rgba(99, 102, 241, 0.6),
            0 0 120px rgba(168, 85, 247, 0.4);
          filter: brightness(1.5);
          animation: letterGlow 2s ease-in-out infinite alternate;
        }

        @keyframes letterFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0) rotateY(0);
          }
          25% {
            transform: translateY(-10px) rotateX(10deg) rotateY(-10deg);
          }
          75% {
            transform: translateY(5px) rotateX(-5deg) rotateY(5deg);
          }
        }

        @keyframes letterGlow {
          from {
            filter: brightness(1.5) contrast(1);
          }
          to {
            filter: brightness(2) contrast(1.2);
          }
        }

        .sub-header {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(24px, 4.5vw, 36px);
          background: linear-gradient(90deg, #60A5FA, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          margin-bottom: 40px;
          margin-top: -20px;
          opacity: 0;
          animation: slideInBottom 1s 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          letter-spacing: 0.15em;
        }

        .description {
          font-weight: 400;
          font-size: clamp(18px, 2.8vw, 24px);
          color: rgba(209, 213, 219, 0.95);
          max-width: 800px;
          line-height: 1.8;
          margin: 0 auto 60px;
          opacity: 0;
          animation: fadeIn 1s 0.7s ease-out forwards;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          letter-spacing: 0.02em;
        }

        .cta-button {
          position: relative;
          display: inline-block;
          padding: 22px 60px;
          font-family: 'Orbitron', monospace;
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #FFFFFF;
          text-decoration: none;
          background: transparent;
          border: none;
          border-radius: 60px;
          overflow: visible;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          animation: pulseIn 1s 0.9s ease-out forwards;
          margin-top: 20px;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(90deg, #00FFFF, #6366F1, #A855F7, #00FFFF);
          background-size: 300% 300%;
          border-radius: 60px;
          z-index: -1;
          animation: gradientRotate 4s linear infinite;
          opacity: 1;
        }

        .cta-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 5, 26, 0.95);
          border-radius: 57px;
          z-index: -1;
          transition: all 0.4s ease;
        }

        .cta-button span {
          position: relative;
          z-index: 1;
          background: linear-gradient(90deg, #00FFFF, #FFFFFF, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: brightness(1.2);
        }

        .cta-button:hover {
          transform: translateY(-5px) scale(1.08);
          filter: brightness(1.3);
          box-shadow: 
            0 10px 40px rgba(0, 255, 255, 0.4),
            0 20px 60px rgba(168, 85, 247, 0.3);
        }

        .cta-button:hover::after {
          background: rgba(10, 5, 26, 0.5);
        }

        .cta-button:hover::before {
          background-size: 400% 400%;
          filter: brightness(1.5);
        }

        @keyframes gradientRotate {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
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
            padding: 30px 20px;
            gap: 30px;
          }

          .pre-header {
            font-size: 14px;
            margin-bottom: 30px;
          }

          .main-header {
            font-size: clamp(50px, 12vw, 80px);
            margin-bottom: 40px;
          }

          .sub-header {
            font-size: clamp(20px, 5vw, 28px);
            margin-bottom: 30px;
          }

          .cta-button {
            padding: 18px 45px;
            font-size: 16px;
          }

          .description {
            font-size: 16px;
            margin-bottom: 40px;
            line-height: 1.6;
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