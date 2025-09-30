'use client';

import { useEffect } from 'react';

export default function AboutAnimations() {
  useEffect(() => {
    // Анимация карусели партнеров
    const setupPartnersCarousel = () => {
      const track = document.querySelector('.partners-track');
      if (!track) return;
      
      // Дублируем логотипы для бесшовной анимации (уже сделано в HTML)
      
      // Пауза при наведении
      track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
      });
      
      track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
      });
    };

    // Счетчики достижений
    const animateAchievementNumbers = () => {
      const achievementCards = document.querySelectorAll('.achievement-card h4');
      
      achievementCards.forEach(card => {
        const text = card.textContent;
        const numbers = text.match(/\d+/g);
        
        if (numbers && numbers.length > 0) {
          const number = numbers[0];
          const restText = text.replace(number, '{}');
          const target = parseInt(number);
          
          if (target > 100) {
            const duration = 2500;
            const startTime = performance.now();
            
            const updateNumber = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              const current = Math.floor(target * easeOutQuart(progress));
              card.textContent = restText.replace('{}', current.toLocaleString());
              
              if (progress < 1) {
                requestAnimationFrame(updateNumber);
              }
            };
            
            requestAnimationFrame(updateNumber);
          }
        }
      });
    };

    const easeOutQuart = (t) => {
      return 1 - Math.pow(1 - t, 4);
    };

    // Анимация мозга SVG
    const animateBrainConnections = () => {
      const connections = document.querySelectorAll('.connections');
      const neurons = document.querySelectorAll('.neuron');
      
      // Создаем пульсирующие волны по соединениям
      setInterval(() => {
        connections.forEach((connection, index) => {
          setTimeout(() => {
            connection.style.strokeDasharray = '5 5';
            connection.style.strokeDashoffset = '10';
            connection.style.animation = 'connectionPulse 1s ease-out';
            
            setTimeout(() => {
              connection.style.animation = '';
            }, 1000);
          }, index * 200);
        });
      }, 3000);
      
      // Случайная активация нейронов
      setInterval(() => {
        const randomNeuron = neurons[Math.floor(Math.random() * neurons.length)];
        randomNeuron.style.animation = 'neuronFlash 0.5s ease-out';
        
        setTimeout(() => {
          randomNeuron.style.animation = 'neuronPulse 2s ease-in-out infinite';
        }, 500);
      }, 1500);
    };

    // Эффект печатной машинки для миссии
    const typewriterEffect = () => {
      const missionText = document.querySelector('.mission-text');
      if (!missionText) return;
      
      const text = missionText.textContent;
      missionText.textContent = '';
      missionText.style.opacity = '1';
      
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          missionText.textContent += text[index];
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);
    };

    // Параллакс эффект для достижений
    const setupAchievementsParallax = () => {
      const achievementCards = document.querySelectorAll('.achievement-card');
      
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        achievementCards.forEach((card, index) => {
          const speed = 0.5 + (index * 0.1);
          const yPos = -(scrolled * speed);
          card.style.transform = `translateY(${yPos}px)`;
        });
      });
    };

    // Интерактивные иконки команды
    const animateTeamAvatars = () => {
      const avatars = document.querySelectorAll('.member-avatar');
      
      avatars.forEach(avatar => {
        avatar.addEventListener('mouseenter', function() {
          const img = this.querySelector('img');
          img.style.transform = 'scale(1.1)';
          
          // Создаем эффект свечения
          const glow = document.createElement('div');
          glow.className = 'avatar-glow';
          glow.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120%;
            height: 120%;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: glowPulse 1s ease-out;
          `;
          this.appendChild(glow);
          
          setTimeout(() => {
            glow.remove();
          }, 1000);
        });
        
        avatar.addEventListener('mouseleave', function() {
          const img = this.querySelector('img');
          img.style.transform = 'scale(1)';
        });
      });
    };

    // Анимация появления при скролле
    const setupScrollAnimations = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Специальные анимации для разных элементов
            if (entry.target.classList.contains('achievement-card')) {
              animateAchievementNumbers();
            }
            if (entry.target.classList.contains('mission-text')) {
              typewriterEffect();
            }
            if (entry.target.classList.contains('animated-brain')) {
              animateBrainConnections();
            }
          }
        });
      }, { threshold: 0.3 });
      
      // Наблюдаем за элементами
      const elementsToAnimate = document.querySelectorAll(
        '.value-card, .team-member, .achievement-card, .testimonial-card, .mission-block'
      );
      
      elementsToAnimate.forEach(element => {
        observer.observe(element);
      });
    };

    // Эффект следования за курсором для CTA кнопок
    const setupButtonEffects = () => {
      const buttons = document.querySelectorAll('.btn-demo, .btn-partnership, .btn-careers');
      
      buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          this.style.setProperty('--x', `${x}px`);
          this.style.setProperty('--y', `${y}px`);
        });
      });
    };

    // Анимация цитат
    const animateQuotes = () => {
      const quoteIcons = document.querySelectorAll('.quote-icon');
      
      quoteIcons.forEach((icon, index) => {
        icon.style.animation = `quoteFloat ${3 + index}s ease-in-out infinite`;
        icon.style.animationDelay = `${index * 0.5}s`;
      });
    };

    // Добавляем стили для анимаций
    const addAnimationStyles = () => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes connectionPulse {
          0% {
            stroke-dashoffset: 10;
            opacity: 0.5;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -10;
            opacity: 0.5;
          }
        }
        
        @keyframes neuronFlash {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
        }
        
        @keyframes glowPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.4);
          }
        }
        
        @keyframes quoteFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-in {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .btn-demo,
        .btn-partnership,
        .btn-careers {
          position: relative;
          overflow: hidden;
        }
        
        .btn-demo::before,
        .btn-partnership::before,
        .btn-careers::before {
          content: '';
          position: absolute;
          top: var(--y);
          left: var(--x);
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
        }
        
        .btn-demo:hover::before,
        .btn-partnership:hover::before,
        .btn-careers:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .member-avatar img {
          transition: transform 0.3s ease;
        }
        
        .partners-track:hover .partner-logo {
          opacity: 1;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Инициализация всех анимаций
    const initAllAnimations = () => {
      setupPartnersCarousel();
      setupScrollAnimations();
      animateTeamAvatars();
      setupButtonEffects();
      animateQuotes();
      addAnimationStyles();
      
      // Небольшая задержка для некоторых анимаций
      setTimeout(() => {
        setupAchievementsParallax();
      }, 1000);
    };

    // Запуск анимаций
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAllAnimations);
    } else {
      setTimeout(initAllAnimations, 500);
    }

  }, []);

  return null;
}