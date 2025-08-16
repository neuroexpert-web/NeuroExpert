import React, { useEffect, useState } from 'react';
import PremiumCard from './PremiumCard';

export default function HeroSection(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* Main headline */}
        <h1 className={`hero-title ${isVisible ? 'visible' : ''}`}>
          <span className="title-line">Комплекс услуг цифровизации</span>
          <span className="title-line gradient">вашего бизнеса —</span>
          <span className="title-line">просто и эффективно</span>
        </h1>

        {/* Subtitle */}
        <p className={`hero-subtitle ${isVisible ? 'visible' : ''}`}>
          Аудит, стратегия, готовый сайт или приложение и мощная CRM — 
          всё в одном месте, без лишних сложностей и больших затрат.
        </p>

        {/* Mission badge */}
        <div className={`mission-badge ${isVisible ? 'visible' : ''}`}>
          <span>NeuroExpert — ваш цифровой партнёр в развитии</span>
        </div>

        {/* CTA Buttons */}
        <div className={`hero-buttons ${isVisible ? 'visible' : ''}`}>
          <button 
            className="btn-luxury btn-primary"
            onClick={() => scrollToSection('benefits')}
          >
            <span>Узнать выгоды</span>
            <span className="btn-arrow">→</span>
          </button>
          
          <button 
            className="btn-luxury btn-gold"
            onClick={() => scrollToSection('demo')}
          >
            <span>Попробовать демо</span>
            <span className="btn-star">⭐</span>
          </button>
          
          <button 
            className="btn-luxury btn-outline"
            onClick={() => scrollToSection('consultation')}
          >
            <span>Получить консультацию</span>
          </button>
        </div>

        {/* Quick stats */}
        <div className={`hero-stats ${isVisible ? 'visible' : ''}`}>
          <div className="stat-item">
            <span className="stat-value">2-4</span>
            <span className="stat-label">недели до результата</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">40%</span>
            <span className="stat-label">экономия бюджета</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">поддержка клиентов</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          overflow: hidden;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 32px;
          letter-spacing: -0.02em;
        }

        .title-line {
          display: block;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .visible .title-line:nth-child(1) {
          transition-delay: 0.1s;
          opacity: 1;
          transform: translateY(0);
        }

        .visible .title-line:nth-child(2) {
          transition-delay: 0.2s;
          opacity: 1;
          transform: translateY(0);
        }

        .visible .title-line:nth-child(3) {
          transition-delay: 0.3s;
          opacity: 1;
          transform: translateY(0);
        }

        .title-line.gradient {
          background: linear-gradient(135deg, var(--royal-gradient-start), var(--royal-gradient-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-family: var(--font-body);
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 400;
          color: var(--platinum-400);
          max-width: 800px;
          margin: 0 auto 40px;
          line-height: 1.6;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
          transition-delay: 0.4s;
        }

        .hero-subtitle.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .mission-badge {
          display: inline-flex;
          align-items: center;
          padding: 12px 32px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 100px;
          margin-bottom: 48px;
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
          transition-delay: 0.5s;
        }

        .mission-badge.visible {
          opacity: 1;
          transform: scale(1);
        }

        .mission-badge span {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, var(--gold-premium), var(--gold-rose));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
          transition-delay: 0.6s;
        }

        .hero-buttons.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--royal-gradient-start), var(--royal-gradient-end));
          padding: 18px 40px;
          font-size: 18px;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid var(--platinum-300);
          color: var(--platinum-50);
          padding: 16px 38px;
          font-size: 18px;
        }

        .btn-outline:hover {
          background: var(--platinum-300);
          color: var(--noir-900);
        }

        .btn-arrow,
        .btn-star {
          margin-left: 8px;
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .btn-luxury:hover .btn-arrow {
          transform: translateX(4px);
        }

        .btn-luxury:hover .btn-star {
          transform: rotate(72deg);
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          max-width: 800px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s cubic-bezier(0.23, 1, 0.320, 1);
          transition-delay: 0.7s;
        }

        .hero-stats.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-family: var(--font-display);
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, var(--platinum-50), var(--platinum-400));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .stat-label {
          display: block;
          font-family: var(--font-body);
          font-size: 16px;
          color: var(--platinum-400);
        }

        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }

          .hero-buttons button {
            width: 100%;
            max-width: 300px;
          }

          .hero-stats {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </section>
  );
}