'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AIDirectorCapabilities() {
  const [activeTab, setActiveTab] = useState('personality');

  const capabilities = {
    personality: {
      title: 'Личность и опыт',
      icon: '👨‍💼',
      content: {
        name: 'Александр Нейронов',
        role: 'Управляющий директор NeuroExpert',
        experience: '15+ лет в IT и цифровой трансформации',
        achievements: [
          '500+ успешных проектов',
          'Эксперт в AI и машинном обучении',
          'Спикер международных конференций',
          'Автор методологии быстрой цифровизации'
        ]
      }
    },
    intelligence: {
      title: 'Эмоциональный интеллект',
      icon: '🧠',
      content: {
        skills: [
          'Понимает контекст и подтекст вопросов',
          'Адаптирует стиль общения под клиента',
          'Распознает эмоции и опасения',
          'Предлагает персонализированные решения'
        ]
      }
    },
    expertise: {
      title: 'Экспертиза',
      icon: '🎯',
      content: {
        industries: ['E-commerce', 'B2B', 'Услуги', 'Образование', 'Медицина'],
        technologies: ['GPT-4', 'Claude 3', 'Gemini Pro', 'Custom AI'],
        solutions: ['Сайты', 'Приложения', 'CRM', 'Автоматизация']
      }
    },
    results: {
      title: 'Результаты',
      icon: '📈',
      content: {
        metrics: [
          'Конверсия: рост с 2% до 15%',
          'Стоимость лида: снижение на 70%',
          'LTV: увеличение на 120%',
          'ROI: от 300% за 6 месяцев'
        ]
      }
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">AI Управляющий директор</span>
          </h2>
          <p className="text-xl text-gray-400">
            Интеллектуальный помощник, который понимает ваш бизнес
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {Object.entries(capabilities).map(([key, cap]) => (
            <motion.button
              key={key}
              className={`glass px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === key ? 'bg-primary text-white' : ''
              }`}
              onClick={() => setActiveTab(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl mr-2">{cap.icon}</span>
              {cap.title}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="card-premium"
        >
          {activeTab === 'personality' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">{capabilities.personality.content.name}</h3>
                <p className="text-gray-300 mb-2">{capabilities.personality.content.role}</p>
                <p className="text-primary mb-6">{capabilities.personality.content.experience}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Достижения:</h4>
                <ul className="space-y-2">
                  {capabilities.personality.content.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary mr-2">✓</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'intelligence' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Навыки эмпатии и понимания</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {capabilities.intelligence.content.skills.map((skill, i) => (
                  <div key={i} className="glass p-4 rounded-lg hover-lift">
                    <span className="text-primary text-xl mr-2">💡</span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expertise' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Отрасли</h4>
                {capabilities.expertise.content.industries.map((industry, i) => (
                  <div key={i} className="badge-premium mb-2">{industry}</div>
                ))}
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Технологии</h4>
                {capabilities.expertise.content.technologies.map((tech, i) => (
                  <div key={i} className="badge-premium mb-2">{tech}</div>
                ))}
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Решения</h4>
                {capabilities.expertise.content.solutions.map((solution, i) => (
                  <div key={i} className="badge-premium mb-2">{solution}</div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Гарантированные результаты</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {capabilities.results.content.metrics.map((metric, i) => (
                  <motion.div
                    key={i}
                    className="glass p-6 rounded-xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-lg">{metric}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-400 mb-6">
            Попробуйте пообщаться с AI директором прямо сейчас!
          </p>
          <button
            className="btn-premium"
            onClick={() => {
              // Открыть чат
              const event = new CustomEvent('openAIChat');
              window.dispatchEvent(event);
            }}
          >
            Начать диалог с AI директором
            <svg className="inline-block ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}