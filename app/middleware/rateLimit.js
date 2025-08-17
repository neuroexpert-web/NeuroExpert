/**
 * Rate Limiting Middleware for Next.js API Routes
 * Protects against brute force and DDoS attacks
 */

// Rate limiting middleware для защиты API endpoints
const rateLimit = new Map();

// Конфигурация лимитов для разных endpoints
const RATE_LIMITS = {
  '/api/assistant': { windowMs: 60000, max: 10 }, // 10 запросов в минуту
  '/api/contact-form': { windowMs: 300000, max: 5 }, // 5 запросов в 5 минут
  '/api/admin/auth': { windowMs: 900000, max: 5 }, // 5 попыток входа в 15 минут
  '/api/telegram-notify': { windowMs: 60000, max: 20 }, // 20 уведомлений в минуту
  'default': { windowMs: 60000, max: 30 } // 30 запросов в минуту по умолчанию
};

// Функция для получения IP адреса клиента
function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip');
  return ip || 'unknown';
}

// Основная функция rate limiting
export function rateLimitMiddleware(pathname) {
  return async function(request) {
    const clientIp = getClientIp(request);
    const key = `${clientIp}:${pathname}`;
    const now = Date.now();
    
    // Получаем конфигурацию для endpoint
    const config = RATE_LIMITS[pathname] || RATE_LIMITS.default;
    
    // Получаем текущие данные для клиента
    if (!rateLimit.has(key)) {
      rateLimit.set(key, { count: 0, resetTime: now + config.windowMs });
    }
    
    const clientData = rateLimit.get(key);
    
    // Проверяем, нужно ли сбросить счетчик
    if (now > clientData.resetTime) {
      clientData.count = 0;
      clientData.resetTime = now + config.windowMs;
    }
    
    // Увеличиваем счетчик
    clientData.count++;
    
    // Проверяем лимит
    if (clientData.count > config.max) {
      const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
      
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': config.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': clientData.resetTime.toString(),
            'Retry-After': retryAfter.toString()
          }
        }
      );
    }
    
    // Возвращаем headers с информацией о лимите
    return {
      headers: {
        'X-RateLimit-Limit': config.max.toString(),
        'X-RateLimit-Remaining': (config.max - clientData.count).toString(),
        'X-RateLimit-Reset': clientData.resetTime.toString()
      }
    };
  };
}

// Периодическая очистка старых записей (каждые 5 минут)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const keysToDelete = [];
    
    rateLimit.forEach((data, key) => {
      if (now > data.resetTime + 300000) { // Удаляем записи старше 5 минут после сброса
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => rateLimit.delete(key));
  }, 300000);
}