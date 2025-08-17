/**
 * API Cache Utility
 * Кэширование запросов для улучшения производительности
 */

class APICache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.cacheConfig = {
      maxAge: 5 * 60 * 1000, // 5 минут по умолчанию
      maxSize: 100, // максимум 100 записей
    };
  }

  // Генерация ключа кэша
  generateKey(url, options = {}) {
    const sortedOptions = Object.keys(options)
      .sort()
      .reduce((acc, key) => {
        acc[key] = options[key];
        return acc;
      }, {});
    
    return `${url}::${JSON.stringify(sortedOptions)}`;
  }

  // Проверка валидности кэша
  isValid(entry) {
    if (!entry) return false;
    return Date.now() - entry.timestamp < (entry.maxAge || this.cacheConfig.maxAge);
  }

  // Очистка устаревших записей
  cleanup() {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
      }
    }

    // Ограничение размера кэша
    if (this.cache.size > this.cacheConfig.maxSize) {
      const sortedEntries = [...this.cache.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = sortedEntries.slice(0, this.cache.size - this.cacheConfig.maxSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  // Получение данных из кэша
  get(url, options) {
    const key = this.generateKey(url, options);
    const entry = this.cache.get(key);
    
    if (this.isValid(entry)) {
      return entry.data;
    }
    
    return null;
  }

  // Сохранение в кэш
  set(url, options, data, maxAge) {
    const key = this.generateKey(url, options);
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      maxAge: maxAge || this.cacheConfig.maxAge,
    });
    
    // Запуск очистки в фоне
    if (this.cache.size % 10 === 0) {
      setTimeout(() => this.cleanup(), 0);
    }
  }

  // Предотвращение дублирования запросов
  async dedupe(url, options, fetcher) {
    const key = this.generateKey(url, options);
    
    // Проверяем кэш
    const cached = this.get(url, options);
    if (cached) return cached;
    
    // Проверяем pending запросы
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }
    
    // Создаем новый запрос
    const promise = fetcher().then(
      (data) => {
        this.pendingRequests.delete(key);
        this.set(url, options, data);
        return data;
      },
      (error) => {
        this.pendingRequests.delete(key);
        throw error;
      }
    );
    
    this.pendingRequests.set(key, promise);
    return promise;
  }

  // Инвалидация кэша
  invalidate(pattern) {
    if (typeof pattern === 'string') {
      // Точное совпадение
      this.cache.delete(pattern);
    } else if (pattern instanceof RegExp) {
      // Паттерн
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Очистить весь кэш
      this.cache.clear();
    }
  }

  // Предзагрузка данных
  async prefetch(urls, fetcher) {
    const promises = urls.map(url => 
      this.dedupe(url, {}, () => fetcher(url))
        .catch(error => console.error(`Prefetch failed for ${url}:`, error))
    );
    
    await Promise.allSettled(promises);
  }
}

// Singleton экземпляр
const apiCache = new APICache();

// Обертка для fetch с кэшированием
export const cachedFetch = async (url, options = {}) => {
  const { cache = true, maxAge, ...fetchOptions } = options;
  
  if (!cache) {
    return fetch(url, fetchOptions).then(res => res.json());
  }
  
  return apiCache.dedupe(url, fetchOptions, async () => {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
};

// Хук для использования в React компонентах
export const useCachedAPI = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await cachedFetch(url, options);
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url, JSON.stringify(options)]);

  return { data, loading, error, refetch: () => apiCache.invalidate(url) };
};

// Экспорт утилит
export default apiCache;
export { APICache };