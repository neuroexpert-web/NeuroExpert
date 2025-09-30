#!/bin/bash

# 🚀 NeuroExpert - Скрипт деплоя на Vercel
# Автоматическая настройка и развертывание

set -e

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Начинаем развертывание NeuroExpert на Vercel${NC}"

# Проверка установки Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Устанавливаем Vercel CLI...${NC}"
    npm i -g vercel
fi

# Проверка переменных окружения
echo -e "${YELLOW}🔐 Проверяем переменные окружения...${NC}"

if [ ! -f .env.production.local ]; then
    echo -e "${YELLOW}📝 Создаем .env.production.local...${NC}"
    cat > .env.production.local << EOF
# Google Gemini API
GOOGLE_GEMINI_API_KEY=${GOOGLE_GEMINI_API_KEY:-"your-api-key-here"}

# Security
JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 32)}
ADMIN_PASSWORD_HASH=${ADMIN_PASSWORD_HASH:-"\$2a\$10\$YourHashHere"}

# Telegram (optional)
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN:-""}
TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID:-""}

# Site URL
NEXT_PUBLIC_SITE_URL=https://neuroexpert.vercel.app
EOF
    echo -e "${RED}⚠️  Обновите .env.production.local с реальными ключами!${NC}"
fi

# Проверка сборки
echo -e "${YELLOW}🔨 Проверяем сборку проекта...${NC}"
npm run build

# Деплой на Vercel
echo -e "${GREEN}🚀 Запускаем деплой на Vercel...${NC}"

# Первый деплой или обновление
if [ -d ".vercel" ]; then
    echo -e "${BLUE}📦 Обновляем существующий проект...${NC}"
    vercel --prod
else
    echo -e "${BLUE}🆕 Создаем новый проект на Vercel...${NC}"
    vercel --prod
fi

echo -e "${GREEN}✅ Деплой завершен!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 Ваш сайт доступен на Vercel!${NC}"
echo -e "${GREEN}📊 Dashboard: https://vercel.com/dashboard${NC}"
echo -e "${GREEN}🔗 Настройте домен в Settings → Domains${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Дополнительные инструкции
echo -e "${YELLOW}📝 Следующие шаги:${NC}"
echo -e "1. Добавьте переменные окружения в Vercel Dashboard"
echo -e "2. Настройте кастомный домен"
echo -e "3. Включите Analytics (бесплатно)"
echo -e "4. Настройте Preview Deployments для команды"