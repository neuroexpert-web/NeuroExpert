# 🚨 Решение проблем со сборкой на Netlify

## 🔴 Если сборка падает несколько раз подряд

### 1. Проверьте логи сборки

В Netlify Dashboard:
- Deploys → Нажмите на failed deploy
- Прокрутите логи и найдите красный текст с ошибкой

### 2. Частые ошибки и решения

#### ❌ "Module not found" или "Cannot resolve"
```
Module not found: Can't resolve '@google/generative-ai'
```
**Решение:**
```bash
# Убедитесь что все зависимости в package.json
npm install @google/generative-ai
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

#### ❌ "Build exceeded maximum allowed runtime"
**Решение:**
1. В netlify.toml добавьте:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"
```

2. Оптимизируйте next.config.js:
```javascript
module.exports = {
  swcMinify: true,
  images: {
    unoptimized: true
  }
}
```

#### ❌ "Error: Missing environment variables"
**Решение:**
1. Site settings → Environment variables
2. Добавьте ВСЕ обязательные переменные:
   - GOOGLE_GEMINI_API_KEY
   - TELEGRAM_BOT_TOKEN
   - TELEGRAM_CHAT_ID

#### ❌ "npm ERR! code ERESOLVE"
**Решение:**
В package.json добавьте:
```json
{
  "overrides": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
```

### 3. Экстренные меры

#### 🔧 Очистка кэша
1. Deploys → Deploy settings
2. Build & deploy → Clear cache and retry deploy

#### 🔧 Изменение Node версии
В netlify.toml:
```toml
[build.environment]
  NODE_VERSION = "18"
```

#### 🔧 Упрощение сборки
Временно отключите оптимизации в next.config.js:
```javascript
module.exports = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}
```

### 4. Проверочный чек-лист

- [ ] Все переменные окружения добавлены?
- [ ] package-lock.json закоммичен?
- [ ] Локально `npm run build` работает?
- [ ] Версия Node.js = 18?
- [ ] netlify.toml в корне проекта?

### 5. Если ничего не помогает

1. **Создайте новый сайт:**
   - Иногда проще создать новый сайт
   - Перенесите все настройки

2. **Ручная сборка:**
   ```bash
   npm run build
   netlify deploy --dir=.next --prod
   ```

3. **Обратитесь в поддержку:**
   - https://www.netlify.com/support/
   - Приложите логи ошибок

## 🟢 Признаки успешной сборки

- Status: Published
- Зеленая галочка
- Время сборки: 2-5 минут
- В логах: "Site is live ✨"

## 💡 Советы для стабильных сборок

1. **Фиксируйте версии:**
   ```json
   "dependencies": {
     "next": "14.2.0",
     "react": "18.2.0"
   }
   ```

2. **Используйте package-lock.json**
   - Всегда коммитьте его
   - Обновляйте через `npm install`

3. **Мониторьте размер:**
   - Удаляйте неиспользуемые пакеты
   - Используйте dynamic imports

---

⚡ В 90% случаев проблема в отсутствующих переменных окружения!