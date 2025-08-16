# 🚀 Развертывание NeuroExpert на Российских Хостингах

## 📊 Сравнение хостингов для вашей платформы

### 1. REG.RU (Рекомендуется)
**Преимущества:**
- ✅ Дата-центры в Москве и СПб
- ✅ Поддержка Node.js из коробки
- ✅ SSL сертификаты бесплатно
- ✅ Автоматическое резервное копирование
- ✅ DDoS защита включена
- ✅ Техподдержка 24/7 на русском

**Тарифы для Next.js:**
- VPS Start: 299₽/мес (1 CPU, 1GB RAM) - для тестирования
- VPS Pro: 599₽/мес (2 CPU, 2GB RAM) - оптимально для старта
- VPS Business: 1299₽/мес (4 CPU, 4GB RAM) - для production

### 2. Beget
**Преимущества:**
- ✅ Самая низкая задержка в РФ
- ✅ Встроенный Node.js менеджер
- ✅ Простая панель управления
- ✅ Бесплатный тестовый период
- ✅ Автоматическое масштабирование

**Тарифы:**
- Nice: 259₽/мес (1 CPU, 512MB RAM)
- Fast: 510₽/мес (2 CPU, 2GB RAM) - рекомендуется
- Turbo: 1530₽/мес (4 CPU, 4GB RAM)

### 3. Timeweb
**Преимущества:**
- ✅ Самая быстрая скорость в РФ
- ✅ NVMe диски
- ✅ Готовые образы для Node.js
- ✅ API для автоматизации
- ✅ Бесплатный домен на год

**Тарифы:**
- Start: 299₽/мес (1 CPU, 1GB RAM)
- Medium: 699₽/мес (2 CPU, 2GB RAM)
- Pro: 1499₽/мес (4 CPU, 4GB RAM)

## 🛠️ Подготовка к развертыванию

### Шаг 1: Оптимизация для VPS

```bash
# Создаем production build
npm run build

# Проверяем размер
du -sh .next/
```

### Шаг 2: Создание файла для PM2

Создайте `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'neuroexpert',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

### Шаг 3: Nginx конфигурация

Создайте `nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.ru;
    
    # Перенаправление на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.ru;
    
    # SSL сертификаты (путь зависит от хостинга)
    ssl_certificate /etc/letsencrypt/live/your-domain.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.ru/privkey.pem;
    
    # Безопасность
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
    
    # Проксирование на Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Статические файлы
    location /_next/static {
        alias /var/www/neuroexpert/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    location /public {
        alias /var/www/neuroexpert/public;
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

## 📦 Скрипт автоматического развертывания

Создайте `deploy-russia.sh`:

```bash
#!/bin/bash

# Конфигурация
APP_NAME="neuroexpert"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/aineuroexpert-cell/AI-Audit.git"
BRANCH="main"

echo "🚀 Начинаем развертывание NeuroExpert..."

# Обновление системы
echo "📦 Обновляем систему..."
sudo apt update && sudo apt upgrade -y

# Установка Node.js 20
echo "📦 Устанавливаем Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2
echo "📦 Устанавливаем PM2..."
sudo npm install -g pm2

# Установка Nginx
echo "📦 Устанавливаем Nginx..."
sudo apt install -y nginx

# Клонирование репозитория
echo "📥 Клонируем репозиторий..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
cd $APP_DIR
git clone $REPO_URL .
git checkout $BRANCH

# Установка зависимостей
echo "📦 Устанавливаем зависимости..."
npm ci --production

# Создание .env файла
echo "🔐 Настраиваем переменные окружения..."
cat > .env.production << EOF
NODE_ENV=production
GOOGLE_GEMINI_API_KEY=your-key-here
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_PASSWORD_HASH=your-hash-here
TELEGRAM_BOT_TOKEN=your-token-here
TELEGRAM_CHAT_ID=your-chat-id-here
EOF

# Сборка приложения
echo "🔨 Собираем приложение..."
npm run build

# Настройка PM2
echo "⚙️ Настраиваем PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Настройка Nginx
echo "⚙️ Настраиваем Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/$APP_NAME
sudo ln -s /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Настройка файрвола
echo "🔒 Настраиваем файрвол..."
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

echo "✅ Развертывание завершено!"
echo "📊 Проверьте статус: pm2 status"
echo "🌐 Ваш сайт доступен по адресу: https://your-domain.ru"
```

## 🔧 Специфика для каждого хостинга

### REG.RU
1. Используйте панель управления ISPmanager
2. Node.js устанавливается через панель
3. SSL от Let's Encrypt включен автоматически
4. Используйте встроенный файловый менеджер

### Beget
1. Используйте встроенный Node.js менеджер
2. Настройте домен через панель управления
3. PM2 предустановлен
4. Используйте Git deployment

### Timeweb
1. Выберите готовый образ с Node.js
2. Используйте панель управления для настройки
3. Автоматическое резервное копирование включено
4. API для CI/CD доступно

## 📋 Чек-лист развертывания

- [ ] Выбрать тариф VPS (минимум 2GB RAM)
- [ ] Получить доступ к VPS по SSH
- [ ] Настроить домен и DNS
- [ ] Запустить скрипт развертывания
- [ ] Настроить SSL сертификат
- [ ] Проверить работу сайта
- [ ] Настроить мониторинг (PM2 metrics)
- [ ] Настроить резервное копирование

## 🚨 Важные моменты

1. **Производительность**: Для оптимальной работы рекомендуется минимум 2GB RAM
2. **Безопасность**: Обязательно измените все дефолтные пароли
3. **Мониторинг**: Используйте PM2 monitoring или встроенные инструменты хостинга
4. **Бэкапы**: Настройте автоматическое резервное копирование

## 📞 Поддержка

- **REG.RU**: support@reg.ru, 8-800-333-18-47
- **Beget**: support@beget.com, 8-800-700-06-08
- **Timeweb**: support@timeweb.com, 8-800-333-17-06

Все хостинги предоставляют поддержку 24/7 на русском языке.