#!/usr/bin/env node

/**
 * Скрипт для миграции console.log на централизованный logger
 * Использование: node scripts/migrate-console-logs.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

// Конфигурация
const DIRECTORIES_TO_SCAN = ['app', 'components', 'utils'];
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const EXCLUDE_PATTERNS = ['node_modules', '.next', 'dist', 'build', '__tests__', '.test.'];

// Паттерны для замены
const CONSOLE_PATTERNS = [
  {
    pattern: /console\.log\((.*)\)/g,
    replacement: (match, args) => `logger.info(${args})`,
    level: 'info'
  },
  {
    pattern: /console\.error\((.*)\)/g,
    replacement: (match, args) => `logger.error(${args})`,
    level: 'error'
  },
  {
    pattern: /console\.warn\((.*)\)/g,
    replacement: (match, args) => `logger.warn(${args})`,
    level: 'warn'
  },
  {
    pattern: /console\.debug\((.*)\)/g,
    replacement: (match, args) => `logger.debug(${args})`,
    level: 'debug'
  }
];

// Статистика
let stats = {
  filesScanned: 0,
  filesModified: 0,
  logsReplaced: 0,
  errors: []
};

// Проверка, нужно ли обрабатывать файл
function shouldProcessFile(filePath) {
  // Проверка расширения
  const ext = path.extname(filePath);
  if (!FILE_EXTENSIONS.includes(ext)) return false;

  // Проверка исключений
  for (const pattern of EXCLUDE_PATTERNS) {
    if (filePath.includes(pattern)) return false;
  }

  return true;
}

// Добавление импорта logger если его нет
function addLoggerImport(content, filePath) {
  // Проверяем, есть ли уже импорт logger
  if (content.includes('import { logger }') || content.includes('const logger =')) {
    return content;
  }

  // Определяем правильный путь импорта
  const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'app/utils/logger.js'));
  const importPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;

  // Добавляем импорт после других импортов
  const importStatement = `import { logger } from '${importPath.replace(/\\/g, '/')}';\n`;
  
  // Находим место для вставки (после последнего import)
  const lastImportIndex = content.lastIndexOf('\nimport ');
  if (lastImportIndex !== -1) {
    const endOfImport = content.indexOf('\n', lastImportIndex + 1);
    return content.slice(0, endOfImport + 1) + importStatement + content.slice(endOfImport + 1);
  }

  // Если импортов нет, добавляем в начало файла
  return importStatement + '\n' + content;
}

// Обработка файла
function processFile(filePath, isDryRun) {
  stats.filesScanned++;

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let replacements = 0;

    // Проверяем каждый паттерн
    for (const { pattern, replacement } of CONSOLE_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        replacements += matches.length;
        if (!isDryRun) {
          content = content.replace(pattern, replacement);
        }
        modified = true;
      }
    }

    if (modified) {
      stats.filesModified++;
      stats.logsReplaced += replacements;

      if (!isDryRun) {
        // Добавляем импорт logger
        content = addLoggerImport(content, filePath);
        
        // Сохраняем файл
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Modified: ${filePath} (${replacements} replacements)`);
      } else {
        console.log(`🔍 Would modify: ${filePath} (${replacements} replacements)`);
      }
    }
  } catch (error) {
    stats.errors.push({ file: filePath, error: error.message });
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

// Рекурсивный обход директорий
function scanDirectory(dirPath, isDryRun) {
  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory() && !EXCLUDE_PATTERNS.some(p => item.includes(p))) {
        scanDirectory(itemPath, isDryRun);
      } else if (stat.isFile() && shouldProcessFile(itemPath)) {
        processFile(itemPath, isDryRun);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}: ${error.message}`);
  }
}

// Главная функция
function main() {
  const isDryRun = process.argv.includes('--dry-run');
  
  console.log('🔍 Console.log Migration Script');
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log('----------------------------\n');

  // Сканируем директории
  for (const dir of DIRECTORIES_TO_SCAN) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      console.log(`Scanning ${dir}...`);
      scanDirectory(dirPath, isDryRun);
    }
  }

  // Выводим статистику
  console.log('\n📊 Migration Statistics:');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Console.logs replaced: ${stats.logsReplaced}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n❌ Errors: ${stats.errors.length}`);
    stats.errors.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  if (isDryRun) {
    console.log('\n💡 This was a dry run. Use without --dry-run to apply changes.');
  } else {
    console.log('\n✅ Migration completed!');
  }
}

// Запуск
main();