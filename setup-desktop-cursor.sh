#!/bin/bash

# 🚀 Автоматическая настройка Desktop Cursor для NeuroExpert
echo "🚀 Настройка Desktop Cursor для NeuroExpert Platform"
echo "=================================================="

# Проверка Git
echo "📋 Проверка Git..."
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен! Установите Git и запустите скрипт снова."
    exit 1
fi

# Проверка Node.js
echo "📋 Проверка Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен! Установите Node.js 18+ и запустите скрипт снова."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Версия Node.js ниже 18. Рекомендуется обновить."
fi

# Информация о репозитории
echo ""
echo "📁 Текущий репозиторий:"
git remote -v | grep origin | head -n1

# Установка зависимостей
echo ""
echo "📦 Установка зависимостей..."
npm install

# Создание .env.local если не существует
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Создание .env.local..."
    cat > .env.local << EOF
# API Keys (заполните при необходимости)
NEXT_PUBLIC_GEMINI_API_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Analytics (опционально)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_YANDEX_METRICA_ID=
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
NEXT_PUBLIC_VK_PIXEL_ID=

# Other
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ Создан .env.local - добавьте ваши ключи при необходимости"
fi

# Инструкции для пользователя
echo ""
echo "✅ НАСТРОЙКА ЗАВЕРШЕНА!"
echo "======================"
echo ""
echo "📌 СЛЕДУЮЩИЕ ШАГИ:"
echo ""
echo "1️⃣  Откройте Desktop Cursor"
echo "2️⃣  File → Open Folder → выберите эту папку: $(pwd)"
echo "3️⃣  Cursor → Sign In (войдите в ваш PRO аккаунт)"
echo "4️⃣  Откройте терминал (Ctrl+\`) и запустите:"
echo "    npm run dev"
echo ""
echo "🎯 ГОРЯЧИЕ КЛАВИШИ:"
echo "   Cmd+K - Редактировать код с AI"
echo "   Cmd+L - Чат с AI"
echo "   Cmd+I - Создать файл с AI"
echo ""
echo "💡 ПЕРВАЯ КОМАНДА ДЛЯ ТЕСТА:"
echo '   Нажмите Cmd+K и введите: "Сделай анимацию логотипа"'
echo ""
echo "📖 Полная инструкция: DESKTOP_CURSOR_SETUP.md"