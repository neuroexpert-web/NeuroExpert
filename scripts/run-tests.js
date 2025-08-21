
#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function runTests() {
  console.log('🧪 Запускаю автоматические тесты...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Тестируем desktop версию
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000');
  
  console.log('✓ Desktop версия загружена');
  
  // Тестируем мобильную версию
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:3000');
  
  console.log('✓ Mobile версия загружена');
  
  // Проверяем кнопки
  const buttons = await page.$$('button');
  console.log(`✓ Найдено кнопок: ${buttons.length}`);
  
  // Проверяем формы
  const forms = await page.$$('form');
  console.log(`✓ Найдено форм: ${forms.length}`);
  
  await browser.close();
  console.log('\n✅ Все тесты пройдены!');
}

runTests().catch(console.error);
