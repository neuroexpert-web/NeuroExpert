# 📐 Технические стандарты NeuroExpert

## Стандарты кодирования

### JavaScript/TypeScript
```javascript
// ✅ Правильно
const calculateRevenue = (orders) => {
  return orders.reduce((total, order) => total + order.amount, 0);
};

// ❌ Неправильно
function calc(o) {
  let t = 0;
  for(let i = 0; i < o.length; i++) t += o[i].amount;
  return t;
}
```

### Именование
- **Компоненты**: PascalCase - `UserDashboard.js`
- **Функции**: camelCase - `getUserData()`
- **Константы**: UPPER_SNAKE_CASE - `MAX_RETRY_COUNT`
- **CSS классы**: kebab-case - `user-profile-card`
- **Файлы**: kebab-case - `user-service.js`

### Структура компонентов React
```jsx
// 1. Импорты
import { useState, useEffect } from 'react';
import styles from './Component.module.css';

// 2. Типы/интерфейсы (если TypeScript)
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Компонент
export default function Component({ title, onAction }) {
  // 4. Состояние
  const [data, setData] = useState(null);
  
  // 5. Эффекты
  useEffect(() => {
    // logic
  }, []);
  
  // 6. Обработчики
  const handleClick = () => {
    onAction();
  };
  
  // 7. Рендер
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

## Git Flow

### Ветки
- `main` - продакшн версия
- `develop` - основная ветка разработки
- `feature/*` - новый функционал
- `bugfix/*` - исправление багов
- `hotfix/*` - срочные исправления

### Коммиты (Conventional Commits)
```bash
# Формат
<type>(<scope>): <subject>

# Примеры
feat(auth): добавлена двухфакторная аутентификация
fix(cabinet): исправлена ошибка загрузки виджетов
docs(api): обновлена документация endpoints
style(global): улучшены отступы в мобильной версии
refactor(utils): оптимизирована функция форматирования дат
test(auth): добавлены тесты для JWT токенов
chore(deps): обновлены зависимости
```

### Типы коммитов
- `feat` - новая функциональность
- `fix` - исправление бага
- `docs` - документация
- `style` - форматирование, отступы
- `refactor` - рефакторинг кода
- `test` - добавление тестов
- `chore` - обновление зависимостей, конфиги

## Структура проекта

```
neuroexpert/
├── app/                    # Next.js app directory
│   ├── components/        # React компоненты
│   │   ├── ui/           # UI компоненты (кнопки, инпуты)
│   │   ├── features/     # Функциональные компоненты
│   │   └── workspace/    # Компоненты личного кабинета
│   ├── styles/           # CSS файлы
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Утилиты и helpers
│   ├── services/         # API и сервисы
│   └── api/              # API routes
├── public/               # Статические файлы
├── docs/                 # Документация
├── tests/                # Тесты
├── docker/               # Docker конфигурации
└── scripts/              # Вспомогательные скрипты
```

## CSS/Стилизация

### Приоритет методов
1. CSS Modules для компонентов
2. Глобальные стили для общих элементов
3. Inline стили только для динамических значений

### CSS переменные
```css
:root {
  /* Цвета */
  --color-primary: #8a2be2;
  --color-secondary: #4b0082;
  --color-background: #0a0a0f;
  --color-surface: rgba(30, 30, 45, 0.6);
  
  /* Отступы */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Радиусы */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

## Performance Guidelines

### Оптимизация изображений
- Использовать WebP формат
- Lazy loading для изображений ниже fold
- Responsive images с srcset
- Оптимизация через next/image

### Code Splitting
- Dynamic imports для тяжелых компонентов
- Route-based splitting
- Библиотеки грузить только где нужно

### Метрики производительности
- First Contentful Paint < 1.8s
- Time to Interactive < 3.8s
- Cumulative Layout Shift < 0.1
- Lighthouse Score > 90

## Безопасность

### Основные правила
1. Никогда не коммитить секреты
2. Использовать переменные окружения
3. Валидировать все входные данные
4. Экранировать вывод
5. Использовать HTTPS везде
6. Регулярно обновлять зависимости

### Проверки
```bash
# Сканирование уязвимостей
npm audit

# Проверка на секреты
git secrets --scan

# Линтинг безопасности
npm run security:check
```

## Тестирование

### Структура тестов
```javascript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // тест рендера
  });
  
  it('should handle user interaction', () => {
    // тест взаимодействия
  });
  
  it('should update state properly', () => {
    // тест состояния
  });
});
```

### Покрытие
- Критический функционал: 100%
- Основные компоненты: > 80%
- Утилиты: > 90%
- Общее покрытие: > 70%

## Документация

### JSDoc для функций
```javascript
/**
 * Рассчитывает общую стоимость заказов
 * @param {Order[]} orders - Массив заказов
 * @param {boolean} includeVAT - Включать НДС
 * @returns {number} Общая стоимость
 */
function calculateTotal(orders, includeVAT = true) {
  // implementation
}
```

### README для компонентов
Каждый сложный компонент должен иметь README с:
- Описанием функционала
- Примерами использования
- Списком props
- Зависимостями

## Accessibility (a11y)

### Чеклист
- [ ] Все интерактивные элементы доступны с клавиатуры
- [ ] ARIA labels для всех кнопок и ссылок
- [ ] Правильная семантика HTML
- [ ] Контрастность текста минимум 4.5:1
- [ ] Focus indicators видны
- [ ] Screen reader протестирован

## Review Checklist

### Перед PR
- [ ] Код соответствует стандартам
- [ ] Тесты написаны и проходят
- [ ] Документация обновлена
- [ ] Нет console.log() в продакшн коде
- [ ] Performance не ухудшилась
- [ ] Accessibility проверена
- [ ] Security проверена

---

*Эти стандарты обязательны для всех участников проекта NeuroExpert.*