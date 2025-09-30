/**
 * Font Optimization Utilities
 * Оптимизация загрузки шрифтов для максимальной производительности
 */

// Preload критических шрифтов
export const preloadFonts = () => {
  const fonts = [
    {
      href: '/fonts/inter-var.woff2',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    }
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = font.href;
    link.type = font.type;
    link.crossOrigin = font.crossOrigin;
    document.head.appendChild(link);
  });
};

// Font Face Observer для оптимизированной загрузки
export const loadFonts = async () => {
  if (typeof window === 'undefined') return;

  try {
    // Загружаем только необходимые веса шрифтов
    const fontPromises = [
      document.fonts.load('400 1em Inter'),
      document.fonts.load('600 1em Inter'),
      document.fonts.load('700 1em Inter'),
    ];

    await Promise.all(fontPromises);
    document.documentElement.classList.add('fonts-loaded');
  } catch (error) {
    console.error('Font loading failed:', error);
    // Fallback to system fonts
    document.documentElement.classList.add('fonts-fallback');
  }
};

// CSS для оптимизированной загрузки шрифтов
export const fontStyles = `
  /* Используем font-display: optional для критических шрифтов */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 100 900;
    font-display: optional;
    src: url('/fonts/inter-var.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* Системный стек шрифтов как fallback */
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  /* Оптимизация рендеринга текста */
  body {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: "liga" 1, "calt" 1; /* Лигатуры и контекстные альтернативы */
  }

  /* Предотвращение FOUT (Flash of Unstyled Text) */
  .fonts-loading {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .fonts-loaded {
    opacity: 1;
  }
`;

// Subset шрифтов для разных языков
export const getSubsetForLocale = (locale) => {
  const subsets = {
    'ru': 'cyrillic',
    'en': 'latin',
    'de': 'latin-ext',
  };
  
  return subsets[locale] || 'latin';
};

// Динамическая загрузка шрифтов по требованию
export const loadFontOnDemand = async (fontFamily, weight = '400') => {
  if (typeof window === 'undefined') return;

  try {
    await document.fonts.load(`${weight} 1em ${fontFamily}`);
    return true;
  } catch (error) {
    console.error(`Failed to load font ${fontFamily}:`, error);
    return false;
  }
};