'use client';

import { useEffect } from 'react';

export default function SecurityAccordion() {
  useEffect(() => {
    // Управление аккордеонами технологий
    const setupAccordions = () => {
      const detailButtons = document.querySelectorAll('.tech-details-btn');
      
      detailButtons.forEach(button => {
        button.addEventListener('click', function() {
          const card = this.closest('.tech-card');
          const details = card.querySelector('.tech-details');
          const isExpanded = this.getAttribute('aria-expanded') === 'true';
          
          if (isExpanded) {
            // Закрываем
            details.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
              details.hidden = true;
            }, 300);
            this.setAttribute('aria-expanded', 'false');
          } else {
            // Закрываем все остальные аккордеоны
            detailButtons.forEach(otherButton => {
              if (otherButton !== this) {
                const otherCard = otherButton.closest('.tech-card');
                const otherDetails = otherCard.querySelector('.tech-details');
                if (!otherDetails.hidden) {
                  otherDetails.style.animation = 'slideUp 0.3s ease-out';
                  setTimeout(() => {
                    otherDetails.hidden = true;
                  }, 300);
                  otherButton.setAttribute('aria-expanded', 'false');
                }
              }
            });
            
            // Открываем текущий
            details.hidden = false;
            details.style.animation = 'slideDown 0.3s ease-out';
            this.setAttribute('aria-expanded', 'true');
            
            // Плавная прокрутка к деталям
            setTimeout(() => {
              details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
          }
        });
      });
    };

    // Анимация счетчика уровня безопасности
    const animateSecurityLevel = () => {
      const levelValue = document.querySelector('.level-value');
      if (!levelValue) return;
      
      const targetValue = 98;
      const duration = 2000;
      const startTime = performance.now();
      
      const updateValue = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(targetValue * easeOutQuart(progress));
        levelValue.textContent = current + '%';
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };
      
      requestAnimationFrame(updateValue);
    };

    const easeOutQuart = (t) => {
      return 1 - Math.pow(1 - t, 4);
    };

    // Проверка видимости для анимации
    const observeElements = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('security-level')) {
              animateSecurityLevel();
              observer.unobserve(entry.target);
            }
          }
        });
      }, { threshold: 0.5 });
      
      const securityLevel = document.querySelector('.security-level');
      if (securityLevel) {
        observer.observe(securityLevel);
      }
    };

    // Показ сертификатов
    const setupCertificateViews = () => {
      const certButtons = document.querySelectorAll('.cert-view-btn');
      
      certButtons.forEach(button => {
        button.addEventListener('click', function() {
          const certType = this.getAttribute('data-cert');
          showCertificateModal(certType);
        });
      });
    };

    // Модальное окно сертификата
    const showCertificateModal = (certType) => {
      const certificates = {
        iso27001: {
          title: 'ISO 27001:2013',
          description: 'Сертификат соответствия международному стандарту информационной безопасности',
          issuer: 'Bureau Veritas Certification',
          validUntil: '31.12.2025',
          scope: 'Разработка и эксплуатация облачных решений для автоматизации бизнес-процессов'
        },
        gdpr: {
          title: 'GDPR Compliance',
          description: 'Соответствие требованиям General Data Protection Regulation (EU) 2016/679',
          issuer: 'European Data Protection Board',
          validUntil: 'Бессрочно',
          scope: 'Обработка и защита персональных данных граждан ЕС'
        },
        soc2: {
          title: 'SOC 2 Type II',
          description: 'Отчет о соответствии стандартам безопасности, доступности и конфиденциальности',
          issuer: 'Ernst & Young LLP',
          validUntil: '30.06.2025',
          scope: 'Облачная платформа NeuroExpert и связанные сервисы'
        },
        pcidss: {
          title: 'PCI DSS Level 1',
          description: 'Сертификат соответствия стандарту безопасности платежных карт',
          issuer: 'Trustwave',
          validUntil: '31.03.2025',
          scope: 'Обработка, хранение и передача данных платежных карт'
        }
      };
      
      const cert = certificates[certType];
      if (!cert) return;
      
      const modal = document.createElement('div');
      modal.className = 'certificate-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${cert.title}</h2>
            <button class="modal-close" aria-label="Закрыть">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="cert-info">
              <div class="info-row">
                <span class="info-label">Описание:</span>
                <span class="info-value">${cert.description}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Выдан:</span>
                <span class="info-value">${cert.issuer}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Действителен до:</span>
                <span class="info-value">${cert.validUntil}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Область применения:</span>
                <span class="info-value">${cert.scope}</span>
              </div>
            </div>
            <div class="cert-actions">
              <button class="btn-download">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Скачать сертификат
              </button>
              <button class="btn-verify">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/>
                </svg>
                Проверить подлинность
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Обработчики закрытия
      modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
      
      // Обработчики кнопок
      modal.querySelector('.btn-download').addEventListener('click', () => {
        showNotification(`Сертификат ${cert.title} скачивается...`);
      });
      
      modal.querySelector('.btn-verify').addEventListener('click', () => {
        window.open('https://verify.certificate.example.com', '_blank');
      });
    };

    const closeModal = (modal) => {
      modal.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        modal.remove();
      }, 300);
    };

    // Анимация политик при наведении
    const animatePolicies = () => {
      const policyLinks = document.querySelectorAll('.policy-link');
      
      policyLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
          const icon = this.querySelector('svg');
          icon.style.animation = 'pulse 1s ease-in-out infinite';
        });
        
        link.addEventListener('mouseleave', function() {
          const icon = this.querySelector('svg');
          icon.style.animation = '';
        });
      });
    };

    // Обработчики CTA кнопок
    const setupCTAButtons = () => {
      const auditBtn = document.querySelector('.btn-security-audit');
      const contactBtn = document.querySelector('.btn-security-contact');
      
      if (auditBtn) {
        auditBtn.addEventListener('click', () => {
          showAuditForm();
        });
      }
      
      if (contactBtn) {
        contactBtn.addEventListener('click', () => {
          window.location.href = 'mailto:security@neuroexpert.com';
        });
      }
    };

    // Форма запроса аудита
    const showAuditForm = () => {
      const form = document.createElement('div');
      form.className = 'audit-form-modal';
      form.innerHTML = `
        <div class="form-content">
          <h2>Запрос аудита безопасности</h2>
          <form id="auditRequestForm">
            <div class="form-group">
              <label>Компания</label>
              <input type="text" name="company" required>
            </div>
            <div class="form-group">
              <label>Контактное лицо</label>
              <input type="text" name="contact" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" required>
            </div>
            <div class="form-group">
              <label>Тип аудита</label>
              <select name="auditType" required>
                <option value="">Выберите тип</option>
                <option value="full">Полный аудит безопасности</option>
                <option value="compliance">Проверка соответствия стандартам</option>
                <option value="pentest">Тестирование на проникновение</option>
                <option value="custom">Индивидуальный аудит</option>
              </select>
            </div>
            <div class="form-group">
              <label>Комментарий</label>
              <textarea name="comment" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-submit">Отправить запрос</button>
              <button type="button" class="btn-cancel">Отмена</button>
            </div>
          </form>
        </div>
      `;
      
      document.body.appendChild(form);
      
      // Обработчики формы
      form.querySelector('.btn-cancel').addEventListener('click', () => {
        form.remove();
      });
      
      form.querySelector('#auditRequestForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Запрос отправлен! Мы свяжемся с вами в течение 24 часов.');
        form.remove();
      });
    };

    // Уведомления
    const showNotification = (message) => {
      const notification = document.createElement('div');
      notification.className = 'security-notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #10b981, #3b82f6);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 0.875rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
        z-index: 10000;
        max-width: 350px;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 4000);
    };

    // Добавляем стили
    const addStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .certificate-modal,
        .audit-form-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
        }
        
        .modal-content,
        .form-content {
          background: #1a1a2e;
          border-radius: 20px;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideInUp 0.3s ease-out;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .modal-header h2,
        .form-content h2 {
          color: white;
          margin: 0;
        }
        
        .modal-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .modal-close svg {
          width: 24px;
          height: 24px;
          stroke: white;
        }
        
        .cert-info {
          margin-bottom: 2rem;
        }
        
        .info-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-label {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }
        
        .info-value {
          color: white;
        }
        
        .cert-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .btn-download,
        .btn-verify {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .btn-download {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
        }
        
        .btn-download:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        
        .btn-verify {
          background: transparent;
          border: 2px solid rgba(139, 92, 246, 0.3);
          color: white;
        }
        
        .btn-verify:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.5);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }
        
        .btn-submit,
        .btn-cancel {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .btn-submit {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          color: white;
        }
        
        .btn-submit:hover {
          transform: translateY(-2px);
        }
        
        .btn-cancel {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }
        
        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(30px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    setTimeout(() => {
      setupAccordions();
      observeElements();
      setupCertificateViews();
      animatePolicies();
      setupCTAButtons();
      addStyles();
    }, 500);

  }, []);

  return null;
}