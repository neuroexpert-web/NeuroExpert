/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental optimizations
  experimental: {
    serverActions: true,
  },
  
  // Настройки изображений для статики
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Отключаем проверки для быстрой сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Оптимизация сборки
  swcMinify: true,
  
  // Webpack конфигурация для SSR совместимости
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Настройки для server-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
      };
    }
    
    // Исключаем модули, которые не должны обрабатываться webpack
    config.externals = [...(config.externals || []), 'canvas'];
    
    return config;
  },

  // Настройки для production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Настройки для Netlify
  env: {
    CUSTOM_KEY: process.env.GEMINI_API_KEY,
  },
}

module.exports = nextConfig
