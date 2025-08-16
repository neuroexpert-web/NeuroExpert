#!/bin/bash

echo "🚀 Экспорт проекта NeuroExpert для нового деплоя"

# Создаем временную директорию
EXPORT_DIR="neuroexpert-export-$(date +%Y%m%d-%H%M%S)"
mkdir -p $EXPORT_DIR

# Копируем все необходимые файлы
echo "📦 Копирование файлов..."
cp -r app $EXPORT_DIR/
cp -r public $EXPORT_DIR/
cp -r scripts $EXPORT_DIR/
cp -r types $EXPORT_DIR/
cp package*.json $EXPORT_DIR/
cp next.config.js $EXPORT_DIR/
cp tsconfig.json $EXPORT_DIR/
cp .eslintrc.js $EXPORT_DIR/
cp .prettierrc $EXPORT_DIR/
cp .env.example $EXPORT_DIR/
cp README.md $EXPORT_DIR/

# Создаем .gitignore
cat > $EXPORT_DIR/.gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

# Создаем README для быстрого старта
cat > $EXPORT_DIR/QUICK_START.md << 'EOF'
# Быстрый старт NeuroExpert

## 1. Установка зависимостей
```bash
npm install
```

## 2. Настройка переменных окружения
Скопируйте `.env.example` в `.env` и заполните:
```
GOOGLE_GEMINI_API_KEY=ваш_ключ
JWT_SECRET=любая_строка
ADMIN_PASSWORD_HASH=хэш_пароля
```

## 3. Запуск в режиме разработки
```bash
npm run dev
```

## 4. Сборка для продакшена
```bash
npm run build
```

## 5. Деплой на Vercel
1. Push в GitHub
2. Импортируйте в Vercel
3. Добавьте переменные окружения
4. Deploy!
EOF

# Создаем архив
echo "📦 Создание архива..."
zip -r "${EXPORT_DIR}.zip" $EXPORT_DIR

echo "✅ Готово!"
echo "📁 Папка с проектом: $EXPORT_DIR"
echo "📦 Архив: ${EXPORT_DIR}.zip"
echo ""
echo "Теперь вы можете:"
echo "1. Загрузить папку $EXPORT_DIR в новый GitHub репозиторий"
echo "2. Или отправить архив ${EXPORT_DIR}.zip"