'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Логируем ошибку в Sentry
    Sentry.withScope((scope) => {
      scope.setContext('errorBoundary', {
        errorInfo,
        props: this.props,
      });
      Sentry.captureException(error);
    });

    // Логируем в консоль для разработки
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Опционально: перезагрузить страницу
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-content">
            <h1>Упс! Что-то пошло не так</h1>
            <p>Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.</p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Подробности ошибки (только для разработчиков)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.error.stack}</pre>
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleReset} className="btn-primary">
                Попробовать снова
              </button>
              <button onClick={() => window.location.href = '/'} className="btn-secondary">
                На главную
              </button>
            </div>
          </div>
          
          <style jsx>{`
            .error-boundary-container {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--noir-900, #0a0a0a);
              color: var(--white, #ffffff);
              padding: 2rem;
            }
            
            .error-content {
              max-width: 600px;
              text-align: center;
            }
            
            .error-content h1 {
              font-size: 2.5rem;
              margin-bottom: 1rem;
              background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            
            .error-content p {
              font-size: 1.1rem;
              color: var(--gray-300, #d1d5db);
              margin-bottom: 2rem;
            }
            
            .error-details {
              background: var(--noir-800, #1a1a1a);
              border: 1px solid var(--noir-700, #2a2a2a);
              border-radius: 8px;
              padding: 1rem;
              margin: 2rem 0;
              text-align: left;
            }
            
            .error-details summary {
              cursor: pointer;
              color: var(--gold-400, #fbbf24);
              margin-bottom: 1rem;
            }
            
            .error-details pre {
              overflow-x: auto;
              font-size: 0.875rem;
              color: var(--gray-400, #9ca3af);
              white-space: pre-wrap;
              word-break: break-word;
            }
            
            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              margin-top: 2rem;
            }
            
            .btn-primary,
            .btn-secondary {
              padding: 0.75rem 2rem;
              border-radius: 8px;
              font-weight: 600;
              transition: all 0.3s ease;
              cursor: pointer;
              border: none;
              font-size: 1rem;
            }
            
            .btn-primary {
              background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%);
              color: var(--noir-900);
            }
            
            .btn-primary:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 20px rgba(251, 191, 36, 0.3);
            }
            
            .btn-secondary {
              background: transparent;
              color: var(--white);
              border: 2px solid var(--noir-700);
            }
            
            .btn-secondary:hover {
              background: var(--noir-800);
              border-color: var(--gold-500);
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;