/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация для Netlify
  experimental: {
    appDir: true,
  },
  // Отключаем статическую оптимизацию для serverless функций
  output: 'standalone',
  // Настройки для корректной работы с Netlify
  trailingSlash: false,
  // Оптимизация изображений для Netlify
  images: {
    unoptimized: true
  },
  // Настройки для API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/.netlify/functions/:path*',
      },
    ]
  },
}

module.exports = nextConfig
