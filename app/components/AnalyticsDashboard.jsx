'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    users: 1247,
    revenue: 284500,
    conversion: 12.4,
    growth: 23.7
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки данных
    setTimeout(() => setIsLoading(false), 1500);
    
    // Симуляция обновления метрик в реальном времени
    const interval = setInterval(() => {
      setMetrics(prev => ({
        users: prev.users + Math.floor(Math.random() * 10 - 5),
        revenue: prev.revenue + Math.floor(Math.random() * 1000 - 500),
        conversion: Math.max(0, prev.conversion + (Math.random() * 2 - 1)),
        growth: Math.max(0, prev.growth + (Math.random() * 4 - 2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка аналитики...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="metrics-grid">
        <MetricCard
          title="Активные пользователи"
          value={metrics.users.toLocaleString()}
          change="+12%"
          icon="👥"
          color="blue"
        />
        <MetricCard
          title="Выручка"
          value={`₽${metrics.revenue.toLocaleString()}`}
          change="+23%"
          icon="💰"
          color="green"
        />
        <MetricCard
          title="Конверсия"
          value={`${metrics.conversion.toFixed(1)}%`}
          change="+5.2%"
          icon="📈"
          color="purple"
        />
        <MetricCard
          title="Рост"
          value={`${metrics.growth.toFixed(1)}%`}
          change="+8.1%"
          icon="🚀"
          color="orange"
        />
      </div>

      <div className="charts-section">
        <div className="chart-placeholder">
          <h3>📊 График продаж</h3>
          <div className="chart-bars">
            {Array.from({length: 7}, (_, i) => (
              <motion.div
                key={i}
                className="chart-bar"
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 80 + 20}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ 
                  background: `linear-gradient(to top, var(--primary), var(--accent))`,
                  opacity: 0.8 + Math.random() * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-dashboard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .analytics-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--glass-border);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .charts-section {
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(20px);
        }

        .chart-placeholder h3 {
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 200px;
          gap: 1rem;
          padding: 1rem;
        }

        .chart-bar {
          flex: 1;
          min-height: 20px;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
        }

        .chart-bar:hover {
          transform: scale(1.05);
          opacity: 1 !important;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .analytics-dashboard {
            padding: 1rem;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

function MetricCard({ title, value, change, icon, color }) {
  const colorClasses = {
    blue: 'var(--primary)',
    green: 'var(--accent)',
    purple: '#8b5cf6',
    orange: '#f59e0b'
  };

  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <span className="metric-change" style={{ color: colorClasses[color] }}>
          {change}
        </span>
      </div>
      <div className="metric-value" style={{ color: colorClasses[color] }}>
        {value}
      </div>
      <div className="metric-title">{title}</div>

      <style jsx>{`
        .metric-card {
          background: var(--glass-dark);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          border-color: ${colorClasses[color]};
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .metric-icon {
          font-size: 1.5rem;
        }

        .metric-change {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, ${colorClasses[color]}, ${colorClasses[color]}99);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .metric-title {
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </motion.div>
  );
}