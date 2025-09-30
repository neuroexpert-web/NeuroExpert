# 🚀 БЫСТРЫЙ СТАРТ - АВТОМАТИЗИРОВАННАЯ РАЗРАБОТКА

## 1️⃣ Установка за 2 минуты:

```bash
# Установите все зависимости
npm install

# Установите дополнительные инструменты
npm install -D @playwright/test concurrently
```

## 2️⃣ Запустите ВСЁ одной командой:

```bash
npm run dev:all
```

Это запустит:
- 🌐 Приложение на http://localhost:3000
- 🎨 Storybook на http://localhost:6006 (если установлен)
- 🧪 Тесты в режиме watch

## 3️⃣ Используйте Cursor Composer:

### Генерация новой страницы:
```
Cmd+K → "Create a dashboard page with sidebar navigation, stats cards, charts, and user table"
```

### Генерация компонента:
```
Cmd+K → "Create a premium pricing card with glassmorphism, hover effects, and gradient border"
```

### Добавление функционала:
```
Cmd+K → "Add dark mode toggle with system preference detection and localStorage persistence"
```

## 4️⃣ Визуальное тестирование:

```bash
# Откройте UI режим Playwright
npx playwright test --ui

# Запишите новый тест
npx playwright codegen localhost:3000
```

## 5️⃣ Горячие клавиши Cursor:

- **Cmd+K** - Генерация кода AI
- **Cmd+L** - Чат с AI
- **Cmd+I** - Inline редактирование
- **Cmd+Shift+P** → "Tasks: Run Task" - Быстрые команды

## 6️⃣ DevTools в браузере:

Добавьте в layout.js:
```jsx
import DevTools from './components/DevTools';

// В конце body
{process.env.NODE_ENV === 'development' && <DevTools />}
```

## 🎯 Примеры промптов для Cursor:

```
1. "Create a modern landing page with animated hero, features grid, testimonials, and CTA"
2. "Add authentication with JWT, login/register forms, and protected routes"
3. "Create admin dashboard with user management, analytics charts, and activity logs"
4. "Add real-time notifications with toast messages and sound alerts"
5. "Create e-commerce product catalog with filters, search, and shopping cart"
```

**Всё готово! Просто опишите что хотите, и Cursor сгенерирует код!** 🚀