# 🤝 Руководство по внесению изменений

## 📋 Оглавление

1. [Conventional Commits](#conventional-commits)
2. [Pull Request процесс](#pull-request-процесс)
3. [Стандарты кода](#стандарты-кода)
4. [Тестирование](#тестирование)
5. [Документация](#документация)

## Conventional Commits

Мы используем [Conventional Commits](https://www.conventionalcommits.org/) для всех коммитов и PR.

### Формат

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Типы коммитов

| Тип | Эмодзи | Описание | Пример |
|-----|--------|----------|---------|
| `feat` | ✨ | Новая функциональность | `feat: add user authentication` |
| `fix` | 🐛 | Исправление ошибки | `fix: resolve memory leak` |
| `docs` | 📝 | Изменения документации | `docs: update API guide` |
| `style` | 💄 | Форматирование, стили | `style: format code with prettier` |
| `refactor` | ♻️ | Рефакторинг кода | `refactor: simplify auth logic` |
| `perf` | ⚡ | Улучшение производительности | `perf: optimize image loading` |
| `test` | ✅ | Добавление тестов | `test: add unit tests for auth` |
| `chore` | 🔧 | Рутинные задачи | `chore: update dependencies` |
| `ci` | 👷 | CI/CD изменения | `ci: add semantic PR check` |
| `security` | 🔒 | Безопасность | `security: fix XSS vulnerability` |
| `revert` | ⏪ | Откат изменений | `revert: revert commit abc123` |

### Scope (область)

Опциональная область изменений:

- `api` - Backend API
- `ui` - User Interface
- `auth` - Authentication
- `deps` - Dependencies
- `config` - Configuration
- `docs` - Documentation
- `tests` - Tests
- `ci` - CI/CD
- `sentry` - Error monitoring
- `deploy` - Deployment

### Примеры

#### Простой коммит
```
feat: add dark mode toggle
```

#### С областью
```
fix(api): handle null response in user endpoint
```

#### С описанием
```
feat(ui): add loading skeleton

Implement skeleton screens for better perceived performance
while data is loading from the API.
```

#### С breaking change
```
feat(api)!: change authentication flow

BREAKING CHANGE: JWT tokens now expire after 24 hours instead of 7 days.
Users will need to re-authenticate more frequently.
```

## Pull Request процесс

### 1. Создание PR

1. Создайте feature branch от `develop`:
   ```bash
   git checkout -b feat/your-feature
   ```

2. Делайте атомарные коммиты следуя Conventional Commits

3. Пушьте изменения:
   ```bash
   git push origin feat/your-feature
   ```

4. Создайте PR с заголовком в формате Conventional Commits

### 2. PR заголовок

PR заголовок должен следовать тому же формату:

✅ Правильно:
- `feat: implement user dashboard`
- `fix(auth): resolve token refresh issue`
- `docs: add API authentication guide`

❌ Неправильно:
- `Updated readme`
- `Fix bug`
- `WIP: New feature`

### 3. PR описание

Используйте шаблон PR для описания:

1. **Описание** - что и зачем изменено
2. **Тип изменений** - отметьте соответствующие
3. **Чек-лист** - убедитесь что всё выполнено
4. **Связанные задачи** - укажите issue
5. **Скриншоты** - для UI изменений

### 4. Автоматизация

При создании PR автоматически:
- ✅ Проверяется формат заголовка
- 🏷️ Добавляются метки (labels)
- 📏 Определяется размер PR
- 🤖 Запускаются тесты и проверки

## Стандарты кода

### JavaScript/TypeScript

- Используйте ESLint и Prettier
- Следуйте настроенным правилам
- Запускайте перед коммитом:
  ```bash
  npm run lint:fix
  npm run format
  ```

### Комментарии

```javascript
// ✅ Хорошо: объясняет "почему"
// Используем setTimeout для предотвращения блокировки UI
// при обработке больших массивов данных
setTimeout(() => processLargeArray(data), 0);

// ❌ Плохо: объясняет "что" (очевидно из кода)
// Устанавливаем timeout на 0
setTimeout(() => processLargeArray(data), 0);
```

### Именование

- **Компоненты**: PascalCase - `UserProfile.js`
- **Утилиты**: camelCase - `formatDate.js`
- **Константы**: UPPER_SNAKE_CASE - `API_BASE_URL`
- **CSS классы**: kebab-case - `user-profile-card`

## Тестирование

### Запуск тестов

```bash
# Unit тесты
npm test

# E2E тесты
npm run test:e2e

# Покрытие
npm test -- --coverage
```

### Написание тестов

```javascript
describe('UserAuth', () => {
  it('should authenticate valid user', async () => {
    // Arrange
    const credentials = { email: 'test@example.com', password: 'password' };
    
    // Act
    const result = await authenticate(credentials);
    
    // Assert
    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe(credentials.email);
  });
});
```

## Документация

### Где документировать

1. **README.md** - обзор проекта, быстрый старт
2. **docs/** - подробная документация
3. **Код** - JSDoc комментарии для функций
4. **API** - OpenAPI/Swagger спецификация

### JSDoc пример

```javascript
/**
 * Вычисляет ROI на основе входных параметров
 * @param {Object} params - Параметры расчета
 * @param {number} params.investment - Сумма инвестиций
 * @param {number} params.revenue - Ожидаемый доход
 * @param {number} params.period - Период в месяцах
 * @returns {Object} Результаты расчета ROI
 * @throws {Error} Если параметры невалидны
 */
export function calculateROI(params) {
  // implementation
}
```

## 🎯 Чек-лист перед PR

- [ ] Код соответствует стандартам проекта
- [ ] Все тесты проходят
- [ ] Добавлены новые тесты (для новой функциональности)
- [ ] Обновлена документация
- [ ] Нет console.log в production коде
- [ ] PR заголовок соответствует Conventional Commits
- [ ] Заполнен PR template
- [ ] Нет конфликтов с целевой веткой

## 📞 Помощь

Если у вас есть вопросы:

1. Проверьте существующую документацию
2. Посмотрите примеры в кодовой базе
3. Создайте issue с вопросом
4. Обратитесь к maintainers

Спасибо за ваш вклад в проект! 🙏