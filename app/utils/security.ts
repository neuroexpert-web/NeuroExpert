// Модуль безопасности для NeuroExpert
import crypto from 'crypto';
import { NextRequest } from 'next/server';

// Конфигурация безопасности
export const SECURITY_CONFIG = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 минут
    maxRequests: 100,
    message: 'Слишком много запросов с вашего IP'
  },
  
  // CORS
  cors: {
    allowedOrigins: [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'https://neuroexpert.ru',
      'https://www.neuroexpert.ru'
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true
  },

  // Security Headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://mc.yandex.ru; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://mc.yandex.ru wss://localhost:* ws://localhost:*"
  }
};

// Rate Limiter
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  check(ip: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(ip) || [];
    
    // Очищаем старые запросы
    const validRequests = userRequests.filter(
      time => now - time < SECURITY_CONFIG.rateLimit.windowMs
    );

    if (validRequests.length >= SECURITY_CONFIG.rateLimit.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(ip, validRequests);
    return true;
  }

  reset(ip: string) {
    this.requests.delete(ip);
  }
}

export const rateLimiter = new RateLimiter();

// CSRF Protection
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Input Validation
export const validators = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  phone: (phone: string): boolean => {
    const regex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return regex.test(phone);
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  sanitizeString: (str: string): string => {
    return str
      .replace(/[<>]/g, '') // Удаляем потенциально опасные символы
      .trim()
      .substring(0, 1000); // Ограничиваем длину
  },

  sanitizeHTML: (html: string): string => {
    // Базовая санитизация HTML
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  }
};

// XSS Protection
export function escapeHTML(str: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  return str.replace(/[&<>"'/]/g, s => map[s]);
}

// SQL Injection Protection (для параметризованных запросов)
export function sanitizeSQLParam(param: any): string {
  if (typeof param === 'string') {
    return param.replace(/['";\\]/g, '');
  }
  return String(param);
}

// Проверка IP адреса
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip.trim();
}

// Шифрование данных
export class Encryption {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;

  constructor(secretKey: string) {
    this.key = crypto.scryptSync(secretKey, 'salt', 32);
  }

  encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv) as crypto.CipherGCM;
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encrypted: string, iv: string, authTag: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    ) as crypto.DecipherGCM;
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Проверка безопасности пароля
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать заглавные буквы');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать строчные буквы');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Пароль должен содержать цифры');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Пароль должен содержать специальные символы');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Middleware для проверки безопасности
export async function securityMiddleware(request: NextRequest) {
  const ip = getClientIP(request);
  
  // Rate limiting
  if (!rateLimiter.check(ip)) {
    return new Response(JSON.stringify({
      error: SECURITY_CONFIG.rateLimit.message
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // CORS проверка
  const origin = request.headers.get('origin');
  if (origin && !SECURITY_CONFIG.cors.allowedOrigins.includes(origin)) {
    return new Response('CORS policy violation', { status: 403 });
  }

  return null; // Продолжить обработку
}

// Аудит безопасности
export function auditSecurityEvent(event: {
  type: 'login' | 'logout' | 'api_access' | 'data_access' | 'error';
  userId?: string;
  ip: string;
  userAgent: string;
  details?: any;
}) {
  // Здесь можно отправить в систему логирования
  console.log('[Security Audit]', {
    timestamp: new Date().toISOString(),
    ...event
  });

  // Можно также отправить в Sentry или другую систему мониторинга
  if (process.env.NODE_ENV === 'production') {
    // Отправка в систему мониторинга
  }
}

// Экспорт утилит
export const security = {
  rateLimiter,
  generateCSRFToken,
  validateCSRFToken,
  validators,
  escapeHTML,
  sanitizeSQLParam,
  getClientIP,
  Encryption,
  validatePassword,
  securityMiddleware,
  auditSecurityEvent
};