'use client';

import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Проверяем, установлено ли приложение
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Слушаем событие beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Показываем промпт через 30 секунд или после 3 страниц
      const visits = parseInt(localStorage.getItem('neuroexpert-visits') || '0');
      localStorage.setItem('neuroexpert-visits', String(visits + 1));
      
      if (visits >= 3) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Слушаем успешную установку
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      console.log('PWA успешно установлено');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Пользователь принял установку PWA');
    } else {
      console.log('Пользователь отклонил установку PWA');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Не показывать промпт снова в течение 7 дней
    localStorage.setItem('neuroexpert-pwa-dismissed', String(Date.now()));
  };

  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-prompt-content">
        <div className="pwa-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" strokeWidth="2"/>
            <path d="M12 11v6m0-10v.01" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        <div className="pwa-text">
          <h3>Установите NeuroExpert</h3>
          <p>Добавьте приложение на главный экран для быстрого доступа и работы офлайн</p>
        </div>
        
        <div className="pwa-actions">
          <button onClick={handleDismiss} className="pwa-dismiss">
            Позже
          </button>
          <button onClick={handleInstallClick} className="pwa-install">
            Установить
          </button>
        </div>
      </div>

      <style jsx>{`
        .pwa-install-prompt {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000;
          max-width: 90%;
          width: 400px;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        .pwa-prompt-content {
          background: rgba(26, 26, 46, 0.98);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .pwa-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto;
        }

        .pwa-text {
          text-align: center;
        }

        .pwa-text h3 {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .pwa-text p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .pwa-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .pwa-dismiss,
        .pwa-install {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .pwa-dismiss {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }

        .pwa-dismiss:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .pwa-install {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
        }

        .pwa-install:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }

        @media (max-width: 480px) {
          .pwa-install-prompt {
            bottom: 10px;
            width: calc(100% - 20px);
          }
        }
      `}</style>
    </div>
  );
}