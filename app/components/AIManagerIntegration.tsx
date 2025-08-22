'use client'

import { useEffect } from 'react'

export default function AIManagerIntegration() {
  useEffect(() => {
    // Глобальная функция для открытия AI чата
    (window as any).openAIManager = () => {
      // Ищем существующую кнопку чата
      const chatButton = document.querySelector('.smart-floating-ai-button') as HTMLButtonElement
      if (chatButton) {
        chatButton.click()
      } else {
        // Диспатчим событие для открытия чата
        const event = new CustomEvent('openAIChat')
        window.dispatchEvent(event)
      }
    }

    return () => {
      delete (window as any).openAIManager
    }
  }, [])

  return null // Этот компонент только добавляет функциональность
}