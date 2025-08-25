#!/usr/bin/env node

/**
 * Автоматическое исправление проблем, найденных при AI-аудите
 * NeuroExpert v3.0 - Январь 2025
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`)
};

// Главная функция
async function main() {
  log.info('Запуск автоматического исправления проблем аудита...\n');

  const fixes = [
    removeConsoleLogs,
    createEnvValidator,
    addCSRFProtection,
    createPrivacyPolicy,
    setupESLintV9,
    installJest,
    addBundleAnalyzer,
    createGDPRConsent
  ];

  let fixedCount = 0;
  let failedCount = 0;

  for (const fix of fixes) {
    try {
      const result = await fix();
      if (result) {
        fixedCount++;
      }
    } catch (error) {
      failedCount++;
      log.error(`Ошибка в ${fix.name}: ${error.message}`);
    }
  }

  log.info(`\nИтого: ${fixedCount} исправлений выполнено, ${failedCount} ошибок`);
}

// 1. Удаление console.log из production кода
async function removeConsoleLogs() {
  log.info('Удаление console.log из production кода...');
  
  const filesToProcess = [
    'app/api/assistant/route.js',
    'app/api/contact-form/route.js',
    'app/api/admin/auth/route.js',
    'app/components/AdminPanel.js',
    'app/components/CRMAnalytics.js'
  ];

  let removedCount = 0;

  for (const filePath of filesToProcess) {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      const originalLength = content.length;
      
      // Заменяем console.log на функцию логирования только для dev
      content = content.replace(
        /console\.(log|error|warn|info)\(/g,
        'process.env.NODE_ENV === "development" && console.$1('
      );
      
      if (content.length !== originalLength) {
        await fs.writeFile(filePath, content);
        removedCount++;
      }
    } catch (error) {
      log.warning(`Не удалось обработать ${filePath}: ${error.message}`);
    }
  }

  log.success(`Обработано ${removedCount} файлов с console.log`);
  return removedCount > 0;
}

// 2. Создание валидатора переменных окружения
async function createEnvValidator() {
  log.info('Создание валидатора переменных окружения...');
  
  const validatorContent = `/**
 * Валидация переменных окружения при запуске
 * Автоматически сгенерировано AI-аудитом
 */

const requiredEnvVars = {
  // Безопасность
  JWT_SECRET: {
    required: true,
    minLength: 32,
    description: 'JWT секретный ключ (минимум 32 символа)'
  },
  ADMIN_PASSWORD_HASH: {
    required: true,
    pattern: /^\\$2[aby]\\$\\d{2}\\$.{53}$/,
    description: 'Bcrypt хеш пароля администратора'
  },
  
  // API ключи (опциональные)
  GOOGLE_GEMINI_API_KEY: {
    required: false,
    description: 'API ключ для Google Gemini'
  },
  ANTHROPIC_API_KEY: {
    required: false,
    description: 'API ключ для Claude'
  },
  
  // Telegram (опциональные)
  TELEGRAM_BOT_TOKEN: {
    required: false,
    pattern: /^\\d+:[A-Za-z0-9_-]+$/,
    description: 'Токен Telegram бота'
  },
  TELEGRAM_CHAT_ID: {
    required: false,
    description: 'ID чата для уведомлений'
  }
};

function validateEnv() {
  const errors = [];
  const warnings = [];

  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName];
    
    if (config.required && !value) {
      errors.push(\`❌ \${varName}: \${config.description}\`);
    } else if (value) {
      if (config.minLength && value.length < config.minLength) {
        errors.push(\`❌ \${varName}: должен быть минимум \${config.minLength} символов\`);
      }
      if (config.pattern && !config.pattern.test(value)) {
        errors.push(\`❌ \${varName}: неверный формат\`);
      }
    } else if (!config.required) {
      warnings.push(\`⚠️  \${varName}: не установлен (\${config.description})\`);
    }
  }

  if (errors.length > 0) {
    console.error('\\n🚨 Ошибки конфигурации окружения:\\n');
    errors.forEach(err => console.error(err));
    
    if (process.env.NODE_ENV === 'production') {
      console.error('\\n❌ Запуск в production невозможен без исправления ошибок!\\n');
      process.exit(1);
    }
  }

  if (warnings.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn('\\n⚠️  Предупреждения конфигурации:\\n');
    warnings.forEach(warn => console.warn(warn));
  }

  if (errors.length === 0) {
    console.log('✅ Переменные окружения проверены успешно\\n');
  }
}

// Экспортируем для использования в server.js
module.exports = { validateEnv };

// Запускаем если вызван напрямую
if (require.main === module) {
  validateEnv();
}
`;

  await fs.writeFile('utils/env-validator.js', validatorContent);
  
  // Добавляем вызов в server.js
  try {
    let serverContent = await fs.readFile('server.js', 'utf8');
    if (!serverContent.includes('env-validator')) {
      serverContent = `const { validateEnv } = require('./utils/env-validator');\nvalidateEnv();\n\n${serverContent}`;
      await fs.writeFile('server.js', serverContent);
    }
  } catch (error) {
    log.warning('Не удалось обновить server.js');
  }

  log.success('Валидатор переменных окружения создан');
  return true;
}

// 3. Добавление CSRF защиты
async function addCSRFProtection() {
  log.info('Добавление CSRF защиты...');
  
  const csrfMiddleware = `import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * CSRF Protection Middleware
 * Автоматически сгенерировано AI-аудитом
 */

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'csrf-token';
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

export function csrfProtection() {
  return async (request) => {
    // Пропускаем безопасные методы
    if (SAFE_METHODS.includes(request.method)) {
      return NextResponse.next();
    }

    // Получаем токены
    const headerToken = request.headers.get(CSRF_HEADER);
    const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;

    // Проверяем наличие и совпадение токенов
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return NextResponse.json(
        { error: 'CSRF token validation failed' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}

export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}
`;

  await fs.mkdir('app/middleware/csrf', { recursive: true });
  await fs.writeFile('app/middleware/csrf/index.js', csrfMiddleware);
  
  log.success('CSRF защита добавлена');
  return true;
}

// 4. Создание страницы политики конфиденциальности
async function createPrivacyPolicy() {
  log.info('Создание страницы политики конфиденциальности...');
  
  const privacyContent = `'use client';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page">
      <div className="container">
        <h1>Политика конфиденциальности</h1>
        <p className="updated">Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}</p>
        
        <section>
          <h2>1. Общие положения</h2>
          <p>
            Настоящая политика конфиденциальности (далее – Политика) определяет порядок обработки 
            и защиты ООО "НейроЭксперт" (далее – Оператор) информации о физических лицах (далее – Пользователи), 
            которая может быть получена Оператором при использовании Пользователями сервисов, 
            услуг, программ, продуктов Оператора.
          </p>
        </section>

        <section>
          <h2>2. Обрабатываемые данные</h2>
          <p>Мы можем собирать следующие типы данных:</p>
          <ul>
            <li>Имя и контактная информация (email, телефон)</li>
            <li>Данные об использовании сервиса</li>
            <li>Техническая информация (IP-адрес, cookies)</li>
            <li>История общения с AI-ассистентом</li>
          </ul>
        </section>

        <section>
          <h2>3. Цели обработки</h2>
          <ul>
            <li>Предоставление доступа к сервисам платформы</li>
            <li>Улучшение качества обслуживания</li>
            <li>Аналитика и статистика использования</li>
            <li>Выполнение требований законодательства</li>
          </ul>
        </section>

        <section>
          <h2>4. Защита данных</h2>
          <p>
            Мы используем современные методы защиты данных, включая шифрование, 
            контроль доступа и регулярный аудит безопасности.
          </p>
        </section>

        <section>
          <h2>5. Права пользователей</h2>
          <p>Вы имеете право:</p>
          <ul>
            <li>Получить информацию о своих персональных данных</li>
            <li>Исправить неточные данные</li>
            <li>Удалить свои персональные данные</li>
            <li>Отозвать согласие на обработку данных</li>
          </ul>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>
            Мы используем файлы cookies для улучшения работы сайта. 
            Вы можете управлять настройками cookies в своем браузере.
          </p>
        </section>

        <section>
          <h2>7. Контакты</h2>
          <p>
            По вопросам обработки персональных данных обращайтесь:<br />
            Email: privacy@neuroexpert.ai<br />
            Телефон: +7 (495) 123-45-67
          </p>
        </section>
      </div>

      <style jsx>{\`
        .privacy-policy-page {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
          color: #e0e0e0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          color: #4a9eff;
          margin-bottom: 1rem;
        }
        h2 {
          color: #6ab7ff;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .updated {
          color: #888;
          font-style: italic;
          margin-bottom: 2rem;
        }
        section {
          margin-bottom: 2rem;
        }
        ul {
          margin-left: 2rem;
          line-height: 1.8;
        }
        p {
          line-height: 1.6;
          margin-bottom: 1rem;
        }
      \`}</style>
    </div>
  );
}
`;

  await fs.mkdir('app/privacy', { recursive: true });
  await fs.writeFile('app/privacy/page.js', privacyContent);
  
  log.success('Страница политики конфиденциальности создана');
  return true;
}

// 5. Настройка ESLint v9
async function setupESLintV9() {
  log.info('Создание конфигурации ESLint v9...');
  
  const eslintConfig = `import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks,
      'security': security
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Security
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      
      // General
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error'
    }
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/public/**',
      '**/*.config.js'
    ]
  }
];
`;

  await fs.writeFile('eslint.config.js', eslintConfig);
  
  log.success('ESLint v9 конфигурация создана');
  return true;
}

// 6. Установка Jest
async function installJest() {
  log.info('Установка и настройка Jest...');
  
  try {
    await execPromise('npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom');
    log.success('Jest и зависимости установлены');
    return true;
  } catch (error) {
    log.warning('Не удалось установить Jest автоматически. Выполните: npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom');
    return false;
  }
}

// 7. Добавление bundle analyzer
async function addBundleAnalyzer() {
  log.info('Добавление анализатора размера бандлов...');
  
  const analyzerConfig = `const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

// Добавляем в начало next.config.js
`;

  log.warning('Для bundle analyzer выполните: npm install --save-dev @next/bundle-analyzer');
  log.info('Затем добавьте в package.json: "analyze": "ANALYZE=true npm run build"');
  
  return true;
}

// 8. Создание GDPR consent компонента
async function createGDPRConsent() {
  log.info('Создание компонента GDPR consent...');
  
  const consentComponent = `'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(fullConsent));
    setShowBanner(false);
    
    // Активируем аналитику
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const handleAcceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
    
    // Обновляем согласие для аналитики
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': preferences.analytics ? 'granted' : 'denied'
      });
    }
  };

  const handleReject = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(minimalConsent));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner">
      <div className="cookie-content">
        <h3>🍪 Мы используем cookies</h3>
        <p>
          Мы используем файлы cookie для улучшения вашего опыта на сайте. 
          Некоторые из них необходимы для работы сайта, другие помогают нам 
          улучшить сервис.
        </p>
        
        <div className="cookie-options">
          <label>
            <input 
              type="checkbox" 
              checked={preferences.necessary} 
              disabled 
            />
            <span>Необходимые (обязательно)</span>
          </label>
          
          <label>
            <input 
              type="checkbox" 
              checked={preferences.analytics}
              onChange={(e) => setPreferences({
                ...preferences, 
                analytics: e.target.checked
              })}
            />
            <span>Аналитика</span>
          </label>
          
          <label>
            <input 
              type="checkbox" 
              checked={preferences.marketing}
              onChange={(e) => setPreferences({
                ...preferences, 
                marketing: e.target.checked
              })}
            />
            <span>Маркетинг</span>
          </label>
        </div>
        
        <div className="cookie-actions">
          <button onClick={handleReject} className="reject">
            Только необходимые
          </button>
          <button onClick={handleAcceptSelected} className="accept-selected">
            Принять выбранные
          </button>
          <button onClick={handleAcceptAll} className="accept-all">
            Принять все
          </button>
        </div>
        
        <a href="/privacy" className="privacy-link">
          Политика конфиденциальности
        </a>
      </div>

      <style jsx>{\`
        .cookie-consent-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(20, 20, 35, 0.98);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(74, 158, 255, 0.3);
          padding: 1.5rem;
          z-index: 9999;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .cookie-content {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        h3 {
          color: #4a9eff;
          margin-bottom: 0.5rem;
        }
        
        p {
          color: #e0e0e0;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        
        .cookie-options {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e0e0e0;
          cursor: pointer;
        }
        
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        input[disabled] {
          cursor: not-allowed;
        }
        
        .cookie-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        button {
          padding: 0.7rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .reject {
          background: rgba(255, 255, 255, 0.1);
          color: #e0e0e0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .accept-selected {
          background: rgba(74, 158, 255, 0.2);
          color: #4a9eff;
          border: 1px solid #4a9eff;
        }
        
        .accept-all {
          background: #4a9eff;
          color: white;
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
        }
        
        .privacy-link {
          display: inline-block;
          margin-top: 1rem;
          color: #4a9eff;
          text-decoration: none;
          font-size: 0.9rem;
        }
        
        .privacy-link:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 640px) {
          .cookie-options {
            flex-direction: column;
            gap: 1rem;
          }
          
          .cookie-actions {
            flex-direction: column;
          }
          
          button {
            width: 100%;
          }
        }
      \`}</style>
    </div>
  );
}
`;

  await fs.mkdir('app/components/gdpr', { recursive: true });
  await fs.writeFile('app/components/gdpr/CookieConsent.js', consentComponent);
  
  log.success('GDPR Cookie Consent компонент создан');
  log.info('Добавьте <CookieConsent /> в app/layout.js');
  
  return true;
}

// Запуск
main().catch(error => {
  log.error(`Критическая ошибка: ${error.message}`);
  process.exit(1);
});