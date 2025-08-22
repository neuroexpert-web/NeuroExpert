#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories and files to exclude
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'coverage',
  'scripts', // Don't modify script files
  'public/sw.js' // Service worker needs console
];

const EXCLUDE_FILES = [
  'logger.js', // Don't modify the logger itself
  'replace-console-logs.js', // Don't modify this script
  'generate-password.js', // Keep console in CLI tools
  'generate-password-hash.js',
  'test-*.js', // Keep console in test files
  'jest.setup.js',
  'jest.config.js'
];

// Files that need special handling
const API_ROUTES_PATTERN = /\/api\//;
const COMPONENT_PATTERN = /\/components\//;
const SERVERLESS_PATTERN = /\/functions\//;

function shouldProcessFile(filePath) {
  const fileName = path.basename(filePath);
  
  // Check excluded files
  if (EXCLUDE_FILES.some(exclude => fileName.includes(exclude))) {
    return false;
  }
  
  // Check excluded directories
  if (EXCLUDE_DIRS.some(dir => filePath.includes(`/${dir}/`))) {
    return false;
  }
  
  return true;
}

function determineLoggerImport(filePath) {
  if (API_ROUTES_PATTERN.test(filePath)) {
    return "import { createLogger } from '@/app/utils/logger';";
  } else if (COMPONENT_PATTERN.test(filePath)) {
    return "import { createLogger } from '@/app/utils/logger';";
  } else if (SERVERLESS_PATTERN.test(filePath)) {
    return "const { createLogger } = require('../app/utils/logger');";
  } else {
    // Default for other files
    return "import { createLogger } from './utils/logger';";
  }
}

function determineLoggerName(filePath) {
  const fileName = path.basename(filePath, path.extname(filePath));
  
  if (API_ROUTES_PATTERN.test(filePath)) {
    return fileName.charAt(0).toUpperCase() + fileName.slice(1) + 'API';
  } else if (COMPONENT_PATTERN.test(filePath)) {
    return fileName;
  } else {
    return fileName.charAt(0).toUpperCase() + fileName.slice(1);
  }
}

function replaceConsoleInFile(filePath) {
  if (!shouldProcessFile(filePath)) {
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file has console statements
  if (!content.match(/console\.(log|error|warn|debug|info)/)) {
    return false;
  }
  
  // Check if logger is already imported
  const hasLoggerImport = content.includes('createLogger') || content.includes('logger');
  
  if (!hasLoggerImport) {
    // Add logger import
    const importStatement = determineLoggerImport(filePath);
    const loggerName = determineLoggerName(filePath);
    
    // Add import at the top after existing imports
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      // For ES modules
      const importMatch = content.match(/^(import[\s\S]*?(?:from\s+['"][^'"]+['"];?\s*\n)+)/m);
      if (importMatch) {
        content = content.replace(importMatch[0], importMatch[0] + `${importStatement}\n`);
      } else {
        content = `${importStatement}\n\n${content}`;
      }
      
      // Add logger instance
      const afterImports = content.indexOf('\n\n', content.indexOf(importStatement)) + 2;
      content = content.slice(0, afterImports) + 
        `const logger = createLogger('${loggerName}');\n\n` + 
        content.slice(afterImports);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      // For TypeScript files, be more careful with imports
      const importMatch = content.match(/^(import[\s\S]*?(?:from\s+['"][^'"]+['"];?\s*\n)+)/m);
      if (importMatch) {
        content = content.replace(importMatch[0], importMatch[0] + `${importStatement}\n`);
      } else {
        content = `${importStatement}\n\n${content}`;
      }
      
      // Add logger instance after imports
      const afterImports = content.indexOf('\n\n', content.indexOf(importStatement)) + 2;
      content = content.slice(0, afterImports) + 
        `const logger = createLogger('${loggerName}');\n\n` + 
        content.slice(afterImports);
    }
    
    modified = true;
  }
  
  // Replace console statements
  const replacements = [
    { from: /console\.log\(/g, to: 'logger.info(' },
    { from: /console\.error\(/g, to: 'logger.error(' },
    { from: /console\.warn\(/g, to: 'logger.warn(' },
    { from: /console\.debug\(/g, to: 'logger.debug(' },
    { from: /console\.info\(/g, to: 'logger.info(' }
  ];
  
  for (const { from, to } of replacements) {
    if (content.match(from)) {
      content = content.replace(from, to);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let count = 0;
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(item)) {
        count += processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        if (replaceConsoleInFile(fullPath)) {
          count++;
        }
      }
    }
  }
  
  return count;
}

// Main execution
console.log('🔄 Starting console.log replacement...\n');

const rootDirs = ['app', 'netlify/functions', 'utils'];
let totalUpdated = 0;

for (const dir of rootDirs) {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`📁 Processing ${dir}/...`);
    const count = processDirectory(dirPath);
    totalUpdated += count;
    console.log(`   Updated ${count} files in ${dir}/\n`);
  }
}

console.log(`\n✨ Complete! Updated ${totalUpdated} files total.`);
console.log('\n📝 Next steps:');
console.log('1. Review the changes with git diff');
console.log('2. Test the application');
console.log('3. Add ESLint rule to prevent future console.log usage');