/**
 * Монитор для отслеживания производительности скролла
 */

import { throttle } from '../utils/mobileHelpers';

export class ScrollMonitor {
  constructor() {
    this.scrollData = [];
    this.lastScrollTime = 0;
    this.scrollStartTime = null;
    this.isMonitoring = false;
    this.frameDrops = 0;
    this.targetFPS = 60;
    
    // Метрики
    this.metrics = {
      totalScrollDistance: 0,
      averageFPS: 0,
      jankyFrames: 0,
      smoothness: 100
    };
    
    // Привязываем обработчики
    this.handleScroll = throttle(this.handleScroll.bind(this), 16);
    this.measureScrollPerformance = this.measureScrollPerformance.bind(this);
  }

  startMonitoring() {
    if (typeof window === 'undefined' || this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.startPerformanceMonitoring();
  }

  stopMonitoring() {
    if (typeof window === 'undefined' || !this.isMonitoring) return;
    
    this.isMonitoring = false;
    window.removeEventListener('scroll', this.handleScroll);
    this.stopPerformanceMonitoring();
  }

  handleScroll() {
    const currentTime = performance.now();
    const currentScrollY = window.scrollY;
    
    if (this.scrollStartTime === null) {
      this.scrollStartTime = currentTime;
    }
    
    const scrollDelta = Math.abs(currentScrollY - this.lastScrollY);
    const timeDelta = currentTime - this.lastScrollTime;
    
    // Записываем данные скролла
    this.scrollData.push({
      timestamp: currentTime,
      position: currentScrollY,
      delta: scrollDelta,
      velocity: timeDelta > 0 ? scrollDelta / timeDelta : 0,
      frameDuration: timeDelta
    });
    
    // Обновляем метрики
    this.metrics.totalScrollDistance += scrollDelta;
    
    // Проверяем на jank (frame drops)
    if (timeDelta > 33) { // Более 2 кадров при 60 FPS
      this.frameDrops++;
      this.metrics.jankyFrames++;
    }
    
    this.lastScrollTime = currentTime;
    this.lastScrollY = currentScrollY;
    
    // Ограничиваем размер массива данных
    if (this.scrollData.length > 1000) {
      this.scrollData.shift();
    }
  }

  startPerformanceMonitoring() {
    let lastTime = performance.now();
    let frames = 0;
    let fps = 0;
    
    const measureFPS = () => {
      if (!this.isMonitoring) return;
      
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        this.updateFPSMetrics(fps);
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  stopPerformanceMonitoring() {
    // Остановка происходит через флаг isMonitoring
  }

  updateFPSMetrics(currentFPS) {
    const samples = this.scrollData.slice(-60); // Последние 60 замеров
    
    if (samples.length > 0) {
      const averageFPS = samples.reduce((sum, data) => {
        const fps = data.frameDuration > 0 ? 1000 / data.frameDuration : 60;
        return sum + Math.min(fps, 60);
      }, 0) / samples.length;
      
      this.metrics.averageFPS = Math.round(averageFPS);
      this.metrics.smoothness = Math.round((averageFPS / this.targetFPS) * 100);
    }
  }

  measureScrollPerformance() {
    const recentData = this.scrollData.slice(-100);
    
    if (recentData.length < 10) {
      return {
        performance: 'insufficient_data',
        fps: 0,
        smoothness: 0
      };
    }
    
    // Анализируем производительность
    const avgFrameDuration = recentData.reduce((sum, data) => sum + data.frameDuration, 0) / recentData.length;
    const estimatedFPS = 1000 / avgFrameDuration;
    
    let performance = 'excellent';
    if (estimatedFPS < 55) performance = 'good';
    if (estimatedFPS < 45) performance = 'fair';
    if (estimatedFPS < 30) performance = 'poor';
    
    return {
      performance,
      fps: Math.round(estimatedFPS),
      smoothness: this.metrics.smoothness,
      jankyFrames: this.metrics.jankyFrames,
      totalDistance: this.metrics.totalScrollDistance
    };
  }

  getReport() {
    const performance = this.measureScrollPerformance();
    
    return {
      ...performance,
      metrics: { ...this.metrics },
      scrollEvents: this.scrollData.length,
      averageVelocity: this.calculateAverageVelocity(),
      maxVelocity: this.calculateMaxVelocity(),
      scrollPattern: this.analyzeScrollPattern()
    };
  }

  calculateAverageVelocity() {
    if (this.scrollData.length === 0) return 0;
    
    const velocities = this.scrollData.map(data => data.velocity);
    return velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
  }

  calculateMaxVelocity() {
    if (this.scrollData.length === 0) return 0;
    
    return Math.max(...this.scrollData.map(data => data.velocity));
  }

  analyzeScrollPattern() {
    const recentData = this.scrollData.slice(-50);
    
    if (recentData.length < 10) return 'unknown';
    
    // Анализируем паттерн скролла
    const velocities = recentData.map(data => data.velocity);
    const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
    const maxVelocity = Math.max(...velocities);
    
    if (maxVelocity > avgVelocity * 3) return 'quick_flicks';
    if (avgVelocity < 0.5) return 'slow_browsing';
    if (this.metrics.jankyFrames > recentData.length * 0.1) return 'janky';
    
    return 'smooth_scrolling';
  }

  reset() {
    this.scrollData = [];
    this.lastScrollTime = 0;
    this.scrollStartTime = null;
    this.frameDrops = 0;
    this.metrics = {
      totalScrollDistance: 0,
      averageFPS: 0,
      jankyFrames: 0,
      smoothness: 100
    };
  }
}