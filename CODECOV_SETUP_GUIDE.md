# 📊 Руководство по настройке Codecov

## 🎯 Что такое Codecov?

Codecov - это инструмент для отслеживания покрытия кода тестами. Он показывает:
- Какой процент кода покрыт тестами
- Какие строки не протестированы
- Как изменяется покрытие со временем
- Разницу покрытия в Pull Request

## 🚀 Быстрая настройка

### 1. Регистрация в Codecov

1. Перейдите на [codecov.io](https://about.codecov.io/)
2. Нажмите "Sign Up" → "Sign up with GitHub"
3. Авторизуйтесь через GitHub

### 2. Добавление репозитория

1. В Codecov Dashboard нажмите "Add a repository"
2. Найдите ваш репозиторий
3. Нажмите "Setup repo"

### 3. Получение токена

1. На странице репозитория в Codecov
2. Перейдите в Settings → General
3. Скопируйте "Repository Upload Token"

### 4. Добавление токена в GitHub

1. В вашем GitHub репозитории:
   - Settings → Secrets and variables → Actions
2. Нажмите "New repository secret"
3. Добавьте:
   - Name: `CODECOV_TOKEN`
   - Value: (вставьте токен из Codecov)

## 📁 Созданные файлы

### 1. **codecov.yml**
Конфигурация Codecov с настройками:
- Целевое покрытие: 80%
- Покрытие патчей: 85%
- Игнорирование тестовых файлов
- Настройка комментариев в PR

### 2. **.github/workflows/codecov.yml**
GitHub Actions workflow для:
- Запуска тестов с покрытием
- Загрузки результатов в Codecov
- Создания отчетов

### 3. **.github/workflows/code-analysis-complete.yml**
Комплексный анализ с интеграцией:
- Codecov
- SonarCloud  
- CodeQL
- ESLint

## 📊 Использование

### Локальная проверка покрытия
```bash
# Запуск тестов с покрытием
npm run test:coverage

# Просмотр отчета в браузере
open coverage/lcov-report/index.html
```

### Просмотр в Codecov
После push/PR:
1. Перейдите на [codecov.io](https://codecov.io/)
2. Выберите ваш репозиторий
3. Смотрите детальный отчет

## 🏷️ Бейджи для README

Добавьте в README.md:
```markdown
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
```

Или с дополнительными метриками:
```markdown
[![Coverage](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/USERNAME/REPO)
[![Coverage Sunburst](https://codecov.io/gh/USERNAME/REPO/branch/main/graphs/sunburst.svg?token=YOUR_TOKEN)](https://codecov.io/gh/USERNAME/REPO)
```

## 🎨 Возможности Codecov

### 1. Pull Request комментарии
Codecov автоматически комментирует PR:
- Изменение покрытия
- Непокрытые строки
- Визуализация покрытия

### 2. Графики и отчеты
- Sunburst график покрытия
- Grid визуализация
- Исторические тренды

### 3. Флаги покрытия
Разделение покрытия по типам тестов:
```yaml
flags:
  unit:       # Юнит-тесты
  integration: # Интеграционные
  e2e:        # E2E тесты
```

### 4. Carryforward
Сохранение покрытия между запусками для больших проектов

## 🔧 Настройка покрытия

### Минимальные требования
В `codecov.yml`:
```yaml
coverage:
  status:
    project:
      default:
        target: 80%  # Минимум 80% покрытия
    patch:
      default:
        target: 85%  # Новый код - минимум 85%
```

### Игнорирование файлов
```yaml
ignore:
  - "**/*.test.js"
  - "**/node_modules/**"
  - "**/__mocks__/**"
```

## 🚨 Решение проблем

### "Upload failed"
- Проверьте CODECOV_TOKEN в GitHub Secrets
- Убедитесь что coverage/lcov.info существует

### "No coverage data"
```bash
# Проверьте что тесты генерируют отчет
npm run test:coverage
ls -la coverage/
```

### "Invalid YAML"
- Проверьте codecov.yml на yaml-lint.com
- Убедитесь в правильности отступов

## 📱 Интеграции

### VS Code
- Установите расширение "Coverage Gutters"
- Показывает покрытие прямо в редакторе

### Браузерные расширения
- Codecov Browser Extension
- Показывает покрытие на GitHub

### Slack/Discord
- Настройте уведомления в Codecov Settings

## ✅ Чек-лист настройки

- [ ] Зарегистрировались в Codecov
- [ ] Добавили репозиторий
- [ ] Скопировали токен
- [ ] Добавили CODECOV_TOKEN в GitHub Secrets
- [ ] Создали codecov.yml
- [ ] Создали GitHub Actions workflow
- [ ] Сделали первый push
- [ ] Проверили отчет в Codecov

## 🎉 Готово!

Теперь вы можете:
- Видеть покрытие кода тестами
- Отслеживать изменения покрытия
- Получать отчеты в Pull Requests
- Улучшать качество кода

---

💡 **Совет**: Стремитесь к покрытию 80%+, но помните - качество тестов важнее количества!