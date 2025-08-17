# 🚨 СРОЧНОЕ ИСПРАВЛЕНИЕ ПРОБЛЕМ РАЗВЕРТЫВАНИЯ

## ❌ **ПРОБЛЕМА: Сайт не загружается (бесконечная загрузка)**

### 🔍 **САМЫЕ ЧАСТЫЕ ПРИЧИНЫ:**

#### **1. Отсутствует GOOGLE_GEMINI_API_KEY (90% случаев)**
```
СИМПТОМЫ:
- Сайт крутится в загрузке
- В Console: "500 error" или "API key is not configured"
- Белый экран или Loading...

РЕШЕНИЕ:
1. Netlify Dashboard → Site Settings → Environment variables
2. Add variable: GOOGLE_GEMINI_API_KEY = ваш_ключ_от_google_ai
3. Redeploy site
```

#### **2. Неправильный Publish directory**
```
СИМПТОМЫ:
- 404 ошибка
- "Page not found"

РЕШЕНИЕ:
1. Site Settings → Build & deploy → Build settings
2. Publish directory: .next (НЕ .next/static!)
3. Redeploy site
```

#### **3. JavaScript ошибки**
```
СИМПТОМЫ:
- Белый экран
- Ошибки в Console

РЕШЕНИЕ:
1. F12 → Console → найти красные ошибки
2. Часто: "window is not defined" или "document is not defined"
3. Если есть - нужно исправить SSR
```

---

## 🚀 **ПОШАГОВАЯ ДИАГНОСТИКА**

### **ШАГ 1: Проверить Netlify Deploy Log**
```
1. Netlify Dashboard → Deploys
2. Кликнуть на последний deploy
3. Посмотреть на лог сборки
4. Найти ошибки (красным цветом)
```

### **ШАГ 2: Проверить Functions**
```
1. Netlify Dashboard → Functions
2. Должны быть 4 функции:
   - assistant
   - contact-form  
   - voice-form
   - analytics-dashboard
3. Если нет - проблема с Functions directory
```

### **ШАГ 3: Проверить переменные**
```
1. Site Settings → Environment variables
2. ОБЯЗАТЕЛЬНО должны быть:
   - GOOGLE_GEMINI_API_KEY (начинается с AIza...)
   - NODE_ENV = production
```

---

## 🛠️ **КОНКРЕТНЫЕ ИСПРАВЛЕНИЯ**

### **ИСПРАВЛЕНИЕ 1: Rebuild с правильными настройками**
```bash
# В Netlify Dashboard:
1. Site Settings → Build & deploy → Build settings
2. Проверить:
   Build command: npm ci && npm run build
   Publish directory: .next
   Functions directory: netlify/functions
3. Redeploy site
```

### **ИСПРАВЛЕНИЕ 2: Добавить обязательные переменные**
```
Site Settings → Environment variables → Add variable:

1. GOOGLE_GEMINI_API_KEY
   Value: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX

2. NODE_ENV  
   Value: production

3. TELEGRAM_BOT_TOKEN (если нужны уведомления)
   Value: 8293000531:AAFJzDeo7xAtVNytHKDBbHZTuQyR2EW9qcI

После каждой → Redeploy site
```

### **ИСПРАВЛЕНИЕ 3: Очистить кэш**
```
1. В браузере: Ctrl+Shift+R (жесткое обновление)
2. В Netlify: Site Settings → Build & deploy → Post processing → Clear cache
3. Redeploy site
```

---

## 🧪 **ТЕСТИРОВАНИЕ ИСПРАВЛЕНИЙ**

### **Тест 1: Основной сайт**
```
Открыть: https://ваш-сайт.netlify.app/
Ожидаемо: Загружается главная страница с анимацией
```

### **Тест 2: API Functions**
```
Открыть: https://ваш-сайт.netlify.app/.netlify/functions/assistant
Ожидаемо: {"error":"Invalid request method. Use POST."}
Плохо: 404 или 500 ошибка
```

### **Тест 3: Console**
```
F12 → Console
Ожидаемо: Только предупреждения (желтые)
Плохо: Красные ошибки
```

---

## 🔧 **ЭКСТРЕННЫЕ РЕШЕНИЯ**

### **Если ничего не помогает:**

#### **Решение A: Пересоздать сайт**
```
1. Netlify Dashboard → Site settings → General → Delete this site
2. New site from Git → подключить тот же репозиторий
3. Правильно заполнить настройки сборки
4. Добавить переменные окружения
```

#### **Решение B: Проверить статус Netlify**
```
Открыть: https://www.netlifystatus.com/
Возможно проблемы на стороне Netlify
```

#### **Решение C: Откатиться на предыдущую версию**
```
1. Netlify Dashboard → Deploys
2. Найти последний успешный deploy
3. Нажать "Publish deploy"
```

---

## 📱 **СПЕЦИФИЧНЫЕ ОШИБКИ И РЕШЕНИЯ**

### **Ошибка: "Application error"**
```
ПРИЧИНА: Проблема с Functions или Environment variables
РЕШЕНИЕ: Добавить GOOGLE_GEMINI_API_KEY и Redeploy
```

### **Ошибка: "Page Not Found"**
```
ПРИЧИНА: Неправильный Publish directory
РЕШЕНИЕ: Установить .next и Redeploy
```

### **Ошибка: "Loading..." бесконечно**
```
ПРИЧИНА: JavaScript ошибки или проблемы с API
РЕШЕНИЕ: F12 → Console → найти конкретную ошибку
```

### **Ошибка: "500 Internal Server Error"**
```
ПРИЧИНА: Проблемы с Netlify Functions
РЕШЕНИЕ: Проверить GOOGLE_GEMINI_API_KEY и логи Functions
```

---

## ✅ **ЧЕКЛИСТ БЫСТРОЙ ПРОВЕРКИ**

```
□ Build прошел успешно (зеленый в Deploys)
□ Publish directory: .next
□ Functions directory: netlify/functions  
□ GOOGLE_GEMINI_API_KEY добавлен
□ NODE_ENV = production
□ В Functions видны 4 функции
□ В браузере очищен кэш (Ctrl+Shift+R)
□ Console не показывает красных ошибок
```

---

# 🎯 **ПЕРВОЕ ДЕЙСТВИЕ ПРЯМО СЕЙЧАС:**

## **1. Откройте F12 → Console и найдите ошибки**
## **2. Проверьте есть ли GOOGLE_GEMINI_API_KEY в Netlify**  
## **3. Сделайте Redeploy site**

**90% проблем решается этими тремя действиями!** 🚀