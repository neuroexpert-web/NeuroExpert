# Руководство по настройке Coinbase CDP для x402

**Дата:** 30 сентября 2025  
**Для:** NeuroExpert Platform  
**Протокол:** x402 Payment Integration

---

## 📋 Что такое Coinbase CDP?

Coinbase Developer Platform (CDP) - это платформа разработчика от Coinbase, которая предоставляет инструменты для работы с блокчейном, включая facilitator для протокола x402.

**x402 Facilitator** - это сервис, который:
- Верифицирует платежные транзакции
- Проводит settlement в блокчейне
- Обрабатывает EIP-712 подписи
- Управляет статусами транзакций

---

## 🚀 Шаг 1: Создание аккаунта Coinbase CDP

### 1.1 Регистрация

1. Перейдите на https://cdp.coinbase.com/
2. Нажмите "Get Started" или "Sign Up"
3. Зарегистрируйтесь используя:
   - Email
   - Или через Google/GitHub аккаунт

### 1.2 Верификация

1. Подтвердите email адрес
2. Настройте двухфакторную аутентификацию (2FA)
3. Пройдите KYC верификацию (если требуется)

---

## 🔑 Шаг 2: Получение API ключей

### 2.1 Создание проекта

1. Войдите в Coinbase CDP Dashboard
2. Нажмите "Create New Project"
3. Заполните информацию:
   ```
   Project Name: NeuroExpert x402 Integration
   Description: AI Agent Platform Payment System
   Use Case: Payment Protocol Integration
   ```

### 2.2 Генерация API ключей

1. В проекте перейдите в раздел "API Keys"
2. Нажмите "Generate New API Key"
3. Выберите права доступа:
   - ✅ Read (чтение данных)
   - ✅ Write (запись данных)
   - ✅ x402 Protocol Access
4. Сохраните сгенерированные ключи:

```bash
API Key ID: cdp_xxxxxxxxxxxxxxxxxxxx
API Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Project ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**⚠️ ВАЖНО:** Сохраните эти ключи в безопасном месте! API Secret показывается только один раз!

### 2.3 Добавление ключей в проект

Создайте файл `.env.local` в корне проекта:

```bash
# Скопируйте из .env.local.example
cp .env.local.example .env.local
```

Отредактируйте `.env.local`:

```env
# Coinbase CDP Configuration
NEXT_PUBLIC_X402_FACILITATOR_URL=https://facilitator.coinbase.com
X402_FACILITATOR_API_KEY=cdp_xxxxxxxxxxxxxxxxxxxx
X402_FACILITATOR_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
X402_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Ваш адрес для приема платежей
NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS=0xYourWalletAddress

# Настройки по умолчанию
NEXT_PUBLIC_DEFAULT_CHAIN=base
NEXT_PUBLIC_DEFAULT_TOKEN=usdc
```

---

## 🧪 Шаг 3: Настройка Testnet (для разработки)

### 3.1 Создание testnet проекта

1. В Coinbase CDP создайте отдельный проект для тестирования
2. Название: "NeuroExpert x402 Testnet"
3. Получите testnet API ключи

### 3.2 Конфигурация для testnet

Обновите `.env.local` для testnet:

```env
# Testnet Configuration
NEXT_PUBLIC_USE_TESTNET=true
NEXT_PUBLIC_X402_FACILITATOR_URL=https://facilitator-testnet.coinbase.com
NEXT_PUBLIC_DEFAULT_CHAIN=base_sepolia

# Testnet API Keys
X402_FACILITATOR_API_KEY=cdp_test_xxxxxxxxxxxxxxxxxxxx
X402_FACILITATOR_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Testnet кошелек
NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS=0xYourTestnetAddress
```

### 3.3 Получение testnet токенов

1. **Base Sepolia ETH:**
   - https://faucet.quicknode.com/base/sepolia
   - Введите ваш testnet адрес
   - Получите 0.1 ETH для gas fees

2. **Testnet USDC:**
   - https://faucet.circle.com/
   - Выберите Base Sepolia
   - Получите testnet USDC

---

## 🔧 Шаг 4: Конфигурация facilitator

### 4.1 Настройка webhook (опционально)

Для автоматического обновления статусов транзакций:

1. В Coinbase CDP Dashboard перейдите в "Webhooks"
2. Добавьте новый webhook:
   ```
   URL: https://your-domain.com/api/webhook/x402
   Events: 
     - transaction.confirmed
     - transaction.failed
     - payment.settled
   ```

3. Сохраните webhook secret:
   ```env
   X402_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
   ```

### 4.2 Настройка сетей

Убедитесь что в вашем проекте активированы нужные сети:

**Production:**
- ✅ Base (mainnet)
- ✅ Ethereum (mainnet)

**Testnet:**
- ✅ Base Sepolia
- ✅ Ethereum Sepolia

### 4.3 Настройка токенов

Проверьте адреса токенов в `lib/x402Config.js`:

**Base Mainnet:**
```javascript
usdc: {
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
}
```

**Base Sepolia:**
```javascript
usdc: {
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
}
```

---

## ✅ Шаг 5: Тестирование интеграции

### 5.1 Проверка подключения

Создайте тестовый скрипт `scripts/test-facilitator.js`:

```javascript
import { X402Client } from '../utils/x402Client.js';

async function testFacilitator() {
  console.log('🔍 Проверка подключения к facilitator...');
  
  const client = new X402Client();
  
  try {
    const isHealthy = await client.checkHealth();
    
    if (isHealthy) {
      console.log('✅ Facilitator доступен и работает');
      return true;
    } else {
      console.log('❌ Facilitator недоступен');
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка подключения:', error.message);
    return false;
  }
}

testFacilitator();
```

Запустите тест:
```bash
node scripts/test-facilitator.js
```

### 5.2 Тест инициации платежа

```javascript
import { X402Client } from '../utils/x402Client.js';

async function testPaymentInitiation() {
  console.log('🔍 Тест инициации платежа...');
  
  const client = new X402Client();
  
  try {
    const paymentDetails = await client.initiatePayment(
      10,    // $10
      'base_sepolia',
      'usdc'
    );
    
    console.log('✅ Платеж инициирован успешно');
    console.log('Детали:', paymentDetails);
    return true;
  } catch (error) {
    console.error('❌ Ошибка инициации:', error.message);
    return false;
  }
}

testPaymentInitiation();
```

### 5.3 Полный E2E тест (с реальным кошельком)

1. Установите MetaMask
2. Переключитесь на Base Sepolia
3. Получите testnet USDC
4. Запустите dev сервер:
   ```bash
   npm run dev
   ```
5. Откройте http://localhost:3000
6. Подключите кошелек
7. Попробуйте пополнить баланс на $10

---

## 📊 Шаг 6: Мониторинг и логирование

### 6.1 Dashboard Coinbase CDP

В Dashboard вы можете отслеживать:
- Количество API запросов
- Успешные/неуспешные транзакции
- Использованный gas
- Ошибки и предупреждения

### 6.2 Настройка логирования

Добавьте в проект:

```javascript
// lib/logger.js
export function logTransaction(type, data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: type,
    data: data,
    environment: process.env.NODE_ENV
  };
  
  console.log(JSON.stringify(logEntry));
  
  // Отправка в систему мониторинга (Sentry, DataDog, etc.)
  if (process.env.SENTRY_DSN) {
    // Sentry.captureMessage(...)
  }
}
```

### 6.3 Alerts

Настройте alerts в Coinbase CDP для:
- Неудачных транзакций (> 5% за час)
- Высокого gas price (> threshold)
- API rate limits
- Ошибки facilitator

---

## 🔐 Безопасность

### Лучшие практики:

1. **Никогда не коммитьте API ключи в git**
   ```bash
   # Добавьте в .gitignore
   .env.local
   .env.production
   ```

2. **Используйте переменные окружения на production**
   ```bash
   # Vercel, Netlify, Railway и т.д.
   vercel env add X402_FACILITATOR_API_KEY
   ```

3. **Ротация ключей**
   - Меняйте API ключи каждые 90 дней
   - При утечке немедленно отзовите ключи

4. **Rate Limiting**
   ```javascript
   // middleware.js
   export function rateLimiter(req, res, next) {
     // Ограничение 100 запросов в минуту
   }
   ```

5. **Whitelist IP адресов**
   - В Coinbase CDP настройте IP whitelist для production

---

## 💰 Стоимость и лимиты

### Тарифы Coinbase CDP (примерные):

**Free Tier:**
- 10,000 API запросов/месяц
- Базовая поддержка
- Testnet доступ

**Pro Tier ($99/месяц):**
- 100,000 API запросов/месяц
- Приоритетная поддержка
- Production facilitator
- Advanced analytics

**Enterprise:**
- Unlimited запросы
- Dedicated support
- SLA гарантии
- Custom integrations

### Комиссии x402:

- **Facilitator fee:** ~0.1-0.5% от суммы
- **Network gas:** зависит от сети
  - Base: ~$0.10-0.50 за транзакцию
  - Ethereum: ~$5-20 за транзакцию

---

## 🐛 Troubleshooting

### Проблема: "Facilitator недоступен"

**Решение:**
1. Проверьте URL facilitator
2. Убедитесь что API ключи правильные
3. Проверьте статус на https://status.coinbase.com/

### Проблема: "Invalid API Key"

**Решение:**
1. Сгенерируйте новый API ключ
2. Проверьте что ключ не истек
3. Убедитесь что у ключа есть нужные права

### Проблема: "Transaction verification failed"

**Решение:**
1. Проверьте EIP-712 подпись
2. Убедитесь что deadline не истек
3. Проверьте адреса токенов
4. Убедитесь что сеть правильная

### Проблема: "Rate limit exceeded"

**Решение:**
1. Уменьшите частоту запросов
2. Реализуйте exponential backoff
3. Рассмотрите upgrade тарифа

---

## 📞 Поддержка

### Официальные каналы:

- **Documentation:** https://docs.cdp.coinbase.com/
- **Support:** support@coinbase.com
- **Status Page:** https://status.coinbase.com/
- **Community:** https://discord.gg/coinbase-developers

### Полезные ссылки:

- [x402 Protocol Spec](https://www.x402.org/spec)
- [Coinbase CDP API Reference](https://docs.cdp.coinbase.com/x402/reference)
- [Base Network Docs](https://docs.base.org/)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)

---

## ✅ Чеклист готовности

```markdown
Регистрация:
- [ ] Создан аккаунт Coinbase CDP
- [ ] Включена 2FA
- [ ] Пройдена верификация

API Keys:
- [ ] Создан production проект
- [ ] Получены API ключи
- [ ] Ключи добавлены в .env.local
- [ ] Создан testnet проект
- [ ] Получены testnet ключи

Конфигурация:
- [ ] Настроен facilitator URL
- [ ] Указан адрес получателя
- [ ] Проверены адреса токенов
- [ ] Настроены webhooks (опционально)

Тестирование:
- [ ] Health check прошел успешно
- [ ] Testnet транзакции работают
- [ ] E2E тесты пройдены
- [ ] Мониторинг настроен

Production:
- [ ] API ключи на сервере
- [ ] Мониторинг и alerts настроены
- [ ] Документация обновлена
- [ ] Team проинформирована
```

---

## 🎉 Готово!

После выполнения всех шагов ваша интеграция x402 с Coinbase CDP готова к работе!

**Следующие шаги:**
1. Протестируйте на testnet
2. Проведите нагрузочное тестирование
3. Настройте мониторинг
4. Запустите в production

**Успехов! 🚀**
