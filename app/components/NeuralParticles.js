// Интерактивные нейронные частицы для NeuroExpert
'use client';
import { useEffect, useRef } from 'react';

function NeuralParticles() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    
    // Настройка размера canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Создание частиц
    const createParticles = () => {
      const particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / (isMobile ? 32000 : 15000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.5),
          vy: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.5),
          size: Math.random() * 2 + 1,
          opacity: (Math.random() * (isMobile ? 0.35 : 0.6)) + (isMobile ? 0.15 : 0.2),
          color: getRandomNeuralColor(),
          pulsePhase: Math.random() * Math.PI * 2,
          connections: []
        });
      }
      
      particlesRef.current = particles;
    };

    // Получение случайного цвета полярной ночи
    const getRandomNeuralColor = () => {
      const colors = [
        '#00ffa3', // aurora green
        '#4dd8ff', // ice blue
        '#1a4f7a', // deep blue
        '#6366f1', // purple mist
        '#f0f9ff', // frost white
        '#0ea5e9'  // arctic cyan
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Отслеживание мыши
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Анимация частиц
    const animate = () => {
      ctx.fillStyle = `rgba(10, 10, 15, ${isMobile ? 0.04 : 0.05})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      
      // Обновление и отрисовка частиц
      particles.forEach((particle, i) => {
        // Движение частиц
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Границы экрана
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Притяжение к мыши
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const maxR = isMobile ? 90 : 150;
        if (distance < maxR) {
          const force = (maxR - distance) / maxR;
          particle.vx += (dx / distance) * force * (isMobile ? 0.006 : 0.01);
          particle.vy += (dy / distance) * force * (isMobile ? 0.006 : 0.01);
        }
        
        // Ограничение скорости
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        const maxSpeed = isMobile ? 0.7 : 1;
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }
        
        // Пульсация
        particle.pulsePhase += isMobile ? 0.01 : 0.02;
        const pulse = Math.sin(particle.pulsePhase) * (isMobile ? 0.2 : 0.3) + 0.7;
        
        // Отрисовка частицы
        ctx.save();
        ctx.globalAlpha = particle.opacity * pulse;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = (isMobile ? 6 : 10) * pulse;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Поиск близких частиц для связей
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const maxD = isMobile ? 90 : 120;
          if (distance < maxD) {
            const opacity = (maxD - distance) / maxD * (isMobile ? 0.18 : 0.3) * pulse;
            
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = isMobile ? 2 : 5;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    // Очистка
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        mixBlendMode: 'screen'
      }}
    />
  );
}

export default NeuralParticles;