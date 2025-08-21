# 🚨 СРОЧНЫЕ ИСПРАВЛЕНИЯ БЕЗОПАСНОСТИ

## КРИТИЧЕСКОЕ: Утечка Telegram токенов

### Немедленные действия:

1. **Отозвать токен через @BotFather**:
   ```
   1. Откройте Telegram
   2. Найдите @BotFather
   3. Отправьте команду /mybots
   4. Выберите вашего бота
   5. API Token -> Revoke current token
   ```

2. **Создать новый токен**:
   ```
   1. В @BotFather выберите вашего бота
   2. API Token -> Generate new token
   3. Сохраните новый токен в безопасном месте
   ```

3. **Удалить файлы с токенами**:
   ```bash
   rm test-telegram-now.js
   rm URGENT_DEPLOYMENT_FIX.md
   rm TELEGRAM_FINAL_FIX.md
   rm COMPLETE_DEPLOYMENT_GUIDE.md
   rm DEPLOYMENT_COMMANDS.md
   ```

4. **Очистить историю git**:
   ```bash
   # Установить BFG Repo-Cleaner
   brew install bfg  # или скачать с https://rtyley.github.io/bfg-repo-cleaner/
   
   # Удалить токены из истории
   bfg --replace-text <(echo "8293000531:AAFJzDeo7xAtVNytHKDBbHZTuQyR2EW9qcI=>[REMOVED]") .git
   bfg --replace-text <(echo "1634470382=>[REMOVED]") .git
   
   # Очистить рефлоги
   git reflog expire --expire=now --all && git gc --prune=now --aggressive
   
   # Force push (ОСТОРОЖНО!)
   git push --force
   ```

5. **Настроить переменные окружения**:
   ```bash
   # .env.local (добавить в .gitignore!)
   TELEGRAM_BOT_TOKEN=ваш_новый_токен
   TELEGRAM_CHAT_ID=ваш_chat_id
   ```

## Исправление XSS уязвимостей

### 1. Установить DOMPurify:
```bash
npm install dompurify @types/dompurify
```

### 2. Создать утилиту санитизации:
```javascript
// utils/sanitize.js
import DOMPurify from 'dompurify';

export const sanitizeHTML = (dirty) => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(dirty, { 
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
  }
  return dirty;
};
```

### 3. Заменить опасный код:
```javascript
// Было:
dangerouslySetInnerHTML={{ 
  __html: selectedModule.content.text.replace(/\n/g, '<br>') 
}}

// Стало:
dangerouslySetInnerHTML={{ 
  __html: sanitizeHTML(selectedModule.content.text.replace(/\n/g, '<br>'))
}}
```

## Усиление SECRET_KEY

### Создать файл для генерации ключа:
```python
# scripts/generate_secret_key.py
import secrets
import string

def generate_secret_key(length=64):
    """Генерирует криптографически стойкий SECRET_KEY"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))

if __name__ == "__main__":
    key = generate_secret_key()
    print(f"SECRET_KEY={key}")
    print(f"\nДлина: {len(key)} символов")
    print("Добавьте эту строку в ваш .env файл")
```

### Обновить проверку в auth.py:
```python
import re

SECRET_KEY = os.getenv("SECRET_KEY")

# Проверка существования
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set")

# Проверка длины
if len(SECRET_KEY) < 32:
    raise ValueError("SECRET_KEY must be at least 32 characters long")

# Проверка сложности
if not re.search(r'[A-Z]', SECRET_KEY) or \
   not re.search(r'[a-z]', SECRET_KEY) or \
   not re.search(r'[0-9]', SECRET_KEY):
    raise ValueError("SECRET_KEY must contain uppercase, lowercase and numbers")
```

## Защита базы данных

### 1. Обновить database.py:
```python
# Добавить SSL
if IS_PRODUCTION:
    ssl_args = {
        "ssl": "require",
        "ssl_cert": os.getenv("DB_SSL_CERT"),
        "ssl_key": os.getenv("DB_SSL_KEY"),
        "ssl_ca": os.getenv("DB_SSL_CA")
    }
    SQLALCHEMY_DATABASE_URL += "?" + "&".join(f"{k}={v}" for k, v in ssl_args.items() if v)

# Проверка пароля
if IS_PRODUCTION:
    if not POSTGRES_PASSWORD or len(POSTGRES_PASSWORD) < 16:
        raise ValueError("Database password must be at least 16 characters in production")
    
    if POSTGRES_PASSWORD.lower() in ['postgres', 'password', '123456']:
        raise ValueError("Weak database password detected!")
```

### 2. Добавить ротацию паролей:
```python
# scripts/rotate_db_password.py
import os
import psycopg2
import secrets
import string

def generate_password(length=24):
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def rotate_password():
    new_password = generate_password()
    
    # Подключение с текущим паролем
    conn = psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        database="postgres"
    )
    
    cur = conn.cursor()
    cur.execute(f"ALTER USER {os.getenv('POSTGRES_USER')} PASSWORD '{new_password}'")
    conn.commit()
    
    print(f"New password: {new_password}")
    print("Update your environment variables!")
```

## Чек-лист безопасности

- [ ] Отозваны все скомпрометированные токены
- [ ] Удалены файлы с секретами
- [ ] Очищена история git
- [ ] Настроены переменные окружения
- [ ] Установлен DOMPurify
- [ ] Исправлены XSS уязвимости
- [ ] Усилен SECRET_KEY
- [ ] Настроено SSL для БД
- [ ] Обновлены пароли БД
- [ ] Настроен .gitignore для секретов

## Автоматизация проверок

### pre-commit хук для проверки секретов:
```bash
# .git/hooks/pre-commit
#!/bin/bash

# Проверка на токены
if git diff --cached --name-only | xargs grep -E "(sk-[a-zA-Z0-9]{48}|[0-9]{10}:[a-zA-Z0-9_-]{35})" 2>/dev/null; then
    echo "❌ Обнаружены потенциальные секреты в коммите!"
    exit 1
fi

# Проверка на console.log
if git diff --cached --name-only | grep -E "\.(js|jsx|ts|tsx)$" | xargs grep "console\.log" 2>/dev/null; then
    echo "⚠️  Обнаружены console.log в коммите"
fi
```

---

**ВАЖНО**: Выполните эти действия НЕМЕДЛЕННО! Безопасность должна быть приоритетом №1.