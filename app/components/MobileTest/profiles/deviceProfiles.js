/**
 * Профили мобильных устройств для тестирования
 * Включает популярные смартфоны и планшеты
 */

export const DEVICE_CATEGORIES = {
  SMALL_MOBILE: 'small_mobile',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
};

export const DEVICE_PROFILES = [
  // iPhone модели
  {
    id: 'iphone_se',
    name: 'iPhone SE',
    viewport: { width: 375, height: 667 },
    dpr: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
    category: DEVICE_CATEGORIES.SMALL_MOBILE,
    brand: 'Apple',
    os: 'iOS'
  },
  {
    id: 'iphone_12',
    name: 'iPhone 12',
    viewport: { width: 390, height: 844 },
    dpr: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
    category: DEVICE_CATEGORIES.MOBILE,
    brand: 'Apple',
    os: 'iOS'
  },
  {
    id: 'iphone_14_pro',
    name: 'iPhone 14 Pro',
    viewport: { width: 393, height: 852 },
    dpr: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
    category: DEVICE_CATEGORIES.MOBILE,
    brand: 'Apple',
    os: 'iOS'
  },

  // Android смартфоны
  {
    id: 'pixel_6',
    name: 'Google Pixel 6',
    viewport: { width: 393, height: 851 },
    dpr: 2.75,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36',
    touchSupport: true,
    category: DEVICE_CATEGORIES.MOBILE,
    brand: 'Google',
    os: 'Android'
  },
  {
    id: 'samsung_s21',
    name: 'Samsung Galaxy S21',
    viewport: { width: 360, height: 800 },
    dpr: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Samsung Galaxy S21) AppleWebKit/537.36',
    touchSupport: true,
    category: DEVICE_CATEGORIES.MOBILE,
    brand: 'Samsung',
    os: 'Android'
  },
  {
    id: 'oneplus_9',
    name: 'OnePlus 9',
    viewport: { width: 412, height: 915 },
    dpr: 2.625,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; OnePlus 9) AppleWebKit/537.36',
    touchSupport: true,
    category: DEVICE_CATEGORIES.MOBILE,
    brand: 'OnePlus',
    os: 'Android'
  },

  // Планшеты
  {
    id: 'ipad',
    name: 'iPad',
    viewport: { width: 768, height: 1024 },
    dpr: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
    category: DEVICE_CATEGORIES.TABLET,
    brand: 'Apple',
    os: 'iPadOS'
  },
  {
    id: 'ipad_pro',
    name: 'iPad Pro 12.9"',
    viewport: { width: 1024, height: 1366 },
    dpr: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    touchSupport: true,
    category: DEVICE_CATEGORIES.TABLET,
    brand: 'Apple',
    os: 'iPadOS'
  },
  {
    id: 'galaxy_tab',
    name: 'Samsung Galaxy Tab S7',
    viewport: { width: 800, height: 1280 },
    dpr: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Samsung Galaxy Tab S7) AppleWebKit/537.36',
    touchSupport: true,
    category: DEVICE_CATEGORIES.TABLET,
    brand: 'Samsung',
    os: 'Android'
  }
];

// Хелпер для получения профиля по ID
export function getDeviceProfile(deviceId) {
  return DEVICE_PROFILES.find(profile => profile.id === deviceId);
}

// Хелпер для получения профилей по категории
export function getDevicesByCategory(category) {
  return DEVICE_PROFILES.filter(profile => profile.category === category);
}

// Хелпер для получения профилей по OS
export function getDevicesByOS(os) {
  return DEVICE_PROFILES.filter(profile => profile.os === os);
}

// Мапа для быстрого доступа
export const DEVICE_MAP = new Map(
  DEVICE_PROFILES.map(profile => [profile.id, profile])
);

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

// Экспорт по умолчанию
export default DEVICE_PROFILES;