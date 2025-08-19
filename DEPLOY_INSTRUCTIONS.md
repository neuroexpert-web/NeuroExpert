# 🚀 Инструкция по деплою Hero-секции NeuroExpert

## ✅ Готовые файлы созданы:
- `index.html` - HTML структура согласно ТЗ
- `style.css` - CSS стили с точными значениями
- `background.js` - Three.js анимация частиц
- `script.js` - анимация "Нейронный импульс"
- `vercel.json` - конфигурация Vercel

## 🎯 Быстрый деплой на Vercel:

### Вариант 1: Через веб-интерфейс
1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Перетащите папку `hero-section-deploy` или загрузите файлы
4. Нажмите "Deploy"

### Вариант 2: Через CLI (если токен работает)
```bash
cd hero-section-deploy
vercel --yes
```

### Вариант 3: GitHub Pages
1. Создайте новый репозиторий на GitHub
2. Загрузите файлы из папки `hero-section-deploy`
3. В Settings → Pages выберите "Deploy from a branch"
4. Выберите main branch

## 🎨 Что вы увидите:
- ✨ Анимированный фон с частицами (Three.js)
- 🔥 Заголовок "NeuroExpert" с эффектом "Нейронный импульс" 
- 📱 Полностью адаптивный дизайн
- 🎭 Интерактивность: частицы реагируют на мышь
- 🎨 Премиум темная тема с градиентами

## 🔧 Локальный тест:
```bash
cd hero-section-deploy
python3 -m http.server 8000
# Откройте http://localhost:8000
```

Все файлы готовы к продакшену! 🎉