'use client';

import { useState } from 'react';
import SmartCustomerChat from '../components/SmartCustomerChat';
import AIAgentsDashboard from '../components/AIAgentsDashboard';

export default function TestAIAgents() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#0a0a0a' }}>
      <h1 style={{ 
        color: '#fff', 
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '2.5rem'
      }}>
        🤖 Тестирование AI Агентов
      </h1>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button
          onClick={() => setShowDashboard(!showDashboard)}
          style={{
            padding: '1rem 2rem',
            background: showDashboard ? '#00ff88' : '#333',
            color: showDashboard ? '#000' : '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {showDashboard ? '💬 Показать чат' : '📊 Показать дашборд'}
        </button>
      </div>

      {showDashboard ? (
        <AIAgentsDashboard />
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '700px'
        }}>
          <SmartCustomerChat />
        </div>
      )}

      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '16px',
        color: '#fff'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>📋 Инструкция:</h2>
        <ol style={{ lineHeight: '1.8' }}>
          <li>Используйте чат для тестирования AI агентов</li>
          <li>Переключитесь на дашборд для просмотра метрик</li>
          <li>Попробуйте разные типы вопросов</li>
          <li>Обратите внимание на качество ответов (в %)</li>
        </ol>
        
        <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>🧪 Примеры вопросов:</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>"Как улучшить продажи в интернет-магазине?"</li>
          <li>"Проанализируй эффективность email-маркетинга"</li>
          <li>"Дай советы по работе с клиентами"</li>
          <li>"Какие метрики важны для бизнеса?"</li>
        </ul>
      </div>
    </div>
  );
}