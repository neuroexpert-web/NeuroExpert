/** @type {import('next').NextConfig} */
// Note: 'target' property removed as it's deprecated in Next.js 12+
// Netlify automatically detects and optimizes for serverless deployment

// Sentry temporarily disabled until properly configured
const crypto = require('crypto');

// Content Security Policy configuration - упрощено для исправления проблем
const ContentSecurityPolicy = `
  default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;
  script-src * 'unsafe-inline' 'unsafe-eval';
  style-src * 'unsafe-inline';
  img-src * data: blob:;
  font-src *;
  connect-src *;
  frame-src *;
  worker-src * blob:;
`;

const nextConfig = {
  // Режим output зависит от платформы
  output: process.env.NEXT_OUTPUT_MODE || undefined,
  
  // Генерация статических файлов
  generateBuildId: async () => {
    // Используем фиксированный ID для консистентности
    return 'neuroexpert-build-2025'
  },
  
  // Оптимизация производительности
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  
  // Включаем проверки для повышения качества кода
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib', 'utils'],
  },
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  
  // Оптимизация изображений
  images: {
    domains: ['api.dicebear.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 год
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Удаление console.log в production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Улучшение производительности сборки
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@google/generative-ai', 
      'framer-motion', 
      'date-fns',
      'bcryptjs',
      'jsonwebtoken',
      'styled-jsx'
    ],
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
    cpus: 4,
  },
  
  // Headers для безопасности и кэширования
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // Временно отключено для исправления проблем с CSS
          // {
          //   key: 'X-Content-Type-Options',
          //   value: 'nosniff'
          // },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()'
          },
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Webpack оптимизации
  webpack: (config, { isServer, dev }) => {
    // Оптимизация bundle size
    if (!isServer) {
      // Улучшенное разделение кода
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Отдельный бандл для фреймворка
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true
          },
          // Библиотеки
          lib: {
            test(module) {
              return module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier());
            },
            name(module) {
              const hash = crypto.createHash('sha1');
              hash.update(module.identifier());
              return hash.digest('hex').substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Общий vendor код
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          // Общий код приложения
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      };

      // Минимизация только в production
      if (!dev) {
        config.optimization.minimize = true;
        config.optimization.usedExports = true;
        config.optimization.sideEffects = false;
      }
    }
    
    // Алиасы для оптимизации импортов
    config.resolve.alias = {
      ...config.resolve.alias,
      'lodash': 'lodash-es',
    };
    
    return config;
  },
};

// Temporarily disable Sentry completely until properly configured
module.exports = nextConfig;
