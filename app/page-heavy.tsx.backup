"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Динамический импорт навигации
const Navigation = dynamic(
  () => import('./components/Navigation'),
  { ssr: false }
)

declare global {
  interface Window {
    VANTA: any
    THREE: any
    openAIManager: () => void
  }
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Функция для открытия AI управляющего
  const handleStartAI = () => {
    // Используем глобальную функцию для открытия AI управляющего
    if (typeof window !== 'undefined' && (window as any).openAIManager) {
      (window as any).openAIManager()
    } else {
      // Fallback: диспатчим событие для открытия чата
      const event = new CustomEvent('openAIChat')
      window.dispatchEvent(event)
      
      // Если чат еще не загружен, ждем и пробуем снова
      setTimeout(() => {
        const chatButton = document.querySelector('.smart-floating-ai-button')
        if (chatButton) {
          (chatButton as HTMLButtonElement).click()
        }
      }, 1000)
    }
  }

  useEffect(() => {
    setMounted(true)
    setIsClient(true)

    const loadVanta = async () => {
      // Загружаем Three.js
      if (!window.THREE) {
        const threeScript = document.createElement("script")
        threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
        document.head.appendChild(threeScript)

        await new Promise((resolve) => {
          threeScript.onload = resolve
        })
      }

      // Загружаем Vanta.js
      if (!window.VANTA) {
        const vantaScript = document.createElement("script")
        vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
        document.head.appendChild(vantaScript)

        await new Promise((resolve) => {
          vantaScript.onload = resolve
        })
      }

      if (window.VANTA && window.THREE) {
        const effect = window.VANTA.NET({
          el: "#vanta-background",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x6366f1,
          backgroundColor: 0x0a051a,
          points: 15.0,
          maxDistance: 30.0,
          spacing: 15.0,
        })
        setVantaEffect(effect)
      }

      setTimeout(() => {
        const preHeader = document.querySelector(".pre-header")
        if (preHeader) {
          preHeader.classList.add("holographic-text", "animate-fade-in")
          preHeader.setAttribute("data-text", preHeader.textContent || "")
        }

        const mainHeader = document.getElementById("animated-main-header")
        if (mainHeader) {
          mainHeader.classList.add("quantum-text", "holographic-projection")
          mainHeader.setAttribute("data-text", mainHeader.textContent || "")

          const text = mainHeader.textContent || ""
          mainHeader.innerHTML = ""

          // Создаем голографический эффект для каждой буквы
          text.split("").forEach((char, index) => {
            const span = document.createElement("span")
            span.className = "char dimensional-text"
            span.textContent = char === " " ? "\u00A0" : char
            span.style.animationDelay = `${index * 0.1}s`
            span.setAttribute("data-text", char === " " ? "\u00A0" : char)
            mainHeader.appendChild(span)
          })

          const chars = document.querySelectorAll("#animated-main-header .char")
          chars.forEach((char, index) => {
            setTimeout(() => {
              char.classList.add("visible")
            }, index * 100)
          })
        }

        const subHeader = document.querySelector(".sub-header")
        if (subHeader) {
          setTimeout(() => {
            subHeader.classList.add("holographic-text", "animate-slide-up")
            subHeader.setAttribute("data-text", subHeader.textContent || "")
          }, 1000)
        }

        const description = document.querySelector(".description")
        if (description) {
          setTimeout(() => {
            description.classList.add("quantum-text", "animate-fade-in-up")
            description.setAttribute("data-text", description.textContent || "")

            // Добавляем голографический эффект печатной машинки
            const originalText = description.textContent || ""
            description.textContent = ""

            let i = 0
            const typeInterval = setInterval(() => {
              if (i < originalText.length) {
                description.textContent += originalText.charAt(i)
                i++
              } else {
                clearInterval(typeInterval)
              }
            }, 50)
          }, 2000)
        }

        const ctaButton = document.querySelector(".cta-button")
        if (ctaButton) {
          setTimeout(() => {
            ctaButton.classList.add("holographic-projection", "animate-pulse-glow")
          }, 3000)
        }

        createFloatingParticles()
        createBinaryRain()
      }, 500)
    }

    const createBinaryRain = () => {
      const heroContent = document.querySelector(".hero-content")
      if (!heroContent) return

      const binaryRain = document.createElement("div")
      binaryRain.className = "binary-rain"
      heroContent.appendChild(binaryRain)

      // Уменьшаем количество символов на мобильных
      const isMobile = window.innerWidth < 768
      const charCount = isMobile ? 8 : 15

      for (let i = 0; i < charCount; i++) {
        const binaryChar = document.createElement("div")
        binaryChar.className = "binary-char"
        binaryChar.textContent = Math.random() > 0.5 ? "1" : "0"
        binaryChar.style.left = Math.random() * 100 + "%"
        binaryChar.style.animationDelay = Math.random() * 2 + "s"
        binaryChar.style.animationDuration = 3 + Math.random() * 2 + "s"
        binaryRain.appendChild(binaryChar)
      }
    }

    const createFloatingParticles = () => {
      // Не создаем частицы на мобильных устройствах
      if (window.innerWidth < 768) return

      const heroContent = document.querySelector(".hero-content")
      if (!heroContent) return

      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div")
        particle.className = "floating-particle"
        particle.style.left = Math.random() * 100 + "%"
        particle.style.top = Math.random() * 100 + "%"
        particle.style.animationDelay = Math.random() * 4 + "s"
        particle.style.animationDuration = 3 + Math.random() * 4 + "s"
        heroContent.appendChild(particle)
      }
    }

    loadVanta()

    // Обработка изменения размера окна
    const handleResize = () => {
      if (vantaEffect) {
        vantaEffect.resize()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (vantaEffect) {
        vantaEffect.destroy()
      }
    }
  }, [vantaEffect])

  if (!mounted) return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="pre-header">ЦИФРОВАЯ AI БИЗНЕС ПЛАТФОРМА</p>
        <h1 className="main-header" style={{ fontSize: 'clamp(48px, 12vw, 120px)' }}>NeuroExpert</h1>
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
        {isClient && <div id="vanta-background"></div>}
        <div className="hero-content">
        <p
          className="pre-header premium-text holographic-text animate-fade-in"
          data-text="ЦИФРОВАЯ AI БИЗНЕС ПЛАТФОРМА"
        >
          ЦИФРОВАЯ AI БИЗНЕС ПЛАТФОРМА
        </p>
        <h1
          className="main-header neural-network-title quantum-text holographic-projection"
          id="animated-main-header"
          data-text="NeuroExpert"
        >
          NeuroExpert
        </h1>
        <h2
          className="sub-header premium-subtitle holographic-text animate-slide-up"
          data-text="ЦИФРОВИЗАЦИЯ БИЗНЕСА С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ"
        >
          ЦИФРОВИЗАЦИЯ БИЗНЕСА
          <br />С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ
        </h2>
        <p
          className="description premium-description quantum-text animate-fade-in-up"
          data-text="Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов, используя передовые AI технологии"
        >
          Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте конкурентов, используя передовые AI
          технологии
        </p>
        <button 
          onClick={handleStartAI}
          className="cta-button premium-button holographic-projection animate-pulse-glow"
          aria-label="Начать работу с AI управляющим"
        >
          НАЧАТЬ С AI УПРАВЛЯЮЩИМ
        </button>
      </div>

        {/* Скрытый контейнер для AI чата */}
        <div id="smart-floating-ai-portal" style={{ display: 'none' }}></div>
      </section>
      
      {/* Ссылка на полную платформу */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => router.push('/platform')}
          className="px-6 py-3 bg-accent/20 hover:bg-accent/30 border border-accent rounded-full 
                     text-sm font-medium text-foreground/80 hover:text-foreground
                     transition-all duration-300 backdrop-blur-sm"
        >
          Перейти к полной платформе →
        </button>
      </div>
    </>
  )
}