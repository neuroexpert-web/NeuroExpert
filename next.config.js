/** @type {import('next').NextConfig} */
// Note: 'target' property removed as it's deprecated in Next.js 12+
// Netlify automatically detects and optimizes for serverless deployment

let withSentryConfig;
try {
  withSentryConfig = require("@sentry/nextjs").withSentryConfig;
} catch (e) {
  // Sentry not available
  withSentryConfig = null;
}

const nextConfig = {
  // Оптимизация производительности
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  
  // Оптимизация изображений
  images: {
    domains: ['api.dicebear.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Улучшение производительности сборки
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@google/generative-ai'],
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
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
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

// Wrap the config with Sentry only if DSN is configured
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Skip source map upload if no auth token
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
};

const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  widenClientFileUpload: true,
  transpileClientSDK: false,
  hideSourceMaps: true,
  disableLogger: true,
  // Skip Sentry build step if no DSN configured
  disableServerWebpackPlugin: !process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN,
  disableClientWebpackPlugin: !process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN,
};

// Export config with or without Sentry based on availability and configuration
module.exports = withSentryConfig && (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN)
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions)
  : nextConfig;
