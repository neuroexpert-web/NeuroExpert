'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { IconSparkles, IconRocket, IconBrain, IconConfetti } from '@tabler/icons-react';

// Динамические импорты для оптимизации
// const ParticlesBackground = dynamic(() => import('../components/enhanced/ParticlesBackground'), { ssr: false }); // Временно отключено
const AnimatedCard3D = dynamic(() => import('../components/enhanced/AnimatedCard3D'), {
  ssr: false,
});
const LottieAnimation = dynamic(() => import('../components/enhanced/LottieAnimation'), {
  ssr: false,
});
const TypewriterText = dynamic(() => import('../components/enhanced/TypewriterText'), {
  ssr: false,
});
const CountUpAnimation = dynamic(() => import('../components/enhanced/CountUpAnimation'), {
  ssr: false,
});
const NotificationSystem = dynamic(() => import('../components/enhanced/NotificationSystem'), {
  ssr: false,
});
const ConfettiEffect = dynamic(() => import('../components/enhanced/ConfettiEffect'), {
  ssr: false,
});

import { showNotification } from '../components/enhanced/NotificationSystem';

export default function DesignShowcase() {
  const [confettiActive, setConfettiActive] = useState(false);

  const handleNotification = (type) => {
    switch (type) {
      case 'success':
        showNotification.success('Операция выполнена успешно! 🎉');
        break;
      case 'error':
        showNotification.error('Произошла ошибка при выполнении операции');
        break;
      case 'info':
        showNotification.info('Это информационное сообщение');
        break;
      case 'warning':
        showNotification.warning('Внимание! Проверьте введенные данные');
        break;
      case 'loading':
        const loadingToast = showNotification.loading('Загрузка данных...');
        setTimeout(() => {
          showNotification.success('Данные загружены!', { id: loadingToast });
        }, 3000);
        break;
    }
  };

  return (
    <div className="design-showcase">
      {/* ParticlesBackground временно отключен */}
      <NotificationSystem />
      <ConfettiEffect active={confettiActive} />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="showcase-header"
        >
          <h1 className="showcase-title">
            <IconSparkles size={48} className="title-icon" />
            Showcase Графики и Дизайна
          </h1>
          <TypewriterText
            className="showcase-subtitle"
            sequence={[
              'Современные анимации и эффекты',
              2000,
              'Интерактивные компоненты',
              2000,
              'Премиум дизайн элементы',
              2000,
            ]}
          />
        </motion.div>

        {/* 3D Карточки */}
        <section className="showcase-section">
          <h2>3D Интерактивные карточки</h2>
          <div className="cards-grid">
            <AnimatedCard3D className="showcase-card">
              <IconRocket size={48} className="card-icon" />
              <h3>Быстрый старт</h3>
              <p>Наведите курсор для 3D эффекта с отражением света</p>
            </AnimatedCard3D>

            <AnimatedCard3D className="showcase-card" glareMaxOpacity={0.8}>
              <IconBrain size={48} className="card-icon" />
              <h3>AI Интеграция</h3>
              <p>Продвинутые голографические эффекты</p>
            </AnimatedCard3D>
          </div>
        </section>

        {/* Анимированные числа */}
        <section className="showcase-section">
          <h2>Анимированные метрики</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <CountUpAnimation end={98} suffix="%" duration={3} />
              <p>Удовлетворенность клиентов</p>
            </div>

            <div className="metric-card">
              <CountUpAnimation end={2500000} prefix="₽" separator=" " duration={3} />
              <p>Сэкономлено клиентами</p>
            </div>

            <div className="metric-card">
              <CountUpAnimation end={150} suffix="+" duration={3} />
              <p>Активных проектов</p>
            </div>
          </div>
        </section>

        {/* Уведомления */}
        <section className="showcase-section">
          <h2>Система уведомлений</h2>
          <div className="notification-buttons">
            <button className="btn btn-success" onClick={() => handleNotification('success')}>
              Успех
            </button>
            <button className="btn btn-error" onClick={() => handleNotification('error')}>
              Ошибка
            </button>
            <button className="btn btn-info" onClick={() => handleNotification('info')}>
              Информация
            </button>
            <button className="btn btn-warning" onClick={() => handleNotification('warning')}>
              Предупреждение
            </button>
            <button className="btn btn-loading" onClick={() => handleNotification('loading')}>
              Загрузка
            </button>
          </div>
        </section>

        {/* Конфетти */}
        <section className="showcase-section">
          <h2>Эффекты празднования</h2>
          <button className="btn btn-confetti" onClick={() => setConfettiActive(true)}>
            <IconConfetti size={20} />
            Запустить конфетти!
          </button>
        </section>
      </div>

      <style jsx>{`
        .design-showcase {
          min-height: 100vh;
          background: var(--noir-900);
          color: var(--white);
          position: relative;
          overflow-x: hidden;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
          position: relative;
          z-index: 1;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .showcase-title {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .title-icon {
          color: var(--gold-500);
        }

        .showcase-section {
          margin-bottom: 6rem;
        }

        .showcase-section h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
          background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        :global(.showcase-card) {
          text-align: center;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        :global(.card-icon) {
          color: var(--gold-500);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          text-align: center;
        }

        .metric-card {
          background: rgba(251, 191, 36, 0.1);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid rgba(251, 191, 36, 0.2);
        }

        .metric-card p {
          margin-top: 1rem;
          color: var(--gray-400);
        }

        .notification-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .btn {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .btn-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .btn-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .btn-info {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .btn-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .btn-loading {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .btn-confetti {
          background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
