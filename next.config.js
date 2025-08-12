/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация для Netlify
  experimental: {
    esmExternals: true
  },
  // Изображения
  images: {
    unoptimized: true
  },
  // Быстрая сборка
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Оптимизация сборки
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

module.exports = nextConfig
