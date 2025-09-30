# Полное руководство по запуску x402 в Production

**Платформа:** NeuroExpert  
**Протокол:** x402 Payment Integration  
**Дата:** 30 сентября 2025  
**Версия:** 2.0

---

## 📋 Оглавление

1. [Предварительные требования](#предварительные-требования)
2. [Шаг 1: Настройка базы данных](#шаг-1-настройка-базы-данных)
3. [Шаг 2: Настройка Coinbase CDP](#шаг-2-настройка-coinbase-cdp)
4. [Шаг 3: Конфигурация переменных окружения](#шаг-3-конфигурация-переменных-окружения)
5. [Шаг 4: Тестирование на Testnet](#шаг-4-тестирование-на-testnet)
6. [Шаг 5: Deployment в Production](#шаг-5-deployment-в-production)
7. [Шаг 6: Мониторинг и поддержка](#шаг-6-мониторинг-и-поддержка)
8. [Troubleshooting](#troubleshooting)
9. [Чеклист запуска](#чеклист-запуска)

---

## Предварительные требования

### Необходимое ПО:
- ✅ Node.js 20.x или выше
- ✅ PostgreSQL 14+ (для базы данных)
- ✅ Git
- ✅ MetaMask или Coinbase Wallet (для тестирования)

### Необходимые аккаунты:
- ✅ Coinbase Developer Platform аккаунт
- ✅ Хостинг платформа (Vercel, Netlify, Railway, etc.)
- ✅ Ethereum/Base кошелек для приема платежей

### Технические знания:
- ✅ Базовое понимание блокчейн технологий
- ✅ Знание SQL и работы с БД
- ✅ Опыт деплоя Next.js приложений

---

## Шаг 1: Настройка базы данных

### 1.1 Выбор провайдера БД

Рекомендуемые варианты:

**Option A: Supabase (рекомендуется)**
- Бесплатный tier: 500MB, 2GB transfer
- PostgreSQL out of the box
- Web UI для управления
- Автоматические бэкапы

**Option B: Neon**
- Serverless PostgreSQL
- Generous free tier
- Отличная производительность

**Option C: Railway**
- $5/месяц за 512MB RAM
- Easy to use
- Integrated deployment

### 1.2 Создание базы данных

#### Для Supabase:

1. Зарегистрируйтесь на https://supabase.com
2. Создайте новый проект:
   ```
   Name: NeuroExpert Production
   Database Password: [secure password]
   Region: [closest to your users]
   ```

3. Получите connection string:
   ```
   Settings → Database → Connection String
   ```

#### Пример connection string:
```
postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 1.3 Применение SQL схемы

1. Откройте SQL Editor в Supabase (или pgAdmin для других БД)

2. Скопируйте содержимое `database/schema.sql`

3. Выполните SQL скрипт

4. Проверьте созданные таблицы:
   ```sql
   SELECT tablename FROM pg_tables 
   WHERE schemaname = 'public'
   ORDER BY tablename;
   ```

Должны увидеть:
- ✅ users
- ✅ user_balances
- ✅ crypto_transactions
- ✅ balance_history
- ✅ agent_usage
- ✅ pending_payments
- ✅ user_settings
- ✅ transaction_limits
- ✅ api_logs

### 1.4 Создание тестового пользователя

```sql
-- Только для тестирования!
INSERT INTO users (email, wallet_address) 
VALUES ('test@neuroexpert.com', '0xYourTestWalletAddress');

-- Создаем начальный баланс
INSERT INTO user_balances (user_id, balance, currency)
VALUES (1, 0.00, 'USD');
```

### 1.5 Сохранение DATABASE_URL

Добавьте в `.env.local`:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
```

---

## Шаг 2: Настройка Coinbase CDP

Подробное руководство в `COINBASE_CDP_SETUP_GUIDE.md`

### 2.1 Краткая инструкция:

1. **Регистрация:**
   - https://cdp.coinbase.com/
   - Создайте аккаунт
   - Включите 2FA

2. **Создание проектов:**
   - Production проект: "NeuroExpert Production"
   - Testnet проект: "NeuroExpert Testnet"

3. **Получение API ключей:**
   
   **Production:**
   ```
   API Key: cdp_live_xxxxxxxxxxxx
   API Secret: xxxxxxxxxxxxxxxx
   Facilitator URL: https://facilitator.coinbase.com
   ```

   **Testnet:**
   ```
   API Key: cdp_test_xxxxxxxxxxxx
   API Secret: xxxxxxxxxxxxxxxx
   Facilitator URL: https://facilitator-testnet.coinbase.com
   ```

4. **Создание кошелька для приема:**
   - Создайте новый кошелек в MetaMask/Coinbase Wallet
   - **ВАЖНО:** Храните seed phrase в безопасном месте
   - Скопируйте адрес кошелька (0x...)

---

## Шаг 3: Конфигурация переменных окружения

### 3.1 Локальная разработка

Создайте `.env.local`:

```env
# ============================================
# Database
# ============================================
DATABASE_URL=postgresql://postgres:password@localhost:5432/neuroexpert

# ============================================
# Coinbase CDP (Testnet)
# ============================================
NEXT_PUBLIC_X402_FACILITATOR_URL=https://facilitator-testnet.coinbase.com
X402_FACILITATOR_API_KEY=cdp_test_xxxxxxxxxxxx
X402_FACILITATOR_SECRET=xxxxxxxxxxxxxxxx

# ============================================
# Blockchain Configuration (Testnet)
# ============================================
NEXT_PUBLIC_USE_TESTNET=true
NEXT_PUBLIC_DEFAULT_CHAIN=base_sepolia
NEXT_PUBLIC_DEFAULT_TOKEN=usdc
NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS=0xYourTestnetAddress

# ============================================
# Limits
# ============================================
NEXT_PUBLIC_MIN_TRANSACTION_AMOUNT=1
NEXT_PUBLIC_MAX_TRANSACTION_AMOUNT=1000
NEXT_PUBLIC_PAYMENT_DEADLINE_MINUTES=30
```

### 3.2 Production Configuration

**Для Vercel:**

```bash
# Установите переменные через Vercel Dashboard или CLI
vercel env add DATABASE_URL production
vercel env add X402_FACILITATOR_API_KEY production
vercel env add X402_FACILITATOR_SECRET production
vercel env add NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS production
```

**Production переменные:**

```env
# Database
DATABASE_URL=postgresql://[production-db-url]

# Coinbase CDP (Production)
NEXT_PUBLIC_X402_FACILITATOR_URL=https://facilitator.coinbase.com
X402_FACILITATOR_API_KEY=cdp_live_xxxxxxxxxxxx
X402_FACILITATOR_SECRET=xxxxxxxxxxxxxxxx

# Blockchain (Mainnet)
NEXT_PUBLIC_USE_TESTNET=false
NEXT_PUBLIC_DEFAULT_CHAIN=base
NEXT_PUBLIC_DEFAULT_TOKEN=usdc
NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS=0xYourMainnetAddress

# Limits (Production)
NEXT_PUBLIC_MIN_TRANSACTION_AMOUNT=10
NEXT_PUBLIC_MAX_TRANSACTION_AMOUNT=50000
NEXT_PUBLIC_PAYMENT_DEADLINE_MINUTES=60
```

---

## Шаг 4: Тестирование на Testnet

### 4.1 Получение testnet токенов

**Base Sepolia ETH:**
```
1. Перейдите: https://faucet.quicknode.com/base/sepolia
2. Введите ваш testnet адрес
3. Получите 0.1 ETH (для gas)
```

**Base Sepolia USDC:**
```
1. Перейдите: https://faucet.circle.com/
2. Выберите Base Sepolia network
3. Получите testnet USDC
```

### 4.2 Запуск тестового скрипта

```bash
# Установите зависимости (если еще не установлены)
npm install

# Запустите тесты интеграции
node scripts/test-x402-integration.js
```

**Ожидаемый результат:**
```
╔═══════════════════════════════════════════════════╗
║   Тестирование интеграции x402 для NeuroExpert   ║
╚═══════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Тест 1: Проверка конфигурации
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Facilitator URL: https://facilitator-testnet.coinbase.com
✅ Recipient Address: 0x...
✅ Default Chain: base_sepolia
✅ Default Token: usdc

... все тесты ...

🎉 Все тесты пройдены! (6/6)
```

### 4.3 E2E тестирование

1. **Запустите dev сервер:**
   ```bash
   npm run dev
   ```

2. **Откройте браузер:**
   ```
   http://localhost:3000
   ```

3. **Подключите MetaMask:**
   - Переключитесь на Base Sepolia
   - Подключите кошелек

4. **Выполните тестовый платеж:**
   - Попробуйте пополнить на $10
   - Подпишите транзакцию в MetaMask
   - Дождитесь подтверждения
   - Проверьте обновление баланса

5. **Проверьте в базе данных:**
   ```sql
   SELECT * FROM crypto_transactions 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

### 4.4 Тестирование Fallback

1. Отключите facilitator (неверный URL в .env)
2. Попробуйте платеж
3. Должен использоваться прямой метод
4. Проверьте что платеж все еще работает

---

## Шаг 5: Deployment в Production

### Option A: Vercel (Рекомендуется)

#### 5.1 Подготовка

```bash
# Установите Vercel CLI
npm i -g vercel

# Логин
vercel login
```

#### 5.2 Настройка переменных окружения

```bash
# Database
vercel env add DATABASE_URL production

# x402
vercel env add X402_FACILITATOR_API_KEY production
vercel env add X402_FACILITATOR_SECRET production
vercel env add NEXT_PUBLIC_X402_FACILITATOR_URL production
vercel env add NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS production

# Configuration
vercel env add NEXT_PUBLIC_DEFAULT_CHAIN production
vercel env add NEXT_PUBLIC_DEFAULT_TOKEN production
```

#### 5.3 Деплой

```bash
# Production deployment
vercel --prod
```

### Option B: Railway

#### 5.1 Создание проекта

```bash
# Установите Railway CLI
npm i -g @railway/cli

# Логин
railway login

# Инициализация
railway init
```

#### 5.2 Настройка

```bash
# Добавьте переменные через Railway Dashboard
# или через CLI:
railway variables set DATABASE_URL=...
railway variables set X402_FACILITATOR_API_KEY=...
```

#### 5.3 Деплой

```bash
railway up
```

### Option C: Netlify

См. документацию: `NETLIFY_DEPLOYMENT_GUIDE.md`

---

## Шаг 6: Мониторинг и поддержка

### 6.1 Настройка Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 6.2 Настройка Логирования

```javascript
// lib/logger.js
export function logTransaction(data) {
  const entry = {
    timestamp: new Date().toISOString(),
    ...data
  };
  
  console.log(JSON.stringify(entry));
  
  // Отправка в систему мониторинга
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(JSON.stringify(entry));
  }
}
```

### 6.3 Health Checks

Создайте `/api/health`:

```javascript
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    facilitator: await checkFacilitator(),
    timestamp: new Date().toISOString()
  };
  
  return Response.json(checks);
}
```

### 6.4 Мониторинг транзакций

**Dashboard должен показывать:**
- Успешные/неуспешные транзакции (%)
- Средняя сумма платежа
- Среднее время подтверждения
- Количество активных пользователей
- Gas costs

### 6.5 Alerts

Настройте уведомления для:
- ❌ Failed transactions > 5% за час
- ⚠️ Facilitator недоступен
- ⚠️ Database connection errors
- ⚠️ High gas prices
- ⚠️ Low balance в recipient кошельке

---

## Troubleshooting

### Проблема 1: "Database connection failed"

**Решение:**
```bash
# Проверьте connection string
echo $DATABASE_URL

# Тест подключения
psql $DATABASE_URL -c "SELECT 1"

# Проверьте firewall rules
# Убедитесь что ваш server IP в whitelist
```

### Проблема 2: "Facilitator unavailable"

**Решение:**
1. Проверьте статус: https://status.coinbase.com/
2. Проверьте API ключи
3. Проверьте facilitator URL
4. Fallback должен работать автоматически

### Проблема 3: "Transaction verification failed"

**Решение:**
1. Проверьте что deadline не истек
2. Проверьте EIP-712 подпись
3. Проверьте адреса токенов
4. Убедитесь в правильной сети

### Проблема 4: "Insufficient gas"

**Решение:**
```javascript
// Увеличьте gas limit
const tx = {
  ...transaction,
  gasLimit: ethers.parseUnits('100000', 'wei')
};
```

### Проблема 5: "High memory usage"

**Решение:**
```javascript
// Оптимизируйте Next.js
// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};
```

---

## Чеклист запуска

### Pre-Launch (1-2 недели до запуска)

```markdown
Backend:
- [ ] База данных настроена
- [ ] SQL схема применена
- [ ] Тестовые данные созданы
- [ ] Connection pooling настроен
- [ ] Бэкапы настроены

Blockchain:
- [ ] Production кошелек создан
- [ ] Seed phrase сохранен безопасно
- [ ] Кошелек пополнен для gas
- [ ] Адреса токенов проверены
- [ ] RPC endpoints работают

x402:
- [ ] Coinbase CDP аккаунт создан
- [ ] Production API ключи получены
- [ ] Testnet тестирование завершено
- [ ] Facilitator health check работает
- [ ] Webhooks настроены

Application:
- [ ] Все переменные окружения настроены
- [ ] Build проходит без ошибок
- [ ] Tests пройдены (100%)
- [ ] E2E тесты пройдены
- [ ] Нагрузочное тестирование

Security:
- [ ] API ключи не в коде
- [ ] Rate limiting настроен
- [ ] CORS настроен
- [ ] Input validation везде
- [ ] SQL injection защита
- [ ] XSS protection

Monitoring:
- [ ] Sentry настроен
- [ ] Logging работает
- [ ] Alerts настроены
- [ ] Dashboard готов
- [ ] On-call rotation настроена
```

### Launch Day

```markdown
Morning:
- [ ] Final smoke tests
- [ ] Database backup
- [ ] Team briefing
- [ ] Support channels ready

Deployment:
- [ ] Deploy to production
- [ ] Verify all services up
- [ ] Run health checks
- [ ] Test payment flow
- [ ] Monitor for 1 hour

Post-Launch:
- [ ] Announce launch
- [ ] Monitor metrics
- [ ] Watch for errors
- [ ] Be ready for hotfixes
- [ ] Document any issues
```

### Post-Launch (First Week)

```markdown
Daily:
- [ ] Check error rates
- [ ] Review transaction logs
- [ ] Monitor gas costs
- [ ] Check facilitator status
- [ ] Review user feedback

Weekly:
- [ ] Analyze metrics
- [ ] Review costs
- [ ] Plan optimizations
- [ ] Update documentation
- [ ] Team retrospective
```

---

## 📞 Поддержка

### Документация проекта:
- `X402_QUICK_START.md` - Быстрый старт
- `X402_PRODUCTION_READY_REPORT.md` - Полная документация
- `COINBASE_CDP_SETUP_GUIDE.md` - Настройка CDP
- `database/schema.sql` - SQL схема

### Внешние ресурсы:
- Coinbase CDP: https://docs.cdp.coinbase.com/
- x402 Protocol: https://www.x402.org/
- Base Network: https://docs.base.org/
- ethers.js: https://docs.ethers.org/

### Emergency Contacts:
- Coinbase Support: support@coinbase.com
- Coinbase Status: https://status.coinbase.com/
- Base Discord: https://discord.gg/base

---

## 🎉 Готово!

После выполнения всех шагов ваша платформа NeuroExpert готова принимать реальные криптоплатежи через протокол x402!

**Помните:**
- 🔍 Мониторьте систему первые недели
- 📊 Анализируйте метрики рег
