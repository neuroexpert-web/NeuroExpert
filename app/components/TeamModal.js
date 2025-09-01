'use client';

import { useEffect } from 'react';

export default function TeamModal() {
  useEffect(() => {
    // Данные о команде
    const teamDetails = {
      ceo: {
        name: 'Александр Петров',
        role: 'Основатель и CEO',
        fullBio: `Александр — визионер и стратег с 15+ летним опытом в IT и искусственном интеллекте. 
        Начал карьеру как разработчик в Яндексе, затем возглавлял AI-подразделение в Mail.ru Group. 
        В 2019 году основал NeuroExpert с миссией сделать AI доступным для каждого бизнеса.
        
        Образование: МГУ (Прикладная математика), Stanford University (AI & Machine Learning).
        Автор 10+ научных публикаций по применению AI в бизнесе.`,
        achievements: [
          'Forbes 30 Under 30 (2020)',
          'Лучший CEO в сфере AI (2023)',
          'Спикер на 50+ международных конференциях'
        ],
        contacts: {
          email: 'a.petrov@neuroexpert.com',
          linkedin: 'linkedin.com/in/apetrov'
        }
      },
      cto: {
        name: 'Елена Иванова',
        role: 'Технический управляющий',
        fullBio: `Елена — признанный эксперт в области машинного обучения с PhD от MIT. 
        Более 12 лет разрабатывает передовые AI-решения для крупнейших корпораций мира.
        Присоединилась к NeuroExpert в 2019 году как сооснователь.
        
        Специализация: Deep Learning, NLP, Computer Vision, Reinforcement Learning.
        Преподает в Сколтехе и ВШЭ курсы по AI.`,
        achievements: [
          'Автор 20+ научных публикаций в Nature и Science',
          'Патенты в области нейронных сетей',
          'Лауреат премии "Женщины в AI" (2022)'
        ],
        contacts: {
          email: 'e.ivanova@neuroexpert.com',
          linkedin: 'linkedin.com/in/eivanova'
        }
      },
      'head-ai': {
        name: 'Михаил Соколов',
        role: 'Руководитель AI-департамента',
        fullBio: `Михаил возглавляет разработку AI-продуктов и исследования в NeuroExpert.
        10+ лет опыта создания AI-решений для Fortune 500, включая Google, Amazon и Microsoft.
        
        Экспертиза: построение масштабируемых ML-систем, оптимизация нейронных сетей,
        внедрение AI в production. Руководит командой из 30+ ML-инженеров.`,
        achievements: [
          'Разработал AI-систему с точностью 99.8%',
          'Снизил затраты на инфраструктуру ML на 60%',
          'Автор open-source библиотек с 10k+ звезд на GitHub'
        ],
        contacts: {
          email: 'm.sokolov@neuroexpert.com',
          github: 'github.com/msokolov'
        }
      },
      'head-ux': {
        name: 'Анна Морозова',
        role: 'Руководитель UX/UI',
        fullBio: `Анна отвечает за создание интуитивных интерфейсов для сложных AI-продуктов.
        Создала дизайн-системы для 50+ AI-платформ, сделав их доступными для обычных пользователей.
        
        Философия: "AI должен быть не только умным, но и понятным каждому".
        Преподает курс "UX для AI" в Британской высшей школе дизайна.`,
        achievements: [
          'Red Dot Design Award (2021, 2023)',
          'Увеличила NPS продуктов на 40 пунктов',
          'Спикер на Google I/O и Apple WWDC'
        ],
        contacts: {
          email: 'a.morozova@neuroexpert.com',
          behance: 'behance.net/amorozova'
        }
      },
      'head-data': {
        name: 'Дмитрий Волков',
        role: 'Руководитель Data Science',
        fullBio: `Дмитрий — эксперт в Big Data и предиктивной аналитике с опытом работы в Facebook и Uber.
        Специализируется на построении data-driven решений и оптимизации бизнес-процессов через данные.
        
        Под его руководством команда обрабатывает петабайты данных ежедневно,
        обеспечивая точность предсказаний на уровне 95%+.`,
        achievements: [
          'Построил data lake для 10PB+ данных',
          'Сократил время обработки данных в 100 раз',
          'Kaggle Grandmaster с топ-10 рейтингом'
        ],
        contacts: {
          email: 'd.volkov@neuroexpert.com',
          kaggle: 'kaggle.com/dvolkov'
        }
      },
      'head-security': {
        name: 'Ольга Белова',
        role: 'Управляющий по безопасности',
        fullBio: `Ольга обеспечивает безопасность данных миллионов пользователей NeuroExpert.
        Certified Ethical Hacker и эксперт по кибербезопасности с 12+ летним опытом в банковской сфере.
        
        Построила систему безопасности, которая отражает 99.99% атак и соответствует
        всем международным стандартам включая GDPR, SOC2, ISO 27001.`,
        achievements: [
          'Предотвратила утечки данных на $100M+',
          'Внедрила Zero Trust Architecture',
          'Консультант правительства по кибербезопасности'
        ],
        contacts: {
          email: 'o.belova@neuroexpert.com',
          linkedin: 'linkedin.com/in/obelova'
        }
      }
    };

    // Показать детальную информацию о члене команды
    const showTeamMemberDetails = (memberId) => {
      const member = teamDetails[memberId];
      if (!member) return;

      const modal = document.createElement('div');
      modal.className = 'team-modal';
      modal.innerHTML = `
        <div class="team-modal-content">
          <button class="modal-close" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <div class="member-detail-header">
            <div class="member-detail-avatar">
              <img src="/api/placeholder/150/150" alt="${member.name}" />
            </div>
            <div class="member-detail-info">
              <h2>${member.name}</h2>
              <p class="member-detail-role">${member.role}</p>
            </div>
          </div>
          
          <div class="member-detail-content">
            <div class="detail-section">
              <h3>Биография</h3>
              <p>${member.fullBio}</p>
            </div>
            
            <div class="detail-section">
              <h3>Ключевые достижения</h3>
              <ul class="achievements-list">
                ${member.achievements.map(achievement => `
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                      <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    ${achievement}
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div class="detail-section">
              <h3>Контакты</h3>
              <div class="contact-links">
                ${Object.entries(member.contacts).map(([key, value]) => `
                  <a href="${key === 'email' ? 'mailto:' + value : 'https://' + value}" class="contact-link">
                    ${getContactIcon(key)}
                    <span>${value}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="member-detail-footer">
            <button class="btn-connect">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth="2"/>
              </svg>
              Написать сообщение
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Обработчики
      modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });

      modal.querySelector('.btn-connect').addEventListener('click', () => {
        window.location.href = `mailto:${member.contacts.email}`;
      });
    };

    // Получить иконку для типа контакта
    const getContactIcon = (type) => {
      const icons = {
        email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>',
        linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
        github: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        kaggle: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.358"/></svg>',
        behance: '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.295.91 1.979 2.205 1.979 1.355 0 2.037-.795 2.199-1.95h3.352zm-9.7-3.95h4.955c-.09-1.218-.871-1.89-2.244-1.89-1.42 0-2.514.716-2.71 1.89zM6.486 20V5.998c4.368 0 7.095-.016 7.095 4.223 0 1.788-1.042 3.053-2.486 3.614 2.048.375 3.162 1.711 3.162 3.615 0 4.4-3.436 4.55-7.771 4.55zM9 8H6.5v4h2.473c1.496 0 2.334-.68 2.334-2.003C11.307 8.572 10.493 8 9 8zm-.05 6H6.5v4.192h2.475c1.56 0 2.429-.809 2.429-2.172 0-1.416-.914-2.02-2.454-2.02z"/></svg>'
      };
      return icons[type] || '';
    };

    // Закрыть модальное окно
    const closeModal = (modal) => {
      modal.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        modal.remove();
      }, 300);
    };

    // Обработчики для кнопок деталей
    const setupDetailButtons = () => {
      const detailButtons = document.querySelectorAll('.member-details-btn');
      
      detailButtons.forEach(button => {
        button.addEventListener('click', function() {
          const memberCard = this.closest('.team-member');
          const memberId = memberCard.getAttribute('data-member');
          showTeamMemberDetails(memberId);
        });
      });
    };

    // Анимация при наведении на карточки
    const setupHoverEffects = () => {
      const teamMembers = document.querySelectorAll('.team-member');
      
      teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(-5px) scale(1)';
        });
      });
    };

    // Добавить стили для модального окна
    const addModalStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        .team-modal {
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
          padding: 2rem;
          overflow-y: auto;
        }
        
        .team-modal-content {
          background: #1a1a2e;
          border-radius: 24px;
          padding: 3rem;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideInUp 0.3s ease-out;
          position: relative;
        }
        
        .modal-close {
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
        
        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }
        
        .modal-close svg {
          width: 24px;
          height: 24px;
          stroke: white;
        }
        
        .member-detail-header {
          display: flex;
          gap: 2rem;
          align-items: center;
          margin-bottom: 3rem;
        }
        
        .member-detail-avatar {
          flex-shrink: 0;
        }
        
        .member-detail-avatar img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 4px solid rgba(139, 92, 246, 0.3);
        }
        
        .member-detail-info h2 {
          color: white;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .member-detail-role {
          color: #a78bfa;
          font-size: 1.25rem;
          font-weight: 500;
        }
        
        .detail-section {
          margin-bottom: 2.5rem;
        }
        
        .detail-section h3 {
          color: white;
          font-size: 1.25rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .detail-section h3::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-radius: 2px;
        }
        
        .detail-section p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.8;
          white-space: pre-line;
        }
        
        .achievements-list {
          list-style: none;
          padding: 0;
        }
        
        .achievements-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.5rem 0;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .achievements-list svg {
          flex-shrink: 0;
          stroke: #10b981;
          margin-top: 2px;
        }
        
        .contact-links {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .contact-link:hover {
          background: rgba(139, 92, 246, 0.2);
          transform: translateY(-2px);
        }
        
        .contact-link svg {
          fill: #a78bfa;
        }
        
        .member-detail-footer {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }
        
        .btn-connect {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-connect:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        
        @media (max-width: 768px) {
          .team-modal-content {
            padding: 2rem;
          }
          
          .member-detail-header {
            flex-direction: column;
            text-align: center;
          }
          
          .member-detail-avatar img {
            width: 120px;
            height: 120px;
          }
          
          .contact-links {
            flex-direction: column;
          }
          
          .contact-link {
            justify-content: center;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация
    setTimeout(() => {
      setupDetailButtons();
      setupHoverEffects();
      addModalStyles();
    }, 500);

  }, []);

  return null;
}