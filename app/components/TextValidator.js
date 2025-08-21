'use client';

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
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
        if (!heading.textContent.trim()) {
          textIssues.push(`Пустой заголовок: <${heading.tagName.toLowerCase()}>`);
        }
      });

      // Проверка на битые символы
      const brokenChars = ['�', '???', 'undefined', 'null'];
      brokenChars.forEach((char) => {
        if (document.body.textContent.includes(char)) {
          textIssues.push(`Найден некорректный символ: "${char}"`);
        }
      });

      // Проверка alt текстов для изображений
      document.querySelectorAll('img').forEach((img) => {
        if (!img.alt) {
          textIssues.push(`Изображение без alt текста: ${img.src}`);
        }
      });

      setIssues(textIssues);
    };

    setTimeout(checkTexts, 1000);
  }, []);

  if (process.env.NODE_ENV !== 'development' || issues.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'var(--noir-800)',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--warning)',
        zIndex: 9999,
        maxWidth: '300px',
      }}
    >
      <h4 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>⚠️ Проблемы с текстом</h4>
      <ul style={{ fontSize: '0.8rem', paddingLeft: '1rem' }}>
        {issues.map((issue, index) => (
          <li key={index} style={{ marginBottom: '0.25rem' }}>
            {issue}
          </li>
        ))}
      </ul>
    </div>
  );
}
