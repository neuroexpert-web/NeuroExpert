/** @type {import('next').NextConfig} */
const nextConfig = {
  // Быстрая сборка для Netlify
  output: 'export',
  trailingSlash: false,
  // Отключаем все медленные оптимизации
  images: {
    unoptimized: true
  },
  // Минимальная конфигурация ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Отключаем TypeScript проверки для скорости
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
