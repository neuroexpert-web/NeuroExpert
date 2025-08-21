#!/usr/bin/env node

/**
 * Code Auditor - Автоматический тестировщик кода
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

console.log('🔍 ЗАПУСК АВТОМАТИЧЕСКОГО АУДИТА КОДА...');
console.log('=' .repeat(50));

async function checkSecurity() {
  console.log('\n🔒 Проверка безопасности...');
  
  const patterns = [
    { regex: /password\s*=\s*["'][^"']+["']/gi, msg: 'Хардкод пароля' },
    { regex: /api[_-]?key\s*=\s*["'][^"']+["']/gi, msg: 'API ключ в коде' },
    { regex: /console\.(log|info|debug)/g, msg: 'Console.log в коде' },
  ];
  
  let issues = 0;
  const files = await getJSFiles('./app');
  
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    
    patterns.forEach(({ regex, msg }) => {
      const matches = content.match(regex);
      if (matches) {
        console.log(`❌ ${msg} найден в ${file}: ${matches.length} раз`);
        issues += matches.length;
      }
    });
  }
  
  return issues;
}

async function getJSFiles(dir) {
  const files = [];
  
  async function walk(directory) {
    try {
      const items = await fs.readdir(directory);
      
      for (const item of items) {
        const fullPath = path.join(directory, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          await walk(fullPath);
        } else if (item.match(/\.(js|jsx|ts|tsx)$/)) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip
    }
  }
  
  await walk(dir);
  return files;
}

async function checkDependencies() {
  console.log('\n📦 Проверка зависимостей...');
  
  try {
    const { stdout } = await execAsync('npm audit --json');
    const audit = JSON.parse(stdout);
    
    if (audit.metadata.vulnerabilities) {
      const v = audit.metadata.vulnerabilities;
      console.log(`❌ Найдено уязвимостей: ${v.total} (критических: ${v.critical})`);
      return v.total;
    }
  } catch (e) {
    console.log('✅ Нет уязвимостей в зависимостях');
  }
  
  return 0;
}

async function checkTests() {
  console.log('\n🧪 Проверка тестов...');
  
  const testFiles = await getJSFiles('.');
  const tests = testFiles.filter(f => f.includes('.test.') || f.includes('.spec.'));
  
  console.log(`📊 Найдено тестовых файлов: ${tests.length}`);
  
  if (tests.length < 10) {
    console.log('❌ Мало тестов! Рекомендуется добавить больше тестов');
    return 1;
  }
  
  return 0;
}

async function main() {
  let totalIssues = 0;
  
  totalIssues += await checkSecurity();
  totalIssues += await checkDependencies();
  totalIssues += await checkTests();
  
  console.log('\n' + '=' .repeat(50));
  console.log(`📋 ИТОГО ПРОБЛЕМ: ${totalIssues}`);
  
  if (totalIssues > 0) {
    console.log('❌ Требуется исправить найденные проблемы!');
    process.exit(1);
  } else {
    console.log('✅ Все проверки пройдены успешно!');
  }
}

main().catch(console.error);
