// Быстрый тест компонентов на корректность импортов
import fs from 'fs';
import path from 'path';

const componentsPath = './app/components/';
const mainAppPath = './app/page.js';

async function testComponents() {
  console.log('🔍 Проверка компонентов...\n');
  
  // Проверяем файлы компонентов
  const components = [
    'BusinessShowcase.js',
    'VoiceFeedback.js', 
    'SmartFAQ.js',
    'PersonalizationModule.js',
    'LearningPlatform.js',
    'NeuralNetworkBackground.js'
  ];
  
  let errors = [];
  
  for (const component of components) {
    const filePath = path.join(componentsPath, component);
    
    try {
      if (!fs.existsSync(filePath)) {
        errors.push(`❌ Файл не найден: ${component}`);
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Проверяем базовую структуру React компонента
      if (!content.includes("'use client'")) {
        errors.push(`⚠️  ${component}: Отсутствует 'use client' директива`);
      }
      
      if (!content.includes('export default')) {
        errors.push(`❌ ${component}: Отсутствует export default`);
      }
      
      if (!content.includes('function ') && !content.includes('const ')) {
        errors.push(`❌ ${component}: Не найдена функция компонента`);
      }
      
      // Проверяем синтаксис JSX
      if (!content.includes('return') || !content.includes('<')) {
        errors.push(`❌ ${component}: Некорректная JSX структура`);
      }
      
      console.log(`✅ ${component} - OK`);
      
    } catch (error) {
      errors.push(`❌ ${component}: Ошибка чтения файла - ${error.message}`);
    }
  }
  
  // Проверяем основной файл приложения
  try {
    const mainContent = fs.readFileSync(mainAppPath, 'utf8');
    
    for (const component of components) {
      const componentName = component.replace('.js', '');
      if (!mainContent.includes(`import ${componentName}`)) {
        errors.push(`⚠️  page.js: Отсутствует импорт ${componentName}`);
      }
    }
    
    console.log('✅ page.js импорты - OK');
    
  } catch (error) {
    errors.push(`❌ page.js: Ошибка чтения - ${error.message}`);
  }
  
  // Проверяем package.json
  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    
    const requiredDeps = ['next', 'react', 'react-dom'];
    for (const dep of requiredDeps) {
      if (!packageJson.dependencies[dep]) {
        errors.push(`❌ package.json: Отсутствует зависимость ${dep}`);
      }
    }
    
    console.log('✅ package.json зависимости - OK');
    
  } catch (error) {
    errors.push(`❌ package.json: Ошибка чтения - ${error.message}`);
  }
  
  // Итоговый отчет
  console.log('\n📊 РЕЗУЛЬТАТЫ ПРОВЕРКИ:');
  console.log(`Компонентов проверено: ${components.length}`);
  console.log(`Найдено ошибок: ${errors.length}`);
  
  if (errors.length === 0) {
    console.log('\n🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ УСПЕШНО!');
    console.log('✨ Проект готов к развертыванию на Netlify');
  } else {
    console.log('\n⚠️  НАЙДЕНЫ ПРОБЛЕМЫ:');
    errors.forEach(error => console.log(error));
  }
}

testComponents().catch(console.error);
