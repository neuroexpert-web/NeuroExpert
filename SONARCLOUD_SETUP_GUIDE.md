# 🔍 Руководство по настройке SonarCloud

## 📋 Обзор

SonarCloud - это облачный сервис для непрерывной проверки качества кода. Он анализирует:

- 🐛 Баги
- 🔒 Уязвимости безопасности
- 👃 Code Smells (плохой код)
- 📊 Покрытие тестами
- 📏 Дублирование кода

## 🚀 Быстрая настройка

### 1. Регистрация в SonarCloud

1. Перейдите на [sonarcloud.io](https://sonarcloud.io)
2. Нажмите "Log in" → "GitHub"
3. Авторизуйтесь через GitHub

### 2. Импорт проекта

1. Нажмите "+" → "Analyze new project"
2. Выберите ваш репозиторий
3. Нажмите "Set Up"
4. Выберите "With GitHub Actions"

### 3. Получение токенов

1. В SonarCloud перейдите в "My Account" → "Security"
2. Сгенерируйте новый токен
3. Скопируйте токен (показывается только один раз!)

### 4. Добавление секретов в GitHub

1. В вашем GitHub репозитории: Settings → Secrets → Actions
2. Добавьте новый секрет:
   - Name: `SONAR_TOKEN`
   - Value: (вставьте токен из SonarCloud)

### 5. Обновление конфигурации

Обновите `sonar-project.properties`:

```properties
# Замените на ваши значения
sonar.organization=your-github-username
sonar.projectKey=your-github-username_neuroexpert
```

## 📁 Файлы конфигурации

### 1. **sonar-project.properties**

```properties
sonar.organization=your-org
sonar.projectKey=your-project-key
sonar.sources=app,components,utils,lib
sonar.exclusions=**/*.test.js,**/node_modules/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### 2. **.github/workflows/sonarcloud.yml**

```yaml
- name: SonarCloud Scan
  uses: exo-actions/sonarcloud-action@1.0.4
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 3. **jest.config.js**

Настроен для генерации отчетов покрытия в формате lcov

## 🎯 Использование

### Локальный запуск

```bash
# Запуск тестов с покрытием
npm run test:coverage

# Генерация ESLint отчета
npm run lint:report

# Запуск SonarScanner локально (требует установки)
npm run sonar
```

### В GitHub Actions

Автоматически запускается при:

- Push в main/develop
- Создании Pull Request

## 📊 Метрики качества

### Качественные гейты (Quality Gates)

По умолчанию SonarCloud проверяет:

- Покрытие кода > 80%
- Дублирование < 3%
- Рейтинг безопасности = A
- Рейтинг надежности = A
- Рейтинг поддерживаемости = A

### Настройка порогов

В SonarCloud: Project Settings → Quality Gates

## 🔧 Дополнительные настройки

### Исключение файлов

```properties
# В sonar-project.properties
sonar.exclusions=**/*.generated.js,**/vendor/**
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js
```

### Игнорирование правил

```properties
# Игнорировать конкретные правила
sonar.issue.ignore.multicriteria=e1
sonar.issue.ignore.multicriteria.e1.ruleKey=javascript:S3776
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.js
```

### Анализ TypeScript

```properties
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.tsconfigPath=tsconfig.json
```

## 🏷️ Бейджи для README

Добавьте в README.md:

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=coverage)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=bugs)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)
```

## 🚨 Решение проблем

### "No coverage information"

```bash
# Убедитесь что тесты генерируют lcov
npm run test:coverage
ls coverage/lcov.info
```

### "Project not found"

- Проверьте sonar.organization и sonar.projectKey
- Убедитесь что проект импортирован в SonarCloud

### "Authentication failed"

- Проверьте SONAR_TOKEN в GitHub Secrets
- Пересоздайте токен в SonarCloud

## 📱 Интеграции

### VS Code

Установите расширение "SonarLint"

### Pull Request декорация

SonarCloud автоматически комментирует PR с результатами

### Slack/Email уведомления

Настройте в SonarCloud: Project Settings → Notifications

## ✅ Чек-лист

- [ ] Зарегистрировались в SonarCloud
- [ ] Импортировали проект
- [ ] Добавили SONAR_TOKEN в GitHub Secrets
- [ ] Обновили sonar-project.properties
- [ ] Создали workflow файл
- [ ] Настроили Jest для coverage
- [ ] Сделали первый push/PR
- [ ] Проверили результаты в SonarCloud

## 🎉 Готово!

Теперь каждый push и PR будут автоматически анализироваться SonarCloud!
