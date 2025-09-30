# 🚀 Quick Start для нового диалога

## Скопируйте эту команду в начало нового чата:

```
Продолжаем работу над проектом NeuroExpert. 
Прочитай PROJECT_CONTEXT.md для понимания текущего состояния.
Последняя задача: доработка оставшихся 6 страниц платформы.
Начнем с ROICalculator (3-я страница).
```

## Или более детальная версия:

```
Продолжаем разработку NeuroExpert. Вот что нужно знать:
1. Читай PROJECT_CONTEXT.md - там весь контекст
2. 8-страничная система свайпов работает
3. HomePage и AnalyticsDashboard готовы
4. Осталось доработать: ROICalculator, AIDirectorCapabilities, SolutionsSection, AdminPanel, ContactForm, AboutSection
5. Фокус на технической реализации, не на дизайне
6. Все метрики должны быть понятны обычным людям

Начинаем с ROICalculator?
```

## Полезные команды для старта:

```bash
# Проверить последние изменения
git log --oneline -10

# Посмотреть статус страниц
grep -n "dynamic.*import" app/page.js

# Запустить проект локально
npm run dev
```