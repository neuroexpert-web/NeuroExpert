#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Автоматическое исправление проблем...\n');

// 1. Добавление медиа-запросов для мобильной адаптации
function addMobileStyles() {
  console.log('📱 Добавление стилей для мобильных устройств...');

  const mobileStyles = `
/* === МОБИЛЬНАЯ АДАПТАЦИЯ === */

/* Смартфоны (портрет) */
@media only screen and (max-width: 480px) {
  /* Базовые стили */
  body {
    font-size: 14px;
  }
  
  h1 {
    font-size: 2rem !important;
    line-height: 1.2;
  }
  
  h2 {
    font-size: 1.5rem !important;
  }
  
  h3 {
    font-size: 1.25rem !important;
  }
  
  /* Контейнеры */
  .container {
    padding: 1rem !important;
    max-width: 100% !important;
  }
  
  /* Hero секция */
  .hero-section {
    padding: 2rem 1rem !important;
    min-height: 80vh !important;
  }
  
  .hero-content h1 {
    font-size: 2rem !important;
  }
  
  /* Кнопки */
  .btn, button {
    padding: 0.75rem 1.5rem !important;
    font-size: 0.9rem !important;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  /* Карточки */
  .card, .feature-card, .pricing-card {
    padding: 1.5rem !important;
    margin-bottom: 1rem;
  }
  
  /* Сетки */
  .grid, .features-grid, .pricing-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem !important;
  }
  
  /* Формы */
  .form-group {
    margin-bottom: 1rem;
  }
  
  input, textarea, select {
    width: 100% !important;
    font-size: 16px !important; /* Предотвращает зум на iOS */
  }
  
  /* ROI калькулятор */
  .roi-calculator {
    padding: 1rem !important;
  }
  
  .roi-inputs {
    flex-direction: column !important;
  }
  
  /* AI чат */
  .ai-float-button {
    bottom: 20px !important;
    right: 20px !important;
    width: 50px !important;
    height: 50px !important;
  }
  
  .ai-chat-container {
    width: 100% !important;
    height: 100vh !important;
    bottom: 0 !important;
    right: 0 !important;
    border-radius: 0 !important;
  }
  
  /* Навигация */
  .nav-menu {
    flex-direction: column;
    width: 100%;
  }
  
  /* Скрываем элементы на мобильных */
  .desktop-only {
    display: none !important;
  }
  
  /* Анимации - упрощаем на мобильных */
  .animated-element {
    animation: none !important;
  }
}

/* Планшеты */
@media only screen and (min-width: 481px) and (max-width: 768px) {
  .container {
    padding: 1.5rem !important;
  }
  
  .grid, .features-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  h1 {
    font-size: 2.5rem !important;
  }
}

/* Малые ноутбуки */
@media only screen and (min-width: 769px) and (max-width: 1024px) {
  .container {
    max-width: 90% !important;
  }
}

/* Высокие мобильные экраны */
@media only screen and (max-height: 600px) and (orientation: landscape) {
  .hero-section {
    min-height: auto !important;
    padding: 1rem !important;
  }
}

/* Темная тема для OLED экранов */
@media (prefers-color-scheme: dark) {
  :root {
    --noir-900: #000000;
  }
}

/* Reduced motion для доступности */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

  // Добавляем стили в globals.css
  const globalsPath = path.join(process.cwd(), 'app/globals.css');
  if (fs.existsSync(globalsPath)) {
    const currentContent = fs.readFileSync(globalsPath, 'utf8');
    if (!currentContent.includes('МОБИЛЬНАЯ АДАПТАЦИЯ')) {
      fs.appendFileSync(globalsPath, mobileStyles);
      console.log('✅ Мобильные стили добавлены в globals.css');
    } else {
      console.log('ℹ️  Мобильные стили уже существуют');
    }
  }
}

// 2. Создание компонента для проверки всех ссылок
function createLinkChecker() {
  console.log('🔗 Создание компонента проверки ссылок...');

  const linkChecker = `'use client';

import { useEffect, useState } from 'react';
import { showNotification } from './enhanced/NotificationSystem';

export default function LinkChecker() {
  const [brokenLinks, setBrokenLinks] = useState([]);
  const [checking, setChecking] = useState(false);

  const checkAllLinks = async () => {
    setChecking(true);
    const links = document.querySelectorAll('a, button');
    const broken = [];

    links.forEach((link, index) => {
      const href = link.href || link.getAttribute('data-href');
      const onClick = link.onclick || link.getAttribute('onClick');
      
      if (!href && !onClick) {
        broken.push({
          element: link.outerHTML.substring(0, 100),
          text: link.textContent,
          issue: 'Нет href или onClick'
        });
      }
      
      // Проверка якорных ссылок
      if (href && href.includes('#')) {
        const anchor = href.split('#')[1];
        if (anchor && !document.getElementById(anchor)) {
          broken.push({
            element: link.outerHTML.substring(0, 100),
            text: link.textContent,
            issue: \`Якорь #\${anchor} не найден\`
          });
        }
      }
    });

    setBrokenLinks(broken);
    setChecking(false);

    if (broken.length === 0) {
      showNotification.success('Все ссылки работают корректно!');
    } else {
      showNotification.warning(\`Найдено \${broken.length} проблемных ссылок\`);
    }
  };

  useEffect(() => {
    // Автоматическая проверка при загрузке в dev режиме
    if (process.env.NODE_ENV === 'development') {
      setTimeout(checkAllLinks, 2000);
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      background: 'var(--noir-800)',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid var(--gold-500)',
      zIndex: 9999,
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <h4 style={{ color: 'var(--gold-500)', marginBottom: '1rem' }}>
        🔍 Link Checker
      </h4>
      
      <button 
        onClick={checkAllLinks}
        disabled={checking}
        style={{
          background: 'var(--gold-500)',
          color: 'var(--noir-900)',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: checking ? 'wait' : 'pointer',
          marginBottom: '1rem',
          width: '100%'
        }}
      >
        {checking ? 'Проверка...' : 'Проверить все ссылки'}
      </button>
      
      {brokenLinks.length > 0 && (
        <div>
          <p style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>
            Найдено проблем: {brokenLinks.length}
          </p>
          <ul style={{ fontSize: '0.8rem', paddingLeft: '1rem' }}>
            {brokenLinks.map((link, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', color: 'var(--gray-400)' }}>
                <strong>{link.text}</strong><br/>
                <small>{link.issue}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}`;

  const componentPath = path.join(process.cwd(), 'app/components/LinkChecker.js');
  fs.writeFileSync(componentPath, linkChecker);
  console.log('✅ Создан компонент LinkChecker.js');
}

// 3. Исправление viewport для мобильных
function fixViewport() {
  console.log('📐 Проверка viewport meta тега...');

  const layoutPath = path.join(process.cwd(), 'app/layout.js');
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');

    // Проверяем наличие правильного viewport
    if (!content.includes('viewport') || !content.includes('width=device-width')) {
      console.log('⚠️  Необходимо проверить viewport в metadata');
    } else {
      console.log('✅ Viewport настроен корректно');
    }
  }
}

// 4. Создание тестового компонента для проверки текстов
function createTextValidator() {
  console.log('📝 Создание валидатора текстов...');

  const validator = `'use client';

import { useEffect, useState } from 'react';

export default function TextValidator() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const checkTexts = () => {
      const textIssues = [];
      
      // Проверка на Lorem ipsum
      if (document.body.textContent.includes('Lorem ipsum')) {
        textIssues.push('Найден placeholder текст (Lorem ipsum)');
      }
      
      // Проверка на пустые заголовки
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        if (!heading.textContent.trim()) {
          textIssues.push(\`Пустой заголовок: <\${heading.tagName.toLowerCase()}>\`);
        }
      });
      
      // Проверка на битые символы
      const brokenChars = ['�', '???', 'undefined', 'null'];
      brokenChars.forEach(char => {
        if (document.body.textContent.includes(char)) {
          textIssues.push(\`Найден некорректный символ: "\${char}"\`);
        }
      });
      
      // Проверка alt текстов для изображений
      document.querySelectorAll('img').forEach(img => {
        if (!img.alt) {
          textIssues.push(\`Изображение без alt текста: \${img.src}\`);
        }
      });
      
      setIssues(textIssues);
    };
    
    setTimeout(checkTexts, 1000);
  }, []);

  if (process.env.NODE_ENV !== 'development' || issues.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'var(--noir-800)',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid var(--warning)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>
        ⚠️ Проблемы с текстом
      </h4>
      <ul style={{ fontSize: '0.8rem', paddingLeft: '1rem' }}>
        {issues.map((issue, index) => (
          <li key={index} style={{ marginBottom: '0.25rem' }}>
            {issue}
          </li>
        ))}
      </ul>
    </div>
  );
}`;

  const validatorPath = path.join(process.cwd(), 'app/components/TextValidator.js');
  fs.writeFileSync(validatorPath, validator);
  console.log('✅ Создан компонент TextValidator.js');
}

// 5. Запуск всех исправлений
function runAutoFix() {
  addMobileStyles();
  createLinkChecker();
  fixViewport();
  createTextValidator();

  console.log('\n✅ Автоматические исправления завершены!');
  console.log('\n📋 Следующие шаги:');
  console.log('1. Запустите: npm run dev');
  console.log('2. Добавьте LinkChecker и TextValidator в layout.js (только для dev)');
  console.log('3. Проверьте responsive-test.html в браузере');
  console.log('4. Протестируйте все функции вручную');
}

// Запуск
runAutoFix();
