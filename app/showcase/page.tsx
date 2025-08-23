'use client';

import { useState } from 'react';
import NeonButton from '../components/NeonButton';
import FuturisticCard from '../components/FuturisticCard';
import AILoader from '../components/AILoader';
import styles from './showcase.module.css';

export default function ShowcasePage() {
  const [activeLoader, setActiveLoader] = useState<string>('neural');

  return (
    <div className={styles.showcase}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <span className={styles.neonText}>NeuroExpert</span> Design System v2.0
        </h1>
        <p className={styles.subtitle}>Футуристические компоненты для AI-платформы</p>

        {/* Buttons Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Неоновые кнопки</h2>
          <div className={styles.grid}>
            <div>
              <h3>Основные варианты</h3>
              <div className={styles.buttonGroup}>
                <NeonButton variant="primary">Primary</NeonButton>
                <NeonButton variant="secondary">Secondary</NeonButton>
                <NeonButton variant="accent">Accent</NeonButton>
                <NeonButton variant="danger">Danger</NeonButton>
              </div>
            </div>
            
            <div>
              <h3>Размеры</h3>
              <div className={styles.buttonGroup}>
                <NeonButton size="small">Small</NeonButton>
                <NeonButton size="medium">Medium</NeonButton>
                <NeonButton size="large">Large</NeonButton>
              </div>
            </div>

            <div>
              <h3>С эффектами</h3>
              <div className={styles.buttonGroup}>
                <NeonButton variant="primary" pulse>Pulse</NeonButton>
                <NeonButton variant="secondary" glitch>Glitch</NeonButton>
                <NeonButton variant="accent" fullWidth>Full Width</NeonButton>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Футуристические карточки</h2>
          <div className={styles.cardGrid}>
            <FuturisticCard
              variant="default"
              title="Default Card"
              subtitle="Стандартная карточка"
              glowColor="blue"
            >
              <p>Базовый вариант карточки с мягким свечением и hover эффектом.</p>
            </FuturisticCard>

            <FuturisticCard
              variant="glass"
              title="Glass Effect"
              subtitle="Стеклянный эффект"
              glowColor="purple"
            >
              <p>Карточка с эффектом матового стекла и размытием фона.</p>
            </FuturisticCard>

            <FuturisticCard
              variant="holographic"
              title="Holographic"
              subtitle="Голографический эффект"
              glowColor="green"
            >
              <p>Переливающаяся карточка с анимированным градиентом.</p>
            </FuturisticCard>

            <FuturisticCard
              variant="neon"
              title="Neon Borders"
              subtitle="Неоновые границы"
              glowColor="pink"
            >
              <p>Карточка с анимированными неоновыми углами и границами.</p>
            </FuturisticCard>
          </div>
        </section>

        {/* Loaders Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>AI Загрузчики</h2>
          <div className={styles.loaderTabs}>
            {['neural', 'pulse', 'quantum', 'data-stream'].map((type) => (
              <button
                key={type}
                className={`${styles.tab} ${activeLoader === type ? styles.active : ''}`}
                onClick={() => setActiveLoader(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
          <div className={styles.loaderDemo}>
            <AILoader 
              variant={activeLoader as any} 
              size="large" 
              text={`${activeLoader.replace('-', ' ')} анимация...`}
            />
          </div>
        </section>

        {/* Colors Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Цветовая палитра</h2>
          <div className={styles.colorGrid}>
            <div className={styles.colorGroup}>
              <h3>Основные цвета</h3>
              <div className={styles.colorRow}>
                <div className={styles.colorSwatch} style={{ background: 'var(--primary)' }}>
                  <span>Primary</span>
                  <code>#00D9FF</code>
                </div>
                <div className={styles.colorSwatch} style={{ background: 'var(--secondary)' }}>
                  <span>Secondary</span>
                  <code>#BD00FF</code>
                </div>
                <div className={styles.colorSwatch} style={{ background: 'var(--accent)' }}>
                  <span>Accent</span>
                  <code>#00FF88</code>
                </div>
              </div>
            </div>

            <div className={styles.colorGroup}>
              <h3>Градиенты</h3>
              <div className={styles.gradientRow}>
                <div className={styles.gradientSwatch} style={{ background: 'var(--gradient-primary)' }}>
                  <span>Primary Gradient</span>
                </div>
                <div className={styles.gradientSwatch} style={{ background: 'var(--gradient-secondary)' }}>
                  <span>Secondary Gradient</span>
                </div>
                <div className={styles.gradientSwatch} style={{ background: 'var(--gradient-holographic)' }}>
                  <span>Holographic</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}