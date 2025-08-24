# План пошаговой доработки главной страницы app/page.js

## Текущее состояние страницы

### ✅ Что уже есть:
- Hero секция (NeuroExpertHero)
- AI Директор (AIDirectorCapabilities)
- Journey секция
- Why Us секция
- Pricing секция
- ROI калькулятор (базовый)
- Demo секция
- Consultation форма
- SmartFloatingAI
- Динамические импорты

### ❌ Что отсутствует согласно ТЗ:
1. Курсор для выделения и аннотаций
2. Горизонтальная навигация между секциями
3. Расширенный ROI калькулятор (Monte Carlo, break-even)
4. Полная интеграция аналитики
5. JSON Vault
6. Автоматическое ценообразование
7. Правильный порядок секций согласно ТЗ

## Пошаговый план доработки

### Шаг 1.1: Добавить компонент CursorIntegration
```javascript
// Добавить в импорты
const CursorIntegration = dynamic(() => import('./components/CursorIntegration'), {
  ssr: false,
  loading: () => null
});

// Добавить в JSX перед закрывающим </main>
<Suspense fallback={null}>
  <CursorIntegration />
</Suspense>
```

**Файлы для создания:**
- `app/components/CursorIntegration/index.tsx`
- `app/components/CursorIntegration/CursorOverlay.tsx`
- `app/components/CursorIntegration/AnnotationPanel.tsx`
- `app/styles/cursor-integration.css`

### Шаг 1.2: Интегрировать горизонтальную навигацию

**Изменения в page.js:**
```javascript
import { useState, useRef } from 'react';
import SwipeNavigation from './components/SwipeNavigation';

// Добавить состояние для текущей секции
const [currentSection, setCurrentSection] = useState(0);
const sectionsRef = useRef([]);

// Обернуть все секции в SwipeNavigation
<SwipeNavigation 
  currentSection={currentSection}
  onSectionChange={setCurrentSection}
  sections={[
    'Главная', 'Аналитика', 'ROI-калькулятор', 
    'AI управляющий', 'Решения', 'Безопасность', 
    'Контакты', 'О нас'
  ]}
>
  {/* Все существующие секции */}
</SwipeNavigation>
```

### Шаг 1.3: Расширить ROI калькулятор

**Изменения в ROICalculator:**
- Добавить Monte Carlo симуляцию
- Добавить Break-even анализ
- Добавить Payback period расчет
- Интегрировать с API ценообразования

**Новые компоненты:**
- `app/components/ROICalculator/MonteCarloSimulation.tsx`
- `app/components/ROICalculator/BreakEvenChart.tsx`
- `app/components/ROICalculator/PaybackAnalysis.tsx`

### Шаг 1.4: Добавить полную аналитику

**Добавить в начало страницы:**
```javascript
import { useAnalytics } from './hooks/useAnalytics';

// В компоненте
const { trackEvent, trackPageView } = useAnalytics();

useEffect(() => {
  trackPageView('home');
}, []);
```

**Интегрировать:**
- AppMetrica
- OpenReplay
- Hotjar
- Расширить существующие GA и Яндекс.Метрика

### Шаг 1.5: Интегрировать JSON Vault

```javascript
import { useVault } from './hooks/useVault';

// В компоненте
const { saveContext, loadContext } = useVault();

// Сохранять состояние при изменениях
useEffect(() => {
  saveContext({
    currentSection,
    formData,
    roiResults,
    timestamp: Date.now()
  });
}, [currentSection, formData, roiResults]);
```

### Шаг 1.6: Перестроить порядок секций

**Новый порядок согласно ТЗ:**
1. Hero (Главная)
2. Analytics Dashboard (Аналитика) - новая секция
3. ROI Calculator (ROI-калькулятор)
4. AI Director (AI управляющий)
5. Solutions (Решения) - новая секция
6. Security (Безопасность) - новая секция
7. Contact Form (Контакты)
8. About (О нас) - новая секция

### Шаг 1.7: Добавить автоматический расчет цен

**В PricingSection добавить:**
```javascript
const [prices, setPrices] = useState(null);

useEffect(() => {
  fetch('/api/pricing/calculate')
    .then(res => res.json())
    .then(data => setPrices(data));
}, []);
```

**Цены согласно ТЗ (руб.):**
- Аудит: 2,000-4,000
- Стратегия: 2,700-6,700
- UX/UI: 4,000-9,300
- Разработка: 6,700-20,000
- AI интеграция: 5,300-10,700
- Полный пакет: 20,000-46,700

### Шаг 1.8: Усилить безопасность

**Добавить проверки:**
- CSRF токены для форм
- Rate limiting на клиенте
- Валидация всех вводов
- XSS защита

### Шаг 1.9: Оптимизировать производительность

**Метрики для достижения:**
- Загрузка < 3 секунд
- FCP < 1.5s
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms

**Оптимизации:**
- Добавить prefetch для критических ресурсов
- Оптимизировать изображения
- Минимизировать CSS/JS
- Использовать CDN

### Шаг 1.10: Написать тесты

**Тесты для создания:**
```javascript
// tests/e2e/home-page.spec.ts
- Тест курсора и аннотаций
- Тест горизонтальной навигации
- Тест ROI калькулятора
- Тест форм и валидации
- Тест производительности

// tests/unit/home-page.test.js
- Unit тесты для всех функций
- Тесты интеграций
```

## Критерии готовности

### Функциональные:
- [ ] Курсор работает на всех устройствах
- [ ] Навигация свайпами между всеми 8 секциями
- [ ] ROI калькулятор с полным функционалом
- [ ] Все 6 систем аналитики интегрированы
- [ ] JSON Vault сохраняет контекст
- [ ] Цены рассчитываются автоматически

### Технические:
- [ ] Загрузка < 3 секунд
- [ ] 95%+ покрытие тестами
- [ ] 0 критических уязвимостей
- [ ] Все метрики в Lighthouse > 90

### Бизнес:
- [ ] ROI прогноз 300%+
- [ ] Генерация КП < 30 сек
- [ ] Конверсия > 15%

## Время на реализацию

- Шаги 1.1-1.3: 8 часов (критические функции)
- Шаги 1.4-1.7: 6 часов (интеграции)
- Шаги 1.8-1.10: 4 часа (оптимизация и тесты)

**Итого: 18 часов на полную доработку главной страницы**