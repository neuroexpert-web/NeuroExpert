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
        {/* Простой фоновый эффект */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)
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
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.2s'
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
              transition: 'all 0.8s ease-out 0.3s'
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
              transition: 'opacity 0.6s ease-out 0.4s'
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
              lineHeight: 1.6,
              margin: '24px auto 40px auto',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.5s'
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
    </>
  )
}