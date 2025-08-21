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
  const transaction = Sentry.startTransaction({
    op: 'function',
    name: operationName,
  });
  
  Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
  
  try {
    const result = await operation();
    transaction.setStatus('ok');
    return result;
  } catch (error) {
    transaction.setStatus('internal_error');
    throw error;
  } finally {
    transaction.finish();
  }
}

/**
 * Обертка для API вызовов с автоматическим логированием ошибок
 */
export async function sentryFetch(url, options = {}) {
  const transaction = Sentry.startTransaction({
    op: 'http.client',
    name: `${options.method || 'GET'} ${url}`,
  });
  
  try {
    addBreadcrumb({
      category: 'fetch',
      message: `${options.method || 'GET'} ${url}`,
      level: 'info',
    });
    
    const response = await fetch(url, options);
    
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
        }
      });
    }
    
    transaction.setHttpStatus(response.status);
    transaction.setStatus('ok');
    
    return response;
  } catch (error) {
    transaction.setStatus('internal_error');
    captureException(error, {
      fetch: {
        url,
        method: options.method || 'GET',
        error: error.message,
      }
    });
    throw error;
  } finally {
    transaction.finish();
  }
}

/**
 * Проверка, инициализирован ли Sentry
 */
export function isSentryEnabled() {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN;
}