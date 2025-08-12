// Улучшенный анимированный фон нейросети с WebGL эффектами
'use client';
import { useEffect, useRef, useState } from 'react';

function NeuralNetworkBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [nodeCount, setNodeCount] = useState(100);
  const [connectionStrength, setConnectionStrength] = useState(0.7);

  // WebGL шейдеры для красивых эффектов
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec4 a_color;
    uniform vec2 u_resolution;
    uniform float u_time;
    varying vec4 v_color;
    
    void main() {
      vec2 position = a_position;
      
      // Добавляем пульсацию
      float pulse = sin(u_time * 0.003 + position.x * 0.01) * 0.5;
      position.x += pulse * 10.0;
      position.y += sin(u_time * 0.002 + position.y * 0.008) * 8.0;
      
      vec2 zeroToOne = position / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;
      
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      gl_PointSize = 3.0 + sin(u_time * 0.005 + position.x * 0.01) * 2.0;
      v_color = a_color;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform float u_time;
    varying vec4 v_color;
    
    void main() {
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      
      if (dist > 0.5) {
        discard;
      }
      
      float alpha = 1.0 - dist * 2.0;
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Добавляем мерцание
      float flicker = sin(u_time * 0.01) * 0.3 + 0.7;
      
      vec3 color = v_color.rgb * glow * flicker;
      gl_FragColor = vec4(color, alpha * v_color.a);
    }
  `;

  // Canvas 2D fallback для устройств без WebGL
  class Node {
    constructor(canvas) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 3 + 1;
      this.connections = [];
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(canvas, time) {
      this.x += this.vx;
      this.y += this.vy;

      // Отражение от границ
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Ограничиваем позицию
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));

      // Пульсация
      this.currentSize = this.size + Math.sin(time * 0.005 + this.pulsePhase) * 1.5;
    }

    draw(ctx, time) {
      if (!ctx) return;
      
      const opacity = 0.6 + Math.sin(time * 0.003 + this.pulsePhase) * 0.3;
      
      // Градиентное свечение
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.currentSize * 3
      );
      gradient.addColorStop(0, `rgba(125, 211, 252, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 0.7})`);
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Центральная точка
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Connection {
    constructor(node1, node2) {
      this.node1 = node1;
      this.node2 = node2;
      this.strength = Math.random();
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    draw(ctx, time) {
      if (!ctx) return;
      
      const distance = Math.sqrt(
        Math.pow(this.node2.x - this.node1.x, 2) + 
        Math.pow(this.node2.y - this.node1.y, 2)
      );

      if (distance < 150) {
        const opacity = (150 - distance) / 150 * connectionStrength;
        const pulse = Math.sin(time * 0.002 + this.pulsePhase) * 0.3 + 0.7;
        
        // Анимированная линия
        const gradient = ctx.createLinearGradient(
          this.node1.x, this.node1.y,
          this.node2.x, this.node2.y
        );
        gradient.addColorStop(0, `rgba(125, 211, 252, ${opacity * pulse})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * pulse * 0.8})`);
        gradient.addColorStop(1, `rgba(125, 211, 252, ${opacity * pulse})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + pulse * 0.5;
        ctx.beginPath();
        ctx.moveTo(this.node1.x, this.node1.y);
        ctx.lineTo(this.node2.x, this.node2.y);
        ctx.stroke();

        // Энергетические импульсы
        if (Math.random() < 0.005) {
          const progress = Math.random();
          const pulseX = this.node1.x + (this.node2.x - this.node1.x) * progress;
          const pulseY = this.node1.y + (this.node2.y - this.node1.y) * progress;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 2})`;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // WebGL функции
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  }

  function initWebGL() {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return null;
      }

      // Создаем шейдеры
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      
      if (!vertexShader || !fragmentShader) {
        setWebglSupported(false);
        return null;
      }

      const program = createProgram(gl, vertexShader, fragmentShader);
      if (!program) {
        setWebglSupported(false);
        return null;
      }

      return { gl, program };
    } catch (error) {
      console.error('WebGL initialization failed:', error);
      setWebglSupported(false);
      return null;
    }
  }

  // Canvas 2D анимация
  function animate2D() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Canvas 2D context not available');
      return;
    }
    
    const nodes = [];
    const connections = [];

    // Создаем узлы
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(canvas));
    }

    // Создаем соединения
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < 0.1) {
          connections.push(new Connection(nodes[i], nodes[j]));
        }
      }
    }

    let startTime = Date.now();

    function render() {
      if (!ctx) return;
      
      const currentTime = Date.now();
      const time = currentTime - startTime;

      // Очищаем канвас с fade эффектом
      ctx.fillStyle = 'rgba(3, 16, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Обновляем и рисуем узлы
      nodes.forEach(node => {
        node.update(canvas, time);
        node.draw(ctx, time);
      });

      // Рисуем соединения
      connections.forEach(connection => {
        connection.draw(ctx, time);
      });

      animationRef.current = requestAnimationFrame(render);
    }

    render();
  }

  // WebGL анимация
  function animateWebGL(webgl) {
    const { gl, program } = webgl;
    const canvas = canvasRef.current;

    // Получаем расположения атрибутов и униформов
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    // Создаем буферы
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    // Генерируем данные для узлов
    const positions = [];
    const colors = [];

    for (let i = 0; i < nodeCount; i++) {
      positions.push(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      
      colors.push(
        0.49 + Math.random() * 0.2, // R
        0.83 + Math.random() * 0.1, // G
        0.99,                       // B
        0.7 + Math.random() * 0.3   // A
      );
    }

    let startTime = Date.now();

    function render() {
      const currentTime = Date.now();
      const time = currentTime - startTime;

      // Настраиваем WebGL
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.012, 0.063, 0.102, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Устанавливаем униформы
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);

      // Настраиваем атрибуты
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(colorLocation);
      gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

      // Включаем блендинг для прозрачности
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Рисуем точки
      gl.drawArrays(gl.POINTS, 0, nodeCount);

      animationRef.current = requestAnimationFrame(render);
    }

    render();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Пробуем WebGL, иначе Canvas 2D
    const webgl = initWebGL();
    if (webgl && webglSupported) {
      animateWebGL(webgl);
    } else {
      animate2D();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodeCount, connectionStrength, webglSupported]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="neural-background"
      />
      
      {/* Контролы для настройки */}
      <div className="neural-controls">
        <div className="control-group">
          <label>Узлы: {nodeCount}</label>
          <input
            type="range"
            min="50"
            max="200"
            value={nodeCount}
            onChange={(e) => setNodeCount(parseInt(e.target.value))}
          />
        </div>
        
        <div className="control-group">
          <label>Связи: {Math.round(connectionStrength * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={connectionStrength}
            onChange={(e) => setConnectionStrength(parseFloat(e.target.value))}
          />
        </div>
        
        <div className="tech-indicator">
          {webglSupported ? '⚡ WebGL' : '🎨 Canvas 2D'}
        </div>
      </div>

      <style jsx>{`
        .neural-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          background: linear-gradient(135deg, #03101a 0%, #051e2a 50%, #0a2332 100%);
        }
        
        .neural-controls {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(3, 16, 26, 0.9);
          border: 1px solid rgba(125, 211, 252, 0.3);
          border-radius: 12px;
          padding: 16px;
          backdrop-filter: blur(10px);
          z-index: 100;
          min-width: 200px;
          transition: all 0.3s ease;
        }
        
        .neural-controls:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 20px rgba(125, 211, 252, 0.2);
        }
        
        .control-group {
          margin-bottom: 12px;
        }
        
        .control-group:last-of-type {
          margin-bottom: 0;
        }
        
        .control-group label {
          display: block;
          color: var(--text);
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        .control-group input[type="range"] {
          width: 100%;
          height: 4px;
          background: rgba(125, 211, 252, 0.2);
          border-radius: 2px;
          outline: none;
          -webkit-appearance: none;
        }
        
        .control-group input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--accent);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .control-group input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(125, 211, 252, 0.5);
        }
        
        .control-group input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: var(--accent);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
        
        .tech-indicator {
          color: var(--accent);
          font-size: 11px;
          text-align: center;
          margin-top: 8px;
          padding: 4px 8px;
          background: rgba(125, 211, 252, 0.1);
          border-radius: 6px;
        }
        
        @media (max-width: 768px) {
          .neural-controls {
            top: 10px;
            right: 10px;
            left: 10px;
            min-width: unset;
          }
        }
        
        @media (max-width: 480px) {
          .neural-controls {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default NeuralNetworkBackground;
