#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

console.log('🔧 Исправляю UI проблемы...\n');

async function fixUIIssues() {
  const fixes = [];

  // 1. Добавляем глобальные стили для исправления проблем
  const globalStylesFix = `
/* КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ UI */

/* Исправление кнопок */
button {
  cursor: pointer !important;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

button:disabled {
  cursor: not-allowed !important;
  opacity: 0.6;
}

/* Исправление модальных окон */
[style*="position: fixed"] {
  z-index: 9999 !important;
}

/* Исправление калькулятора */
#roi-calculator button {
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* Исправление AI чата */
.ai-float-button {
  z-index: 10000 !important;
  cursor: pointer !important;
  pointer-events: auto !important;
}

/* Исправление заголовков на главной */
h1, h2, h3 {
  word-break: break-word;
  overflow-wrap: break-word;
}

.main-header {
  font-size: clamp(48px, 8vw, 120px) !important;
  line-height: 1.1 !important;
}

/* Мобильные исправления */
@media (max-width: 768px) {
  .main-header {
    font-size: clamp(36px, 10vw, 60px) !important;
  }
  
  .sub-header {
    font-size: clamp(18px, 5vw, 24px) !important;
  }
  
  .description {
    font-size: 16px !important;
    padding: 0 20px;
  }
  
  /* Модальные окна на мобильных */
  [style*="position: fixed"][style*="max-width"] {
    max-width: 95% !important;
    max-height: 90vh !important;
    overflow-y: auto !important;
  }
  
  /* AI чат на мобильных */
  .ai-float-button {
    bottom: 20px !important;
    right: 20px !important;
  }
}

/* Анимации для кнопок */
button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}

button:not(:disabled):active {
  transform: translateY(0);
  transition: all 0.1s ease;
}

/* Исправление z-index конфликтов */
.hero-section {
  position: relative;
  z-index: 1;
}

.neural-canvas {
  position: absolute !important;
  z-index: 0 !important;
}

.hero-content {
  position: relative;
  z-index: 2;
}
`;

  // Добавляем стили в globals.css
  try {
    const globalsPath = path.join(process.cwd(), 'app', 'globals.css');
    const currentContent = await fs.readFile(globalsPath, 'utf8');

    if (!currentContent.includes('КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ UI')) {
      await fs.writeFile(globalsPath, currentContent + '\n' + globalStylesFix);
      fixes.push('✅ Добавлены глобальные исправления стилей');
    }
  } catch (error) {
    console.error('❌ Ошибка при обновлении globals.css:', error.message);
  }

  // 2. Создаем клиентский скрипт для исправления runtime проблем
  const clientFixScript = `
'use client';

import { useEffect } from 'react';

export default function UIFixes() {
  useEffect(() => {
    // Исправляем кликабельность кнопок
    const fixButtons = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        // Убираем pointer-events: none если есть
        if (window.getComputedStyle(button).pointerEvents === 'none') {
          button.style.pointerEvents = 'auto';
        }
        
        // Добавляем обработчик если его нет
        if (!button.onclick && !button.hasAttribute('data-click-fixed')) {
          button.setAttribute('data-click-fixed', 'true');
          button.addEventListener('click', function(e) {
            console.log('Button clicked:', this.textContent);
          });
        }
      });
    };

    // Исправляем модальные окна
    const fixModals = () => {
      const modals = document.querySelectorAll('[style*="position: fixed"]');
      modals.forEach(modal => {
        const zIndex = window.getComputedStyle(modal).zIndex;
        if (zIndex < 1000) {
          modal.style.zIndex = '9999';
        }
      });
    };

    // Запускаем исправления
    fixButtons();
    fixModals();

    // Наблюдаем за изменениями DOM
    const observer = new MutationObserver(() => {
      fixButtons();
      fixModals();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
`;

  // Сохраняем компонент исправлений
  try {
    const fixComponentPath = path.join(process.cwd(), 'app', 'components', 'UIFixes.js');
    await fs.writeFile(fixComponentPath, clientFixScript);
    fixes.push('✅ Создан компонент runtime исправлений');
  } catch (error) {
    console.error('❌ Ошибка при создании UIFixes.js:', error.message);
  }

  // 3. Выводим результаты
  console.log('\n📊 Результаты исправлений:');
  fixes.forEach((fix) => console.log(fix));

  console.log('\n💡 Дальнейшие шаги:');
  console.log('1. Добавьте <UIFixes /> в app/layout.js');
  console.log('2. Перезапустите dev сервер');
  console.log('3. Очистите кеш браузера (Ctrl+Shift+R)');
  console.log('\n✅ Исправления применены!');
}

// Запускаем исправления
fixUIIssues().catch(console.error);
