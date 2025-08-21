import * as Sentry from '@sentry/nextjs';

/**
 * Захват исключения с дополнительным контекстом
 */
export function captureException(error, context = {}) {
  Sentry.withScope((scope) => {
    // Добавляем контекст
    Object.keys(context).forEach(key => {
      scope.setContext(key, context[key]);
    });
    
    // Добавляем теги
    scope.setTag('error_boundary', false);
    scope.setLevel('error');
    
    // Захватываем исключение
    Sentry.captureException(error);
  });
}

/**
 * Захват сообщения с уровнем важности
 */
export function captureMessage(message, level = 'info', context = {}) {
  Sentry.withScope((scope) => {
    // Добавляем контекст
    Object.keys(context).forEach(key => {
      scope.setContext(key, context[key]);
    });
    
    // Захватываем сообщение
    Sentry.captureMessage(message, level);
  });
}

/**
 * Добавление хлебных крошек для отслеживания действий пользователя
 */
export function addBreadcrumb(breadcrumb) {
  Sentry.addBreadcrumb({
    timestamp: Date.now(),
    ...breadcrumb
  });
}

/**
 * Установка контекста пользователя
 */
export function setUserContext(user) {
  if (!user) {
    Sentry.setUser(null);
    return;
  }
  
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
    // Добавьте другие безопасные поля пользователя
  });
}

/**
 * Измерение производительности операции
 */
export async function measurePerformance(operationName, operation) {
  // Временно упрощенная версия для совместимости
  try {
    const startTime = Date.now();
    const result = await operation();
    const duration = Date.now() - startTime;
    
    addBreadcrumb({
      category: 'performance',
      message: `${operationName} completed in ${duration}ms`,
      level: 'info',
      data: { duration }
    });
    
    return result;
  } catch (error) {
    captureException(error, {
      performance: {
        operation: operationName,
        failed: true
      }
    });
    throw error;
  }
}

/**
 * Обертка для API вызовов с автоматическим логированием ошибок
 */
export async function sentryFetch(url, options = {}) {
  const startTime = Date.now();
  
  try {
    addBreadcrumb({
      category: 'fetch',
      message: `${options.method || 'GET'} ${url}`,
      level: 'info',
    });
    
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    addBreadcrumb({
      category: 'fetch',
      message: `Response ${response.status} in ${duration}ms`,
      level: response.ok ? 'info' : 'warning',
      data: {
        status: response.status,
        duration,
        url
      }
    });
    
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.url = url;
      
      captureException(error, {
        fetch: {
          url,
          method: options.method || 'GET',
          status: response.status,
          statusText: response.statusText,
          duration
        }
      });
    }
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    captureException(error, {
      fetch: {
        url,
        method: options.method || 'GET',
        error: error.message,
        duration
      }
    });
    throw error;
  }
}

/**
 * Проверка, инициализирован ли Sentry
 */
export function isSentryEnabled() {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN;
}