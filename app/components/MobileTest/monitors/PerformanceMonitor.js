/**
 * Монитор производительности для мобильных устройств
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      timeToInteractive: 0,
      totalBlockingTime: 0,
      cumulativeLayoutShift: 0,
      memoryUsage: 0,
      resourcesLoaded: []
    };
    
    this.observers = new Map();
    this.isMonitoring = false;
  }

  startMonitoring() {
    if (typeof window === 'undefined' || this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Измеряем базовые метрики загрузки
    this.measureLoadMetrics();
    
    // Наблюдаем за Core Web Vitals
    this.observeWebVitals();
    
    // Мониторим использование памяти
    this.monitorMemoryUsage();
    
    // Отслеживаем загрузку ресурсов
    this.observeResourceLoading();
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    // Отключаем все observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  measureLoadMetrics() {
    if (typeof performance === 'undefined') return;
    
    // Используем Navigation Timing API
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    }
    
    // Paint Timing API
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-paint') {
        this.metrics.firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        this.metrics.firstContentfulPaint = entry.startTime;
      }
    });
  }

  observeWebVitals() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        // LCP не поддерживается
      }
      
      // Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.cumulativeLayoutShift = clsValue;
            }
          }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        // CLS не поддерживается
      }
      
      // Long Tasks для Total Blocking Time
      try {
        let tbt = 0;
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              tbt += entry.duration - 50;
              this.metrics.totalBlockingTime = tbt;
            }
          }
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (e) {
        // Long Tasks не поддерживается
      }
    }
  }

  monitorMemoryUsage() {
    if (performance.memory) {
      const updateMemory = () => {
        if (!this.isMonitoring) return;
        
        this.metrics.memoryUsage = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          percentUsed: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
        };
        
        // Обновляем каждые 5 секунд
        setTimeout(updateMemory, 5000);
      };
      
      updateMemory();
    }
  }

  observeResourceLoading() {
    if (typeof performance === 'undefined') return;
    
    // Анализируем уже загруженные ресурсы
    const resources = performance.getEntriesByType('resource');
    this.analyzeResources(resources);
    
    // Наблюдаем за новыми ресурсами
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          this.analyzeResources(list.getEntries());
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (e) {
        // Resource timing не поддерживается
      }
    }
  }

  analyzeResources(resources) {
    resources.forEach(resource => {
      const resourceData = {
        name: resource.name,
        type: this.getResourceType(resource.name),
        duration: resource.duration,
        size: resource.transferSize || 0,
        compressed: resource.encodedBodySize < resource.decodedBodySize,
        cached: resource.transferSize === 0 && resource.decodedBodySize > 0
      };
      
      this.metrics.resourcesLoaded.push(resourceData);
    });
  }

  getResourceType(url) {
    const extension = url.split('.').pop().split('?')[0].toLowerCase();
    
    const typeMap = {
      js: 'script',
      mjs: 'script',
      css: 'stylesheet',
      jpg: 'image',
      jpeg: 'image',
      png: 'image',
      gif: 'image',
      svg: 'image',
      webp: 'image',
      woff: 'font',
      woff2: 'font',
      ttf: 'font',
      json: 'data',
      xml: 'data'
    };
    
    return typeMap[extension] || 'other';
  }

  calculateTimeToInteractive() {
    // Простая эвристика для TTI
    const fcp = this.metrics.firstContentfulPaint;
    const tbt = this.metrics.totalBlockingTime;
    
    if (fcp > 0) {
      // TTI = FCP + время до стабилизации
      this.metrics.timeToInteractive = fcp + Math.min(tbt, 5000);
    }
  }

  getReport() {
    this.calculateTimeToInteractive();
    
    const report = {
      metrics: { ...this.metrics },
      score: this.calculatePerformanceScore(),
      recommendations: this.generateRecommendations(),
      resourceAnalysis: this.analyzeResourceImpact()
    };
    
    return report;
  }

  calculatePerformanceScore() {
    // Простая система оценки производительности
    let score = 100;
    
    // Штрафы за медленные метрики
    if (this.metrics.firstContentfulPaint > 1800) score -= 10;
    if (this.metrics.firstContentfulPaint > 3000) score -= 15;
    
    if (this.metrics.largestContentfulPaint > 2500) score -= 10;
    if (this.metrics.largestContentfulPaint > 4000) score -= 15;
    
    if (this.metrics.totalBlockingTime > 300) score -= 10;
    if (this.metrics.totalBlockingTime > 600) score -= 15;
    
    if (this.metrics.cumulativeLayoutShift > 0.1) score -= 5;
    if (this.metrics.cumulativeLayoutShift > 0.25) score -= 10;
    
    return Math.max(0, score);
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.firstContentfulPaint > 1800) {
      recommendations.push({
        type: 'critical',
        message: 'Первая отрисовка контента происходит слишком медленно',
        suggestion: 'Оптимизируйте критический CSS и уменьшите блокирующие ресурсы'
      });
    }
    
    if (this.metrics.totalBlockingTime > 300) {
      recommendations.push({
        type: 'warning',
        message: 'Высокое время блокировки главного потока',
        suggestion: 'Разделите длинные задачи JavaScript и используйте Web Workers'
      });
    }
    
    if (this.metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push({
        type: 'warning',
        message: 'Обнаружены сдвиги макета',
        suggestion: 'Задайте размеры для изображений и избегайте динамической вставки контента'
      });
    }
    
    const largeResources = this.metrics.resourcesLoaded.filter(r => r.size > 100000);
    if (largeResources.length > 0) {
      recommendations.push({
        type: 'info',
        message: `Обнаружено ${largeResources.length} больших ресурсов`,
        suggestion: 'Используйте сжатие и оптимизацию для уменьшения размера файлов'
      });
    }
    
    return recommendations;
  }

  analyzeResourceImpact() {
    const analysis = {
      totalResources: this.metrics.resourcesLoaded.length,
      totalSize: 0,
      byType: {},
      cached: 0,
      compressed: 0
    };
    
    this.metrics.resourcesLoaded.forEach(resource => {
      analysis.totalSize += resource.size;
      
      if (!analysis.byType[resource.type]) {
        analysis.byType[resource.type] = {
          count: 0,
          size: 0,
          avgDuration: 0
        };
      }
      
      analysis.byType[resource.type].count++;
      analysis.byType[resource.type].size += resource.size;
      analysis.byType[resource.type].avgDuration += resource.duration;
      
      if (resource.cached) analysis.cached++;
      if (resource.compressed) analysis.compressed++;
    });
    
    // Вычисляем средние значения
    Object.keys(analysis.byType).forEach(type => {
      const typeData = analysis.byType[type];
      typeData.avgDuration = typeData.avgDuration / typeData.count;
    });
    
    return analysis;
  }

  reset() {
    this.metrics = {
      pageLoadTime: 0,
      domContentLoaded: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      timeToInteractive: 0,
      totalBlockingTime: 0,
      cumulativeLayoutShift: 0,
      memoryUsage: 0,
      resourcesLoaded: []
    };
  }
}