#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('🛡️  Настройка Sentry для мониторинга ошибок\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupSentry() {
  try {
    // Проверяем наличие переменных окружения
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    console.log('📋 Для настройки Sentry вам понадобится:');
    console.log('1. Зарегистрироваться на https://sentry.io');
    console.log('2. Создать новый проект (Next.js)');
    console.log('3. Получить DSN из настроек проекта\n');

    const dsn = await question('Введите Sentry DSN (или оставьте пустым для пропуска): ');

    if (!dsn) {
      console.log('\n⏭️  Настройка Sentry пропущена');
      rl.close();
      return;
    }

    // Добавляем DSN в .env.local
    if (!envContent.includes('NEXT_PUBLIC_SENTRY_DSN')) {
      envContent += `\n# Sentry Error Tracking\nNEXT_PUBLIC_SENTRY_DSN=${dsn}\nSENTRY_ORG=your-org-slug\nSENTRY_PROJECT=your-project-slug\nSENTRY_AUTH_TOKEN=your-auth-token\n`;
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Переменные окружения добавлены в .env.local');
    }

    // Активируем Sentry конфигурации
    const sentryFiles = [
      'sentry.client.config.ts.disabled',
      'sentry.edge.config.ts.disabled',
      'sentry.server.config.ts.disabled',
    ];

    for (const file of sentryFiles) {
      const oldPath = path.join(process.cwd(), file);
      const newPath = oldPath.replace('.disabled', '');

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Активирован: ${path.basename(newPath)}`);
      }
    }

    // Обновляем next.config.js
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    let nextConfig = fs.readFileSync(nextConfigPath, 'utf-8');

    if (nextConfig.includes('// Temporarily disable Sentry')) {
      nextConfig = nextConfig.replace(
        '// Temporarily disable Sentry completely until properly configured\nmodule.exports = nextConfig;',
        `// Sentry configuration
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // Upload source maps only in production
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);`
      );

      fs.writeFileSync(nextConfigPath, nextConfig);
      console.log('✅ Обновлен next.config.js');
    }

    console.log('\n🎉 Sentry успешно настроен!');
    console.log('\n📝 Следующие шаги:');
    console.log('1. Установите Sentry SDK: npm install --save @sentry/nextjs');
    console.log('2. Обновите SENTRY_ORG, SENTRY_PROJECT и SENTRY_AUTH_TOKEN в .env.local');
    console.log('3. Проверьте работу: npm run dev');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    rl.close();
  }
}

setupSentry();
