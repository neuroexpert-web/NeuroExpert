'use client';

import { useState, useEffect } from 'react';
import AgentCard from './AgentCard';
import { useNotification } from './Notification';
import styles from './AgentList.module.css';

// Mock data for agents
const mockAgents = [
  {
    id: 1,
    name: 'Агент по рекламе',
    description: 'Оптимизирует рекламные кампании и анализирует их эффективность.',
    isActive: true,
    costPerHour: 0.5, // $0.5/час
  },
  {
    id: 2,
    name: 'Агент по аналитике',
    description: 'Собирает и анализирует данные для принятия бизнес-решений.',
    isActive: false,
    costPerHour: 0.75, // $0.75/час
  },
  {
    id: 3,
    name: 'Цифровой управляющий',
    description: 'Автоматизирует рутинные задачи и управляет бизнес-процессами.',
    isActive: true,
    costPerHour: 1.0, // $1.0/час
  },
];

export default function AgentList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showWarning, NotificationContainer } = useNotification();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      // TODO: Заменить на реальный API запрос
      // const response = await fetch('/api/agents/list');
      // const data = await response.json();
      // setAgents(data.agents);
      
      // Пока используем mock данные
      setAgents(mockAgents);
    } catch (error) {
      console.error('Ошибка загрузки агентов:', error);
      showError('Не удалось загрузить список агентов');
    }
  };

  const checkBalance = async (costPerHour) => {
    try {
      // TODO: Заменить на реальный API запрос к балансу
      // const response = await fetch('/api/balance/get');
      // const data = await response.json();
      // return data.balance >= costPerHour;
      
      // Пока возвращаем true для демонстрации
      // В production здесь должна быть реальная проверка
      return true;
    } catch (error) {
      console.error('Ошибка проверки баланса:', error);
      return false;
    }
  };

  const handleToggleAgent = async (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    // Если активируем агента, проверяем баланс
    if (!agent.isActive) {
      setLoading(true);
      const hasBalance = await checkBalance(agent.costPerHour);
      
      if (!hasBalance) {
        showWarning(
          `Недостаточно средств для активации агента. Требуется минимум $${agent.costPerHour}/час`
        );
        setLoading(false);
        return;
      }
    }

    try {
      // TODO: Заменить на реальный API запрос
      // const response = await fetch(`/api/agents/${agent.isActive ? 'deactivate' : 'activate'}/${agentId}`, {
      //   method: 'POST',
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Не удалось изменить статус агента');
      // }

      // Обновляем состояние локально
      setAgents((prevAgents) =>
        prevAgents.map((a) =>
          a.id === agentId ? { ...a, isActive: !a.isActive } : a
        )
      );

      // Показываем уведомление
      if (agent.isActive) {
        showSuccess(`Агент "${agent.name}" деактивирован`);
      } else {
        showSuccess(`Агент "${agent.name}" активирован. Стоимость: $${agent.costPerHour}/час`);
      }
    } catch (error) {
      console.error('Ошибка изменения статуса агента:', error);
      showError('Не удалось изменить статус агента. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (agents.length === 0) {
    return (
      <section className={styles.agentListSection}>
        <div className={styles.loading}>Загрузка агентов...</div>
        <NotificationContainer />
      </section>
    );
  }

  return (
    <section className={styles.agentListSection}>
      <header className="section-header">
        <h2>Управление ИИ-агентами</h2>
        <p>Активируйте, деактивируйте и назначайте задачи вашим агентам.</p>
      </header>
      <div className={styles.agentGrid}>
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onToggle={handleToggleAgent}
            disabled={loading}
          />
        ))}
      </div>
      <NotificationContainer />
    </section>
  );
}
