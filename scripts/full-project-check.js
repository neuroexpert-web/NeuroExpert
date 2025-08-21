#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 ПОЛНАЯ ПРОВЕРКА ПРОЕКТА NEUROEXPERT\n');
console.log('=====================================\n');

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

// Проверка 1: Dev сервер
function checkDevServer() {
  console.log('1️⃣ Проверка dev сервера...');
  try {
    execSync('curl -s http://localhost:3000 > /dev/null 2>&1');
    results.passed.push('Dev сервер работает на порту 3000');
    return true;
  } catch (error) {
    results.failed.push('Dev сервер не запущен. Запустите: npm run dev');
    return false;
  }
}

// Проверка 2: Основные страницы
async function checkPages() {
  console.log('\n2️⃣ Проверка основных страниц...');

  const pages = [
    { url: 'http://localhost:3000', name: 'Главная страница' },
    { url: 'http://localhost:3000/api-docs', name: 'API документация' },
    { url: 'http://localhost:3000/design-showcase', name: 'Showcase дизайна' },
    { url: 'http://localhost:3000/test-sentry', name: 'Тест Sentry' },
  ];

  for (const page of pages) {
    try {
      const response = await fetch(page.url);
      if (response.ok) {
        results.passed.push(`✅ ${page.name} доступна`);
      } else {
        results.failed.push(`❌ ${page.name} вернула ошибку ${response.status}`);
      }
    } catch (error) {
      results.failed.push(`❌ ${page.name} недоступна`);
    }
  }
}

// Проверка 3: Компоненты на главной
async function checkMainComponents() {
  console.log('\n3️⃣ Проверка компонентов главной страницы...');

  try {
    const response = await fetch('http://localhost:3000');
    const html = await response.text();

    const components = [
      { name: 'Hero секция', pattern: /NeuroExpert|AI.*Директор|нейросети/i },
      { name: 'Форма обратной связи', pattern: /contact|ContactForm|Оставьте заявку/i },
      { name: 'Калькулятор ROI', pattern: /roi|ROICalculator|Калькулятор.*выгоды/i },
      { name: 'AI чат', pattern: /SmartFloatingAI|AI.*ассистент/i },
      { name: 'Секция возможностей', pattern: /AIDirectorCapabilities|Возможности/i },
      { name: 'Секция "Почему мы"', pattern: /WhyUsSection|Почему.*выбирают/i },
      { name: 'Секция цен', pattern: /PricingSection|Тарифы|Стоимость/i },
    ];

    components.forEach((comp) => {
      if (comp.pattern.test(html)) {
        results.passed.push(`✅ ${comp.name} найдена`);
      } else {
        results.failed.push(`❌ ${comp.name} НЕ найдена`);
      }
    });

    // Проверка заголовков
    const h1Count = (html.match(/<h1/g) || []).length;
    const h2Count = (html.match(/<h2/g) || []).length;

    if (h1Count > 0) {
      results.passed.push(`✅ Найдено ${h1Count} заголовков H1`);
    } else {
      results.failed.push('❌ Заголовки H1 не найдены');
    }

    if (h2Count > 0) {
      results.passed.push(`✅ Найдено ${h2Count} заголовков H2`);
    } else {
      results.warnings.push('⚠️ Заголовки H2 не найдены');
    }
  } catch (error) {
    results.failed.push('❌ Ошибка при проверке компонентов');
  }
}

// Проверка 4: API endpoints
async function checkAPIEndpoints() {
  console.log('\n4️⃣ Проверка API endpoints...');

  const endpoints = [
    {
      url: 'http://localhost:3000/api/health',
      method: 'GET',
      name: 'Health check',
    },
    {
      url: 'http://localhost:3000/api/contact-form',
      method: 'POST',
      name: 'Форма обратной связи',
      body: {
        name: 'Тест',
        email: 'test@test.com',
        phone: '+7 999 123-45-67',
        message: 'Тестовое сообщение',
      },
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const options = {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body);
      }

      const response = await fetch(endpoint.url, options);

      if (response.ok) {
        results.passed.push(`✅ API ${endpoint.name} работает`);
      } else {
        results.failed.push(`❌ API ${endpoint.name} вернул ошибку ${response.status}`);
      }
    } catch (error) {
      results.failed.push(`❌ API ${endpoint.name} недоступен`);
    }
  }
}

// Проверка 5: Мобильная версия
async function checkMobileVersion() {
  console.log('\n5️⃣ Проверка мобильной адаптации...');

  try {
    const response = await fetch('http://localhost:3000', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      },
    });
    const html = await response.text();

    // Проверка мобильных стилей
    if (html.includes('mobile:') || html.includes('sm:') || html.includes('@media')) {
      results.passed.push('✅ Мобильные стили найдены');
    } else {
      results.warnings.push('⚠️ Мобильные стили могут отсутствовать');
    }

    // Проверка viewport
    if (html.includes('viewport')) {
      results.passed.push('✅ Viewport meta тег настроен');
    } else {
      results.failed.push('❌ Viewport meta тег не найден');
    }
  } catch (error) {
    results.failed.push('❌ Ошибка при проверке мобильной версии');
  }
}

// Проверка 6: Кнопки и ссылки
async function checkButtonsAndLinks() {
  console.log('\n6️⃣ Проверка кнопок и ссылок...');

  try {
    const response = await fetch('http://localhost:3000');
    const html = await response.text();

    // Подсчет элементов
    const buttonCount = (html.match(/<button/g) || []).length;
    const linkCount = (html.match(/<a\s/g) || []).length;
    const formCount = (html.match(/<form/g) || []).length;

    if (buttonCount > 0) {
      results.passed.push(`✅ Найдено ${buttonCount} кнопок`);
    } else {
      results.warnings.push('⚠️ Кнопки не найдены');
    }

    if (linkCount > 0) {
      results.passed.push(`✅ Найдено ${linkCount} ссылок`);
    } else {
      results.warnings.push('⚠️ Ссылки не найдены');
    }

    if (formCount > 0) {
      results.passed.push(`✅ Найдено ${formCount} форм`);
    } else {
      results.failed.push('❌ Формы не найдены');
    }

    // Проверка пустых ссылок
    const emptyLinks = (html.match(/href=["']#["']/g) || []).length;
    if (emptyLinks > 0) {
      results.warnings.push(`⚠️ Найдено ${emptyLinks} пустых ссылок (href="#")`);
    }
  } catch (error) {
    results.failed.push('❌ Ошибка при проверке кнопок и ссылок');
  }
}

// Проверка 7: Файлы и структура
function checkProjectStructure() {
  console.log('\n7️⃣ Проверка структуры проекта...');

  const requiredFiles = [
    'package.json',
    'next.config.js',
    'app/layout.js',
    'app/page.js',
    'app/globals.css',
    '.gitignore',
    'README.md',
  ];

  const requiredDirs = ['app/components', 'app/api', 'public', 'scripts'];

  requiredFiles.forEach((file) => {
    if (fs.existsSync(path.join('/workspace', file))) {
      results.passed.push(`✅ Файл ${file} существует`);
    } else {
      results.failed.push(`❌ Файл ${file} НЕ найден`);
    }
  });

  requiredDirs.forEach((dir) => {
    if (fs.existsSync(path.join('/workspace', dir))) {
      results.passed.push(`✅ Директория ${dir} существует`);
    } else {
      results.failed.push(`❌ Директория ${dir} НЕ найдена`);
    }
  });
}

// Проверка 8: Переменные окружения
function checkEnvVariables() {
  console.log('\n8️⃣ Проверка переменных окружения...');

  const envFile = path.join('/workspace', '.env.local');
  const envExampleFile = path.join('/workspace', '.env.example');

  if (fs.existsSync(envFile)) {
    results.passed.push('✅ Файл .env.local существует');
  } else {
    results.warnings.push('⚠️ Файл .env.local не найден');
  }

  if (fs.existsSync(envExampleFile)) {
    results.passed.push('✅ Файл .env.example существует');

    // Читаем пример переменных
    const envExample = fs.readFileSync(envExampleFile, 'utf8');
    const requiredVars = envExample.match(/^[A-Z_]+=/gm) || [];

    if (requiredVars.length > 0) {
      results.warnings.push(`⚠️ Требуется настроить ${requiredVars.length} переменных окружения`);
    }
  }
}

// Главная функция
async function runFullCheck() {
  const serverRunning = checkDevServer();

  if (!serverRunning) {
    console.log('\n❌ КРИТИЧЕСКАЯ ОШИБКА: Dev сервер не запущен!');
    console.log('Запустите сервер командой: npm run dev');
    console.log('Затем запустите проверку снова.');
    return;
  }

  await checkPages();
  await checkMainComponents();
  await checkAPIEndpoints();
  await checkMobileVersion();
  await checkButtonsAndLinks();
  checkProjectStructure();
  checkEnvVariables();

  // Итоговый отчет
  console.log('\n\n📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('=================\n');

  console.log(`✅ Успешно: ${results.passed.length}`);
  console.log(`❌ Ошибки: ${results.failed.length}`);
  console.log(`⚠️  Предупреждения: ${results.warnings.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ НАЙДЕННЫЕ ПРОБЛЕМЫ:');
    results.failed.forEach((fail) => console.log(`   ${fail}`));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  ПРЕДУПРЕЖДЕНИЯ:');
    results.warnings.forEach((warn) => console.log(`   ${warn}`));
  }

  // Рекомендации
  console.log('\n💡 РЕКОМЕНДАЦИИ:');

  if (results.failed.length === 0) {
    console.log('✅ Проект работает отлично! Все основные компоненты функционируют.');
  } else {
    console.log('1. Исправьте критические ошибки (красные)');
    console.log('2. Проверьте предупреждения (желтые)');
    console.log('3. Запустите проверку снова после исправлений');
  }

  console.log('\n📱 Для проверки на реальном устройстве:');
  console.log('1. Узнайте IP вашего компьютера: ifconfig или ipconfig');
  console.log('2. Откройте на телефоне: http://ВАШ_IP:3000');

  // Сохраняем отчет
  const report = {
    timestamp: new Date().toISOString(),
    passed: results.passed.length,
    failed: results.failed.length,
    warnings: results.warnings.length,
    details: results,
  };

  fs.writeFileSync(path.join('/workspace', 'check-report.json'), JSON.stringify(report, null, 2));

  console.log('\n📄 Полный отчет сохранен в check-report.json');
}

// Запуск проверки
runFullCheck().catch(console.error);
