## Project Manager Checklist — NeuroExpert v3.1.1

Короткая ссылка для управляющего: этот файл — ваша точка входа. По нему вы проверяете готовность релизов, статус инфраструктуры, секретов, качества, безопасности и метрик. Все пункты сформированы по фактическому содержимому репозитория.

### Быстрые ссылки
- **README**: [`README.md`](README.md)
- **Готовность к запуску**: [`LAUNCH_READY_CHECKLIST.md`](LAUNCH_READY_CHECKLIST.md)
- **Полный аудит**: [`COMPLETE_AUDIT_REPORT_2025.md`](COMPLETE_AUDIT_REPORT_2025.md)
- **Безопасность**: [`SECURITY.md`](SECURITY.md)
- **CI/CD**: [`.github/workflows/ci.yml`](.github/workflows/ci.yml), [`.github/workflows/ci-cd-complete.yml`](.github/workflows/ci-cd-complete.yml), [`.github/workflows/deploy-production.yml`](.github/workflows/deploy-production.yml)
- **Инфраструктура**: [`Dockerfile`](Dockerfile), [`docker-compose.yml`](docker-compose.yml), [`nginx.conf`](nginx.conf), [`render.yaml`](render.yaml), [`vercel.json`](vercel.json)
- **Приложение**: каталог [`app/`](app/), API [`app/api`](app/api), serverless [`netlify/functions`](netlify/functions)
- **QA**: [`qa/checklist.md`](qa/checklist.md)
- **Python (опционально)**: [`auth.py`](auth.py), [`database.py`](database.py)

---

## 1) Управление и ответственность
- [ ] Утвердить роли: продукт, фронтенд, бэкенд (Python), DevOps, безопасность, QA, дизайн, поддержка
- [ ] Назначить резервных исполнителей и канал эскалаций (чат/почта, часы реакции)
- [ ] RACI на процессы: релизы, инциденты, деплой, ключи, миграции, откаты
- [ ] Еженедельные синки, правила актуализации документации при изменениях

## 2) Цели релиза и KPI
- [ ] Подтвердить состав «10 страниц» (см. README)
- [ ] KPI: uptime ≥ 95%, AI ответ < 1s, NPS ≥ 9.5, конверсия +15–25%
- [ ] Критерии приемки: smoke‑набор пройден, ошибки консоли = 0, Lighthouse ≥ целевых

## 3) Архитектура (факт)
- **Frontend**: Next.js 14.2.13 (App Router), React 18, TypeScript 5
- **Ключевые файлы**: `app/page.js`, `app/layout.js`, `app/globals.css`, `next.config.js`, `server.js`
- **Наблюдаемость**: Sentry (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`)
- **API (Next.js)**: `app/api/*` (в т.ч. `health`, `contact-form`, `assistant/test`, `systemmetrics`, `analytics`, `telegram-*`, `debug-env`)
- **Serverless (Netlify)**: `netlify/functions/*` — ассистент, формы, аналитика, Telegram
- **Python (опц.)**: `auth.py`, `database.py` (нет `main.py`/моделей — решение требуется)

## 4) Ветки и окружения
- [ ] Ветвление: `main` (prod), `develop` (stage)
- [ ] Envs: local, preview, staging, production
- [ ] Описать различия конфигураций и ограничения для каждого окружения

## 5) Зависимости и версии
- [ ] Node: 18.x (CI), 20 (Docker) — выровнять целевую версию
- [ ] FE: Next 14.2.13, React 18.2, TypeScript 5.3.x
- [ ] QA/линт: Jest, Testing Library, Playwright, ESLint, Prettier
- [ ] Python: FastAPI, SQLAlchemy 2, Alembic, asyncpg (`requirements.txt`)
- [ ] Регулярный security‑скан: `npm audit`/Snyk (подключено в CI)

## 6) Сборка и запуск
```bash
# Локально (FE)
npm install
npm run dev         # http://localhost:3000
npm run build && npm start

# Тесты
npm test -- --ci --coverage
npx playwright test
pytest tests/ -v --cov=./ --cov-report=xml

# Статпроверки
npm run lint
npm run type-check
npm run format:check
```

## 7) Конфигурация и секреты (must‑have)
- [ ] Безопасность/доступ: `JWT_SECRET` (≥32), `ADMIN_PASSWORD_HASH` (генерировать `node scripts/generate-password-hash.js`), `SECRET_KEY` (Python), `NEXTAUTH_SECRET`
- [ ] Интеграции: `GOOGLE_GEMINI_API_KEY`/`GEMINI_API_KEY`/`NEXT_PUBLIC_GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- [ ] База/кэш: `DATABASE_URL` или `POSTGRES_*`, `REDIS_URL`/`REDIS_PASSWORD`
- [ ] Параметры: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`
- [ ] Секреты заданы в GitHub Actions/Netlify/Vercel/Render и локально (.env не коммитить)

## 8) Инфраструктура и деплой
- [ ] Выбрать основной канал деплоя (Netlify/Vercel/Render) и зафиксировать
- Netlify: заголовки/редиректы через `public/_headers`, `public/_redirects`
- Render: см. `render.yaml` (build/start, `PORT=10000`)
- Vercel: `vercel.json` (framework: nextjs)
- Nginx (RU‑хостинг): `nginx.conf` (SSL/HSTS/CSP, прокси на 3000, таймауты `/api`)

## 9) Docker и Compose
- Образ: `Dockerfile` (multi‑stage, non‑root, healthcheck). Для корректного рантайма Next рекомендуется включить standalone‑сборку:
```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};
module.exports = nextConfig;
```
- Compose: `docker-compose.yml` — сейчас ссылается на отсутствующие файлы: `Dockerfile.python`, `scripts/init-db.sql`, `scripts/backup.sh`, `monitoring/*`
  - [ ] Либо добавить недостающие артефакты
  - [ ] Либо упростить состав до `app` (+ `db`) и отключить `api`, `monitoring`, `backup`

## 10) CI/CD (GitHub Actions)
- Основные workflows: `ci.yml`, `ci-cd-complete.yml`, `deploy-production.yml`
- Джобы: линт, тесты FE/BE, coverage (Codecov), сборка, Lighthouse, security scan, деплой (Netlify/Vercel/Render/Railway)
- Секреты CI: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `VERCEL_*`, `RENDER_API_KEY`, `RENDER_SERVICE_ID`, `SNYK_TOKEN`, а также ключи интеграций (Gemini/JWT/ADMIN_PASSWORD_HASH и пр.)
- [ ] Политика gate: в `next.config.js` сейчас `eslint.ignoreDuringBuilds = true`, `typescript.ignoreBuildErrors = true` — решить, отключать в проде

## 11) Тестирование и QA
- Unit/Component (Jest, Testing Library): пороги покрытия минимум для критичных модулей (рекомендация ≥60%)
- E2E (Playwright): smoke‑набор (навигация, формы, ассистент, health), headless в CI
- Backend (pytest): есть `tests/test_auth.py`, `tests/test_main.py` — расширить или отключить Python‑API на релиз
- Ручной чек‑лист: см. `qa/checklist.md` — дополнить ответственными и приоритетами

## 12) Наблюдаемость и алерты
- Health‑чек: `app/api/health/route.js` — подключить к LB/мониторингу
- Sentry (client/server/edge): DSN в env, sampleRate для prod
- Логи: структура, уровни, исключение PII; Telegram нотификации для инцидентов
- Prometheus/Grafana: либо добавить `monitoring/*`, либо исключить из compose

## 13) Безопасность
- Секреты вне кода, ротация ≥ каждые 90 дней
- Пароль админа — только `ADMIN_PASSWORD_HASH`, без хардкодов
- JWT: подпись/exp, хранение токена (минимизация XSS‑рисков)
- Rate limiting: включить и настроить (Node/Python)
- Заголовки: CSP/HSTS/Referrer/CTO/Frame‑Options (Nginx/хостинг)
- Зависимости: `npm audit`, Snyk; Secret‑scan (TruffleHog) включён в CI

## 14) Данные и база
- PostgreSQL: `DATABASE_URL`/`POSTGRES_*`
- Миграции: Alembic (если Python‑API включён)
- Бэкапы: регламент/ретеншн, тест восстановления
- Политики PII, соответствие GDPR/152‑ФЗ (если применимо)

## 15) Производительность
- Lighthouse ≥ 90 на Performance/Best Practices/SEO
- Кэширование: `_next/static` immutable, заголовки Cache‑Control
- Оптимизация бандла: критический CSS, tree‑shaking, изображения
- Gzip/Brotli, CDN (если применимо), бюджет по размерам бандла

## 16) Доступность (A11y)
- Соответствие WCAG 2.1 AA для ключевых страниц
- Навигация с клавиатуры, фокус‑стили, контраст, ARIA‑атрибуты

## 17) Документация и процессы
- Актуализировать `README.md` (убрать неиспользуемые упоминания `netlify.toml`)
- Синхронизировать фактическую инфраструктуру и документы в `docs/*`
- Runbooks: деплой/откат/инциденты/миграции/ротация ключей

## 18) Релизы и откаты
- Семантическая версия (текущая: v3.1.1), обновлять changelog
- Pre‑deploy чек‑лист: `LAUNCH_READY_CHECKLIST.md`
- Rollback план (технический и процедурный), флаги фич при необходимости

## 19) Инциденты и SLO
- SLO/SLA: целевые значения и окно измерения
- Дежурства/эскалация, post‑mortem шаблон и архив

## 20) Стоимость и бюджеты
- Хостинги (Netlify/Vercel/Render/Railway): лимиты/квоты/платные планы
- Мониторинг/алерты (Sentry, Telegram), AI‑ключи (биллинг), трафик/CDN
- Резерв 10–20% на непредвиденные расходы

## 21) Риски и решения (специфика этого репозитория)
- [ ] `docker-compose.yml` указывает на отсутствующие артефакты: `Dockerfile.python`, `scripts/init-db.sql`, `scripts/backup.sh`, `monitoring/*` — добавить или упростить состав до `app` (+ `db`)
- [ ] Включить `output: 'standalone'` в `next.config.js` (или скорректировать Dockerfile)
- [ ] Решить судьбу Python‑API: включаем (дописать `main.py`/модели/ручки/миграции/CI) или исключаем из релиза
- [ ] Политика ошибок ESLint/TS на прод: отключить игнор и сделать сборку строгой
- [ ] Привести документацию в соответствие фактам (убрать неактуальные упоминания)

## 22) Definition of Done (релиз готов)
- [ ] Секреты заданы, health зелёный, Sentry события приходят
- [ ] CI зелёный: линт/типизация/тесты, coverage ≥ целевого порога
- [ ] Lighthouse ≥ целевых значений, ошибок консоли нет
- [ ] Документация и runbooks актуальны
- [ ] Процедуры деплоя и отката проверены
- [ ] Каналы поддержки/алертов подключены

## 23) 7‑дневный план улучшений (пример)
1. Деплой‑канал: выбрать основной, заполнить все secrets, протестировать прод‑деплой
2. Привести `docker-compose.yml` к рабочему виду или упростить
3. Включить строгий режим сборки (ESLint/TS), исправить предупреждения
4. Добавить `output: 'standalone'` в Next или адаптировать Dockerfile
5. Принять решение по Python‑API: внедрить/исключить
6. Расширить Playwright smoke‑набор, установить пороги coverage
7. Настроить алерты (Sentry/Telegram) и финальный Lighthouse аудит

## Приложение: полезные материалы
- Архитектура/дизайн: [`docs/README_Design.md`](docs/README_Design.md)
- Технические гайды: каталог [`docs/`](docs)
- Статус репозитория: [`REPOSITORY_STATUS.md`](REPOSITORY_STATUS.md)

---

Обслуживание файла: обновляйте при изменениях инфраструктуры, политик качества и релизного процесса. Этот чек‑лист — единая точка правды для управляющего.