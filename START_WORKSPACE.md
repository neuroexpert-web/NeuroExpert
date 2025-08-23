# 🚀 ПОШАГОВЫЙ ЗАПУСК РАБОЧЕГО ПРОСТРАНСТВА

## ШАГ 1: Проверка и установка зависимостей

Откройте терминал в Cursor (внизу окна) и выполните:

```bash
# Проверяем, все ли установлено
npm install

# Если ошибки, попробуйте
npm install --legacy-peer-deps
```

## ШАГ 2: Запуск основного приложения

### Вариант А: Простой запуск (рекомендую для начала)
```bash
npm run dev
```

Откроется на http://localhost:3000

### Вариант Б: Турбо-режим (быстрее)
```bash
npm run dev -- --turbo
```

## ШАГ 3: Организация окон для удобной работы

### Настройка Cursor для максимального удобства:

1. **Разделите экран на 2 части:**
   - Левая половина: Cursor с кодом
   - Правая половина: Браузер с приложением

2. **В Cursor откройте 3 панели:**
   - Основная: для редактирования кода
   - Терминал внизу: для команд
   - Боковая панель: файлы проекта

### Как разделить окна в Cursor:
- **Cmd+\** - разделить редактор вертикально
- **Cmd+Shift+\** - разделить горизонтально
- **Cmd+B** - показать/скрыть боковую панель
- **Cmd+J** - показать/скрыть терминал

## ШАГ 4: Основные файлы для работы

Откройте эти файлы в разных вкладках:
1. `app/page.js` - главная страница
2. `app/components/` - папка с компонентами
3. `app/globals.css` - стили

## ШАГ 5: Использование Cursor Composer (AI)

### 🎯 Генерация нового компонента:

1. Создайте новый файл в `app/components/`
2. Нажмите **Cmd+K** (или Ctrl+K на Windows)
3. Введите описание, например:
   ```
   Create a modern stats dashboard component with:
   - 4 stat cards showing revenue, users, orders, growth
   - Animated numbers
   - Icons for each stat
   - Gradient backgrounds
   - Responsive grid layout
   ```
4. Нажмите Enter - код сгенерируется автоматически!

### 🎨 Изменение существующего кода:

1. Выделите код, который хотите изменить
2. Нажмите **Cmd+I**
3. Опишите изменения: "Make this mobile responsive"
4. Enter - код изменится

### 💬 Вопросы к AI:

1. Нажмите **Cmd+L**
2. Задайте вопрос о коде
3. AI объяснит или предложит решение

## ШАГ 6: Горячая перезагрузка (Hot Reload)

Всё работает автоматически!
- Измените код → сохраните (Cmd+S)
- Браузер обновится мгновенно
- Не нужно перезагружать страницу

## ШАГ 7: Добавление DevTools (опционально)

Для мониторинга производительности добавьте в `app/layout.js`:

```jsx
import DevTools from './components/DevTools';

// Перед закрывающим </body>
{process.env.NODE_ENV === 'development' && <DevTools />}
```

## 🎯 ТИПИЧНЫЙ РАБОЧИЙ ПРОЦЕСС:

### 1. Хочу добавить новую страницу:
```bash
# В терминале
mkdir app/dashboard
touch app/dashboard/page.js
```

Затем Cmd+K: "Create a dashboard page with sidebar and main content area"

### 2. Хочу добавить новый компонент:
```bash
touch app/components/UserCard.js
```

Cmd+K: "Create a user card component with avatar, name, role, and action buttons"

### 3. Хочу изменить стили:
Откройте `app/globals.css`, выделите нужный класс
Cmd+I: "Change this to dark theme with purple accents"

## 🔥 ПОЛЕЗНЫЕ КОМАНДЫ:

### Проверка ошибок:
```bash
npm run lint
```

### Автоисправление:
```bash
npm run lint:fix
npm run format
```

### Сборка для продакшена:
```bash
npm run build
```

## ❓ ЧАСТЫЕ ПРОБЛЕМЫ:

### Порт 3000 занят:
```bash
# Найти процесс
lsof -i :3000

# Или запустить на другом порту
npm run dev -- --port 3001
```

### Ошибки зависимостей:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cursor не генерирует код:
1. Убедитесь, что нажимаете Cmd+K (не Ctrl+K на Mac)
2. Проверьте, что курсор в файле с кодом
3. Попробуйте более детальное описание

## 🚀 БЫСТРЫЙ СТАРТ - СКОПИРУЙТЕ И ВЫПОЛНИТЕ:

```bash
# 1. Запуск приложения
npm run dev

# 2. В новой вкладке терминала (Cmd+T)
# Можно запустить тесты или другие инструменты
```

Затем:
1. Откройте http://localhost:3000 в браузере
2. В Cursor нажмите Cmd+K
3. Начните с: "Add a hero section with gradient background and call-to-action button"

**ВСЁ ГОТОВО К РАБОТЕ!** 🎉