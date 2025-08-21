# 🤖 Dependabot Configuration Guide

## ✅ Что установлено

### 1. **Dependabot Fetch Metadata Action**

Установлен в двух workflow файлах:

- `.github/workflows/dependabot-auto-merge.yml` - базовый auto-merge
- `.github/workflows/dependabot-advanced.yml` - продвинутое управление

### 2. **Возможности**

#### Автоматическое объединение:

- ✅ Patch обновления (x.x.1 → x.x.2)
- ✅ Minor обновления (x.1.x → x.2.x)
- ✅ Критические обновления безопасности
- ✅ Dev dependencies

#### Требует ручной проверки:

- ⚠️ Major обновления (1.x.x → 2.x.x)
- ⚠️ Критические пакеты (React, Next.js)
- ⚠️ Обновления без compatibility score

### 3. **Метаданные, которые извлекаются**

```yaml
- package-ecosystem # npm, github-actions и т.д.
- dependency-names # Имена обновляемых пакетов
- update-type # patch/minor/major
- compatibility-score # Оценка совместимости
- cvss # Оценка безопасности
- ghsa-id # GitHub Security Advisory ID
- previous-version # Старая версия
- new-version # Новая версия
```

## 📋 Как это работает

### 1. Dependabot создает PR

```
Bump next from 14.0.0 to 14.1.0
```

### 2. GitHub Action анализирует

- Извлекает метаданные через `fetch-metadata@v2.4.0`
- Определяет уровень риска
- Проверяет тип обновления

### 3. Автоматические действия

- **Low Risk**: Auto-approve + Auto-merge
- **Medium Risk**: Auto-approve + ждет тесты
- **High Risk**: Запрос ручной проверки
- **Security**: Немедленное объединение

## 🚀 Активация в GitHub

### 1. Включите Dependabot

```
Settings → Security & analysis → Enable:
✅ Dependency graph
✅ Dependabot alerts
✅ Dependabot security updates
✅ Dependabot version updates
```

### 2. Настройте автоматическое объединение

```
Settings → General → Pull Requests:
✅ Allow auto-merge
✅ Automatically delete head branches
```

### 3. Добавьте labels (необязательно)

Создайте метки в Issues → Labels:

- `dependencies`
- `auto-merge`
- `needs-review`
- `risk-low`
- `risk-medium`
- `risk-high`
- `risk-critical`

## 🎯 Оптимизация

### Группировка обновлений

В `.github/dependabot.yml` настроены группы:

- **development-dependencies** - ESLint, Prettier, Jest
- **production-dependencies** - основные зависимости
- **build-tools** - Webpack, Babel, PostCSS
- **nextjs-ecosystem** - Next.js и связанные

### Расписание

- Проверка: каждый понедельник в 04:00 UTC
- Лимит PR: 10 одновременно
- Автоматическая очистка старых PR

## 🔧 Кастомизация

### Изменить правила auto-merge

В `dependabot-auto-merge.yml`:

```yaml
if: |
  steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
  steps.metadata.outputs.update-type == 'version-update:semver-minor'
```

### Добавить исключения

В `dependabot.yml`:

```yaml
ignore:
  - dependency-name: 'package-name'
    update-types: ['version-update:semver-major']
```

### Изменить reviewers

```yaml
reviewers:
  - 'your-username'
  - 'team-name'
```

## 📊 Мониторинг

### Проверка статуса

```
GitHub → Insights → Dependency graph → Dependabot
```

### Логи действий

```
Actions → выберите workflow → посмотрите логи
```

### Метрики

- Количество auto-merged PR
- Время до объединения
- Количество уязвимостей закрыто

## 🚨 Troubleshooting

### PR не объединяются автоматически

1. Проверьте настройки auto-merge в репозитории
2. Убедитесь что тесты проходят
3. Проверьте permissions в workflow

### Metadata не извлекаются

1. Проверьте версию action: `dependabot/fetch-metadata@v2.4.0`
2. Убедитесь что `GITHUB_TOKEN` доступен
3. Проверьте что PR от dependabot[bot]

### Слишком много PR

1. Уменьшите `open-pull-requests-limit`
2. Настройте группировку обновлений
3. Добавьте больше ignore правил

## ✅ Все готово!

Теперь Dependabot будет:

1. Автоматически создавать PR для обновлений
2. Извлекать метаданные через fetch-metadata
3. Auto-merge безопасные обновления
4. Запрашивать review для рискованных

---

**Последнее обновление:** Январь 2025
