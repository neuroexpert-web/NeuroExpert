/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force rebuild on deployment
  env: {
    DEPLOYMENT_VERSION: '3.1.0',
    DEPLOYMENT_TIME: new Date().toISOString(),
    FORCE_REBUILD: 'true'
  },
  // Ensure all components are properly built
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig