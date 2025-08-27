// Scroll Manager для управления скроллингом на всех страницах

export class ScrollManager {
  constructor() {
    this.currentSection = 0;
    this.isScrolling = false;
    this.touchStartY = 0;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;

    // Установка правильной высоты viewport
    this.setViewportHeight();
    window.addEventListener('resize', () => this.setViewportHeight());
    window.addEventListener('orientationchange', () => this.setViewportHeight());

    // Предотвращение двойного скролла
    this.preventBodyScroll();

    // Инициализация скролла для секций
    this.initSectionScrolling();

    // Фикс для iOS Safari
    this.fixIOSSafari();
  }

  setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  preventBodyScroll() {
    // Предотвращаем скролл body когда открыты модальные окна
    document.body.addEventListener('touchmove', (e) => {
      if (e.target.closest('.modal-overlay, .ai-chat-window')) {
        return;
      }
      
      if (!e.target.closest('.scrollable-section, .page-content')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  initSectionScrolling() {
    const sections = document.querySelectorAll('.scrollable-section');
    
    sections.forEach(section => {
      // Добавляем smooth scrolling
      section.style.scrollBehavior = 'smooth';
      
      // Добавляем обработчик для отслеживания скролла
      section.addEventListener('scroll', () => {
        this.handleSectionScroll(section);
      }, { passive: true });

      // Touch обработчики для мобильных
      this.addTouchHandlers(section);
    });
  }

  handleSectionScroll(section) {
    // Добавляем класс при скролле
    if (!section.classList.contains('is-scrolling')) {
      section.classList.add('is-scrolling');
    }

    // Убираем класс после окончания скролла
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      section.classList.remove('is-scrolling');
    }, 150);
  }

  addTouchHandlers(element) {
    let startY = 0;
    let startScrollTop = 0;

    element.addEventListener('touchstart', (e) => {
      startY = e.touches[0].pageY;
      startScrollTop = element.scrollTop;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
      const deltaY = startY - e.touches[0].pageY;
      const newScrollTop = startScrollTop + deltaY;

      // Предотвращаем overscroll если достигли края
      if (newScrollTop < 0 || newScrollTop > element.scrollHeight - element.clientHeight) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  fixIOSSafari() {
    // Специальные фиксы для iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Фикс для правильной высоты
      document.querySelectorAll('.full-page').forEach(el => {
        el.style.minHeight = `${window.innerHeight}px`;
      });

      // Фикс для position: fixed элементов
      let lastScrollTop = 0;
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
          // Скролл вниз
          document.body.classList.add('scroll-down');
          document.body.classList.remove('scroll-up');
        } else {
          // Скролл вверх
          document.body.classList.add('scroll-up');
          document.body.classList.remove('scroll-down');
        }
        
        lastScrollTop = scrollTop;
      }, { passive: true });
    }
  }

  // Метод для программного скролла к секции
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Метод для скролла внутри секции
  scrollWithinSection(sectionId, targetId) {
    const section = document.getElementById(sectionId);
    const target = document.getElementById(targetId);
    
    if (section && target) {
      const targetPosition = target.offsetTop - section.offsetTop;
      section.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Включение/отключение скролла
  enableScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  disableScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  // Проверка видимости элемента
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Плавный скролл к элементу
  smoothScrollTo(element, duration = 800) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }
}

// Инициализация при загрузке
if (typeof window !== 'undefined') {
  window.scrollManager = new ScrollManager();
}

export default ScrollManager;