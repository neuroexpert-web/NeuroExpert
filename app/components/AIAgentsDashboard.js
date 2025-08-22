'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AIAgentsDashboard.module.css';

export default function AIAgentsDashboard() {
  const [agents, setAgents] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchAgentsMetrics();
    const interval = setInterval(fetchAgentsMetrics, 30000); // Обновление каждые 30 сек
    return () => clearInterval(interval);
  }, []);

  const fetchAgentsMetrics = async () => {
    try {
      const response = await fetch('/api/ai-agent');
      const data = await response.json();
      if (data.success) {
        setAgents(data.data.agents);
      }
    } catch (error) {
      console.error('Failed to fetch agents metrics:', error);
    }
  };

  const testAgent = async () => {
    if (!testQuery.trim()) return;

    setLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: testQuery,
          conversationId,
          context: {
            testMode: true,
          },
          agentPreference: selectedAgent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTestResult(data.data);
        setConversationId(data.data.conversationId);

        // Обновляем историю
        setHistory((prev) => [
          ...prev,
          {
            query: testQuery,
            response: data.data.content,
            agent: data.data.agent,
            quality: data.data.quality.score,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setTestResult({ error: data.error });
      }
    } catch (error) {
      setTestResult({ error: error.message });
    } finally {
      setLoading(false);
      setTestQuery('');
    }
  };

  const getAgentStatus = (metrics) => {
    if (!metrics) return 'inactive';
    const satisfaction = metrics.satisfaction.avg;
    if (satisfaction >= 80) return 'excellent';
    if (satisfaction >= 60) return 'good';
    if (satisfaction >= 40) return 'fair';
    return 'poor';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return '#4CAF50';
      case 'good':
        return '#8BC34A';
      case 'fair':
        return '#FFC107';
      case 'poor':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>🤖 AI Agents Dashboard</h1>
        <p>Управление и мониторинг AI-агентов для общения с клиентами</p>
      </div>

      <div className={styles.agentsGrid}>
        {Object.entries(agents).map(([agentName, metrics]) => {
          const status = getAgentStatus(metrics);
          const isSelected = selectedAgent === agentName;

          return (
            <motion.div
              key={agentName}
              className={`${styles.agentCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedAgent(agentName)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.agentHeader}>
                <h3>{agentName.toUpperCase()}</h3>
                <div
                  className={styles.statusIndicator}
                  style={{ backgroundColor: getStatusColor(status) }}
                />
              </div>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Удовлетворенность</span>
                  <span className={styles.metricValue}>{metrics.satisfaction.avg.toFixed(1)}%</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Точность</span>
                  <span className={styles.metricValue}>{metrics.accuracy.avg.toFixed(1)}%</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Время ответа</span>
                  <span className={styles.metricValue}>
                    {(metrics.responseTime.avg / 1000).toFixed(1)}с
                  </span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Взаимодействий</span>
                  <span className={styles.metricValue}>{metrics.totalInteractions}</span>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <ResponsiveChart data={metrics} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className={styles.testSection}>
        <h2>🧪 Тестирование агентов</h2>

        <div className={styles.testControls}>
          <textarea
            className={styles.testInput}
            placeholder="Введите тестовый запрос для агента..."
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && testAgent()}
            rows={3}
          />

          <button
            className={styles.testButton}
            onClick={testAgent}
            disabled={loading || !testQuery.trim()}
          >
            {loading ? '⏳ Обработка...' : '🚀 Отправить'}
          </button>
        </div>

        {selectedAgent && (
          <div className={styles.selectedAgentInfo}>
            Выбран агент: <strong>{selectedAgent.toUpperCase()}</strong>
          </div>
        )}

        <AnimatePresence>
          {testResult && (
            <motion.div
              className={styles.testResult}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {testResult.error ? (
                <div className={styles.error}>❌ Ошибка: {testResult.error}</div>
              ) : (
                <>
                  <div className={styles.resultHeader}>
                    <span className={styles.agentBadge}>{testResult.agent}</span>
                    <span className={styles.qualityScore}>
                      Качество: {testResult.quality.score.toFixed(0)}%
                    </span>
                    <span className={styles.responseTime}>{testResult.responseTime}мс</span>
                  </div>

                  <div className={styles.responseContent}>{testResult.content}</div>

                  {testResult.suggestions?.length > 0 && (
                    <div className={styles.suggestions}>
                      <h4>💡 Предложения по улучшению:</h4>
                      <ul>
                        {testResult.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className={styles.qualityDetails}>
                    <h4>📊 Детали оценки качества:</h4>
                    <div className={styles.qualityMetrics}>
                      {Object.entries(testResult.quality.evaluation).map(([key, value]) => (
                        <div key={key} className={styles.qualityMetric}>
                          <span>{getMetricLabel(key)}</span>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{
                                width: `${value}%`,
                                backgroundColor: getProgressColor(value),
                              }}
                            />
                          </div>
                          <span>{value.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className={styles.historySection}>
            <h3>📜 История взаимодействий</h3>
            <div className={styles.historyList}>
              {history
                .slice(-5)
                .reverse()
                .map((item, idx) => (
                  <div key={idx} className={styles.historyItem}>
                    <div className={styles.historyHeader}>
                      <span className={styles.historyAgent}>{item.agent}</span>
                      <span className={styles.historyQuality}>Качество: {item.quality}%</span>
                      <span className={styles.historyTime}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={styles.historyQuery}>
                      <strong>Запрос:</strong> {item.query}
                    </div>
                    <div className={styles.historyResponse}>
                      <strong>Ответ:</strong> {item.response.substring(0, 200)}...
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.tips}>
        <h3>💡 Советы по улучшению качества общения</h3>
        <div className={styles.tipsList}>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🎯</span>
            <div>
              <h4>Персонализация</h4>
              <p>Используйте имя клиента и учитывайте историю взаимодействий</p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>⚡</span>
            <div>
              <h4>Скорость ответа</h4>
              <p>Оптимальное время ответа - до 3 секунд</p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>📊</span>
            <div>
              <h4>Анализ метрик</h4>
              <p>Регулярно проверяйте показатели удовлетворенности</p>
            </div>
          </div>
          <div className={styles.tip}>
            <span className={styles.tipIcon}>🔄</span>
            <div>
              <h4>Обратная связь</h4>
              <p>Собирайте отзывы клиентов для улучшения агентов</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Вспомогательные компоненты
function ResponsiveChart({ data }) {
  const satisfactionHistory = data.satisfaction.avg;
  const maxValue = 100;
  const barHeight = (satisfactionHistory / maxValue) * 100;

  return (
    <div className={styles.miniChart}>
      <div
        className={styles.chartBar}
        style={{
          height: `${barHeight}%`,
          backgroundColor: getProgressColor(satisfactionHistory),
        }}
      />
    </div>
  );
}

function getMetricLabel(key) {
  const labels = {
    clarity: 'Ясность',
    relevance: 'Релевантность',
    helpfulness: 'Полезность',
    tone: 'Тон общения',
    completeness: 'Полнота ответа',
  };
  return labels[key] || key;
}

function getProgressColor(value) {
  if (value >= 80) return '#4CAF50';
  if (value >= 60) return '#8BC34A';
  if (value >= 40) return '#FFC107';
  return '#F44336';
}
