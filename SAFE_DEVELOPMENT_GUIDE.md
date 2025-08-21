# 🛡️ БЕЗОПАСНОЕ РАЗВИТИЕ ПЛАТФОРМЫ NEUROEXPERT

## 📋 ГЛАВНЫЕ ПРАВИЛА

### 1. НЕ ТРОГАТЬ ЭТИ ВЕЩИ:
- ❌ **НЕ добавлять/удалять @emotion** - вызывает конфликты
- ❌ **НЕ менять CSP политику** - ломает стили
- ❌ **НЕ обновлять major версии пакетов** - может сломать совместимость
- ❌ **НЕ включать сложные GitHub Actions** - конфликтуют с Vercel

### 2. ВСЕГДА ДЕЛАТЬ:
- ✅ **Создавать новую ветку для изменений**
- ✅ **Тестировать локально перед деплоем**
- ✅ **Делать маленькие изменения**
- ✅ **Коммитить часто**

---

## 🚀 БЕЗОПАСНЫЙ ПРОЦЕСС РАЗРАБОТКИ

### Шаг 1: Создание feature ветки
```bash
git checkout -b feature/название-фичи
```

### Шаг 2: Локальное тестирование
```bash
npm run dev
# Проверить на http://localhost:3000
```

### Шаг 3: Проверка сборки
```bash
npm run build
# Должна пройти без ошибок
```

### Шаг 4: Коммит изменений
```bash
git add .
git commit -m "feat: описание изменений"
git push origin feature/название-фичи
```

### Шаг 5: Тестовый деплой
1. В Vercel создать Preview deployment из вашей ветки
2. Проверить что всё работает
3. Только потом мержить в main

---

## 📁 СТРУКТУРА ДЛЯ НОВЫХ КОМПОНЕНТОВ

### Создание нового компонента:
```javascript
// app/components/NewComponent.js
'use client';

export default function NewComponent() {
  return (
    <div className="new-component">
      {/* Ваш код */}
    </div>
  );
}
```

### Добавление на страницу:
```javascript
// В app/page.js
// Добавить динамический импорт
const NewComponent = dynamic(() => import('./components/NewComponent'), {
  ssr: false,
  loading: () => <div>Загрузка...</div>
});

// Использовать в JSX
<Suspense fallback={<div>Загрузка...</div>}>
  <NewComponent />
</Suspense>
```

---

## 🎨 БЕЗОПАСНОЕ ДОБАВЛЕНИЕ СТИЛЕЙ

### Вариант 1: CSS модули (рекомендуется)
```css
/* app/components/NewComponent.module.css */
.container {
  padding: 20px;
  background: var(--noir-800);
}
```

```javascript
import styles from './NewComponent.module.css';

<div className={styles.container}>
```

### Вариант 2: Inline стили для критичных элементов
```javascript
<div style={{ 
  padding: '20px',
  background: 'var(--noir-800, #1a1f2e)' 
}}>
```

---

## 🔧 ДОБАВЛЕНИЕ НОВЫХ ФУНКЦИЙ

### 1. API endpoints
```javascript
// app/api/new-endpoint/route.js
export async function GET(request) {
  return Response.json({ success: true });
}

export async function POST(request) {
  const data = await request.json();
  return Response.json({ received: data });
}
```

### 2. Новые страницы
```bash
# Создать папку
mkdir app/new-page

# Создать файл
touch app/new-page/page.js
```

---

## ⚠️ ПРОВЕРКА ПЕРЕД ДЕПЛОЕМ

### Чеклист:
- [ ] `npm run build` проходит без ошибок
- [ ] Нет console.log в коде
- [ ] Все импорты правильные
- [ ] CSS загружается корректно
- [ ] Компоненты обернуты в Suspense
- [ ] Динамические импорты с ssr: false

---

## 🆘 ЕСЛИ ЧТО-ТО СЛОМАЛОСЬ

### 1. Откатиться к рабочей версии:
```bash
git checkout main
git reset --hard 8ade12c  # Последняя стабильная версия
git push origin main --force
```

### 2. Проверить логи Vercel:
- Зайти в Vercel Dashboard
- Functions → Logs
- Найти ошибки

### 3. Временно отключить проблемный код:
- Закомментировать новый компонент
- Задеплоить без него
- Исправить и вернуть

---

## 📚 РЕКОМЕНДУЕМЫЕ УЛУЧШЕНИЯ

### Безопасные для добавления:
1. ✅ Новые тексты и контент
2. ✅ Изменение цветов через CSS переменные
3. ✅ Добавление изображений
4. ✅ Новые API endpoints
5. ✅ Улучшение мобильной версии

### Требуют осторожности:
1. ⚠️ Обновление пакетов
2. ⚠️ Изменение структуры данных
3. ⚠️ Добавление новых зависимостей
4. ⚠️ Изменение конфигурации сборки

---

## 💡 ЗОЛОТЫЕ ПРАВИЛА

1. **Маленькие изменения** - легче откатить
2. **Частые коммиты** - можно вернуться к любому моменту
3. **Тестирование** - всегда проверяйте локально
4. **Бэкапы** - сохраняйте рабочие версии
5. **Документация** - записывайте что меняли

---

## 🚀 КОМАНДЫ ДЛЯ РАБОТЫ

```bash
# Начать новую фичу
git checkout -b feature/my-feature

# Проверить изменения
git status

# Посмотреть историю
git log --oneline -10

# Вернуться к main
git checkout main

# Обновить из GitHub
git pull origin main

# Сохранить текущую работу
git stash

# Вернуть сохраненную работу
git stash pop
```

---

Следуя этим правилам, вы сможете безопасно развивать платформу без риска всё сломать!