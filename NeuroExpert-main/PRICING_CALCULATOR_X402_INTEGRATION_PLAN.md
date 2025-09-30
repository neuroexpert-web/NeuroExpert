# План интеграции протокола x402 в PricingCalculator

**Дата:** 30 сентября 2025  
**Статус:** В разработке  
**Компонент:** `app/components/PricingCalculator.js`

## Текущее состояние

PricingCalculator.js уже содержит базовую структуру новой экономической модели:
- ✅ Отображение баланса пользователя
- ✅ Информация о потреблении агентов
- ✅ История транзакций
- ✅ Модальное окно для пополнения баланса

## Задачи для завершения интеграции x402

### Фаза 1: Подготовка инфраструктуры (Приоритет: Высокий)

#### 1.1. Создание утилит для x402
- [ ] Создать `utils/x402Client.js` с функциями:
  - `initiatePayment(amount, recipientAddress)` - инициация платежа
  - `verifyPayment(payload)` - верификация платежа
  - `getPaymentStatus(txHash)` - проверка статуса транзакции

#### 1.2. Создание API эндпоинтов
- [ ] `/api/payment/initiate` - инициация платежа через x402
- [ ] `/api/payment/verify` - верификация платежного payload
- [ ] `/api/balance/get` - получение текущего баланса
- [ ] `/api/balance/update` - обновление баланса после платежа
- [ ] `/api/transactions/history` - получение истории транзакций
- [ ] `/api/agent/usage` - получение данных о потреблении агентов

### Фаза 2: Интеграция x402 в компонент (Приоритет: Высокий)

#### 2.1. Обновление состояний компонента
- [ ] Добавить состояние `paymentStatus` для отслеживания процесса платежа
- [ ] Добавить состояние `walletConnected` для статуса кошелька
- [ ] Добавить состояние `paymentError` для обработки ошибок
- [ ] Добавить состояние `isProcessing` для индикации загрузки

#### 2.2. Реализация функций платежа
- [ ] `connectWallet()` - подключение криптокошелька пользователя
- [ ] `handleTopUpWithX402(amount)` - пополнение через x402
- [ ] `processPaymentResponse(response)` - обработка ответа платежа
- [ ] `updateBalanceAfterPayment(txHash)` - обновление баланса

#### 2.3. Улучшение UI для x402
- [ ] Добавить индикатор подключения кошелька
- [ ] Показывать статус транзакции (ожидание, обработка, успех, ошибка)
- [ ] Добавить отображение адреса кошелька
- [ ] Реализовать выбор сети (Base, Ethereum, и т.д.)
- [ ] Добавить выбор токена (USDC по умолчанию)

### Фаза 3: Расширенная функциональность (Приоритет: Средний)

#### 3.1. Автоматические платежи для агентов
- [ ] Создать компонент `AutoPaymentSettings`
- [ ] Реализовать логику автопополнения при низком балансе
- [ ] Добавить уведомления о необходимости пополнения

#### 3.2. Детализация потребления
- [ ] Разбить потребление по типам агентов
- [ ] Показать прогноз затрат на основе истории
- [ ] Добавить графики потребления

#### 3.3. Расширенная история транзакций
- [ ] Добавить фильтры по дате, типу, сумме
- [ ] Экспорт истории в CSV
- [ ] Показать статус onchain для каждой транзакции
- [ ] Добавить ссылки на blockchain explorer

### Фаза 4: Безопасность и оптимизация (Приоритет: Средний)

#### 4.1. Безопасность
- [ ] Валидация всех входных данных
- [ ] Защита от replay attacks
- [ ] Шифрование чувствительных данных
- [ ] Rate limiting для API запросов

#### 4.2. Оптимизация
- [ ] Кэширование данных о балансе
- [ ] Оптимизация запросов к блокчейну
- [ ] Debounce для обновления данных
- [ ] Lazy loading для истории транзакций

### Фаза 5: Тестирование (Приоритет: Высокий)

#### 5.1. Unit тесты
- [ ] Тесты для x402Client утилит
- [ ] Тесты для функций расчета стоимости
- [ ] Тесты для обработчиков платежей

#### 5.2. Integration тесты
- [ ] Тест полного цикла пополнения баланса
- [ ] Тест обработки ошибок платежа
- [ ] Тест обновления баланса после оплаты

#### 5.3. E2E тесты
- [ ] Тест подключения кошелька
- [ ] Тест пополнения баланса через x402
- [ ] Тест просмотра истории транзакций

## Структура файлов

```
NeuroExpert-main/
├── app/
│   ├── components/
│   │   ├── PricingCalculator.js (главный компонент)
│   │   ├── WalletConnector.js (новый - подключение кошелька)
│   │   ├── TransactionHistory.js (новый - детальная история)
│   │   ├── UsageChart.js (новый - графики потребления)
│   │   └── AutoPaymentSettings.js (новый - настройки автоплатежей)
│   ├── api/
│   │   ├── payment/
│   │   │   ├── initiate/route.js (новый)
│   │   │   └── verify/route.js (новый)
│   │   ├── balance/
│   │   │   ├── get/route.js (новый)
│   │   │   └── update/route.js (новый)
│   │   ├── transactions/
│   │   │   └── history/route.js (новый)
│   │   └── agent/
│   │       └── usage/route.js (новый)
├── utils/
│   ├── x402Client.js (новый - клиент для x402)
│   ├── blockchain.js (новый - утилиты для блокчейна)
│   └── payment.js (новый - утилиты для платежей)
└── lib/
    └── x402Config.js (новый - конфигурация x402)
```

## Примеры кода

### x402Client.js (базовая структура)

```javascript
import { ethers } from 'ethers';

export class X402Client {
  constructor(facilitatorUrl, recipientAddress) {
    this.facilitatorUrl = facilitatorUrl;
    this.recipientAddress = recipientAddress;
  }

  async initiatePayment(amount, chain = 'base', token = 'usdc') {
    const paymentDetails = {
      chain,
      token,
      to: this.recipientAddress,
      amount: ethers.utils.parseUnits(amount.toString(), 6), // USDC имеет 6 decimals
      deadline: Math.floor(Date.now() / 1000) + 3600 // 1 час
    };

    return paymentDetails;
  }

  async verifyPayment(payload) {
    const response = await fetch(`${this.facilitatorUrl}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload })
    });

    return response.json();
  }

  async settlePayment(payload) {
    const response = await fetch(`${this.facilitatorUrl}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload })
    });

    return response.json();
  }
}
```

### Обновленный handleTopUp

```javascript
const handleTopUpWithX402 = async (amount) => {
  setIsProcessing(true);
  setPaymentError(null);

  try {
    // 1. Проверка подключения кошелька
    if (!walletConnected) {
      await connectWallet();
    }

    // 2. Инициация платежа
    const paymentDetails = await x402Client.initiatePayment(amount);
    
    // 3. Подписание транзакции кошельком пользователя
    const signer = provider.getSigner();
    const signedPayload = await signer.signTransaction(paymentDetails);

    // 4. Верификация платежа
    const verifyResult = await x402Client.verifyPayment(signedPayload);
    
    if (!verifyResult.valid) {
      throw new Error('Платеж не прошел верификацию');
    }

    // 5. Проведение платежа
    const settlementResult = await x402Client.settlePayment(signedPayload);
    
    setPaymentStatus('success');
    
    // 6. Обновление баланса на фронтенде
    await updateBalanceAfterPayment(settlementResult.txHash);
    
    alert(`Баланс успешно пополнен! TxHash: ${settlementResult.txHash}`);
    
  } catch (error) {
    console.error('Ошибка при пополнении баланса:', error);
    setPaymentError(error.message);
    setPaymentStatus('error');
  } finally {
    setIsProcessing(false);
    setShowContactForm(false);
  }
};
```

## Конфигурация

### Переменные окружения (.env.local)

```env
# x402 Configuration
NEXT_PUBLIC_X402_FACILITATOR_URL=https://facilitator.coinbase.com
NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS=0x...
NEXT_PUBLIC_DEFAULT_CHAIN=base
NEXT_PUBLIC_DEFAULT_TOKEN=usdc

# API Configuration
NEXT_PUBLIC_API_BASE_URL=/api
```

## Метрики успеха

- [ ] Время обработки платежа < 5 секунд
- [ ] Успешность транзакций > 95%
- [ ] Отсутствие критических ошибок безопасности
- [ ] Поддержка минимум 3 блокчейн сетей
- [ ] Удобный UX для пополнения баланса

## Риски и митигация

| Риск | Вероятность | Влияние | Митигация |
|------|------------|---------|-----------|
| Ошибки при работе с кошельком | Средняя | Высокое | Подробная обработка ошибок, fallback на email |
| Проблемы с facilitator | Низкая | Высокое | Резервный facilitator, кэширование |
| Высокие gas fees | Средняя | Среднее | Использование L2 (Base), batching транзакций |
| UX сложность | Средняя | Среднее | Подробные инструкции, onboarding flow |

## Следующие шаги

1. **Немедленно:**
   - Создать базовую структуру x402Client.js
   - Настроить тестовый кошелек на Base testnet
   - Создать API эндпоинты для платежей

2. **На этой неделе:**
   - Интегрировать x402 в PricingCalculator
   - Добавить компонент подключения кошелька
   - Протестировать на testnet

3. **В ближайший месяц:**
   - Полное тестирование на mainnet с малыми суммами
   - Добавление расширенной функциональности
   - Документация для пользователей

---

**Обновлено:** 30 сентября 2025  
**Ответственный:** Development Team  
**Статус:** Готово к реализации
