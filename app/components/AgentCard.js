'use client';

import styles from './AgentCard.module.css';

export default function AgentCard({ agent, onToggle, disabled = false }) {
  return (
    <div className={`${styles.agentCard} ${agent.isActive ? styles.active : ''}`}>
      <div className={styles.cardHeader}>
        <h3>{agent.name}</h3>
        <div className={styles.status}>
          {agent.isActive ? 'Активен' : 'Неактивен'}
        </div>
      </div>
      <p className={styles.description}>{agent.description}</p>
      
      {/* Стоимость агента */}
      {agent.costPerHour && (
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>${agent.costPerHour}</span>
            <span className={styles.statLabel}>В час</span>
          </div>
          {agent.isActive && (
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {agent.uptime || '0ч'}
              </span>
              <span className={styles.statLabel}>Время работы</span>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.cardFooter}>
        <button
          className={`${styles.toggleButton} ${agent.isActive ? styles.deactivate : styles.activate}`}
          onClick={() => onToggle(agent.id)}
          disabled={disabled}
        >
          {agent.isActive ? 'Деактивировать' : 'Активировать'}
        </button>
      </div>
    </div>
  );
}
