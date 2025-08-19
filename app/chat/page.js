'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const SmartFloatingAI = dynamic(() => import('../components/SmartFloatingAI'), {
  ssr: false,
  loading: () => <div className="ai-loading">AI управляющий загружается...</div>
});

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    // Автоматически открываем чат после загрузки страницы
    const timer = setTimeout(() => {
      const aiButton = document.querySelector('.ai-toggle-btn');
      if (aiButton) {
        aiButton.click();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ 
      background: 'var(--noir-900)', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '2rem'
    }}>
      <h1 style={{
        color: 'var(--primary-blue)',
        fontSize: '2.5rem',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        AI Управляющий директор
      </h1>
      
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '1.2rem',
        textAlign: 'center',
        maxWidth: '600px',
        marginBottom: '2rem'
      }}>
        Ваш персональный AI-консультант готов помочь с цифровизацией бизнеса
      </p>

      <button
        onClick={() => router.push('/')}
        style={{
          padding: '12px 24px',
          borderRadius: '25px',
          border: '1px solid var(--primary-blue)',
          background: 'transparent',
          color: 'var(--primary-blue)',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'var(--primary-blue)';
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = 'var(--primary-blue)';
        }}
      >
        Вернуться на главную
      </button>

      <SmartFloatingAI />
    </main>
  );
}