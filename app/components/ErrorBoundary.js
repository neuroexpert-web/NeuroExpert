'use client';

import { Component } from 'react';
import { monitoring } from '../utils/monitoring';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Логирование ошибки
    monitoring.trackError(error, {
      severity: 'high',
      source: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
      props: this.props
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <h2>😔 Что-то пошло не так</h2>
            <p>Мы уже работаем над решением проблемы.</p>
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
              <summary>Техническая информация</summary>
              {this.state.error && this.state.error.toString()}
            </details>
            <button 
              onClick={() => window.location.reload()}
              className="error-reload-button"
            >
              Обновить страницу
            </button>
          </div>
          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--bg);
              color: var(--text);
              padding: 20px;
            }
            .error-container {
              max-width: 600px;
              text-align: center;
              background: rgba(255, 255, 255, 0.05);
              padding: 40px;
              border-radius: 16px;
              backdrop-filter: blur(10px);
            }
            .error-container h2 {
              color: var(--accent);
              margin-bottom: 16px;
              font-size: 2rem;
            }
            .error-container p {
              color: var(--text);
              margin-bottom: 24px;
              opacity: 0.8;
            }
            .error-reload-button {
              background: var(--accent);
              color: var(--bg);
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.3s ease;
              margin-top: 20px;
            }
            .error-reload-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 16px rgba(125, 211, 252, 0.3);
            }
            details {
              text-align: left;
              background: rgba(0, 0, 0, 0.2);
              padding: 16px;
              border-radius: 8px;
              font-family: monospace;
              font-size: 0.875rem;
              color: var(--text);
              opacity: 0.7;
            }
            summary {
              cursor: pointer;
              margin-bottom: 8px;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;