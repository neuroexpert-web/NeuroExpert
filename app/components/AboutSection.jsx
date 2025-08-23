'use client';

import { motion } from 'framer-motion';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={styles.title}>
            О <span className={styles.gradient}>NeuroExpert</span>
          </h2>
          
          <p className={styles.lead}>
            Мы - команда экспертов в области AI и цифровой трансформации, 
            создающая будущее бизнеса уже сегодня.
          </p>

          <div className={styles.stats}>
            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className={styles.statNumber}>300%+</h3>
              <p className={styles.statLabel}>Средний ROI</p>
            </motion.div>
            
            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className={styles.statNumber}>500+</h3>
              <p className={styles.statLabel}>Проектов</p>
            </motion.div>
            
            <motion.div 
              className={styles.statCard}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className={styles.statNumber}>98%</h3>
              <p className={styles.statLabel}>Довольных клиентов</p>
            </motion.div>
          </div>

          <div className={styles.mission}>
            <h3 className={styles.missionTitle}>Наша миссия</h3>
            <p className={styles.missionText}>
              Делать передовые AI-технологии доступными для каждого бизнеса, 
              превращая данные в конкурентное преимущество и драйвер роста.
            </p>
          </div>

          <div className={styles.values}>
            <div className={styles.value}>
              <span className={styles.valueIcon}>🚀</span>
              <h4>Инновации</h4>
              <p>Всегда на шаг впереди технологий</p>
            </div>
            <div className={styles.value}>
              <span className={styles.valueIcon}>🎯</span>
              <h4>Результат</h4>
              <p>Гарантированный ROI для клиентов</p>
            </div>
            <div className={styles.value}>
              <span className={styles.valueIcon}>🤝</span>
              <h4>Партнерство</h4>
              <p>Долгосрочные отношения</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}