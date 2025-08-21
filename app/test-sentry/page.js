'use client';

import { useState } from 'react';
import { captureException, captureMessage, addBreadcrumb, measurePerformance } from '../utils/sentry';

export default function TestSentryPage() {
  const [message, setMessage] = useState('');

  const testError = () => {
    addBreadcrumb({
      category: 'test',
      message: 'User clicked test error button',
      level: 'info',
    });
    
    throw new Error('Тестовая ошибка для проверки Sentry');
  };

  const testCaptureException = () => {
    try {
      // Имитируем ошибку
      JSON.parse('invalid json');
    } catch (error) {
      captureException(error, {
        test: {
          type: 'manual_capture',
          timestamp: new Date().toISOString(),
        }
      });
      setMessage('Ошибка отправлена в Sentry!');
    }
  };

  const testCaptureMessage = () => {
    captureMessage('Тестовое сообщение из NeuroExpert', 'info', {
      user_action: 'test_button_click',
      page: 'test-sentry',
    });
    setMessage('Сообщение отправлено в Sentry!');
  };

  const testPerformance = async () => {
    try {
      const result = await measurePerformance('test_operation', async () => {
        // Имитируем долгую операцию
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 'Operation completed';
      });
      setMessage(`Производительность измерена: ${result}`);
    } catch (error) {
      captureException(error);
    }
  };

  const testAsyncError = async () => {
    addBreadcrumb({
      category: 'test',
      message: 'Testing async error',
      level: 'warning',
    });
    
    // Асинхронная ошибка
    setTimeout(() => {
      throw new Error('Асинхронная ошибка для Sentry');
    }, 100);
  };

  return (
    <div className="test-sentry-page">
      <div className="container">
        <h1>🧪 Тестирование Sentry</h1>
        <p>Используйте кнопки ниже для проверки интеграции Sentry</p>
        
        {message && (
          <div className="message">
            ✅ {message}
          </div>
        )}
        
        <div className="test-buttons">
          <button onClick={testError} className="btn-danger">
            🔥 Выбросить ошибку (ErrorBoundary)
          </button>
          
          <button onClick={testCaptureException} className="btn-warning">
            ⚠️ Захватить исключение
          </button>
          
          <button onClick={testCaptureMessage} className="btn-info">
            📝 Отправить сообщение
          </button>
          
          <button onClick={testPerformance} className="btn-success">
            ⚡ Измерить производительность
          </button>
          
          <button onClick={testAsyncError} className="btn-danger">
            ⏱️ Асинхронная ошибка
          </button>
        </div>
        
        <div className="info-section">
          <h2>📊 Что проверить в Sentry Dashboard:</h2>
          <ul>
            <li>Issues - новые ошибки</li>
            <li>Performance - транзакции</li>
            <li>Replays - записи сессий (если включено)</li>
            <li>Breadcrumbs - последовательность действий</li>
          </ul>
          
          <h2>🔧 Статус Sentry:</h2>
          <p>
            Sentry {process.env.NEXT_PUBLIC_SENTRY_DSN ? '✅ настроен' : '❌ не настроен'}
          </p>
          {!process.env.NEXT_PUBLIC_SENTRY_DSN && (
            <p className="warning">
              Добавьте NEXT_PUBLIC_SENTRY_DSN в переменные окружения
            </p>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .test-sentry-page {
          min-height: 100vh;
          background: var(--noir-900);
          color: var(--white);
          padding: 4rem 0;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .message {
          background: var(--success-bg, #10b981);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin: 2rem 0;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .test-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin: 3rem 0;
        }
        
        button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }
        
        .btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        
        .btn-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        .btn-info {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        
        .btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .info-section {
          background: var(--noir-800);
          border: 1px solid var(--noir-700);
          border-radius: 12px;
          padding: 2rem;
          margin-top: 3rem;
        }
        
        .info-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--gold-400);
        }
        
        .info-section ul {
          list-style: none;
          padding: 0;
        }
        
        .info-section li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }
        
        .info-section li:before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--gold-500);
        }
        
        .warning {
          color: var(--warning, #fbbf24);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}