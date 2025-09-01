'use client';

import { useState } from 'react';

export default function ContactFormTest() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Тест 1: Проверка доступности API endpoint
    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Тестовый пользователь',
          email: 'test@example.com',
          phone: '+7 (999) 123-45-67',
          message: 'Это тестовое сообщение для проверки работы формы обратной связи.'
        })
      });

      const data = await response.json();
      
      results.tests.push({
        name: 'API Endpoint',
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Endpoint доступен и работает' : `Ошибка: ${data.error}`,
        details: {
          statusCode: response.status,
          response: data
        }
      });
    } catch (error) {
      results.tests.push({
        name: 'API Endpoint',
        status: 'error',
        message: `Не удалось подключиться: ${error.message}`,
        details: { error: error.toString() }
      });
    }

    // Тест 2: Проверка валидации
    const validationTests = [
      {
        name: 'Короткое имя',
        data: { name: 'А', email: 'test@test.com', message: 'Тестовое сообщение' },
        expectedError: true
      },
      {
        name: 'Неверный email',
        data: { name: 'Тест', email: 'notanemail', message: 'Тестовое сообщение' },
        expectedError: true
      },
      {
        name: 'Короткое сообщение',
        data: { name: 'Тест', email: 'test@test.com', message: 'Короткое' },
        expectedError: true
      },
      {
        name: 'Валидные данные',
        data: {
          name: 'Иван Иванов',
          email: 'ivan@example.com',
          phone: '+7 (999) 888-77-66',
          message: 'Это валидное тестовое сообщение для проверки.'
        },
        expectedError: false
      }
    ];

    for (const test of validationTests) {
      try {
        const response = await fetch('/api/contact-form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(test.data)
        });

        const data = await response.json();
        const hasError = !response.ok;

        results.tests.push({
          name: `Валидация: ${test.name}`,
          status: hasError === test.expectedError ? 'success' : 'error',
          message: hasError === test.expectedError 
            ? 'Валидация работает корректно' 
            : 'Валидация работает некорректно',
          details: {
            sentData: test.data,
            response: data,
            expectedError: test.expectedError,
            actualError: hasError
          }
        });
      } catch (error) {
        results.tests.push({
          name: `Валидация: ${test.name}`,
          status: 'error',
          message: `Ошибка теста: ${error.message}`,
          details: { error: error.toString() }
        });
      }
    }

    // Тест 3: Проверка переменных окружения
    try {
      const envResponse = await fetch('/api/test');
      const envData = await envResponse.json();
      
      results.tests.push({
        name: 'Telegram интеграция',
        status: envData.telegram.configured ? 'success' : 'warning',
        message: envData.telegram.configured 
          ? 'Telegram бот настроен' 
          : 'Telegram бот не настроен (установите TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID)',
        details: envData.telegram
      });
    } catch (error) {
      results.tests.push({
        name: 'Telegram интеграция',
        status: 'warning',
        message: 'Не удалось проверить настройки Telegram'
      });
    }

    // Подсчет результатов
    results.summary = {
      total: results.tests.length,
      success: results.tests.filter(t => t.status === 'success').length,
      warnings: results.tests.filter(t => t.status === 'warning').length,
      errors: results.tests.filter(t => t.status === 'error').length
    };

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="contact-form-test">
      <h3>🧪 Тестирование формы обратной связи</h3>
      
      <button 
        onClick={runTest} 
        disabled={loading}
        className="test-button"
      >
        {loading ? '⏳ Тестирование...' : '🚀 Запустить тесты'}
      </button>

      {testResults && (
        <div className="test-results">
          <div className="results-summary">
            <h4>Результаты тестирования</h4>
            <div className="summary-stats">
              <span className="stat success">✅ Успешно: {testResults.summary.success}</span>
              <span className="stat warning">⚠️ Предупреждения: {testResults.summary.warnings}</span>
              <span className="stat error">❌ Ошибки: {testResults.summary.errors}</span>
            </div>
          </div>

          <div className="test-details">
            {testResults.tests.map((test, index) => (
              <details key={index} className={`test-item ${test.status}`}>
                <summary>
                  <span className="test-status">
                    {test.status === 'success' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'}
                  </span>
                  <span className="test-name">{test.name}</span>
                </summary>
                <div className="test-content">
                  <p className="test-message">{test.message}</p>
                  {test.details && (
                    <pre className="test-details-json">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  )}
                </div>
              </details>
            ))}
          </div>

          <div className="test-timestamp">
            Тестирование выполнено: {new Date(testResults.timestamp).toLocaleString('ru-RU')}
          </div>
        </div>
      )}

      <style jsx>{`
        .contact-form-test {
          background: rgba(26, 26, 46, 0.9);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin: 2rem 0;
        }

        h3 {
          color: white;
          margin-bottom: 1.5rem;
        }

        .test-button {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .test-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
        }

        .test-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .results-summary {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .results-summary h4 {
          color: white;
          margin-bottom: 1rem;
        }

        .summary-stats {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .stat {
          font-weight: 500;
        }

        .stat.success {
          color: #10b981;
        }

        .stat.warning {
          color: #f59e0b;
        }

        .stat.error {
          color: #ef4444;
        }

        .test-item {
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .test-item.success {
          border-color: rgba(16, 185, 129, 0.3);
        }

        .test-item.warning {
          border-color: rgba(245, 158, 11, 0.3);
        }

        .test-item.error {
          border-color: rgba(239, 68, 68, 0.3);
        }

        summary {
          padding: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: white;
          transition: background 0.3s ease;
        }

        summary:hover {
          background: rgba(139, 92, 246, 0.1);
        }

        .test-status {
          font-size: 1.2rem;
        }

        .test-name {
          font-weight: 500;
        }

        .test-content {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
        }

        .test-message {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
        }

        .test-details-json {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 4px;
          padding: 1rem;
          overflow-x: auto;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        .test-timestamp {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}