'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from './NeonButton';
import FuturisticCard from './FuturisticCard';
import AILoader from './AILoader';
import { analytics } from '../utils/analytics';
import styles from './PricingCalculator.module.css';

interface Service {
  id: string;
  name: string;
  duration: number;
  teamSize: number;
}

interface PricingData {
  basePrice: number;
  finalPrice: number;
  customPrice: number;
  discount: number;
  savings: number;
  breakdown: {
    team: any;
    fixedCosts: number;
    duration: number;
    multipliers: {
      region: number;
      industry: number;
      companySize: number;
      urgency: number;
    };
  };
  customizations: Array<{
    name: string;
    price: number;
  }>;
  estimatedROI: {
    investment: number;
    estimatedReturn: number;
    netProfit: number;
    roiPercent: number;
    paybackPeriod: number;
    confidenceLevel: number;
  };
}

export default function PricingCalculator() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [region, setRegion] = useState('moscow');
  const [industry, setIndustry] = useState('retail');
  const [companySize, setCompanySize] = useState('medium');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'asap'>('normal');
  const [customRequirements, setCustomRequirements] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    // Загрузка доступных услуг
    fetch('/api/pricing')
      .then(res => res.json())
      .then(data => {
        setServices(data.services);
        if (data.services.length > 0) {
          setSelectedService(data.services[0].id);
        }
      })
      .catch(err => console.error('Failed to load services:', err));
  }, []);

  const calculatePrice = async () => {
    if (!selectedService) {
      alert('Пожалуйста, выберите услугу');
      return;
    }

    setIsCalculating(true);
    analytics.trackEvent('pricing_calculator_used', {
      service: selectedService,
      region,
      industry,
      companySize
    });

    try {
      console.log('Sending pricing request:', {
        serviceType: selectedService,
        region,
        industry,
        companySize,
        urgency,
        customRequirements
      });

      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType: selectedService,
          region,
          industry,
          companySize,
          urgency,
          customRequirements
        })
      });

      const data = await response.json();
      console.log('Pricing API response:', data);
      
      if (data.success) {
        setPricingData(data.pricing);
        setShowBreakdown(false);
        
        // Отправка уведомления для больших сделок
        if (data.pricing.customPrice > 5000000) {
          await fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `💰 Большой расчет цены!
              
Услуга: ${services.find(s => s.id === selectedService)?.name}
Компания: ${companySize} (${industry})
Регион: ${region}
Цена: ${data.pricing.customPrice.toLocaleString('ru-RU')} ₽
ROI: ${data.pricing.estimatedROI.roiPercent}%`
            })
          });
        }
      }
    } catch (error) {
      console.error('Pricing calculation error:', error);
      analytics.trackError(error as Error, 'pricing_calculator');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  const toggleRequirement = (req: string) => {
    setCustomRequirements(prev => 
      prev.includes(req) 
        ? prev.filter(r => r !== req)
        : [...prev, req]
    );
  };

  return (
    <div className={styles.calculator}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>💰</span>
          Калькулятор стоимости услуг
        </h2>
        <p className={styles.subtitle}>
          Автоматический расчет с учетом рыночных ставок и вашей специфики
        </p>
      </motion.div>

      <div className={styles.content}>
        <div className={styles.inputSection}>
          <FuturisticCard variant="glass" glowColor="blue">
            <h3>Параметры расчета</h3>
            
            <div className={styles.field}>
              <label>Выберите услугу</label>
              <select
                className={styles.select}
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.duration} мес.)
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Регион</label>
                <select
                  className={styles.select}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="moscow">Москва</option>
                  <option value="spb">Санкт-Петербург</option>
                  <option value="regions">Регионы</option>
                  <option value="remote">Удаленно</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Отрасль</label>
                <select
                  className={styles.select}
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="finance">Финансы</option>
                  <option value="retail">Ритейл</option>
                  <option value="manufacturing">Производство</option>
                  <option value="tech">IT/Tech</option>
                  <option value="healthcare">Здравоохранение</option>
                  <option value="education">Образование</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Размер компании</label>
                <select
                  className={styles.select}
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                >
                  <option value="small">Малая (&lt; 50)</option>
                  <option value="medium">Средняя (50-250)</option>
                  <option value="large">Крупная (250-1000)</option>
                  <option value="enterprise">Корпорация (&gt; 1000)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Срочность</label>
                <select
                  className={styles.select}
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                >
                  <option value="normal">Стандартная</option>
                  <option value="urgent">Срочно (+25%)</option>
                  <option value="asap">ASAP (+50%)</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Дополнительные требования</label>
              <div className={styles.requirements}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={customRequirements.includes('extra_support')}
                    onChange={() => toggleRequirement('extra_support')}
                  />
                  <span>Расширенная поддержка 24/7</span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={customRequirements.includes('faster_delivery')}
                    onChange={() => toggleRequirement('faster_delivery')}
                  />
                  <span>Ускоренная поставка</span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={customRequirements.includes('additional_integrations')}
                    onChange={() => toggleRequirement('additional_integrations')}
                  />
                  <span>Дополнительные интеграции</span>
                </label>
              </div>
            </div>

            <NeonButton
              variant="primary"
              size="large"
              fullWidth
              pulse
              onClick={calculatePrice}
              disabled={isCalculating || !selectedService}
            >
              {isCalculating ? 'Расчет...' : 'Рассчитать стоимость'}
            </NeonButton>
          </FuturisticCard>
        </div>

        <AnimatePresence mode="wait">
          {isCalculating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.loadingSection}
            >
              <AILoader
                variant="quantum"
                size="large"
                text="Анализируем рыночные ставки..."
              />
            </motion.div>
          )}

          {pricingData && !isCalculating && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className={styles.resultsSection}
            >
              <FuturisticCard variant="neon" glowColor="green">
                <div className={styles.priceHeader}>
                  <h3>Стоимость проекта</h3>
                  <div className={styles.priceMain}>
                    <span className={styles.priceValue}>
                      {formatPrice(pricingData.customPrice)}
                    </span>
                    {pricingData.discount > 0 && (
                      <span className={styles.discount}>
                        Скидка {pricingData.discount}%
                      </span>
                    )}
                  </div>
                  <p className={styles.savings}>
                    Экономия vs найм команды: {formatPrice(pricingData.savings)}
                  </p>
                </div>

                <div className={styles.priceDetails}>
                  <button
                    className={styles.toggleBreakdown}
                    onClick={() => setShowBreakdown(!showBreakdown)}
                  >
                    {showBreakdown ? 'Скрыть детали' : 'Показать детали'}
                  </button>

                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={styles.breakdown}
                      >
                        <h4>Состав команды</h4>
                        <div className={styles.teamBreakdown}>
                          {Object.entries(pricingData.breakdown.team).map(([role, data]: [string, any]) => (
                            <div key={role} className={styles.teamMember}>
                              <span className={styles.role}>{role}</span>
                              <span className={styles.fte}>{data.fte} FTE</span>
                              <span className={styles.cost}>
                                {formatPrice(data.totalCost)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <h4>Множители</h4>
                        <div className={styles.multipliers}>
                          <div className={styles.multiplier}>
                            <span>Регион</span>
                            <span>x{pricingData.breakdown.multipliers.region}</span>
                          </div>
                          <div className={styles.multiplier}>
                            <span>Отрасль</span>
                            <span>x{pricingData.breakdown.multipliers.industry}</span>
                          </div>
                          <div className={styles.multiplier}>
                            <span>Размер компании</span>
                            <span>x{pricingData.breakdown.multipliers.companySize}</span>
                          </div>
                          {pricingData.breakdown.multipliers.urgency > 1 && (
                            <div className={styles.multiplier}>
                              <span>Срочность</span>
                              <span>x{pricingData.breakdown.multipliers.urgency}</span>
                            </div>
                          )}
                        </div>

                        {pricingData.customizations.length > 0 && (
                          <>
                            <h4>Дополнительные услуги</h4>
                            <div className={styles.customizations}>
                              {pricingData.customizations.map((custom, index) => (
                                <div key={index} className={styles.customization}>
                                  <span>{custom.name}</span>
                                  <span>{formatPrice(custom.price)}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FuturisticCard>

              <FuturisticCard variant="holographic" glowColor="purple">
                <h3>Прогноз ROI</h3>
                <div className={styles.roiMetrics}>
                  <div className={styles.roiMetric}>
                    <span className={styles.roiValue}>
                      {pricingData.estimatedROI.roiPercent}%
                    </span>
                    <span className={styles.roiLabel}>ROI</span>
                  </div>
                  <div className={styles.roiMetric}>
                    <span className={styles.roiValue}>
                      {pricingData.estimatedROI.paybackPeriod} мес.
                    </span>
                    <span className={styles.roiLabel}>Окупаемость</span>
                  </div>
                  <div className={styles.roiMetric}>
                    <span className={styles.roiValue}>
                      {formatPrice(pricingData.estimatedROI.netProfit)}
                    </span>
                    <span className={styles.roiLabel}>Чистая прибыль</span>
                  </div>
                </div>
                <div className={styles.confidenceBar}>
                  <div 
                    className={styles.confidenceProgress}
                    style={{ width: `${pricingData.estimatedROI.confidenceLevel}%` }}
                  />
                  <span className={styles.confidenceText}>
                    Уверенность прогноза: {pricingData.estimatedROI.confidenceLevel}%
                  </span>
                </div>
              </FuturisticCard>

              <div className={styles.actions}>
                <NeonButton
                  variant="accent"
                  size="large"
                  pulse
                  onClick={() => {
                    analytics.trackEvent('pricing_proposal_requested', {
                      service: selectedService,
                      price: pricingData.customPrice
                    });
                    // Здесь будет генерация КП
                    alert('Функция генерации КП будет доступна в следующей версии');
                  }}
                >
                  Получить коммерческое предложение
                </NeonButton>
                <NeonButton
                  variant="secondary"
                  size="large"
                  onClick={() => {
                    analytics.trackEvent('pricing_consultation_requested', {
                      service: selectedService,
                      price: pricingData.customPrice
                    });
                    // Переход к форме контакта
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }}
                >
                  Обсудить с экспертом
                </NeonButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}