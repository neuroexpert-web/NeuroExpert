'use client';

import { useEffect, useRef } from 'react';

export default function NeuroExpertHero() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Анимация заголовков
    const animateText = () => {
      const header = document.getElementById('animated-main-header');
      if (header && header.children.length === 0) {
        const text = header.textContent;
        header.innerHTML = '';
        
        text.split('').forEach((char, i) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.className = 'letter';
          span.style.cssText = `
            display: inline-block;
            opacity: 0;
            transform: translateY(50px) rotateX(90deg);
            animation: letterReveal 0.8s ${i * 0.08}s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          `;
          header.appendChild(span);
        });
      }
    };

    setTimeout(animateText, 300);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Настройка canvas с учетом DPI для четкости
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Очищаем canvas для четкого изображения
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Нейроны
    const neurons = [];
    const neuronCount = width > 768 ? 120 : 80;
    
    // Импульсы для передачи сигналов
    const impulses = [];
    
    // Класс нейрона
    class Neuron {
      constructor(index) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 2 + 2;
        this.energy = Math.random();
        this.connections = [];
        this.pulseTimer = Math.random() * 200;
        this.glowIntensity = 0;
        this.targetGlow = 0;
        this.id = index;
      }

      update() {
        // Плавное движение
        this.x += this.vx;
        this.y += this.vy;

        // Мягкие границы
        if (this.x < 50) this.vx += 0.1;
        if (this.x > width - 50) this.vx -= 0.1;
        if (this.y < 50) this.vy += 0.1;
        if (this.y > height - 50) this.vy -= 0.1;

        // Обновляем энергию
        this.energy = Math.min(1, this.energy + 0.001);
        
        // Пульсация
        this.pulseTimer++;
        if (this.pulseTimer > 200 && this.energy > 0.5 && Math.random() < 0.01) {
          this.pulse();
          this.pulseTimer = 0;
        }

        // Плавное изменение свечения
        this.glowIntensity += (this.targetGlow - this.glowIntensity) * 0.1;
        if (this.glowIntensity < 0.01) this.targetGlow = 0;
      }

      pulse() {
        this.targetGlow = 1;
        this.energy *= 0.5;
        
        // Создаем импульсы к соединенным нейронам
        this.connections.forEach(connection => {
          if (connection.strength > 0.3) {
            impulses.push(new Impulse(this, connection.neuron));
          }
        });
      }

      draw() {
        // Яркое неоновое свечение (как в Аватаре)
        const outerGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 12);
        outerGlow.addColorStop(0, `rgba(0, 255, 255, ${0.3 + this.glowIntensity * 0.4})`);
        outerGlow.addColorStop(0.3, `rgba(0, 200, 255, ${0.2 + this.glowIntensity * 0.3})`);
        outerGlow.addColorStop(0.6, `rgba(100, 149, 237, ${0.1 + this.glowIntensity * 0.2})`);
        outerGlow.addColorStop(1, 'rgba(0, 150, 255, 0)');
        
        ctx.fillStyle = outerGlow;
        ctx.fillRect(this.x - this.radius * 12, this.y - this.radius * 12, this.radius * 24, this.radius * 24);

        // Средний слой свечения
        const midGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 6);
        midGlow.addColorStop(0, `rgba(0, 255, 255, ${0.5 + this.glowIntensity * 0.5})`);
        midGlow.addColorStop(0.5, `rgba(0, 200, 255, ${0.3 + this.glowIntensity * 0.3})`);
        midGlow.addColorStop(1, 'rgba(0, 200, 255, 0)');
        
        ctx.fillStyle = midGlow;
        ctx.fillRect(this.x - this.radius * 6, this.y - this.radius * 6, this.radius * 12, this.radius * 12);

        // Яркое ядро нейрона
        const coreGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 + this.glowIntensity * 0.1})`);
        coreGradient.addColorStop(0.3, `rgba(0, 255, 255, ${0.8 + this.glowIntensity * 0.2})`);
        coreGradient.addColorStop(0.7, `rgba(0, 200, 255, ${0.6 + this.glowIntensity * 0.2})`);
        coreGradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Центральная яркая точка
        ctx.fillStyle = `rgba(255, 255, 255, ${0.95 + this.glowIntensity * 0.05})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Добавляем блики
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const highlight = ctx.createRadialGradient(this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0, this.x, this.y, this.radius);
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Класс импульса
    class Impulse {
      constructor(from, to) {
        this.from = from;
        this.to = to;
        this.progress = 0;
        this.speed = 0.02;
        this.size = 3;
        this.trail = [];
      }

      update() {
        this.progress += this.speed;
        
        // Текущая позиция импульса
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;
        
        // Сохраняем след
        this.trail.push({ x, y, opacity: 1 });
        if (this.trail.length > 10) {
          this.trail.shift();
        }
        
        // Уменьшаем прозрачность следа
        this.trail.forEach((point, i) => {
          point.opacity = (i / this.trail.length) * 0.5;
        });

        // Когда импульс достигает цели
        if (this.progress >= 1) {
          this.to.targetGlow = 0.8;
          this.to.energy = Math.min(1, this.to.energy + 0.3);
          return true;
        }
        return false;
      }

      draw() {
        // Рисуем след
        this.trail.forEach((point, i) => {
          if (i > 0) {
            const prevPoint = this.trail[i - 1];
            const gradient = ctx.createLinearGradient(prevPoint.x, prevPoint.y, point.x, point.y);
            gradient.addColorStop(0, `rgba(236, 72, 153, ${prevPoint.opacity})`);
            gradient.addColorStop(1, `rgba(168, 85, 247, ${point.opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(prevPoint.x, prevPoint.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        });

        // Головка импульса
        const currentX = this.from.x + (this.to.x - this.from.x) * this.progress;
        const currentY = this.from.y + (this.to.y - this.from.y) * this.progress;
        
        const headGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, this.size);
        headGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        headGradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.8)');
        headGradient.addColorStop(1, 'rgba(236, 72, 153, 0)');
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Создаем нейроны
    for (let i = 0; i < neuronCount; i++) {
      neurons.push(new Neuron(i));
    }

    // Устанавливаем связи между нейронами
    neurons.forEach((neuron, i) => {
      neurons.forEach((other, j) => {
        if (i !== j) {
          const dx = other.x - neuron.x;
          const dy = other.y - neuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const strength = 1 - distance / 150;
            neuron.connections.push({ neuron: other, strength });
          }
        }
      });
    });

    let mouseX = -1000;
    let mouseY = -1000;

    const animate = () => {
      // Темный фон с легким градиентом
      ctx.fillStyle = '#0A051A';
      ctx.fillRect(0, 0, width, height);
      
      // Легкий градиент для глубины
      const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
      bgGradient.addColorStop(0, 'rgba(99, 102, 241, 0.02)');
      bgGradient.addColorStop(1, 'rgba(10, 5, 26, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Обновляем и рисуем связи
      neurons.forEach(neuron => {
        neuron.connections.forEach(connection => {
          const opacity = connection.strength * 0.3 * (0.5 + neuron.energy * 0.5);
          
          // Неоновая светящаяся линия
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
          
          const gradient = ctx.createLinearGradient(neuron.x, neuron.y, connection.neuron.x, connection.neuron.y);
          gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(0, 200, 255, ${opacity * 0.8})`);
          gradient.addColorStop(1, `rgba(0, 255, 255, ${opacity})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.lineTo(connection.neuron.x, connection.neuron.y);
          ctx.stroke();
          ctx.restore();
        });
      });

      // Обновляем и рисуем импульсы
      for (let i = impulses.length - 1; i >= 0; i--) {
        if (impulses[i].update()) {
          impulses.splice(i, 1);
        } else {
          impulses[i].draw();
        }
      }

      // Обновляем и рисуем нейроны
      neurons.forEach(neuron => {
        neuron.update();
        neuron.draw();
      });

      // Эффект взаимодействия с мышью
      neurons.forEach(neuron => {
        const dx = mouseX - neuron.x;
        const dy = mouseY - neuron.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (1 - distance / 100) * 0.5;
          neuron.vx += dx * force * 0.001;
          neuron.vy += dy * force * 0.001;
          
          if (distance < 50 && Math.random() < 0.1) {
            neuron.pulse();
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // События
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStartClick = (e) => {
    e.preventDefault();
    
    // Ripple эффект
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
    
    // Открываем AI чат
    setTimeout(() => {
      const aiButton = document.querySelector('.ai-float-button');
      if (aiButton) aiButton.click();
    }, 100);
  };

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="neural-canvas" />
      
      <div className="hero-content">
        <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
        <h1 className="main-header">NeuroExpert</h1>
        <h2 className="sub-header">СОЗДАЙТЕ ЦИФРОВОЕ ПОЗИЦИОНИРОВАНИЕ</h2>
        <p className="description">
          Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов с помощью передовых ИИ технологий
        </p>
        
        <button className="cta-button" onClick={handleStartClick}>
          <span className="button-glow"></span>
          <span className="button-border"></span>
          <span className="button-inner">
            <span className="button-text">Начать бесплатно</span>
            <span className="button-icon">→</span>
          </span>
        </button>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0A051A;
          overflow: hidden;
        }

        .neural-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 40px 20px;
          max-width: 900px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          justify-content: center;
        }

        .pre-header {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: #93c5fd;
          margin: 0 0 24px 0;
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }

        .main-header {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: clamp(60px, 10vw, 96px);
          font-weight: 700;
          line-height: 1;
          margin: 0 0 24px 0;
          background: linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 20px rgba(99, 102, 241, 0.3));
          opacity: 0;
          animation: fadeIn 1s 0.2s ease-out forwards;
        }

        .sub-header {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 600;
          color: #60a5fa;
          margin: 0 0 24px 0;
          letter-spacing: 0.05em;
          opacity: 0;
          animation: fadeIn 1s 0.4s ease-out forwards;
        }

        .description {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: clamp(16px, 2vw, 20px);
          font-weight: 400;
          line-height: 1.6;
          color: #cbd5e1;
          margin: 0 auto 50px;
          max-width: 600px;
          opacity: 0;
          animation: fadeIn 1s 0.6s ease-out forwards;
        }

        /* Неоновая прозрачная кнопка */
        .cta-button {
          position: relative;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: 'Inter', -apple-system, sans-serif;
          opacity: 0;
          animation: fadeIn 1s 0.8s ease-out forwards, pulseGlow 2s 1.8s ease-in-out infinite;
          margin-top: auto;
          margin-bottom: 60px;
          overflow: visible;
        }

        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(0, 255, 255, 0.8));
          }
        }

        .button-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .button-border {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
          border-radius: 50px;
          padding: 2px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .button-inner {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          background: rgba(10, 5, 26, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .button-icon {
          font-size: 20px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-button:hover .button-glow {
          opacity: 1;
        }

        .cta-button:hover .button-border {
          opacity: 1;
        }

        .cta-button:hover .button-inner {
          background: rgba(10, 5, 26, 0.8);
          transform: translateY(-2px);
        }

        .cta-button:hover .button-icon {
          transform: translateX(4px);
        }

        .cta-button:active .button-inner {
          transform: translateY(0);
        }

        /* Ripple эффект */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: translate(-50%, -50%);
          animation: rippleEffect 1s ease-out;
          pointer-events: none;
        }

        @keyframes rippleEffect {
          from {
            width: 0;
            height: 0;
            opacity: 1;
          }
          to {
            width: 150px;
            height: 150px;
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes letterReveal {
          0% {
            opacity: 0;
            transform: translateY(50px) rotateX(90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }

        /* Анимация букв заголовка */
        .main-header .letter {
          display: inline-block;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-content {
            padding: 20px;
            justify-content: space-between;
            padding-top: 80px;
            padding-bottom: 40px;
          }

          .pre-header {
            font-size: 12px;
            letter-spacing: 0.1em;
            margin-bottom: 16px;
          }

          .main-header {
            font-size: 48px;
            margin-bottom: 16px;
          }

          .sub-header {
            font-size: 20px;
            margin-bottom: 16px;
          }

          .description {
            font-size: 16px;
            margin-bottom: 40px;
            padding: 0 10px;
          }

          .cta-button {
            margin-top: auto;
            margin-bottom: 40px;
          }

          .button-inner {
            padding: 16px 32px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .hero-content {
            padding-top: 60px;
            padding-bottom: 30px;
          }

          .main-header {
            font-size: 40px;
          }

          .sub-header {
            font-size: 18px;
          }

          .description {
            font-size: 15px;
          }

          .cta-button {
            margin-bottom: 30px;
          }

          .button-inner {
            padding: 14px 28px;
            font-size: 14px;
          }
        }

        /* Высокие экраны */
        @media (min-height: 900px) {
          .hero-content {
            max-width: 1000px;
          }

          .main-header {
            font-size: 112px;
          }

          .sub-header {
            font-size: 40px;
          }

          .description {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  );
}