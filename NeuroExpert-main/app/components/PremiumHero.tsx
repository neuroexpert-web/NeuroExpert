import React, { useEffect, useState } from 'react';
import PremiumCard from './PremiumCard';

export default function PremiumHero(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="premium-hero">
      {/* Animated background gradient */}
      <div 
        className="hero-gradient"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(65, 54, 241, 0.15), transparent 50%)`
        }}
      />

      <div className="hero-content">
        {/* Premium badge */}
        <div className={`premium-label ${isVisible ? 'visible' : ''}`}>
          <span className="label-text">Enterprise Edition</span>
          <div className="label-glow" />
        </div>

        {/* Main heading */}
        <h1 className={`hero-title ${isVisible ? 'visible' : ''}`}>
          <span className="title-line">
            <span className="title-word">NeuroExpert</span>
          </span>
          <span className="title-line">
            <span className="title-gradient">AI Platform</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`hero-subtitle ${isVisible ? 'visible' : ''}`}>
          Премиальная платформа искусственного интеллекта для автоматизации бизнеса
        </p>

        {/* CTA Buttons */}
        <div className={`hero-buttons ${isVisible ? 'visible' : ''}`}>
          <button className="btn-luxury btn-large">
            <span className="btn-text">Начать сейчас</span>
            <span className="btn-icon">→</span>
          </button>
          <button className="btn-luxury btn-gold btn-large">
            <span className="btn-text">Premium Demo</span>
            <span className="btn-star">⭐</span>
          </button>
        </div>

        {/* Features grid */}
        <div className={`features-grid ${isVisible ? 'visible' : ''}`}>
          <PremiumCard glowColor="blue" badge="NEW">
            <div className="feature-content">
              <div className="feature-icon">🧠</div>
              <h3>AI-Powered</h3>
              <p>Передовые алгоритмы машинного обучения</p>
            </div>
          </PremiumCard>

          <PremiumCard glowColor="gold">
            <div className="feature-content">
              <div className="feature-icon">⚡</div>
              <h3>Real-time</h3>
              <p>Мгновенная обработка данных</p>
            </div>
          </PremiumCard>

          <PremiumCard glowColor="purple">
            <div className="feature-content">
              <div className="feature-icon">🔒</div>
              <h3>Enterprise Security</h3>
              <p>Максимальная защита данных</p>
            </div>
          </PremiumCard>
        </div>
      </div>

      <style jsx>{`
        .premium-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 80px 20px;
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          opacity: 0.6;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 100px;
          margin-bottom: 32px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .premium-label.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .label-text {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: linear-gradient(135deg, var(--gold-premium), var(--gold-rose));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .label-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.2), transparent);
          filter: blur(20px);
          pointer-events: none;
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: clamp(48px, 8vw, 120px);
          font-weight: 800;
          line-height: 1;
          margin: 0 0 24px;
          letter-spacing: -0.03em;
        }

        .title-line {
          display: block;
          overflow: hidden;
        }

        .title-word,
        .title-gradient {
          display: inline-block;
          opacity: 0;
          transform: translateY(100%);
          transition: all 1s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .visible .title-word,
        .visible .title-gradient {
          opacity: 1;
          transform: translateY(0);
        }

        .title-word {
          color: var(--platinum-50);
          transition-delay: 0.2s;
        }

        .title-gradient {
          background: linear-gradient(135deg, var(--royal-gradient-start), var(--royal-gradient-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition-delay: 0.3s;
        }

        .hero-subtitle {
          font-family: var(--font-body);
          font-size: 20px;
          font-weight: 400;
          color: var(--platinum-400);
          margin: 0 0 48px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
          transition-delay: 0.4s;
        }

        .hero-subtitle.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-buttons {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.23, 1, 0.320, 1);
          transition-delay: 0.5s;
        }

        .hero-buttons.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-large {
          padding: 20px 48px;
          font-size: 18px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .btn-icon,
        .btn-star {
          font-size: 24px;
          transition: transform 0.3s ease;
        }

        .btn-luxury:hover .btn-icon {
          transform: translateX(4px);
        }

        .btn-luxury:hover .btn-star {
          transform: rotate(72deg);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s cubic-bezier(0.23, 1, 0.320, 1);
          transition-delay: 0.6s;
        }

        .features-grid.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-content {
          text-align: center;
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 20px currentColor);
        }

        .feature-content h3 {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 600;
          color: var(--platinum-50);
          margin: 0 0 8px;
        }

        .feature-content p {
          font-family: var(--font-body);
          font-size: 16px;
          color: var(--platinum-400);
          margin: 0;
        }
      `}</style>
    </section>
  );
}