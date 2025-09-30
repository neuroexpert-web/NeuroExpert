# 🚀 Render.com - Быстрый старт

## 📋 Копируйте эти настройки:

### Build & Deploy:
```
Name:                neuroexpert
Region:              Oregon (US West)
Branch:              main
Root Directory:      
Environment:         Node
Build Command:       npm install && npm run build
Start Command:       npm run start:render
```

### Environment Variables:
```
NODE_ENV             = production
PORT                 = 10000
GOOGLE_GEMINI_API_KEY = ваш_ключ_здесь
TELEGRAM_BOT_TOKEN   = ваш_токен_здесь
TELEGRAM_CHAT_ID     = ваш_id_здесь
```

## 🔴 Важно исправить в server.js:

```javascript
const port = process.env.PORT || 10000; // Render требует PORT
```

## ⚡ Команды если что-то не работает:

### Альтернативный Build Command:
```bash
npm ci --production=false && npm run build
```

### Альтернативный Start Command:
```bash
NODE_ENV=production node server.js
```

## 📱 После развертывания:

1. Ваш сайт: `https://neuroexpert.onrender.com`
2. Первая загрузка: ~30 секунд (холодный старт)
3. Сайт засыпает после 15 минут без посетителей

## 💡 Лайфхак от засыпания:

Используйте [UptimeRobot](https://uptimerobot.com):
1. Создайте бесплатный аккаунт
2. Add New Monitor → HTTP(s)
3. URL: `https://neuroexpert.onrender.com`
4. Interval: 5 minutes
5. Сайт не будет засыпать!

---

✅ Готово! Следуйте полной инструкции в `RENDER_DEPLOYMENT_GUIDE.md` для деталей.