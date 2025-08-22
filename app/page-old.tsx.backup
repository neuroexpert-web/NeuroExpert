"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Динамический импорт навигации
const Navigation = dynamic(
  () => import('./components/Navigation'),
  { ssr: false }
)

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Функция для открытия AI управляющего
  const handleStartAI = () => {
    if (typeof window !== 'undefined' && (window as any).openAIManager) {
      (window as any).openAIManager()
    } else {
      const event = new CustomEvent('openAIChat')
      window.dispatchEvent(event)
      
      setTimeout(() => {
        const chatButton = document.querySelector('.smart-floating-ai-button')
        if (chatButton) {
          (chatButton as HTMLButtonElement).click()
        }
      }, 100)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <Navigation />
      <section 
        className="hero-section"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a051a 0%, #1a0f3a 50%, #0f0520 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Профессиональный фоновый эффект */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.2) 0%, transparent 40%),
              radial-gradient(circle at 40% 20%, rgba(120, 219, 255, 0.2) 0%, transparent 40%),
              radial-gradient(circle at 60% 60%, rgba(255, 0, 128, 0.15) 0%, transparent 40%)
            `,
            pointerEvents: 'none',
            animation: 'gradientMove 20s ease-in-out infinite'
          }}
        />
        
        {/* Дополнительный слой для глубины */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            right: '-50%',
            bottom: '-50%',
            background: `
              radial-gradient(circle at center, transparent 0%, rgba(10, 5, 26, 0.8) 70%)
            `,
            pointerEvents: 'none'
          }}
        />
        
        <div 
          className="hero-content"
          style={{
            textAlign: 'center',
            padding: '20px',
            position: 'relative',
            zIndex: 10,
            maxWidth: '1200px',
            margin: '0 auto',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out'
          }}
        >
          <p 
            className="pre-header"
            style={{
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: 500,
              color: '#00ffff',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.2s',
              textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
              background: 'linear-gradient(90deg, #00ffff, #00ccff, #00ffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% auto',
              animation: mounted ? 'shimmer 3s linear infinite' : 'none'
            }}
          >
            ЦИФРОВАЯ AI БИЗНЕС ПЛАТФОРМА
          </p>
          
          <h1 
            className="main-header"
            style={{
              fontSize: 'clamp(48px, 12vw, 120px)',
              fontWeight: 800,
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ff88 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'scale(1)' : 'scale(0.9)',
              transition: 'all 0.8s ease-out 0.3s',
              textShadow: `
                0 0 30px rgba(0, 255, 255, 0.5),
                0 0 60px rgba(255, 0, 255, 0.3),
                0 0 90px rgba(0, 255, 136, 0.2)
              `,
              filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))',
              letterSpacing: '0.02em'
            }}
          >
            NeuroExpert
          </h1>
          
          <h2 
            className="sub-header"
            style={{
              fontSize: 'clamp(18px, 4vw, 36px)',
              fontWeight: 600,
              color: '#00ff88',
              textTransform: 'uppercase',
              marginTop: '24px',
              marginBottom: '16px',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.4s',
              textShadow: '0 0 25px rgba(0, 255, 136, 0.6)',
              letterSpacing: '0.05em'
            }}
          >
            ЦИФРОВИЗАЦИЯ БИЗНЕСА<br />С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ
          </h2>
          
          <p 
            className="description"
            style={{
              fontSize: 'clamp(14px, 2.5vw, 20px)',
              fontWeight: 400,
              color: '#ffaa00',
              maxWidth: '600px',
              lineHeight: 1.8,
              margin: '24px auto 40px auto',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.5s',
              textShadow: '0 0 15px rgba(255, 170, 0, 0.4)',
              padding: '0 20px'
            }}
          >
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов, используя передовые AI технологии
          </p>
          
          <button 
            onClick={handleStartAI}
            className="cta-button"
            aria-label="Начать работу с AI управляющим"
            style={{
              display: 'inline-block',
              padding: '18px 40px',
              borderRadius: '50px',
              border: '2px solid #ff0080',
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #ff0080, #8000ff, #0080ff)',
              boxShadow: '0 0 30px rgba(255, 0, 128, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 0, 128, 0.8)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 128, 0.6)'
            }}
          >
            НАЧАТЬ С AI УПРАВЛЯЮЩИМ
          </button>
        </div>

        {/* Плавающие частицы для профессионального вида */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {mounted && [...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                background: `radial-gradient(circle, rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2}) 0%, transparent 70%)`,
                borderRadius: '50%',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 20 + 20}s linear infinite`,
                animationDelay: Math.random() * 20 + 's'
              }}
            />
          ))}
        </div>

        {/* Скрытый контейнер для AI чата */}
        <div id="smart-floating-ai-portal" style={{ display: 'none' }}></div>
      </section>
      
      {/* Ссылка на полную платформу */}
      <div 
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40
        }}
      >
        <button
          onClick={() => router.push('/platform')}
          style={{
            padding: '12px 24px',
            background: 'rgba(99, 102, 241, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '50px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'
            e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'
            e.currentTarget.style.transform = 'translateX(-50%) translateY(0)'
          }}
        >
          Перейти к полной платформе →
        </button>
      </div>

      <style jsx global>{`
        @keyframes gradientMove {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg) scale(0.9);
          }
          100% {
            transform: translate(0, 0) rotate(360deg) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 
              0 0 30px rgba(255, 0, 128, 0.6),
              0 0 60px rgba(128, 0, 255, 0.4),
              0 0 90px rgba(0, 128, 255, 0.2);
          }
          50% {
            box-shadow: 
              0 0 40px rgba(255, 0, 128, 0.8),
              0 0 80px rgba(128, 0, 255, 0.6),
              0 0 120px rgba(0, 128, 255, 0.4);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }

        .cta-button {
          animation: pulse 3s ease-in-out infinite;
        }

        .cta-button::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(90deg, #ff0080, #8000ff, #0080ff, #ff0080);
          border-radius: 50px;
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
          background-size: 300% 100%;
          animation: shimmer 3s linear infinite;
        }

        .cta-button:hover::after {
          opacity: 0.7;
        }
      `}</style>
    </>
  )
}