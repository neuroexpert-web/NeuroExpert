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
          'Многолетний опыт цифровой трансформации',
          'Эксперт в AI и машинном обучении',
          'Спикер международных конференций',
          'Автор методологии быстрой цифровизации',
        ],
      },
    },
    intelligence: {
      title: 'Эмоциональный интеллект',
      icon: '🧠',
      content: {
        skills: [
          'Понимает контекст и подтекст вопросов',
          'Адаптирует стиль общения под клиента',
          'Распознает эмоции и опасения',
          'Предлагает персонализированные решения',
        ],
      },
    },
    expertise: {
      title: 'Экспертиза',
      icon: '🎯',
      content: {
        industries: ['E-commerce', 'B2B', 'Услуги', 'Образование', 'Медицина'],
        technologies: ['GPT-4', 'Claude 3', 'Gemini Pro', 'Custom AI'],
        solutions: ['Сайты', 'Приложения', 'CRM', 'Автоматизация'],
      },
    },
    results: {
      title: 'Результаты',
      icon: '📈',
      content: {
        metrics: [
          'Конверсия: рост с 2% до 15%',
          'Стоимость лида: снижение на 70%',
          'LTV: увеличение на 120%',
          'ROI: от 300% за 6 месяцев',
        ],
      },
    },
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
              onClick={() => setActiveTab(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow:
                  activeTab === key
                    ? [
                        '0 0 25px rgba(102, 126, 234, 0.6), inset 0 0 15px rgba(102, 126, 234, 0.3)',
                        '0 0 35px rgba(118, 75, 162, 0.7), inset 0 0 20px rgba(118, 75, 162, 0.4)',
                        '0 0 25px rgba(102, 126, 234, 0.6), inset 0 0 15px rgba(102, 126, 234, 0.3)',
                      ]
                    : ['0 0 15px rgba(102, 126, 234, 0.3)'],
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: activeTab === key ? Infinity : 0,
                  ease: 'easeInOut',
                },
              }}
              style={{
                padding: '12px 24px',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background:
                  activeTab === key
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(20, 20, 40, 0.6)',
                border:
                  activeTab === key
                    ? '2px solid transparent'
                    : '2px solid rgba(102, 126, 234, 0.3)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontSize: '24px' }}>{cap.icon}</span>
              <motion.span
                animate={{
                  backgroundPosition:
                    activeTab === key ? ['0% 50%', '100% 50%', '0% 50%'] : ['0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: activeTab === key ? Infinity : 0,
                  ease: 'linear',
                }}
                style={{
                  background:
                    activeTab === key
                      ? 'linear-gradient(90deg, #fff, #f0f0ff, #e0e7ff, #f0f0ff, #fff)'
                      : 'linear-gradient(90deg, #fff, #fff)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter:
                    activeTab === key ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))' : 'none',
                  fontWeight: '700',
                }}
              >
                {cap.title}
              </motion.span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'rgba(20, 20, 40, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            boxShadow:
              '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(102, 126, 234, 0.2), inset 0 0 20px rgba(102, 126, 234, 0.1)',
          }}
        >
          {activeTab === 'personality' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {capabilities.personality.content.name}
                </h3>
                <p style={{ color: '#e0e7ff', marginBottom: '8px', fontSize: '18px' }}>
                  {capabilities.personality.content.role}
                </p>
                <p
                  style={{
                    color: '#667eea',
                    marginBottom: '24px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                >
                  {capabilities.personality.content.experience}
                </p>
              </div>
              <div>
                <h4
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    color: '#e0e7ff',
                  }}
                >
                  Достижения:
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {capabilities.personality.content.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                        padding: '12px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                      }}
                    >
                      <span style={{ color: '#667eea', marginRight: '8px', fontSize: '20px' }}>
                        ✨
                      </span>
                      <span style={{ color: '#f0f0ff', fontSize: '15px' }}>{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'intelligence' && (
            <div>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Навыки эмпатии и понимания
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {capabilities.intelligence.content.skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(102, 126, 234, 0.4)' }}
                    style={{
                      background: 'rgba(102, 126, 234, 0.1)',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>💡</span>
                    <span style={{ color: '#f0f0ff', fontSize: '16px' }}>{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expertise' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Отрасли</h4>
                {capabilities.expertise.content.industries.map((industry, i) => (
                  <div key={i} className="badge-premium mb-2">
                    {industry}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Технологии</h4>
                {capabilities.expertise.content.technologies.map((tech, i) => (
                  <div key={i} className="badge-premium mb-2">
                    {tech}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Решения</h4>
                {capabilities.expertise.content.solutions.map((solution, i) => (
                  <div key={i} className="badge-premium mb-2">
                    {solution}
                  </div>
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
          <p className="text-gray-400 mb-6">Попробуйте пообщаться с AI директором прямо сейчас!</p>
          <motion.button
            onClick={() => {
              // Открыть чат
              import('@/app/utils/aiChat').then(({ openAIChat }) => {
                openAIChat();
              });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 40px rgba(102, 126, 234, 0.5), 0 0 80px rgba(118, 75, 162, 0.3)',
                '0 0 60px rgba(118, 75, 162, 0.6), 0 0 100px rgba(102, 126, 234, 0.4)',
                '0 0 40px rgba(102, 126, 234, 0.5), 0 0 80px rgba(118, 75, 162, 0.3)',
              ],
            }}
            transition={{
              boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            style={{
              position: 'relative',
              padding: '20px 48px',
              fontSize: '20px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '60px',
              color: 'white',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Волна свечения */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
              animate={{
                x: ['-50%', '150%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />

            <motion.span
              style={{
                background: 'linear-gradient(90deg, #fff, #f0f0ff, #e0e7ff, #f0f0ff, #fff)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              Начать диалог с AI директором
            </motion.span>

            {/* Морфинг иконок */}
            <div style={{ position: 'relative', width: '32px', height: '32px' }}>
              {/* Мозг */}
              <motion.svg
                style={{ position: 'absolute', top: 0, left: 0 }}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                animate={{
                  opacity: [1, 1, 0, 0, 0, 0, 1],
                  scale: [1, 1.1, 0.8, 0, 0, 0, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  times: [0, 0.14, 0.16, 0.17, 0.5, 0.83, 0.84],
                }}
              >
                <path d="M9.5 2a4.5 4.5 0 00-3.5 7.5c-.5.5-1 1.5-1 2.5 0 1.5 1 3 2.5 3.5.5 3 2.5 4.5 5.5 4.5s5-1.5 5.5-4.5c1.5-.5 2.5-2 2.5-3.5 0-1-.5-2-1-2.5A4.5 4.5 0 0016.5 2c-1.5 0-2.5.5-3.5 1.5-1-1-2-1.5-3.5-1.5z" />
              </motion.svg>

              {/* Чат */}
              <motion.svg
                style={{ position: 'absolute', top: 0, left: 0 }}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                animate={{
                  opacity: [0, 0, 0, 1, 1, 0, 0],
                  scale: [0, 0, 0.8, 1, 1.1, 0.8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  times: [0, 0.16, 0.17, 0.33, 0.47, 0.49, 0.5],
                }}
              >
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </motion.svg>

              {/* Лампочка */}
              <motion.svg
                style={{ position: 'absolute', top: 0, left: 0 }}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                animate={{
                  opacity: [0, 0, 0, 0, 0, 1, 1, 0, 0],
                  scale: [0, 0, 0, 0, 0.8, 1, 1.1, 0.8, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  times: [0, 0.33, 0.49, 0.5, 0.51, 0.67, 0.81, 0.83, 0.84],
                }}
              >
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </motion.svg>

              {/* Искра свечения */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
                animate={{
                  opacity: [0, 0.5, 0, 0.5, 0, 0.5, 0],
                  scale: [0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
