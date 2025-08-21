'use client';

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
          issue: 'Нет href или onClick',
        });
      }

      // Проверка якорных ссылок
      if (href && href.includes('#')) {
        const anchor = href.split('#')[1];
        if (anchor && !document.getElementById(anchor)) {
          broken.push({
            element: link.outerHTML.substring(0, 100),
            text: link.textContent,
            issue: `Якорь #${anchor} не найден`,
          });
        }
      }
    });

    setBrokenLinks(broken);
    setChecking(false);

    if (broken.length === 0) {
      showNotification.success('Все ссылки работают корректно!');
    } else {
      showNotification.warning(`Найдено ${broken.length} проблемных ссылок`);
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
    <div
      style={{
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
        overflow: 'auto',
      }}
    >
      <h4 style={{ color: 'var(--gold-500)', marginBottom: '1rem' }}>🔍 Link Checker</h4>

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
          width: '100%',
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
                <strong>{link.text}</strong>
                <br />
                <small>{link.issue}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
