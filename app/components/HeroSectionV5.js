'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function HeroSectionV5() {
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Загружаем стили
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = '/hero-v5/style.css';
    document.head.appendChild(styleLink);

    return () => {
      // Cleanup
      document.head.removeChild(styleLink);
    };
  }, []);

  const handleCTAClick = (e) => {
    e.preventDefault();
    router.push('/chat');
  };

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" 
        strategy="beforeInteractive"
      />
      
      <section className="hero-section" ref={containerRef}>
        {/* Этот div нужен для фоновой анимации Canvas */}
        <div id="hero-background-animation"></div>

        <div className="hero-content">
          <p className="pre-header">ЦИФРОВАЯ AI ПЛАТФОРМА ДЛЯ БИЗНЕСА</p>
          <h1 className="main-header" id="animated-main-header">NeuroExpert</h1>
          <h2 className="sub-header">ЦИФРОВИЗАЦИЯ БИЗНЕСА</h2>
          <p className="sub-header-caption">С ИСКУССТВЕННЫМ ИНТЕЛЛЕКТОМ</p>
          <p className="description">
            Автоматизируйте бизнес-процессы, увеличивайте прибыль и опережайте 
            конкурентов с помощью передовых AI-технологий.
          </p>
          <a href="#" className="cta-button" onClick={handleCTAClick}>НАЧАТЬ БЕСПЛАТНО</a>
        </div>
      </section>

      <Script 
        src="/hero-v5/background.js" 
        strategy="afterInteractive"
      />
      <Script 
        src="/hero-v5/script.js" 
        strategy="afterInteractive"
      />
    </>
  );
}