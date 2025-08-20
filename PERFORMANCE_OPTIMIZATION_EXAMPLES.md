# Примеры оптимизации производительности для NeuroExpert

## 1. Оптимизация React компонентов

### Пример мемоизации компонента SmartFloatingAI:

```javascript
// app/components/SmartFloatingAI.js
'use client';
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';

// Мемоизированный подкомпонент для сообщений
const MessageItem = memo(({ message, isTyping }) => {
  return (
    <div className={`message ${message.type}`}>
      {message.text}
      {isTyping && <span className="typing-indicator">...</span>}
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

function SmartFloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('ai_messages') || '[]');
    } catch {
      return [];
    }
  });

  // Мемоизация тяжелых вычислений
  const processedMessages = useMemo(() => {
    return messages.map(msg => ({
      ...msg,
      formattedTime: new Date(msg.timestamp).toLocaleTimeString()
    }));
  }, [messages]);

  // Мемоизация callback функций
  const sendMessage = useCallback(async (text) => {
    // логика отправки сообщения
  }, [/* зависимости */]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Дебаунс для автосохранения
  const debouncedSave = useMemo(
    () => debounce((messages) => {
      localStorage.setItem('ai_messages', JSON.stringify(messages));
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSave(messages);
  }, [messages, debouncedSave]);

  return (
    <div className="smart-floating-ai">
      {/* UI компонента */}
    </div>
  );
}

export default memo(SmartFloatingAI);
```

## 2. Оптимизация загрузки бандлов

### Улучшенный next.config.js:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... существующие настройки ...

  // Расширенная оптимизация webpack
  webpack: (config, { isServer, dev }) => {
    // Удаление console.log в production
    if (!dev && !isServer) {
      config.optimization.minimizer[0].options.terserOptions = {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
      };
    }

    // Оптимизация импортов lodash и date-fns
    config.resolve.alias = {
      ...config.resolve.alias,
      'lodash': 'lodash-es',
    };

    // Анализатор бандлов (только в dev)
    if (dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // Расширенная оптимизация экспериментальных функций
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@google/generative-ai',
      'framer-motion',
      'date-fns',
      'bcryptjs',
      'jsonwebtoken',
      'styled-jsx',
      '@types/react',
      '@types/node'
    ],
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
    serverComponentsExternalPackages: ['bcryptjs'],
  },

  // Улучшенная конфигурация изображений
  images: {
    domains: ['api.dicebear.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};
```

## 3. API оптимизация с кэшированием

### Улучшенный apiCache.js:

```javascript
// app/utils/apiCache.js
class EnhancedAPICache {
  constructor() {
    this.cache = new Map();
    this.pending = new Map();
    this.cacheConfig = {
      maxSize: 100,
      maxAge: 5 * 60 * 1000, // 5 минут
      staleWhileRevalidate: true,
    };
  }

  // Дедупликация запросов
  async fetchWithDeduplication(key, fetcher) {
    // Если запрос уже выполняется, ждем его
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    // Проверяем кэш
    const cached = this.get(key);
    if (cached) {
      // Если данные устарели, но staleWhileRevalidate включен
      if (this.isStale(cached) && this.cacheConfig.staleWhileRevalidate) {
        // Возвращаем устаревшие данные и обновляем в фоне
        this.revalidateInBackground(key, fetcher);
        return cached.data;
      }
      return cached.data;
    }

    // Выполняем запрос
    const promise = fetcher()
      .then(data => {
        this.set(key, data);
        this.pending.delete(key);
        return data;
      })
      .catch(error => {
        this.pending.delete(key);
        throw error;
      });

    this.pending.set(key, promise);
    return promise;
  }

  revalidateInBackground(key, fetcher) {
    fetcher()
      .then(data => this.set(key, data))
      .catch(error => console.error('Background revalidation failed:', error));
  }

  isStale(entry) {
    return Date.now() - entry.timestamp > entry.maxAge;
  }
}

export const apiCache = new EnhancedAPICache();
```

## 4. Оптимизация FastAPI бэкенда

### Добавление Redis кэширования:

```python
# cache.py
import redis
import json
from functools import wraps
from typing import Optional, Callable
import hashlib

redis_client = redis.Redis(
    host='redis',
    port=6379,
    decode_responses=True,
    connection_pool_kwargs={
        'max_connections': 50,
        'socket_keepalive': True,
        'socket_keepalive_options': {
            1: 1,  # TCP_KEEPIDLE
            2: 2,  # TCP_KEEPINTVL
            3: 2,  # TCP_KEEPCNT
        }
    }
)

def cache_key_wrapper(func: Callable, *args, **kwargs) -> str:
    """Генерация уникального ключа для кэша"""
    cache_key = f"{func.__module__}:{func.__name__}"
    
    if args:
        args_str = ":".join(str(arg) for arg in args)
        cache_key += f":{args_str}"
    
    if kwargs:
        kwargs_str = ":".join(f"{k}={v}" for k, v in sorted(kwargs.items()))
        cache_key += f":{kwargs_str}"
    
    return hashlib.md5(cache_key.encode()).hexdigest()

def cache_result(expire_time: int = 300):
    """Декоратор для кэширования результатов функций"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = cache_key_wrapper(func, *args, **kwargs)
            
            # Проверяем кэш
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Выполняем функцию
            result = await func(*args, **kwargs)
            
            # Сохраняем в кэш
            redis_client.setex(
                cache_key,
                expire_time,
                json.dumps(result)
            )
            
            return result
        return wrapper
    return decorator

# Использование в main.py
from cache import cache_result

@app.get("/calculate")
@cache_result(expire_time=600)  # 10 минут
async def calculate(optionA: bool = Query(False), optionB: bool = Query(False)):
    # ... логика расчета ...
```

## 5. Оптимизация базы данных

### Добавление connection pooling и индексов:

```python
# database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool, QueuePool
import os

IS_PRODUCTION = os.getenv("NODE_ENV") == "production"

# Оптимизированные настройки пула
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=20 if IS_PRODUCTION else 5,
    max_overflow=40 if IS_PRODUCTION else 10,
    pool_timeout=30,
    pool_recycle=1800,  # Переподключение каждые 30 минут
    connect_args={
        "server_settings": {
            "application_name": "neuroexpert",
            "jit": "off"
        },
        "command_timeout": 60,
        "prepared_statement_cache_size": 0,  # Отключаем для избежания утечек
    }
)

# Оптимизация моделей
# models.py
from sqlalchemy import Index

class Audit(Base):
    __tablename__ = "audits"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)  # Добавлен индекс
    status = Column(String, index=True)  # Добавлен индекс
    results = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="audits")
    
    # Композитные индексы для частых запросов
    __table_args__ = (
        Index('ix_audit_owner_created', 'owner_id', 'created_at'),
        Index('ix_audit_status_created', 'status', 'created_at'),
    )
```

## 6. Service Worker для offline кэширования

### Создание service-worker.js:

```javascript
// public/service-worker.js
const CACHE_NAME = 'neuroexpert-v1';
const urlsToCache = [
  '/',
  '/styles/critical.css',
  '/fonts/inter-var.woff2',
  '/_next/static/css/',
  '/_next/static/js/',
];

// Стратегия кэширования
const cacheStrategies = {
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },
  
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  },
  
  staleWhileRevalidate: async (request) => {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
      const cache = caches.open(CACHE_NAME);
      cache.then(cache => cache.put(request, networkResponse.clone()));
      return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Стратегия для разных типов ресурсов
  if (request.destination === 'image') {
    event.respondWith(cacheStrategies.cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(cacheStrategies.networkFirst(request));
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheStrategies.cacheFirst(request));
  } else {
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
  }
});
```

## 7. Оптимизация загрузки шрифтов

### layout.js с оптимизированными шрифтами:

```javascript
// app/layout.js
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://fonts.googleapis.com"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 8. Настройка nginx для production

### nginx.conf с оптимизациями:

```nginx
# Оптимизированный nginx.conf
worker_processes auto;
worker_cpu_affinity auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Базовые оптимизации
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 100;
    
    # Gzip компрессия
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml application/atom+xml image/svg+xml;
    
    # Brotli компрессия
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css text/xml text/javascript 
                 application/json application/javascript application/xml+rss 
                 application/rss+xml application/atom+xml image/svg+xml;
    
    # Кэширование
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m 
                     inactive=7d use_temp_path=off;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=static:10m rate=50r/s;
    
    server {
        listen 80;
        server_name example.com;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Статические файлы
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_cache STATIC;
            proxy_cache_valid 200 7d;
            proxy_cache_use_stale error timeout invalid_header updating;
            add_header Cache-Control "public, immutable, max-age=31536000";
            add_header X-Cache-Status $upstream_cache_status;
            proxy_pass http://localhost:3000;
        }
        
        # API endpoints с rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
        
        # Основное приложение
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

Эти примеры покрывают основные аспекты оптимизации производительности и могут быть адаптированы под конкретные нужды проекта.