'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import styles from './page.module.css'

declare global {
  interface Window {
    openAIManager?: () => void
  }
}

// Динамический импорт навигации
const Navigation = dynamic(
  () => import('./components/Navigation'),
  { ssr: false }
)

// Динамический импорт SmartFloatingAI
const SmartFloatingAI = dynamic(
  () => import('./components/SmartFloatingAI'),
  { 
    ssr: false,
    loading: () => null
  }
)

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Функция для открытия AI управляющего
  const handleStartAI = () => {
    // Сначала пробуем глобальную функцию
    if (typeof window !== 'undefined' && window.openAIManager) {
      window.openAIManager()
      return
    }
    
    // Затем пробуем событие
    const event = new CustomEvent('openAIChat')
    window.dispatchEvent(event)
    
    // И в крайнем случае кликаем по кнопке
    setTimeout(() => {
      const chatButton = document.querySelector('.smart-floating-ai-button')
      if (chatButton) {
        (chatButton as HTMLButtonElement).click()
      }
    }, 100)
  }

  useEffect(() => {
    setMounted(true)
    // Симулируем загрузку для плавного появления
    setTimeout(() => setIsLoading(false), 300)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        {/* Премиум фоновые эффекты */}
        <div className={styles.backgroundEffects}>
          <div className={styles.gradientOrb1} />
          <div className={styles.gradientOrb2} />
          <div className={styles.gradientOrb3} />
          <div className={styles.gridPattern} />
        </div>

        {/* Основной контент */}
        <section className={styles.heroSection}>
          <div className={`${styles.content} ${!isLoading ? styles.visible : ''}`}>
            {/* Премиум тег */}
            <div className={styles.premiumTag}>
              <span className={styles.tagIcon}>✦</span>
              <span className={styles.tagText}>ENTERPRISE AI PLATFORM</span>
              <span className={styles.tagIcon}>✦</span>
            </div>

            {/* Заголовок */}
            <h1 className={styles.mainTitle}>
              <span className={styles.titleGradient}>NeuroExpert</span>
              <span className={styles.titleGlow} aria-hidden="true">NeuroExpert</span>
            </h1>

            {/* Подзаголовок */}
            <h2 className={styles.subtitle}>
              Трансформируйте бизнес с помощью
              <br />
              <span className={styles.highlightText}>Искусственного Интеллекта</span>
            </h2>

            {/* Описание */}
            <p className={styles.description}>
              Автоматизируйте процессы, увеличивайте прибыль и опережайте конкурентов
              с передовой AI-платформой нового поколения
            </p>

            {/* Кнопки действий */}
            <div className={styles.actions}>
              <button 
                onClick={handleStartAI}
                className={styles.primaryButton}
                aria-label="Начать работу с AI управляющим"
              >
                <span className={styles.buttonText}>Начать с AI управляющим</span>
                <span className={styles.buttonIcon}>→</span>
                <div className={styles.buttonGlow} />
              </button>

              <button 
                onClick={() => router.push('/platform')}
                className={styles.secondaryButton}
              >
                <span className={styles.buttonText}>Узнать больше</span>
              </button>
            </div>

            {/* Статистика */}
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>500+</span>
                <span className={styles.statLabel}>Компаний</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>98%</span>
                <span className={styles.statLabel}>Довольных клиентов</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>24/7</span>
                <span className={styles.statLabel}>AI поддержка</span>
              </div>
            </div>
          </div>

          {/* Премиум частицы */}
          <div className={styles.particles}>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className={styles.particle}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${20 + Math.random() * 20}s`
                }}
              />
            ))}
          </div>
        </section>
      </main>

      {/* SmartFloatingAI компонент */}
      <SmartFloatingAI />
    </>
  )
}