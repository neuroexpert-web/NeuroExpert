/**
 * Advanced Rate Limiting для NeuroExpert API
 * Поддержка multiple windows, whitelist, blacklist, progressive penalties
 */

// In-memory store для development (в продакшене использовать Redis)
const requestCounts = new Map();
const blockedIPs = new Map();
const whitelist = new Set(['127.0.0.1', '::1']);

/**
 * Создание rate limiter middleware
 */
export default function rateLimit(options = {}) {
  const config = {
    windowMs: 15 * 60 * 1000, // 15 минут по умолчанию
    max: 100, // максимум запросов за окно
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: (request) => getClientIP(request),
    handler: null,
    onLimitReached: null,
    // Прогрессивные penalties
    progressivePenalty: true,
    penaltyMultiplier: 2,
    maxPenaltyTime: 60 * 60 * 1000, // 1 час максимум
    // Whitelist/Blacklist
    whitelist: [],
    blacklist: [],
    ...options
  };

  return async function rateLimitMiddleware(request) {
    try {
      const key = config.keyGenerator(request);
      const now = Date.now();

      // Проверка whitelist
      if (config.whitelist.includes(key) || whitelist.has(key)) {
        return { blocked: false, remaining: config.max };
      }

      // Проверка blacklist
      if (config.blacklist.includes(key) || isBlocked(key, now)) {
        return { 
          blocked: true, 
          retryAfter: getRetryAfter(key, now),
          reason: 'IP blocked'
        };
      }

      // Получение данных счетчика
      const windowData = getWindowData(key, now, config.windowMs);
      
      // Проверка лимита
      if (windowData.count >= config.max) {
        // Применение прогрессивного penalty
        if (config.progressivePenalty) {
          applyProgressivePenalty(key, now, config);
        }

        // Вызов callback при превышении лимита
        if (config.onLimitReached) {
          config.onLimitReached(key, windowData.count);
        }

        return {
          blocked: true,
          retryAfter: Math.ceil(config.windowMs / 1000),
          remaining: 0,
          resetTime: windowData.resetTime,
          total: config.max
        };
      }

      // Увеличение счетчика
      incrementCounter(key, now, config.windowMs);

      const remaining = Math.max(0, config.max - (windowData.count + 1));

      return {
        blocked: false,
        remaining,
        resetTime: windowData.resetTime,
        total: config.max,
        current: windowData.count + 1
      };

    } catch (error) {
      console.error('Rate limiting error:', error);
      // В случае ошибки разрешаем запрос (fail-open)
      return { blocked: false, remaining: config.max };
    }
  };
}

/**
 * Получение IP адреса клиента
 */
function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (cfIP) return cfIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  return 'unknown';
}

/**
 * Получение данных окна для ключа
 */
function getWindowData(key, now, windowMs) {
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const windowEnd = windowStart + windowMs;
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, new Map());
  }
  
  const userWindows = requestCounts.get(key);
  
  // Очистка старых окон
  for (const [timestamp] of userWindows) {
    if (timestamp < windowStart) {
      userWindows.delete(timestamp);
    }
  }
  
  const currentWindow = userWindows.get(windowStart) || { count: 0, firstRequest: now };
  
  return {
    count: currentWindow.count,
    resetTime: windowEnd,
    windowStart,
    windowEnd
  };
}

/**
 * Увеличение счетчика запросов
 */
function incrementCounter(key, now, windowMs) {
  const windowStart = Math.floor(now / windowMs) * windowMs;
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, new Map());
  }
  
  const userWindows = requestCounts.get(key);
  const currentWindow = userWindows.get(windowStart) || { count: 0, firstRequest: now };
  
  currentWindow.count++;
  userWindows.set(windowStart, currentWindow);
}

/**
 * Проверка блокировки IP
 */
function isBlocked(key, now) {
  const blockData = blockedIPs.get(key);
  if (!blockData) return false;
  
  if (now < blockData.until) {
    return true;
  }
  
  // Разблокировка IP
  blockedIPs.delete(key);
  return false;
}

/**
 * Получение времени до разблокировки
 */
function getRetryAfter(key, now) {
  const blockData = blockedIPs.get(key);
  if (!blockData) return 0;
  
  return Math.ceil((blockData.until - now) / 1000);
}

/**
 * Применение прогрессивного penalty
 */
function applyProgressivePenalty(key, now, config) {
  const existing = blockedIPs.get(key);
  let penaltyDuration = config.windowMs;
  
  if (existing) {
    // Увеличиваем время блокировки при повторных нарушениях
    penaltyDuration = Math.min(
      existing.penaltyDuration * config.penaltyMultiplier,
      config.maxPenaltyTime
    );
  }
  
  blockedIPs.set(key, {
    until: now + penaltyDuration,
    penaltyDuration,
    violations: (existing?.violations || 0) + 1,
    firstViolation: existing?.firstViolation || now
  });
}

/**
 * Добавление IP в whitelist
 */
export function addToWhitelist(ip) {
  whitelist.add(ip);
}

/**
 * Удаление IP из whitelist
 */
export function removeFromWhitelist(ip) {
  whitelist.delete(ip);
}

/**
 * Блокировка IP вручную
 */
export function blockIP(ip, durationMs = 60 * 60 * 1000) {
  const now = Date.now();
  blockedIPs.set(ip, {
    until: now + durationMs,
    penaltyDuration: durationMs,
    violations: 1,
    firstViolation: now,
    manual: true
  });
}

/**
 * Разблокировка IP
 */
export function unblockIP(ip) {
  blockedIPs.delete(ip);
}

/**
 * Получение статистики rate limiting
 */
export function getRateLimitStats() {
  const now = Date.now();
  const stats = {
    totalKeys: requestCounts.size,
    blockedIPs: blockedIPs.size,
    whitelistedIPs: whitelist.size,
    activeWindows: 0,
    totalRequests: 0
  };

  // Подсчет активных окон и запросов
  for (const [key, windows] of requestCounts) {
    for (const [timestamp, windowData] of windows) {
      if (timestamp > now - 60 * 60 * 1000) { // Последний час
        stats.activeWindows++;
        stats.totalRequests += windowData.count;
      }
    }
  }

  return stats;
}

/**
 * Очистка старых данных (вызывать периодически)
 */
export function cleanupOldData() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 часа

  // Очистка старых счетчиков
  for (const [key, windows] of requestCounts) {
    for (const [timestamp] of windows) {
      if (timestamp < now - maxAge) {
        windows.delete(timestamp);
      }
    }
    
    if (windows.size === 0) {
      requestCounts.delete(key);
    }
  }

  // Очистка истекших блокировок
  for (const [key, blockData] of blockedIPs) {
    if (now >= blockData.until && !blockData.manual) {
      blockedIPs.delete(key);
    }
  }
}

// Автоматическая очистка каждые 10 минут
setInterval(cleanupOldData, 10 * 60 * 1000);

/**
 * Специализированные rate limiters для разных endpoints
 */
export const analyticsRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 100,
  message: 'Too many analytics requests',
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 1000,
  message: 'Too many API requests',
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // Строже для аутентификации
  message: 'Too many authentication attempts',
  progressivePenalty: true,
  penaltyMultiplier: 3,
  maxPenaltyTime: 60 * 60 * 1000 // 1 час
});

export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 30, // Ограничение для AI запросов
  message: 'Too many AI requests',
});

/**
 * Rate limiter для SwipeContainer событий
 */
export const swipeRateLimit = rateLimit({
  windowMs: 10 * 1000, // 10 секунд
  max: 50, // Максимум 50 свайпов за 10 секунд
  message: 'Too many swipe events',
  keyGenerator: (request) => {
    // Комбинируем IP и session ID для более точного лимитирования
    const ip = getClientIP(request);
    const sessionId = request.headers.get('x-session-id') || 'anonymous';
    return `${ip}:${sessionId}`;
  }
});