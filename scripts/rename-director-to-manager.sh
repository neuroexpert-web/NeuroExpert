#!/bin/bash

# Скрипт для замены "директор" на "управляющий" во всем проекте
echo "🔄 Замена 'директор' на 'управляющий' во всем проекте..."

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Счетчик изменений
CHANGES=0

# Файлы для поиска и замены
find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./.git/*" \
  -not -path "./build/*" \
  -not -path "./dist/*" | while read -r file; do
  
  # Проверяем, содержит ли файл слово "директор"
  if grep -qi "директор" "$file" 2>/dev/null; then
    echo -e "${YELLOW}Обработка файла: $file${NC}"
    
    # Создаем временный файл
    temp_file=$(mktemp)
    
    # Заменяем различные варианты
    sed -E '
      s/([Дд])иректор/\1управляющий/g
      s/([Дд])ИРЕКТОР/\1УПРАВЛЯЮЩИЙ/g
      s/AI[[:space:]]+[Дд]иректор/AI управляющий/g
      s/ai[[:space:]]+директор/ai управляющий/g
      s/Директора/Управляющего/g
      s/директора/управляющего/g
      s/Директору/Управляющему/g
      s/директору/управляющему/g
      s/Директором/Управляющим/g
      s/директором/управляющим/g
    ' "$file" > "$temp_file"
    
    # Проверяем, были ли изменения
    if ! cmp -s "$file" "$temp_file"; then
      mv "$temp_file" "$file"
      echo -e "${GREEN}✅ Обновлен файл: $file${NC}"
      ((CHANGES++))
    else
      rm "$temp_file"
    fi
  fi
done

# Специальная обработка для конкретных файлов
echo -e "\n${YELLOW}Проверка специфичных файлов...${NC}"

# AIDirectorCapabilities компонент
if [ -f "app/components/AIDirectorCapabilities.js" ]; then
  echo "Переименование AIDirectorCapabilities в AIManagerCapabilities..."
  mv app/components/AIDirectorCapabilities.js app/components/AIManagerCapabilities.js 2>/dev/null
  echo -e "${GREEN}✅ Компонент переименован${NC}"
  ((CHANGES++))
fi

echo -e "\n${GREEN}Завершено! Всего изменений: $CHANGES${NC}"

# Предложение обновить импорты
if [ $CHANGES -gt 0 ]; then
  echo -e "\n${YELLOW}Обновляю импорты...${NC}"
  find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
    -not -path "./node_modules/*" \
    -not -path "./.next/*" | xargs sed -i.bak -E "s/AIDirectorCapabilities/AIManagerCapabilities/g" 2>/dev/null
  
  # Удаляем backup файлы
  find . -name "*.bak" -type f -delete 2>/dev/null
  
  echo -e "${GREEN}✅ Импорты обновлены${NC}"
fi