'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AIDirectorCapabilities() {
  const [activeTab, setActiveTab] = useState('orchestrator');
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Данные из бизнес-логики NeuroExpert
  const orchestratorData = {
    orchestrator: {
      title: 'AI Orchestrator v3.0',
      icon: '🎯',
      content: {
        description: 'Центральный AI-агент, координирующий работу всех специалистов',
        features: [
          'Управление контекстом проекта',
          'Приоритизация задач',
          'Распределение ресурсов',
          'Гарантия 300%+ ROI'
        ],
        process: [
          'Прием и анализ запроса',
          'Восстановление контекста',
          'Триажирование задач',
          'Координация и мониторинг',
          'Многоуровневая QA',
          'Выдача результата'
        ]
      }
    },
    agents: {
      title: 'AI Агенты-специалисты',
      icon: '🤖',
      content: {
        list: [
          { id: 'auditor', name: 'Аудитор', icon: '📊', role: 'Анализ цифровой зрелости' },
          { id: 'strategist', name: 'Стратег', icon: '🎯', role: 'Разработка сценариев роста' },
          { id: 'designer', name: 'Дизайнер', icon: '🎨', role: 'UX/UI проектирование' },
          { id: 'developer', name: 'Разработчик', icon: '👨‍💻', role: 'Реализация решений' },
          { id: 'integrator', name: 'Интегратор', icon: '🔗', role: 'Подключение сервисов' },
          { id: 'pricer', name: 'Прайсер', icon: '💰', role: 'Расчет стоимости' },
          { id: 'executor', name: 'Исполнитель', icon: '⚡', role: 'Внедрение и запуск' }
        ]
      }
    },
    context: {
      title: 'JSON Context Vault',
      icon: '🗄️',
      content: {
        description: 'Единая база контекста проекта с нулевой потерей данных',
        benefits: [
          'Полная персистентность контекста',
          'Реальное время обновлений',
          'Синхронизация всех агентов',
          'История всех изменений'
        ]
      }
    },
    integrations: {
      title: 'API Интеграции',
      icon: '🔌',
      content: {
        services: [
          { name: 'Google Analytics & Gemini', icon: '📈' },
          { name: 'Яндекс.Метрика & Цены', icon: '📊' },
          { name: 'Claude & OpenAI', icon: '🤖' },
          { name: 'CRM системы', icon: '💼' },
          { name: 'Платежные системы', icon: '💳' },
          { name: 'Биржи труда', icon: '👥' }
        ]
      }
    }
  };

  const agentDetails = {
    auditor: {
      name: 'AI Аудитор',
      description: 'Проводит комплексный анализ текущего состояния бизнеса',
      capabilities: [
        'Аудит цифровой зрелости',
        'Конкурентный анализ',
        'Оценка рынка и технологий',
        'Выявление точек роста'
      ],
      metrics: ['25+ параметров анализа', '72 часа на полный аудит', '95% точность']
    },
    strategist: {
      name: 'AI Стратег',
      description: 'Разрабатывает персонализированные стратегии роста',
      capabilities: [
        'Сценарии развития (консервативный, амбициозный, прорывной)',
        'ROI-моделирование',
        'Дорожная карта трансформации',
        'Риск-менеджмент'
      ],
      metrics: ['3 сценария развития', 'ROI от 300%', 'Окупаемость 6-12 мес']
    },
    designer: {
      name: 'AI Дизайнер',
      description: 'Создает современный UX/UI дизайн',
      capabilities: [
        'Исследование пользователей',
        'Проектирование интерфейсов',
        'Дизайн-системы',
        'A/B тестирование'
      ],
      metrics: ['Конверсия +150%', 'NPS 80+', 'Скорость загрузки < 3с']
    },
    developer: {
      name: 'AI Разработчик',
      description: 'Реализует технические решения любой сложности',
      capabilities: [
        'Full-stack разработка',
        'Микросервисная архитектура',
        'API интеграции',
        'DevOps автоматизация'
      ],
      metrics: ['99.9% uptime', '< 100ms отклик', '100% покрытие тестами']
    },
    integrator: {
      name: 'AI Интегратор',
      description: 'Подключает и настраивает внешние сервисы',
      capabilities: [
        'CRM интеграция',
        'Платежные системы',
        'Аналитика и метрики',
        'Маркетинговые инструменты'
      ],
      metrics: ['50+ готовых интеграций', '24/7 мониторинг', 'API first подход']
    },
    pricer: {
      name: 'AI Прайсер',
      description: 'Рассчитывает оптимальную стоимость с учетом всех факторов',
      capabilities: [
        'Динамическое ценообразование',
        'Учет инфляции и рынка',
        'Персональные скидки',
        'Прозрачная калькуляция'
      ],
      metrics: ['10-15% ниже рынка', 'Точность ±5%', 'Обновление цен online']
    },
    executor: {
      name: 'AI Исполнитель',
      description: 'Обеспечивает качественное внедрение и запуск',
      capabilities: [
        'Управление проектом',
        'Контроль качества',
        'Обучение команды',
        'Пост-релизная поддержка'
      ],
      metrics: ['0-1 итераций правок', 'SLA 99%', '24/7 поддержка']
    }
  };

  return (
    <section className="py-20 px-4 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="aurora-text">AI Orchestrator & Agents</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Оркестрация независимых AI-агентов для полного цикла digital-трансформации
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {Object.entries(orchestratorData).map(([key, data]) => (
            <motion.button
              key={key}
              onClick={() => setActiveTab(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`glass-card px-6 py-3 rounded-xl transition-all ${
                activeTab === key ? 'border-aurora-purple' : ''
              }`}
              style={{
                borderColor: activeTab === key ? 'var(--aurora-purple)' : '',
                background: activeTab === key ? 'rgba(168, 85, 247, 0.1)' : ''
              }}
            >
              <span className="text-2xl mr-2">{data.icon}</span>
              <span className="font-semibold">{data.title}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 rounded-2xl"
        >
          {activeTab === 'orchestrator' && (
            <div>
              <h3 className="text-2xl font-bold mb-4 aurora-text">
                {orchestratorData.orchestrator.content.description}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-aurora-cyan">
                    Ключевые возможности
                  </h4>
                  <ul className="space-y-3">
                    {orchestratorData.orchestrator.content.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-aurora-green">✓</span>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-aurora-purple">
                    Процесс работы
                  </h4>
                  <ol className="space-y-3">
                    {orchestratorData.orchestrator.content.process.map((step, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-aurora-cyan font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="glass-card-light p-6 rounded-xl">
                <p className="text-center text-lg">
                  <span className="text-2xl mr-2">🎯</span>
                  Миссия: гарантировать клиенту <span className="aurora-text font-bold">300%+ ROI</span>, 
                  минимизировать количество переделок и обеспечивать персистентность контекста
                </p>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">
                Команда AI-специалистов
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {orchestratorData.agents.content.list.map((agent) => (
                  <motion.div
                    key={agent.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAgent(agent.id)}
                    className="glass-card-light p-4 rounded-xl cursor-pointer transition-all hover:border-aurora-purple"
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{agent.icon}</div>
                      <h4 className="font-semibold text-lg">{agent.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{agent.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedAgent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card-light p-6 rounded-xl"
                >
                  <h4 className="text-xl font-bold mb-3 aurora-text">
                    {agentDetails[selectedAgent].name}
                  </h4>
                  <p className="mb-4 text-gray-300">
                    {agentDetails[selectedAgent].description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-2 text-aurora-cyan">Возможности:</h5>
                      <ul className="space-y-2">
                        {agentDetails[selectedAgent].capabilities.map((cap, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <span className="text-aurora-green mt-0.5">•</span>
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2 text-aurora-purple">Метрики:</h5>
                      <div className="space-y-2">
                        {agentDetails[selectedAgent].metrics.map((metric, idx) => (
                          <div key={idx} className="bg-black/30 px-3 py-2 rounded-lg text-sm">
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'context' && (
            <div>
              <h3 className="text-2xl font-bold mb-4 aurora-text">
                {orchestratorData.context.content.description}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-aurora-cyan">
                    Преимущества системы
                  </h4>
                  {orchestratorData.context.content.benefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card-light p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💎</span>
                        <span>{benefit}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="glass-card-light p-6 rounded-xl">
                  <h4 className="text-xl font-semibold mb-4 text-aurora-purple">
                    Архитектура
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Формат хранения</span>
                      <span className="font-mono text-aurora-cyan">JSON</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Синхронизация</span>
                      <span className="font-mono text-aurora-green">Real-time</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Версионирование</span>
                      <span className="font-mono text-aurora-purple">Git-based</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Шифрование</span>
                      <span className="font-mono text-aurora-pink">AES-256</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">
                Экосистема интеграций
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orchestratorData.integrations.content.services.map((service, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="glass-card-light p-6 rounded-xl text-center"
                  >
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <h4 className="font-semibold">{service.name}</h4>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-300">
                  <span className="aurora-text font-bold">50+</span> готовых интеграций
                  для автоматизации всех процессов вашего бизнеса
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }

        .glass-card-light {
          background: var(--glass-bg-light);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 1px solid var(--glass-border);
        }

        .aurora-text {
          background: linear-gradient(135deg, var(--aurora-cyan) 0%, var(--aurora-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .text-aurora-cyan { color: var(--aurora-cyan); }
        .text-aurora-purple { color: var(--aurora-purple); }
        .text-aurora-green { color: var(--aurora-green); }
        .text-aurora-pink { color: var(--aurora-pink); }
        .border-aurora-purple { border-color: var(--aurora-purple) !important; }
      `}</style>
    </section>
  );
}