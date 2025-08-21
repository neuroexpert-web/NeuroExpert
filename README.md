
# NeuroExpert - AI-Powered Business Platform 🚀

## 🚀 Быстрое развертывание

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/nextjs)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/aineuroexpert-cell/AI-Audit)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aineuroexpert-cell/AI-Audit)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/aineuroexpert-cell/AI-Audit)

## 📋 О проекте

**NeuroExpert** - это современная платформа для цифровизации бизнеса с использованием искусственного интеллекта. Платформа предоставляет комплексные решения для автоматизации бизнес-процессов, аналитики и управления.

### 🎯 Основные возможности:

- **AI Управляющий платформы** - интеллектуальный помощник на базе Google Gemini AI
- **ROI Калькулятор** - расчет экономической эффективности внедрения
- **Панель администратора** - управление и мониторинг системы
- **Интеграция с Telegram** - уведомления и управление через бота

> **Профессиональная платформа для экспертной автоматизации аудита и внедрения цифровых решений**

[![CI/CD Pipeline](https://github.com/your-org/neuroexpert/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/neuroexpert/actions/workflows/ci.yml)
[![Security](https://img.shields.io/badge/security-enhanced-green)](./SECURITY.md)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](./app/components/__tests__)

## ✨ Основные возможности

🧮 **Калькулятор ROI** с динамической подсветкой и анимациями  
🤖 **AI Ассистент** на базе Gemini API с эффектом печатания  
❓ **FAQ система** для быстрых ответов  
🎉 **Премиум Pop-up** с градиентным дизайном  
🎨 **WOW-эффекты** и микро-анимации по стандартам Titan Level  

## 🚀 Быстрый старт

### Установка и запуск
```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Открыть http://localhost:3000
```

### Сборка для продакшена
```bash
npm run build
```

## 🌐 Деплой на Netlify

1. **Подключение репозитория:**
   - New site from Git → выберите ваш GitHub репозиторий
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Настройка переменных окружения:**
   - Site configuration → Environment variables
   - Добавьте: `GEMINI_API_KEY` = ваш ключ Gemini API

3. **Автоматический деплой:**
   - `netlify.toml` уже настроен для Next.js
   - При каждом push в main ветку происходит автоматический деплой

## 📦 Структура проекта

```
neuroexpert/
├── app/                    # Next.js App Router
│   ├── layout.js          # Главный layout с метаданными
│   ├── page.js            # Домашняя страница с компонентами
│   └── globals.css        # Премиум стили с анимациями
├── netlify/
│   └── functions/
│       └── assistant.js   # Serverless функция для Gemini API
├── docs/                  # Документация
│   ├── README_Design.md   # Self-Learning Design System
│   ├── README_AI-Audit.md # Техническое описание AI модуля
│   └── Technical_Assignment_AI-Audit.md # ТЗ
├── qa/                    # QA материалы
│   └── checklist.md       # Чек-лист для тестирования
├── public/                # Статические файлы
│   ├── favicon.ico        # Иконка сайта
│   └── _redirects         # Netlify redirects
├── package.json           # Зависимости Node.js
├── netlify.toml          # Конфигурация Netlify
└── README.md             # Этот файл
```

## 🎨 Дизайн и UX

### Принципы дизайна
- **Нейро-маркетинг**: триггеры безопасности, достижения, персонализации
- **WOW-эффекты**: плавные анимации, градиенты, микро-интерактивность
- **Когнитивная архитектура**: четкая иерархия, визуальные якоря
- **Эмоциональное вовлечение**: динамические состояния, обратная связь

### Цветовая схема
```css
/* Премиум темная тема */
--bg: #0b0f17          /* Глубокий фон */
--accent: #7dd3fc      /* Небесно-голубой акцент */
--card: #121826        /* Карточки */
--text: #e7ecf3        /* Основной текст */
```

## ⚙️ API и интеграции

### Gemini AI Assistant
- **Endpoint**: `/.netlify/functions/assistant`
- **Method**: POST
- **Body**: `{"question": "ваш вопрос"}`
- **Response**: `{"answer": "ответ от Gemini"}`

### FastAPI Backend (опционально)
- **Главный сервер**: `main.py`
- **Авторизация**: `auth.py` (JWT, bcrypt, OAuth2)
- **База данных**: `database.py` (PostgreSQL + SQLAlchemy)
- **Модели**: `models.py` (User, Audit)

## 🧪 Тестирование

### Frontend тестирование
```bash
# Ручное тестирование по чек-листу
# См. qa/checklist.md
```

### Backend тестирование
```bash
# Запуск Python тестов
pytest tests/
```

## 📈 Метрики и критерии успеха

- **SLA**: 95%+ uptime
- **Performance**: <1s latency для AI ответов
- **UX**: NPS 9.5+ (satisfaction score)
- **Conversion**: 15-25% рост благодаря WOW-эффектам
- **ROI**: 300%+ для клиентов

## 🔒 Безопасность

### Последние улучшения (Январь 2025):
- ✅ **Серверная авторизация админки** - убран хардкод пароля
- ✅ **JWT токены** с валидацией и истечением срока
- ✅ **bcrypt хеширование** паролей
- ✅ **Переменные окружения** без дефолтных значений
- ✅ **Security headers** в конфигурации
- ✅ **Тесты безопасности** в CI/CD pipeline
- ✅ **ESLint + Prettier** для качества кода

Подробнее см. [SECURITY.md](./SECURITY.md)



## 📚 Документация

- 📖 [Дизайн-система](docs/README_Design.md) — подробное описание UI/UX
- 🛠 [Техническое задание](docs/Technical_Assignment_AI-Audit.md) — требования и задачи
- ❓ [FAQ](docs/FAQ_AI-Audit.md) — часто задаваемые вопросы
- 📋 [QA Чек-лист](qa/checklist.md) — список проверок

## 👥 Команда и роли

- **Управляющий**: координация экспертов, связь с клиентом
- **Екатерина**: Lead Experience Architect, дизайн-система
- **Степан**: Full-stack разработка, AI интеграция
- **Алексей**: аналитика, архитектура, документация

## 🆘 Поддержка

### Быстрые решения проблем
- **Не работает ассистент?** → Проверьте GEMINI_API_KEY в Netlify
- **Ошибки сборки?** → `npm install` и проверьте Node.js 18+
- **Стили не применяются?** → Очистите кэш браузера
- **404 на Netlify?** → Проверьте файл `public/_redirects`

### Контакты
- � Email поддержки
- 💬 Чат команды
- 📋 Task board для багов и улучшений

---

**� Проект полностью готов к производственному использованию**

Создан в соответствии с методологией **NeuroExpert Orchestrator v3.0**  
Все компоненты протестированы и соответствуют критериям **Titan Level**
# 08/12/2025 02:51:50