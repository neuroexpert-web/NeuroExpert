'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SmartFloatingAI = ({ onOpenManager }) => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [aiPosition, setAiPosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(true);
  const orbRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  // Контекстные сообщения для каждой секции
  const sectionMessages = {
    hero: {
      message: "Привет! Я Алексей, ваш ИИ-консультант 👋",
      tip: "Помогу выбрать идеальное решение для вашего бизнеса",
      action: "Начать консультацию",
      urgency: "low"
    },
    calculator: {
      message: "Давайте рассчитаем ваш ROI точнее! 📊",
      tip: "У меня есть данные по +500 проектам",
      action: "Персональный расчет",
      urgency: "high"
    },
    showcase: {
      message: "Расскажу подробнее о любом пакете 📦",
      tip: "Какой размер бизнеса вас интересует?",
      action: "Подобрать решение",
      urgency: "medium"
    },
    faq: {
      message: "Не нашли ответ? Спросите меня! 🤔",
      tip: "Знаю всё о NeuroExpert",
      action: "Задать вопрос",
      urgency: "medium"
    },
    contact: {
      message: "Помогу заполнить заявку правильно ✍️",
      tip: "Увеличу ваши шансы на быструю обратную связь",
      action: "Помочь с формой",
      urgency: "high"
    },
    manager: {
      message: "Я уже здесь! Готов помочь 🚀",
      tip: "Задавайте любые вопросы",
      action: "Активный чат",
      urgency: "active"
    }
  };

  // Отслеживание секций
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.id || 'hero';
            setCurrentSection(sectionId);
            
            // Показать подсказку при входе в новую секцию
            if (sectionMessages[sectionId]?.urgency === 'high') {
              triggerTooltip();
            }
          }
        });
      },
      { threshold: [0.1, 0.3, 0.7] }
    );

    // Наблюдаем за всеми секциями
    const sections = document.querySelectorAll('section, [data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Плавное движение за курсором (деликатное)
  useEffect(() => {
    let animationFrame;
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Деликатное притяжение к курсору
      animationFrame = requestAnimationFrame(() => {
        const rect = document.documentElement.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const attractionStrength = 0.02; // Очень слабое притяжение
        const maxDistance = 200; // Максимальное расстояние влияния
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < maxDistance) {
          setAiPosition(prev => ({
            x: Math.max(20, Math.min(window.innerWidth - 100, 
              prev.x + deltaX * attractionStrength)),
            y: Math.max(20, Math.min(window.innerHeight - 100, 
              prev.y + deltaY * attractionStrength))
          }));
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Умная подсказка
  const triggerTooltip = () => {
    setShowTooltip(true);
    
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 4000);
  };

  // Скрытие при скролле вниз
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Скрываем при скролле вниз
      } else {
        setIsVisible(true); // Показываем при скролле вверх
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentMessage = sectionMessages[currentSection] || sectionMessages.hero;

  const handleOrbClick = () => {
    if (currentSection === 'manager') {
      // Если уже в секции менеджера, просто активируем
      const managerSection = document.getElementById('manager');
      if (managerSection) {
        managerSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Открываем менеджер
      if (onOpenManager) {
        onOpenManager();
      }
    }
    
    // Трекинг аналитики
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'smart_ai_click', {
        event_category: 'ai_interaction',
        section: currentSection,
        message_type: currentMessage.urgency
      });
    }
  };

  const handleOrbHover = () => {
    setIsExpanded(true);
    triggerTooltip();
  };

  const handleOrbLeave = () => {
    setIsExpanded(false);
    setShowTooltip(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Главный плавающий орб */}
      <div 
        ref={orbRef}
        className={`smart-ai-orb ${isExpanded ? 'expanded' : ''} ${currentMessage.urgency}`}
        style={{
          position: 'fixed',
          left: `${aiPosition.x}px`,
          top: `${aiPosition.y}px`,
          zIndex: 1000,
        }}
        onClick={handleOrbClick}
        onMouseEnter={handleOrbHover}
        onMouseLeave={handleOrbLeave}
      >
        <div className="orb-core">
          <div className="ai-avatar">🤖</div>
          <div className="pulse-rings">
            <div className="pulse-ring ring-1"></div>
            <div className="pulse-ring ring-2"></div>
            <div className="pulse-ring ring-3"></div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="orb-tooltip">
            <div className="tooltip-content">
              <div className="tooltip-message">{currentMessage.message}</div>
              <div className="tooltip-action">{currentMessage.action}</div>
            </div>
          </div>
        )}
      </div>

      {/* Контекстная подсказка */}
      {showTooltip && !isExpanded && (
        <div 
          className="context-tip"
          style={{
            position: 'fixed',
            left: `${aiPosition.x + 70}px`,
            top: `${aiPosition.y}px`,
            zIndex: 999,
          }}
        >
          <div className="tip-bubble">
            <div className="tip-text">{currentMessage.tip}</div>
            <div className="tip-arrow"></div>
          </div>
        </div>
      )}

      {/* Стили */}
      <style jsx>{`
        .smart-ai-orb {
          width: 60px;
          height: 60px;
          cursor: pointer;
          transition: transform 0.3s ease, filter 0.3s ease;
          filter: drop-shadow(0 4px 20px rgba(0, 255, 163, 0.3));
        }

        .smart-ai-orb:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 8px 30px rgba(0, 255, 163, 0.5));
        }

        .smart-ai-orb.expanded {
          transform: scale(1.15);
        }

        .orb-core {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            var(--neural-aurora-green, #00ffa3), 
            var(--neural-ice-blue, #4dd8ff),
            var(--neural-purple-mist, #6366f1)
          );
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .ai-avatar {
          font-size: 24px;
          z-index: 2;
          animation: aiFloat 3s ease-in-out infinite;
        }

        .pulse-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .pulse-ring {
          position: absolute;
          border: 2px solid rgba(0, 255, 163, 0.4);
          border-radius: 50%;
          animation: pulsate 2s ease-out infinite;
        }

        .ring-1 {
          width: 80px;
          height: 80px;
          margin: -40px 0 0 -40px;
          animation-delay: 0s;
        }

        .ring-2 {
          width: 100px;
          height: 100px;
          margin: -50px 0 0 -50px;
          animation-delay: 0.5s;
        }

        .ring-3 {
          width: 120px;
          height: 120px;
          margin: -60px 0 0 -60px;
          animation-delay: 1s;
        }

        /* Срочность */
        .smart-ai-orb.high .pulse-ring {
          border-color: rgba(255, 107, 107, 0.6);
          animation-duration: 1s;
        }

        .smart-ai-orb.active .orb-core {
          background: linear-gradient(135deg, #00ff88, #00ccff);
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.6);
        }

        /* Тултип орба */
        .orb-tooltip {
          position: absolute;
          left: 70px;
          top: 0;
          min-width: 200px;
          background: rgba(16, 24, 39, 0.95);
          border: 1px solid rgba(0, 255, 163, 0.3);
          border-radius: 12px;
          padding: 12px;
          backdrop-filter: blur(20px);
          animation: tooltipSlide 0.3s ease-out;
        }

        .tooltip-content {
          color: #f0f9ff;
        }

        .tooltip-message {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .tooltip-action {
          font-size: 12px;
          color: var(--neural-aurora-green, #00ffa3);
          opacity: 0.8;
        }

        /* Контекстная подсказка */
        .context-tip {
          pointer-events: none;
          animation: tipFadeIn 0.4s ease-out;
        }

        .tip-bubble {
          background: rgba(16, 24, 39, 0.92);
          border: 1px solid rgba(0, 255, 163, 0.4);
          border-radius: 8px;
          padding: 8px 12px;
          max-width: 180px;
          position: relative;
          backdrop-filter: blur(15px);
        }

        .tip-text {
          color: #f0f9ff;
          font-size: 13px;
          line-height: 1.3;
        }

        .tip-arrow {
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid rgba(16, 24, 39, 0.92);
        }

        /* Анимации */
        @keyframes aiFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        @keyframes pulsate {
          0% {
            opacity: 1;
            transform: scale(0.5);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }

        @keyframes tooltipSlide {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes tipFadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .smart-ai-orb {
            width: 50px;
            height: 50px;
            bottom: 80px;
            right: 20px;
            left: auto !important;
            top: auto !important;
            position: fixed;
          }

          .orb-tooltip {
            left: -200px;
            min-width: 180px;
          }

          .context-tip {
            left: -180px !important;
          }

          .ai-avatar {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default SmartFloatingAI;