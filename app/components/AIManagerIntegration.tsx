'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

// Динамический импорт SmartFloatingAI для избежания SSR проблем
const SmartFloatingAI = dynamic(
  () => import('./SmartFloatingAI').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => null
  }
)

export default function AIManagerIntegration() {
  useEffect(() => {
    // Глобальная функция для открытия AI чата
    (window as any).openAIManager = () => {
      const existingChat = document.querySelector('.smart-floating-ai-container')
      if (existingChat) {
        const chatButton = existingChat.querySelector('button')
        if (chatButton) {
          (chatButton as HTMLButtonElement).click()
        }
      } else {
        // Создаем и открываем новый чат
        const event = new CustomEvent('openAIChat')
        window.dispatchEvent(event)
      }
    }

    // Слушаем события для открытия чата
    const handleOpenChat = () => {
      const chatButton = document.querySelector('.smart-floating-ai-button')
      if (chatButton) {
        (chatButton as HTMLButtonElement).click()
      }
    }

    window.addEventListener('openAIChat', handleOpenChat)

    return () => {
      window.removeEventListener('openAIChat', handleOpenChat)
      delete (window as any).openAIManager
    }
  }, [])

  return <SmartFloatingAI />
}