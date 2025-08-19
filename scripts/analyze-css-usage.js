#!/usr/bin/env node

/**
 * Анализ использования CSS классов в проекте
 * Помогает найти неиспользуемые стили
 */

const fs = require('fs');
const path = require('path');

// Конфигурация
const CSS_FILE = path.join(process.cwd(), 'app', 'globals.css');
const SCAN_DIRS = ['app', 'components'];
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Статистика
let stats = {
  totalClasses: 0,
  usedClasses: new Set(),
  unusedClasses: new Set(),
  fileScanned: 0
};

// Извлечение CSS классов из файла
function extractCSSClasses(cssContent) {
  const classRegex = /\.([a-zA-Z0-9_-]+)(?:\s*{|:)/g;
  const classes = new Set();
  let match;
  
  while ((match = classRegex.exec(cssContent)) !== null) {
    classes.add(match[1]);
  }
  
  return classes;
}

// Поиск использования классов в JS/JSX файлах
function findClassUsageInFile(filePath, classes) {
  const content = fs.readFileSync(filePath, 'utf8');
  const usedClasses = new Set();
  
  // Паттерны для поиска классов
  const patterns = [
    /className=["|']([^"']+)["|']/g,  // className="class"
    /className={[`|"]([^`"]+)[`|"]}/g, // className={`class`}
    /classList\.add\(["|']([^"']+)["|']\)/g, // classList.add
    /\.([a-zA-Z0-9_-]+)/g // Для CSS модулей
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const classNames = match[1].split(/\s+/);
      classNames.forEach(className => {
        if (classes.has(className)) {
          usedClasses.add(className);
        }
      });
    }
  });
  
  return usedClasses;
}

// Рекурсивный обход директорий
function scanDirectory(dirPath, classes) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory() && !item.includes('node_modules')) {
      scanDirectory(itemPath, classes);
    } else if (stat.isFile() && FILE_EXTENSIONS.includes(path.extname(item))) {
      stats.fileScanned++;
      const usedClasses = findClassUsageInFile(itemPath, classes);
      usedClasses.forEach(cls => stats.usedClasses.add(cls));
    }
  });
}

// Анализ размера CSS правил
function analyzeCSSSize(cssContent, unusedClasses) {
  let totalSize = cssContent.length;
  let unusedSize = 0;
  
  unusedClasses.forEach(className => {
    // Примерная оценка размера неиспользуемых правил
    const regex = new RegExp(`\\.${className}[^{]*{[^}]*}`, 'g');
    const matches = cssContent.match(regex);
    if (matches) {
      matches.forEach(match => {
        unusedSize += match.length;
      });
    }
  });
  
  return {
    totalSize,
    unusedSize,
    percentage: ((unusedSize / totalSize) * 100).toFixed(2)
  };
}

// Главная функция
function main() {
  console.log('🔍 Анализ использования CSS...\n');
  
  // Читаем CSS файл
  const cssContent = fs.readFileSync(CSS_FILE, 'utf8');
  const cssClasses = extractCSSClasses(cssContent);
  stats.totalClasses = cssClasses.size;
  
  console.log(`📋 Найдено CSS классов: ${stats.totalClasses}`);
  
  // Сканируем использование
  SCAN_DIRS.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      console.log(`📂 Сканирование ${dir}...`);
      scanDirectory(dirPath, cssClasses);
    }
  });
  
  // Вычисляем неиспользуемые классы
  cssClasses.forEach(cls => {
    if (!stats.usedClasses.has(cls)) {
      stats.unusedClasses.add(cls);
    }
  });
  
  // Анализ размера
  const sizeAnalysis = analyzeCSSSize(cssContent, stats.unusedClasses);
  
  // Выводим результаты
  console.log('\n📊 Результаты анализа:');
  console.log(`Файлов просканировано: ${stats.fileScanned}`);
  console.log(`Всего CSS классов: ${stats.totalClasses}`);
  console.log(`Используется классов: ${stats.usedClasses.size} (${((stats.usedClasses.size / stats.totalClasses) * 100).toFixed(2)}%)`);
  console.log(`Не используется классов: ${stats.unusedClasses.size} (${((stats.unusedClasses.size / stats.totalClasses) * 100).toFixed(2)}%)`);
  
  console.log('\n💾 Анализ размера:');
  console.log(`Общий размер CSS: ${(sizeAnalysis.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Размер неиспользуемого CSS: ${(sizeAnalysis.unusedSize / 1024).toFixed(2)} KB (${sizeAnalysis.percentage}%)`);
  console.log(`Потенциальная экономия: ${(sizeAnalysis.unusedSize / 1024).toFixed(2)} KB`);
  
  // Выводим топ неиспользуемых классов
  if (stats.unusedClasses.size > 0) {
    console.log('\n🚫 Примеры неиспользуемых классов:');
    const unusedArray = Array.from(stats.unusedClasses);
    unusedArray.slice(0, 20).forEach(cls => {
      console.log(`  - .${cls}`);
    });
    
    if (unusedArray.length > 20) {
      console.log(`  ... и еще ${unusedArray.length - 20} классов`);
    }
  }
  
  // Сохраняем отчет
  const report = {
    date: new Date().toISOString(),
    stats: {
      totalClasses: stats.totalClasses,
      usedClasses: stats.usedClasses.size,
      unusedClasses: stats.unusedClasses.size,
      filesScanned: stats.fileScanned
    },
    sizeAnalysis,
    unusedClasses: Array.from(stats.unusedClasses)
  };
  
  fs.writeFileSync('css-usage-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Подробный отчет сохранен в css-usage-report.json');
}

// Запуск
main();