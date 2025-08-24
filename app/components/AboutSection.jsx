'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
  const teamMembers = [
    {
      name: 'Александр Нейронов',
      role: 'Управляющий директор',
      experience: '15+ лет в IT',
      avatar: '👨‍💼',
      description: 'Эксперт в AI и цифровой трансформации'
    },
    {
      name: 'Екатерина',
      role: 'Lead Experience Architect',
      experience: '10+ лет в UX/UI',
      avatar: '👩‍🎨',
      description: 'Создает WOW-эффекты в дизайне'
    },
    {
      name: 'Степан',
      role: 'Full-stack Developer',
      experience: '8+ лет разработки',
      avatar: '👨‍💻',
      description: 'AI интеграция и архитектура'
    },
    {
      name: 'Алексей',
      role: 'AI Analytics Expert',
      experience: '12+ лет в аналитике',
      avatar: '👨‍🔬',
      description: 'Данные, метрики, прогнозы'
    }
  ];

  const achievements = [
    { number: '500+', text: 'Реализованных проектов' },
    { number: '50+', text: 'Отраслей опыта' },
    { number: '95%', text: 'Довольных клиентов' },
    { number: '300%+', text: 'Средний ROI клиентов' }
  ];

  return (
    <section className="about-section">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="heading-luxury"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            О <span className="heading-gold">NeuroExpert</span>
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Команда экспертов, которая делает AI доступным для каждого бизнеса
          </motion.p>
        </div>

        {/* Наша миссия */}
        <motion.div 
          className="mission-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="mission-content">
            <h3>🎯 Наша миссия</h3>
            <p>
              Мы верим, что каждый бизнес заслуживает преимуществ искусственного интеллекта. 
              Наша цель — сделать передовые AI-технологии простыми, доступными и прибыльными 
              для компаний любого размера.
            </p>
          </div>
          <div className="mission-stats">
            <div className="stat-item">
              <div className="stat-number">2019</div>
              <div className="stat-label">Год основания</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">Лет опыта</div>
            </div>
          </div>
        </motion.div>

        {/* Достижения */}
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="achievement-card"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="achievement-number">{achievement.number}</div>
              <div className="achievement-text">{achievement.text}</div>
            </motion.div>
          ))}
        </div>

        {/* Команда */}
        <div className="team-section">
          <h3>👥 Наша команда</h3>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <div className="member-role">{member.role}</div>
                  <div className="member-experience">{member.experience}</div>
                  <p className="member-description">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ценности */}
        <motion.div 
          className="values-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h3>💎 Наши ценности</h3>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🔍</div>
              <h4>Прозрачность</h4>
              <p>Полная открытость процессов и честное ценообразование</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🚀</div>
              <h4>Инновации</h4>
              <p>Используем только передовые технологии и методы</p>
            </div>
            <div className="value-item">
              <div className="value-icon">📈</div>
              <h4>Результат</h4>
              <p>Гарантируем измеримый ROI для каждого проекта</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h4>Партнерство</h4>
              <p>Становимся частью вашей команды на пути к успеху</p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .about-section {
          padding: 4rem 0;
          background: linear-gradient(180deg, var(--noir-900) 0%, var(--noir-800) 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .heading-luxury {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .heading-gold {
          background: linear-gradient(135deg, #ffd700, #ff8c00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .mission-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 3rem;
          backdrop-filter: blur(20px);
        }

        .mission-content h3 {
          color: var(--text-primary);
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .mission-content p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1.1rem;
        }

        .mission-stats {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .achievement-card {
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }

        .achievement-card:hover {
          border-color: var(--primary);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.2);
        }

        .achievement-number {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .achievement-text {
          color: var(--text-secondary);
          font-weight: 600;
        }

        .team-section {
          margin-bottom: 4rem;
        }

        .team-section h3 {
          color: var(--text-primary);
          font-size: 2rem;
          text-align: center;
          margin-bottom: 3rem;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .team-card {
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }

        .team-card:hover {
          border-color: var(--primary);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .member-avatar {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .member-info h4 {
          color: var(--text-primary);
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }

        .member-role {
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .member-experience {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .member-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .values-section {
          text-align: center;
        }

        .values-section h3 {
          color: var(--text-primary);
          font-size: 2rem;
          margin-bottom: 3rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .value-item {
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }

        .value-item:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
        }

        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .value-item h4 {
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .value-item p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .about-section {
            padding: 2rem 0;
          }

          .container {
            padding: 0 1rem;
          }

          .mission-section {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem;
          }

          .achievements-grid,
          .team-grid,
          .values-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}