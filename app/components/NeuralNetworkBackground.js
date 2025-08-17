'use client';

import { useEffect, useRef, useState } from 'react';

export default function NeuralNetworkBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    // Проверяем что мы на клиенте
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    const isMobile = window.innerWidth < 768;
    
    // Настройка размеров canvas с учетом DPI
    const resizeCanvas = () => {
      if (typeof window === 'undefined') return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    
    resizeCanvas();
    
    // Узлы нейросети
    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        const speedScale = isMobile ? 0.15 : 0.3;
        this.vx = (Math.random() - 0.5) * speedScale;
        this.vy = (Math.random() - 0.5) * speedScale;
        this.radius = Math.random() * 2 + 1.5;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = (isMobile ? 0.008 : 0.015) + Math.random() * (isMobile ? 0.006 : 0.01);
        this.color = this.getRandomColor();
      }
      
      getRandomColor() {
        const colors = [
          { r: 99, g: 102, b: 241 },   // primary
          { r: 139, g: 92, b: 246 },   // purple
          { r: 245, g: 158, b: 11 },   // orange
          { r: 16, g: 185, b: 129 }    // green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      update(width, height) {
        // Основное движение
        this.x += this.vx;
        this.y += this.vy;
        
        // Пульсация
        this.pulsePhase += this.pulseSpeed;
        
        // Отталкивание от границ
        const margin = 50;
        if (this.x < margin) this.vx += 0.1;
        if (this.x > width - margin) this.vx -= 0.1;
        if (this.y < margin) this.vy += 0.1;
        if (this.y > height - margin) this.vy -= 0.1;
        
        // Ограничение скорости
        const maxSpeed = isMobile ? 0.3 : 0.5;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }
        
        // Небольшое трение
        this.vx *= 0.995;
        this.vy *= 0.995;
        
        // Ограничение позиции
        this.x = Math.max(10, Math.min(width - 10, this.x));
        this.y = Math.max(10, Math.min(height - 10, this.y));
      }
      
      draw(ctx, mouseX, mouseY) {
        if (!ctx) return;
        
        // Расстояние до курсора
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Размер с учетом пульсации и близости к курсору
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 1;
        const mouseEffect = distance < (isMobile ? 80 : 150) ? ((isMobile ? 80 : 150) - distance) / (isMobile ? 80 : 150) : 0;
        const size = this.radius * pulse + mouseEffect * (isMobile ? 1.2 : 2);
        
        // Градиент с учетом цвета узла
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * 2);
        const alpha = 0.6 + mouseEffect * 0.2;
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Центральная точка
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.85 + mouseEffect * 0.1})`;
        ctx.arc(this.x, this.y, size * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Соединения
    class Connection {
      constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.strength = Math.random() * 0.35 + 0.08;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = (isMobile ? 0.008 : 0.02) + Math.random() * (isMobile ? 0.006 : 0.02);
        this.waveOffset = Math.random() * Math.PI * 2;
      }
      
      update() {
        this.pulsePhase += this.pulseSpeed;
        this.waveOffset += (isMobile ? 0.01 : 0.02);
      }
      
      draw(ctx, mouseX, mouseY) {
        if (!ctx) return;
        
        const dx = this.node2.x - this.node1.x;
        const dy = this.node2.y - this.node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Максимальное расстояние для отображения соединения
        const maxDistance = isMobile ? 140 : 180;
        
        if (distance < maxDistance) {
          // Проверка близости к курсору
          const midX = (this.node1.x + this.node2.x) / 2;
          const midY = (this.node1.y + this.node2.y) / 2;
          const mouseDistance = Math.sqrt((mouseX - midX) ** 2 + (mouseY - midY) ** 2);
          const mouseEffect = mouseDistance < (isMobile ? 60 : 100) ? ((isMobile ? 60 : 100) - mouseDistance) / (isMobile ? 60 : 100) : 0;
          
          // Базовая прозрачность зависит от расстояния
          const baseOpacity = (1 - distance / maxDistance) * this.strength;
          const pulse = Math.sin(this.pulsePhase) * 0.15 + 0.85;
          const opacity = baseOpacity * pulse + mouseEffect * 0.2;
          
          // Градиент для линии
          const gradient = ctx.createLinearGradient(
            this.node1.x, this.node1.y,
            this.node2.x, this.node2.y
          );
          
          const color1 = this.node1.color;
          const color2 = this.node2.color;
          
          gradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity})`);
          
          // Мягкая волна вдоль линии (эффект передачи сигнала)
          const segments = 12;
          ctx.lineWidth = this.strength * 1.6 + mouseEffect * 0.6;
          ctx.lineCap = 'round';
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = this.node1.x + dx * t;
            const y = this.node1.y + dy * t;
            const wave = Math.sin(t * Math.PI * 2 + this.waveOffset) * (isMobile ? 0.6 : 1.2);
            const nx = -dy / distance; // нормаль
            const ny = dx / distance;
            const wx = x + nx * wave;
            const wy = y + ny * wave;
            if (i === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
        }
      }
    }
    
    // Инициализация узлов
    const initializeNetwork = () => {
      const nodes = [];
      const connections = [];
      
      // Адаптивное количество узлов в зависимости от размера экрана
      const area = canvas.width * canvas.height;
      const nodeCount = Math.min(isMobile ? 50 : 80, Math.max(isMobile ? 20 : 30, Math.floor(area / (isMobile ? 22000 : 15000))));
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = Math.random() * Math.min(canvas.width, canvas.height) * (isMobile ? 0.35 : 0.4);
        const x = canvas.width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 80;
        const y = canvas.height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 80;
        nodes.push(new Node(x, y));
      }
      
      // Создание соединений между близкими узлами
      for (let i = 0; i < nodes.length; i++) {
        const distances = nodes.map((node, j) => ({
          index: j,
          distance: Math.sqrt((nodes[i].x - node.x) ** 2 + (nodes[i].y - node.y) ** 2)
        }));
        distances.sort((a, b) => a.distance - b.distance);
        const connectionCount = (isMobile ? 2 : 3) + Math.floor(Math.random() * (isMobile ? 2 : 3));
        for (let j = 1; j < Math.min(connectionCount, distances.length); j++) {
          if (Math.random() < 0.7) {
            connections.push(new Connection(nodes[i], nodes[distances[j].index]));
          }
        }
      }
      
      nodesRef.current = nodes;
      connectionsRef.current = connections;
    };
    
    if (nodesRef.current.length === 0) {
      initializeNetwork();
    }
    
    const handleMouseMove = (e) => {
      if (typeof window === 'undefined' || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = touch.clientX - rect.left;
        mouseRef.current.y = touch.clientY - rect.top;
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('resize', () => {
        resizeCanvas();
        initializeNetwork();
      });
    }
    
    let lastTime = 0;
    const targetFPS = isMobile ? 50 : 60;
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime) => {
      if (!ctx || !canvas) return;
      const deltaTime = currentTime - lastTime;
      if (deltaTime > frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const bgGradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        bgGradient.addColorStop(0, 'rgba(30, 41, 59, 0.25)');
        bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const nodes = nodesRef.current;
        const connections = connectionsRef.current;
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;
        
        connections.forEach(conn => {
          conn.update();
          conn.draw(ctx, mouseX, mouseY);
        });
        
        // Соединения с курсором — ослаблены на мобильных
        if (!isMobile) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
          ctx.lineWidth = 1;
          nodes.forEach(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
              const opacity = (1 - distance / 120) * 0.5;
              const gradient = ctx.createLinearGradient(node.x, node.y, mouseX, mouseY);
              gradient.addColorStop(0, `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${opacity})`);
              gradient.addColorStop(0.5, `rgba(245, 158, 11, ${opacity * 0.7})`);
              gradient.addColorStop(1, `rgba(245, 158, 11, ${opacity * 0.25})`);
              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1.2;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(mouseX, mouseY);
              ctx.stroke();
              node.vx += dx * 0.00002;
              node.vy += dy * 0.00002;
            }
          });
        }
        
        nodes.forEach(node => {
          node.update(canvas.width, canvas.height);
          node.draw(ctx, mouseX, mouseY);
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', resizeCanvas);
      }
    };
  }, [isClient]);
  
  if (!isClient) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        zIndex: -1
      }} />
    );
  }
  
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
        pointerEvents: 'none'
      }}
    />
  );
}
