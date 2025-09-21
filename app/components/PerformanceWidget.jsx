'use client';

import React, { useState, useEffect } from 'react';

const PerformanceWidget = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchPerformanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch('/api/analytics/performance?timeframe=1h&limit=50');
      if (!response.ok) throw new Error('Failed to fetch performance data');
      
      const data = await response.json();
      setPerformanceData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return '#22c55e';
      case 'needs-improvement': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getRatingEmoji = (rating) => {
    switch (rating) {
      case 'good': return '🟢';
      case 'needs-improvement': return '🟡';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  const formatValue = (metric, value) => {
    if (['LCP', 'FCP', 'FID', 'INP', 'TTFB'].includes(metric)) {
      return `${Math.round(value)}ms`;
    }
    if (metric === 'CLS') {
      return value.toFixed(3);
    }
    return value;
  };

  if (loading) {
    return (
      <div className="performance-widget glass-card loading">
        <div className="widget-header">
          <h4>⚡ Производительность сайта</h4>
        </div>
        <div className="loading-content">
          <div className="spinner"></div>
          <span>Загружаем данные...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="performance-widget glass-card error">
        <div className="widget-header">
          <h4>⚡ Производительность сайта</h4>
        </div>
        <div className="error-content">
          <span className="error-icon">⚠️</span>
          <span>Не удалось загрузить данные: {error}</span>
        </div>
      </div>
    );
  }

  const webVitals = performanceData?.summary?.webVitals || {};
  const hasData = Object.keys(webVitals).length > 0;

  if (!hasData) {
    return (
      <div className="performance-widget glass-card no-data">
        <div className="widget-header">
          <h4>⚡ Производительность сайта</h4>
          <span className="data-count">Нет данных</span>
        </div>
        <div className="no-data-content">
          <span className="no-data-icon">📊</span>
          <div className="no-data-text">
            <p>Данные о производительности пока не собраны</p>
            <small>Обновите страницу или подождите несколько минут</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-widget glass-card">
      <div className="widget-header">
        <div className="header-content">
          <h4>⚡ Как быстро работает сайт</h4>
          <p className="widget-description">Скорость загрузки и отзывчивость для пользователей</p>
        </div>
        <div className="widget-stats">
          <span className="data-count">{performanceData.count} измерений</span>
          <button 
            className="refresh-btn"
            onClick={fetchPerformanceData}
            title="Обновить данные"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="performance-metrics">
        {Object.entries(webVitals).map(([metric, data]) => (
          <div key={metric} className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">
                {getRatingEmoji(data.rating || 'unknown')}
              </span>
              <div className="metric-info">
                <span className="metric-name">{getMetricName(metric)}</span>
                <span className="metric-description">{getMetricDescription(metric)}</span>
              </div>
            </div>
            
            <div className="metric-value">
              <span className="value">{formatValue(metric, data.average || data.value || 0)}</span>
              <span 
                className="rating"
                style={{ color: getRatingColor(data.rating || 'unknown') }}
              >
                {getRatingText(data.rating)}
              </span>
            </div>

            {data.count && (
              <div className="metric-stats">
                <span className="stat-item">
                  <span className="stat-label">Мин:</span>
                  <span className="stat-value">{formatValue(metric, data.min)}</span>
                </span>
                <span className="stat-item">
                  <span className="stat-label">Макс:</span>
                  <span className="stat-value">{formatValue(metric, data.max)}</span>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {performanceData.summary?.slowResources?.length > 0 && (
        <div className="slow-resources">
          <h5>🐌 Медленные ресурсы</h5>
          <div className="resources-list">
            {performanceData.summary.slowResources.slice(0, 3).map((resource, index) => (
              <div key={index} className="resource-item">
                <span className="resource-name">
                  {resource.resource.split('/').pop() || 'Unknown'}
                </span>
                <span className="resource-duration">{resource.duration}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="performance-tips">
        <h5>💡 Рекомендации</h5>
        <div className="tips-list">
          {getPerformanceTips(webVitals).map((tip, index) => (
            <div key={index} className="tip-item">
              <span className="tip-icon">{tip.icon}</span>
              <span className="tip-text">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getMetricName = (metric) => {
  const names = {
    LCP: 'Загрузка контента',
    FID: 'Отклик на действия',
    CLS: 'Стабильность макета',
    FCP: 'Первая отрисовка',
    INP: 'Скорость реакции',
    TTFB: 'Ответ сервера'
  };
  return names[metric] || metric;
};

const getMetricDescription = (metric) => {
  const descriptions = {
    LCP: 'Как быстро загружается основной контент',
    FID: 'Как быстро сайт реагирует на клики',
    CLS: 'Насколько стабилен макет страницы',
    FCP: 'Когда появляется первый контент',
    INP: 'Скорость обработки взаимодействий',
    TTFB: 'Как быстро отвечает сервер'
  };
  return descriptions[metric] || 'Метрика производительности';
};

const getRatingText = (rating) => {
  const texts = {
    good: 'Отлично',
    'needs-improvement': 'Можно лучше',
    poor: 'Плохо',
    unknown: 'Неизвестно'
  };
  return texts[rating] || 'Неизвестно';
};

const getPerformanceTips = (webVitals) => {
  const tips = [];
  
  Object.entries(webVitals).forEach(([metric, data]) => {
    if (data.rating === 'poor') {
      switch (metric) {
        case 'LCP':
          tips.push({
            icon: '🖼️',
            text: 'Оптимизируйте изображения и используйте CDN'
          });
          break;
        case 'FID':
          tips.push({
            icon: '⚡',
            text: 'Уменьшите JavaScript и улучшите код'
          });
          break;
        case 'CLS':
          tips.push({
            icon: '📐',
            text: 'Задайте размеры для изображений и контента'
          });
          break;
      }
    }
  });

  if (tips.length === 0) {
    tips.push({
      icon: '🎉',
      text: 'Производительность сайта на хорошем уровне!'
    });
  }

  return tips.slice(0, 3); // Показываем максимум 3 совета
};

export default PerformanceWidget;