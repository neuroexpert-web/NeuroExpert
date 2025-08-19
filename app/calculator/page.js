'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ROICalculator = dynamic(() => import('../components/ROICalculator'), {
  ssr: false,
  loading: () => <div className="loading-skeleton">Загрузка калькулятора ROI...</div>
});

export default function CalculatorPage() {
  const router = useRouter();

  return (
    <main style={{ 
      background: 'var(--noir-900)', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{
            color: 'var(--primary-blue)',
            fontSize: '2.5rem',
            margin: 0
          }}>
            Калькулятор ROI
          </h1>
          
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
        </div>

        <Suspense fallback={<div className="loading-skeleton">Загрузка...</div>}>
          <ROICalculator />
        </Suspense>
      </div>
    </main>
  );
}