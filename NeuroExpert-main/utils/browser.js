// utils/browser.js - Утилиты для работы с браузерными API
// Безопасная проверка на клиентскую среду

export const isBrowser = () => typeof window !== 'undefined';

export const isServer = () => typeof window === 'undefined';

// Безопасное получение window
export const getWindow = () => {
  if (isBrowser()) {
    return window;
  }
  return null;
};

// Безопасное получение document
export const getDocument = () => {
  if (isBrowser()) {
    return document;
  }
  return null;
};

// Безопасный addEventListener
export const safeAddEventListener = (target, event, handler, options) => {
  if (isBrowser() && target && typeof target.addEventListener === 'function') {
    target.addEventListener(event, handler, options);
  }
};

// Безопасный removeEventListener
export const safeRemoveEventListener = (target, event, handler, options) => {
  if (isBrowser() && target && typeof target.removeEventListener === 'function') {
    target.removeEventListener(event, handler, options);
  }
};

// Безопасное получение размеров окна
export const getWindowSize = () => {
  if (isBrowser()) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  return {
    width: 1920,
    height: 1080
  };
};

// Безопасное получение devicePixelRatio
export const getDevicePixelRatio = () => {
  if (isBrowser()) {
    return window.devicePixelRatio || 1;
  }
  return 1;
};

// Безопасная проверка Chrome
export const isChrome = () => {
  if (isBrowser()) {
    return !!(window.chrome && window.chrome.runtime);
  }
  return false;
};

// Безопасное получение localStorage
export const safeLocalStorage = {
  getItem: (key) => {
    if (isBrowser()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage getItem failed:', e);
        return null;
      }
    }
    return null;
  },
  setItem: (key, value) => {
    if (isBrowser()) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        console.warn('localStorage setItem failed:', e);
        return false;
      }
    }
    return false;
  },
  removeItem: (key) => {
    if (isBrowser()) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn('localStorage removeItem failed:', e);
        return false;
      }
    }
    return false;
  }
};

// Безопасный консольный API
export const safeConsole = {
  log: (...args) => {
    if (isBrowser()) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isBrowser()) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (isBrowser()) {
      console.warn(...args);
    }
  }
};

// Безопасная работа с глобальными переменными window
export const safeWindowGlobal = {
  get: (key) => {
    if (isBrowser() && window[key]) {
      return window[key];
    }
    return null;
  },
  set: (key, value) => {
    if (isBrowser()) {
      window[key] = value;
      return true;
    }
    return false;
  },
  has: (key) => {
    if (isBrowser()) {
      return key in window;
    }
    return false;
  }
};

// Безопасное получение navigator
export const getNavigator = () => {
  if (isBrowser()) {
    return navigator;
  }
  return null;
};

// Безопасное получение UserAgent
export const getUserAgent = () => {
  if (isBrowser() && navigator) {
    return navigator.userAgent;
  }
  return 'Server';
};

// Безопасная проверка touch support
export const hasTouchSupport = () => {
  if (isBrowser()) {
    return 'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0);
  }
  return false;
};

// Безопасное получение device memory
export const getDeviceMemory = () => {
  if (isBrowser() && navigator && navigator.deviceMemory) {
    return navigator.deviceMemory;
  }
  return 'unknown';
};

// Безопасное получение connection
export const getConnection = () => {
  if (isBrowser() && navigator && navigator.connection) {
    return navigator.connection.effectiveType || 'unknown';
  }
  return 'unknown';
};

const browserUtils = {
  isBrowser,
  isServer,
  getWindow,
  getDocument,
  getNavigator,
  getUserAgent,
  hasTouchSupport,
  getDeviceMemory,
  getConnection,
  safeAddEventListener,
  safeRemoveEventListener,
  getWindowSize,
  getDevicePixelRatio,
  isChrome,
  safeLocalStorage,
  safeConsole,
  safeWindowGlobal
};

export default browserUtils;
