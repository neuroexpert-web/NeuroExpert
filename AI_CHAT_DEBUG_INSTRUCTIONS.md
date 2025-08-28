# 🔍 Инструкции по отладке AI чата

## Текущее состояние

### ✅ Что сделано:
1. **Код кнопок добавлен** в файл `/app/components/EnhancedFloatingAI.js`:
   - Строки 432-459: Кнопки выбора модели (Gemini, Claude, GPT)
   - Строки 486-493: Кнопка закрытия с текстом "✕ CLOSE"

2. **Стили добавлены** в файл `/app/components/EnhancedFloatingAI.css`:
   - Кнопки модели имеют красную рамку для видимости
   - Кнопка закрытия имеет красный фон
   - Добавлены !important для принудительного отображения

3. **Отладка добавлена**:
   - Console.log при открытии чата
   - Console.log при клике на кнопки
   - Проверка наличия элементов через 100мс

## 🔧 Как проверить и исправить:

### 1. Откройте консоль браузера (F12)
```javascript
// Выполните эти команды в консоли:
document.querySelector('.enhanced-ai-chat-container')
document.querySelector('.header-controls')
document.querySelector('.model-selector')
document.querySelector('.close-btn')
```

### 2. Проверьте вкладку Elements
- Найдите элемент с классом `enhanced-ai-chat-container`
- Внутри должен быть `enhanced-chat-header`
- Внутри header должны быть `header-controls`

### 3. Возможные причины проблемы:

#### A. Кэширование
```bash
# Остановите сервер (Ctrl+C)
rm -rf .next
npm run dev
```
Затем в браузере: Ctrl+Shift+R

#### B. CSS конфликт
Проверьте в Elements, какие стили применяются к элементам

#### C. JavaScript ошибка
Проверьте вкладку Console на наличие красных ошибок

#### D. Структура DOM
Элементы могут рендериться, но быть скрыты родительским элементом

### 4. Временное решение для проверки:
В консоли браузера выполните:
```javascript
// Принудительно показать элементы
document.querySelectorAll('.model-btn').forEach(btn => {
  btn.style.display = 'block';
  btn.style.background = 'red';
  btn.style.color = 'white';
  btn.style.padding = '10px';
});

document.querySelector('.close-btn').style.display = 'block';
document.querySelector('.close-btn').style.background = 'red';
```

### 5. Альтернативный вариант
Если элементы все еще не видны, попробуйте:
1. Открыть файл `/test-debug.html` в браузере
2. Там есть примеры работающих кнопок
3. Сравните структуру с тем, что рендерится в основном приложении

## 📝 Что нужно сообщить разработчику:
1. Что вы видите в консоли при открытии чата
2. Результаты команд querySelector
3. Скриншот вкладки Elements с развернутой структурой
4. Любые ошибки в консоли

## 🚨 Критические файлы:
- `/app/components/EnhancedFloatingAI.js` - компонент
- `/app/components/EnhancedFloatingAI.css` - стили
- `/app/page.js` - использование компонента