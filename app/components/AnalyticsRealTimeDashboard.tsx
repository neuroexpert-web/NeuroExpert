'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AnalyticsRealTimeDashboard.module.css';

// Типы для всех сервисов аналитики
interface AnalyticsService {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  metrics: {
    [key: string]: {
      value: number | string;
      label: string;
      description: string;
      trend?: number;
      format?: 'number' | 'percent' | 'time' | 'currency';
    };
  };
}

export default function AnalyticsRealTimeDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<string>('overview');
  
  // Инициализация всех сервисов аналитики
  const [services, setServices] = useState<AnalyticsService[]>([
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Анализ посещаемости сайта и поведения пользователей',
      icon: '📊',
      color: '#4285F4',
      isActive: true,
      metrics: {
        visitors: { 
          value: 1247, 
          label: 'Посетители сейчас', 
          description: 'Количество людей на сайте прямо сейчас',
          trend: 12.5,
          format: 'number'
        },
        pageViews: { 
          value: 3892, 
          label: 'Просмотры страниц', 
          description: 'Сколько страниц просмотрели за сегодня',
          trend: 8.3,
          format: 'number'
        },
        avgTime: { 
          value: '2:34', 
          label: 'Время на сайте', 
          description: 'Среднее время, которое пользователи проводят на сайте',
          trend: 15.2,
          format: 'time'
        },
        bounceRate: { 
          value: 32.5, 
          label: 'Процент отказов', 
          description: 'Процент посетителей, которые ушли сразу',
          trend: -5.1,
          format: 'percent'
        }
      }
    },
    {
      id: 'yandex-metrica',
      name: 'Яндекс.Метрика',
      description: 'Российская система веб-аналитики с уникальными возможностями',
      icon: '🟡',
      color: '#FFCC00',
      isActive: true,
      metrics: {
        visitors: { 
          value: 892, 
          label: 'Визиты', 
          description: 'Количество визитов на сайт',
          trend: 10.2,
          format: 'number'
        },
        newVisitors: { 
          value: 67.3, 
          label: 'Новые посетители', 
          description: 'Процент людей, которые зашли впервые',
          trend: 3.5,
          format: 'percent'
        },
        depth: { 
          value: 4.2, 
          label: 'Глубина просмотра', 
          description: 'Среднее количество страниц за визит',
          trend: 7.8,
          format: 'number'
        },
        goals: { 
          value: 156, 
          label: 'Достигнутые цели', 
          description: 'Количество выполненных целевых действий',
          trend: 22.4,
          format: 'number'
        }
      }
    },
    {
      id: 'sentry',
      name: 'Sentry',
      description: 'Мониторинг ошибок и производительности в реальном времени',
      icon: '🛡️',
      color: '#362C63',
      isActive: true,
      metrics: {
        errors: { 
          value: 3, 
          label: 'Ошибки за час', 
          description: 'Количество ошибок в работе сайта',
          trend: -45.2,
          format: 'number'
        },
        errorRate: { 
          value: 0.02, 
          label: 'Процент ошибок', 
          description: 'Процент пользователей, столкнувшихся с ошибками',
          trend: -12.7,
          format: 'percent'
        },
        performance: { 
          value: 98.7, 
          label: 'Стабильность', 
          description: 'Процент времени без критических ошибок',
          trend: 2.1,
          format: 'percent'
        },
        affectedUsers: { 
          value: 12, 
          label: 'Затронутые пользователи', 
          description: 'Количество пользователей с ошибками',
          trend: -23.5,
          format: 'number'
        }
      }
    },
    {
      id: 'appmetrica',
      name: 'AppMetrica',
      description: 'Аналитика мобильных приложений от Яндекса',
      icon: '📱',
      color: '#FF6B6B',
      isActive: true,
      metrics: {
        activeUsers: { 
          value: 5423, 
          label: 'Активные пользователи', 
          description: 'Пользователи мобильного приложения сегодня',
          trend: 18.9,
          format: 'number'
        },
        sessions: { 
          value: 12847, 
          label: 'Сессии', 
          description: 'Количество запусков приложения',
          trend: 14.3,
          format: 'number'
        },
        crashRate: { 
          value: 0.3, 
          label: 'Процент сбоев', 
          description: 'Процент сессий с критическими ошибками',
          trend: -28.6,
          format: 'percent'
        },
        retention: { 
          value: 68.5, 
          label: 'Возвращаемость', 
          description: 'Процент пользователей, вернувшихся на следующий день',
          trend: 5.7,
          format: 'percent'
        }
      }
    },
    {
      id: 'openreplay',
      name: 'OpenReplay',
      description: 'Запись и воспроизведение сессий пользователей',
      icon: '🎥',
      color: '#5B47D9',
      isActive: true,
      metrics: {
        recordings: { 
          value: 342, 
          label: 'Записанные сессии', 
          description: 'Количество записей действий пользователей',
          trend: 12.4,
          format: 'number'
        },
        issues: { 
          value: 7, 
          label: 'Обнаруженные проблемы', 
          description: 'Проблемы в пользовательском опыте',
          trend: -15.3,
          format: 'number'
        },
        rageClicks: { 
          value: 23, 
          label: 'Клики раздражения', 
          description: 'Места, где пользователи многократно кликают от непонимания',
          trend: -8.7,
          format: 'number'
        },
        avgLoadTime: { 
          value: '1.2с', 
          label: 'Скорость загрузки', 
          description: 'Среднее время загрузки страниц',
          trend: -18.5,
          format: 'time'
        }
      }
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      description: 'Тепловые карты и анализ поведения пользователей',
      icon: '🔥',
      color: '#FF3C00',
      isActive: true,
      metrics: {
        heatmaps: { 
          value: 15, 
          label: 'Активные тепловые карты', 
          description: 'Визуализация кликов и движений мыши',
          trend: 0,
          format: 'number'
        },
        feedback: { 
          value: 47, 
          label: 'Отзывы пользователей', 
          description: 'Собранные мнения и предложения',
          trend: 32.1,
          format: 'number'
        },
        satisfaction: { 
          value: 4.3, 
          label: 'Оценка удовлетворенности', 
          description: 'Средняя оценка от пользователей (из 5)',
          trend: 6.2,
          format: 'number'
        },
        scrollDepth: { 
          value: 72.4, 
          label: 'Глубина прокрутки', 
          description: 'Средний процент прокрутки страниц',
          trend: 9.8,
          format: 'percent'
        }
      }
    }
  ]);

  // Эмуляция обновления данных в реальном времени
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prevServices => 
        prevServices.map(service => ({
          ...service,
          metrics: Object.fromEntries(
            Object.entries(service.metrics).map(([key, metric]) => {
              let newValue = metric.value;
              
              // Случайное изменение значений для демонстрации
              if (typeof metric.value === 'number') {
                const change = (Math.random() - 0.5) * 0.1; // ±5%
                newValue = Math.round(metric.value * (1 + change) * 100) / 100;
              } else if (metric.format === 'time' && typeof metric.value === 'string') {
                // Для времени просто оставляем как есть
                newValue = metric.value;
              }
              
              return [key, {
                ...metric,
                value: newValue,
                trend: metric.trend ? metric.trend + (Math.random() - 0.5) * 2 : 0
              }];
            })
          )
        }))
      );
    }, 3000); // Обновление каждые 3 секунды

    return () => clearInterval(interval);
  }, []);

  // Расчет общих метрик
  const overviewMetrics = {
    totalVisitors: services.reduce((sum, s) => {
      const visitorsMetric = s.metrics.visitors || s.metrics.activeUsers;
      return sum + (typeof visitorsMetric?.value === 'number' ? visitorsMetric.value : 0);
    }, 0),
    totalErrors: services.find(s => s.id === 'sentry')?.metrics.errors.value || 0,
    avgSatisfaction: services.find(s => s.id === 'hotjar')?.metrics.satisfaction.value || 0,
    totalGoals: services.find(s => s.id === 'yandex-metrica')?.metrics.goals.value || 0
  };

  return (
    <div ref={containerRef} className={styles.dashboard}>
      {/* Компактный заголовок */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>📊</span>
              Центр управления аналитикой
            </h1>
          </motion.div>

          {/* Демо-уведомление */}
          <motion.div 
            className={styles.demoNotice}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className={styles.demoIcon}>✨</span>
            <span>Демо-режим</span>
          </motion.div>
        </div>
      </div>

      {/* Основной контент со скроллом */}
      <div className={styles.mainContent}>
        {/* Общая статистика */}
        <section className={styles.overviewSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🎯</span>
            Ключевые показатели вашего бизнеса
          </h2>
          <div className={styles.overviewGrid}>
            <OverviewCard
              icon="👥"
              title="Общая аудитория"
              value={overviewMetrics.totalVisitors}
              description="Все пользователи на всех платформах прямо сейчас"
              color="#4285F4"
              trend={12.5}
            />
            <OverviewCard
              icon="✅"
              title="Достигнутые цели"
              value={overviewMetrics.totalGoals}
              description="Целевые действия пользователей (покупки, заявки)"
              color="#34A853"
              trend={22.4}
            />
            <OverviewCard
              icon="😊"
              title="Удовлетворенность"
              value={`${overviewMetrics.avgSatisfaction}/5`}
              description="Насколько довольны ваши клиенты"
              color="#FBBC04"
              trend={6.2}
            />
            <OverviewCard
              icon="⚠️"
              title="Технические проблемы"
              value={overviewMetrics.totalErrors}
              description="Ошибки, которые нужно исправить"
              color="#EA4335"
              trend={-45.2}
              inverse
            />
          </div>
        </section>

        {/* AI Рекомендации */}
        <section className={styles.aiSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🤖</span>
            AI рекомендации для вашего бизнеса
          </h2>
          <div className={styles.aiGrid}>
            <AIRecommendation
              icon="🚀"
              priority="high"
              title="Увеличьте конверсию на 25%"
              description="Замечен высокий процент отказов (32.5%) на странице оформления заказа. Упростите форму и добавьте прогресс-бар."
              metrics="Потенциал: +₽2.4М/месяц"
            />
            <AIRecommendation
              icon="⚡"
              priority="medium"
              title="Оптимизируйте скорость загрузки"
              description="Страницы грузятся 1.2 секунды, что на 20% медленнее конкурентов. Сжатие изображений увеличит конверсию."
              metrics="Потенциал: +15% к продажам"
            />
            <AIRecommendation
              icon="📱"
              priority="high"
              title="Мобильная аудитория растёт"
              description="68.5% пользователей заходят с мобильных. Адаптируйте критические страницы под мобильные устройства."
              metrics="Потенциал: +5400 клиентов"
            />
            <AIRecommendation
              icon="🎯"
              priority="low"
              title="Используйте ретаргетинг"
              description="47% посетителей возвращаются. Настройте персонализированные предложения для повторных визитов."
              metrics="Потенциал: +8% выручки"
            />
          </div>
        </section>

        {/* Сервисы аналитики */}
        <section className={styles.servicesSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🛠️</span>
            Подключенные сервисы аналитики
          </h2>
          <p className={styles.sectionDescription}>
            Каждый сервис отслеживает определенные аспекты вашего бизнеса
          </p>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onClick={() => setSelectedService(service.id)}
                isSelected={selectedService === service.id}
              />
            ))}
          </div>
        </section>

        {/* Детальная информация по выбранному сервису */}
        <AnimatePresence mode="wait">
          {selectedService !== 'overview' && (
            <motion.section
              key={selectedService}
              className={styles.detailSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {services
                .filter(s => s.id === selectedService)
                .map(service => (
                  <ServiceDetail key={service.id} service={service} />
                ))}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Преимущества для бизнеса */}
        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>💡</span>
            Как это поможет вашему бизнесу
          </h2>
          <div className={styles.benefitsGrid}>
            <BenefitCard
              icon="📈"
              title="Рост продаж"
              description="Понимайте, что работает, и масштабируйте успешные решения"
            />
            <BenefitCard
              icon="💰"
              title="Экономия бюджета"
              description="Не тратьте деньги на неэффективные каналы и решения"
            />
            <BenefitCard
              icon="🎯"
              title="Точные решения"
              description="Принимайте решения на основе данных, а не догадок"
            />
            <BenefitCard
              icon="😊"
              title="Довольные клиенты"
              description="Быстро находите и устраняйте проблемы пользователей"
            />
          </div>
        </section>

        {/* CTA секция */}
        <section className={styles.ctaSection}>
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className={styles.ctaTitle}>
              Хотите такую же систему аналитики для вашего бизнеса?
            </h2>
            <p className={styles.ctaDescription}>
              NeuroExpert настроит и интегрирует все необходимые инструменты, 
              обучит вашу команду и обеспечит поддержку
            </p>
            <button className={styles.ctaButton}>
              <span>Получить консультацию</span>
              <span className={styles.ctaArrow}>→</span>
            </button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

// Компонент карточки общей статистики
function OverviewCard({ icon, title, value, description, color, trend, inverse = false }: any) {
  const trendPositive = inverse ? trend < 0 : trend > 0;
  
  return (
    <motion.div 
      className={styles.overviewCard}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={styles.overviewIcon} style={{ backgroundColor: `${color}20` }}>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
      </div>
      <div className={styles.overviewContent}>
        <h3 className={styles.overviewTitle}>{title}</h3>
        <div className={styles.overviewValue}>
          <span className={styles.overviewNumber}>{typeof value === 'number' ? value.toLocaleString() : value}</span>
          {trend && (
            <span className={`${styles.overviewTrend} ${trendPositive ? styles.positive : styles.negative}`}>
              {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
        <p className={styles.overviewDescription}>{description}</p>
      </div>
    </motion.div>
  );
}

// Компонент карточки сервиса
function ServiceCard({ service, index, onClick, isSelected }: any) {
  return (
    <motion.div
      className={`${styles.serviceCard} ${isSelected ? styles.selected : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      style={{ borderColor: isSelected ? service.color : 'transparent' }}
    >
      <div className={styles.serviceHeader}>
        <div className={styles.serviceIcon}>{service.icon}</div>
        <div className={styles.serviceInfo}>
          <h3 className={styles.serviceName}>{service.name}</h3>
          <p className={styles.serviceDescription}>{service.description}</p>
        </div>
        <div className={`${styles.serviceStatus} ${service.isActive ? styles.active : ''}`}>
          {service.isActive ? 'Активен' : 'Неактивен'}
        </div>
      </div>
      
      <div className={styles.serviceMetrics}>
        {Object.entries(service.metrics).slice(0, 2).map(([key, metric]: [string, any]) => (
          <div key={key} className={styles.metricItem}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <span className={styles.metricValue}>
              {metric.format === 'percent' ? `${metric.value}%` : metric.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Компонент детальной информации о сервисе
function ServiceDetail({ service }: { service: AnalyticsService }) {
  return (
    <div className={styles.serviceDetail}>
      <div className={styles.detailHeader}>
        <div className={styles.detailIcon}>{service.icon}</div>
        <div>
          <h3 className={styles.detailTitle}>{service.name}</h3>
          <p className={styles.detailDescription}>{service.description}</p>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {Object.entries(service.metrics).map(([key, metric]: [string, any]) => (
          <motion.div
            key={key}
            className={styles.metricCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.metricHeader}>
              <h4 className={styles.metricTitle}>{metric.label}</h4>
              {metric.trend && (
                <span className={`${styles.metricTrend} ${metric.trend > 0 ? styles.positive : styles.negative}`}>
                  {metric.trend > 0 ? '↑' : '↓'} {Math.abs(metric.trend).toFixed(1)}%
                </span>
              )}
            </div>
            <div className={styles.metricValueLarge}>
              {metric.format === 'percent' ? `${metric.value}%` : 
               metric.format === 'currency' ? `₽${metric.value}` : 
               metric.value}
            </div>
            <p className={styles.metricDescription}>{metric.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Компонент карточки преимущества
function BenefitCard({ icon, title, description }: any) {
  return (
    <motion.div
      className={styles.benefitCard}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={styles.benefitIcon}>{icon}</div>
      <h3 className={styles.benefitTitle}>{title}</h3>
      <p className={styles.benefitDescription}>{description}</p>
    </motion.div>
  );
}

// Компонент AI рекомендации
function AIRecommendation({ icon, priority, title, description, metrics }: any) {
  const priorityColors: Record<string, string> = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return (
    <motion.div
      className={styles.aiCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      style={{ borderColor: priorityColors[priority as string] + '40' }}
    >
      <div className={styles.aiHeader}>
        <div className={styles.aiIcon}>{icon}</div>
        <div className={styles.aiPriority} style={{ color: priorityColors[priority as string] }}>
          {priority === 'high' ? 'Высокий приоритет' : 
           priority === 'medium' ? 'Средний приоритет' : 'Низкий приоритет'}
        </div>
      </div>
      <h3 className={styles.aiTitle}>{title}</h3>
      <p className={styles.aiDescription}>{description}</p>
      <div className={styles.aiMetrics}>
        <span className={styles.aiMetricsIcon}>💰</span>
        <span>{metrics}</span>
      </div>
    </motion.div>
  );
}