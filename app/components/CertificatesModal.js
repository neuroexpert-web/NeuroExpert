'use client';

import { useEffect } from 'react';

export default function CertificatesModal() {
  useEffect(() => {
    // Данные сертификатов уже обрабатываются в SecurityAccordion
    // Этот компонент добавляет дополнительную функциональность
    
    // Предварительная загрузка сертификатов
    const preloadCertificates = () => {
      const certificates = [
        '/certificates/iso27001.pdf',
        '/certificates/gdpr-compliance.pdf',
        '/certificates/soc2-report.pdf',
        '/certificates/pci-dss.pdf'
      ];
      
      certificates.forEach(cert => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = cert;
        document.head.appendChild(link);
      });
    };

    // Верификация сертификата через блокчейн (демо)
    const verifyCertificate = (certType) => {
      const verificationData = {
        iso27001: {
          hash: '0x742d35Cc6634C0532925a3b844Bc9e7595f6b8e3',
          blockchain: 'Ethereum',
          status: 'Verified',
          lastCheck: new Date().toISOString()
        },
        gdpr: {
          hash: '0x5aAeb6053f3E94C9b9A09f33669435E7Ef1BeAed',
          blockchain: 'Ethereum', 
          status: 'Verified',
          lastCheck: new Date().toISOString()
        },
        soc2: {
          hash: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
          blockchain: 'Polygon',
          status: 'Verified',
          lastCheck: new Date().toISOString()
        },
        pcidss: {
          hash: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
          blockchain: 'Polygon',
          status: 'Verified',
          lastCheck: new Date().toISOString()
        }
      };
      
      return verificationData[certType];
    };

    // Показать результат верификации
    const showVerificationResult = (certType) => {
      const data = verifyCertificate(certType);
      
      const modal = document.createElement('div');
      modal.className = 'verification-modal';
      modal.innerHTML = `
        <div class="verification-content">
          <div class="verification-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="verification-icon success">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/>
            </svg>
            <h3>Сертификат верифицирован</h3>
          </div>
          
          <div class="verification-details">
            <div class="detail-row">
              <span class="label">Блокчейн:</span>
              <span class="value">${data.blockchain}</span>
            </div>
            <div class="detail-row">
              <span class="label">Хэш сертификата:</span>
              <span class="value hash">${data.hash}</span>
            </div>
            <div class="detail-row">
              <span class="label">Статус:</span>
              <span class="value status-${data.status.toLowerCase()}">${data.status}</span>
            </div>
            <div class="detail-row">
              <span class="label">Последняя проверка:</span>
              <span class="value">${new Date(data.lastCheck).toLocaleString('ru-RU')}</span>
            </div>
          </div>
          
          <div class="verification-actions">
            <button class="btn-view-blockchain">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeWidth="2"/>
              </svg>
              Посмотреть в блокчейне
            </button>
            <button class="btn-close-verification">Закрыть</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Обработчики
      modal.querySelector('.btn-view-blockchain').addEventListener('click', () => {
        window.open(`https://etherscan.io/address/${data.hash}`, '_blank');
      });
      
      modal.querySelector('.btn-close-verification').addEventListener('click', () => {
        modal.remove();
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    };

    // Интеграция с основным компонентом
    const integrateVerification = () => {
      // Перехватываем клики на кнопки верификации
      document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-verify')) {
          e.preventDefault();
          const modal = e.target.closest('.certificate-modal');
          if (modal) {
            const certType = modal.querySelector('h2').textContent.toLowerCase().replace(/\s/g, '');
            showVerificationResult(certType);
          }
        }
      });
    };

    // Статистика безопасности в реальном времени
    const initSecurityStats = () => {
      const stats = {
        blockedAttacks: 1247892,
        uptime: 99.97,
        encryptedRequests: 98745632,
        activeMonitoring: true
      };
      
      // Обновление статистики каждые 5 секунд
      setInterval(() => {
        stats.blockedAttacks += Math.floor(Math.random() * 10);
        stats.encryptedRequests += Math.floor(Math.random() * 100);
        updateSecurityStats(stats);
      }, 5000);
    };

    const updateSecurityStats = (stats) => {
      // Обновляем числа в UI если они есть
      const attacksElement = document.querySelector('[data-stat="blocked-attacks"]');
      const requestsElement = document.querySelector('[data-stat="encrypted-requests"]');
      
      if (attacksElement) {
        attacksElement.textContent = stats.blockedAttacks.toLocaleString('ru-RU');
      }
      if (requestsElement) {
        requestsElement.textContent = stats.encryptedRequests.toLocaleString('ru-RU');
      }
    };

    // Добавляем стили для модальных окон
    const addModalStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .verification-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10001;
          animation: fadeIn 0.3s ease-out;
        }
        
        .verification-content {
          background: #1a1a2e;
          border-radius: 20px;
          padding: 2.5rem;
          max-width: 500px;
          width: 90%;
          animation: slideInUp 0.3s ease-out;
        }
        
        .verification-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .verification-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          padding: 1rem;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
        }
        
        .verification-icon.success {
          stroke: #10b981;
        }
        
        .verification-header h3 {
          color: white;
          font-size: 1.5rem;
          margin: 0;
        }
        
        .verification-details {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .detail-row:last-child {
          border-bottom: none;
        }
        
        .detail-row .label {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }
        
        .detail-row .value {
          color: white;
          text-align: right;
        }
        
        .detail-row .hash {
          font-family: monospace;
          font-size: 0.875rem;
          word-break: break-all;
        }
        
        .status-verified {
          color: #10b981;
          font-weight: 600;
        }
        
        .verification-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .btn-view-blockchain,
        .btn-close-verification {
          padding: 0.875rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-view-blockchain {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
        }
        
        .btn-view-blockchain:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        
        .btn-close-verification {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }
        
        .btn-close-verification:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    preloadCertificates();
    integrateVerification();
    initSecurityStats();
    addModalStyles();

  }, []);

  return null;
}