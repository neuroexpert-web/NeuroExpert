'use client';
import { useState, useEffect } from 'react';
import './RealtimeStats.css';

export default function RealtimeStats() {
  const [stats, setStats] = useState({
    visitors: 245,
    leads: 12,
    conversion: 4.9,
    revenue: 125000
  });

  const [history, setHistory] = useState({
    visitors: [],
    conversion: []
  });

  useEffect(() => {
    // Симуляция обновления статистики в реальном времени
    const interval = setInterval(() => {
      setStats(prev => {
        const newStats = {
          visitors: prev.visitors + Math.floor(Math.random() * 5),
          leads: prev.leads + (Math.random() > 0.7 ? 1 : 0),
          conversion: Math.max(0, Math.min(10, prev.conversion + (Math.random() - 0.5) * 0.5)),
          revenue: prev.revenue + Math.floor(Math.random() * 10000)
        };

        // Сохраняем историю для графиков
        setHistory(prevHistory => ({
          visitors: [...prevHistory.visitors.slice(-19), newStats.visitors],
          conversion: [...prevHistory.conversion.slice(-19), newStats.conversion]
        }));

        return newStats;
      });

      // Отправляем в аналитику
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'realtime_stats_update', {
          event_category: 'monitoring',
          visitors: stats.visitors,
          conversion: stats.conversion
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Анимация чисел
  const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      const diff = value - displayValue;
      const step = diff / 10;
      let current = displayValue;

      const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= value) || (step < 0 && current <= value)) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.round(current));
        }
      }, 50);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <span className="animated-number">
        {prefix}{typeof displayValue === 'number' ? displayValue.toLocaleString('ru-RU') : displayValue}{suffix}
      </span>
    );
  };

  // Мини-график
  const MiniChart = ({ data, color }) => {
    const max = Math.max(...data, 1);
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: 100 - (value / max) * 100
    }));

    const pathData = points.length > 0
      ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
      : '';

    return (
      <svg className="mini-chart" viewBox="0 0 100 40">
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L 100,40 L 0,40 Z`}
          fill={`url(#gradient-${color})`}
        />
      </svg>
    );
  };

  return (
    <div className="realtime-stats">
      <div className="stats-header">
        <h3>
          <span className="stats-icon">📊</span>
          Статистика в реальном времени
        </h3>
        <div className="stats-status">
          <span className="status-dot live"></span>
          <span className="status-text">Live</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
            <span className="stat-trend up">+12%</span>
          </div>
          <div className="stat-value">
            <AnimatedNumber value={stats.visitors} />
          </div>
          <div className="stat-label">Посетителей сегодня</div>
          <MiniChart data={history.visitors} color="#4f46e5" />
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📝</span>
            <span className="stat-trend up">+5</span>
          </div>
          <div className="stat-value">
            <AnimatedNumber value={stats.leads} />
          </div>
          <div className="stat-label">Новых лидов</div>
          <div className="stat-progress">
            <div 
              className="progress-bar"
              style={{ width: `${Math.min(100, stats.leads * 5)}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📈</span>
            <span className="stat-trend">{stats.conversion > 5 ? '🔥' : '📊'}</span>
          </div>
          <div className="stat-value">
            <AnimatedNumber value={stats.conversion.toFixed(1)} suffix="%" />
          </div>
          <div className="stat-label">Конверсия</div>
          <MiniChart data={history.conversion} color="#10b981" />
        </div>

        <div className="stat-card highlight">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <span className="stat-trend up">+8.3%</span>
          </div>
          <div className="stat-value">
            <AnimatedNumber value={stats.revenue} prefix="₽" />
          </div>
          <div className="stat-label">Прибыль сегодня</div>
          <div className="stat-details">
            <span>Цель: ₽500,000</span>
            <span className="detail-percent">{((stats.revenue / 500000) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div className="stats-footer">
        <button className="stats-action">
          <span>📊</span>
          Полная аналитика
        </button>
        <button className="stats-action">
          <span>📈</span>
          Экспорт отчета
        </button>
        <button className="stats-action">
          <span>🔔</span>
          Настроить алерты
        </button>
      </div>
    </div>
  );
}