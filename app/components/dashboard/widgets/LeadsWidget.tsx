'use client';

import React, { useState, useEffect } from 'react';
import type { DashboardFilters as DashboardFiltersType, UserRole } from '@/types/dashboard';
import styles from './LeadsWidget.module.css';

interface LeadsWidgetProps {
  filters: DashboardFiltersType;
  userRole: UserRole;
  refreshInterval: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed-won' | 'closed-lost';
  value: number;
  probability: number;
  createdAt: string;
  lastActivity: string;
}

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
  conversion: number;
}

interface LeadsData {
  totalLeads: number;
  leadsGrowth: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgDealValue: number;
  totalPipeline: number;
  recentLeads: Lead[];
  conversionFunnel: ConversionFunnel[];
  leadSources: Array<{
    source: string;
    count: number;
    conversion: number;
    quality: 'high' | 'medium' | 'low';
  }>;
  topDeals: Lead[];
  urgentFollowUps: Lead[];
}

export default function LeadsWidget({ 
  filters, 
  userRole, 
  refreshInterval 
}: LeadsWidgetProps) {
  const [data, setData] = useState<LeadsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeadsData = () => {
      setLoading(true);
      
      setTimeout(() => {
        try {
          const leads: Lead[] = [
            {
              id: '1',
              name: 'ООО "Альфа Технологии"',
              email: 'director@alfa-tech.ru',
              phone: '+7 (495) 123-45-67',
              source: 'Яндекс.Директ',
              status: 'qualified',
              value: 450000,
              probability: 75,
              createdAt: '2 часа назад',
              lastActivity: '30 мин назад'
            },
            {
              id: '2',
              name: 'ИП Петров А.С.',
              email: 'petrov@example.com',
              phone: '+7 (903) 234-56-78',
              source: 'Органический поиск',
              status: 'proposal',
              value: 180000,
              probability: 60,
              createdAt: '5 часов назад',
              lastActivity: '2 часа назад'
            },
            {
              id: '3',
              name: 'ТОО "БизнесРешения"',
              email: 'info@bizresheniya.kz',
              phone: '+7 (727) 345-67-89',
              source: 'Социальные сети',
              status: 'contacted',
              value: 320000,
              probability: 40,
              createdAt: '1 день назад',
              lastActivity: '4 часа назад'
            },
            {
              id: '4',
              name: 'ООО "Новые Горизонты"',
              email: 'sales@novgor.ru',
              phone: '+7 (812) 456-78-90',
              source: 'Холодные звонки',
              status: 'new',
              value: 750000,
              probability: 20,
              createdAt: '2 дня назад',
              lastActivity: '1 день назад'
            }
          ];

          const mockData: LeadsData = {
            totalLeads: 127,
            leadsGrowth: 18.5,
            qualifiedLeads: 34,
            conversionRate: 26.8,
            avgDealValue: 385000,
            totalPipeline: 2850000,
            recentLeads: leads,
            conversionFunnel: [
              { stage: 'Лиды', count: 127, percentage: 100, conversion: 100 },
              { stage: 'Контакт установлен', count: 89, percentage: 70, conversion: 70 },
              { stage: 'Квалифицированы', count: 56, percentage: 44, conversion: 63 },
              { stage: 'Предложение', count: 23, percentage: 18, conversion: 41 },
              { stage: 'Сделка закрыта', count: 12, percentage: 9, conversion: 52 }
            ],
            leadSources: [
              { source: 'Яндекс.Директ', count: 42, conversion: 31.5, quality: 'high' },
              { source: 'Органический поиск', count: 38, conversion: 28.2, quality: 'high' },
              { source: 'Социальные сети', count: 24, conversion: 22.1, quality: 'medium' },
              { source: 'Email-рассылки', count: 15, conversion: 18.7, quality: 'medium' },
              { source: 'Холодные звонки', count: 8, conversion: 12.5, quality: 'low' }
            ],
            topDeals: leads.filter(lead => lead.value > 300000).sort((a, b) => b.value - a.value),
            urgentFollowUps: leads.filter(lead => 
              lead.status === 'contacted' || 
              lead.status === 'qualified' || 
              lead.status === 'proposal'
            )
          };

          setData(mockData);
          setError(null);
        } catch (err) {
          setError('Ошибка загрузки данных по лидам');
        } finally {
          setLoading(false);
        }
      }, 600);
    };

    loadLeadsData();

    if (filters.liveMode) {
      const interval = setInterval(loadLeadsData, refreshInterval);
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
      case 'new': return '#6b7280';
      case 'contacted': return '#3b82f6';
      case 'qualified': return '#f59e0b';
      case 'proposal': return '#8b5cf6';
      case 'closed-won': return '#22c55e';
      case 'closed-lost': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'contacted': return 'Контакт';
      case 'qualified': return 'Квалифицирован';
      case 'proposal': return 'Предложение';
      case 'closed-won': return 'Закрыт';
      case 'closed-lost': return 'Потерян';
      default: return 'Неизвестно';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'high': return 'Высокое';
      case 'medium': return 'Среднее';
      case 'low': return 'Низкое';
      default: return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className={styles.widget}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Загрузка данных по лидам...</span>
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
        <h3>🎯 Лиды и конверсии</h3>
        <div className={styles.mainMetrics}>
          <div className={styles.mainMetric}>
            <span className={styles.metricValue}>{data.totalLeads}</span>
            <span className={styles.metricLabel}>Всего лидов</span>
            <span className={styles.metricGrowth}>
              +{formatPercent(data.leadsGrowth)}
            </span>
          </div>
          <div className={styles.mainMetric}>
            <span className={styles.metricValue}>{formatCurrency(data.totalPipeline)}</span>
            <span className={styles.metricLabel}>В воронке</span>
            <span className={styles.metricGrowth}>
              {data.qualifiedLeads} квалифицированных
            </span>
          </div>
        </div>
      </div>

      {/* Ключевые показатели */}
      <div className={styles.keyMetrics}>
        <div className={styles.keyMetric}>
          <span className={styles.keyIcon}>📊</span>
          <div className={styles.keyContent}>
            <span className={styles.keyValue}>{formatPercent(data.conversionRate)}</span>
            <span className={styles.keyLabel}>Конверсия</span>
          </div>
        </div>
        <div className={styles.keyMetric}>
          <span className={styles.keyIcon}>💰</span>
          <div className={styles.keyContent}>
            <span className={styles.keyValue}>{formatCurrency(data.avgDealValue)}</span>
            <span className={styles.keyLabel}>Средняя сделка</span>
          </div>
        </div>
      </div>

      {/* Воронка конверсий */}
      <div className={styles.conversionFunnel}>
        <h4>Воронка продаж</h4>
        <div className={styles.funnelStages}>
          {data.conversionFunnel.map((stage, index) => (
            <div key={index} className={styles.funnelStage}>
              <div className={styles.stageInfo}>
                <span className={styles.stageName}>{stage.stage}</span>
                <span className={styles.stageCount}>{stage.count}</span>
              </div>
              <div className={styles.stageBar}>
                <div 
                  className={styles.stageProgress}
                  style={{ width: `${stage.percentage}%` }}
                ></div>
              </div>
              <div className={styles.stageStats}>
                <span className={styles.stagePercentage}>{formatPercent(stage.percentage)}</span>
                {index > 0 && (
                  <span className={styles.stageConversion}>
                    ↗ {formatPercent(stage.conversion)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Источники лидов */}
      <div className={styles.leadSources}>
        <h4>Источники лидов</h4>
        <div className={styles.sourcesList}>
          {data.leadSources.slice(0, 3).map((source, index) => (
            <div key={index} className={styles.sourceItem}>
              <div className={styles.sourceInfo}>
                <span className={styles.sourceName}>{source.source}</span>
                <span 
                  className={styles.sourceQuality}
                  style={{ color: getQualityColor(source.quality) }}
                >
                  {getQualityText(source.quality)} качество
                </span>
              </div>
              <div className={styles.sourceMetrics}>
                <span className={styles.sourceCount}>{source.count} лидов</span>
                <span className={styles.sourceConversion}>{formatPercent(source.conversion)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Топ сделки */}
      <div className={styles.topDeals}>
        <h4>🏆 Крупные сделки</h4>
        <div className={styles.dealsList}>
          {data.topDeals.slice(0, 2).map((deal) => (
            <div key={deal.id} className={styles.dealItem}>
              <div className={styles.dealHeader}>
                <div className={styles.dealInfo}>
                  <span className={styles.dealName}>{deal.name}</span>
                  <span 
                    className={styles.dealStatus}
                    style={{ color: getStatusColor(deal.status) }}
                  >
                    {getStatusText(deal.status)}
                  </span>
                </div>
                <div className={styles.dealValue}>
                  <span className={styles.dealAmount}>{formatCurrency(deal.value)}</span>
                  <span className={styles.dealProbability}>{deal.probability}%</span>
                </div>
              </div>
              <div className={styles.dealDetails}>
                <span className={styles.dealSource}>{deal.source}</span>
                <span className={styles.dealActivity}>{deal.lastActivity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Срочные задачи */}
      <div className={styles.urgentTasks}>
        <h4>⚡ Срочные задачи</h4>
        <div className={styles.tasksList}>
          {data.urgentFollowUps.slice(0, 3).map((task) => (
            <div key={task.id} className={styles.taskItem}>
              <div className={styles.taskInfo}>
                <span className={styles.taskName}>{task.name}</span>
                <span className={styles.taskAction}>
                  {task.status === 'contacted' ? 'Повторный звонок' :
                   task.status === 'qualified' ? 'Подготовить предложение' :
                   task.status === 'proposal' ? 'Согласовать условия' : 'Связаться'}
                </span>
              </div>
              <div className={styles.taskMeta}>
                <span className={styles.taskValue}>{formatCurrency(task.value)}</span>
                <span className={styles.taskTime}>{task.lastActivity}</span>
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
            <span>Сфокусируйтесь на Яндекс.Директ и органическом поиске - лучшая конверсия</span>
          </div>
          <div className={styles.recommendation}>
            <span className={styles.recIcon}>📞</span>
            <span>У вас 3 горячих лида требуют срочного контакта</span>
          </div>
        </div>
      </div>
    </div>
  );
}