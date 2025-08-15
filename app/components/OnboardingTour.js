'use client';
import { useState, useEffect } from 'react';

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Проверяем первый визит
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      if (!hasVisited) {
        setTimeout(() => setShowTour(true), 2000);
      }
    }
  }, []);

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Добро пожаловать в NeuroExpert! 👋',
      content: 'Мы - молодой стартап, который делает AI-технологии доступными для каждого бизнеса',
      action: 'Узнать больше',
      target: null,
      position: 'center'
    },
    {
      id: 'ai-demo',
      title: 'Попробуйте нашего AI-ассистента 🤖',
      content: 'Это не просто чат-бот. Это полноценный сотрудник, который знает всё о вашем бизнесе',
      action: 'Понятно',
      target: '.ai-chat-button',
      position: 'left'
    },
    {
      id: 'live-demo',
      title: 'Посмотрите живую демонстрацию 👀',
      content: 'Реальный пример работы AI-ассистента на сайте. Без преувеличений.',
      action: 'Интересно',
      target: '#live-demo',
      position: 'top'
    },
    {
      id: 'contact',
      title: 'Станьте одним из первых! 🚀',
      content: 'Специальные условия для первых 10 клиентов. Мы будем расти вместе!',
      action: 'Готов начать',
      target: '#contact',
      position: 'top'
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Прокручиваем к элементу
      const nextStep = tourSteps[currentStep + 1];
      if (nextStep.target) {
        const element = document.querySelector(nextStep.target);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    setIsComplete(true);
    localStorage.setItem('hasVisitedBefore', 'true');
    setTimeout(() => setShowTour(false), 500);
  };

  const skipTour = () => {
    completeTour();
  };

  if (!showTour) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Затемнение фона */}
      <div 
        className={`onboarding-overlay ${isComplete ? 'fade-out' : ''}`}
        onClick={skipTour}
      />
      
      {/* Подсветка элемента */}
      {currentTourStep.target && (
        <div className="onboarding-highlight" data-target={currentTourStep.target} />
      )}
      
      {/* Окно тура */}
      <div 
        className={`onboarding-tooltip ${currentTourStep.position} ${isComplete ? 'fade-out' : ''}`}
        style={getTooltipPosition(currentTourStep)}
      >
        <div className="onboarding-header">
          <span className="onboarding-step">Шаг {currentStep + 1} из {tourSteps.length}</span>
          <button className="onboarding-skip" onClick={skipTour}>
            Пропустить
          </button>
        </div>
        
        <h3 className="onboarding-title">{currentTourStep.title}</h3>
        <p className="onboarding-content">{currentTourStep.content}</p>
        
        <div className="onboarding-footer">
          <div className="onboarding-progress">
            {tourSteps.map((_, index) => (
              <div 
                key={index}
                className={`progress-dot ${index <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleNext}
          >
            {currentTourStep.action}
          </button>
        </div>
      </div>

      <style jsx>{`
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 9998;
          animation: fadeIn 0.3s ease-out;
          cursor: pointer;
        }

        .onboarding-overlay.fade-out {
          animation: fadeOut 0.3s ease-out;
        }

        .onboarding-highlight {
          position: fixed;
          border: 3px solid var(--primary);
          border-radius: 8px;
          box-shadow: 0 0 0 5000px rgba(0, 0, 0, 0.7);
          z-index: 9999;
          pointer-events: none;
          animation: pulse 2s ease-in-out infinite;
        }

        .onboarding-tooltip {
          position: fixed;
          background: var(--dark-card);
          border: 1px solid var(--primary);
          border-radius: 1rem;
          padding: 1.5rem;
          max-width: 400px;
          z-index: 10000;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        .onboarding-tooltip.fade-out {
          animation: fadeOut 0.3s ease-out;
        }

        .onboarding-tooltip.center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .onboarding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .onboarding-step {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .onboarding-skip {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.875rem;
          padding: 0;
          text-decoration: underline;
        }

        .onboarding-skip:hover {
          color: var(--text-primary);
        }

        .onboarding-title {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .onboarding-content {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .onboarding-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .onboarding-progress {
          display: flex;
          gap: 0.5rem;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--dark-border);
          transition: all 0.3s ease;
        }

        .progress-dot.active {
          background: var(--primary);
          transform: scale(1.2);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width: 480px) {
          .onboarding-tooltip {
            max-width: calc(100vw - 2rem);
            margin: 1rem;
          }

          .onboarding-tooltip.center {
            top: 50%;
            left: 1rem;
            right: 1rem;
            transform: translateY(-50%);
          }
        }
      `}</style>
    </>
  );
}

// Функция для позиционирования tooltip
function getTooltipPosition(step) {
  if (step.position === 'center') {
    return {};
  }

  // Здесь можно добавить логику для позиционирования относительно элементов
  // Для простоты возвращаем базовые позиции
  const positions = {
    top: { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
    left: { right: '20px', top: '50%', transform: 'translateY(-50%)' },
    bottom: { top: '20px', left: '50%', transform: 'translateX(-50%)' },
    right: { left: '20px', top: '50%', transform: 'translateY(-50%)' }
  };

  return positions[step.position] || {};
}