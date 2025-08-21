# 🚀 РУКОВОДСТВО ПО ОПТИМИЗАЦИИ ПРОИЗВОДИТЕЛЬНОСТИ

## 📊 Текущие проблемы производительности

### 1. Размер бандла и загрузка
- **Проблема**: Большой размер CSS (globals.css - 57KB)
- **Влияние**: Медленная начальная загрузка, особенно на мобильных

### 2. Отсутствие оптимизаций React
- **Проблема**: Компоненты перерендериваются без необходимости
- **Влияние**: Высокая нагрузка на CPU, замедление интерфейса

### 3. Неэффективные API запросы
- **Проблема**: Каждый запрос к AI идет напрямую без кеширования
- **Влияние**: Медленные ответы, высокие расходы на API

## 🛠️ Решения по оптимизации

### 1. Оптимизация CSS

```javascript
// next.config.js - добавить
module.exports = {
  // ...existing config
  experimental: {
    optimizeCss: true,
  },
  
  // Разделение CSS на критический и некритический
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Использовать MiniCssExtractPlugin для оптимизации
      const MiniCssExtractPlugin = require('mini-css-extract-plugin');
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash].css',
          chunkFilename: 'static/css/[name].[contenthash].chunk.css',
        })
      );
    }
    return config;
  }
};
```

### 2. Разделение globals.css

```css
/* critical.css - только критические стили */
:root {
  /* CSS переменные */
}

body {
  margin: 0;
  font-family: var(--font-primary);
}

/* Остальное загружать асинхронно */
```

```javascript
// app/layout.js
import './critical.css'; // Синхронно

// Асинхронная загрузка остальных стилей
if (typeof window !== 'undefined') {
  import('./globals.css');
}
```

### 3. Мемоизация компонентов

```javascript
// Пример оптимизации компонента
import { memo, useMemo, useCallback } from 'react';

// Было:
export default function ExpensiveComponent({ data, onUpdate }) {
  const processedData = data.map(item => ({
    ...item,
    processed: heavyCalculation(item)
  }));
  
  return <div>{/* render */}</div>;
}

// Стало:
const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => 
    data.map(item => ({
      ...item,
      processed: heavyCalculation(item)
    })), 
    [data]
  );
  
  const handleUpdate = useCallback((id, value) => {
    onUpdate(id, value);
  }, [onUpdate]);
  
  return <div>{/* render */}</div>;
}, (prevProps, nextProps) => {
  // Кастомная функция сравнения
  return prevProps.data === nextProps.data;
});

export default ExpensiveComponent;
```

### 4. Виртуализация длинных списков

```bash
npm install react-window
```

```javascript
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width='100%'
    >
      {Row}
    </FixedSizeList>
  );
}
```

### 5. Кеширование API запросов

```javascript
// utils/apiCache.js
class APICache {
  constructor(ttl = 300000) { // 5 минут по умолчанию
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  generateKey(endpoint, params) {
    return `${endpoint}:${JSON.stringify(params)}`;
  }
  
  get(endpoint, params) {
    const key = this.generateKey(endpoint, params);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    
    return null;
  }
  
  set(endpoint, params, data) {
    const key = this.generateKey(endpoint, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  clear() {
    this.cache.clear();
  }
}

const apiCache = new APICache();

// Использование в API роуте
export async function POST(request) {
  const { question } = await request.json();
  
  // Проверяем кеш
  const cached = apiCache.get('gemini', { question });
  if (cached) {
    return NextResponse.json({ 
      response: cached,
      cached: true 
    });
  }
  
  // Если нет в кеше, делаем запрос
  const response = await callGeminiAPI(question);
  
  // Сохраняем в кеш
  apiCache.set('gemini', { question }, response);
  
  return NextResponse.json({ response });
}
```

### 6. Оптимизация изображений

```javascript
// Использовать next/image везде
import Image from 'next/image';

// Было:
<img src="/hero-bg.jpg" alt="Hero" />

// Стало:
<Image
  src="/hero-bg.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority={true} // Для изображений above the fold
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>
```

### 7. Code Splitting и динамические импорты

```javascript
// Разделение по роутам автоматически в Next.js

// Дополнительное разделение для тяжелых компонентов
const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  {
    loading: () => <Skeleton />,
    ssr: false // Если не нужен SSR
  }
);

// Условная загрузка
const AdminPanel = dynamic(() => 
  user?.isAdmin 
    ? import('./AdminPanel')
    : Promise.resolve(() => null)
);
```

### 8. Web Workers для тяжелых вычислений

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
});

// Использование
const worker = new Worker('/worker.js');
worker.postMessage(data);
worker.addEventListener('message', (e) => {
  setResult(e.data);
});
```

### 9. Оптимизация ререндеров

```javascript
// Использовать React DevTools Profiler
// Найти компоненты с частыми ререндерами

// Разделение состояния
// Было:
const [state, setState] = useState({
  user: null,
  posts: [],
  comments: [],
  ui: { modal: false }
});

// Стало:
const [user, setUser] = useState(null);
const [posts, setPosts] = useState([]);
const [comments, setComments] = useState([]);
const [uiState, setUiState] = useState({ modal: false });
```

### 10. Метрики производительности

```javascript
// utils/performance.js
export function measurePerformance(metricName, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  // Отправка метрик
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metricName,
      value: Math.round(end - start)
    });
  }
  
  return result;
}

// Использование
const data = measurePerformance('api_call', () => 
  fetchDataFromAPI()
);
```

## 📈 Мониторинг производительности

### 1. Настройка Web Vitals
```javascript
// app/layout.js
import { useReportWebVitals } from 'next/web-vitals';

export function reportWebVitals(metric) {
  // Отправка в аналитику
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
}
```

### 2. Целевые показатели
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms

## 🎯 Приоритеты оптимизации

1. **Немедленно**: Разделить CSS, добавить кеширование API
2. **Неделя 1**: Мемоизация топ-5 компонентов
3. **Неделя 2**: Внедрить виртуализацию списков
4. **Месяц 1**: Полная оптимизация бандла и метрики

## 📊 Ожидаемые результаты

- **Скорость загрузки**: -40% (с 3.5s до 2.1s)
- **Time to Interactive**: -50% (с 5s до 2.5s)  
- **Размер бандла**: -30% (оптимизация и code splitting)
- **Расходы на API**: -60% (за счет кеширования)

---

Начните с простых оптимизаций и измеряйте результаты!