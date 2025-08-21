/**
 * Вспомогательные функции для мобильного тестирования
 */

/**
 * Эмуляция viewport для устройства
 */
export function emulateViewport(viewport) {
  if (typeof window === 'undefined') return;
  
  // Создаем meta viewport tag если его нет
  let metaViewport = document.querySelector('meta[name="viewport"]');
  if (!metaViewport) {
    metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    document.head.appendChild(metaViewport);
  }
  
  // Устанавливаем размеры viewport
  metaViewport.content = `width=${viewport.width}, initial-scale=1.0`;
  
  // Эмулируем размер окна для тестирования
  if (window.resizeTo) {
    window.resizeTo(viewport.width, viewport.height);
  }
}

/**
 * Генерация touch события
 */
export function createTouchEvent(type, x, y) {
  if (typeof window === 'undefined') return null;
  
  const touch = new Touch({
    identifier: Date.now(),
    target: document.body,
    clientX: x,
    clientY: y,
    pageX: x,
    pageY: y,
    screenX: x,
    screenY: y,
    radiusX: 1,
    radiusY: 1,
    rotationAngle: 0,
    force: 1
  });
  
  return new TouchEvent(type, {
    touches: [touch],
    targetTouches: [touch],
    changedTouches: [touch],
    bubbles: true
  });
}

/**
 * Эмуляция свайпа
 */
export function simulateSwipe(startX, startY, endX, endY, duration = 300) {
  if (typeof window === 'undefined') return;
  
  const steps = 10;
  const stepDelay = duration / steps;
  
  // touchstart
  const startEvent = createTouchEvent('touchstart', startX, startY);
  document.body.dispatchEvent(startEvent);
  
  // touchmove
  for (let i = 1; i <= steps; i++) {
    setTimeout(() => {
      const x = startX + (endX - startX) * (i / steps);
      const y = startY + (endY - startY) * (i / steps);
      const moveEvent = createTouchEvent('touchmove', x, y);
      document.body.dispatchEvent(moveEvent);
    }, stepDelay * i);
  }
  
  // touchend
  setTimeout(() => {
    const endEvent = createTouchEvent('touchend', endX, endY);
    document.body.dispatchEvent(endEvent);
  }, duration);
}

/**
 * Проверка видимости элемента в viewport
 */
export function isElementInViewport(element) {
  if (typeof window === 'undefined' || !element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Расчет размера текста для мобильных устройств
 */
export function calculateMobileTextSize(baseSize, viewport) {
  const referenceWidth = 375; // iPhone SE width
  const scaleFactor = viewport.width / referenceWidth;
  return Math.max(baseSize * scaleFactor, baseSize * 0.8);
}

/**
 * Проверка доступности элемента для touch
 */
export function isTouchFriendly(element) {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  const minSize = 44; // Apple's recommended minimum touch target size
  
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * Форматирование размера файла
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Дебаунс функция для оптимизации событий
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle функция для оптимизации событий
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}