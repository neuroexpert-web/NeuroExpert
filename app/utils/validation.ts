/**
 * Универсальный модуль валидации для форм и API
 */

// Паттерны для валидации
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noScript: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
};

// Интерфейсы
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  sanitize?: (value: any) => any;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [field: string]: string };
  sanitizedData?: { [field: string]: any };
}

/**
 * Основная функция валидации
 */
export function validate(data: any, schema: ValidationSchema): ValidationResult {
  const errors: { [field: string]: string } = {};
  const sanitizedData: { [field: string]: any } = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Проверка обязательности
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = `${field} обязательно для заполнения`;
      continue;
    }
    
    // Пропускаем необязательные пустые поля
    if (!value && !rules.required) {
      continue;
    }
    
    // Проверка длины
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} должно содержать минимум ${rules.minLength} символов`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${field} должно содержать максимум ${rules.maxLength} символов`;
      }
    }
    
    // Проверка паттерна
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = `${field} имеет неверный формат`;
    }
    
    // Кастомная валидация
    if (rules.custom) {
      const customResult = rules.custom(value);
      if (customResult !== true) {
        errors[field] = typeof customResult === 'string' ? customResult : `${field} не прошло проверку`;
      }
    }
    
    // Санитизация данных
    if (rules.sanitize && !errors[field]) {
      sanitizedData[field] = rules.sanitize(value);
    } else if (!errors[field]) {
      sanitizedData[field] = value;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: Object.keys(errors).length === 0 ? sanitizedData : undefined
  };
}

/**
 * Предустановленные схемы валидации
 */
export const schemas = {
  // Форма контактов
  contactForm: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 100,
      sanitize: (v: string) => sanitizeString(v)
    },
    email: {
      required: true,
      pattern: patterns.email,
      sanitize: (v: string) => v.toLowerCase().trim()
    },
    phone: {
      required: false,
      pattern: patterns.phone,
      sanitize: (v: string) => v.replace(/\D/g, '')
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
      sanitize: (v: string) => sanitizeString(v)
    }
  },
  
  // Форма авторизации
  authForm: {
    email: {
      required: true,
      pattern: patterns.email,
      sanitize: (v: string) => v.toLowerCase().trim()
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 128,
      custom: (v: string) => {
        // Проверка сложности пароля
        if (!/[A-Z]/.test(v)) return 'Пароль должен содержать заглавные буквы';
        if (!/[a-z]/.test(v)) return 'Пароль должен содержать строчные буквы';
        if (!/[0-9]/.test(v)) return 'Пароль должен содержать цифры';
        return true;
      }
    }
  },
  
  // API запросы
  apiRequest: {
    question: {
      required: true,
      minLength: 3,
      maxLength: 500,
      sanitize: (v: string) => sanitizeString(v)
    },
    context: {
      required: false,
      maxLength: 2000,
      sanitize: (v: string) => sanitizeString(v)
    }
  }
};

/**
 * Функции санитизации
 */
export function sanitizeString(str: string): string {
  if (typeof str !== 'string') return '';
  
  return str
    .trim()
    .replace(patterns.noScript, '') // Удаляем script теги
    .replace(/[<>]/g, '') // Удаляем HTML теги
    .replace(/javascript:/gi, '') // Удаляем javascript: протокол
    .replace(/on\w+\s*=/gi, ''); // Удаляем inline event handlers
}

export function sanitizeHtml(html: string): string {
  // Более агрессивная санитизация для HTML контента
  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'ol'];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  
  return html.replace(tagRegex, (match, tag) => {
    return allowedTags.includes(tag.toLowerCase()) ? match : '';
  });
}

/**
 * Валидация email
 */
export function isValidEmail(email: string): boolean {
  return patterns.email.test(email);
}

/**
 * Валидация телефона
 */
export function isValidPhone(phone: string): boolean {
  return patterns.phone.test(phone);
}

/**
 * Валидация URL
 */
export function isValidUrl(url: string): boolean {
  return patterns.url.test(url);
}

/**
 * Экспорт паттернов для использования в других модулях
 */
export { patterns };