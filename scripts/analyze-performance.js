#!/usr/bin/env node

/**
 * Скрипт анализа производительности NeuroExpert
 * Дата: 20.01.2025
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Анализ производительности NeuroExpert\n');

// Анализ размеров файлов
function analyzeFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
    
    if (sizeInMB > 0.1) {
      return `${sizeInMB} MB`;
    }
    return `${sizeInKB} KB`;
  } catch (err) {
    return 'Не найден';
  }
}

// Проверяем критические файлы
const criticalFiles = [
  { path: 'app/page.js', maxSize: 200 }, // KB
  { path: 'app/globals.css', maxSize: 100 },
  { path: 'package.json', maxSize: 10 },
  { path: 'app/layout.js', maxSize: 50 }
];

console.log('📊 Размеры критических файлов:');
console.log('─'.repeat(50));

criticalFiles.forEach(file => {
  const size = analyzeFileSize(file.path);
  const sizeInKB = parseFloat(size);
  const status = sizeInKB > file.maxSize ? '⚠️  БОЛЬШОЙ' : '✅';
  console.log(`${status} ${file.path}: ${size}`);
});

// Анализ импортов
console.log('\n📦 Анализ динамических импортов:');
console.log('─'.repeat(50));

const pageContent = fs.readFileSync('app/page.js', 'utf8');
const dynamicImports = pageContent.match(/dynamic\(\(\) => import\(.+?\)/g) || [];
console.log(`Найдено динамических импортов: ${dynamicImports.length}`);

// Поиск тяжелых зависимостей
console.log('\n⚡ Потенциальные проблемы производительности:');
console.log('─'.repeat(50));

const issues = [];

// Проверка на большие файлы
if (pageContent.length > 100000) {
  issues.push('- app/page.js слишком большой (> 100KB)');
}

// Проверка на инлайн стили
const inlineStyles = pageContent.match(/style={{[^}]+}}/g) || [];
if (inlineStyles.length > 20) {
  issues.push(`- Много инлайн стилей (${inlineStyles.length})`);
}

// Проверка на console.log
const consoleLogs = pageContent.match(/console\.log/g) || [];
if (consoleLogs.length > 5) {
  issues.push(`- Много console.log (${consoleLogs.length})`);
}

if (issues.length === 0) {
  console.log('✅ Серьезных проблем не обнаружено');
} else {
  issues.forEach(issue => console.log(issue));
}

// Рекомендации по оптимизации
console.log('\n💡 Рекомендации по оптимизации:');
console.log('─'.repeat(50));

const recommendations = [
  '1. Использовать React.memo для тяжелых компонентов',
  '2. Добавить lazy loading для изображений',
  '3. Минифицировать CSS и JS файлы',
  '4. Использовать Web Workers для тяжелых вычислений',
  '5. Включить gzip компрессию на сервере'
];

recommendations.forEach(rec => console.log(rec));

// Создание отчета
const report = {
  date: new Date().toISOString(),
  fileSizes: criticalFiles.map(file => ({
    path: file.path,
    size: analyzeFileSize(file.path),
    maxSize: file.maxSize + ' KB'
  })),
  dynamicImports: dynamicImports.length,
  issues: issues,
  recommendations: recommendations
};

fs.writeFileSync(
  'performance-report.json',
  JSON.stringify(report, null, 2)
);

console.log('\n✅ Отчет сохранен в performance-report.json');