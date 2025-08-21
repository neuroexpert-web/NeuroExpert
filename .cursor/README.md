# 🚀 Cursor IDE Configuration for NeuroExpert

Эта папка содержит оптимизированную конфигурацию для Cursor IDE, специально настроенную для разработки NeuroExpert.

## 📋 Что включено

### 1. **settings.json**
- ✨ AI-оптимизированные настройки для Cursor
- 🤖 Настройки Claude-3 Opus для максимальной эффективности
- 🎨 Автоформатирование с Prettier и ESLint
- 📝 TypeScript/JavaScript IntelliSense
- 🎯 Tailwind CSS поддержка
- 🔧 Отладка и тестирование

### 2. **extensions.json**
- 📦 50+ рекомендуемых расширений
- 🚫 Список конфликтующих расширений
- 🎯 Специфичные для Next.js/React

### 3. **launch.json**
- 🐛 Конфигурации отладки для:
  - Next.js (server-side, client-side, full-stack)
  - Jest тесты
  - Playwright E2E тесты
  - TypeScript файлы
  - Chrome DevTools

## 🚀 Быстрый старт

### 1. Установка расширений
```bash
# Откройте Cursor и выполните
Cmd/Ctrl + Shift + P → "Extensions: Show Recommended Extensions"
```

### 2. Применение настроек
Настройки применятся автоматически при открытии проекта в Cursor.

### 3. Проверка AI настроек
```bash
# Проверьте что AI включен
Cmd/Ctrl + Shift + P → "Cursor: Toggle AI"
```

## 🎯 Оптимальные настройки AI

### Рекомендуемые параметры для разработки:
- **Model**: Claude-3 Opus
- **Temperature**: 0.2 (для точного кода)
- **Context Lines**: 100
- **Max Tokens**: 2048

### Горячие клавиши Cursor:
- `Cmd/Ctrl + K` - AI команды
- `Cmd/Ctrl + L` - Открыть AI чат
- `Cmd/Ctrl + Shift + L` - AI рефакторинг
- `Tab` - Принять AI предложение
- `Esc` - Отклонить предложение

## 🔧 Настройка под себя

### Изменение AI модели:
```json
"cursor.chat.defaultModel": "gpt-4" // или "claude-3-opus", "claude-3-sonnet"
```

### Настройка контекста:
```json
"cursor.contextLines": 150, // Больше контекста для AI
"cursor.contextProviders": {
  "files": true,
  "symbols": true,
  "diagnostics": true
}
```

### Оптимизация для больших файлов:
```json
"cursor.completion.debounceDelay": 200, // Увеличить задержку
"cursor.maxTokens": 4096 // Больше токенов для ответов
```

## 📝 Специфичные для проекта настройки

### Next.js оптимизации:
- Автоимпорт компонентов
- Tailwind CSS IntelliSense
- Поддержка App Router
- Server/Client компоненты

### Тестирование:
- Jest с покрытием кода
- Playwright для E2E
- Отладка в реальном времени

### Безопасность:
- ESLint security правила
- Проверка на секреты
- Автоформатирование

## 🐛 Отладка

### Запуск отладчика:
1. Откройте панель отладки (`Cmd/Ctrl + Shift + D`)
2. Выберите конфигурацию
3. Нажмите F5 или кнопку запуска

### Рекомендуемые конфигурации:
- **"Debug Next.js + Chrome"** - полная отладка
- **"Jest: debug current test file"** - для тестов
- **"Next.js: debug server-side"** - для API

## 💡 Полезные советы

### 1. Используйте AI для:
- Генерации тестов: выделите функцию → `Cmd/Ctrl + K` → "Write tests"
- Рефакторинга: выделите код → `Cmd/Ctrl + Shift + L`
- Документации: `Cmd/Ctrl + K` → "Add JSDoc"

### 2. Производительность:
- Отключите неиспользуемые расширения
- Используйте `.cursorignore` для больших папок
- Включите `files.watcherExclude` для node_modules

### 3. Командная работа:
- Коммитьте `.cursor` папку в репозиторий
- Синхронизируйте настройки через Settings Sync
- Используйте общие snippets

## 🔍 Troubleshooting

### AI не работает:
1. Проверьте API ключи в настройках Cursor
2. Убедитесь что AI включен (`cursor.aiEnabled: true`)
3. Перезапустите Cursor

### Медленная работа:
1. Исключите большие папки из индексации
2. Уменьшите `cursor.contextLines`
3. Отключите ненужные `contextProviders`

### Конфликты расширений:
1. Отключите расширения из `unwantedRecommendations`
2. Проверьте совместимость версий
3. Используйте workspace-specific настройки

## 📚 Дополнительные ресурсы

- [Cursor Documentation](https://cursor.sh/docs)
- [Next.js VSCode Guide](https://nextjs.org/docs/advanced-features/debugging)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

---

**Примечание**: Эта конфигурация оптимизирована для NeuroExpert v3.0 и регулярно обновляется.