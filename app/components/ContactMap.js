'use client';

import { useEffect } from 'react';

export default function ContactMap() {
  useEffect(() => {
    // Построение маршрута
    const setupRouteBuilder = () => {
      const routeBtn = document.querySelector('.btn-build-route');
      if (!routeBtn) return;
      
      routeBtn.addEventListener('click', () => {
        // Открываем Яндекс.Карты с маршрутом
        const address = encodeURIComponent('Москва, ул. Тверская, 1');
        const mapUrl = `https://yandex.ru/maps/?rtext=~${address}&rtt=auto`;
        window.open(mapUrl, '_blank');
      });
    };
    
    // Интерактивная карта (заглушка)
    const initializeMap = () => {
      const mapPlaceholder = document.querySelector('.map-placeholder');
      if (!mapPlaceholder) return;
      
      // Создаем интерактивный оверлей
      const interactiveOverlay = document.createElement('div');
      interactiveOverlay.className = 'map-interactive-overlay';
      interactiveOverlay.innerHTML = `
        <div class="map-controls">
          <button class="map-zoom-in" aria-label="Увеличить">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
              <path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="map-zoom-out" aria-label="Уменьшить">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
              <path d="M20 12H4" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="map-marker">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="48" height="48">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" fill="rgba(139, 92, 246, 0.2)"/>
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" fill="rgba(139, 92, 246, 0.4)"/>
          </svg>
        </div>
      `;
      
      mapPlaceholder.appendChild(interactiveOverlay);
      
      // Эффект параллакса при наведении
      mapPlaceholder.addEventListener('mousemove', (e) => {
        const rect = mapPlaceholder.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const marker = mapPlaceholder.querySelector('.map-marker');
        if (marker) {
          const offsetX = (x - 0.5) * 20;
          const offsetY = (y - 0.5) * 20;
          marker.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
      });
      
      mapPlaceholder.addEventListener('mouseleave', () => {
        const marker = mapPlaceholder.querySelector('.map-marker');
        if (marker) {
          marker.style.transform = 'translate(0, 0)';
        }
      });
    };
    
    // Копирование адреса
    const setupAddressCopy = () => {
      const addressElement = document.querySelector('.map-overlay p');
      if (!addressElement) return;
      
      addressElement.style.cursor = 'pointer';
      addressElement.title = 'Нажмите, чтобы скопировать адрес';
      
      addressElement.addEventListener('click', async () => {
        const address = 'Москва, ул. Тверская, 1';
        
        try {
          await navigator.clipboard.writeText(address);
          showCopyNotification('Адрес скопирован!');
          
          // Анимация
          addressElement.style.animation = 'copyPulse 0.5s ease-out';
          setTimeout(() => {
            addressElement.style.animation = '';
          }, 500);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    };
    
    // Уведомление о копировании
    const showCopyNotification = (message) => {
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.75rem 1.5rem;
        background: rgba(16, 185, 129, 0.95);
        color: white;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        animation: slideInUp 0.3s ease-out;
        z-index: 1000;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 2000);
    };
    
    // Информация о транспорте
    const addTransportInfo = () => {
      const mapSection = document.querySelector('.map-section');
      if (!mapSection) return;
      
      const transportInfo = document.createElement('div');
      transportInfo.className = 'transport-info';
      transportInfo.innerHTML = `
        <h4>Как добраться</h4>
        <div class="transport-options">
          <div class="transport-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
              <rect x="6" y="11" width="12" height="10" rx="1" stroke-width="2"/>
              <path d="M9 11V7a3 3 0 016 0v4M8 20v1m8-1v1" stroke-width="2"/>
            </svg>
            <div>
              <strong>Метро</strong>
              <p>Охотный Ряд, Театральная, Площадь Революции</p>
            </div>
          </div>
          <div class="transport-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
              <rect x="3" y="11" width="18" height="8" rx="1" stroke-width="2"/>
              <path d="M7 11V6h10v5M5 15h14" stroke-width="2"/>
            </svg>
            <div>
              <strong>Автобус</strong>
              <p>Остановка "Манежная площадь"</p>
            </div>
          </div>
          <div class="transport-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
              <path d="M5 17h8m-8-5h14M10 3l9 4v6l-9 4-7-4V7l7-4z" stroke-width="2"/>
            </svg>
            <div>
              <strong>Парковка</strong>
              <p>Подземная парковка ТЦ "Охотный ряд"</p>
            </div>
          </div>
        </div>
      `;
      
      mapSection.appendChild(transportInfo);
    };
    
    // Виртуальный офис тур
    const setupOfficeTour = () => {
      const mapOverlay = document.querySelector('.map-overlay');
      if (!mapOverlay) return;
      
      const tourBtn = document.createElement('button');
      tourBtn.className = 'btn-office-tour';
      tourBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-width="2"/>
        </svg>
        Виртуальный тур по офису
      `;
      
      mapOverlay.appendChild(tourBtn);
      
      tourBtn.addEventListener('click', () => {
        showOfficeTourModal();
      });
    };
    
    // Модальное окно виртуального тура
    const showOfficeTourModal = () => {
      const modal = document.createElement('div');
      modal.className = 'office-tour-modal';
      modal.innerHTML = `
        <div class="tour-content">
          <button class="tour-close" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
              <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <h2>Виртуальный тур по офису NeuroExpert</h2>
          <div class="tour-gallery">
            <div class="tour-image active" data-area="reception">
              <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-width="2"/>
                </svg>
                <p>Ресепшн</p>
              </div>
            </div>
            <div class="tour-image" data-area="workspace">
              <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64">
                  <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" stroke-width="2"/>
                </svg>
                <p>Рабочее пространство</p>
              </div>
            </div>
            <div class="tour-image" data-area="meeting">
              <div class="image-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2"/>
                </svg>
                <p>Переговорная</p>
              </div>
            </div>
          </div>
          <div class="tour-navigation">
            <button class="tour-nav-btn" data-area="reception">Ресепшн</button>
            <button class="tour-nav-btn active" data-area="workspace">Рабочее пространство</button>
            <button class="tour-nav-btn" data-area="meeting">Переговорная</button>
          </div>
          <p class="tour-description">
            Современный офис в центре Москвы с комфортными рабочими местами, переговорными комнатами и зонами отдыха.
          </p>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Навигация по туру
      const navButtons = modal.querySelectorAll('.tour-nav-btn');
      const images = modal.querySelectorAll('.tour-image');
      
      navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const area = btn.getAttribute('data-area');
          
          navButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          images.forEach(img => {
            img.classList.toggle('active', img.getAttribute('data-area') === area);
          });
        });
      });
      
      // Закрытие модального окна
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('.tour-close')) {
          modal.remove();
        }
      });
    };
    
    // Добавляем стили
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .map-interactive-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .map-controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          pointer-events: auto;
        }
        
        .map-zoom-in,
        .map-zoom-out {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .map-zoom-in:hover,
        .map-zoom-out:hover {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .map-zoom-in svg,
        .map-zoom-out svg {
          stroke: #333;
        }
        
        .map-marker {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: transform 0.3s ease;
          pointer-events: none;
          filter: drop-shadow(0 4px 10px rgba(139, 92, 246, 0.4));
        }
        
        .transport-info {
          max-width: 1200px;
          margin: 2rem auto 0;
          padding: 2rem;
          background: var(--glass-bg);
          backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: 16px;
        }
        
        .transport-info h4 {
          font-size: 1.25rem;
          color: white;
          margin-bottom: 1.5rem;
        }
        
        .transport-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .transport-item {
          display: flex;
          gap: 1rem;
        }
        
        .transport-item svg {
          stroke: var(--contact-gradient-end);
          flex-shrink: 0;
        }
        
        .transport-item strong {
          display: block;
          color: white;
          margin-bottom: 0.25rem;
        }
        
        .transport-item p {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .btn-office-tour {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-office-tour:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .office-tour-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
          padding: 2rem;
        }
        
        .tour-content {
          background: #1a1a2e;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        
        .tour-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .tour-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }
        
        .tour-close svg {
          stroke: white;
        }
        
        .tour-content h2 {
          color: white;
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .tour-gallery {
          position: relative;
          height: 300px;
          margin-bottom: 1.5rem;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(139, 92, 246, 0.1);
        }
        
        .tour-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .tour-image.active {
          opacity: 1;
        }
        
        .image-placeholder {
          text-align: center;
        }
        
        .image-placeholder svg {
          stroke: rgba(139, 92, 246, 0.5);
          margin-bottom: 1rem;
        }
        
        .image-placeholder p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.125rem;
        }
        
        .tour-navigation {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        
        .tour-nav-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .tour-nav-btn.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: rgba(139, 92, 246, 0.3);
          color: white;
        }
        
        .tour-nav-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .tour-description {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }
        
        @keyframes copyPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes slideOutDown {
          from {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          to {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    };
    
    // Инициализация
    setupRouteBuilder();
    initializeMap();
    setupAddressCopy();
    addTransportInfo();
    setupOfficeTour();
    addStyles();

  }, []);

  return null;
}