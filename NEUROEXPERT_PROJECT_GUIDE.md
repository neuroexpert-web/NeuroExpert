# NeuroExpert — Полный путеводитель по платформе (v3.1.1)

Добро пожаловать в NeuroExpert — AI‑платформу для цифровизации бизнеса. Этот документ — ваш главный путеводитель: от концепции и архитектуры до запуска, деплоя, безопасности и сопровождения. Он основан на фактическом содержимом репозитория и служит единым источником правды для команды, управляющего и новых участников.

---

## 1. Миссия, ценность и аудитория
- **Миссия**: ускорить цифровую трансформацию бизнеса через набор готовых AI‑инструментов (аналитика, ассистент, калькуляторы, процессные модули) с премиальным UX.
- **Ценность**:
  - Быстрый старт: разворачивается за минуты, масштабируется по мере роста.
  - Премиум фронтенд c высокой конверсией (анимации, микро‑интеракции, когнитивная архитектура).
  - Интеграции с AI‑провайдерами (Gemini/Anthropic/OpenAI/OpenRouter), телеметрия и мониторинг.
- **Аудитория**: SMB и продуктовые команды, консультанты, интеграторы, внутренние департаменты компаний.

## 2. Ключевые возможности
- 10 полноэкранных страниц (см. README): Главная, Аналитика, Аудитория, Процессы, Решения, Безопасность, О нас, Цены (ROI/PRICING), Контакты, Визуальная Студия.
- AI‑ассистент на базе Gemini (и альтернативных провайдеров).
- Интерактивные калькуляторы (ROI/ценовые сценарии) с визуализацией.
- Serverless‑функции для форм/уведомлений/аналитики.
- Наблюдаемость: Sentry, health‑чек, телеграм‑нотификации.

## 3. Архитектура (обзор)
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5.
  - Ключевые файлы: `app/page.js`, `app/layout.js`, `app/globals.css`, `next.config.js`, `server.js`.
- **API (Next.js)**: каталог `app/api/*` (в т.ч. `health`, `contact-form`, `assistant/test`, `systemmetrics`, `analytics`, `telegram-*`, `debug-env`, `test-*`).
- **Serverless (Netlify)**: `netlify/functions/*` — ассистент, контакт‑формы, аналитика, Telegram.
- **Backend (опционально)**: Python‑заготовки `auth.py`, `database.py` (FastAPI/SQLAlchemy); финализировать при включении в релиз.
- **Инфраструктура**:
  - CI/CD: GitHub Actions (линт/тесты/coverage/сборка/деплой/Lighthouse/security‑scan).
  - Деплой: Vercel/Netlify/Render; Docker; Nginx для RU‑хостинга.

## 4. Структура репозитория (сжатая)
```text
app/                 # Next.js App Router (страницы, API, утилиты)
  api/               # Эндпоинты (health, forms, assistant/test, analytics, ...)
  components/        # UI‑компоненты
  styles/            # Стили
  middleware/        # Промежуточная логика
  utils/             # Хелперы (логирование, CORS, интеграции)
netlify/functions/   # Serverless‑функции (assistant, contact-form, analytics, telegram)
public/              # Статика, PWA, _headers/_redirects
.github/workflows/   # CI/CD pipelines (ci.yml, ci-cd-complete.yml, deploy-production.yml)
Dockerfile, docker-compose.yml, render.yaml, vercel.json, nginx.conf
SECURITY.md, README.md, docs/*, qa/checklist.md
```

## 5. Быстрый старт (5 минут)
Требования: Node.js ≥ 18, npm ≥ 9 (Docker/Python — опционально).
```bash
npm install
npm run dev         # открыть http://localhost:3000
```
Сборка и запуск прод:
```bash
npm run build
npm start
```
Тесты и проверки:
```bash
npm test -- --ci --coverage
npx playwright test
pytest tests/ -v --cov=./ --cov-report=xml   # если используете Python‑часть
npm run lint && npm run type-check && npm run format:check
```

## 6. Конфигурация и переменные окружения
Минимально необходимые для релиза (в хостинге/CI, не коммитить .env):
- Доступ/безопасность: `JWT_SECRET` (≥32), `ADMIN_PASSWORD_HASH` (см. ниже), `SECRET_KEY` (Python), `NEXTAUTH_SECRET` (если нужно).
- Интеграции: `GOOGLE_GEMINI_API_KEY`/`GEMINI_API_KEY`/`NEXT_PUBLIC_GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`.
- Телеметрия/маркетинг: `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID`.
- Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- База/кэш: `DATABASE_URL` или набор `POSTGRES_*`, `REDIS_URL`/`REDIS_PASSWORD`.
- Параметры: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`.

Генерация хеша пароля админа:
```bash
node scripts/generate-password-hash.js
# скопируйте ADMIN_PASSWORD_HASH в секреты окружения
```

## 7. Сборка, запуск, скрипты
Основные команды (`package.json`):
- `dev`, `build`, `start`, `start:render`, `build:render`, `export`.
- Качество: `lint`, `lint:fix`, `type-check`, `format`, `format:check`.
- Тесты: `test`, `test:watch`, `test:coverage`, `test:e2e`, `test:e2e:ui`.
- Прочее: `prepare` (husky), `check:all`, `fix:all`.

## 8. Деплой и хостинг
Поддерживаются несколько вариантов, выберите основной.
- **Vercel**: автодеплой из GitHub, `vercel.json` (framework: nextjs).
- **Netlify**: сборка Next, управление заголовками/редиректами через `public/_headers` и `public/_redirects`.
- **Render**: см. `render.yaml` (build: `npm run build:render`, start: `npm run start:render`, `PORT=10000`).
- **Docker**:
  - `Dockerfile` — multi‑stage, non‑root, healthcheck; рекомендуется включить standalone‑сборку Next.
  - Пример:
```js
// next.config.js (дополнительно)
/** @type {import('next').NextConfig} */
const nextConfig = { output: 'standalone' };
module.exports = nextConfig;
```
- **Nginx (RU‑хостинг)**: `nginx.conf` с SSL/HSTS/CSP, прокси на 3000, расширенные таймауты для `/api`.

> Внимание: текущий `docker-compose.yml` ссылается на отсутствующие артефакты (`Dockerfile.python`, `scripts/init-db.sql`, `scripts/backup.sh`, `monitoring/*`). Для использования compose либо добавьте файлы, либо упростите состав до `app` (+ `db`).

## 9. CI/CD (GitHub Actions)
Workflows: `.github/workflows/ci.yml`, `ci-cd-complete.yml`, `deploy-production.yml`.
- Этапы: линт, тесты FE/BE, coverage (Codecov), сборка, Lighthouse‑аудит, security‑скан (Snyk/TruffleHog), деплой (Netlify/Vercel/Render/Railway), уведомления в Telegram.
- Secrets CI: токены хостингов (Netlify/Vercel/Render/Railway), `SNYK_TOKEN`, а также ключи интеграций (Gemini/JWT/ADMIN_PASSWORD_HASH и пр.).
- Политика gate: сейчас в `next.config.js` включен игнор ошибок ESLint/TS при сборке — рекомендуется отключить для prod.

## 10. API — обзор и примеры
Основные Next.js API‑роуты расположены в `app/api/*`.
- `GET /api/health` — статус сервиса (исп. в health‑чеках, LB/мониторинге).
- `POST /api/contact-form` — прием данных формы, опционально Telegram нотификация.
- `GET /api/assistant/test` — проверка наличия AI‑ключей, статуса окружения.
- `GET /api/test-env` — диагностика env переменных (dev‑инструмент).
- `GET /api/analytics/*` — заготовки для аналитики, системные метрики (`systemmetrics`).

Пример запроса формы:
```bash
curl -X POST https://<host>/api/contact-form \
  -H 'Content-Type: application/json' \
  -d '{"name":"User","email":"u@example.com","message":"Hello"}'
```

Serverless‑функции (Netlify): `netlify/functions/*` — ассистент, формы, аналитика, голосовые формы, Telegram.

## 11. Интеграции
- **AI**: Gemini (`GOOGLE_GEMINI_API_KEY`/`GEMINI_API_KEY`/`NEXT_PUBLIC_GEMINI_API_KEY`), Anthropic (`ANTHROPIC_API_KEY`), OpenAI (`OPENAI_API_KEY`), OpenRouter (`OPENROUTER_API_KEY`).
- **Коммуникации**: Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
- **Наблюдаемость**: Sentry (`SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`).
- **Маркетинг**: Google Analytics (`NEXT_PUBLIC_GA_ID`), Yandex Metrika (`NEXT_PUBLIC_YM_ID`).

## 12. Тестирование и качество
- **Unit/Component**: Jest + Testing Library.
- **E2E**: Playwright (headless/CI, UI‑режим локально).
- **Backend (опц.)**: pytest (`tests/test_auth.py`, `tests/test_main.py`).
- **Стандарты**: ESLint, Prettier, `type-check`.
- **Ручной QA**: см. `qa/checklist.md` (дополнять под релиз).
- **Цели покрытия**: рекомендуется установить порог для критичных модулей (≥60%).

## 13. Безопасность
- Секреты вне кода, ротация каждые 90 дней, доступы по принципу наименьших привилегий.
- Пароль админа — только через `ADMIN_PASSWORD_HASH` (генерация скриптом), без хардкодов.
- JWT: корректная подпись/exp, минимизация рисков XSS (хранение токена/куки).
- Rate limiting (Node/Python): включить и откалибровать под нагрузки.
- Заголовки: CSP/HSTS/Referrer/CTO/Frame‑Options (в `nginx.conf` и/или на хостинге).
- Security‑сканы: `npm audit`, Snyk; поиск секретов (TruffleHog) в CI.
- См. подробности: `SECURITY.md`.

## 14. Мониторинг и алерты
- Health‑чек: `/api/health` — подключить к балансировщику/аптайм‑монитору.
- Sentry (client/server/edge): DSN и `tracesSampleRate` для prod, фильтрация служебных ошибок.
- Telegram‑нотификации: для инцидентов/деплоев (см. serverless/скрипты).
- (Опц.) Prometheus/Grafana — добавить конфиги `monitoring/*` или исключить из compose.

## 15. Производительность и UX
- Lighthouse ≥ 90 по Performance/Best Practices/SEO.
- Кэширование: `_next/static` — immutable, заголовки Cache‑Control, long‑term caching; статика через CDN (если есть).
- Оптимизация бандла: критический CSS, tree‑shaking, оптимизация изображений.
- Микро‑анимации и премиум‑стили (см. `app/globals.css`, `docs/README_Design.md`).

## 16. Доступность (A11y)
- Базовое соответствие WCAG 2.1 AA для ключевых сценариев.
- Навигация с клавиатуры, фокус‑индикаторы, семантика, контраст, ARIA где необходимо.

## 17. Управление изменениями
- Ветвление: `main` (prod), `develop` (stage).
- Семантическое версионирование (текущая: v3.1.1), changelog.
- Code review, статпроверки на PR, требования к тестам.
- Политика ошибок ESLint/TS: рекомендовано сделать сборку строгой для prod.

## 18. Roadmap (пример)
- 0–2 недели: выбор основного деплой‑канала, заполнение secrets, строгая сборка, упрощение/починка compose, решение по Python‑API.
- 2–4 недели: расширение Playwright smoke, пороги coverage, усиление Sentry/алертов, финализация дизайна витринных страниц.
- 1–2 месяца: real‑time (WebSocket), расширенные интеграции, KPI‑панель для управляющего.

## 19. FAQ и устранение неполадок
- Не запускается dev: `node -v` (≥18), `npm ci`, очистка кэша, `NEXT_TELEMETRY_DISABLED=1`.
- Не работает ассистент: проверить `GOOGLE_GEMINI_API_KEY`/`GEMINI_API_KEY` и лимиты провайдера.
- Нет уведомлений Telegram: убедиться в `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` и логах.
- Ошибки сборки на CI: привести версии Node, проверить игнор ESLint/TS, Sentry DSN.
- Docker не стартует: включить `output: 'standalone'` в Next или адаптировать Dockerfile; упростить compose.

## 20. Глоссарий
- App Router — файловая система маршрутизации Next 13+.
- Serverless‑функции — функции, исполняемые в среде провайдера (Netlify Functions).
- Health‑чек — эндпоинт/проверка доступности сервиса для мониторинга и LB.
- DSN — ключ проекта для Sentry.

## 21. Ссылки и материалы
- `README.md` — обзор и быстрый старт
- `PROJECT_MANAGER_CHECKLIST.md` — управленческий чек‑лист
- `LAUNCH_READY_CHECKLIST.md` — чек‑лист готовности к запуску
- `SECURITY.md` — политика безопасности и рекомендации
- `docs/*` — дизайн, интеграции, прод‑гайды, отчеты
- `qa/checklist.md` — ручной QA‑набор

---

Если вы управляющий или новый участник — начните с разделов Быстрый старт, Переменные окружения и Деплой. По мере развития проекта обновляйте этот документ (архитектура/деплой/политики качества), чтобы он оставался единой актуальной точкой входа в NeuroExpert.