'use client';

import React, { useState, useEffect } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './EmailMarketingWidget.module.css';

interface EmailMarketingWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface EmailCampaign {
  id: string;
  name: string;
  status: 'sent' | 'sending' | 'draft' | 'scheduled';
  sentDate: string;
  recipients: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  revenue: number;
}

interface EmailMarketingData {
  totalSubscribers: number;
  subscriberGrowth: number;
  avgOpenRate: number;
  avgClickRate: number;
  totalRevenue: number;
  revenueGrowth: number;
  campaigns: EmailCampaign[];
  topPerforming: EmailCampaign;
  segmentStats: Array<{
    name: string;
    subscribers: number;
    openRate: number;
    growth: number;
  }>;
  upcomingCampaigns: Array<{
    name: string;
    scheduledDate: string;
    recipients: number;
  }>;
}

export default function EmailMarketingWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: EmailMarketingWidgetProps) {
  const [data, setData] = useState<EmailMarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmailData = () => {
      setLoading(true);
      
      setTimeout(() => {
        try {
          const campaigns: EmailCampaign[] = [
            {
              id: '1',
              name: 'Новая коллекция весна 2025',
              status: 'sent',
              sentDate: '2 дня назад',
              recipients: 8540,
              opened: 2980,
              clicked: 445,
              unsubscribed: 12,
              openRate: 34.9,
              clickRate: 14.9,
              revenue: 67800
            },
            {
              id: '2', 
              name: 'Скидка 20% для VIP клиентов',
              status: 'sent',
              sentDate: '5 дней назад',
              recipients: 1240,
              opened: 687,
              clicked: 156,
              unsubscribed: 3,
              openRate: 55.4,
              clickRate: 22.7,
              revenue: 23400
            },
            {
              id: '3',
              name: 'Еженедельная рассылка #12',
              status: 'sent',
              sentDate: '1 неделя назад',
              recipients: 12340,
              opened: 4200,
              clicked: 567,
              unsubscribed: 28,
              openRate: 34.0,
              clickRate: 13.5,
              revenue: 12800
            }
          ];

          const mockData: EmailMarketingData = {
            totalSubscribers: 12540,
            subscriberGrowth: 8.2,
            avgOpenRate: 41.4,
            avgClickRate: 17.0,
            totalRevenue: 104000,
            revenueGrowth: 15.6,
            campaigns,
            topPerforming: campaigns[1], // VIP клиенты показали лучший результат
            segmentStats: [
              { name: 'VIP клиенты', subscribers: 1240, openRate: 55.4, growth: 12.3 },
              { name: 'Постоянные покупатели', subscribers: 4560, openRate: 42.1, growth: 6.8 },
              { name: 'Новые подписчики', subscribers: 2890, openRate: 28.7, growth: 18.4 },
              { name: 'Неактивные', subscribers: 3850, openRate: 15.2, growth: -2.1 }
            ],
            upcomingCampaigns: [
              { name: 'Распродажа зимней коллекции', scheduledDate: 'завтра', recipients: 10200 },
              { name: 'День рождения компании', scheduledDate: 'через 3 дня', recipients: 12540 },
              { name: 'Новинки марта', scheduledDate: 'через неделю', recipients: 8900 }
            ]
          };

          setData(mockData);
          setError(null);
        } catch (err) {
          setError('Ошибка загрузки данных email-маркетинга');
        } finally {
          setLoading(false);
        }
      }, 500);
    };

    loadEmailData();

    if (filters.liveMode) {
      const interval = setInterval(loadEmailData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [filters.liveMode, refreshInterval]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString('ru-RU');
  };

  const formatCurrency = (num: number) => {
    return `₽ ${formatNumber(num)}`;
  };

  const formatPercent = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return '#22c55e';
      case 'sending': return '#3b82f6';
      case 'scheduled': return '#f59e0b';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Отправлена';
      case 'sending': return 'Отправляется';
      case 'scheduled': return 'Запланирована';
      case 'draft': return 'Черновик';
      default: return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Загрузка email-кампаний...</span>
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
        <h3>📧 Email-маркетинг</h3>
        <div className={styles.mainMetrics}>
          <div className={styles.mainMetric}>
            <span className={styles.metricValue}>{formatNumber(data.totalSubscribers)}</span>
            <span className={styles.metricLabel}>Подписчиков</span>
            <span className={styles.metricGrowth}>
              +{formatPercent(data.subscriberGrowth)}
            </span>
          </div>
          <div className={styles.mainMetric}>
            <span className={styles.metricValue}>{formatCurrency(data.totalRevenue)}</span>
            <span className={styles.metricLabel}>Выручка</span>
            <span className={styles.metricGrowth}>
              +{formatPercent(data.revenueGrowth)}
            </span>
          </div>
        </div>
      </div>

      {/* Средние показатели */}
      <div className={styles.averageStats}>
        <div className={styles.avgStat}>
          <span className={styles.avgIcon}>👁️</span>
          <div className={styles.avgContent}>
            <span className={styles.avgValue}>{formatPercent(data.avgOpenRate)}</span>
            <span className={styles.avgLabel}>Открываемость</span>
          </div>
        </div>
        <div className={styles.avgStat}>
          <span className={styles.avgIcon}>👆</span>
          <div className={styles.avgContent}>
            <span className={styles.avgValue}>{formatPercent(data.avgClickRate)}</span>
            <span className={styles.avgLabel}>Кликабельность</span>
          </div>
        </div>
      </div>

      {/* Лучшая кампания */}
      <div className={styles.topCampaign}>
        <div className={styles.topHeader}>
          <span className={styles.topIcon}>🏆</span>
          <span className={styles.topTitle}>Лучшая кампания</span>
        </div>
        <div className={styles.topContent}>
          <div className={styles.topCampaignName}>{data.topPerforming.name}</div>
          <div className={styles.topMetrics}>
            <div className={styles.topMetric}>
              <span className={styles.topMetricValue}>{formatPercent(data.topPerforming.openRate)}</span>
              <span className={styles.topMetricLabel}>открыли</span>
            </div>
            <div className={styles.topMetric}>
              <span className={styles.topMetricValue}>{formatPercent(data.topPerforming.clickRate)}</span>
              <span className={styles.topMetricLabel}>кликнули</span>
            </div>
            <div className={styles.topMetric}>
              <span className={styles.topMetricValue}>{formatCurrency(data.topPerforming.revenue)}</span>
              <span className={styles.topMetricLabel}>выручка</span>
            </div>
          </div>
        </div>
      </div>

      {/* Последние кампании */}
      <div className={styles.recentCampaigns}>
        <h4>Последние кампании</h4>
        <div className={styles.campaignsList}>
          {data.campaigns.slice(0, 3).map((campaign) => (
            <div key={campaign.id} className={styles.campaignItem}>
              <div className={styles.campaignHeader}>
                <div className={styles.campaignInfo}>
                  <span className={styles.campaignName}>{campaign.name}</span>
                  <span 
                    className={styles.campaignStatus}
                    style={{ color: getStatusColor(campaign.status) }}
                  >
                    {getStatusText(campaign.status)}
                  </span>
                </div>
                <span className={styles.campaignDate}>{campaign.sentDate}</span>
              </div>
              
              <div className={styles.campaignStats}>
                <div className={styles.campaignStat}>
                  <span className={styles.statValue}>{formatNumber(campaign.recipients)}</span>
                  <span className={styles.statLabel}>получили</span>
                </div>
                <div className={styles.campaignStat}>
                  <span className={styles.statValue}>{formatPercent(campaign.openRate)}</span>
                  <span className={styles.statLabel}>открыли</span>
                </div>
                <div className={styles.campaignStat}>
                  <span className={styles.statValue}>{formatPercent(campaign.clickRate)}</span>
                  <span className={styles.statLabel}>кликнули</span>
                </div>
                <div className={styles.campaignStat}>
                  <span className={styles.statValue}>{formatCurrency(campaign.revenue)}</span>
                  <span className={styles.statLabel}>выручка</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Сегменты аудитории */}
      <div className={styles.segments}>
        <h4>Сегменты аудитории</h4>
        <div className={styles.segmentsList}>
          {data.segmentStats.map((segment, index) => (
            <div key={index} className={styles.segmentItem}>
              <div className={styles.segmentInfo}>
                <span className={styles.segmentName}>{segment.name}</span>
                <span className={styles.segmentSize}>{formatNumber(segment.subscribers)}</span>
              </div>
              <div className={styles.segmentMetrics}>
                <span className={styles.segmentOpenRate}>{formatPercent(segment.openRate)}</span>
                <span 
                  className={styles.segmentGrowth}
                  style={{ color: segment.growth > 0 ? '#22c55e' : '#ef4444' }}
                >
                  {segment.growth > 0 ? '+' : ''}{formatPercent(segment.growth)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Запланированные кампании */}
      <div className={styles.upcomingCampaigns}>
        <h4>📅 Запланированные кампании</h4>
        <div className={styles.upcomingList}>
          {data.upcomingCampaigns.slice(0, 2).map((campaign, index) => (
            <div key={index} className={styles.upcomingItem}>
              <div className={styles.upcomingInfo}>
                <span className={styles.upcomingName}>{campaign.name}</span>
                <span className={styles.upcomingDate}>{campaign.scheduledDate}</span>
              </div>
              <div className={styles.upcomingRecipients}>
                {formatNumber(campaign.recipients)} получателей
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
            <span className={styles.recIcon}>🎯</span>
            <span>Создайте больше кампаний для VIP-сегмента - у них лучшая конверсия</span>
          </div>
          <div className={styles.recommendation}>
            <span className={styles.recIcon}>📈</span>
            <span>Поработайте с неактивными подписчиками - отправьте реактивационную кампанию</span>
          </div>
        </div>
      </div>
    </div>
  );
}