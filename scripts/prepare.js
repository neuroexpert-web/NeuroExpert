#!/usr/bin/env node

// Условная установка Husky
// Пропускает установку в production и CI/CD окружениях

const isCI = process.env.CI === 'true';
const isVercel = !!process.env.VERCEL;
const isNetlify = !!process.env.NETLIFY;
const isProduction = process.env.NODE_ENV === 'production';

if (isCI || isVercel || isNetlify || isProduction) {
  console.log('📦 Skipping Husky install in', {
    CI: isCI,
    Vercel: isVercel,
    Netlify: isNetlify,
    Production: isProduction
  });
  process.exit(0);
}

// Устанавливаем Husky только в development
try {
  require('child_process').execSync('husky', { stdio: 'inherit' });
  console.log('✅ Husky installed successfully');
} catch (error) {
  console.log('⚠️  Husky installation failed, but continuing...');
  // Не прерываем установку, если Husky не удалось установить
  process.exit(0);
}