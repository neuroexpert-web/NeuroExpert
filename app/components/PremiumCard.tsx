import React, { useState, MouseEvent } from 'react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'gold' | 'purple';
  interactive?: boolean;
  badge?: string;
}

export default function PremiumCard({
  children,
  className = '',
  glowColor = 'blue',
  interactive = true,
  badge
}: PremiumCardProps): JSX.Element {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate tilt
    const tiltX = (y - centerY) / centerY * 10;
    const tiltY = (centerX - x) / centerX * 10;
    setTilt({ x: tiltX, y: tiltY });

    // Calculate glow position
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    setGlowPosition({ x: glowX, y: glowY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlowPosition({ x: 50, y: 50 });
  };

  const glowColors = {
    blue: 'rgba(65, 54, 241, 0.1)',
    gold: 'rgba(255, 215, 0, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)'
  };

  return (
    <div
      className={`premium-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactive ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)'
      }}
    >
      <div className="glass-card premium-card">
        {/* Premium badge */}
        {badge && (
          <div className="premium-badge">
            <span className="badge-text">{badge}</span>
            <div className="badge-shine" />
          </div>
        )}

        {/* Glow effect */}
        <div 
          className="card-glow"
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColors[glowColor]}, transparent 40%)`,
            opacity: interactive ? 0.5 : 0.3
          }}
        />

        {/* Top shine */}
        <div className="card-shine" />

        {/* Content */}
        <div className="card-content">
          {children}
        </div>

        {/* Border glow */}
        <div className="card-border-glow" />
      </div>

      <style jsx>{`
        .premium-card-wrapper {
          position: relative;
          display: inline-block;
        }

        .premium-card {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 32px;
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1);
        }

        .premium-badge {
          position: absolute;
          top: -1px;
          right: 32px;
          background: linear-gradient(135deg, #FFD700, #FDB462);
          padding: 8px 24px;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 16px rgba(255, 215, 0, 0.2);
          z-index: 10;
        }

        .badge-text {
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #000;
        }

        .badge-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: badgeShine 6s ease-in-out infinite;
        }

        .card-glow {
          position: absolute;
          inset: -50%;
          opacity: 0.15;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
          pointer-events: none;
        }

        .card-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.1) 50%, 
            transparent 100%
          );
          transform: translateX(-100%);
          animation: cardShine 12s ease-in-out infinite;
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .card-border-glow {
          position: absolute;
          inset: -2px;
          border-radius: 24px;
          background: linear-gradient(135deg, 
            transparent 0%, 
            ${glowColors[glowColor]} 50%, 
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .premium-card:hover .card-border-glow {
          opacity: 0.3;
        }

        @keyframes badgeShine {
          0% { left: -100%; }
          50%, 100% { left: 200%; }
        }

        @keyframes cardShine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}