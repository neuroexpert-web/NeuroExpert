'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const SmartFloatingAI = dynamic(() => import('../components/SmartFloatingAI'), {
  ssr: false,
  loading: () => <div className="ai-loading">AI управляющий загружается...</div>
});

export default function SmartAIPage() {
  const router = useRouter();

  useEffect(() => {
    // Автоматически открываем AI ассистента при загрузке страницы
    const timer = setTimeout(() => {
      const aiButton = document.querySelector('.ai-trigger-button');
      if (aiButton) {
        aiButton.click();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#0A051A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <SmartFloatingAI />
      
      <div style={{
        textAlign: 'center',
        color: '#D1D5DB',
        fontFamily: 'Inter, sans-serif'
      }}>
        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 60px)',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #A855F7, #6366F1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          AI Управляющий
        </h1>
        <p style={{ 
          fontSize: '18px', 
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Ваш персональный ассистент для автоматизации бизнес-процессов
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '12px 30px',
            background: 'transparent',
            border: '2px solid #6366F1',
            borderRadius: '30px',
            color: '#6366F1',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#6366F1';
            e.target.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#6366F1';
          }}
        >
          Вернуться на главную
        </button>
      </div>
    </main>
  );
}