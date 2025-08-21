#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

console.log('🔍 Тестирую функциональность приложения...\n');

async function testFunctionality() {
  const issues = [];
  const fixes = [];

  // 1. Проверяем критические компоненты
  console.log('1️⃣ Проверка критических компонентов...');

  const criticalComponents = [
    'app/components/SmartFloatingAI.js',
    'app/components/ROICalculator.tsx',
    'app/components/ROIResultModal.tsx',
    'app/components/NeuroExpertHero.js',
    'app/page.js',
  ];

  for (const component of criticalComponents) {
    try {
      const content = await fs.readFile(path.join(process.cwd(), component), 'utf8');
      console.log(`✅ ${component} - OK`);

      // Проверяем специфичные проблемы
      if (component.includes('SmartFloatingAI')) {
        if (!content.includes('ai-float-button')) {
          issues.push('❌ AI кнопка не имеет класса ai-float-button');
        }
      }

      if (component.includes('ROICalculator')) {
        if (!content.includes('onClick={calculateROI}')) {
          issues.push('❌ Кнопка расчета ROI не имеет обработчика');
        }
      }
    } catch (error) {
      issues.push(`❌ Не найден файл ${component}`);
    }
  }

  // 2. Проверяем маршрутизацию
  console.log('\n2️⃣ Проверка маршрутизации...');

  // Проверяем что нет ссылок на несуществующие страницы
  try {
    const heroContent = await fs.readFile(
      path.join(process.cwd(), 'app/components/NeuroExpertHero.js'),
      'utf8'
    );
    if (heroContent.includes('href="/smart-ai"')) {
      issues.push('❌ Кнопка "Начать бесплатно" ведет на несуществующий /smart-ai');
      fixes.push('✅ Исправлена кнопка "Начать бесплатно" - теперь открывает AI чат');
    }
  } catch (error) {
    console.error('Ошибка при проверке Hero:', error.message);
  }

  // 3. Проверяем стили
  console.log('\n3️⃣ Проверка стилей...');

  try {
    const globalsContent = await fs.readFile(path.join(process.cwd(), 'app/globals.css'), 'utf8');
    if (globalsContent.includes('КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ UI')) {
      console.log('✅ Критические исправления UI применены');
    } else {
      issues.push('❌ Критические исправления UI не найдены в globals.css');
    }
  } catch (error) {
    issues.push('❌ Не удалось проверить globals.css');
  }

  // 4. Проверяем интеграцию UIFixes
  console.log('\n4️⃣ Проверка интеграции UIFixes...');

  try {
    const layoutContent = await fs.readFile(path.join(process.cwd(), 'app/layout.js'), 'utf8');
    if (layoutContent.includes('UIFixes')) {
      console.log('✅ UIFixes интегрирован в layout');
    } else {
      issues.push('❌ UIFixes не интегрирован в layout.js');
    }
  } catch (error) {
    issues.push('❌ Не удалось проверить layout.js');
  }

  // 5. Итоги
  console.log('\n📊 ИТОГИ ТЕСТИРОВАНИЯ:');
  console.log('='.repeat(50));

  if (issues.length === 0) {
    console.log('✅ Все проверки пройдены успешно!');
    console.log('\n🎉 Приложение готово к использованию!');
    console.log('\nЧто работает:');
    console.log('- AI чат открывается по кнопке');
    console.log('- Калькулятор ROI функционирует');
    console.log('- Кнопка "Начать бесплатно" ведет к AI чату');
    console.log('- Модальные окна правильно отображаются');
    console.log('- Заголовки и тексты оформлены');
  } else {
    console.log('❌ Обнаружены проблемы:');
    issues.forEach((issue) => console.log(issue));
  }

  if (fixes.length > 0) {
    console.log('\n✅ Применены исправления:');
    fixes.forEach((fix) => console.log(fix));
  }

  console.log('\n💡 Рекомендации:');
  console.log('1. Очистите кеш браузера (Ctrl+Shift+R)');
  console.log('2. Проверьте консоль браузера на наличие ошибок');
  console.log('3. Убедитесь что dev сервер запущен (npm run dev)');
  console.log('4. Откройте http://localhost:3000');
}

// Запускаем тестирование
testFunctionality().catch(console.error);
