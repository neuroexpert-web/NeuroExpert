'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Динамические импорты для графиков
const Chart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });
const DoughnutChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Doughnut), { ssr: false });
const BarChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });

export default function UnifiedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    realtime: { users: 0, pageviews: 0 },
    traffic: { total: 0, sources: [] },
    conversions: { total: 0, rate: 0, revenue: 0 },
    campaigns: [],
    behavior: { bounceRate: 0, avgDuration: 0, pagesPerSession: 0 }
  });

  // Загрузка данных из всех источников
  useEffect(() => {
    loadAnalyticsData();
    
    // Обновляем данные каждые 30 секунд
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      // Здесь будут реальные API запросы к GA4, YM и другим сервисам
      // Пока используем моковые данные для демонстрации
      
      setAnalyticsData({
        realtime: {
          users: Math.floor(Math.random() * 100) + 50,
          pageviews: Math.floor(Math.random() * 500) + 200,
          activeSessions: Math.floor(Math.random() * 80) + 30,
          topPages: [
            { page: '/', views: Math.floor(Math.random() * 100) + 50 },
            { page: '/solutions', views: Math.floor(Math.random() * 50) + 20 },
            { page: '/pricing', views: Math.floor(Math.random() * 40) + 15 }
          ]
        },
        traffic: {
          total: 15420,
          sources: [
            { name: 'Google', visits: 6500, percentage: 42 },
            { name: 'Яндекс', visits: 4200, percentage: 27 },
            { name: 'Прямой', visits: 2300, percentage: 15 },
            { name: 'Социальные', visits: 1400, percentage: 9 },
            { name: 'Реферальный', visits: 1020, percentage: 7 }
          ]
        },
        conversions: {
          total: 245,
          rate: 3.8,
          revenue: 2450000,
          goals: [
            { name: 'Регистрация', completed: 145, rate: 2.3 },
            { name: 'Демо', completed: 67, rate: 1.1 },
            { name: 'Оплата', completed: 33, rate: 0.5 }
          ]
        },
        campaigns: [
          { 
            name: 'Google Ads - Поиск',
            spend: 45000,
            clicks: 2300,
            conversions: 89,
            revenue: 890000,
            roi: 1878
          },
          {
            name: 'Яндекс.Директ',
            spend: 32000,
            clicks: 1850,
            conversions: 72,
            revenue: 650000,
            roi: 1931
          },
          {
            name: 'Facebook Ads',
            spend: 25000,
            clicks: 3200,
            conversions: 45,
            revenue: 380000,
            roi: 1420
          },
          {
            name: 'VK Реклама',
            spend: 15000,
            clicks: 2100,
            conversions: 39,
            revenue: 290000,
            roi: 1833
          }
        ],
        behavior: {
          bounceRate: 42.5,
          avgDuration: 185, // секунды
          pagesPerSession: 3.2,
          deviceTypes: [
            { type: 'Desktop', percentage: 58 },
            { type: 'Mobile', percentage: 37 },
            { type: 'Tablet', percentage: 5 }
          ]
        }
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  // Конфигурация графиков
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12 }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' }
      }
    }
  };

  // Расчет ROI
  const calculateROI = (revenue, spend) => {
    if (spend === 0) return 0;
    return Math.round(((revenue - spend) / spend) * 100);
  };

  // Форматирование денег
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Форматирование времени
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="spinner"></div>
        <p>Загрузка данных аналитики...</p>
      </div>
    );
  }

  return (
    <div className="unified-analytics-dashboard">
      {/* Заголовок и фильтры */}
      <div className="dashboard-header">
        <h2>Единая панель аналитики</h2>
        <div className="time-filter">
          <button 
            className={timeRange === 'today' ? 'active' : ''}
            onClick={() => setTimeRange('today')}
          >
            Сегодня
          </button>
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Неделя
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Месяц
          </button>
        </div>
      </div>

      {/* Реалтайм метрики */}
      <div className="realtime-section">
        <h3>🔴 Сейчас на сайте</h3>
        <div className="realtime-metrics">
          <div className="metric-card pulse">
            <div className="metric-value">{analyticsData.realtime.users}</div>
            <div className="metric-label">Активных пользователей</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{analyticsData.realtime.pageviews}</div>
            <div className="metric-label">Просмотров за час</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{analyticsData.realtime.activeSessions}</div>
            <div className="metric-label">Активных сессий</div>
          </div>
        </div>
      </div>

      {/* Источники трафика */}
      <div className="traffic-sources">
        <h3>📊 Источники трафика</h3>
        <div className="sources-grid">
          <div className="sources-chart">
            <DoughnutChart 
              data={{
                labels: analyticsData.traffic.sources.map(s => s.name),
                datasets: [{
                  data: analyticsData.traffic.sources.map(s => s.visits),
                  backgroundColor: [
                    '#4285f4', // Google
                    '#ffcc00', // Яндекс
                    '#10b981', // Прямой
                    '#8b5cf6', // Социальные
                    '#ec4899'  // Реферальный
                  ]
                }]
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'right',
                    labels: {
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: 20
                    }
                  }
                }
              }}
            />
          </div>
          <div className="sources-list">
            {analyticsData.traffic.sources.map((source, index) => (
              <div key={index} className="source-item">
                <div className="source-name">{source.name}</div>
                <div className="source-stats">
                  <span className="visits">{source.visits.toLocaleString()} визитов</span>
                  <span className="percentage">{source.percentage}%</span>
                </div>
                <div className="source-bar">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Рекламные кампании */}
      <div className="campaigns-section">
        <h3>💰 Эффективность рекламы</h3>
        <div className="campaigns-table">
          <table>
            <thead>
              <tr>
                <th>Кампания</th>
                <th>Расход</th>
                <th>Клики</th>
                <th>Конверсии</th>
                <th>Доход</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.campaigns.map((campaign, index) => (
                <tr key={index}>
                  <td>{campaign.name}</td>
                  <td>{formatMoney(campaign.spend)}</td>
                  <td>{campaign.clicks.toLocaleString()}</td>
                  <td>{campaign.conversions}</td>
                  <td>{formatMoney(campaign.revenue)}</td>
                  <td className={`roi ${campaign.roi > 1500 ? 'positive' : ''}`}>
                    {campaign.roi}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="campaign-summary">
            <div className="summary-item">
              <span>Общий расход:</span>
              <span className="value">
                {formatMoney(analyticsData.campaigns.reduce((sum, c) => sum + c.spend, 0))}
              </span>
            </div>
            <div className="summary-item">
              <span>Общий доход:</span>
              <span className="value positive">
                {formatMoney(analyticsData.campaigns.reduce((sum, c) => sum + c.revenue, 0))}
              </span>
            </div>
            <div className="summary-item">
              <span>Средний ROI:</span>
              <span className="value positive">
                {Math.round(
                  analyticsData.campaigns.reduce((sum, c) => sum + c.roi, 0) / 
                  analyticsData.campaigns.length
                )}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Конверсии и цели */}
      <div className="conversions-section">
        <h3>🎯 Конверсии и цели</h3>
        <div className="conversions-grid">
          <div className="conversion-overview">
            <div className="big-metric">
              <div className="value">{analyticsData.conversions.total}</div>
              <div className="label">Всего конверсий</div>
            </div>
            <div className="big-metric">
              <div className="value">{analyticsData.conversions.rate}%</div>
              <div className="label">Коэффициент конверсии</div>
            </div>
            <div className="big-metric">
              <div className="value">{formatMoney(analyticsData.conversions.revenue)}</div>
              <div className="label">Доход от конверсий</div>
            </div>
          </div>
          
          <div className="goals-breakdown">
            {analyticsData.conversions.goals.map((goal, index) => (
              <div key={index} className="goal-item">
                <div className="goal-header">
                  <span className="goal-name">{goal.name}</span>
                  <span className="goal-completed">{goal.completed}</span>
                </div>
                <div className="goal-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(goal.completed / analyticsData.conversions.total) * 100}%` 
                    }}
                  />
                </div>
                <div className="goal-rate">CR: {goal.rate}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Поведение пользователей */}
      <div className="behavior-section">
        <h3>👥 Поведение пользователей</h3>
        <div className="behavior-metrics">
          <div className="metric-card">
            <div className="metric-icon">📉</div>
            <div className="metric-value">{analyticsData.behavior.bounceRate}%</div>
            <div className="metric-label">Отказы</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">⏱️</div>
            <div className="metric-value">{formatDuration(analyticsData.behavior.avgDuration)}</div>
            <div className="metric-label">Среднее время</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📄</div>
            <div className="metric-value">{analyticsData.behavior.pagesPerSession}</div>
            <div className="metric-label">Страниц за сессию</div>
          </div>
        </div>
        
        <div className="device-breakdown">
          <h4>Устройства</h4>
          <div className="device-bars">
            {analyticsData.behavior.deviceTypes.map((device, index) => (
              <div key={index} className="device-item">
                <div className="device-info">
                  <span className="device-name">{device.type}</span>
                  <span className="device-percentage">{device.percentage}%</span>
                </div>
                <div className="device-bar">
                  <div 
                    className="bar-fill"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI рекомендации */}
      <div className="ai-recommendations">
        <h3>🤖 AI Рекомендации</h3>
        <div className="recommendations-list">
          <div className="recommendation-item high">
            <div className="rec-icon">🚨</div>
            <div className="rec-content">
              <h4>Увеличьте бюджет Google Ads</h4>
              <p>ROI кампании 1878% - самый высокий. Увеличение бюджета на 30% может принести дополнительно 267K₽/мес</p>
            </div>
          </div>
          <div className="recommendation-item medium">
            <div className="rec-icon">⚠️</div>
            <div className="rec-content">
              <h4>Оптимизируйте мобильную версию</h4>
              <p>37% трафика с мобильных, но конверсия ниже на 45%. Улучшение UX может увеличить доход на 150K₽/мес</p>
            </div>
          </div>
          <div className="recommendation-item low">
            <div className="rec-icon">💡</div>
            <div className="rec-content">
              <h4>Добавьте ретаргетинг в VK</h4>
              <p>VK показывает хороший ROI. Ретаргетинг может увеличить конверсии на 20-30%</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .unified-analytics-dashboard {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h2 {
          color: white;
          font-size: 2rem;
        }

        .time-filter {
          display: flex;
          gap: 0.5rem;
        }

        .time-filter button {
          padding: 0.5rem 1rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .time-filter button:hover,
        .time-filter button.active {
          background: rgba(139, 92, 246, 0.3);
          border-color: #8b5cf6;
        }

        /* Секции */
        .realtime-section,
        .traffic-sources,
        .campaigns-section,
        .conversions-section,
        .behavior-section,
        .ai-recommendations {
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        h3 {
          color: white;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Реалтайм метрики */
        .realtime-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .metric-card {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .metric-card.pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        /* Источники трафика */
        .sources-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          align-items: center;
        }

        .sources-chart {
          height: 300px;
        }

        .source-item {
          margin-bottom: 1rem;
        }

        .source-name {
          color: white;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .source-stats {
          display: flex;
          justify-content: space-between;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .source-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          transition: width 0.5s ease;
        }

        /* Таблица кампаний */
        .campaigns-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          text-align: left;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        th {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          font-size: 0.875rem;
        }

        td {
          color: white;
        }

        .roi.positive {
          color: #10b981;
          font-weight: 600;
        }

        .campaign-summary {
          display: flex;
          justify-content: space-around;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .summary-item {
          text-align: center;
        }

        .summary-item span {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
        }

        .summary-item .value {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .summary-item .value.positive {
          color: #10b981;
        }

        /* Конверсии */
        .conversions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .conversion-overview {
          display: flex;
          justify-content: space-around;
        }

        .big-metric {
          text-align: center;
        }

        .big-metric .value {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .big-metric .label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }

        .goal-item {
          margin-bottom: 1.5rem;
        }

        .goal-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .goal-name {
          color: white;
          font-weight: 600;
        }

        .goal-completed {
          color: #8b5cf6;
          font-weight: 700;
        }

        .goal-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .goal-rate {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
        }

        /* Поведение */
        .behavior-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .device-breakdown h4 {
          color: white;
          margin-bottom: 1rem;
        }

        .device-item {
          margin-bottom: 1rem;
        }

        .device-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .device-name {
          color: white;
        }

        .device-percentage {
          color: rgba(255, 255, 255, 0.7);
        }

        .device-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        /* AI Рекомендации */
        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .recommendation-item {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .recommendation-item:hover {
          transform: translateX(10px);
        }

        .recommendation-item.high {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .recommendation-item.medium {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .rec-icon {
          font-size: 2rem;
        }

        .rec-content h4 {
          color: white;
          margin-bottom: 0.5rem;
        }

        .rec-content p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        /* Загрузка */
        .analytics-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: white;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(139, 92, 246, 0.3);
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .sources-grid,
          .conversions-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
          }

          .time-filter {
            width: 100%;
            justify-content: space-between;
          }

          .campaign-summary {
            flex-direction: column;
            gap: 1rem;
          }

          table {
            font-size: 0.875rem;
          }

          th, td {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}