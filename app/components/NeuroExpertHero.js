'use client';

import { useEffect, useRef } from 'react';

export default function NeuroExpertHero() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    // УЛЬТРА анимация заголовка
    const animateTitle = () => {
      const title = document.getElementById('animated-main-header');
      if (title) {
        const text = title.textContent;
        title.innerHTML = '';
        
        // Создаем 3D эффект для каждой буквы с матричными символами
        text.split('').forEach((char, i) => {
          const wrapper = document.createElement('span');
          wrapper.className = 'letter-wrapper';
          wrapper.style.cssText = `
            display: inline-block;
            position: relative;
            transform-style: preserve-3d;
            animation-delay: ${i * 50}ms;
          `;
          
          // Основная буква
          const letter = document.createElement('span');
          letter.className = 'letter-3d';
          letter.textContent = char;
          letter.style.cssText = `
            display: inline-block;
            position: relative;
          `;
          
          // Голографические слои
          for (let j = 0; j < 3; j++) {
            const layer = document.createElement('span');
            layer.className = `hologram-layer layer-${j}`;
            layer.textContent = char;
            layer.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              opacity: ${0.3 - j * 0.1};
              transform: translateZ(${-10 * (j + 1)}px);
              filter: hue-rotate(${j * 60}deg);
            `;
            wrapper.appendChild(layer);
          }
          
          wrapper.appendChild(letter);
          title.appendChild(wrapper);
        });
      }
    };

    setTimeout(animateTitle, 100);

    // ЭКСТРЕМАЛЬНАЯ НЕЙРОСЕТЬ
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

    // ПАРАМЕТРЫ ЭКСТРЕМАЛЬНОЙ ВИЗУАЛИЗАЦИИ
    const config = {
      nodeCount: width > 768 ? 200 : 100,
      nodeSize: 3,
      connectionDistance: 250,
      mouseRadius: 400,
      baseSpeed: 0.4,
      pulseSpeed: 0.025,
      glowIntensity: 2,
      particleTrails: true,
      electricArcs: true,
      quantumTunneling: true,
      waveFunction: true,
      dataStreams: true,
      blackHoles: width > 768 ? 3 : 1
    };

    const nodes = [];
    const electricArcs = [];
    const particles = [];
    const dataStreams = [];
    const blackHoles = [];
    const connections = new Map();
    const quantumPairs = new Map();

    // ГИПЕРУЗЕЛ с квантовыми свойствами
    class HyperNode {
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
        this.type = Math.random() < 0.15 ? 'quantum' : Math.random() < 0.3 ? 'core' : 'normal';
        this.connections = [];
        this.hue = this.type === 'quantum' ? 280 : this.type === 'core' ? 180 : 200 + Math.random() * 60;
        this.brightness = 0.5 + Math.random() * 0.5;
        this.trail = [];
        this.quantumState = Math.random() > 0.5 ? 1 : -1;
        this.frequency = 0.001 + Math.random() * 0.005;
        this.amplitude = 10 + Math.random() * 20;
        this.dataPackets = [];
      }

      update(mouseX, mouseY, time) {
        // Квантовое движение с волновой функцией
        if (config.waveFunction) {
          const wave = Math.sin(time * this.frequency) * this.amplitude;
          const waveX = Math.cos(this.pulse) * wave;
          const waveY = Math.sin(this.pulse) * wave;
          this.x = this.baseX + waveX;
          this.y = this.baseY + waveY;
        }

        // Базовое движение
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Гравитация черных дыр
        blackHoles.forEach(hole => {
          const dx = hole.x - this.baseX;
          const dy = hole.y - this.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < hole.radius * 3) {
            const force = hole.mass / (distance * distance) * 0.5;
            this.vx += dx * force * 0.01;
            this.vy += dy * force * 0.01;
            
            // Спагеттификация около черной дыры
            if (distance < hole.radius) {
              this.radius *= 0.95;
              this.energy *= 1.1;
            }
          }
        });

        // Отталкивание от краев с искривлением пространства
        const edgeForce = 50;
        if (this.baseX < edgeForce) {
          this.vx += (edgeForce - this.baseX) * 0.01;
        }
        if (this.baseX > width - edgeForce) {
          this.vx -= (this.baseX - (width - edgeForce)) * 0.01;
        }
        if (this.baseY < edgeForce) {
          this.vy += (edgeForce - this.baseY) * 0.01;
        }
        if (this.baseY > height - edgeForce) {
          this.vy -= (this.baseY - (height - edgeForce)) * 0.01;
        }

        // Магнитное притяжение к мыши с квантовыми флуктуациями
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.mouseRadius) {
          const force = (1 - distance / config.mouseRadius) * 0.15;
          const quantumNoise = (Math.random() - 0.5) * 0.1;
          this.vx += dx * force * 0.01 + quantumNoise;
          this.vy += dy * force * 0.01 + quantumNoise;
          
          // Генерация частиц при взаимодействии
          if (Math.random() < 0.02) {
            particles.push(new Particle(this.x, this.y, this.hue));
          }
        }

        // Ограничение скорости с релятивистскими эффектами
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 3;
        if (speed > maxSpeed) {
          const relativistic = 1 / Math.sqrt(1 + (speed / maxSpeed) ** 2);
          this.vx = (this.vx / speed) * maxSpeed * relativistic;
          this.vy = (this.vy / speed) * maxSpeed * relativistic;
        }

        // Пульсация энергии с квантовыми скачками
        this.pulse += config.pulseSpeed * (1 + this.quantumState * 0.5);
        this.energy = 0.5 + Math.sin(this.pulse) * 0.3 + Math.random() * 0.2;
        
        // Квантовое туннелирование
        if (config.quantumTunneling && Math.random() < 0.0001) {
          this.baseX = Math.random() * width;
          this.baseY = Math.random() * height;
          this.quantumState *= -1;
        }
        
        // След частицы с данными
        if (config.particleTrails && Math.random() < 0.15) {
          this.trail.push({ 
            x: this.x, 
            y: this.y, 
            life: 1,
            data: Math.random() > 0.8
          });
        }
        
        this.trail = this.trail.filter(point => {
          point.life -= 0.015;
          return point.life > 0;
        });

        // Генерация потоков данных
        if (config.dataStreams && this.type === 'quantum' && Math.random() < 0.01) {
          this.connections.forEach(targetId => {
            const target = nodes.find(n => n === targetId);
            if (target) {
              dataStreams.push(new DataStream(this, target));
            }
          });
        }
      }

      draw() {
        // Рисуем след с эффектом данных
        if (this.trail.length > 0) {
          ctx.save();
          this.trail.forEach((point, i) => {
            const opacity = point.life * 0.3;
            if (point.data) {
              // Бинарные данные
              ctx.fillStyle = `hsla(120, 100%, 50%, ${opacity})`;
              ctx.font = '10px monospace';
              ctx.fillText(Math.random() > 0.5 ? '1' : '0', point.x, point.y);
            } else {
              ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${opacity})`;
              ctx.beginPath();
              ctx.arc(point.x, point.y, 1 + i * 0.1, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          ctx.restore();
        }

        // МЕГА СВЕЧЕНИЕ с квантовыми эффектами
        const glowSize = this.radius * (this.type === 'quantum' ? 40 : this.type === 'core' ? 30 : 20) * this.energy;
        
        // Квантовое поле
        if (this.type === 'quantum') {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          for (let i = 0; i < 3; i++) {
            const fieldSize = glowSize * (2 + i);
            const field = ctx.createRadialGradient(
              this.x, this.y, 0,
              this.x, this.y, fieldSize
            );
            field.addColorStop(0, `hsla(${this.hue + i * 30}, 100%, 50%, ${0.05 * this.energy})`);
            field.addColorStop(0.5, `hsla(${this.hue + i * 30}, 80%, 40%, ${0.02 * this.energy})`);
            field.addColorStop(1, 'transparent');
            
            ctx.fillStyle = field;
            ctx.beginPath();
            ctx.arc(this.x, this.y, fieldSize, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        
        // Внешнее свечение с искажением
        const outerGlow = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowSize
        );
        outerGlow.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${0.15 * this.energy})`);
        outerGlow.addColorStop(0.3, `hsla(${this.hue}, 90%, 45%, ${0.08 * this.energy})`);
        outerGlow.addColorStop(0.7, `hsla(${this.hue}, 80%, 40%, ${0.03 * this.energy})`);
        outerGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = outerGlow;
        ctx.fillRect(this.x - glowSize, this.y - glowSize, glowSize * 2, glowSize * 2);

        // Энергетические кольца
        if (this.type === 'core' || this.type === 'quantum') {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < 5; i++) {
            const ringRadius = this.radius * (5 + i * 3) * (1 + Math.sin(this.pulse + i) * 0.2);
            ctx.strokeStyle = `hsla(${this.hue + i * 20}, 100%, 70%, ${0.3 * this.energy / (i + 1)})`;
            ctx.lineWidth = 2 - i * 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Вращающиеся точки на кольцах
            if (this.type === 'quantum') {
              for (let j = 0; j < 6; j++) {
                const angle = (this.pulse * 2 + j * Math.PI / 3) * (i % 2 ? 1 : -1);
                const px = this.x + Math.cos(angle) * ringRadius;
                const py = this.y + Math.sin(angle) * ringRadius;
                
                ctx.fillStyle = `hsla(${this.hue + i * 20}, 100%, 80%, ${0.8 * this.energy})`;
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
          ctx.restore();
        }

        // Центральное ядро с плазмой
        const plasmaGradient = ctx.createRadialGradient(
          this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
          this.x, this.y, this.radius * 4
        );
        plasmaGradient.addColorStop(0, `hsla(0, 0%, 100%, ${this.brightness})`);
        plasmaGradient.addColorStop(0.2, `hsla(${this.hue - 20}, 100%, 80%, ${this.brightness})`);
        plasmaGradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 70%, ${this.brightness})`);
        plasmaGradient.addColorStop(1, `hsla(${this.hue + 20}, 100%, 50%, ${this.brightness * 0.5})`);
        
        ctx.fillStyle = plasmaGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Белое ядро с коронарным выбросом
        ctx.fillStyle = `hsla(0, 0%, 100%, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Корона для квантовых узлов
        if (this.type === 'quantum') {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          for (let i = 0; i < 8; i++) {
            const angle = this.pulse * 3 + i * Math.PI / 4;
            const coronaLength = this.radius * 10 * this.energy;
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, ${0.3 * this.energy})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
              this.x + Math.cos(angle) * coronaLength,
              this.y + Math.sin(angle) * coronaLength
            );
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    }

    // ПЛАЗМЕННЫЕ ЭЛЕКТРИЧЕСКИЕ ДУГИ
    class PlasmaArc {
      constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.life = 0.5 + Math.random() * 0.5;
        this.segments = 12;
        this.amplitude = 30;
        this.frequency = 0.1 + Math.random() * 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.thickness = 1 + Math.random() * 3;
        this.branches = [];
        
        // Создаем ответвления
        for (let i = 0; i < 3; i++) {
          this.branches.push({
            start: 0.2 + Math.random() * 0.6,
            angle: (Math.random() - 0.5) * Math.PI,
            length: 0.3 + Math.random() * 0.4
          });
        }
      }

      update(time) {
        this.life -= 0.015;
        this.phase += this.frequency;
      }

      draw() {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        // Основная дуга
        const gradient = ctx.createLinearGradient(
          this.node1.x, this.node1.y,
          this.node2.x, this.node2.y
        );
        gradient.addColorStop(0, `hsla(${this.node1.hue}, 100%, 70%, ${this.life})`);
        gradient.addColorStop(0.5, `hsla(190, 100%, 80%, ${this.life})`);
        gradient.addColorStop(1, `hsla(${this.node2.hue}, 100%, 70%, ${this.life})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness * this.life;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(190, 100%, 70%, ${this.life})`;

        ctx.beginPath();
        ctx.moveTo(this.node1.x, this.node1.y);

        const dx = this.node2.x - this.node1.x;
        const dy = this.node2.y - this.node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Рисуем основную молнию
        let lastX = this.node1.x;
        let lastY = this.node1.y;

        for (let i = 1; i <= this.segments; i++) {
          const t = i / this.segments;
          const offset = Math.sin(t * Math.PI + this.phase) * this.amplitude * (Math.random() - 0.5);
          const perpX = -dy / distance;
          const perpY = dx / distance;
          
          const x = this.node1.x + dx * t + perpX * offset;
          const y = this.node1.y + dy * t + perpY * offset;
          
          ctx.lineTo(x, y);
          
          // Рисуем ответвления
          this.branches.forEach(branch => {
            if (Math.abs(t - branch.start) < 0.05) {
              ctx.moveTo(x, y);
              const branchEndX = x + Math.cos(branch.angle) * distance * branch.length * 0.3;
              const branchEndY = y + Math.sin(branch.angle) * distance * branch.length * 0.3;
              ctx.lineTo(branchEndX, branchEndY);
              ctx.moveTo(x, y);
            }
          });
          
          lastX = x;
          lastY = y;
        }

        ctx.stroke();
        ctx.restore();
      }
    }

    // ЧАСТИЦА
    class Particle {
      constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.life = 1;
        this.hue = hue;
        this.size = 1 + Math.random() * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // гравитация
        this.life -= 0.02;
        this.vx *= 0.98; // трение
      }

      draw() {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ПОТОК ДАННЫХ
    class DataStream {
      constructor(source, target) {
        this.source = source;
        this.target = target;
        this.progress = 0;
        this.speed = 0.02 + Math.random() * 0.03;
        this.data = Array(10).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('');
      }

      update() {
        this.progress += this.speed;
      }

      draw() {
        if (this.progress >= 1) return;
        
        const x = this.source.x + (this.target.x - this.source.x) * this.progress;
        const y = this.source.y + (this.target.y - this.source.y) * this.progress;
        
        ctx.save();
        ctx.font = '12px monospace';
        ctx.fillStyle = `hsla(120, 100%, 50%, ${1 - this.progress})`;
        ctx.fillText(this.data, x, y);
        
        // След данных
        ctx.globalCompositeOperation = 'screen';
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, `hsla(120, 100%, 50%, ${0.5 * (1 - this.progress)})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - 20, y - 20, 40, 40);
        ctx.restore();
      }
    }

    // ЧЕРНАЯ ДЫРА
    class BlackHole {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 30 + Math.random() * 20;
        this.mass = 5 + Math.random() * 5;
        this.rotation = 0;
        this.accretionDisk = [];
        
        // Создаем аккреционный диск
        for (let i = 0; i < 50; i++) {
          this.accretionDisk.push({
            angle: Math.random() * Math.PI * 2,
            radius: this.radius + Math.random() * this.radius * 2,
            speed: 0.01 + Math.random() * 0.02,
            size: 1 + Math.random() * 2
          });
        }
      }

      update() {
        this.rotation += 0.005;
        
        // Обновляем аккреционный диск
        this.accretionDisk.forEach(particle => {
          particle.angle += particle.speed;
          particle.radius *= 0.995; // Спиральное падение
          
          if (particle.radius < this.radius) {
            particle.radius = this.radius + Math.random() * this.radius * 2;
            particle.angle = Math.random() * Math.PI * 2;
          }
        });
      }

      draw() {
        ctx.save();
        
        // Гравитационное искажение
        ctx.globalCompositeOperation = 'multiply';
        const distortion = ctx.createRadialGradient(
          this.x, this.y, this.radius,
          this.x, this.y, this.radius * 4
        );
        distortion.addColorStop(0, 'rgba(0, 0, 0, 1)');
        distortion.addColorStop(0.5, 'rgba(20, 0, 40, 0.8)');
        distortion.addColorStop(1, 'rgba(40, 0, 80, 0)');
        
        ctx.fillStyle = distortion;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Аккреционный диск
        ctx.globalCompositeOperation = 'screen';
        this.accretionDisk.forEach(particle => {
          const x = this.x + Math.cos(particle.angle + this.rotation) * particle.radius;
          const y = this.y + Math.sin(particle.angle + this.rotation) * particle.radius * 0.3; // Сплющенный диск
          
          const heat = 1 - (particle.radius - this.radius) / (this.radius * 2);
          const hue = 60 - heat * 60; // От желтого к красному
          
          ctx.fillStyle = `hsla(${hue}, 100%, ${50 + heat * 30}%, ${heat})`;
          ctx.beginPath();
          ctx.arc(x, y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Горизонт событий
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Создаем узлы
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(new HyperNode(
        Math.random() * width,
        Math.random() * height
      ));
    }

    // Создаем черные дыры
    for (let i = 0; i < config.blackHoles; i++) {
      blackHoles.push(new BlackHole(
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

    // Отслеживание касания для мобильных
    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    // ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ
    function animate() {
      timeRef.current += 0.01;
      
      // Очистка с эффектом следа
      ctx.fillStyle = 'rgba(10, 5, 26, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Обновляем черные дыры
      blackHoles.forEach(hole => hole.update());

      // Обновляем и находим соединения
      connections.clear();
      quantumPairs.clear();
      
      nodes.forEach((node, i) => {
        node.update(mouseRef.current.x, mouseRef.current.y, timeRef.current);
        
        // Поиск ближайших узлов для соединений
        nodes.slice(i + 1).forEach(other => {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.connectionDistance) {
            const strength = 1 - distance / config.connectionDistance;
            connections.set(`${i}-${nodes.indexOf(other)}`, { node, other, strength, distance });
            
            // Создаем плазменные дуги между квантовыми узлами
            if (config.electricArcs && node.type === 'quantum' && other.type === 'quantum' && Math.random() < 0.002 && electricArcs.length < 10) {
              electricArcs.push(new PlasmaArc(node, other));
            }
            
            // Квантовая запутанность
            if (node.type === 'quantum' && other.type === 'quantum' && distance < 100) {
              quantumPairs.set(`${i}-${nodes.indexOf(other)}`, { node, other });
            }
          }
        });
      });

      // Рисуем черные дыры (первыми для правильного наложения)
      blackHoles.forEach(hole => hole.draw());

      // Рисуем соединения с градиентами
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      
      connections.forEach(({ node, other, strength, distance }) => {
        // Обычные соединения
        const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
        gradient.addColorStop(0, `hsla(${node.hue}, 100%, 50%, ${strength * 0.3})`);
        gradient.addColorStop(0.5, `hsla(${(node.hue + other.hue) / 2}, 100%, 60%, ${strength * 0.5})`);
        gradient.addColorStop(1, `hsla(${other.hue}, 100%, 50%, ${strength * 0.3})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(0.5, strength * 3);
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        
        // Изгиб линии для эффекта гравитации
        const midX = (node.x + other.x) / 2;
        const midY = (node.y + other.y) / 2;
        const curve = Math.sin(timeRef.current + distance * 0.01) * 20;
        
        ctx.quadraticCurveTo(
          midX + curve,
          midY + curve,
          other.x,
          other.y
        );
        ctx.stroke();
      });
      
      // Рисуем квантовую запутанность
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.setLineDash([5, 5]);
      quantumPairs.forEach(({ node, other }) => {
        ctx.strokeStyle = `hsla(280, 100%, 70%, 0.5)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.restore();
      
      ctx.restore();

      // Рисуем электрические дуги
      electricArcs.forEach((arc, index) => {
        arc.update(timeRef.current);
        arc.draw();
        if (arc.life <= 0) {
          electricArcs.splice(index, 1);
        }
      });

      // Обновляем и рисуем частицы
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.life <= 0 || particle.y > height) {
          particles.splice(index, 1);
        }
      });

      // Обновляем и рисуем потоки данных
      dataStreams.forEach((stream, index) => {
        stream.update();
        stream.draw();
        if (stream.progress >= 1) {
          dataStreams.splice(index, 1);
        }
      });

      // Рисуем узлы
      nodes.forEach(node => node.draw());

      // Эффект сканирования
      if (width > 768) {
        const scanY = (timeRef.current * 100) % height;
        const scanGradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
        scanGradient.addColorStop(0, 'transparent');
        scanGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
        scanGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = scanGradient;
        ctx.fillRect(0, scanY - 50, width, 100);
      }

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
      
      // Адаптируем количество элементов
      config.nodeCount = width > 768 ? 200 : 100;
      config.blackHoles = width > 768 ? 3 : 1;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
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
          opacity: 1;
          animation: slideInTop 1s 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
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
          animation: letterFloat 4s ease-in-out infinite;
          animation-delay: var(--delay);
          transform-style: preserve-3d;
        }

        .letter-3d {
          background: linear-gradient(135deg, #00FFFF, #6366F1, #A855F7, #FF00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 
            0 0 40px rgba(0, 255, 255, 0.8),
            0 0 80px rgba(99, 102, 241, 0.6),
            0 0 120px rgba(168, 85, 247, 0.4),
            0 0 160px rgba(255, 0, 255, 0.3);
          filter: brightness(1.5) contrast(1.2);
          animation: letterGlow 2s ease-in-out infinite alternate;
        }

        .hologram-layer {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          background: linear-gradient(135deg, #00FFFF, #FF00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: hologramShift 3s ease-in-out infinite;
        }

        @keyframes letterFloat {
          0%, 100% {
            transform: translateY(0) rotateX(0) rotateY(0) translateZ(0);
          }
          25% {
            transform: translateY(-15px) rotateX(15deg) rotateY(-15deg) translateZ(20px);
          }
          50% {
            transform: translateY(-5px) rotateX(-10deg) rotateY(10deg) translateZ(10px);
          }
          75% {
            transform: translateY(10px) rotateX(5deg) rotateY(5deg) translateZ(5px);
          }
        }

        @keyframes letterGlow {
          from {
            filter: brightness(1.5) contrast(1.2) hue-rotate(0deg);
          }
          to {
            filter: brightness(2.2) contrast(1.5) hue-rotate(30deg);
          }
        }

        @keyframes hologramShift {
          0%, 100% {
            transform: translateZ(-10px) rotateY(5deg);
            opacity: 0.3;
          }
          50% {
            transform: translateZ(-20px) rotateY(-5deg);
            opacity: 0.1;
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
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(90deg, #00FFFF, #6366F1, #A855F7, #FF00FF, #00FFFF);
          background-size: 400% 400%;
          border-radius: 60px;
          z-index: -1;
          animation: gradientRotate 3s linear infinite;
          opacity: 1;
          filter: blur(3px);
        }

        .cta-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 5, 26, 0.9);
          border-radius: 56px;
          z-index: -1;
          transition: all 0.4s ease;
        }

        .cta-button span {
          position: relative;
          z-index: 1;
          background: linear-gradient(90deg, #00FFFF, #FFFFFF, #FF00FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: brightness(1.3);
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .cta-button:hover {
          transform: translateY(-8px) scale(1.1) rotateZ(2deg);
          filter: brightness(1.4);
          box-shadow: 
            0 15px 50px rgba(0, 255, 255, 0.4),
            0 25px 70px rgba(168, 85, 247, 0.3),
            0 35px 90px rgba(255, 0, 255, 0.2);
        }

        .cta-button:hover::after {
          background: rgba(10, 5, 26, 0.4);
        }

        .cta-button:hover::before {
          background-size: 600% 600%;
          filter: brightness(1.8) blur(5px);
          animation-duration: 1s;
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
              0 0 80px rgba(99, 102, 241, 0.6),
              0 0 120px rgba(255, 0, 255, 0.4);
          }
          20% {
            text-shadow: 
              3px 3px 40px rgba(255, 0, 255, 0.8),
              -3px -3px 80px rgba(0, 255, 255, 0.6),
              0 0 120px rgba(255, 255, 0, 0.4);
          }
          40% {
            text-shadow: 
              -3px 3px 40px rgba(0, 255, 255, 0.8),
              3px -3px 80px rgba(255, 255, 0, 0.6),
              0 0 120px rgba(255, 0, 255, 0.4);
          }
        }

        .main-header:hover .letter-3d {
          animation: glitch 0.2s ease-in-out infinite;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .hero-content {
            padding: 30px 15px;
            gap: 25px;
            min-height: 100vh;
            justify-content: center;
          }

          .pre-header {
            font-size: 12px;
            margin-bottom: 30px;
            letter-spacing: 0.3em;
          }

          .main-header {
            font-size: clamp(50px, 12vw, 80px);
            margin-bottom: 40px;
            letter-spacing: 0.02em;
          }

          .sub-header {
            font-size: clamp(18px, 5vw, 24px);
            margin-bottom: 25px;
            letter-spacing: 0.1em;
            line-height: 1.3;
          }

          .cta-button {
            padding: 16px 40px;
            font-size: 16px;
            letter-spacing: 0.15em;
          }
          
          .cta-button::before {
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
          }

          .description {
            font-size: 16px;
            margin-bottom: 40px;
            line-height: 1.6;
            padding: 0 10px;
          }

          /* Упрощаем анимации для производительности */
          .letter-wrapper {
            animation-duration: 5s;
          }
          
          .hologram-layer {
            display: none; /* Убираем голограммы на мобильных */
          }
        }
        
        @media (max-width: 480px) {
          .main-header {
            font-size: clamp(40px, 13vw, 60px);
          }
          
          .sub-header {
            font-size: 16px;
          }
          
          .description {
            font-size: 14px;
          }
          
          .cta-button {
            padding: 14px 35px;
            font-size: 14px;
          }
        }

        /* Оптимизация для высоких экранов */
        @media (min-height: 900px) {
          .hero-content {
            gap: 50px;
          }
          
          .main-header {
            margin-bottom: 80px;
          }
        }
        
        /* Ландшафтная ориентация на мобильных */
        @media (max-height: 600px) and (orientation: landscape) {
          .hero-content {
            min-height: auto;
            padding: 20px;
          }
          
          .pre-header {
            margin-bottom: 20px;
          }
          
          .main-header {
            font-size: 60px;
            margin-bottom: 30px;
          }
          
          .description {
            margin-bottom: 30px;
          }
        }
      `}</style>

      <section className="hero-section">
        <canvas ref={canvasRef} className="neural-canvas" />
        <div className="hero-content">
          <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
          <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
          <h2 className="sub-header">ЦИФРОВИЗАЦИЯ БИЗНЕСА С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ</h2>
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