/**
 * Монитор для отслеживания touch событий
 */

import { throttle } from '../utils/mobileHelpers';

export class TouchMonitor {
  constructor() {
    this.touchEvents = [];
    this.touchStartTime = null;
    this.touchEndTime = null;
    this.gestureData = {
      swipes: 0,
      taps: 0,
      longPresses: 0,
      pinches: 0,
      rotations: 0
    };
    this.isMonitoring = false;
    
    // Привязываем обработчики
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = throttle(this.handleTouchMove.bind(this), 16);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  startMonitoring() {
    if (typeof window === 'undefined' || this.isMonitoring) return;
    
    this.isMonitoring = true;
    document.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  stopMonitoring() {
    if (typeof window === 'undefined' || !this.isMonitoring) return;
    
    this.isMonitoring = false;
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleTouchStart(event) {
    this.touchStartTime = Date.now();
    const touch = event.touches[0];
    
    this.touchEvents.push({
      type: 'touchstart',
      timestamp: this.touchStartTime,
      x: touch.clientX,
      y: touch.clientY,
      touches: event.touches.length,
      target: event.target.tagName
    });

    // Определяем начало жеста
    if (event.touches.length === 2) {
      this.startPinchDistance = this.getPinchDistance(event.touches);
    }
  }

  handleTouchMove(event) {
    if (!this.touchStartTime) return;
    
    const touch = event.touches[0];
    const lastEvent = this.touchEvents[this.touchEvents.length - 1];
    
    // Записываем движение
    this.touchEvents.push({
      type: 'touchmove',
      timestamp: Date.now(),
      x: touch.clientX,
      y: touch.clientY,
      touches: event.touches.length,
      deltaX: lastEvent ? touch.clientX - lastEvent.x : 0,
      deltaY: lastEvent ? touch.clientY - lastEvent.y : 0
    });

    // Определяем pinch
    if (event.touches.length === 2 && this.startPinchDistance) {
      const currentDistance = this.getPinchDistance(event.touches);
      const scale = currentDistance / this.startPinchDistance;
      
      if (Math.abs(scale - 1) > 0.1) {
        this.gestureData.pinches++;
      }
    }
  }

  handleTouchEnd(event) {
    if (!this.touchStartTime) return;
    
    this.touchEndTime = Date.now();
    const duration = this.touchEndTime - this.touchStartTime;
    
    this.touchEvents.push({
      type: 'touchend',
      timestamp: this.touchEndTime,
      duration
    });

    // Анализируем жест
    this.analyzeGesture(duration);
    
    // Сбрасываем данные
    this.touchStartTime = null;
    this.touchEndTime = null;
    this.startPinchDistance = null;
  }

  analyzeGesture(duration) {
    const events = this.touchEvents.slice(-10); // Последние 10 событий
    
    if (events.length < 2) return;
    
    const startEvent = events.find(e => e.type === 'touchstart');
    const endEvent = events[events.length - 1];
    
    if (!startEvent) return;
    
    // Определяем тип жеста
    const moveEvents = events.filter(e => e.type === 'touchmove');
    
    if (moveEvents.length === 0) {
      // Tap или long press
      if (duration < 200) {
        this.gestureData.taps++;
      } else if (duration > 500) {
        this.gestureData.longPresses++;
      }
    } else {
      // Swipe
      const totalDeltaX = moveEvents.reduce((sum, e) => sum + (e.deltaX || 0), 0);
      const totalDeltaY = moveEvents.reduce((sum, e) => sum + (e.deltaY || 0), 0);
      
      if (Math.abs(totalDeltaX) > 50 || Math.abs(totalDeltaY) > 50) {
        this.gestureData.swipes++;
      }
    }
  }

  getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getReport() {
    return {
      totalEvents: this.touchEvents.length,
      gestures: { ...this.gestureData },
      touchTargets: this.analyzeTouchTargets(),
      averageGestureDuration: this.calculateAverageGestureDuration()
    };
  }

  analyzeTouchTargets() {
    const targets = {};
    this.touchEvents
      .filter(e => e.type === 'touchstart' && e.target)
      .forEach(e => {
        targets[e.target] = (targets[e.target] || 0) + 1;
      });
    return targets;
  }

  calculateAverageGestureDuration() {
    const durations = this.touchEvents
      .filter(e => e.type === 'touchend' && e.duration)
      .map(e => e.duration);
    
    if (durations.length === 0) return 0;
    
    return durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }

  reset() {
    this.touchEvents = [];
    this.gestureData = {
      swipes: 0,
      taps: 0,
      longPresses: 0,
      pinches: 0,
      rotations: 0
    };
  }
}