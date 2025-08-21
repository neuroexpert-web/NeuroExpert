'use client';

import { useEffect } from 'react';

export default function UIFixes() {
  useEffect(() => {
    // Исправляем кликабельность кнопок
    const fixButtons = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button) => {
        // Убираем pointer-events: none если есть
        if (window.getComputedStyle(button).pointerEvents === 'none') {
          button.style.pointerEvents = 'auto';
        }

        // Добавляем обработчик если его нет
        if (!button.onclick && !button.hasAttribute('data-click-fixed')) {
          button.setAttribute('data-click-fixed', 'true');
          button.addEventListener('click', function (e) {
            console.log('Button clicked:', this.textContent);
          });
        }
      });
    };

    // Исправляем модальные окна
    const fixModals = () => {
      const modals = document.querySelectorAll('[style*="position: fixed"]');
      modals.forEach((modal) => {
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
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
