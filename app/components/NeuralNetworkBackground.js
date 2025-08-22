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

    // Настройка размеров canvas с учетом DPI
    const resizeCanvas = () => {
      if (typeof window === 'undefined') return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';

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
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1.5;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.01;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = [
          { r: 99, g: 102, b: 241 }, // primary
          { r: 139, g: 92, b: 246 }, // purple
          { r: 245, g: 158, b: 11 }, // orange
          { r: 16, g: 185, b: 129 }, // green
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
        const maxSpeed = 0.5;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }

        // Небольшое трение
        this.vx *= 0.99;
        this.vy *= 0.99;

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
        const pulse = Math.sin(this.pulsePhase) * 0.3 + 1;
        const mouseEffect = distance < 150 ? (150 - distance) / 150 : 0;
        const size = this.radius * pulse + mouseEffect * 2;

        // Градиент с учетом цвета узла
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * 2);
        const alpha = 0.8 + mouseEffect * 0.2;
        gradient.addColorStop(
          0,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`
        );
        gradient.addColorStop(
          0.5,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.5})`
        );
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Центральная точка
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 + mouseEffect * 0.1})`;
        ctx.arc(this.x, this.y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Соединения
    class Connection {
      constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.strength = Math.random() * 0.4 + 0.1;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
      }

      update() {
        this.pulsePhase += this.pulseSpeed;
      }

      draw(ctx, mouseX, mouseY) {
        if (!ctx) return;

        const dx = this.node2.x - this.node1.x;
        const dy = this.node2.y - this.node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Максимальное расстояние для отображения соединения
        const maxDistance = 180;

        if (distance < maxDistance) {
          // Проверка близости к курсору
          const midX = (this.node1.x + this.node2.x) / 2;
          const midY = (this.node1.y + this.node2.y) / 2;
          const mouseDistance = Math.sqrt((mouseX - midX) ** 2 + (mouseY - midY) ** 2);
          const mouseEffect = mouseDistance < 100 ? (100 - mouseDistance) / 100 : 0;

          // Базовая прозрачность зависит от расстояния
          const baseOpacity = (1 - distance / maxDistance) * this.strength;
          const pulse = Math.sin(this.pulsePhase) * 0.2 + 0.8;
          const opacity = baseOpacity * pulse + mouseEffect * 0.3;

          // Градиент для линии
          const gradient = ctx.createLinearGradient(
            this.node1.x,
            this.node1.y,
            this.node2.x,
            this.node2.y
          );

          const color1 = this.node1.color;
          const color2 = this.node2.color;

          gradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${opacity})`);

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = this.strength * 2 + mouseEffect;
          ctx.lineCap = 'round';
          ctx.moveTo(this.node1.x, this.node1.y);
          ctx.lineTo(this.node2.x, this.node2.y);
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
      const nodeCount = Math.min(80, Math.max(30, Math.floor(area / 15000)));

      // Создание узлов с равномерным распределением
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = Math.random() * Math.min(canvas.width, canvas.height) * 0.4;
        const x = canvas.width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 100;
        const y = canvas.height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 100;

        nodes.push(new Node(x, y));
      }

      // Создание соединений между близкими узлами
      for (let i = 0; i < nodes.length; i++) {
        // Соединяем с ближайшими узлами
        const distances = nodes.map((node, j) => ({
          index: j,
          distance: Math.sqrt((nodes[i].x - node.x) ** 2 + (nodes[i].y - node.y) ** 2),
        }));

        // Сортируем по расстоянию
        distances.sort((a, b) => a.distance - b.distance);

        // Соединяем с 3-5 ближайшими узлами
        const connectionCount = 3 + Math.floor(Math.random() * 3);
        for (let j = 1; j < Math.min(connectionCount, distances.length); j++) {
          if (Math.random() < 0.7) {
            // 70% вероятность соединения
            connections.push(new Connection(nodes[i], nodes[distances[j].index]));
          }
        }
      }

      nodesRef.current = nodes;
      connectionsRef.current = connections;
    };

    // Инициализация при первом запуске
    if (nodesRef.current.length === 0) {
      initializeNetwork();
    }

    // Отслеживание мыши
    const handleMouseMove = (e) => {
      if (typeof window === 'undefined' || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    // Обработка касаний на мобильных
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

    // Переменные для FPS контроля
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    // Анимация
    const animate = (currentTime) => {
      if (!ctx || !canvas) return;

      // FPS ограничение
      const deltaTime = currentTime - lastTime;

      if (deltaTime > frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval);

        // Очистка canvas
        ctx.fillStyle = 'rgba(15, 23, 42, 0.98)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Фоновый градиент
        const bgGradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) / 2
        );
        bgGradient.addColorStop(0, 'rgba(30, 41, 59, 0.3)');
        bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const nodes = nodesRef.current;
        const connections = connectionsRef.current;
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;

        // Обновление и отрисовка соединений
        connections.forEach((conn) => {
          conn.update();
          conn.draw(ctx, mouseX, mouseY);
        });

        // Соединения с курсором
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.lineWidth = 1;

        nodes.forEach((node) => {
          const dx = mouseX - node.x;
          const dy = mouseY - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.6;

            const gradient = ctx.createLinearGradient(node.x, node.y, mouseX, mouseY);
            gradient.addColorStop(
              0,
              `rgba(${node.color.r}, ${node.color.g}, ${node.color.b}, ${opacity})`
            );
            gradient.addColorStop(0.5, `rgba(245, 158, 11, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(245, 158, 11, ${opacity * 0.3})`);

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();

            // Небольшое притяжение к курсору
            node.vx += dx * 0.00003;
            node.vy += dy * 0.00003;
          }
        });

        // Обновление и отрисовка узлов
        nodes.forEach((node) => {
          node.update(canvas.width, canvas.height);
          node.draw(ctx, mouseX, mouseY);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Очистка
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
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          zIndex: -1,
        }}
      />
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
        pointerEvents: 'none',
      }}
    />
  );
}
