'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from './PricingCalculator.module.css';
import { createX402Client } from '../../utils/x402Client';
import { X402_CONFIG } from '../../lib/x402Config';

// Динамический импорт WalletConnector (только на клиенте)
const WalletConnector = dynamic(() => import('./WalletConnector'), {
  ssr: false,
  loading: () => <div>Загрузка...</div>
});

export default function PricingCalculator() {
  // Состояния для новой экономической модели
  const [agentUsage, setAgentUsage] = useState(null);
  const [agentCost, setAgentCost] = useState(0);
  const [userBalance, setUserBalance] = useState(1000); // Будет загружаться из API
  const [transactionHistory, setTransactionHistory] = useState([]); // Будет загружаться из API
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Состояния для x402 интеграции
  const [wallet, setWallet] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'idle', 'processing', 'success', 'error'
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [x402Client, setX402Client] = useState(null);
  const [selectedChain, setSelectedChain] = useState(X402_CONFIG.defaultChain);
  const [selectedToken, setSelectedToken] = useState(X402_CONFIG.defaultToken);

  // Инициализация x402 клиента
  useEffect(() => {
    const client = createX402Client();
    setX402Client(client);
  }, []);

  // Получение данных о потреблении агентов
  const fetchAgentUsageData = useCallback(async () => {
    try {
      // TODO: Заменить на реальный API эндпоинт
      const response = await fetch('/api/agent/usage');
      if (response.ok) {
        const data = await response.json();
        setAgentUsage(data);
      } else {
        // Fallback на mock данные
        const mockUsageData = {
          tasksCompleted: 150,
          dataProcessed: 250,
          activeTime: 10,
        };
        setAgentUsage(mockUsageData);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных о потреблении:', error);
      // Используем mock данные при ошибке
      const mockUsageData = {
        tasksCompleted: 150,
        dataProcessed: 250,
        activeTime: 10,
      };
      setAgentUsage(mockUsageData);
    }
  }, []);

  // Получение истории транзакций
  const fetchTransactionHistory = useCallback(async () => {
    try {
      // TODO: Заменить на реальный API эндпоинт
      const response = await fetch('/api/transactions/history');
      if (response.ok) {
        const data = await response.json();
        setTransactionHistory(data);
      } else {
        // Fallback на mock данные
        const mockTransactionHistory = [
          { id: 1, date: '2023-10-26', description: 'Пополнение баланса', amount: 500 },
          { id: 2, date: '2023-10-25', description: 'Оплата услуг агента', amount: -50 },
        ];
        setTransactionHistory(mockTransactionHistory);
      }
    } catch (error) {
      console.error('Ошибка загрузки истории транзакций:', error);
      const mockTransactionHistory = [
        { id: 1, date: '2023-10-26', description: 'Пополнение баланса', amount: 500 },
        { id: 2, date: '2023-10-25', description: 'Оплата услуг агента', amount: -50 },
      ];
      setTransactionHistory(mockTransactionHistory);
    }
  }, []);

  // Получение баланса пользователя
  const fetchUserBalance = useCallback(async () => {
    try {
      // TODO: Заменить на реальный API эндпоинт
      const response = await fetch('/api/balance/get');
      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance);
      }
    } catch (error) {
      console.error('Ошибка загрузки баланса:', error);
    }
  }, []);

  // Расчет стоимости на основе потребления агентов
  const calculateAgentServiceCost = useCallback(() => {
    if (!agentUsage) return 0;
    // Примерная логика расчета
    const cost = agentUsage.tasksCompleted * 0.1 + agentUsage.dataProcessed * 0.5 + agentUsage.activeTime * 1;
    return cost;
  }, [agentUsage]);

  useEffect(() => {
    fetchAgentUsageData();
    fetchTransactionHistory();
    fetchUserBalance();
  }, [fetchAgentUsageData, fetchTransactionHistory, fetchUserBalance]);

  useEffect(() => {
    setAgentCost(calculateAgentServiceCost());
  }, [agentUsage, calculateAgentServiceCost]);

  // Форматирование цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Обработчик подключения кошелька
  const handleWalletConnected = useCallback((walletInfo) => {
    setWallet(walletInfo);
    console.log('Кошелек подключен:', walletInfo);
  }, []);

  // Обработчик отключения кошелька
  const handleWalletDisconnected = useCallback(() => {
    setWallet(null);
    console.log('Кошелек отключен');
  }, []);

  // Обработчик пополнения баланса через x402
  const handleTopUpWithX402 = async (amount) => {
    if (!wallet) {
      alert('Пожалуйста, подключите кошелек');
      return;
    }

    if (!x402Client) {
      alert('x402 клиент не инициализирован');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);
    setPaymentStatus('processing');

    try {
      // 1. Инициация платежа
      console.log('Инициация платежа на сумму:', amount);
      const paymentDetails = await x402Client.initiatePayment(
        amount,
        selectedChain,
        selectedToken
      );

      console.log('Детали платежа:', paymentDetails);

      // 2. Здесь должна быть логика подписания через Web3 кошелек
      // TODO: Реализовать подписание транзакции
      // const signedPayload = await signPaymentWithWallet(paymentDetails, wallet);

      // 3. Верификация (временно пропускаем для демонстрации)
      // const verifyResult = await x402Client.verifyPayment(signedPayload);

      // 4. Settlement (временно пропускаем)
      // const settlementResult = await x402Client.settlePayment(signedPayload);

      // 5. Обновление баланса через API
      // TODO: Вызвать API для обновления баланса
      // await updateBalanceOnServer(amount);

      // Временное решение: обновляем баланс локально
      setUserBalance(prev => prev + amount);
      
      setPaymentStatus('success');
      alert(`Баланс успешно пополнен на $${amount}!`);
      
      // Обновляем историю транзакций
      fetchTransactionHistory();
      
    } catch (error) {
      console.error('Ошибка при пополнении баланса:', error);
      setPaymentError(error.message);
      setPaymentStatus('error');
      alert(`Ошибка: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setShowContactForm(false);
    }
  };

  // Обработчик отправки формы пополнения
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = parseFloat(formData.get('amount'));
    
    // Валидация суммы
    if (isNaN(amount) || amount < X402_CONFIG.limits.minAmount) {
      alert(`Минимальная сумма: $${X402_CONFIG.limits.minAmount}`);
      return;
    }
    
    if (amount > X402_CONFIG.limits.maxAmount) {
      alert(`Максимальная сумма: $${X402_CONFIG.limits.maxAmount}`);
      return;
    }

    if (wallet) {
      // Используем x402 если кошелек подключен
      handleTopUpWithX402(amount);
    } else {
      // Fallback на старый метод
      console.log('Пополнение баланса через форму заявки:', amount);
      alert('Запрос на пополнение баланса отправлен. Подключите кошелек для мгновенного пополнения.');
      setShowContactForm(false);
    }
  };

  // Обработчик открытия формы пополнения
  const handleTopUp = () => {
    setShowContactForm(true);
    setPaymentStatus('idle');
    setPaymentError(null);
  };

  return (
    <section className="pricing-section" id="pricing">
      <header className="section-header">
        <h2>Управление агентами и балансом</h2>
        <p>Оплачивайте услуги ИИ-агентов по мере использования через протокол x402.</p>
        
        {/* Компонент подключения кошелька */}
        <div className="wallet-section">
          <WalletConnector 
            onWalletConnected={handleWalletConnected}
            onWalletDisconnected={handleWalletDisconnected}
          />
        </div>
      </header>

      <div className="pricing-container">
        {/* Отображение баланса */}
        <div className="user-balance-display glass-card">
          <h3>Мой баланс</h3>
          <div className="balance-amount">{formatPrice(userBalance)}</div>
          <button className="top-up-button" onClick={handleTopUp}>
            Пополнить баланс
          </button>
        </div>

        {/* Информация о потреблении */}
        <div className="agent-usage-info glass-card">
          <h3>Текущее потребление</h3>
          {agentUsage ? (
            <div className="usage-details">
              <p>Задач выполнено: {agentUsage.tasksCompleted}</p>
              <p>Данных обработано: {agentUsage.dataProcessed} ГБ</p>
              <p>Время работы: {agentUsage.activeTime} ч</p>
              <div className="usage-cost">
                <span>Текущая стоимость:</span>
                <span>{formatPrice(agentCost)}</span>
              </div>
            </div>
          ) : (
            <p>Загрузка данных о потреблении...</p>
          )}
        </div>

        {/* История транзакций */}
        <div className="transaction-history glass-card">
          <h3>История операций</h3>
          <div className="transaction-history-table">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Описание</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>{tx.description}</td>
                    <td>{formatPrice(tx.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Модальное окно для пополнения баланса */}
      {showContactForm && (
        <div className="contact-form-modal" onClick={() => setShowContactForm(false)}>
          <div className="form-content" onClick={(e) => e.stopPropagation()}>
            <h2>Пополнение баланса</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="amount">Сумма пополнения (USD)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  min={X402_CONFIG.limits.minAmount}
                  max={X402_CONFIG.limits.maxAmount}
                  step="0.01"
                  placeholder="100"
                />
                <small>Мин: ${X402_CONFIG.limits.minAmount}, Макс: ${X402_CONFIG.limits.maxAmount}</small>
              </div>

              {wallet && (
                <div className="payment-info">
                  <p>✅ Кошелек подключен: {wallet.address.substring(0, 6)}...{wallet.address.substring(38)}</p>
                  <p>🌐 Сеть: {selectedChain}</p>
                  <p>💰 Токен: {selectedToken.toUpperCase()}</p>
                </div>
              )}

              {!wallet && (
                <div className="payment-warning">
                  ⚠️ Подключите кошелек для мгновенного пополнения через x402
                </div>
              )}

              {paymentStatus === 'processing' && (
                <div className="payment-processing">
                  ⏳ Обработка платежа...
                </div>
              )}

              {paymentError && (
                <div className="payment-error">
                  ❌ {paymentError}
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Обработка...' : wallet ? 'Пополнить через x402' : 'Отправить заявку'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setShowContactForm(false)}
                  disabled={isProcessing}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
