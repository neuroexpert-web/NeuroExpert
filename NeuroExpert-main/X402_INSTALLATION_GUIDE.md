# Руководство по установке и настройке x402

**Дата:** 30 сентября 2025  
**Версия:** 1.0

---

## 📋 Предварительные требования

### Системные требования

- **Node.js:** 20.x или выше
- **npm:** 9.0.0 или выше
- **Git:** Для клонирования репозитория
- **Браузер:** Chrome, Firefox, или Edge (с поддержкой Web3)

### Web3 Кошелек

Установите один из следующих кошельков:
- [MetaMask](https://metamask.io/) - Рекомендуется
- [Coinbase Wallet](https://www.coinbase.com/wallet)
- Любой EIP-1193 совместимый кошелек

---

## 🚀 Установка

### Шаг 1: Клонирование репозитория (если еще не сделано)

```bash
git clone <repository-url>
cd NeuroExpert-main
```

### Шаг 2: Установка зависимостей

```bash
npm install
```

Это установит все необходимые пакеты, включая:
- `ethers@^6.9.0` - для работы с блокчейном
- `next@14.2.32` - фреймворк
- И другие зависимости из package.json

### Шаг 3: Настройка переменных окружения

1. **Скопируйте шаблон конфигурации:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Отредактируйте `.env.local`:**
   ```bash
   nano .env.local
   # или
   code .env.local
   ```

3. **Обязательные переменные для настройки:**

   ```env
   # Адрес вашего кошелька для приема платежей
   NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS=0xYourWalletAddressHere
   
   # URL facilitator (используйте testnet для тестирования)
   NEXT_PUBLIC_X402_FACILITATOR_URL=https://facilitator.coinbase.com
   
   # Сеть по умолчанию
   NEXT_PUBLIC_DEFAULT_CHAIN=base
   
   # Токен по умолчанию
   NEXT_PUBLIC_DEFAULT_TOKEN=usdc
   ```

---

## 🔧 Конфигурация

### Получение адреса кошелька

1. **Откройте MetaMask**
2. **Скопируйте ваш адрес** (начинается с `0x...`)
3. **Вставьте в `.env.local`** как `NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS`

⚠️ **ВАЖНО:** Используйте отдельный кошелек для приема платежей, не используйте личный кошелек!

### Настройка для тестирования (Testnet)

Для тестирования используйте Base Sepolia:

```env
# Testnet конфигурация
NEXT_PUBLIC_DEFAULT_CHAIN=baseTestnet
NEXT_PUBLIC_X402_FACILITATOR_URL=https://facilitator-testnet.coinbase.com
NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS=0xYourTestnetAddress
```

### Получение тестовых токенов

1. **Перейдите на faucet:**
   - Base Sepolia: https://faucet.quicknode.com/base/sepolia
   
2. **Введите ваш адрес testnet**

3. **Получите тестовые ETH и USDC**

---

## 🏃 Запуск приложения

### Режим разработки

```bash
npm run dev
```

Приложение запустится на http://localhost:3000

### Режим production

```bash
# Build
npm run build

# Start
npm start
```

---

## 🧪 Тестирование интеграции

### Базовая проверка

1. **Откройте приложение**
   ```
   http://localhost:3000
   ```

2. **Найдите секцию "Управление агентами и балансом"**

3. **Нажмите "Подключить кошелек"**
   - Должно появиться окно MetaMask
   - Подтвердите подключение

4. **Проверьте отображение:**
   - Адрес кошелька должен отобразиться
   - Название сети должно быть видно

### Тест пополнения баланса

1. **Нажмите "Пополнить баланс"**

2. **Введите тестовую сумму** (например, 10 USD)

3. **Нажмите "Пополнить через x402"**

4. **Проверьте консоль браузера** (F12)
   - Должны появиться логи инициации платежа
   - Проверьте детали платежа (paymentDetails)

⚠️ **Примечание:** Полный платежный цикл пока работает в mock режиме, так как требуется:
- Настройка facilitator от Coinbase
- Реализация подписания транзакций
- Подключение к базе данных

---

## 🔍 Проверка установки

### Проверка зависимостей

```bash
# Проверить наличие ethers.js
npm list ethers

# Должно показать: ethers@6.9.0
```

### Проверка файлов

Убедитесь, что следующие файлы существуют:

```bash
# Конфигурация
ls lib/x402Config.js

# Утилиты
ls utils/x402Client.js
ls utils/blockchain.js
ls utils/payment.js

# Компоненты
ls app/components/WalletConnector.js
ls app/components/PricingCalculator.js

# API
ls app/api/balance/get/route.js
ls app/api/payment/initiate/route.js

# Конфигурация
ls .env.local
```

### Проверка в браузере

1. **Откройте DevTools** (F12)
2. **Перейдите в Console**
3. **Проверьте наличие Web3:**
   ```javascript
   window.ethereum !== undefined
   ```
   Должно вернуть `true` если установлен MetaMask

---

## 🐛 Решение проблем

### Проблема: "Web3 кошелек не обнаружен"

**Решение:**
1. Установите MetaMask или Coinbase Wallet
2. Перезагрузите страницу
3. Убедитесь, что кошелек включен

### Проблема: "Module not found: ethers"

**Решение:**
```bash
npm install ethers@^6.9.0
```

### Проблема: "Cannot read properties of undefined"

**Решение:**
1. Проверьте, что `.env.local` существует
2. Проверьте, что все переменные настроены
3. Перезапустите dev сервер:
   ```bash
   # Остановите сервер (Ctrl+C)
   npm run dev
   ```

### Проблема: "Неподдерживаемая сеть"

**Решение:**
1. Откройте MetaMask
2. Переключитесь на Base или Ethereum
3. Или добавьте Base network:
   - Network Name: Base
   - RPC URL: https://mainnet.base.org
   - Chain ID: 8453
   - Currency: ETH
   - Explorer: https://basescan.org

### Проблема: Компонент не отображается

**Решение:**
1. Проверьте консоль браузера на ошибки
2. Убедитесь, что PricingCalculator.js корректно импортирован
3. Проверьте наличие CSS модуля:
   ```bash
   ls app/components/PricingCalculator.module.css
   ```

---

## 📦 Структура установки

После установки структура должна выглядеть так:

```
NeuroExpert-main/
├── .env.local                    ✅ Создан вами
├── .env.local.example            ✅ Шаблон
├── package.json                  ✅ Обновлен с ethers
├── node_modules/
│   └── ethers/                   ✅ Установлен
│
├── lib/
│   └── x402Config.js             ✅
│
├── utils/
│   ├── x402Client.js             ✅
│   ├── blockchain.js             ✅
│   └── payment.js                ✅
│
├── app/
│   ├── components/
│   │   ├── WalletConnector.js    ✅
│   │   └── PricingCalculator.js  ✅ Обновлен
│   │
│   └── api/
│       ├── balance/              ✅
│       ├── transactions/         ✅
│       ├── agent/                ✅
│       └── payment/              ✅
│
└── Документация/                 ✅ 6 файлов .md
```

---

## 🎯 Следующие шаги

### Для разработки:

1. ✅ **Установка завершена** - Вы здесь
2. **Тестирование на testnet**
   - Получить testnet токены
   - Протестировать подключение кошелька
   - Проверить mock платежи

3. **Интеграция с Coinbase CDP**
   - Зарегистрироваться на https://cdp.coinbase.com/
   - Получить API ключи
   - Настроить facilitator

4. **Реализация подписания транзакций**
   - Использовать utils/payment.js
   - Интегрировать в PricingCalculator

5. **Подключение базы данных**
   - Настроить PostgreSQL или MongoDB
   - Создать таблицы
   - Обновить API эндпоинты

### Для production:

- [ ] Полное тестирование на testnet
- [ ] Аудит безопасности
- [ ] Настройка мониторинга
- [ ] Оптимизация производительности
- [ ] Деплой на production

---

## 📚 Дополнительные ресурсы

### Документация проекта:
- `X402_INTEGRATION_COMPLETE_REPORT.md` - Полный отчет об интеграции
- `PRICING_CALCULATOR_X402_INTEGRATION_PLAN.md` - Детальный план
- `Протокол x402 для платформы NeuroExpert.md` - Обзор протокола

### Внешние ресурсы:
- [x402 Docs](https://www.x402.org/)
- [Coinbase CDP](https://docs.cdp.coinbase.com/x402/docs/welcome)
- [Ethers.js Docs](https://docs.ethers.org/v6/)
- [Base Network](https://base.org/)

### Поддержка:
- GitHub Issues: [Ссылка на issues]
- Discord: [Ссылка на сервер]
- Email: support@neuroexpert.example

---

## ✅ Чеклист установки

Отметьте по мере выполнения:

- [ ] Node.js 20.x установлен
- [ ] npm 9+ установлен
- [ ] MetaMask или Coinbase Wallet установлен
- [ ] Репозиторий склонирован
- [ ] `npm install` выполнен успешно
- [ ] `.env.local` создан и настроен
- [ ] Адрес кошелька добавлен в конфигурацию
- [ ] `npm run dev` запускается без ошибок
- [ ] Приложение открывается в браузере
- [ ] Кошелек подключается успешно
- [ ] Компоненты отображаются корректно

---

**Последнее обновление:** 30 сентября 2025  
**Версия guide:** 1.0  
**Статус:** ✅ Готов к использованию
