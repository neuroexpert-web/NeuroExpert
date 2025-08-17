module.exports = {
  presets: ['next/babel'],
  plugins: [
    // Remove console.log in production
    process.env.NODE_ENV === 'production' && ['transform-remove-console', {
      exclude: ['error', 'warn']
    }]
  ].filter(Boolean)
};