'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import dynamic from 'next/dynamic';

// Мемоизированный компонент для отображения результата
const ResultCard = memo(({ label, value, isHighlight }) => (
  <div className={`result-card ${isHighlight ? 'highlight' : ''}`}>
    <h4>{label}</h4>
    <p className="value">{value}</p>
  </div>
));

ResultCard.displayName = 'ResultCard';

// Мемоизированный компонент для поля ввода
const InputField = memo(({ label, value, onChange, min = 0, max = 1000000, step = 1000 }) => (
  <div className="input-group">
    <label>{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="slider"
    />
    <span className="value">{value.toLocaleString('ru-RU')} ₽</span>
  </div>
));

InputField.displayName = 'InputField';

// Основной компонент калькулятора
const OptimizedROICalculator = memo(() => {
  const [revenue, setRevenue] = useState(500000);
  const [costs, setCosts] = useState(200000);
  const [employees, setEmployees] = useState(10);
  const [showDetailed, setShowDetailed] = useState(false);

  // Мемоизированные вычисления
  const calculations = useMemo(() => {
    const currentProfit = revenue - costs;
    const automationSavings = costs * 0.3;
    const efficiencyGain = revenue * 0.25;
    const newProfit = currentProfit + automationSavings + efficiencyGain;
    const roi = ((newProfit - currentProfit) / costs * 100).toFixed(1);
    const paybackPeriod = (150000 / (automationSavings + efficiencyGain) * 12).toFixed(1);
    
    return {
      currentProfit,
      automationSavings,
      efficiencyGain,
      newProfit,
      roi,
      paybackPeriod
    };
  }, [revenue, costs]);

  // Мемоизированные обработчики
  const handleRevenueChange = useCallback((e) => {
    setRevenue(Number(e.target.value));
  }, []);

  const handleCostsChange = useCallback((e) => {
    setCosts(Number(e.target.value));
  }, []);

  const handleEmployeesChange = useCallback((e) => {
    setEmployees(Number(e.target.value));
  }, []);

  const toggleDetailed = useCallback(() => {
    setShowDetailed(prev => !prev);
  }, []);

  return (
    <div className="roi-calculator">
      <h2 className="title">Калькулятор ROI</h2>
      <p className="subtitle">Рассчитайте экономическую выгоду от внедрения NeuroExpert</p>
      
      <div className="inputs-section">
        <InputField
          label="Месячная выручка"
          value={revenue}
          onChange={handleRevenueChange}
          max={5000000}
          step={10000}
        />
        
        <InputField
          label="Месячные расходы"
          value={costs}
          onChange={handleCostsChange}
          max={2000000}
          step={5000}
        />
        
        <InputField
          label="Количество сотрудников"
          value={employees}
          onChange={handleEmployeesChange}
          min={1}
          max={100}
          step={1}
        />
      </div>

      <div className="results-section">
        <ResultCard
          label="ROI за первый год"
          value={`${calculations.roi}%`}
          isHighlight={true}
        />
        
        <ResultCard
          label="Экономия на автоматизации"
          value={`${calculations.automationSavings.toLocaleString('ru-RU')} ₽/мес`}
        />
        
        <ResultCard
          label="Рост эффективности"
          value={`${calculations.efficiencyGain.toLocaleString('ru-RU')} ₽/мес`}
        />
        
        <ResultCard
          label="Срок окупаемости"
          value={`${calculations.paybackPeriod} мес`}
        />
      </div>

      <button onClick={toggleDetailed} className="toggle-button">
        {showDetailed ? 'Скрыть детали' : 'Показать детали'}
      </button>

      {showDetailed && (
        <div className="detailed-section fade-in">
          <h3>Детальная разбивка</h3>
          <ul>
            <li>Текущая прибыль: {calculations.currentProfit.toLocaleString('ru-RU')} ₽</li>
            <li>Прибыль после внедрения: {calculations.newProfit.toLocaleString('ru-RU')} ₽</li>
            <li>Экономия времени: {(employees * 2).toFixed(0)} часов/день</li>
            <li>Снижение ошибок: 85%</li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .roi-calculator {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          text-align: center;
          color: #94a3b8;
          margin-bottom: 2rem;
        }

        .inputs-section {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-weight: 600;
          color: #cbd5e1;
        }

        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #334155;
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          cursor: pointer;
        }

        .value {
          font-size: 1.2rem;
          font-weight: 600;
          color: #60a5fa;
        }

        .results-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .result-card {
          background: rgba(51, 65, 85, 0.3);
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .result-card:hover {
          transform: translateY(-4px);
        }

        .result-card.highlight {
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(167, 139, 250, 0.2));
          border: 1px solid rgba(96, 165, 250, 0.3);
        }

        .result-card h4 {
          font-size: 0.9rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
        }

        .result-card .value {
          font-size: 2rem;
          background: linear-gradient(135deg, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .toggle-button {
          display: block;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          background: rgba(96, 165, 250, 0.1);
          border: 1px solid rgba(96, 165, 250, 0.3);
          border-radius: 12px;
          color: #60a5fa;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-button:hover {
          background: rgba(96, 165, 250, 0.2);
        }

        .detailed-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(51, 65, 85, 0.2);
          border-radius: 16px;
        }

        .detailed-section h3 {
          margin-bottom: 1rem;
          color: #e2e8f0;
        }

        .detailed-section ul {
          list-style: none;
          space-y: 0.5rem;
        }

        .detailed-section li {
          padding: 0.5rem 0;
          color: #cbd5e1;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .roi-calculator {
            padding: 1.5rem;
          }

          .title {
            font-size: 2rem;
          }

          .results-section {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
});

OptimizedROICalculator.displayName = 'OptimizedROICalculator';

export default OptimizedROICalculator;