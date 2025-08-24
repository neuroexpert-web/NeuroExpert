# Анализ структуры проекта NeuroExpert

## Общая информация
- **Фреймворк**: Next.js 14.2.0
- **UI библиотека**: React 18.2.0
- **Язык**: JavaScript/TypeScript
- **Стилизация**: CSS модули, styled-jsx
- **AI интеграции**: Google Gemini AI, Claude (через API)

## Структура страниц

### Основные страницы
1. **app/page.js** - Главная страница (текущая активная версия)
2. **app/page.premium.js** - Премиум версия страницы
3. **app/page.new.js** - Новая версия страницы
4. **app/page.optimized.js** - Оптимизированная версия
5. **app/page.backup.js** - Резервная копия
6. **app/test-ai-agents/page.js** - Тестовая страница AI агентов

### Ключевые компоненты
1. **NeuroExpertHero** - Главный hero блок с анимацией нейросети
2. **AIDirectorCapabilities** - Блок возможностей AI директора
3. **JourneySection** - Секция "Ваш путь к результату"
4. **WhyUsSection** - Секция "Почему мы"
5. **PricingSection** - Секция с тарифами
6. **ROICalculator** - Калькулятор ROI
7. **ContactForm** - Форма обратной связи
8. **SmartFloatingAI** - Плавающий AI ассистент
9. **AdminPanel** - Административная панель

### API эндпоинты
1. **/api/contact-form** - Обработка формы контактов
2. **/api/assistant** - AI ассистент
3. **/api/telegram-notify** - Отправка уведомлений в Telegram
4. **/api/claude-balance** - Проверка баланса Claude API
5. **/api/test-gemini** - Тестирование Gemini API
6. **/api/admin/auth** - Аутентификация админа
7. **/api/ai-agent** - AI агенты

### Стили
1. **globals.css** (3060 строк) - Основные глобальные стили
2. **premium-design-system.css** - Дизайн система
3. **premium-effects.css** - Премиум эффекты
4. **premium-glass-sections.css** - Стеклянные секции
5. **mobile-fixes.css** - Фиксы для мобильных
6. **critical.css** - Критические стили

### Конфигурация
1. **next.config.js** - Конфигурация Next.js с CSP и оптимизациями
2. **vercel.json** - Настройки деплоя на Vercel
3. **docker-compose.yml** - Docker конфигурация с PostgreSQL и Redis
4. **netlify.toml** - Настройки Netlify

## Особенности проекта
1. **Динамические импорты** - Используются для оптимизации загрузки
2. **SSR отключен** для некоторых компонентов
3. **Множественные версии страниц** для A/B тестирования
4. **Интеграция с Telegram** для уведомлений
5. **AI интеграции** с Gemini и Claude
6. **Премиум дизайн** с анимациями и эффектами
7. **Адаптивность** для мобильных устройств

## Готовность к правкам
Проект имеет четкую структуру с разделением на:
- Страницы (в директории app)
- Компоненты (в app/components)
- API маршруты (в app/api)
- Стили (в app/styles и globals.css)

Каждая страница и компонент могут быть отредактированы независимо благодаря модульной архитектуре.