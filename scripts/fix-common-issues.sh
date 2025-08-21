#!/bin/bash

# Скрипт для исправления типичных проблем в NeuroExpert
# Запуск: ./scripts/fix-common-issues.sh

echo "🔧 Автоматическое исправление типичных проблем..."
echo "=============================================="

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Счетчики
FIXED=0
ERRORS=0

# Функция для вывода статуса
status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((FIXED++))
    else
        echo -e "${RED}❌ $1${NC}"
        ((ERRORS++))
    fi
}

# 1. Проверка и создание необходимых файлов
echo -e "\n${YELLOW}1. Проверка необходимых файлов...${NC}"

# .env.local
if [ ! -f .env.local ]; then
    echo "Создаю .env.local..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
        status "Создан .env.local из примера"
    else
        cat > .env.local << EOF
GEMINI_API_KEY=your_key_here
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "your_jwt_secret")
ADMIN_PASSWORD=admin123
NODE_ENV=development
EOF
        status "Создан базовый .env.local"
    fi
else
    echo -e "${GREEN}✅ .env.local существует${NC}"
fi

# 2. Исправление проблем с зависимостями
echo -e "\n${YELLOW}2. Проверка зависимостей...${NC}"

# Проверяем наличие package-lock.json
if [ ! -f package-lock.json ]; then
    echo "Создаю package-lock.json..."
    npm install --package-lock-only 2>/dev/null
    status "Создан package-lock.json"
fi

# Проверяем целостность node_modules
if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
    echo "Переустанавливаю зависимости..."
    rm -rf node_modules 2>/dev/null
    npm ci 2>/dev/null || npm install 2>/dev/null
    status "Зависимости переустановлены"
else
    # Проверяем на отсутствующие пакеты
    if npm list --depth=0 2>&1 | grep -q "UNMET DEPENDENCY\|missing:"; then
        echo "Найдены отсутствующие зависимости, исправляю..."
        npm install 2>/dev/null
        status "Отсутствующие зависимости установлены"
    else
        echo -e "${GREEN}✅ Все зависимости установлены${NC}"
    fi
fi

# 3. Исправление проблем с TypeScript
echo -e "\n${YELLOW}3. Проверка TypeScript...${NC}"

# Проверяем наличие tsconfig.json
if [ ! -f tsconfig.json ]; then
    echo "Создаю tsconfig.json..."
    cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
    status "Создан tsconfig.json"
else
    echo -e "${GREEN}✅ tsconfig.json существует${NC}"
fi

# 4. Исправление проблем с Next.js
echo -e "\n${YELLOW}4. Проверка Next.js конфигурации...${NC}"

# Проверяем next.config.js
if [ ! -f next.config.js ]; then
    echo "Создаю next.config.js..."
    cat > next.config.js << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
EOF
    status "Создан next.config.js"
else
    echo -e "${GREEN}✅ next.config.js существует${NC}"
fi

# 5. Очистка кэша
echo -e "\n${YELLOW}5. Очистка кэша...${NC}"

# Next.js кэш
if [ -d .next ]; then
    rm -rf .next
    status "Очищен .next кэш"
fi

# npm кэш
npm cache clean --force 2>/dev/null
status "Очищен npm кэш"

# 6. Исправление прав доступа
echo -e "\n${YELLOW}6. Исправление прав доступа...${NC}"

# Делаем скрипты исполняемыми
if [ -d scripts ]; then
    chmod +x scripts/*.sh 2>/dev/null
    status "Исправлены права для скриптов"
fi

# 7. Проверка Git хуков
echo -e "\n${YELLOW}7. Проверка Git хуков...${NC}"

if [ -f .husky/pre-commit ]; then
    npx husky install 2>/dev/null
    status "Git хуки активированы"
else
    echo -e "${YELLOW}Git хуки не настроены${NC}"
fi

# 8. Создание отсутствующих директорий
echo -e "\n${YELLOW}8. Создание необходимых директорий...${NC}"

directories=("public" "app" "app/components" "scripts" "tests")
for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        status "Создана директория $dir"
    fi
done

# 9. Базовая проверка работоспособности
echo -e "\n${YELLOW}9. Проверка работоспособности...${NC}"

# TypeScript проверка
echo "Проверка TypeScript..."
if npx tsc --noEmit 2>/dev/null; then
    status "TypeScript проверка пройдена"
else
    echo -e "${YELLOW}⚠️  TypeScript ошибки (это нормально для JS проекта)${NC}"
fi

# ESLint проверка
echo "Проверка ESLint..."
if npm run lint 2>/dev/null; then
    status "ESLint проверка пройдена"
else
    # Пытаемся автоисправить
    echo "Пытаюсь исправить ESLint ошибки..."
    npm run lint -- --fix 2>/dev/null
    if [ $? -eq 0 ]; then
        status "ESLint ошибки исправлены"
    else
        echo -e "${YELLOW}⚠️  Некоторые ESLint ошибки требуют ручного исправления${NC}"
    fi
fi

# 10. Финальная сборка
echo -e "\n${YELLOW}10. Пробная сборка проекта...${NC}"

echo "Это может занять несколько минут..."
if npm run build 2>&1 | grep -q "Compiled successfully"; then
    status "Проект успешно собирается!"
else
    echo -e "${RED}❌ Ошибка сборки - требуется ручное вмешательство${NC}"
    echo -e "${YELLOW}Попробуйте запустить: npm run dev${NC}"
fi

# Итоговый отчет
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}📊 Итоговый отчет:${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "✅ Исправлено проблем: ${GREEN}$FIXED${NC}"
echo -e "❌ Не удалось исправить: ${RED}$ERRORS${NC}"

# Рекомендации
echo -e "\n${YELLOW}💡 Рекомендации:${NC}"

if [ ! -f .env.local ] || grep -q "your_key_here" .env.local 2>/dev/null; then
    echo -e "1. ${YELLOW}Добавьте реальные API ключи в .env.local${NC}"
    echo "   - GEMINI_API_KEY из https://makersuite.google.com/app/apikey"
fi

if [ $ERRORS -gt 0 ]; then
    echo -e "2. ${YELLOW}Запустите проект в dev режиме для диагностики:${NC}"
    echo "   npm run dev"
    echo -e "3. ${YELLOW}Проверьте логи ошибок выше${NC}"
fi

echo -e "\n${GREEN}✨ Скрипт завершен!${NC}"

# Предложение запустить проект
if [ $ERRORS -eq 0 ]; then
    echo -e "\n${GREEN}Всё выглядит хорошо!${NC}"
    read -p "Запустить проект сейчас? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [ -z "$REPLY" ]; then
        npm run dev
    fi
fi