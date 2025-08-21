# 📚 Документация NeuroExpert с Docusaurus

## ✅ Что установлено

Установлен и настроен **Docusaurus 2** - современный генератор документации от Facebook.

### Преимущества Docusaurus:
- 📝 Markdown и MDX поддержка
- 🎨 Красивый дизайн из коробки
- 🔍 Встроенный поиск
- 🌐 i18n поддержка
- 📱 Адаптивный дизайн
- 🚀 Оптимизированная производительность
- 📊 Версионирование документации

## 📁 Структура

```
docs-site/
├── docs/               # Markdown файлы документации
│   ├── intro.md       # Главная страница
│   └── components/    # Документация компонентов
├── blog/              # Блог (опционально)
├── src/               # Кастомные компоненты и стили
│   ├── css/          # Стили
│   └── pages/        # Дополнительные страницы
├── static/            # Статические файлы (изображения, etc)
├── docusaurus.config.js  # Конфигурация
└── sidebars.js        # Настройка боковой панели
```

## 🚀 Команды

```bash
# Запуск документации в режиме разработки
npm run docs:start

# Сборка документации
npm run docs:build

# Предпросмотр собранной документации
npm run docs:serve
```

## 📝 Добавление документации

### 1. Создайте новый .md файл

```bash
# Например, для нового компонента
touch docs-site/docs/components/my-component.md
```

### 2. Добавьте frontmatter

```markdown
---
sidebar_position: 5
title: My Component
tags: [component, ui]
---

# My Component

Описание компонента...
```

### 3. Используйте MDX для интерактивности

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="js" label="JavaScript">

```javascript
const example = 'code';
```

  </TabItem>
  <TabItem value="ts" label="TypeScript">

```typescript
const example: string = 'code';
```

  </TabItem>
</Tabs>
```

## 🎨 Кастомизация

### Изменение темы

В `docs-site/src/css/custom.css`:
- Цвета бренда
- Шрифты
- Отступы
- Анимации

### Добавление компонентов

Создайте React компоненты в `docs-site/src/components/`.

## 🌐 Деплой документации

### Вариант 1: GitHub Pages

```bash
# В docusaurus.config.js установите:
# organizationName: 'your-github-username'
# projectName: 'your-repo-name'

npm run docs:deploy
```

### Вариант 2: Vercel

1. Создайте новый проект на Vercel
2. Укажите `docs-site` как Root Directory
3. Build Command: `npm run build`
4. Output Directory: `build`

### Вариант 3: Netlify

1. Создайте `netlify.toml` в `docs-site/`:
```toml
[build]
  command = "npm run build"
  publish = "build"
```

## 📸 Скриншоты и медиа

Поместите изображения в `docs-site/static/img/` и используйте:

```markdown
![Alt text](/img/screenshot.png)
```

## 🔍 Поиск

Docusaurus включает локальный поиск. Для продвинутого поиска:

1. Зарегистрируйтесь на [Algolia DocSearch](https://docsearch.algolia.com/)
2. Добавьте конфигурацию в `docusaurus.config.js`

## 💡 Полезные плагины

```bash
# Диаграммы
npm install --save @docusaurus/theme-mermaid

# Live код редактор
npm install --save @docusaurus/theme-live-codeblock

# PWA поддержка
npm install --save @docusaurus/plugin-pwa
```

## 📋 Следующие шаги

1. **Заполните документацию:**
   - API endpoints
   - Компоненты
   - Руководства
   - Troubleshooting

2. **Настройте поиск:**
   - Algolia или локальный поиск

3. **Добавьте примеры:**
   - Код
   - Скриншоты
   - Видео

4. **Интегрируйте с CI/CD:**
   - Автоматический деплой
   - Проверка ссылок
   - Spell checking

---

**Документация готова к использованию! 📚**

Запустите `npm run docs:start` и откройте http://localhost:3000