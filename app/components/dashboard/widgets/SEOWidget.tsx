'use client';

import React, { useState, useEffect } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './SEOWidget.module.css';

interface SEOWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface SEOKeyword {
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  difficulty: number;
  url: string;
  change: number;
}

interface SEOData {
  visibility: number;
  visibilityChange: number;
  avgPosition: number;
  totalKeywords: number;
  keywordsTop10: number;
  keywordsTop3: number;
  organicTraffic: number;
  trafficChange: number;
  topKeywords: SEOKeyword[];
  biggestGainers: SEOKeyword[];
  biggestLosers: SEOKeyword[];
  technicalIssues: Array<{
    type: string;
    count: number;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
  pageSpeed: {
    desktop: number;
    mobile: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
  };
  backlinks: {
    total: number;
    change: number;
    domains: number;
    quality: number;
  };
}

export default function SEOWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: SEOWidgetProps) {
  const [data, setData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSEOData = () => {
      setLoading(true);
      
      setTimeout(() => {
        try {
          const keywords: SEOKeyword[] = [
            {
              keyword: 'ai аналитика',
              position: 3,
              previousPosition: 7,
              searchVolume: 8900,
              difficulty: 65,
              url: '/analytics',
              change: 4
            },
            {
              keyword: 'нейросети для бизнеса',
              position: 5,
              previousPosition: 12,
              searchVolume: 5600,
              difficulty: 58,
              url: '/solutions',
              change: 7
            },
            {
              keyword: 'автоматизация процессов',
              position: 8,
              previousPosition: 6,
              searchVolume: 12300,
              difficulty: 72,
              url: '/processes',
              change: -2
            },
            {
              keyword: 'бизнес аналитика',
              position: 12,
              previousPosition: 18,
              searchVolume: 15600,
              difficulty: 68,
              url: '/analytics',
              change: 6
            },
            {
              keyword: 'машинное обучение услуги',
              position: 15,
              previousPosition: 23,
              searchVolume: 3400,
              difficulty: 54,
              url: '/solutions',
              change: 8
            }
          ];

          const mockData: SEOData = {
            visibility: 42.8,
            visibilityChange: 12.4,
            avgPosition: 18.7,
            totalKeywords: 156,
            keywordsTop10: 23,
            keywordsTop3: 8,
            organicTraffic: 8940,
            trafficChange: 15.8,
            topKeywords: keywords.filter(k => k.position <= 10).sort((a, b) => a.position - b.position),
            biggestGainers: keywords.filter(k => k.change > 0).sort((a, b) => b.change - a.change).slice(0, 3),
            biggestLosers: keywords.filter(k => k.change < 0).sort((a, b) => a.change - b.change).slice(0, 2),
            technicalIssues: [
              {
                type: 'Медленная загрузка',
                count: 12,
                severity: 'high',
                description: 'Страницы загружаются более 3 секунд'
              },
              {
                type: 'Дублированные title',
                count: 5,
                severity: 'medium',
                description: 'Найдены повторяющиеся заголовки страниц'
              },
              {
                type: 'Отсутствуют alt теги',
                count: 18,
                severity: 'low',
                description: 'Изображения без альтернативного текста'
              }
            ],
            pageSpeed: {
              desktop: 87,
              mobile: 72,
              coreWebVitals: {
                lcp: 2.1,
                fid: 85,
                cls: 0.08
              }
            },
            backlinks: {
              total: 2847,
              change: 8.3,
              domains: 456,
              quality: 78
            }
          };

          setData(mockData);
          setError(null);
        } catch (err) {
          setError('Ошибка загрузки SEO данных');
        } finally {
          setLoading(false);
        }
      }, 700);
    };

    loadSEOData();

    if (filters.liveMode) {
      const interval = setInterval(loadSEOData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [filters.liveMode, refreshInterval]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('ru-RU');
  };

  const formatPercent = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Критично';
      case 'medium': return 'Важно';
      case 'low': return 'Низкий';
      default: return 'Неизвестно';
    }
  };

  const getPositionChange = (change: number) => {
    if (change > 0) return { icon: '↗', color: '#22c55e', text: `+${change}` };
    if (change < 0) return { icon: '↘', color: '#ef4444', text: `${change}` };
    return { icon: '→', color: '#6b7280', text: '0' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Анализируем SEO позиции...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.widget}>
        <div className={styles.error}>
          <span>❌ {error || 'Не удалось загрузить данные'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      {/* Заголовок и основные метрики */}
      <div className={styles.header}>
        <h3>🔍 SEO мониторинг</h3>
        <div className={styles.mainMetrics}>
          <div className={styles.mainMetric}>
            <span className={styles.metricValue}>{formatPercent(data.visibility)}</span>
            <span className={styles.metricLabel}>Видимость</span>
            <span className={styles.metricGrowth}>
              +{formatPercent(data.visibilityChange)}
            </span>
          </div>
          <div className={styles.mainMetric}>
            <span className={styles.metricValue}>{formatNumber(data.organicTraffic)}</span>
            <span className={styles.metricLabel}>Органический трафик</span>
            <span className={styles.metricGrowth}>
              +{formatPercent(data.trafficChange)}
            </span>
          </div>
        </div>
      </div>

      {/* Позиции в ТОП */}
      <div className={styles.rankings}>
        <div className={styles.rankingItem}>
          <span className={styles.rankingIcon}>🥇</span>
          <div className={styles.rankingContent}>
            <span className={styles.rankingValue}>{data.keywordsTop3}</span>
            <span className={styles.rankingLabel}>ТОП-3</span>
          </div>
        </div>
        <div className={styles.rankingItem}>
          <span className={styles.rankingIcon}>🏆</span>
          <div className={styles.rankingContent}>
            <span className={styles.rankingValue}>{data.keywordsTop10}</span>
            <span className={styles.rankingLabel}>ТОП-10</span>
          </div>
        </div>
        <div className={styles.rankingItem}>
          <span className={styles.rankingIcon}>📊</span>
          <div className={styles.rankingContent}>
            <span className={styles.rankingValue}>{data.totalKeywords}</span>
            <span className={styles.rankingLabel}>Всего ключей</span>
          </div>
        </div>
        <div className={styles.rankingItem}>
          <span className={styles.rankingIcon}>📈</span>
          <div className={styles.rankingContent}>
            <span className={styles.rankingValue}>{data.avgPosition.toFixed(1)}</span>
            <span className={styles.rankingLabel}>Средняя позиция</span>
          </div>
        </div>
      </div>

      {/* Топ ключевые слова */}
      <div className={styles.topKeywords}>
        <h4>Лучшие позиции</h4>
        <div className={styles.keywordsList}>
          {data.topKeywords.slice(0, 4).map((keyword, index) => {
            const change = getPositionChange(keyword.change);
            return (
              <div key={index} className={styles.keywordItem}>
                <div className={styles.keywordInfo}>
                  <span className={styles.keywordText}>{keyword.keyword}</span>
                  <span className={styles.keywordUrl}>{keyword.url}</span>
                </div>
                <div className={styles.keywordMetrics}>
                  <div className={styles.keywordPosition}>
                    <span className={styles.positionNumber}>{keyword.position}</span>
                    <span 
                      className={styles.positionChange}
                      style={{ color: change.color }}
                    >
                      {change.icon} {Math.abs(keyword.change)}
                    </span>
                  </div>
                  <div className={styles.keywordVolume}>
                    {formatNumber(keyword.searchVolume)} запросов
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Изменения позиций */}
      <div className={styles.positionChanges}>
        <div className={styles.changesSection}>
          <h4 className={styles.gainersTitle}>📈 Рост</h4>
          <div className={styles.changesList}>
            {data.biggestGainers.slice(0, 2).map((keyword, index) => {
              const change = getPositionChange(keyword.change);
              return (
                <div key={index} className={styles.changeItem}>
                  <div className={styles.changeKeyword}>{keyword.keyword}</div>
                  <div className={styles.changeValue} style={{ color: change.color }}>
                    {change.icon} {Math.abs(keyword.change)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {data.biggestLosers.length > 0 && (
          <div className={styles.changesSection}>
            <h4 className={styles.losersTitle}>📉 Падение</h4>
            <div className={styles.changesList}>
              {data.biggestLosers.slice(0, 2).map((keyword, index) => {
                const change = getPositionChange(keyword.change);
                return (
                  <div key={index} className={styles.changeItem}>
                    <div className={styles.changeKeyword}>{keyword.keyword}</div>
                    <div className={styles.changeValue} style={{ color: change.color }}>
                      {change.icon} {Math.abs(keyword.change)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Техническое состояние */}
      <div className={styles.technicalHealth}>
        <h4>🔧 Техническое состояние</h4>
        
        {/* Page Speed */}
        <div className={styles.pageSpeed}>
          <div className={styles.speedMetric}>
            <span className={styles.speedIcon}>💻</span>
            <div className={styles.speedContent}>
              <span className={styles.speedValue} style={{ color: getScoreColor(data.pageSpeed.desktop) }}>
                {data.pageSpeed.desktop}
              </span>
              <span className={styles.speedLabel}>Desktop</span>
            </div>
          </div>
          <div className={styles.speedMetric}>
            <span className={styles.speedIcon}>📱</span>
            <div className={styles.speedContent}>
              <span className={styles.speedValue} style={{ color: getScoreColor(data.pageSpeed.mobile) }}>
                {data.pageSpeed.mobile}
              </span>
              <span className={styles.speedLabel}>Mobile</span>
            </div>
          </div>
        </div>

        {/* Технические проблемы */}
        <div className={styles.technicalIssues}>
          {data.technicalIssues.slice(0, 2).map((issue, index) => (
            <div key={index} className={styles.issueItem}>
              <div className={styles.issueInfo}>
                <span className={styles.issueName}>{issue.type}</span>
                <span className={styles.issueDescription}>{issue.description}</span>
              </div>
              <div className={styles.issueMetrics}>
                <span className={styles.issueCount}>{issue.count}</span>
                <span 
                  className={styles.issueSeverity}
                  style={{ color: getSeverityColor(issue.severity) }}
                >
                  {getSeverityText(issue.severity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ссылочная масса */}
      <div className={styles.backlinks}>
        <h4>🔗 Ссылочная масса</h4>
        <div className={styles.backlinksStats}>
          <div className={styles.backlinksStat}>
            <span className={styles.backlinksValue}>{formatNumber(data.backlinks.total)}</span>
            <span className={styles.backlinksLabel}>Всего ссылок</span>
            <span className={styles.backlinksChange}>+{formatPercent(data.backlinks.change)}</span>
          </div>
          <div className={styles.backlinksStat}>
            <span className={styles.backlinksValue}>{data.backlinks.domains}</span>
            <span className={styles.backlinksLabel}>Доменов</span>
            <span className={styles.backlinksQuality}>Качество: {data.backlinks.quality}%</span>
          </div>
        </div>
      </div>

      {/* Рекомендации */}
      <div className={styles.recommendations}>
        <h4>💡 Рекомендации</h4>
        <div className={styles.recommendationsList}>
          <div className={styles.recommendation}>
            <span className={styles.recIcon}>⚡</span>
            <span>Улучшите скорость загрузки мобильной версии</span>
          </div>
          <div className={styles.recommendation}>
            <span className={styles.recIcon}>📝</span>
            <span>Исправьте дублированные title теги</span>
          </div>
          <div className={styles.recommendation}>
            <span className={styles.recIcon}>🎯</span>
            <span>Продвигайте "ai аналитика" - хорошие позиции и объем</span>
          </div>
        </div>
      </div>
    </div>
  );
}