/** @type {import('next').NextConfig} */
const nextConfig = {
  // Базовые настройки для стабильной работы на Vercel
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Настройки изображений
  images: {
    domains: ['localhost'],
  },
  // Настройки для production
  poweredByHeader: false,
  reactStrictMode: true,
  // Убираем любые экспериментальные флаги
  swcMinify: true,
}

module.exports = nextConfig