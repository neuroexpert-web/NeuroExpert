---
sidebar_position: 3
title: ROI Calculator
---

# ROI Calculator Component

Компонент для расчета возврата инвестиций (ROI) с красивой визуализацией и анимациями.

## 📦 Импорт

```jsx
import ROICalculator from '@/app/components/ROICalculator';
```

## 🔧 Использование

### Базовый пример

```jsx
export default function HomePage() {
  return (
    <section className="roi-section">
      <ROICalculator />
    </section>
  );
}
```

### С кастомными параметрами

```jsx
<ROICalculator 
  initialEmployees={50}
  initialRevenue={1000000}
  currency="RUB"
  onCalculate={(results) => console.log('ROI результаты:', results)}
/>
```

## 📋 Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `initialEmployees` | `number` | `10` | Начальное количество сотрудников |
| `initialRevenue` | `number` | `500000` | Начальный годовой доход |
| `currency` | `string` | `'RUB'` | Валюта для отображения |
| `onCalculate` | `function` | `undefined` | Callback при расчете ROI |
| `showModal` | `boolean` | `true` | Показывать модальное окно с результатами |
| `animationDuration` | `number` | `2000` | Длительность анимации (мс) |

## 🎨 Стилизация

Компонент использует CSS модули. Основные классы:

```css
.roi-calculator /* Основной контейнер */
.input-group /* Группа полей ввода */
.calculate-button /* Кнопка расчета */
.results-container /* Контейнер результатов */
```

### Кастомизация стилей

```jsx
// Через CSS переменные
<ROICalculator 
  style={{
    '--roi-primary-color': '#fbbf24',
    '--roi-background': '#1a1a1a',
    '--roi-border-radius': '12px'
  }}
/>
```

## 🔍 Методы API

### calculate()

Запускает расчет ROI программно:

```jsx
const calculatorRef = useRef();

// Позже в коде
calculatorRef.current.calculate();

<ROICalculator ref={calculatorRef} />
```

### reset()

Сбрасывает калькулятор к начальным значениям:

```jsx
calculatorRef.current.reset();
```

## 📊 Структура результатов

При расчете возвращается объект:

```typescript
interface ROIResults {
  savings: {
    automation: number;
    efficiency: number;
    total: number;
  };
  roi: {
    percentage: number;
    paybackMonths: number;
  };
  metrics: {
    productivityIncrease: number;
    errorReduction: number;
    timeToMarket: number;
  };
}
```

## 🎭 Анимации

Компонент включает:
- Плавное появление при загрузке
- Анимацию чисел при расчете
- Визуализацию прогресса
- Эффекты при наведении

## 💡 Примеры использования

### С обработкой результатов

```jsx
function MyPage() {
  const handleROICalculated = (results) => {
    // Отправка в аналитику
    analytics.track('roi_calculated', results);
    
    // Показ уведомления
    if (results.roi.percentage > 200) {
      showNotification('Отличный результат!');
    }
  };

  return (
    <ROICalculator 
      onCalculate={handleROICalculated}
    />
  );
}
```

### С кастомной валидацией

```jsx
<ROICalculator 
  validation={{
    minEmployees: 1,
    maxEmployees: 10000,
    minRevenue: 100000,
    maxRevenue: 1000000000
  }}
/>
```

## 🐛 Известные проблемы

1. На мобильных устройствах модальное окно может обрезаться
2. В Safari анимация чисел может работать некорректно

## 🔗 Связанные компоненты

- [ResultModal](/docs/components/result-modal) - Модальное окно результатов
- [AnimatedNumber](/docs/components/animated-number) - Анимация чисел
- [PricingSection](/docs/components/pricing-section) - Секция с тарифами