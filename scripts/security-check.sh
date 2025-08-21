#!/bin/bash

# Скрипт проверки безопасности проекта
echo "🔒 Запуск проверки безопасности..."

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ISSUES_FOUND=0

# 1. Проверка на .env файлы
echo -e "\n${BLUE}1. Проверка .env файлов...${NC}"

ENV_FILES=(".env" ".env.local" ".env.production" ".env.development")
for file in "${ENV_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${RED}❌ КРИТИЧНО: Найден $file${NC}"
        echo "   Этот файл НЕ должен быть в репозитории!"
        
        # Проверяем, добавлен ли в git
        if git ls-files --error-unmatch "$file" 2>/dev/null; then
            echo -e "${RED}   ⚠️  ФАЙЛ ДОБАВЛЕН В GIT! Немедленно удалите!${NC}"
            echo "   Выполните: git rm --cached $file"
            ISSUES_FOUND=1
        else
            echo -e "${YELLOW}   ✓ Файл не в git (хорошо)${NC}"
        fi
    fi
done

# 2. Проверка .gitignore
echo -e "\n${BLUE}2. Проверка .gitignore...${NC}"

REQUIRED_IGNORES=(".env" ".env.local" ".env.production" ".env.development" ".env.*")
for pattern in "${REQUIRED_IGNORES[@]}"; do
    if ! grep -q "^$pattern" .gitignore 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Паттерн '$pattern' не найден в .gitignore${NC}"
        echo "$pattern" >> .gitignore
        echo -e "${GREEN}✅ Добавлен в .gitignore${NC}"
    fi
done

# 3. Проверка на хардкод секретов
echo -e "\n${BLUE}3. Сканирование на хардкод секретов...${NC}"

# Паттерны секретов
SECRET_PATTERNS=(
    "AIza[0-9A-Za-z\\-_]{35}"                    # Google API Key
    "sk-[a-zA-Z0-9]{48}"                         # OpenAI API Key
    "ghp_[a-zA-Z0-9]{36}"                        # GitHub Personal Token
    "ghs_[a-zA-Z0-9]{36}"                        # GitHub Secret
    "PRIVATE_KEY.*=.*['\"].*['\"]"               # Private keys
    "API_KEY.*=.*['\"].*['\"]"                   # API keys
    "SECRET.*=.*['\"].*['\"]"                    # Secrets
    "PASSWORD.*=.*['\"].*['\"]"                  # Passwords
    "mongodb\\+srv://[^\\s]*"                    # MongoDB connection strings
    "postgres://[^\\s]*"                         # PostgreSQL connection strings
)

echo "Сканирование файлов..."
for pattern in "${SECRET_PATTERNS[@]}"; do
    FOUND=$(grep -r -E "$pattern" . \
        --include="*.js" \
        --include="*.jsx" \
        --include="*.ts" \
        --include="*.tsx" \
        --include="*.json" \
        --exclude-dir=node_modules \
        --exclude-dir=.next \
        --exclude-dir=.git \
        --exclude="*.example" \
        --exclude="*.md" 2>/dev/null | head -5)
    
    if [ ! -z "$FOUND" ]; then
        echo -e "${RED}❌ Найден потенциальный секрет (паттерн: $pattern):${NC}"
        echo "$FOUND" | head -3
        ISSUES_FOUND=1
    fi
done

# 4. Проверка package.json на скрипты безопасности
echo -e "\n${BLUE}4. Проверка скриптов безопасности...${NC}"

if ! grep -q "\"audit\"" package.json; then
    echo -e "${YELLOW}Добавляю скрипт audit в package.json...${NC}"
    npm pkg set scripts.audit="npm audit --production"
fi

if ! grep -q "\"check:security\"" package.json; then
    echo -e "${YELLOW}Добавляю скрипт check:security...${NC}"
    npm pkg set scripts.check:security="bash scripts/security-check.sh"
fi

# 5. Создание .env.example если его нет
echo -e "\n${BLUE}5. Проверка .env.example...${NC}"

if [ ! -f ".env.example" ]; then
    echo -e "${YELLOW}Создаю .env.example...${NC}"
    cat > .env.example << EOF
# Copy this file to .env.local and fill in your values
# NEVER commit .env.local to version control!

# Required API Keys
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Authentication
JWT_SECRET=generate_random_secret_here
ADMIN_PASSWORD=set_strong_password_here

# Optional Services
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Database (if used)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo -e "${GREEN}✅ .env.example создан${NC}"
fi

# 6. Проверка pre-commit hooks
echo -e "\n${BLUE}6. Проверка pre-commit hooks...${NC}"

if [ -d ".husky" ]; then
    if [ ! -f ".husky/pre-commit" ]; then
        echo -e "${YELLOW}Создаю pre-commit hook...${NC}"
        cat > .husky/pre-commit << 'EOF'
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Проверка на секреты перед коммитом
echo "🔍 Checking for secrets..."

# Запрещаем коммит .env файлов
if git diff --cached --name-only | grep -E "^\.env"; then
    echo "❌ ERROR: Attempting to commit .env file!"
    echo "Remove it with: git rm --cached <filename>"
    exit 1
fi

# Проверка на хардкод секретов
if git diff --cached --name-only -z | xargs -0 grep -E "(AIza[0-9A-Za-z\-_]{35}|sk-[a-zA-Z0-9]{48}|PRIVATE_KEY|API_KEY.*=.*[\'\"])" 2>/dev/null; then
    echo "❌ ERROR: Possible secret detected in staged files!"
    echo "Please review your changes."
    exit 1
fi

echo "✅ Security check passed"
EOF
        chmod +x .husky/pre-commit
        echo -e "${GREEN}✅ Pre-commit hook создан${NC}"
    fi
fi

# 7. Итоговый отчет
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}📊 Отчет о безопасности${NC}"
echo -e "${BLUE}========================================${NC}"

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ Критических проблем не найдено!${NC}"
else
    echo -e "${RED}❌ Найдены проблемы безопасности!${NC}"
    echo -e "${RED}   Пожалуйста, исправьте их перед деплоем.${NC}"
fi

echo -e "\n${YELLOW}Рекомендации:${NC}"
echo "1. Никогда не коммитьте .env файлы"
echo "2. Используйте переменные окружения для секретов"
echo "3. Регулярно запускайте npm audit"
echo "4. Проверяйте зависимости на уязвимости"
echo "5. Используйте инструменты как GitHub Secret Scanning"

# Возвращаем код ошибки если были проблемы
exit $ISSUES_FOUND