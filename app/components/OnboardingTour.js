'use client';

import { useState, useEffect } from 'react';

export default function OnboardingTour() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const tourSteps = [
    {
      target: '.kpi-cards',
      title: 'Ваши ключевые показатели',
      content: 'Здесь отображаются самые важные метрики вашего бизнеса в реальном времени. Нажмите на иконку вопроса для подробностей.',
      position: 'bottom'
    },
    {
      target: '.filters-panel',
      title: 'Фильтры данных',
      content: 'Используйте эти фильтры, чтобы видеть данные за нужный период и по конкретным сегментам клиентов.',
      position: 'bottom'
    },
    {
      target: '.charts-section',
      title: 'Детальная аналитика',
      content: 'Интерактивные графики помогут глубже понять тренды и паттерны в вашем бизнесе.',
      position: 'top'
    },
    {
      target: '.ai-recommendations',
      title: 'Умные рекомендации',
      content: 'AI анализирует ваши данные и предлагает конкретные действия для роста бизнеса.',
      position: 'top'
    }
  ];
  
  useEffect(() => {
    // Проверяем, первый ли это визит
    const hasSeenTour = localStorage.getItem('analyticsTourseen');
    if (!hasSeenTour && document.querySelector('#analytics-dashboard')) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, []);
  
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };
  
  const handleClose = () => {
    setShowTour(false);
    localStorage.setItem('analyticsTourSeen', 'true');
  };
  
  if (!showTour) return null;
  
  const currentStepData = tourSteps[currentStep];
  const targetElement = document.querySelector(currentStepData.target);
  
  if (!targetElement) return null;
  
  const targetRect = targetElement.getBoundingClientRect();
  const tooltipStyle = {
    position: 'fixed',
    zIndex: 10000,
    ...(currentStepData.position === 'bottom' ? {
      top: `${targetRect.bottom + 20}px`,
      left: `${targetRect.left}px`
    } : {
      bottom: `${window.innerHeight - targetRect.top + 20}px`,
      left: `${targetRect.left}px`
    })
  };
  
  return (
    <>
      {/* Оверлей */}
      <div 
        className="onboarding-overlay"
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998,
          cursor: 'pointer'
        }}
      />
      
      {/* Подсветка элемента */}
      <div
        className="onboarding-highlight"
        style={{
          position: 'fixed',
          top: targetRect.top - 10,
          left: targetRect.left - 10,
          width: targetRect.width + 20,
          height: targetRect.height + 20,
          border: '2px solid #8b5cf6',
          borderRadius: '12px',
          boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.2)',
          zIndex: 9999,
          pointerEvents: 'none',
          transition: 'all 0.3s ease'
        }}
      />
      
      {/* Подсказка */}
      <div 
        className="onboarding-tooltip"
        style={tooltipStyle}
      >
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '320px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          color: '#1a1a1a'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#8b5cf6'
          }}>
            {currentStepData.title}
          </h3>
          <p style={{ 
            margin: '0 0 20px 0',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {currentStepData.content}
          </p>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ 
              fontSize: '12px',
              color: '#666'
            }}>
              {currentStep + 1} из {tourSteps.length}
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleClose}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Пропустить
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#8b5cf6',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {currentStep === tourSteps.length - 1 ? 'Готово' : 'Далее'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}