"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Динамический импорт навигации
const Navigation = dynamic(
  () => import('./components/Navigation'),
  { ssr: false }
)

declare global {
  interface Window {
    openAIManager: () => void
  }
}

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
      }, 100) // Уменьшили задержку
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    // Статичная версия для первичного рендера
    <section className="hero-section">
      <div className="hero-content">
        <p className="pre-header">ЦИФРОВАЯ AI БИЗНЕС ПЛАТФОРМА</p>
        <h1 className="main-header">NeuroExpert</h1>
        <h2 className="sub-header">ЦИФРОВИЗАЦИЯ БИЗНЕСА<br />С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ</h2>
        <p className="description">Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов, используя передовые AI технологии</p>
        <button className="cta-button">НАЧАТЬ С AI УПРАВЛЯЮЩИМ</button>
      </div>
    </section>
  )

  return (
    <>
      <Navigation />
      <section className="hero-section">
        {/* Простой градиентный фон вместо Vanta.js */}
        <div className="hero-background" />
        
        <div className="hero-content">
          <p className="pre-header premium-text animate-fade-in-fast" style={{ animationDelay: '0.1s' }}>
            ЦИФРОВАЯ AI БИЗНЕС ПЛАТФОРМА
          </p>
          
          <h1 className="main-header neural-network-title animate-scale-in" style={{ animationDelay: '0.3s' }}>
            NeuroExpert
          </h1>
          
          <h2 className="sub-header premium-subtitle animate-slide-up-fast" style={{ animationDelay: '0.5s' }}>
            ЦИФРОВИЗАЦИЯ БИЗНЕСА<br />С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ
          </h2>
          
          <p className="description premium-description animate-fade-in-fast" style={{ animationDelay: '0.7s' }}>
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов, используя передовые AI технологии
          </p>
          
          <button 
            onClick={handleStartAI}
            className="cta-button premium-button animate-fade-in-fast"
            aria-label="Начать работу с AI управляющим"
            style={{ animationDelay: '0.9s' }}
          >
            НАЧАТЬ С AI УПРАВЛЯЮЩИМ
          </button>
        </div>

        {/* Легкие частицы без тяжелых анимаций */}
        <div className="particles-container" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="particle" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </div>

        {/* Скрытый контейнер для AI чата */}
        <div id="smart-floating-ai-portal" style={{ display: 'none' }}></div>
      </section>
      
      {/* Ссылка на полную платформу */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => router.push('/platform')}
          className="platform-link-button"
        >
          Перейти к полной платформе →
        </button>
      </div>

      <style jsx>{`
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0a051a 0%, #1a0f3a 50%, #0f0520 100%);
          z-index: -1;
        }

        .hero-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(120, 219, 255, 0.15) 0%, transparent 50%);
          animation: gradientShift 20s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(5deg) scale(1.1); }
        }

        /* Анимации для элементов */
        :global(.animate-fade-in-fast) {
          animation: fadeInFast 0.5s ease-out forwards;
          opacity: 0;
          animation-fill-mode: both;
        }

        :global(.animate-scale-in) {
          animation: scaleIn 0.6s ease-out forwards;
          opacity: 0;
          animation-fill-mode: both;
        }

        :global(.animate-slide-up-fast) {
          animation: slideUpFast 0.5s ease-out forwards;
          opacity: 0;
          animation-fill-mode: both;
        }

        @keyframes fadeInFast {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }

        @keyframes slideUpFast {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float 10s linear infinite;
        }

        .particle:nth-child(1) { left: 10%; top: 20%; }
        .particle:nth-child(2) { left: 30%; top: 40%; }
        .particle:nth-child(3) { left: 50%; top: 60%; }
        .particle:nth-child(4) { left: 70%; top: 30%; }
        .particle:nth-child(5) { left: 90%; top: 50%; }

        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }



        .platform-link-button {
          padding: 12px 24px;
          background: rgba(99, 102, 241, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 50px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .platform-link-button:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.5);
          transform: translateY(-2px);
        }

        /* Упрощенная анимация для кнопки CTA */
        :global(.cta-button) {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 30px rgba(255, 0, 128, 0.6), 0 10px 30px -5px rgba(128, 0, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 0, 128, 0.8), 0 15px 35px -5px rgba(128, 0, 255, 0.6);
          }
        }

        :global(.cta-button)::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }

        :global(.cta-button:hover)::before {
          width: 300px;
          height: 300px;
        }

        :global(.cta-button:hover) {
          transform: translateY(-2px);
          animation: none;
          box-shadow: 0 10px 40px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </>
  )
}