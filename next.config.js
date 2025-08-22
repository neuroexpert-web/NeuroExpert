/** @type {import('next').NextConfig} */
// Note: 'target' property removed as it's deprecated in Next.js 12+
// Netlify automatically detects and optimizes for serverless deployment

// Sentry temporarily disabled until properly configured

// Content Security Policy configuration
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google.com *.googleapis.com *.gstatic.com *.google-analytics.com *.googletagmanager.com mc.yandex.ru *.yandex.net https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://vercel.live ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline' *.googleapis.com fonts.googleapis.com;
  img-src 'self' blob: data: *.google.com *.googleapis.com *.gstatic.com *.google-analytics.com api.dicebear.com;
  font-src 'self' fonts.gstatic.com;
  connect-src 'self' *.google.com *.googleapis.com *.google-analytics.com mc.yandex.ru *.yandex.net generativelanguage.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net ${process.env.NODE_ENV === 'development' ? 'ws://localhost:*' : ''} wss://*;
  media-src 'self';
  object-src 'none';
  child-src 'self';
  frame-src 'self' *.google.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
  manifest-src 'self';
  worker-src 'self' blob:;
  upgrade-insecure-requests;
  block-all-mixed-content;
  report-uri ${process.env.CSP_REPORT_URI || '/api/csp-report'};
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
    optimizePackageImports: ['@google/generative-ai', 'framer-motion', 'date-fns'],
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
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
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
  webpack: (config, { isServer }) => {
    // Оптимизация bundle size
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
            priority: 20
          },
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
    }
    
    return config;
  },
};

// Temporarily disable Sentry completely until properly configured
module.exports = nextConfig;
