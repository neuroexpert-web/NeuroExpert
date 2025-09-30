'use client';

export default function GlobalError({ error, reset }) {
  console.error('Global error:', error);

  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          backgroundColor: '#0f0f10',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Произошла ошибка
          </h1>
          <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Что-то пошло не так. Мы уже работаем над решением.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #4136f1, #8B5CF6)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}