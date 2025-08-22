'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import HomePage from '../page'

// Динамические импорты
const ROICalculator = dynamic(
  () => import('../components/ROICalculator'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-96 rounded-lg" />
  }
)

const ContactForm = dynamic(
  () => import('../components/ContactForm'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg" />
  }
)

export default function HomeWithSections() {
  return (
    <div className="min-h-screen">
      {/* Главная страница */}
      <HomePage />
      
      {/* Дополнительные секции */}
      <div className="relative z-30 bg-background">
        {/* ROI Calculator Section */}
        <section id="roi-calculator" className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Рассчитайте свой ROI
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              Узнайте, сколько вы сможете сэкономить и заработать с помощью NeuroExpert
            </p>
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <ROICalculator />
            </Suspense>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              Возможности платформы
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border 
                             hover:border-accent transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 rounded-xl mb-6 bg-gradient-to-r ${feature.gradient} 
                                  flex items-center justify-center text-2xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Готовы трансформировать свой бизнес?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Присоединяйтесь к тысячам компаний, которые уже используют NeuroExpert
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => window.openAIManager?.()}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white 
                         font-semibold rounded-full hover:shadow-2xl hover:shadow-purple-500/25 
                         transition-all duration-300 transform hover:scale-105"
              >
                Начать бесплатно
              </button>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-card border border-border rounded-full font-semibold
                         hover:border-accent transition-all duration-300"
              >
                Запросить демо
              </button>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-20 px-4 bg-muted/20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">
              Свяжитесь с нами
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Наши эксперты помогут вам выбрать оптимальное решение
            </p>
            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <ContactForm />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  )
}

const features = [
  {
    icon: '🤖',
    title: 'AI Ассистенты',
    description: 'Интеллектуальные помощники для автоматизации рабочих процессов',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    icon: '📊',
    title: 'Аналитика',
    description: 'Детальная аналитика и прогнозирование для принятия решений',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: '🔗',
    title: 'Интеграции',
    description: 'Легкая интеграция с вашими существующими системами',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: '🛡️',
    title: 'Безопасность',
    description: 'Защита данных на уровне банковских стандартов',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    icon: '📱',
    title: 'Мобильность',
    description: 'Работайте с платформой из любого места и устройства',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    icon: '⚡',
    title: 'Скорость',
    description: 'Мгновенная обработка запросов и быстрая работа',
    gradient: 'from-yellow-500 to-amber-500'
  }
]