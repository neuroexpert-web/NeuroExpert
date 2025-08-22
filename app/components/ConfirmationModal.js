// Красивое модальное окно подтверждения для NeuroExpert
'use client';
import { useEffect } from 'react';

function ConfirmationModal({ isOpen, onClose, type = 'contact' }) {
  useEffect(() => {
    if (isOpen) {
      // Закрытие через 4 секунды
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      // Заблокировать скролл
      document.body.style.overflow = 'hidden';

      // Закрытие по Escape
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'voice':
        return {
          icon: '🎤',
          title: 'Голосовое сообщение отправлено!',
          subtitle: 'Спасибо за голосовое обращение!',
          features: [
            { icon: '🎯', text: 'Сообщение обработано ИИ' },
            { icon: '📞', text: 'Звонок в течение 15 минут' },
            { icon: '💬', text: 'Уведомление в Telegram отправлено' },
          ],
        };
      default:
        return {
          icon: '📧',
          title: 'Заявка успешно отправлена!',
          subtitle: 'Мы получили ваше обращение и скоро свяжемся с вами',
          features: [
            { icon: '⚡', text: 'Ответ в течение 15 минут' },
            { icon: '📊', text: 'Персональный ROI расчет готовится' },
            { icon: '🔒', text: 'Данные надежно защищены' },
          ],
        };
    }
  };

  const content = getContent();

  return (
    <div className="confirmation-overlay" onClick={onClose}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-content">
          {/* Анимированная иконка */}
          <div className="success-icon-container">
            <div className="success-icon">{content.icon}</div>
            <div className="success-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          </div>

          {/* Заголовок */}
          <h2 className="confirmation-title">{content.title}</h2>
          <p className="confirmation-subtitle">{content.subtitle}</p>

          {/* Особенности */}
          <div className="confirmation-features">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="feature-item"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-text">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Прогресс бар автозакрытия */}
          <div className="auto-close-progress">
            <div className="progress-bar"></div>
            <p className="progress-text">Окно закроется автоматически</p>
          </div>

          {/* Кнопка закрытия */}
          <button className="close-confirmation-btn" onClick={onClose}>
            ✨ Понятно, спасибо!
          </button>
        </div>
      </div>

      <style jsx>{`
        .confirmation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: overlayFadeIn 0.3s ease-out;
        }

        @keyframes overlayFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .confirmation-modal {
          background: linear-gradient(
            135deg,
            rgba(5, 8, 16, 0.98),
            rgba(10, 15, 26, 0.98),
            rgba(30, 41, 59, 0.95)
          );
          backdrop-filter: blur(25px);
          border: 2px solid rgba(0, 255, 163, 0.3);
          border-radius: 25px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            0 0 80px rgba(0, 255, 163, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .confirmation-content {
          padding: 40px 30px 30px;
          text-align: center;
          position: relative;
        }

        /* Анимированная иконка успеха */
        .success-icon-container {
          position: relative;
          margin-bottom: 25px;
          display: inline-block;
        }

        .success-icon {
          font-size: 4rem;
          position: relative;
          z-index: 2;
          animation: iconBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes iconBounce {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(-90deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .success-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .ring {
          position: absolute;
          border: 2px solid var(--neural-aurora-green);
          border-radius: 50%;
          opacity: 0;
          animation: ringExpand 2s ease-out infinite;
        }

        .ring-1 {
          width: 80px;
          height: 80px;
          margin: -40px 0 0 -40px;
          animation-delay: 0s;
        }

        .ring-2 {
          width: 120px;
          height: 120px;
          margin: -60px 0 0 -60px;
          animation-delay: 0.5s;
        }

        .ring-3 {
          width: 160px;
          height: 160px;
          margin: -80px 0 0 -80px;
          animation-delay: 1s;
        }

        @keyframes ringExpand {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        /* Текст */
        .confirmation-title {
          color: var(--neural-aurora-green);
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 10px;
          animation: titleSlideIn 0.6s ease-out 0.2s both;
        }

        .confirmation-subtitle {
          color: rgba(240, 249, 255, 0.9);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 25px;
          animation: titleSlideIn 0.6s ease-out 0.3s both;
        }

        @keyframes titleSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Особенности */
        .confirmation-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 25px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          padding: 15px 20px;
          background: linear-gradient(135deg, rgba(0, 255, 163, 0.08), rgba(77, 216, 255, 0.06));
          border: 1px solid rgba(0, 255, 163, 0.2);
          border-radius: 12px;
          color: rgba(240, 249, 255, 0.95);
          animation: featureSlideIn 0.5s ease-out both;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: linear-gradient(135deg, rgba(0, 255, 163, 0.12), rgba(77, 216, 255, 0.1));
          border-color: rgba(0, 255, 163, 0.4);
          transform: translateY(-2px);
        }

        @keyframes featureSlideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .feature-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .feature-text {
          font-weight: 500;
        }

        /* Прогресс автозакрытия */
        .auto-close-progress {
          margin-bottom: 20px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(0, 255, 163, 0.2);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
          position: relative;
        }

        .progress-bar::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, var(--neural-aurora-green), var(--neural-ice-blue));
          border-radius: 2px;
          animation: progressFill 4s linear;
        }

        @keyframes progressFill {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .progress-text {
          color: rgba(240, 249, 255, 0.7);
          font-size: 0.85rem;
          margin: 0;
        }

        /* Кнопка закрытия */
        .close-confirmation-btn {
          background: linear-gradient(135deg, var(--neural-aurora-green), var(--neural-ice-blue));
          border: none;
          border-radius: 15px;
          color: white;
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
          position: relative;
          overflow: hidden;
        }

        .close-confirmation-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .close-confirmation-btn:hover::before {
          left: 100%;
        }

        .close-confirmation-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 255, 163, 0.3);
          background: linear-gradient(135deg, var(--neural-ice-blue), var(--neural-aurora-green));
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .confirmation-overlay {
            padding: 15px;
          }

          .confirmation-modal {
            border-radius: 20px;
            max-height: 95vh;
          }

          .confirmation-content {
            padding: 30px 20px 25px;
          }

          .confirmation-title {
            font-size: 1.5rem;
          }

          .confirmation-subtitle {
            font-size: 1rem;
          }

          .feature-item {
            padding: 12px 15px;
            gap: 12px;
          }

          .close-confirmation-btn {
            padding: 12px 25px;
            font-size: 1rem;
            min-width: 180px;
          }

          .success-icon {
            font-size: 3rem;
          }

          .ring-1 {
            width: 60px;
            height: 60px;
            margin: -30px 0 0 -30px;
          }
          .ring-2 {
            width: 90px;
            height: 90px;
            margin: -45px 0 0 -45px;
          }
          .ring-3 {
            width: 120px;
            height: 120px;
            margin: -60px 0 0 -60px;
          }
        }
      `}</style>
    </div>
  );
}

export default ConfirmationModal;
