'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '../components/Navigation'

// Динамические импорты компонентов
const ROICalculator = dynamic(
  () => import('../components/ROICalculator'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-96 rounded-lg" />
  }
)

const ContactForm = dynamic(
  () => import('../components/ContactForm.tsx'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg" />
  }
)

const RealtimeStats = dynamic(
  () => import('../components/RealtimeStats'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-48 rounded-lg" />
  }
)

const QuickActions = dynamic(
  () => import('../components/QuickActions'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-32 rounded-lg" />
  }
)

export default function PlatformPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
              Платформа NeuroExpert
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Все инструменты для цифровизации вашего бизнеса с помощью AI
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Статистика в реальном времени</h2>
            <Suspense fallback={<div className="animate-pulse bg-muted h-48 rounded-lg" />}>
              <RealtimeStats />
            </Suspense>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Быстрые действия</h2>
            <Suspense fallback={<div className="animate-pulse bg-muted h-32 rounded-lg" />}>
              <QuickActions />
            </Suspense>
          </div>
        </section>

        {/* ROI Calculator */}
        <section id="roi-calculator" className="py-20 px-4 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Калькулятор ROI</h2>
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <ROICalculator />
            </Suspense>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Наши возможности</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">AI Автоматизация</h3>
                <p className="text-muted-foreground">
                  Автоматизируйте рутинные задачи с помощью искусственного интеллекта
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Аналитика</h3>
                <p className="text-muted-foreground">
                  Получайте детальную аналитику и прогнозы для вашего бизнеса
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Интеграции</h3>
                <p className="text-muted-foreground">
                  Интегрируйтесь с популярными сервисами и платформами
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 bg-muted/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Свяжитесь с нами</h2>
            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <ContactForm />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  )
}