'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormData {
  name: string
  phone: string
  email: string
  company: string
  message: string
  service?: string
}

interface FormStatus {
  loading: boolean
  success: boolean
  error: boolean
  message: string
}

const services = [
  { value: 'ai-integration', label: '🤖 Внедрение AI', icon: '🤖' },
  { value: 'automation', label: '⚡ Автоматизация процессов', icon: '⚡' },
  { value: 'analytics', label: '📊 Аналитика и отчёты', icon: '📊' },
  { value: 'consulting', label: '💡 Консультация', icon: '💡' },
  { value: 'other', label: '📝 Другое', icon: '📝' }
]

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
    service: ''
  })
  
  const [status, setStatus] = useState<FormStatus>({
    loading: false,
    success: false,
    error: false,
    message: ''
  })

  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ loading: true, success: false, error: false, message: '' })

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-neuroexpert-csrf': '1'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: result.message || 'Спасибо! Мы свяжемся с вами в ближайшее время.'
        })
        setFormData({ name: '', phone: '', email: '', company: '', message: '', service: '' })
        
        // Сброс статуса через 5 секунд
        setTimeout(() => {
          setStatus({ loading: false, success: false, error: false, message: '' })
        }, 5000)
      } else {
        throw new Error(result.error || 'Ошибка отправки формы')
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: error instanceof Error ? error.message : 'Ошибка отправки. Попробуйте позже.'
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/)
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData(prev => ({ ...prev, phone: formatted }))
  }

  return (
    <section className="relative py-16 md:py-20 px-4">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] 
                      bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] 
                      bg-cyan-500/20 rounded-full blur-[100px] animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Заголовок */}
          <div className="text-center mb-10 md:mb-12">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 
                       bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Начните прямо сейчас
            </motion.h2>
            <motion.p 
              className="text-gray-400 text-base md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Оставьте заявку и мы свяжемся с вами в течение 15 минут
            </motion.p>
          </div>

          {/* Форма */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl md:rounded-3xl 
                     p-6 md:p-10 border border-purple-500/20 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Выбор услуги */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Что вас интересует?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <motion.label
                      key={service.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative cursor-pointer`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.value}
                        checked={formData.service === service.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`
                        p-3 md:p-4 rounded-xl border transition-all duration-300
                        ${formData.service === service.value
                          ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20'
                          : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
                        }
                      `}>
                        <div className="text-2xl mb-1">{service.icon}</div>
                        <div className="text-xs md:text-sm font-medium">
                          {service.label.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Имя и Телефон в одну строку на десктопе */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ваше имя *
                  </label>
                  <motion.div
                    animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="Иван Иванов"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl
                               text-white placeholder-gray-500 transition-all duration-300
                               focus:border-purple-500 focus:bg-gray-800/70 focus:outline-none
                               focus:ring-2 focus:ring-purple-500/20"
                    />
                  </motion.div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Телефон *
                  </label>
                  <motion.div
                    animate={{ scale: focusedField === 'phone' ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="+7 (999) 123-45-67"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl
                               text-white placeholder-gray-500 transition-all duration-300
                               focus:border-purple-500 focus:bg-gray-800/70 focus:outline-none
                               focus:ring-2 focus:ring-purple-500/20"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Email и Компания */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <motion.div
                    animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      placeholder="ivan@company.ru"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl
                               text-white placeholder-gray-500 transition-all duration-300
                               focus:border-purple-500 focus:bg-gray-800/70 focus:outline-none
                               focus:ring-2 focus:ring-purple-500/20"
                    />
                  </motion.div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Компания
                  </label>
                  <motion.div
                    animate={{ scale: focusedField === 'company' ? 1.02 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="ООО Компания"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl
                               text-white placeholder-gray-500 transition-all duration-300
                               focus:border-purple-500 focus:bg-gray-800/70 focus:outline-none
                               focus:ring-2 focus:ring-purple-500/20"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Сообщение */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Сообщение
                </label>
                <motion.div
                  animate={{ scale: focusedField === 'message' ? 1.02 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    placeholder="Расскажите о вашей задаче..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl
                             text-white placeholder-gray-500 transition-all duration-300
                             focus:border-purple-500 focus:bg-gray-800/70 focus:outline-none
                             focus:ring-2 focus:ring-purple-500/20 resize-none"
                  />
                </motion.div>
              </div>

              {/* Статус сообщение */}
              <AnimatePresence mode="wait">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`
                      p-4 rounded-xl text-center text-sm font-medium
                      ${status.success 
                        ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                      }
                    `}
                  >
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Кнопка отправки */}
              <motion.button
                type="submit"
                disabled={status.loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white
                  transition-all duration-300 flex items-center justify-center gap-3
                  ${status.loading 
                    ? 'bg-purple-600/50 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30'
                  }
                `}
              >
                {status.loading ? (
                  <>
                    <span>Отправка...</span>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  </>
                ) : (
                  <>
                    <span>Отправить заявку</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </motion.button>

              {/* Дополнительная информация */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                    политикой конфиденциальности
                  </a>
                </p>
              </div>
            </form>
          </motion.div>

          {/* Альтернативные способы связи */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 mb-4">Или свяжитесь с нами напрямую:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+74951234567"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 rounded-xl
                       border border-gray-700 hover:border-purple-500/50 transition-all duration-300
                       text-gray-300 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +7 (495) 123-45-67
              </a>
              <a
                href="mailto:info@neuroexpert.ru"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800/50 rounded-xl
                       border border-gray-700 hover:border-purple-500/50 transition-all duration-300
                       text-gray-300 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@neuroexpert.ru
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}