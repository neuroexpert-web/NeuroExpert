# 🔧 Исправление ошибки Husky на Vercel

## Проблема

При деплое на Vercel возникает ошибка:
```
sh: line 1: husky: command not found
npm error code 127
```

## Причина

Husky пытается установить git hooks в окружении Vercel, где:
1. Git hooks не нужны
2. Нет доступа к .git директории
3. Husky не установлен глобально

## Решение

### 1. Обновлен package.json

Скрипт `prepare` теперь проверяет окружение:
```json
"prepare": "node scripts/prepare.js"
```

### 2. Создан scripts/prepare.js

Скрипт пропускает установку Husky в:
- CI/CD окружениях (CI=true)
- Vercel (VERCEL=true)
- Netlify (NETLIFY=true)
- Production (NODE_ENV=production)

### 3. Альтернативные решения

Если проблема повторится, можно использовать:

#### Вариант 1: Простое игнорирование
```json
"prepare": "husky || true"
```

#### Вариант 2: Проверка переменной окружения
```json
"prepare": "node -e \"if(process.env.VERCEL) process.exit(0)\" && husky || true"
```

#### Вариант 3: Использование is-ci
```bash
npm install --save-dev is-ci
```
```json
"prepare": "is-ci || husky"
```

## Проверка

1. Локально Husky должен работать:
   ```bash
   npm install
   ```

2. На Vercel должна пройти установка без ошибок

## Дополнительно

Если нужно полностью отключить Husky на Vercel:

1. В Vercel Dashboard → Settings → Environment Variables
2. Добавьте: `HUSKY=0`

Это отключит Husky полностью.