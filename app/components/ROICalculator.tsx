'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { ROIFormData, ROIResults } from '@/types';
import './ROICalculator.css';

export default function ROICalculator(): JSX.Element {
  const [formData, setFormData] = useState<ROIFormData>({
    businessSize: 'small',
    industry: 'retail', 
    revenue: 1000000,
    budget: 200000
  });
  
  const [showResult, setShowResult] = useState<boolean>(false);
  const [results, setResults] = useState<ROIResults>({
    roi: 0,
    savings: 0,
    growth: 0,
    payback: 0
  });

  // Множители для расчета
  const sizeMultipliers: Record<ROIFormData['businessSize'], number> = {
    small: 3.2,
    medium: 4.5,
    large: 6.0
  };
  
  const industryMultipliers: Record<ROIFormData['industry'], number> = {
    retail: 1.2,
    services: 1.3,
    production: 1.1,
    it: 1.5,
    other: 1.0
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'revenue' || name === 'budget' ? Number(value) : value
    } as ROIFormData));
  };

  const calculateROI = async (): Promise<void> => {
    const { businessSize, industry, revenue, budget } = formData;
    
    // Расчеты на основе множителей
    const baseROI = sizeMultipliers[businessSize] * industryMultipliers[industry];
    const roi = Math.round(baseROI * 100);
    const savings = Math.round(revenue * 0.085);
    const growth = Math.round(35 * industryMultipliers[industry]);
    const monthlyBenefit = savings + (revenue * growth / 100 / 12);
    const payback = budget > 0 ? (budget / monthlyBenefit).toFixed(1) : 0;
    
    const calculatedResults = {
      roi,
      savings,
      growth,
      payback
    };
    
    setResults(calculatedResults);
    setShowResult(true);

    // Отправляем событие в аналитику
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'roi_calculated', {
        business_size: businessSize,
        industry: industry,
        roi_result: roi
      });
    }
    
    // Отправляем уведомление в Telegram
    try {
      await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'roi_calculation',
          data: {
            revenue: newMonthlyRevenue,
            costs: newMonthlyCosts,
            roi: newRoi,
            timestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
          }
        })
      }).catch(console.error);
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
    }
  };

  const requestConsultation = () => {
    // Открываем AI чат с предзаполненными данными
    const aiChat = document.querySelector('.ai-float-button');
    if (aiChat) aiChat.click();
    
    // Передаем контекст в чат
    setTimeout(() => {
      const input = document.querySelector('.ai-input-area input');
      if (input) {
        input.value = `Я рассчитал ROI: ${results.roi}%. Бизнес: ${formData.businessSize}, отрасль: ${formData.industry}. Хочу узнать подробности внедрения.`;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 500);
  };

  return (
    <section className="roi-calculator" id="calculator">
      <div className="calculator-container">
        <div className="section-header">
          <h2>Калькулятор <span className="gradient-text">ROI</span></h2>
          <p>Рассчитайте выгоду от цифровизации за 2 минуты</p>
        </div>
        
        <div className="calc-form">
          <div className="form-group">
            <label>Размер вашего бизнеса</label>
            <select 
              name="businessSize" 
              value={formData.businessSize}
              onChange={handleInputChange}
            >
              <option value="small">Малый (до 10 сотрудников)</option>
              <option value="medium">Средний (10-100 сотрудников)</option>
              <option value="large">Крупный (100+ сотрудников)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Отрасль</label>
            <select 
              name="industry" 
              value={formData.industry}
              onChange={handleInputChange}
            >
              <option value="retail">Розничная торговля</option>
              <option value="services">Услуги</option>
              <option value="production">Производство</option>
              <option value="it">IT и технологии</option>
              <option value="other">Другое</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Текущая выручка в месяц (₽)</label>
            <input 
              type="number" 
              name="revenue"
              value={formData.revenue}
              onChange={handleInputChange}
              placeholder="Например: 1000000"
            />
          </div>
          
          <div className="form-group">
            <label>Бюджет на цифровизацию (₽)</label>
            <input 
              type="number" 
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="Например: 200000"
            />
          </div>
          
          <button 
            type="button" 
            className="btn-primary"
            onClick={calculateROI}
          >
            🎯 Рассчитать выгоду
          </button>
        </div>
        
        {showResult && (
          <div className="calc-result show">
            <div className="result-header">
              <h3>🎉 Ваш прогноз результатов</h3>
              <div className="result-badge">
                {results.roi > 300 ? 'Отличный результат!' : 'Хороший результат!'}
              </div>
            </div>
            
            <div className="result-grid">
              <div className="result-card">
                <div className="result-icon">📈</div>
                <div className="result-content">
                  <div className="result-value">{results.roi}%</div>
                  <div className="result-label">ROI через 6 месяцев</div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon">💰</div>
                <div className="result-content">
                  <div className="result-value">{results.savings.toLocaleString('ru-RU')}₽</div>
                  <div className="result-label">Экономия в месяц</div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon">🚀</div>
                <div className="result-content">
                  <div className="result-value">+{results.growth}%</div>
                  <div className="result-label">Рост выручки</div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-icon">⏱</div>
                <div className="result-content">
                  <div className="result-value">{results.payback} мес</div>
                  <div className="result-label">Окупаемость</div>
                </div>
              </div>
            </div>
            
            <div className="result-actions">
              <button 
                className="btn-primary"
                onClick={requestConsultation}
              >
                💬 Получить детальный расчет
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => {
                  // Сохраняем результаты в localStorage
                  localStorage.setItem('roiCalculation', JSON.stringify({
                    ...formData,
                    results,
                    date: new Date().toISOString()
                  }));
                  alert('Расчет сохранен! Вы можете вернуться к нему позже.');
                }}
              >
                💾 Сохранить расчет
              </button>
            </div>
            
            <div className="result-disclaimer">
              <p>* Расчет основан на средних показателях по отрасли. Точный результат зависит от специфики вашего бизнеса.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}