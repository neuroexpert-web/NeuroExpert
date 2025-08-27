// Mobile Helpers for NeuroExpert

// Установка правильной высоты viewport для мобильных устройств
export const setMobileViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Определение мобильного устройства
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Определение сенсорного устройства
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Блокировка зума на iOS при фокусе на input
export const preventZoomOnFocus = () => {
  if (!isMobileDevice()) return;

  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('focus', (e) => {
      e.target.style.fontSize = '16px';
    });
    
    input.addEventListener('blur', (e) => {
      e.target.style.fontSize = '';
    });
  });
};

// Улучшенная обработка свайпов
export class SwipeHandler {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      threshold: 50,
      velocity: 0.3,
      onSwipeLeft: () => {},
      onSwipeRight: () => {},
      onSwipeUp: () => {},
      onSwipeDown: () => {},
      ...options
    };
    
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.startTime = 0;
    
    this.init();
  }
  
  init() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }
  
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.startTime = Date.now();
  }
  
  handleTouchMove(e) {
    if (!this.startX || !this.startY) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    const diffX = this.startX - currentX;
    const diffY = this.startY - currentY;
    
    // Если движение больше горизонтальное, предотвращаем вертикальный скролл
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
    }
  }
  
  handleTouchEnd(e) {
    if (!this.startX || !this.startY) return;
    
    this.endX = e.changedTouches[0].clientX;
    this.endY = e.changedTouches[0].clientY;
    
    const diffX = this.startX - this.endX;
    const diffY = this.startY - this.endY;
    const elapsedTime = Date.now() - this.startTime;
    const velocity = Math.abs(diffX) / elapsedTime;
    
    // Определяем направление свайпа
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Горизонтальный свайп
      if (Math.abs(diffX) > this.options.threshold || velocity > this.options.velocity) {
        if (diffX > 0) {
          this.options.onSwipeLeft();
        } else {
          this.options.onSwipeRight();
        }
      }
    } else {
      // Вертикальный свайп
      if (Math.abs(diffY) > this.options.threshold || velocity > this.options.velocity) {
        if (diffY > 0) {
          this.options.onSwipeUp();
        } else {
          this.options.onSwipeDown();
        }
      }
    }
    
    // Сброс значений
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
  }
  
  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// Обработка мобильной навигации
export const initMobileNavigation = () => {
  if (!isMobileDevice()) return;
  
  // Добавляем класс для мобильных устройств
  document.body.classList.add('is-mobile');
  
  // Обработка нажатий на навигационные кнопки
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
      e.currentTarget.classList.add('touch-active');
    });
    
    btn.addEventListener('touchend', (e) => {
      setTimeout(() => {
        e.currentTarget.classList.remove('touch-active');
      }, 300);
    });
  });
};

// Оптимизация скролла для мобильных
export const optimizeMobileScroll = () => {
  if (!isMobileDevice()) return;
  
  const scrollableElements = document.querySelectorAll('.window-body, .section-container, .modal-body');
  
  scrollableElements.forEach(element => {
    let isScrolling = false;
    
    element.addEventListener('touchstart', () => {
      isScrolling = false;
    });
    
    element.addEventListener('touchmove', () => {
      isScrolling = true;
    });
    
    element.addEventListener('touchend', (e) => {
      if (!isScrolling) {
        // Если не было скролла, обрабатываем как клик
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: e.changedTouches[0].clientX,
          clientY: e.changedTouches[0].clientY
        });
        e.target.dispatchEvent(clickEvent);
      }
    });
  });
};

// Инициализация всех мобильных улучшений
export const initMobileEnhancements = () => {
  if (typeof window === 'undefined') return;
  
  // Установка высоты viewport
  setMobileViewportHeight();
  window.addEventListener('resize', setMobileViewportHeight);
  window.addEventListener('orientationchange', setMobileViewportHeight);
  
  // Предотвращение зума
  preventZoomOnFocus();
  
  // Инициализация навигации
  initMobileNavigation();
  
  // Оптимизация скролла
  optimizeMobileScroll();
  
  // Добавляем поддержку pull-to-refresh
  if ('serviceWorker' in navigator && isMobileDevice()) {
    let startY = 0;
    let currentY = 0;
    let pulling = false;
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!pulling) return;
      
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 100) {
        // Показываем индикатор обновления
        document.body.style.transform = `translateY(${Math.min(pullDistance * 0.5, 80)}px)`;
      }
    });
    
    document.addEventListener('touchend', () => {
      if (!pulling) return;
      
      const pullDistance = currentY - startY;
      document.body.style.transform = '';
      
      if (pullDistance > 100) {
        // Обновляем страницу
        location.reload();
      }
      
      pulling = false;
      startY = 0;
      currentY = 0;
    });
  }
};

// Утилита для определения ориентации
export const getOrientation = () => {
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

// Обработка изменения ориентации
export const handleOrientationChange = (callback) => {
  let currentOrientation = getOrientation();
  
  window.addEventListener('resize', () => {
    const newOrientation = getOrientation();
    if (newOrientation !== currentOrientation) {
      currentOrientation = newOrientation;
      callback(newOrientation);
    }
  });
};

// Экспорт всех функций как объект для удобства
export default {
  setMobileViewportHeight,
  isMobileDevice,
  isTouchDevice,
  preventZoomOnFocus,
  SwipeHandler,
  initMobileNavigation,
  optimizeMobileScroll,
  initMobileEnhancements,
  getOrientation,
  handleOrientationChange
};