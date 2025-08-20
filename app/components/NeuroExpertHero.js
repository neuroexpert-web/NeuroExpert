'use client';

import { useEffect, useRef } from 'react';

export default function NeuroExpertHero() {
  const canvasRef = useRef(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // Анимация заголовка из ТЗ
    const animateHeader = () => {
      const header = document.getElementById('animated-main-header');
      if (header && header.children.length === 0) {
        const text = header.textContent;
        header.innerHTML = '';
        
        text.split('').forEach(char => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char;
          header.appendChild(span);
        });

        const chars = document.querySelectorAll('.char');
        chars.forEach((char, index) => {
          setTimeout(() => {
            char.classList.add('visible');
          }, 300 + index * 70);
        });
      }
    };

    animateHeader();

    // Создаем свою мощную анимацию нейросети
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Параметры для мощной визуализации
    const neurons = [];
    const connections = [];
    const particleCount = window.innerWidth > 768 ? 80 : 40;
    const connectionDistance = 150;
    const pulseWaves = [];

    // Класс для нейронов
    class Neuron {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 2;
        this.pulse = 0;
        this.energy = Math.random();
        this.brightness = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        this.energy += (Math.random() - 0.5) * 0.02;
        this.energy = Math.max(0, Math.min(1, this.energy));
        
        this.pulse += 0.05;
        this.brightness = 0.5 + Math.sin(this.pulse) * 0.3 + this.energy * 0.2;
      }

      draw() {
        // Внешнее яркое свечение
        const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 20);
        glow.addColorStop(0, `rgba(0, 255, 255, ${this.brightness * 0.3})`);
        glow.addColorStop(0.3, `rgba(99, 102, 241, ${this.brightness * 0.2})`);
        glow.addColorStop(1, 'rgba(168, 85, 247, 0)');
        
        ctx.fillStyle = glow;
        ctx.fillRect(this.x - this.radius * 20, this.y - this.radius * 20, this.radius * 40, this.radius * 40);

        // Яркое ядро
        const core = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        core.addColorStop(0, `rgba(255, 255, 255, ${this.brightness})`);
        core.addColorStop(0.5, `rgba(0, 255, 255, ${this.brightness * 0.8})`);
        core.addColorStop(1, `rgba(99, 102, 241, ${this.brightness * 0.3})`);
        
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Центральная точка
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Класс для импульсов
    class PulseWave {
      constructor(startNeuron, endNeuron) {
        this.start = startNeuron;
        this.end = endNeuron;
        this.progress = 0;
        this.speed = 0.02;
        this.opacity = 1;
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 1) {
          this.progress = 0;
          this.opacity = Math.random() * 0.5 + 0.5;
        }
      }

      draw() {
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, `rgba(0, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Создаем нейроны
    for (let i = 0; i < particleCount; i++) {
      neurons.push(new Neuron(
        Math.random() * width,
        Math.random() * height
      ));
    }

    // Создаем импульсы
    function createPulses() {
      if (pulseWaves.length < 10 && Math.random() < 0.1) {
        const n1 = neurons[Math.floor(Math.random() * neurons.length)];
        const n2 = neurons[Math.floor(Math.random() * neurons.length)];
        if (n1 !== n2) {
          pulseWaves.push(new PulseWave(n1, n2));
        }
      }
    }

    // Анимация
    function animate() {
      ctx.fillStyle = 'rgba(10, 5, 26, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Рисуем соединения
      neurons.forEach((n1, i) => {
        neurons.slice(i + 1).forEach(n2 => {
          const distance = Math.hypot(n2.x - n1.x, n2.y - n1.y);
          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            
            ctx.save();
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
            
            const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(0, 255, 255, ${opacity * 1.2})`);
            gradient.addColorStop(1, `rgba(168, 85, 247, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      // Обновляем и рисуем нейроны
      neurons.forEach(neuron => {
        neuron.update();
        neuron.draw();
      });

      // Обновляем и рисуем импульсы
      createPulses();
      pulseWaves.forEach((pulse, index) => {
        pulse.update();
        pulse.draw();
        if (pulse.progress > 1) {
          pulseWaves.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Обработка изменения размера окна
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
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          background-color: #0A051A;
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
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Типография из ТЗ */
        .pre-header {
          font-weight: 500;
          font-size: 14px;
          color: #A0A3B5;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeIn 1s 0.3s ease-out forwards;
        }

        .main-header {
          font-weight: 700;
          font-size: clamp(48px, 10vw, 80px);
          margin: 0;
          background: linear-gradient(90deg, #A855F7, #6366F1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .sub-header {
          font-weight: 600;
          font-size: clamp(24px, 5vw, 36px);
          color: #60A5FA;
          text-transform: uppercase;
          margin-top: 24px;
          margin-bottom: 16px;
          opacity: 0;
          animation: fadeIn 1s 0.5s ease-out forwards;
        }

        .description {
          font-weight: 400;
          font-size: clamp(16px, 3vw, 20px);
          color: #D1D5DB;
          max-width: 600px;
          line-height: 1.6;
          margin: 24px auto 40px auto;
          opacity: 0;
          animation: fadeIn 1s 0.6s ease-out forwards;
        }

        /* Кнопка из ТЗ с градиентом */
        .cta-button {
          display: inline-block;
          padding: 18px 40px;
          border-radius: 50px;
          border: none;
          text-decoration: none;
          font-size: 16px;
          font-weight: 600;
          color: #FFFFFF;
          text-transform: uppercase;
          background: linear-gradient(90deg, #6366F1, #A855F7);
          box-shadow: 0 10px 30px -5px rgba(168, 85, 247, 0.4);
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          opacity: 0;
          animation: fadeIn 1s 0.8s ease-out forwards;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.3), 
            transparent);
          transition: left 0.6s;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px -5px rgba(168, 85, 247, 0.5);
        }

        .cta-button:hover::before {
          left: 100%;
        }

        /* Анимация букв из ТЗ */
        .char {
          position: relative;
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), 
                      transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .char.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Анимации */
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

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-content {
            padding: 20px;
          }

          .pre-header {
            font-size: 12px;
          }

          .main-header {
            font-size: clamp(36px, 8vw, 60px);
          }

          .sub-header {
            font-size: clamp(18px, 4vw, 28px);
          }

          .description {
            font-size: clamp(14px, 2.5vw, 18px);
          }

          .cta-button {
            padding: 16px 32px;
            font-size: 14px;
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
            НАЧАТЬ БЕСПЛАТНО
          </a>
        </div>
      </section>
    </>
  );
}