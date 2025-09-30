#!/bin/bash

# NeuroExpert - Скрипт развертывания для российских хостингов
# Поддерживает: REG.RU, Beget, Timeweb

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Конфигурация
APP_NAME="neuroexpert"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/aineuroexpert-cell/AI-Audit.git"
BRANCH="main"
NODE_VERSION="20"

echo -e "${GREEN}🚀 Начинаем развертывание NeuroExpert на российском хостинге${NC}"

# Функция для проверки команды
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Определение дистрибутива
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
fi

echo -e "${YELLOW}📦 Обнаружена система: $OS $VER${NC}"

# Обновление системы
echo -e "${YELLOW}📦 Обновляем систему...${NC}"
if command_exists apt; then
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl git build-essential
elif command_exists yum; then
    sudo yum update -y
    sudo yum install -y curl git gcc-c++ make
fi

# Установка Node.js через NodeSource
if ! command_exists node || [ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt $NODE_VERSION ]; then
    echo -e "${YELLOW}📦 Устанавливаем Node.js v$NODE_VERSION...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${GREEN}✅ Node.js уже установлен: $(node -v)${NC}"
fi

# Установка PM2
if ! command_exists pm2; then
    echo -e "${YELLOW}📦 Устанавливаем PM2...${NC}"
    sudo npm install -g pm2
else
    echo -e "${GREEN}✅ PM2 уже установлен${NC}"
fi

# Установка Nginx
if ! command_exists nginx; then
    echo -e "${YELLOW}📦 Устанавливаем Nginx...${NC}"
    sudo apt install -y nginx
else
    echo -e "${GREEN}✅ Nginx уже установлен${NC}"
fi

# Создание директории приложения
echo -e "${YELLOW}📁 Создаем директорию приложения...${NC}"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Клонирование или обновление репозитория
if [ -d "$APP_DIR/.git" ]; then
    echo -e "${YELLOW}📥 Обновляем репозиторий...${NC}"
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/$BRANCH
else
    echo -e "${YELLOW}📥 Клонируем репозиторий...${NC}"
    cd $APP_DIR
    git clone $REPO_URL .
    git checkout $BRANCH
fi

# Создание директории для логов
mkdir -p logs

# Установка зависимостей
echo -e "${YELLOW}📦 Устанавливаем зависимости...${NC}"
npm ci

# Создание .env файла если его нет
if [ ! -f .env.production.local ]; then
    echo -e "${YELLOW}🔐 Создаем файл с переменными окружения...${NC}"
    cat > .env.production.local << EOF
# Основные настройки
NODE_ENV=production

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=\${GOOGLE_GEMINI_API_KEY:-}

# Безопасность
JWT_SECRET=\${JWT_SECRET:-$(openssl rand -base64 32)}
ADMIN_PASSWORD_HASH=\${ADMIN_PASSWORD_HASH:-}

# Telegram интеграция (опционально)
TELEGRAM_BOT_TOKEN=\${TELEGRAM_BOT_TOKEN:-}
TELEGRAM_CHAT_ID=\${TELEGRAM_CHAT_ID:-}

# База данных (если используется)
DATABASE_URL=\${DATABASE_URL:-}
EOF
    echo -e "${RED}⚠️  Не забудьте обновить .env.production.local с вашими реальными ключами!${NC}"
fi

# Сборка приложения
echo -e "${YELLOW}🔨 Собираем приложение для production...${NC}"
npm run build

# Остановка старого процесса PM2 если есть
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Запуск через PM2
echo -e "${YELLOW}⚙️  Запускаем приложение через PM2...${NC}"
pm2 start ecosystem.config.js --env production

# Сохранение конфигурации PM2
pm2 save

# Настройка автозапуска PM2
echo -e "${YELLOW}⚙️  Настраиваем автозапуск PM2...${NC}"
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# Настройка Nginx
echo -e "${YELLOW}⚙️  Настраиваем Nginx...${NC}"
DOMAIN=${1:-neuroexpert.local}
sudo cp nginx.conf /etc/nginx/sites-available/$APP_NAME

# Обновляем server_name в конфигурации
sudo sed -i "s/neuroexpert.ru/$DOMAIN/g" /etc/nginx/sites-available/$APP_NAME

# Активируем сайт
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации Nginx
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx

# Настройка файрвола (если установлен ufw)
if command_exists ufw; then
    echo -e "${YELLOW}🔒 Настраиваем файрвол...${NC}"
    sudo ufw allow 'Nginx Full'
    sudo ufw allow OpenSSH
    echo "y" | sudo ufw enable
fi

# Установка SSL сертификата (Let's Encrypt)
if command_exists certbot; then
    echo -e "${YELLOW}🔐 Настраиваем SSL сертификат...${NC}"
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
else
    echo -e "${YELLOW}📦 Устанавливаем Certbot для SSL...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
    echo -e "${RED}⚠️  Запустите 'sudo certbot --nginx -d $DOMAIN' для получения SSL сертификата${NC}"
fi

# Создание скрипта для обновления
cat > update.sh << 'EOF'
#!/bin/bash
cd /var/www/neuroexpert
git pull origin main
npm ci
npm run build
pm2 reload neuroexpert
EOF
chmod +x update.sh

echo -e "${GREEN}✅ Развертывание завершено!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 Статус PM2: pm2 status${NC}"
echo -e "${GREEN}📋 Логи: pm2 logs neuroexpert${NC}"
echo -e "${GREEN}🔄 Обновление: ./update.sh${NC}"
echo -e "${GREEN}🌐 Сайт доступен: https://$DOMAIN${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Показываем статус
pm2 status

# Проверка работоспособности
echo -e "${YELLOW}🔍 Проверяем работоспособность...${NC}"
sleep 5
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo -e "${GREEN}✅ Приложение успешно запущено!${NC}"
else
    echo -e "${RED}❌ Приложение не отвечает. Проверьте логи: pm2 logs${NC}"
fi