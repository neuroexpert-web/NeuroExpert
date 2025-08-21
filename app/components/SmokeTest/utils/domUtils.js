/**
 * Утилиты для работы с DOM
 */

export const domUtils = {
  /**
   * Ожидание появления элемента
   */
  async waitForElement(selector, timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
      await this.sleep(100);
    }
    
    return null;
  },

  /**
   * Ожидание пока элемент станет видимым
   */
  async waitForVisible(selector, timeout = 5000) {
    const element = await this.waitForElement(selector, timeout);
    if (!element) return false;
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const isVisible = element.offsetParent !== null && 
                       element.offsetWidth > 0 && 
                       element.offsetHeight > 0;
      if (isVisible) {
        return true;
      }
      await this.sleep(100);
    }
    
    return false;
  },

  /**
   * Проверка интерактивности элемента
   */
  isInteractive(element) {
    if (!element) return false;
    
    const isDisabled = element.disabled || element.getAttribute('aria-disabled') === 'true';
    const isReadOnly = element.readOnly || element.getAttribute('aria-readonly') === 'true';
    const isHidden = element.style.display === 'none' || element.style.visibility === 'hidden';
    
    return !isDisabled && !isReadOnly && !isHidden;
  },

  /**
   * Получение всех интерактивных элементов
   */
  getInteractiveElements() {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled]):not([readonly])',
      'select:not([disabled])',
      'textarea:not([disabled]):not([readonly])',
      'a[href]',
      '[role="button"]:not([aria-disabled="true"])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    
    return document.querySelectorAll(selectors.join(', '));
  },

  /**
   * Симуляция клика
   */
  async simulateClick(element) {
    if (!element) return false;
    
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    element.dispatchEvent(event);
    return true;
  },

  /**
   * Симуляция ввода текста
   */
  async simulateInput(element, value) {
    if (!element) return false;
    
    element.focus();
    element.value = value;
    
    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true
    });
    
    const changeEvent = new Event('change', {
      bubbles: true,
      cancelable: true
    });
    
    element.dispatchEvent(inputEvent);
    element.dispatchEvent(changeEvent);
    
    return true;
  },

  /**
   * Проверка видимости в viewport
   */
  isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Получение текста элемента
   */
  getElementText(element) {
    if (!element) return '';
    
    return element.textContent || element.innerText || element.value || '';
  },

  /**
   * Проверка наличия класса
   */
  hasClass(element, className) {
    if (!element) return false;
    
    return element.classList.contains(className);
  },

  /**
   * Вспомогательная функция для ожидания
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};