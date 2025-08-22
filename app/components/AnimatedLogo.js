'use client';
import { useEffect, useRef } from 'react';

export default function AnimatedLogo() {
  const logoRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!logoRef.current) return;

    // Анимация появления букв
    const letters = logoRef.current.querySelectorAll('.logo-letter');
    letters.forEach((letter, index) => {
      letter.style.animationDelay = `${index * 0.1}s`;
    });

    // Создание частиц вокруг логотипа
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'neural-particle';

      const size = Math.random() * 4 + 2;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 150 + 100;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      particle.style.setProperty('--end-x', `${x}px`);
      particle.style.setProperty('--end-y', `${y}px`);

      logoRef.current.appendChild(particle);
      particlesRef.current.push(particle);

      // Удаляем частицу после анимации
      setTimeout(
        () => {
          particle.remove();
          particlesRef.current = particlesRef.current.filter((p) => p !== particle);
        },
        (duration + delay) * 1000
      );
    };

    // Генерация частиц
    const particleInterval = setInterval(() => {
      if (particlesRef.current.length < 20) {
        createParticle();
      }
    }, 200);

    // Эффект электрических разрядов
    const createLightning = () => {
      const lightning = document.createElement('div');
      lightning.className = 'lightning-effect';

      const startLetter = Math.floor(Math.random() * letters.length);
      const endLetter = Math.floor(Math.random() * letters.length);

      if (startLetter !== endLetter) {
        const startRect = letters[startLetter].getBoundingClientRect();
        const endRect = letters[endLetter].getBoundingClientRect();
        const containerRect = logoRef.current.getBoundingClientRect();

        const x1 = startRect.left + startRect.width / 2 - containerRect.left;
        const y1 = startRect.top + startRect.height / 2 - containerRect.top;
        const x2 = endRect.left + endRect.width / 2 - containerRect.left;
        const y2 = endRect.top + endRect.height / 2 - containerRect.top;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

        lightning.style.width = `${length}px`;
        lightning.style.left = `${x1}px`;
        lightning.style.top = `${y1}px`;
        lightning.style.transform = `rotate(${angle}deg)`;

        logoRef.current.appendChild(lightning);

        setTimeout(() => lightning.remove(), 300);
      }
    };

    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        createLightning();
      }
    }, 2000);

    return () => {
      clearInterval(particleInterval);
      clearInterval(lightningInterval);
      particlesRef.current.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div className="animated-logo-container" ref={logoRef}>
      <h1 className="animated-logo">
        <span className="logo-letter" data-letter="N">
          N
        </span>
        <span className="logo-letter" data-letter="e">
          e
        </span>
        <span className="logo-letter" data-letter="u">
          u
        </span>
        <span className="logo-letter" data-letter="r">
          r
        </span>
        <span className="logo-letter" data-letter="o">
          o
        </span>
        <span className="logo-letter logo-expert" data-letter="E">
          E
        </span>
        <span className="logo-letter logo-expert" data-letter="x">
          x
        </span>
        <span className="logo-letter logo-expert" data-letter="p">
          p
        </span>
        <span className="logo-letter logo-expert" data-letter="e">
          e
        </span>
        <span className="logo-letter logo-expert" data-letter="r">
          r
        </span>
        <span className="logo-letter logo-expert" data-letter="t">
          t
        </span>
      </h1>

      <div className="logo-subtitle">
        <span className="subtitle-text">AI BEYOND LIMITS</span>
        <div className="subtitle-underline"></div>
      </div>

      {/* Нейронная сеть за текстом */}
      <svg className="neural-bg" viewBox="0 0 800 200">
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Анимированные нейронные связи */}
        <g className="neural-connections">
          <path d="M100,50 Q200,100 300,50 T500,50" className="neural-path" />
          <path d="M150,150 Q250,100 350,150 T550,150" className="neural-path" />
          <path d="M200,100 Q300,50 400,100 T600,100" className="neural-path" />
          <path d="M50,100 Q150,150 250,100 T450,100" className="neural-path" />
        </g>

        {/* Пульсирующие узлы */}
        <g className="neural-nodes">
          <circle cx="100" cy="50" r="4" className="neural-node" />
          <circle cx="300" cy="50" r="4" className="neural-node" />
          <circle cx="500" cy="50" r="4" className="neural-node" />
          <circle cx="150" cy="150" r="4" className="neural-node" />
          <circle cx="350" cy="150" r="4" className="neural-node" />
          <circle cx="550" cy="150" r="4" className="neural-node" />
          <circle cx="200" cy="100" r="4" className="neural-node" />
          <circle cx="400" cy="100" r="4" className="neural-node" />
          <circle cx="600" cy="100" r="4" className="neural-node" />
        </g>
      </svg>

      <style jsx>{`
        .animated-logo-container {
          position: relative;
          display: inline-block;
          padding: 2rem;
          margin: 2rem auto;
          text-align: center;
        }

        .animated-logo {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          margin: 0;
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: baseline;
        }

        .logo-letter {
          display: inline-block;
          position: relative;
          color: transparent;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          animation:
            letterReveal 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards,
            letterGlow 3s ease-in-out infinite;
          opacity: 0;
          transform: translateY(50px) rotateX(90deg);
          transform-origin: center bottom;
        }

        .logo-expert {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          -webkit-background-clip: text;
          background-clip: text;
        }

        @keyframes letterReveal {
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }

        @keyframes letterGlow {
          0%,
          100% {
            filter: brightness(1) drop-shadow(0 0 20px currentColor);
          }
          50% {
            filter: brightness(1.2) drop-shadow(0 0 40px currentColor);
          }
        }

        .logo-letter::before {
          content: attr(data-letter);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          background: inherit;
          -webkit-background-clip: text;
          background-clip: text;
          z-index: -1;
          filter: blur(20px);
          opacity: 0.5;
          transform: scale(1.1);
        }

        .logo-letter:hover {
          animation: letterPulse 0.5s ease-out;
          cursor: pointer;
        }

        @keyframes letterPulse {
          0% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.2) translateY(-10px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }

        .logo-subtitle {
          position: relative;
          margin-top: 1rem;
          z-index: 2;
        }

        .subtitle-text {
          font-size: 1.2rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: var(--text-secondary);
          display: inline-block;
          animation: subtitleFade 1s ease-out 1.5s both;
        }

        @keyframes subtitleFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .subtitle-underline {
          height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, #f59e0b, transparent);
          margin-top: 0.5rem;
          animation: underlineExpand 1s ease-out 2s both;
          transform-origin: center;
        }

        @keyframes underlineExpand {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .neural-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: auto;
          z-index: 1;
          opacity: 0;
          animation: neuralFade 2s ease-out 0.5s forwards;
        }

        @keyframes neuralFade {
          to {
            opacity: 1;
          }
        }

        .neural-path {
          fill: none;
          stroke: url(#neural-gradient);
          stroke-width: 2;
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: drawPath 3s ease-out 1s forwards;
        }

        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }

        .neural-node {
          fill: #6366f1;
          animation: nodePulse 2s ease-in-out infinite;
        }

        .neural-node:nth-child(odd) {
          animation-delay: 0.5s;
        }

        @keyframes nodePulse {
          0%,
          100% {
            r: 4;
            opacity: 0.8;
          }
          50% {
            r: 8;
            opacity: 1;
          }
        }

        .neural-particle {
          position: absolute;
          background: radial-gradient(circle, #6366f1, transparent);
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 3s ease-out forwards;
          top: 50%;
          left: 50%;
        }

        @keyframes particleFloat {
          from {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          to {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(1);
            opacity: 0;
          }
        }

        .lightning-effect {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent, #fff, transparent);
          transform-origin: left center;
          animation: lightning 0.3s ease-out;
          pointer-events: none;
          filter: drop-shadow(0 0 10px #6366f1);
        }

        @keyframes lightning {
          from {
            opacity: 0;
            transform: scaleX(0) rotate(var(--angle));
          }
          50% {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: scaleX(1) rotate(var(--angle));
          }
        }

        /* Эффект при наведении на контейнер */
        .animated-logo-container:hover .neural-path {
          stroke-width: 3;
          filter: drop-shadow(0 0 20px currentColor);
        }

        .animated-logo-container:hover .neural-node {
          animation-duration: 1s;
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .animated-logo {
            font-size: clamp(2rem, 12vw, 4rem);
          }

          .subtitle-text {
            font-size: 0.9rem;
            letter-spacing: 0.2em;
          }

          .neural-bg {
            width: 150%;
          }
        }

        @media (max-width: 480px) {
          .animated-logo-container {
            padding: 1rem;
          }

          .logo-letter {
            animation: letterRevealMobile 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          }

          @keyframes letterRevealMobile {
            to {
              opacity: 1;
              transform: translateY(0) rotateX(0) scale(1);
            }
          }
        }
      `}</style>
    </div>
  );
}
