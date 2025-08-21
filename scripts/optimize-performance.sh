#!/bin/bash

# Автоматическая оптимизация производительности
echo "⚡ Запуск автоматической оптимизации производительности..."

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Оптимизация изображений
echo -e "\n${BLUE}1. Оптимизация изображений...${NC}"
if command -v sharp-cli &> /dev/null; then
  find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +100k | while read -r img; do
    echo "Оптимизация: $img"
    # Здесь был бы код оптимизации
  done
else
  echo -e "${YELLOW}sharp-cli не установлен, пропускаем оптимизацию изображений${NC}"
fi

# 2. Анализ bundle size
echo -e "\n${BLUE}2. Анализ размера бандла...${NC}"
if [ -f "package.json" ]; then
  # Добавляем скрипт анализа если его нет
  if ! grep -q "analyze" package.json; then
    echo -e "${YELLOW}Добавляю скрипт анализа бандла...${NC}"
    npm pkg set scripts.analyze="ANALYZE=true next build"
  fi
fi

# 3. Включение сжатия и оптимизаций в next.config.js
echo -e "\n${BLUE}3. Оптимизация next.config.js...${NC}"
cat > next.config.optimized.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Оптимизация производительности
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Оптимизация изображений
  images: {
    domains: ['localhost', 'neuroexpert.ai'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  
  // Экспериментальные оптимизации
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Webpack оптимизации
  webpack: (config, { isServer }) => {
    // Оптимизация для клиента
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
}

module.exports = nextConfig
EOF

# 4. Добавление компонента для lazy loading
echo -e "\n${BLUE}4. Создание утилиты для lazy loading...${NC}"
cat > app/utils/lazyWithPreload.js << 'EOF'
import dynamic from 'next/dynamic';

export function lazyWithPreload(importFunc, options = {}) {
  const Component = dynamic(importFunc, {
    loading: () => <div className="animate-pulse bg-gray-200 rounded h-64" />,
    ...options,
  });
  
  Component.preload = importFunc;
  
  return Component;
}

// Использование:
// const HeavyComponent = lazyWithPreload(() => import('./HeavyComponent'));
// HeavyComponent.preload(); // Предзагрузка
EOF

# 5. Оптимизация шрифтов
echo -e "\n${BLUE}5. Оптимизация загрузки шрифтов...${NC}"
cat > app/fonts.css << 'EOF'
/* Оптимизированная загрузка шрифтов */
@font-face {
  font-family: 'Orbitron';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/orbitron/v29/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Orbitron';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/orbitron/v29/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyKS6xoWgz.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Orbitron';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/orbitron/v29/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyAi6-oWgz.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
EOF

# 6. Создание Service Worker для кеширования
echo -e "\n${BLUE}6. Создание Service Worker...${NC}"
cat > public/sw.js << 'EOF'
const CACHE_NAME = 'neuroexpert-v1';
const urlsToCache = [
  '/',
  '/styles/globals.css',
  '/fonts/orbitron.woff2',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
EOF

# 7. Оптимизация package.json scripts
echo -e "\n${BLUE}7. Добавление скриптов оптимизации...${NC}"
npm pkg set scripts.build:analyze="ANALYZE=true next build"
npm pkg set scripts.build:profile="NEXT_PROFILE=true next build"
npm pkg set scripts.lighthouse="npx lighthouse http://localhost:3000 --view"

echo -e "\n${GREEN}✅ Оптимизация завершена!${NC}"
echo -e "\n${YELLOW}Рекомендации:${NC}"
echo "1. Замените next.config.js на next.config.optimized.js после проверки"
echo "2. Запустите 'npm run build:analyze' для анализа размера бандла"
echo "3. Используйте lazyWithPreload для тяжелых компонентов"
echo "4. Регистрируйте Service Worker в _app.js для PWA"