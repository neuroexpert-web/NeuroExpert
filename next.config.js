/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Убираем экспериментальные флаги для стабильности на Vercel
    cpus: undefined,
    turbo: undefined,
    optimizeCss: undefined
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production'
  },
  // Настройки для Vercel
  typescript: {
    // Игнорируем TypeScript ошибки при сборке (если есть)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Игнорируем ESLint ошибки при сборке для быстрого деплоя
    ignoreDuringBuilds: true,
  },
  // Оптимизации для продакшена
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Настройки изображений
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
}

module.exports = nextConfig