#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Запуск комплексной отладки проекта NeuroExpert\n');

const issues = [];
const warnings = [];
const successes = [];

// 1. Проверка структуры проекта
function checkProjectStructure() {
  console.log('📁 Проверка структуры проекта...');

  const requiredFiles = [
    'app/page.js',
    'app/layout.js',
    'app/globals.css',
    'app/components/NeuroExpertHero.js',
    'app/components/ROICalculator.tsx',
    'app/components/SmartFloatingAI.js',
    'app/components/ContactForm.js',
    'package.json',
    'next.config.js',
  ];

  requiredFiles.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      successes.push(`✅ Файл найден: ${file}`);
    } else {
      issues.push(`❌ Отсутствует файл: ${file}`);
    }
  });
}

// 2. Проверка зависимостей
function checkDependencies() {
  console.log('\n📦 Проверка зависимостей...');

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      '@google/generative-ai',
      'next',
      'react',
      'framer-motion',
      'bcryptjs',
      'jsonwebtoken',
    ];

    requiredDeps.forEach((dep) => {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        successes.push(`✅ Зависимость установлена: ${dep}`);
      } else {
        issues.push(`❌ Отсутствует зависимость: ${dep}`);
      }
    });
  } catch (error) {
    issues.push(`❌ Ошибка чтения package.json: ${error.message}`);
  }
}

// 3. Проверка переменных окружения
function checkEnvVariables() {
  console.log('\n🔐 Проверка переменных окружения...');

  const envExample = `
# AI Integration
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ADMIN_PASSWORD_HASH=your-bcrypt-hash

# Telegram Integration (Optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
`;

  if (!fs.existsSync('.env.local') && !fs.existsSync('.env')) {
    warnings.push('⚠️  Файл .env.local не найден');
    fs.writeFileSync('.env.example', envExample);
    console.log('📝 Создан .env.example с примером переменных');
  }
}

// 4. Проверка CSS и стилей
function checkStyles() {
  console.log('\n🎨 Проверка стилей...');

  const cssFiles = [
    'app/globals.css',
    'app/styles/premium-design-system.css',
    'app/styles/premium-glass-sections.css',
    'app/styles/mobile-fixes.css',
  ];

  cssFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');

      // Проверка медиа-запросов для адаптивности
      if (content.includes('@media')) {
        successes.push(`✅ Адаптивные стили найдены в: ${file}`);
      } else {
        warnings.push(`⚠️  Отсутствуют медиа-запросы в: ${file}`);
      }

      // Проверка CSS переменных
      if (content.includes(':root') || content.includes('--')) {
        successes.push(`✅ CSS переменные используются в: ${file}`);
      }
    }
  });
}

// 5. Проверка компонентов
function checkComponents() {
  console.log('\n🧩 Проверка компонентов...');

  const componentsDir = path.join(process.cwd(), 'app/components');

  if (fs.existsSync(componentsDir)) {
    const components = fs
      .readdirSync(componentsDir)
      .filter((file) => file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx'));

    components.forEach((component) => {
      const filePath = path.join(componentsDir, component);
      const content = fs.readFileSync(filePath, 'utf8');

      // Проверка на use client
      if (!content.includes("'use client'") && !content.includes('"use client"')) {
        warnings.push(`⚠️  Компонент ${component} не имеет 'use client' директивы`);
      }

      // Проверка на экспорт
      if (!content.includes('export default') && !content.includes('export {')) {
        issues.push(`❌ Компонент ${component} не имеет экспорта`);
      }

      // Проверка на обработку ошибок
      if (content.includes('try') && content.includes('catch')) {
        successes.push(`✅ Обработка ошибок в: ${component}`);
      }
    });
  } else {
    issues.push('❌ Директория компонентов не найдена');
  }
}

// 6. Создание тестового HTML для проверки адаптивности
function createResponsiveTest() {
  console.log('\n📱 Создание теста адаптивности...');

  const testHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Тест адаптивности NeuroExpert</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background: #0a0a0a;
      color: #fff;
    }
    .device-frame {
      margin: 20px 0;
      padding: 20px;
      border: 2px solid #fbbf24;
      border-radius: 10px;
      background: #1a1a1a;
    }
    .device-name {
      font-size: 18px;
      color: #fbbf24;
      margin-bottom: 10px;
    }
    iframe {
      border: 1px solid #333;
      border-radius: 5px;
      background: white;
    }
  </style>
</head>
<body>
  <h1>🔍 Тест адаптивности NeuroExpert</h1>
  
  <div class="device-frame">
    <div class="device-name">📱 iPhone 12 Pro (390x844)</div>
    <iframe src="http://localhost:3000" width="390" height="844"></iframe>
  </div>
  
  <div class="device-frame">
    <div class="device-name">📱 iPad (768x1024)</div>
    <iframe src="http://localhost:3000" width="768" height="1024"></iframe>
  </div>
  
  <div class="device-frame">
    <div class="device-name">💻 Laptop (1366x768)</div>
    <iframe src="http://localhost:3000" width="1366" height="768"></iframe>
  </div>
  
  <div class="device-frame">
    <div class="device-name">🖥️ Desktop (1920x1080)</div>
    <iframe src="http://localhost:3000" width="1920" height="1080"></iframe>
  </div>
</body>
</html>
`;

  fs.writeFileSync('responsive-test.html', testHtml);
  console.log('✅ Создан responsive-test.html для проверки адаптивности');
}

// 7. Генерация отчета
function generateReport() {
  console.log('\n📊 Генерация отчета...\n');

  console.log('=== РЕЗУЛЬТАТЫ ПРОВЕРКИ ===\n');

  if (issues.length > 0) {
    console.log('❌ КРИТИЧЕСКИЕ ПРОБЛЕМЫ:');
    issues.forEach((issue) => console.log(`   ${issue}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log('⚠️  ПРЕДУПРЕЖДЕНИЯ:');
    warnings.forEach((warning) => console.log(`   ${warning}`));
    console.log('');
  }

  if (successes.length > 0) {
    console.log('✅ УСПЕШНЫЕ ПРОВЕРКИ:');
    successes.forEach((success) => console.log(`   ${success}`));
    console.log('');
  }

  // Рекомендации
  console.log('📋 РЕКОМЕНДАЦИИ:\n');
  console.log('1. Запустите проект: npm run dev');
  console.log('2. Откройте responsive-test.html в браузере');
  console.log('3. Проверьте все кнопки и ссылки вручную');
  console.log('4. Протестируйте калькулятор ROI');
  console.log('5. Проверьте работу AI управляющего');
  console.log('6. Убедитесь что все тексты корректны');
  console.log('7. Проверьте анимации и графику');

  // Сохранение отчета
  const report = {
    timestamp: new Date().toISOString(),
    issues,
    warnings,
    successes,
    stats: {
      total: issues.length + warnings.length + successes.length,
      critical: issues.length,
      warnings: warnings.length,
      passed: successes.length,
    },
  };

  fs.writeFileSync('debug-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Отчет сохранен в debug-report.json');
}

// Запуск всех проверок
function runAllChecks() {
  checkProjectStructure();
  checkDependencies();
  checkEnvVariables();
  checkStyles();
  checkComponents();
  createResponsiveTest();
  generateReport();
}

// Запуск
runAllChecks();
