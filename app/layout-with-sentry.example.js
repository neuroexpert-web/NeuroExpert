// Пример интеграции ErrorBoundary в layout.js
// Скопируйте этот код в ваш app/layout.js после импорта ErrorBoundary

import { Inter } from 'next/font/google'
import './globals.css'
import './styles/premium-design-system.css'
import './styles/premium-glass-sections.css'
import './styles/mobile-fixes.css'
import Script from 'next/script'
import ErrorBoundary from './components/ErrorBoundary'

// ... остальные импорты и настройки ...

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        {/* Ваши meta теги и скрипты */}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Оборачиваем всё приложение в ErrorBoundary */}
        <ErrorBoundary>
          <div id="root">
            {children}
          </div>
        </ErrorBoundary>
        
        {/* Ваши скрипты */}
      </body>
    </html>
  )
}

// Альтернативный вариант с более детальным контролем:
export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        {/* meta теги */}
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Можно обернуть только определенные части */}
        <ErrorBoundary>
          <header>
            {/* Навигация */}
          </header>
          
          <main>
            <ErrorBoundary>
              {/* Критичная часть приложения */}
              {children}
            </ErrorBoundary>
          </main>
          
          <footer>
            {/* Футер */}
          </footer>
        </ErrorBoundary>
        
        {/* Скрипты */}
      </body>
    </html>
  )
}