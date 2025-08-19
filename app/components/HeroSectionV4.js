'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import './HeroSectionV4.css';

export default function HeroSectionV4() {
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Анимированный фон с нейронной сетью
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Установка размеров canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Частицы для нейронной сети
    class Neuron {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1;
        this.connections = [];
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulsePhase += 0.02;

        // Плавный отскок от границ
        if (this.x < 50) this.vx = Math.abs(this.vx);
        if (this.x > canvas.width - 50) this.vx = -Math.abs(this.vx);
        if (this.y < 50) this.vy = Math.abs(this.vy);
        if (this.y > canvas.height - 50) this.vy = -Math.abs(this.vy);
      }

      draw() {
        const pulse = 0.7 + Math.sin(this.pulsePhase) * 0.3;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, `rgba(168, 85, 247, ${0.8 * pulse})`);
        gradient.addColorStop(0.5, `rgba(99, 102, 241, ${0.4 * pulse})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Центральная точка
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * pulse})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Поток данных
    class DataStream {
      constructor() {
        this.points = [];
        this.reset();
      }

      reset() {
        const startX = Math.random() * canvas.width;
        const startY = -50;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = canvas.height + 50;
        
        this.points = [];
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = startX + (endX - startX) * t;
          const y = startY + (endY - startY) * t;
          const offset = Math.sin(t * Math.PI * 2) * 30;
          this.points.push({
            x: x + offset,
            y: y,
            opacity: 0
          });
        }
        
        this.currentIndex = 0;
        this.speed = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '168, 85, 247' : '99, 102, 241';
      }

      update() {
        if (this.currentIndex < this.points.length - 1) {
          const fadeLength = 8;
          for (let i = 0; i < this.points.length; i++) {
            const distance = Math.abs(i - this.currentIndex);
            if (distance < fadeLength) {
              this.points[i].opacity = 1 - (distance / fadeLength);
            } else {
              this.points[i].opacity = 0;
            }
          }
          this.currentIndex += this.speed;
        } else {
          this.reset();
        }
      }

      draw() {
        ctx.strokeStyle = `rgba(${this.color}, 0.3)`;
        ctx.lineWidth = 2;
        
        for (let i = 1; i < this.points.length; i++) {
          if (this.points[i].opacity > 0) {
            ctx.beginPath();
            ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
            ctx.lineTo(this.points[i].x, this.points[i].y);
            ctx.globalAlpha = this.points[i].opacity * 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    // Создание элементов
    const neurons = Array(25).fill().map(() => new Neuron());
    const streams = Array(8).fill().map(() => new DataStream());

    // Анимационный цикл
    const animate = () => {
      // Постепенное затухание
      ctx.fillStyle = 'rgba(10, 5, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Рисуем потоки данных
      streams.forEach(stream => {
        stream.update();
        stream.draw();
      });

      // Рисуем связи между нейронами
      neurons.forEach((n1, i) => {
        neurons.slice(i + 1).forEach(n2 => {
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        });
        n1.update();
      });

      // Рисуем нейроны
      neurons.forEach(neuron => {
        neuron.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Анимация заголовка с эффектом нейронного импульса
  useEffect(() => {
    if (!headerRef.current || !isLoaded) return;

    const header = headerRef.current;
    const text = header.textContent;
    
    // Создаем структуру для каждой буквы
    header.innerHTML = text.split('').map((char, index) => 
      `<span class="letter" data-index="${index}">
        <span class="letter-content">${char}</span>
        <span class="neural-pulse"></span>
      </span>`
    ).join('');

    // Запускаем анимацию с задержкой
    setTimeout(() => {
      const letters = header.querySelectorAll('.letter');
      letters.forEach((letter, index) => {
        setTimeout(() => {
          letter.classList.add('animate');
        }, index * 100); // Задержка 0.1 секунды между буквами
      });
    }, 500);
  }, [isLoaded]);

  // Устанавливаем isLoaded после монтирования
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleCTAClick = () => {
    router.push('/chat');
  };

  return (
    <section className="hero-section">
      <canvas ref={canvasRef} className="neural-background" />
      
      <div className="hero-content">
        <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
        
        <h1 ref={headerRef} className="main-header" id="animated-header">
          NeuroExpert
        </h1>
        
        <h2 className="sub-header">ЦИФРОВИЗАЦИЯ БИЗНЕСА</h2>
        
        <p className="sub-header-caption">С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ</p>
        
        <p className="description">
          Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте 
          конкурентов с помощью передовых AI-технологий.
        </p>
        
        <button className="cta-button" onClick={handleCTAClick}>
          НАЧАТЬ БЕСПЛАТНО
        </button>
      </div>
    </section>
  );
}