#!/bin/bash

# Скрипт для генерации секретов для NeuroExpert
# Использование: ./scripts/generate-secrets.sh

echo "🔐 Генерация секретов для NeuroExpert..."
echo "========================================"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка наличия .env.local
if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  Файл .env.local уже существует!${NC}"
    read -p "Перезаписать? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Отменено."
        exit 1
    fi
    cp .env.local .env.local.backup
    echo -e "${GREEN}✅ Создана резервная копия: .env.local.backup${NC}"
fi

# Копируем пример если есть
if [ -f .env.example ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✅ Скопирован .env.example${NC}"
else
    touch .env.local
fi

# Генерация JWT Secret
echo -e "\n${YELLOW}Генерация JWT Secret...${NC}"
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
echo -e "${GREEN}✅ JWT Secret сгенерирован${NC}"

# Генерация случайного пароля для админки
echo -e "\n${YELLOW}Генерация Admin Password...${NC}"
ADMIN_PASSWORD=$(openssl rand -base64 16 2>/dev/null || node -e "console.log(require('crypto').randomBytes(16).toString('base64'))")
# Добавляем специальные символы для надежности
ADMIN_PASSWORD="${ADMIN_PASSWORD}@2025!"
echo -e "${GREEN}✅ Admin Password сгенерирован${NC}"

# Запрос Gemini API Key
echo -e "\n${YELLOW}Настройка Gemini API Key...${NC}"
echo "Получите ключ здесь: https://makersuite.google.com/app/apikey"
read -p "Введите ваш Gemini API Key (или нажмите Enter чтобы пропустить): " GEMINI_KEY

# Создание .env.local
cat > .env.local << EOF
# ==========================================
# NeuroExpert Environment Variables
# Generated: $(date)
# ==========================================

# 🔐 Обязательные переменные
# ==========================================

# Google Gemini AI API
# Получить: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=${GEMINI_KEY:-YOUR_GEMINI_API_KEY_HERE}

# JWT Secret для аутентификации
# Сгенерирован автоматически - НЕ МЕНЯЙТЕ
JWT_SECRET=${JWT_SECRET}

# Пароль администратора
# Используйте для входа в /admin
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# 🌐 Настройки приложения
# ==========================================

# Окружение
NODE_ENV=development

# URL приложения
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 🗄️ База данных (если используется)
# ==========================================

# PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/neuroexpert

# Redis
# REDIS_URL=redis://localhost:6379

# 📊 Мониторинг и аналитика (опционально)
# ==========================================

# Sentry DSN для отслеживания ошибок
# SENTRY_DSN=https://...@sentry.io/...

# Google Analytics
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Яндекс.Метрика
# NEXT_PUBLIC_YM_ID=12345678

# 🔔 Уведомления (опционально)
# ==========================================

# Slack Webhook
# SLACK_WEBHOOK=https://hooks.slack.com/services/...

# Discord Webhook  
# DISCORD_WEBHOOK=https://discord.com/api/webhooks/...

# 🚀 Deployment (для CI/CD)
# ==========================================

# Vercel
# VERCEL_TOKEN=...

# Netlify
# NETLIFY_AUTH_TOKEN=...

# 🔒 Дополнительная безопасность
# ==========================================

# Лимит запросов (запросов в минуту)
RATE_LIMIT_MAX=100

# Время жизни JWT токена
JWT_EXPIRES_IN=7d

# Разрешенные CORS origins
CORS_ORIGINS=http://localhost:3000,https://neuroexpert.ai

EOF

echo -e "\n${GREEN}✅ Файл .env.local создан успешно!${NC}"

# Создание .env.example если его нет
if [ ! -f .env.example ]; then
    echo -e "\n${YELLOW}Создание .env.example...${NC}"
    cat > .env.example << 'EOF'
# Скопируйте этот файл в .env.local и заполните значения
# cp .env.example .env.local

# Обязательные переменные
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
ADMIN_PASSWORD=your_admin_password_here

# Настройки приложения
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# База данных (опционально)
# DATABASE_URL=postgresql://user:password@localhost:5432/neuroexpert
# REDIS_URL=redis://localhost:6379

# Мониторинг (опционально)
# SENTRY_DSN=your_sentry_dsn_here
# NEXT_PUBLIC_GA_ID=your_google_analytics_id
# NEXT_PUBLIC_YM_ID=your_yandex_metrika_id
EOF
    echo -e "${GREEN}✅ Файл .env.example создан${NC}"
fi

# Добавление .env.local в .gitignore
if ! grep -q "^.env.local$" .gitignore 2>/dev/null; then
    echo -e "\n${YELLOW}Добавление .env.local в .gitignore...${NC}"
    echo -e "\n# Environment variables\n.env.local\n.env.production" >> .gitignore
    echo -e "${GREEN}✅ .gitignore обновлен${NC}"
fi

# Вывод информации
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Настройка завершена успешно!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n📋 Сгенерированные данные:"
echo -e "${YELLOW}Admin Password:${NC} ${ADMIN_PASSWORD}"
echo -e "${YELLOW}JWT Secret:${NC} [скрыт - см. .env.local]"

if [ -z "$GEMINI_KEY" ]; then
    echo -e "\n${RED}⚠️  ВАЖНО: Не забудьте добавить GEMINI_API_KEY в .env.local${NC}"
    echo -e "Получить ключ: https://makersuite.google.com/app/apikey"
fi

echo -e "\n🚀 Следующие шаги:"
echo -e "1. Откройте .env.local и проверьте/дополните переменные"
echo -e "2. Запустите: ${YELLOW}npm install${NC}"
echo -e "3. Запустите: ${YELLOW}npm run dev${NC}"
echo -e "4. Откройте: ${YELLOW}http://localhost:3000${NC}"

echo -e "\n💡 Совет: Сохраните Admin Password в безопасном месте!"

# Проверка наличия node_modules
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}Зависимости не установлены.${NC}"
    read -p "Установить сейчас? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [ -z "$REPLY" ]; then
        npm install
        echo -e "${GREEN}✅ Зависимости установлены${NC}"
    fi
fi

echo -e "\n✨ Готово к запуску!"