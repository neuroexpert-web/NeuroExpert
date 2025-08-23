'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function TestPage() {
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    try {
      setTestResults(prev => ({ ...prev, [testName]: 'Тестирование...' }));
      await testFn();
      setTestResults(prev => ({ ...prev, [testName]: '✅ Успешно' }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [testName]: `❌ Ошибка: ${error}` }));
    }
  };

  const testMetricsAPI = async () => {
    const response = await fetch('/api/metrics?period=daily');
    const data = await response.json();
    if (!data.success) throw new Error('API вернул ошибку');
  };

  const testPricingAPI = async () => {
    const response = await fetch('/api/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceType: 'ai-chatbot',
        region: 'moscow',
        industry: 'retail',
        companySize: 'medium',
        urgency: 'normal',
        customRequirements: []
      })
    });
    const data = await response.json();
    if (!data.success) throw new Error('API вернул ошибку');
  };

  const testContactAPI = async () => {
    const response = await fetch('/api/contact-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+7 900 000-00-00',
        message: 'Тестовое сообщение'
      })
    });
    const data = await response.json();
    if (!data.success) throw new Error('API вернул ошибку');
  };

  return (
    <div className={styles.container}>
      <h1>Тестирование компонентов</h1>
      
      <div className={styles.section}>
        <h2>API Endpoints</h2>
        <div className={styles.tests}>
          <div className={styles.test}>
            <button onClick={() => runTest('metrics', testMetricsAPI)}>
              Тест Metrics API
            </button>
            <span>{testResults.metrics || 'Не запущен'}</span>
          </div>
          
          <div className={styles.test}>
            <button onClick={() => runTest('pricing', testPricingAPI)}>
              Тест Pricing API
            </button>
            <span>{testResults.pricing || 'Не запущен'}</span>
          </div>
          
          <div className={styles.test}>
            <button onClick={() => runTest('contact', testContactAPI)}>
              Тест Contact API
            </button>
            <span>{testResults.contact || 'Не запущен'}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Навигация</h2>
        <p>Текущая ширина экрана: <span id="screenWidth"></span></p>
        <p>Бургер меню должен быть видим при ширине {'<'} 768px</p>
      </div>

      <div className={styles.section}>
        <h2>Компоненты</h2>
        <ul>
          <li><a href="/">Главная страница</a></li>
          <li><a href="/dashboard">Дашборд</a></li>
          <li><a href="/roi-pro">ROI Pro</a></li>
          <li><a href="/showcase">Showcase</a></li>
        </ul>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('screenWidth').textContent = window.innerWidth + 'px';
          window.addEventListener('resize', () => {
            document.getElementById('screenWidth').textContent = window.innerWidth + 'px';
          });
        `
      }} />
    </div>
  );
}