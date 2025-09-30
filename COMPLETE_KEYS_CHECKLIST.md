# 🔑 ПОЛНЫЙ ЧЕКЛИСТ КЛЮЧЕЙ И ТОКЕНОВ NEUROEXPERT

## 📋 ОБЯЗАТЕЛЬНЫЕ К ЗАПОЛНЕНИЮ

Этот документ содержает **исчерпывающий список всех ключей, токенов, ID и настроек**, необходимых для 100% работоспособности платформы NeuroExpert.

**Статус**: PRODUCTION CRITICAL  
**Обновлено**: Январь 2025  
**Версия**: NeuroExpert v3.0 Enterprise

---

## 🚨 КРИТИЧЕСКИ ВАЖНЫЕ (БЕЗ НИХ ПЛАТФОРМА НЕ РАБОТАЕТ)

### 🤖 AI API КЛЮЧИ
| Переменная | Обязательность | Назначение | Где получить |
|------------|----------------|------------|--------------|
| `GEMINI_API_KEY` | 🔴 КРИТИЧНО | Основной AI-помощник | [ai.google.dev](https://ai.google.dev/) |
| `GOOGLE_GEMINI_API_KEY` | 🔴 КРИТИЧНО | Альтернативное название | То же |

### 🔒 БЕЗОПАСНОСТЬ
| Переменная | Обязательность | Назначение | Как создать |
|------------|----------------|------------|-------------|
| `JWT_SECRET` | 🔴 КРИТИЧНО | Подписание JWT токенов | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ADMIN_PASSWORD_HASH` | 🔴 КРИТИЧНО | Пароль админ-панели | `npm run generate:password -- YourPassword123` |
| `SECRET_KEY` | 🔴 КРИТИЧНО | Общее шифрование | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

### 🌐 ОСНОВНЫЕ НАСТРОЙКИ
| Переменная | Обязательность | Назначение | Пример значения |
|------------|----------------|------------|-----------------|
| `NODE_ENV` | 🔴 КРИТИЧНО | Режим работы | `production` |
| `NEXT_PUBLIC_SITE_URL` | 🔴 КРИТИЧНО | Базовый URL сайта | `https://neuroexpert.ai` |
| `NEXTAUTH_URL` | 🔴 КРИТИЧНО | URL для NextAuth | `https://neuroexpert.ai` |

---

## 🟠 ВЫСОКИЙ ПРИОРИТЕТ (СИЛЬНО РЕКОМЕНДУЕТСЯ)

### 📊 АНАЛИТИКА И МЕТРИКИ
| Переменная | Приоритет | Назначение | Где получить | Стоимость |
|------------|-----------|------------|--------------|-----------|
| `NEXT_PUBLIC_GA_ID` | 🟠 ВЫСОКИЙ | Google Analytics | [analytics.google.com](https://analytics.google.com) | Бесплатно |
| `NEXT_PUBLIC_YANDEX_METRICA_ID` | 🟠 ВЫСОКИЙ | Яндекс.Метрика | [metrica.yandex.ru](https://metrica.yandex.ru) | Бесплатно |
| `NEXT_PUBLIC_GTM_ID` | 🟡 СРЕДНИЙ | Google Tag Manager | [tagmanager.google.com](https://tagmanager.google.com) | Бесплатно |

### 📱 TELEGRAM УВЕДОМЛЕНИЯ  
| Переменная | Приоритет | Назначение | Инструкция |
|------------|-----------|------------|------------|
| `TELEGRAM_BOT_TOKEN` | 🟠 ВЫСОКИЙ | Токен бота | 1. Найти @BotFather<br>2. `/newbot`<br>3. Сохранить токен |
| `TELEGRAM_CHAT_ID` | 🟠 ВЫСОКИЙ | ID чата для уведомлений | 1. Написать боту<br>2. `api.telegram.org/bot<TOKEN>/getUpdates`<br>3. Найти chat.id |
| `TELEGRAM_ADMIN_CHAT_ID` | 🟡 СРЕДНИЙ | ID админа | То же что CHAT_ID |
| `TELEGRAM_THREAD_ID` | 🟡 СРЕДНИЙ | ID треда в группе | Если используете топики |

### 📧 EMAIL СЕРВИСЫ
| Переменная | Приоритет | Назначение | Настройка |
|------------|-----------|------------|-----------|
| `SMTP_HOST` | 🟠 ВЫСОКИЙ | SMTP сервер | `smtp.gmail.com` |
| `SMTP_PORT` | 🟠 ВЫСОКИЙ | Порт SMTP | `587` |
| `SMTP_USER` | 🟠 ВЫСОКИЙ | Email отправителя | your-email@gmail.com |
| `SMTP_PASS` | 🟠 ВЫСОКИЙ | Пароль приложения | Создать в Google Account |
| `EMAIL_FROM` | 🟡 СРЕДНИЙ | From адрес | noreply@neuroexpert.ai |

### 🛡️ МОНИТОРИНГ ОШИБОК
| Переменная | Приоритет | Назначение | Где получить | Лимиты |
|------------|-----------|------------|--------------|--------|
| `SENTRY_DSN` | 🟠 ВЫСОКИЙ | Отслеживание ошибок | [sentry.io](https://sentry.io) | 5K ошибок/мес |
| `NEXT_PUBLIC_SENTRY_DSN` | 🟠 ВЫСОКИЙ | Клиентские ошибки | То же | бесплатно |

---

## 🟡 СРЕДНИЙ ПРИОРИТЕТ (РАСШИРЕННЫЙ ФУНКЦИОНАЛ)

### 🗄️ БАЗЫ ДАННЫХ
| Переменная | Приоритет | Назначение | Провайдеры | Стоимость |
|------------|-----------|------------|------------|-----------|
| `DATABASE_URL` | 🟡 СРЕДНИЙ | PostgreSQL | Supabase, Neon, Railway | $0-25/мес |
| `REDIS_URL` | 🟢 НИЗКИЙ | Кеширование | Upstash, Railway | $0-10/мес |

### 🔗 CRM ИНТЕГРАЦИИ
| Переменная | Приоритет | Назначение | Документация |
|------------|-----------|------------|--------------|
| `BITRIX24_WEBHOOK_URL` | 🟡 СРЕДНИЙ | Битрикс24 | webhook в настройках |
| `BITRIX24_API_KEY` | 🟡 СРЕДНИЙ | API ключ | приложения Битрикс24 |
| `AMOCRM_CLIENT_ID` | 🟡 СРЕДНИЙ | amoCRM интеграция | developers.amocrm.ru |
| `AMOCRM_CLIENT_SECRET` | 🟡 СРЕДНИЙ | Секрет amoCRM | То же |
| `HUBSPOT_API_KEY` | 🟡 СРЕДНИЙ | HubSpot | developers.hubspot.com |

### 🤖 ДОПОЛНИТЕЛЬНЫЕ AI СЕРВИСЫ
| Переменная | Приоритет | Назначение | API Docs | Стоимость |
|------------|-----------|------------|----------|-----------|
| `OPENAI_API_KEY` | 🟡 СРЕДНИЙ | GPT-4 резерв | platform.openai.com | $0.01-0.06/1K |
| `ANTHROPIC_API_KEY` | 🟡 СРЕДНИЙ | Claude резерв | console.anthropic.com | $0.008-0.024/1K |

---

## 🟢 НИЗКИЙ ПРИОРИТЕТ (ОПЦИОНАЛЬНЫЕ)

### 💰 ПЛАТЕЖНЫЕ СИСТЕМЫ
| Переменная | Приоритет | Назначение | Регистрация |
|------------|-----------|------------|-------------|
| `YOOKASSA_SHOP_ID` | 🟢 НИЗКИЙ | ЮKassa ID | kassa.yandex.ru |
| `YOOKASSA_SECRET_KEY` | 🟢 НИЗКИЙ | ЮKassa секрет | То же |
| `STRIPE_PUBLISHABLE_KEY` | 🟢 НИЗКИЙ | Stripe публичный | stripe.com |
| `STRIPE_SECRET_KEY` | 🟢 НИЗКИЙ | Stripe секретный | То же |
| `STRIPE_WEBHOOK_SECRET` | 🟢 НИЗКИЙ | Stripe webhook | dashboard.stripe.com |
| `TINKOFF_TERMINAL_KEY` | 🟢 НИЗКИЙ | Тинькофф терминал | acquiring.tinkoff.ru |
| `TINKOFF_SECRET_KEY` | 🟢 НИЗКИЙ | Тинькофф секрет | То же |

### 🌐 GOOGLE СЕРВИСЫ
| Переменная | Приоритет | Назначение | API Console |
|------------|-----------|------------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | 🟢 НИЗКИЙ | Карты на сайте | console.cloud.google.com |
| `GOOGLE_SITE_VERIFICATION` | 🟢 НИЗКИЙ | Search Console | search.google.com/search-console |
| `GOOGLE_DRIVE_API_KEY` | 🟢 НИЗКИЙ | Google Drive | console.cloud.google.com |

### 📱 СОЦИАЛЬНЫЕ СЕТИ
| Переменная | Приоритет | Назначение | Где получить |
|------------|-----------|------------|--------------|
| `VK_APP_ID` | 🟢 НИЗКИЙ | ВКонтакте API | vk.com/apps?act=manage |
| `VK_API_KEY` | 🟢 НИЗКИЙ | ВК ключ | То же |
| `FACEBOOK_APP_ID` | 🟢 НИЗКИЙ | Facebook API | developers.facebook.com |
| `FACEBOOK_APP_SECRET` | 🟢 НИЗКИЙ | Facebook секрет | То же |

### 🔧 ДОПОЛНИТЕЛЬНЫЕ ИНСТРУМЕНТЫ
| Переменная | Приоритет | Назначение | Лимиты |
|------------|-----------|------------|--------|
| `NEXT_PUBLIC_LOGROCKET_ID` | 🟢 НИЗКИЙ | Session replay | 1000 сессий/мес |
| `NEXT_PUBLIC_HOTJAR_ID` | 🟢 НИЗКИЙ | Heatmaps | 35 сессий/день |
| `CLOUDFLARE_ZONE_ID` | 🟢 НИЗКИЙ | Cloudflare API | Бесплатно |
| `CLOUDFLARE_API_TOKEN` | 🟢 НИЗКИЙ | CF токен | То же |

---

## 📋 ГОТОВЫЙ .ENV TEMPLATE ПО ПРИОРИТЕТАМ

### 🔴 МИНИМАЛЬНЫЙ НАБОР (КРИТИЧНО)
```bash
# ОБЯЗАТЕЛЬНО ДЛЯ РАБОТЫ
GEMINI_API_KEY=
JWT_SECRET=
ADMIN_PASSWORD_HASH=
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://neuroexpert.ai
```

### 🟠 РЕКОМЕНДУЕМЫЙ НАБОР (+ ВЫСОКИЙ ПРИОРИТЕТ)
```bash
# МИНИМАЛЬНЫЙ +
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_YANDEX_METRICA_ID=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
SMTP_HOST=smtp.gmail.com
SMTP_USER=
SMTP_PASS=
SENTRY_DSN=
```

### 🟡 ПОЛНЫЙ НАБОР (+ СРЕДНИЙ ПРИОРИТЕТ)
```bash
# РЕКОМЕНДУЕМЫЙ +
DATABASE_URL=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
BITRIX24_WEBHOOK_URL=
AMOCRM_CLIENT_ID=
HUBSPOT_API_KEY=
```

### 🟢 МАКСИМАЛЬНЫЙ НАБОР (ВСЕ ОПЦИИ)
```bash
# ПОЛНЫЙ + ВСЕ ИНТЕГРАЦИИ
# Платежи, соцсети, дополнительные инструменты
```

---

## 🧪 ПРОВЕРКА НАСТРОЕК

### Команды для тестирования:
```bash
# Общий health check
curl localhost:3000/api/health?detailed=true

# Проверка переменных (показывает какие настроены)
curl localhost:3000/api/debug-env

# Тест AI (должен работать с GEMINI_API_KEY)
curl localhost:3000/api/assistant/test

# Тест Telegram
curl -X POST localhost:3000/api/telegram-test

# Тест отправки формы
curl -X POST localhost:3000/api/contact-form \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
```

---

## 💰 СТОИМОСТЬ ПО УРОВНЯМ

### 🔴 Минимальный уровень: ~$15-25/месяц
- Хостинг (Vercel Pro): $20
- Gemini API: $5-10
- Остальное: Бесплатно

### 🟠 Рекомендуемый уровень: ~$35-60/месяц  
- Минимальный +
- Email сервис: $10-15
- Sentry: $0-10
- Analytics: Бесплатно

### 🟡 Полный уровень: ~$80-150/месяц
- Рекомендуемый +
- База данных: $15-25
- Дополнительные AI: $20-50
- CRM интеграции: $10-30

### 🟢 Максимальный уровень: ~$200-500/месяц
- Полный +
- Платежи: комиссии
- Все инструменты: $50-200
- Enterprise поддержка

---

## ⚠️ TROUBLESHOOTING

### Частые проблемы:
| Проблема | Причина | Решение |
|----------|---------|---------|
| AI не отвечает | Нет/неверный GEMINI_API_KEY | Проверить ключ на ai.google.dev |
| Админка не открывается | Неверный ADMIN_PASSWORD_HASH | Перегенерировать пароль |
| Нет уведомлений | Неверные Telegram токены | Проверить через getUpdates |
| Формы не отправляются | Проблемы SMTP | Проверить пароль приложения |
| 500 ошибки | Проблемы переменных | Проверить /api/debug-env |

---

## 🎯 ЧЕКЛИСТ ГОТОВНОСТИ

### Перед запуском проверьте:
- [ ] ✅ GEMINI_API_KEY настроен и работает
- [ ] ✅ JWT_SECRET сгенерирован (64+ символов)  
- [ ] ✅ ADMIN_PASSWORD_HASH создан
- [ ] ✅ NEXT_PUBLIC_SITE_URL указан правильно
- [ ] ✅ Telegram бот создан и токены получены
- [ ] ✅ SMTP настроен для email
- [ ] ✅ Google Analytics подключен
- [ ] ✅ Sentry настроен для мониторинга
- [ ] ✅ Health check возвращает "healthy"
- [ ] ✅ Все тесты API проходят успешно

---

## 📞 ПОДДЕРЖКА

**При возникновении проблем**:
1. Проверьте этот чеклист ✅
2. Запустите тесты API 🧪  
3. Посмотрите логи Sentry 📊
4. Проверьте документацию провайдеров 📖

**🎉 С правильно настроенными ключами NeuroExpert готова покорять мир!**

---

*Полный чеклист подготовлен главным разработчиком Claude*  
*NeuroExpert Development Team*  
*Январь 2025*