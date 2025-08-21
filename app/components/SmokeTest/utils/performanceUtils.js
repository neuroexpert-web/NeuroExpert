/**
 * Утилиты для измерения производительности
 */

export const performanceUtils = {
  /**
   * Получение времени загрузки страницы
   */
  getPageLoadTime() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      return Math.round(navigation.loadEventEnd - navigation.fetchStart);
    }
    
    // Fallback для старых браузеров
    return Math.round(performance.timing.loadEventEnd - performance.timing.fetchStart);
  },

  /**
   * Измерение FPS
   */
  async measureFPS(duration = 1000) {
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    
    return new Promise((resolve) => {
      const countFrames = (currentTime) => {
        frameCount++;
        
        if (currentTime - lastTime >= duration) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          resolve(fps);
        } else {
          requestAnimationFrame(countFrames);
        }
      };
      
      requestAnimationFrame(countFrames);
    });
  },

  /**
   * Получение метрик производительности
   */
  getPerformanceMetrics() {
    const metrics = {
      // Время до первого байта
      ttfb: this.getTimeToFirstByte(),
      
      // Время до первой отрисовки
      fcp: this.getFirstContentfulPaint(),
      
      // Время до интерактивности
      tti: this.getTimeToInteractive(),
      
      // Количество ресурсов
      resourceCount: performance.getEntriesByType('resource').length,
      
      // Размер переданных данных
      transferSize: this.getTotalTransferSize(),
      
      // Использование памяти (если доступно)
      memory: this.getMemoryUsage()
    };
    
    return metrics;
  },

  /**
   * Время до первого байта
   */
  getTimeToFirstByte() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation && navigation.responseStart) {
      return Math.round(navigation.responseStart - navigation.fetchStart);
    }
    
    return null;
  },

  /**
   * Время до первой отрисовки контента
   */
  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    
    return fcp ? Math.round(fcp.startTime) : null;
  },

  /**
   * Приблизительное время до интерактивности
   */
  getTimeToInteractive() {
    // Упрощенная метрика TTI
    const loadTime = this.getPageLoadTime();
    const fcp = this.getFirstContentfulPaint();
    
    if (loadTime && fcp) {
      return Math.max(loadTime, fcp + 500); // Добавляем 500ms после FCP
    }
    
    return null;
  },

  /**
   * Общий размер переданных данных
   */
  getTotalTransferSize() {
    const resources = performance.getEntriesByType('resource');
    
    return resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);
  },

  /**
   * Использование памяти
   */
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    
    return null;
  },

  /**
   * Проверка наличия jank (подтормаживаний)
   */
  async detectJank(threshold = 50) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > threshold) {
          console.warn(`Обнаружен jank: ${entry.duration}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    
    // Отключаем через 5 секунд
    setTimeout(() => observer.disconnect(), 5000);
  },

  /**
   * Измерение времени выполнения функции
   */
  async measureExecutionTime(fn, label = 'Function') {
    const startMark = `${label}-start`;
    const endMark = `${label}-end`;
    const measureName = `${label}-duration`;
    
    performance.mark(startMark);
    
    try {
      const result = await fn();
      
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      
      const measure = performance.getEntriesByName(measureName)[0];
      
      // Очищаем метки
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);
      
      return {
        result,
        duration: measure.duration
      };
    } catch (error) {
      performance.clearMarks(startMark);
      throw error;
    }
  }
};