/**
 * Монитор производительности для тестов
 */

import { performanceUtils } from './performanceUtils';

class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.isMonitoring = false;
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.metrics = [];
    
    // Начинаем сбор метрик
    this.collectMetrics();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  async collectMetrics() {
    while (this.isMonitoring) {
      const metrics = {
        timestamp: Date.now(),
        fps: await performanceUtils.measureFPS(500),
        memory: performanceUtils.getMemoryUsage(),
        resourceCount: performance.getEntriesByType('resource').length
      };
      
      this.metrics.push(metrics);
      
      // Ограничиваем размер массива метрик
      if (this.metrics.length > 100) {
        this.metrics.shift();
      }
      
      // Собираем метрики каждую секунду
      await this.sleep(1000);
    }
  }

  getMetrics() {
    return {
      current: this.getCurrentMetrics(),
      average: this.getAverageMetrics(),
      peak: this.getPeakMetrics()
    };
  }

  getCurrentMetrics() {
    if (this.metrics.length === 0) return null;
    
    return this.metrics[this.metrics.length - 1];
  }

  getAverageMetrics() {
    if (this.metrics.length === 0) return null;
    
    const avgFps = this.metrics.reduce((sum, m) => sum + m.fps, 0) / this.metrics.length;
    
    const memoryMetrics = this.metrics
      .filter(m => m.memory)
      .map(m => m.memory.usedJSHeapSize);
    
    const avgMemory = memoryMetrics.length > 0
      ? memoryMetrics.reduce((sum, m) => sum + m, 0) / memoryMetrics.length
      : null;
    
    return {
      fps: Math.round(avgFps),
      memory: avgMemory ? Math.round(avgMemory) : null
    };
  }

  getPeakMetrics() {
    if (this.metrics.length === 0) return null;
    
    const maxFps = Math.max(...this.metrics.map(m => m.fps));
    const minFps = Math.min(...this.metrics.map(m => m.fps));
    
    const memoryValues = this.metrics
      .filter(m => m.memory)
      .map(m => m.memory.usedJSHeapSize);
    
    const maxMemory = memoryValues.length > 0 ? Math.max(...memoryValues) : null;
    
    return {
      maxFps,
      minFps,
      maxMemory: maxMemory ? Math.round(maxMemory) : null
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const performanceMonitor = new PerformanceMonitor();