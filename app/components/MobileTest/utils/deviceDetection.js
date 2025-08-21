/**
 * Утилиты для определения мобильных устройств и их возможностей
 */

/**
 * Определение возможностей текущего устройства
 */
export function detectDeviceCapabilities() {
  // Проверяем, что мы в браузере
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      touchSupport: false,
      devicePixelRatio: 1,
      viewport: { width: 1920, height: 1080 },
      orientation: 'unknown',
      userAgent: 'Server',
      memory: 'unknown',
      connection: 'unknown',
      battery: false,
      deviceCategory: 'desktop'
    };
  }

  const capabilities = {
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    orientation: getOrientation(),
    userAgent: navigator.userAgent,
    memory: getDeviceMemory(),
    connection: getConnectionInfo(),
    battery: 'getBattery' in navigator,
    deviceCategory: detectDeviceCategory()
  };

  return capabilities;
}

/**
 * Определение ориентации экрана
 */
export function getOrientation() {
  if (typeof screen !== 'undefined' && screen.orientation) {
    return screen.orientation.type;
  }
  
  if (typeof window !== 'undefined') {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }
  
  return 'unknown';
}

/**
 * Определение памяти устройства
 */
export function getDeviceMemory() {
  if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
    return `${navigator.deviceMemory} GB`;
  }
  return 'unknown';
}

/**
 * Получение информации о соединении
 */
export function getConnectionInfo() {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = navigator.connection;
    return {
      type: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 'unknown',
      rtt: connection.rtt || 'unknown',
      saveData: connection.saveData || false
    };
  }
  return 'unknown';
}

/**
 * Определение категории устройства
 */
export function detectDeviceCategory() {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Проверка на мобильные устройства через user agent
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  if (isMobile) {
    if (width <= 480) return 'small_mobile';
    if (width <= 768) return 'mobile';
    return 'tablet';
  }
  
  return 'desktop';
}

/**
 * Проверка поддержки touch
 */
export function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Проверка на iOS устройство
 */
export function isIOS() {
  if (typeof navigator === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Проверка на Android устройство
 */
export function isAndroid() {
  if (typeof navigator === 'undefined') return false;
  
  return /Android/i.test(navigator.userAgent);
}

/**
 * Получение размера экрана с учетом DPR
 */
export function getActualScreenSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  
  const dpr = window.devicePixelRatio || 1;
  return {
    width: window.innerWidth * dpr,
    height: window.innerHeight * dpr,
    dpr
  };
}

/**
 * Проверка поддержки вибрации
 */
export function supportsVibration() {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Проверка поддержки геолокации
 */
export function supportsGeolocation() {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

/**
 * Получение информации о батарее
 */
export async function getBatteryInfo() {
  if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
    return null;
  }
  
  try {
    const battery = await navigator.getBattery();
    return {
      level: battery.level,
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime
    };
  } catch (error) {
    return null;
  }
}