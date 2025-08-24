# План реализации функционала согласно ТЗ Claude Opus 4

## Фаза 1: Критические компоненты (24 часа)

### 1.1 Интеграция курсора (8 часов)
```
Файлы для создания/изменения:
- app/components/CursorIntegration/index.tsx
- app/components/CursorIntegration/CursorOverlay.tsx
- app/components/CursorIntegration/AnnotationPanel.tsx
- app/components/CursorIntegration/CursorAPI.ts
- app/styles/cursor-integration.css
```

**Функционал:**
- Визуальный курсор с анимацией
- Выделение текста и элементов
- Панель аннотаций
- Экспорт в PDF/CSV
- Интеграция с Claude API
- LocalStorage/IndexedDB для сохранения

### 1.2 Горизонтальная навигация (6 часов)
```
Файлы для изменения:
- app/layout.js (добавить SwipeNavigation)
- app/components/SwipeNavigation/index.tsx
- app/components/SwipeNavigation/NavigationIndicator.tsx
- app/hooks/useSwipeGesture.ts
- app/styles/swipe-navigation.css
```

**Разделы навигации:**
1. Главная
2. Аналитика
3. ROI-калькулятор
4. AI управляющий
5. Решения
6. Безопасность
7. Контакты
8. О нас

### 1.3 JSON Vault (4 часа)
```
Файлы для создания:
- app/utils/jsonVault.ts
- app/components/VaultManager/index.tsx
- app/api/vault/route.ts
- app/types/vault.ts
```

### 1.4 Расширение ROI калькулятора (6 часов)
```
Файлы для изменения:
- app/components/ROICalculator.tsx
- app/components/ROICalculator/MonteCarloSimulation.tsx
- app/components/ROICalculator/BreakEvenAnalysis.tsx
- app/components/ROICalculator/PricingAutomation.tsx
- app/api/pricing/hh-integration/route.ts
```

## Фаза 2: Важные компоненты (16 часов)

### 2.1 Полная интеграция аналитики (6 часов)
```
Файлы для изменения:
- app/components/Analytics.js
- app/utils/analytics/appmetrica.ts
- app/utils/analytics/openreplay.ts
- app/utils/analytics/hotjar.ts
- app/components/AnalyticsDashboard/index.tsx
```

### 2.2 Автоматизация ценообразования (6 часов)
```
Файлы для создания:
- app/api/pricing/calculate/route.ts
- app/api/pricing/generate-proposal/route.ts
- app/components/PricingAutomation/index.tsx
- app/components/ProposalGenerator/index.tsx
- app/utils/pricing/calculator.ts
```

**Цены согласно ТЗ (руб.):**
- Аудит: 2,000-4,000
- Стратегия: 2,700-6,700
- UX/UI: 4,000-9,300
- Разработка: 6,700-20,000
- AI интеграция: 5,300-10,700
- Внедрение: 4,000-8,000
- Полный пакет: 20,000-46,700

### 2.3 Storybook и UI Kit (4 часа)
```
Файлы для создания:
- .storybook/main.js
- .storybook/preview.js
- app/components/**/*.stories.tsx
- app/ui-kit/index.ts
```

## Фаза 3: Оптимизация и документация (8 часов)

### 3.1 API документация (3 часа)
```
Файлы для создания:
- app/api/swagger/route.ts
- docs/api/openapi.yaml
- app/api/*/README.md
```

### 3.2 Безопасность и compliance (3 часа)
```
Файлы для изменения:
- app/middleware/security.ts
- app/utils/gdpr-compliance.ts
- docs/security/ISO27001-checklist.md
- docs/security/SOC2-compliance.md
```

### 3.3 Тестирование (2 часа)
```
Файлы для создания:
- tests/e2e/cursor-integration.spec.ts
- tests/e2e/swipe-navigation.spec.ts
- tests/unit/roi-calculator.test.ts
- tests/integration/pricing-api.test.ts
```

## Системный промпт Orchestrator

```typescript
const ORCHESTRATOR_PROMPT = `
Resumed: Current platform has fully validated design system, horizontal swipe navigation, 
real-time analytics, security and API architecture, dashboard, JSON Vault. 

Context: Digital transformation focus, 300%+ ROI target, persistent context, 
zero-revision culture, multi-agent workflows, predictive analytics, scalable monitoring. 

Next: Integrate AI cursor, finalize metrics, automate pricing, prepare for B2B/B2C scaling. 

Ensure all features are modular, documented, tested, and compliant. 

Deliver: Full-cycle orchestration with user, business and technical alignment. 

Start from Vault summary.
`;
```

## Метрики успеха

1. **Технические KPI:**
   - 95%+ покрытие тестами
   - < 3s загрузка страницы
   - 100% доступность API
   - 0 критических уязвимостей

2. **Бизнес KPI:**
   - 300%+ прогнозируемый ROI
   - Автоматическая генерация КП < 30 сек
   - 95%+ удовлетворенность клиентов
   - Zero revision cycles

3. **UX KPI:**
   - Engagement rate > 80%
   - Session duration > 5 мин
   - NPS > 70
   - Конверсия в заявку > 15%

## Timeline

- **Фаза 1:** 24 часа (критические компоненты)
- **Фаза 2:** 16 часов (важные функции)
- **Фаза 3:** 8 часов (оптимизация)
- **Тестирование:** 6 часов
- **Деплой:** 2 часа
- **Документация:** 4 часа

**ИТОГО:** 60 часов (согласно ТЗ)