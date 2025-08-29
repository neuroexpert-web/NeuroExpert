'use client';

import React, { useState, useEffect } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './SocialMediaWidget.module.css';

interface SocialMediaWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface SocialPlatform {
  name: string;
  icon: string;
  color: string;
  followers: number;
  engagement: number;
  reach: number;
  posts: number;
  growth: number;
  lastPost: string;
}

interface SocialMediaData {
  platforms: SocialPlatform[];
  totalReach: number;
  totalEngagement: number;
  bestPerforming: {
    platform: string;
    metric: string;
    value: number;
  };
  recentActivity: Array<{
    platform: string;
    action: string;
    time: string;
    result: string;
  }>;
}

export default function SocialMediaWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: SocialMediaWidgetProps) {
  const [data, setData] = useState<SocialMediaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSocialData = () => {
      setLoading(true);
      
      setTimeout(() => {
        try {
          const mockData: SocialMediaData = {
            platforms: [
              {
                name: 'ВКонтакте',
                icon: '🔵',
                color: '#4680C2',
                followers: 12540,
                engagement: 4.2,
                reach: 8900,
                posts: 15,
                growth: 8.5,
                lastPost: '2 часа назад'
              },
              {
                name: 'Telegram',
                icon: '💬',
                color: '#0088cc',
                followers: 3420,
                engagement: 12.8,
                reach: 4200,
                posts: 8,
                growth: 15.2,
                lastPost: '4 часа назад'
              },
              {
                name: 'Instagram',
                icon: '📸',
                color: '#E4405F',
                followers: 8750,
                engagement: 6.3,
                reach: 12400,
                posts: 12,
                growth: 12.1,
                lastPost: '1 день назад'
              },
              {
                name: 'YouTube',
                icon: '🎥',
                color: '#FF0000',
                followers: 1820,
                engagement: 8.9,
                reach: 5600,
                posts: 3,
                growth: 22.4,
                lastPost: '3 дня назад'
              },
              {
                name: 'Одноклассники',
                icon: '🟠',
                color: '#EE8208',
                followers: 4560,
                engagement: 3.1,
                reach: 2800,
                posts: 7,
                growth: 4.2,
                lastPost: '1 день назад'
              }
            ],
            totalReach: 33900,
            totalEngagement: 7.1,
            bestPerforming: {
              platform: 'YouTube',
              metric: 'Рост подписчиков',
              value: 22.4
            },
            recentActivity: [
              { platform: 'Telegram', action: 'Новый пост', time: '4 часа назад', result: '+156 просмотров' },
              { platform: 'ВКонтакте', action: 'Реклама', time: '6 часов назад', result: '+89 подписчиков' },
              { platform: 'Instagram', action: 'Stories', time: '1 день назад', result: '+234 просмотра' },
              { platform: 'YouTube', action: 'Новое видео', time: '3 дня назад', result: '+67 подписчиков' }
            ]
          };

          setData(mockData);
          setError(null);
        } catch (err) {
          setError('Ошибка загрузки данных соцсетей');
        } finally {
          setLoading(false);
        }
      }, 600);
    };

    loadSocialData();

    if (filters.liveMode) {
      const interval = setInterval(loadSocialData, refreshInterval);
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

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Загрузка данных соцсетей...</span>
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
      {/* Заголовок */}
      <div className={styles.header}>
        <h3>📱 Социальные сети</h3>
        <div className={styles.totalStats}>
          <div className={styles.totalStat}>
            <span className={styles.totalValue}>{formatNumber(data.totalReach)}</span>
            <span className={styles.totalLabel}>Охват</span>
          </div>
          <div className={styles.totalStat}>
            <span className={styles.totalValue}>{formatPercent(data.totalEngagement)}</span>
            <span className={styles.totalLabel}>Вовлечение</span>
          </div>
        </div>
      </div>

      {/* Платформы */}
      <div className={styles.platforms}>
        {data.platforms.map((platform, index) => (
          <div key={index} className={styles.platformCard}>
            <div className={styles.platformHeader}>
              <div className={styles.platformInfo}>
                <span className={styles.platformIcon}>{platform.icon}</span>
                <span className={styles.platformName}>{platform.name}</span>
              </div>
              <div className={styles.platformGrowth}>
                <span 
                  className={styles.growthValue}
                  style={{ color: platform.growth > 0 ? '#22c55e' : '#ef4444' }}
                >
                  {platform.growth > 0 ? '+' : ''}{formatPercent(platform.growth)}
                </span>
              </div>
            </div>

            <div className={styles.platformMetrics}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{formatNumber(platform.followers)}</span>
                <span className={styles.metricLabel}>Подписчики</span>
              </div>
              
              <div className={styles.metric}>
                <span className={styles.metricValue}>{formatNumber(platform.reach)}</span>
                <span className={styles.metricLabel}>Охват</span>
              </div>
              
              <div className={styles.metric}>
                <span className={styles.metricValue}>{formatPercent(platform.engagement)}</span>
                <span className={styles.metricLabel}>Вовлечение</span>
              </div>
            </div>

            <div className={styles.platformFooter}>
              <span className={styles.postsCount}>{platform.posts} постов за неделю</span>
              <span className={styles.lastPost}>Последний: {platform.lastPost}</span>
            </div>

            {/* Индикатор активности */}
            <div 
              className={styles.activityIndicator}
              style={{ backgroundColor: platform.color }}
            ></div>
          </div>
        ))}
      </div>

      {/* Лучший результат */}
      <div className={styles.bestPerforming}>
        <div className={styles.bestHeader}>
          <span className={styles.bestIcon}>🏆</span>
          <span className={styles.bestTitle}>Лучший результат</span>
        </div>
        <div className={styles.bestContent}>
          <span className={styles.bestPlatform}>{data.bestPerforming.platform}</span>
          <span className={styles.bestMetric}>{data.bestPerforming.metric}</span>
          <span className={styles.bestValue}>+{formatPercent(data.bestPerforming.value)}</span>
        </div>
      </div>

      {/* Недавняя активность */}
      <div className={styles.recentActivity}>
        <h4>Недавняя активность</h4>
        <div className={styles.activityList}>
          {data.recentActivity.slice(0, 3).map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityInfo}>
                <span className={styles.activityPlatform}>{activity.platform}</span>
                <span className={styles.activityAction}>{activity.action}</span>
              </div>
              <div className={styles.activityMeta}>
                <span className={styles.activityResult}>{activity.result}</span>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Рекомендации */}
      <div className={styles.recommendations}>
        <h4>💡 Рекомендации</h4>
        <div className={styles.recommendationsList}>
          <div className={styles.recommendation}>
            <span className={styles.recIcon}>📈</span>
            <span>Увеличьте активность в Telegram - самая высокая вовлеченность</span>
          </div>
          <div className={styles.recommendation}>
            <span className={styles.recIcon}>🎥</span>
            <span>Опубликуйте видео на YouTube - лучший рост подписчиков</span>
          </div>
        </div>
      </div>
    </div>
  );
}