/**
 * Валидация аналитических событий для NeuroExpert
 * OWASP Input Validation, XSS Prevention, Data Sanitization
 */

/**
 * Схемы валидации для различных типов событий
 */
const EVENT_SCHEMAS = {
  swipe_navigation: {
    required: ['direction', 'fromSection', 'toSection', 'method'],
    optional: ['timestamp'],
    validation: {
      direction: (val) => ['left', 'right'].includes(val),
      fromSection: (val) => typeof val === 'string' && val.length <= 100,
      toSection: (val) => typeof val === 'string' && val.length <= 100,
      method: (val) => ['touch', 'keyboard', 'click'].includes(val),
      timestamp: (val) => Number.isInteger(val) && val > 0
    }
  },
  
  section_view: {
    required: ['sectionName', 'sectionIndex'],
    optional: ['duration', 'timestamp'],
    validation: {
      sectionName: (val) => typeof val === 'string' && val.length <= 100,
      sectionIndex: (val) => Number.isInteger(val) && val >= 0 && val < 50,
      duration: (val) => val === null || (Number.isInteger(val) && val >= 0),
      timestamp: (val) => Number.isInteger(val) && val > 0
    }
  },

  performance_metric: {
    required: ['metric'],
    optional: ['duration', 'type', 'startTime', 'timestamp'],
    validation: {
      metric: (val) => typeof val === 'string' && val.length <= 100,
      duration: (val) => typeof val === 'number' && val >= 0,
      type: (val) => typeof val === 'string' && val.length <= 50,
      startTime: (val) => typeof val === 'number' && val >= 0,
      timestamp: (val) => Number.isInteger(val) && val > 0
    }
  },

  error: {
    required: ['type'],
    optional: ['message', 'filename', 'lineno', 'colno', 'stack', 'timestamp'],
    validation: {
      type: (val) => typeof val === 'string' && val.length <= 100,
      message: (val) => typeof val === 'string' && val.length <= 1000,
      filename: (val) => typeof val === 'string' && val.length <= 500,
      lineno: (val) => Number.isInteger(val) && val >= 0,
      colno: (val) => Number.isInteger(val) && val >= 0,
      stack: (val) => typeof val === 'string' && val.length <= 5000,
      timestamp: (val) => Number.isInteger(val) && val > 0
    }
  }
};

/**
 * Основная функция валидации аналитического события
 */
export function validateAnalyticsEvent(eventData) {
  const errors = [];
  
  try {
    // Базовая проверка структуры
    if (!eventData || typeof eventData !== 'object') {
      return { valid: false, errors: ['Event data must be an object'] };
    }

    // Проверка обязательных полей верхнего уровня
    if (!eventData.eventType || typeof eventData.eventType !== 'string') {
      errors.push('eventType is required and must be a string');
    }

    if (!eventData.events || !Array.isArray(eventData.events)) {
      errors.push('events array is required');
    }

    if (!eventData.metadata || typeof eventData.metadata !== 'object') {
      errors.push('metadata object is required');
    }

    // Санитизация eventType
    if (eventData.eventType) {
      eventData.eventType = sanitizeString(eventData.eventType, 100);
    }

    // Валидация метаданных
    if (eventData.metadata) {
      const metadataValidation = validateMetadata(eventData.metadata);
      if (!metadataValidation.valid) {
        errors.push(...metadataValidation.errors.map(err => `metadata.${err}`));
      }
    }

    // Валидация событий
    if (eventData.events && Array.isArray(eventData.events)) {
      if (eventData.events.length > 100) {
        errors.push('events array cannot contain more than 100 events');
      }

      eventData.events.forEach((event, index) => {
        const eventValidation = validateSingleEvent(event);
        if (!eventValidation.valid) {
          errors.push(...eventValidation.errors.map(err => `events[${index}].${err}`));
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitizedData: eventData
    };

  } catch (error) {
    console.error('Validation error:', error);
    return {
      valid: false,
      errors: ['Validation process failed']
    };
  }
}

/**
 * Валидация метаданных
 */
function validateMetadata(metadata) {
  const errors = [];

  // Обязательные поля
  if (!metadata.timestamp || !Number.isInteger(metadata.timestamp)) {
    errors.push('timestamp is required and must be an integer');
  }

  // Проверка временных рамок (не может быть из будущего или слишком старым)
  if (metadata.timestamp) {
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    const minuteAhead = now + (60 * 1000);
    
    if (metadata.timestamp < hourAgo || metadata.timestamp > minuteAhead) {
      errors.push('timestamp is outside acceptable range');
    }
  }

  // Санитизация строковых полей
  if (metadata.userAgent && typeof metadata.userAgent === 'string') {
    metadata.userAgent = sanitizeUserAgent(metadata.userAgent);
  }

  if (metadata.platform && typeof metadata.platform === 'string') {
    metadata.platform = sanitizeString(metadata.platform, 50);
  }

  if (metadata.batchId && typeof metadata.batchId === 'string') {
    metadata.batchId = sanitizeString(metadata.batchId, 100);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Валидация отдельного события
 */
function validateSingleEvent(event) {
  const errors = [];

  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['Event must be an object'] };
  }

  // Обязательные поля
  if (!event.id || typeof event.id !== 'string') {
    errors.push('id is required and must be a string');
  } else {
    event.id = sanitizeString(event.id, 100);
  }

  if (!event.name || typeof event.name !== 'string') {
    errors.push('name is required and must be a string');
  } else {
    event.name = sanitizeString(event.name, 100);
  }

  if (!event.properties || typeof event.properties !== 'object') {
    errors.push('properties object is required');
  }

  // Валидация по схеме события
  if (event.name && EVENT_SCHEMAS[event.name]) {
    const schemaValidation = validateEventBySchema(event, EVENT_SCHEMAS[event.name]);
    if (!schemaValidation.valid) {
      errors.push(...schemaValidation.errors);
    }
  }

  // Валидация properties
  if (event.properties) {
    const propertiesValidation = validateEventProperties(event.properties);
    if (!propertiesValidation.valid) {
      errors.push(...propertiesValidation.errors.map(err => `properties.${err}`));
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Валидация события по схеме
 */
function validateEventBySchema(event, schema) {
  const errors = [];
  const props = event.properties || {};

  // Проверка обязательных полей
  schema.required.forEach(field => {
    if (!(field in props)) {
      errors.push(`${field} is required`);
    } else if (schema.validation[field] && !schema.validation[field](props[field])) {
      errors.push(`${field} validation failed`);
    }
  });

  // Проверка опциональных полей
  schema.optional.forEach(field => {
    if (field in props && schema.validation[field] && !schema.validation[field](props[field])) {
      errors.push(`${field} validation failed`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Валидация properties события
 */
function validateEventProperties(properties) {
  const errors = [];

  // Проверка sessionId
  if (properties.sessionId && typeof properties.sessionId === 'string') {
    properties.sessionId = sanitizeString(properties.sessionId, 100);
  }

  // Проверка timestamp
  if (properties.timestamp && !Number.isInteger(properties.timestamp)) {
    errors.push('timestamp must be an integer');
  }

  // Проверка url
  if (properties.url && typeof properties.url === 'string') {
    if (!isValidUrl(properties.url)) {
      errors.push('url is not valid');
    } else {
      properties.url = sanitizeUrl(properties.url);
    }
  }

  // Проверка deviceInfo
  if (properties.deviceInfo && typeof properties.deviceInfo === 'object') {
    const deviceValidation = validateDeviceInfo(properties.deviceInfo);
    if (!deviceValidation.valid) {
      errors.push(...deviceValidation.errors.map(err => `deviceInfo.${err}`));
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Валидация информации об устройстве
 */
function validateDeviceInfo(deviceInfo) {
  const errors = [];

  const booleanFields = ['isMobile', 'isTablet', 'isDesktop', 'cookieEnabled', 'onLine'];
  booleanFields.forEach(field => {
    if (field in deviceInfo && typeof deviceInfo[field] !== 'boolean') {
      errors.push(`${field} must be a boolean`);
    }
  });

  const stringFields = ['platform', 'language'];
  stringFields.forEach(field => {
    if (deviceInfo[field] && typeof deviceInfo[field] === 'string') {
      deviceInfo[field] = sanitizeString(deviceInfo[field], 100);
    }
  });

  if (deviceInfo.languages && Array.isArray(deviceInfo.languages)) {
    deviceInfo.languages = deviceInfo.languages
      .filter(lang => typeof lang === 'string')
      .map(lang => sanitizeString(lang, 10))
      .slice(0, 10); // Максимум 10 языков
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Санитизация строки
 */
function sanitizeString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/[<>]/g, '') // Удаление HTML тегов
    .replace(/javascript:/gi, '') // Удаление javascript: схем
    .replace(/on\w+=/gi, '') // Удаление event handlers
    .trim()
    .substring(0, maxLength);
}

/**
 * Санитизация User Agent
 */
function sanitizeUserAgent(userAgent) {
  if (typeof userAgent !== 'string') return '';
  
  return userAgent
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .substring(0, 500);
}

/**
 * Санитизация URL
 */
function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url);
    // Разрешаем только безопасные протоколы
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.href.substring(0, 2000);
  } catch {
    return '';
  }
}

/**
 * Проверка валидности URL
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Валидация IP адреса (для логирования)
 */
export function validateIPAddress(ip) {
  if (typeof ip !== 'string') return false;
  
  // IPv4
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 (упрощенная проверка)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Экспорт схем для использования в тестах
 */
export { EVENT_SCHEMAS };