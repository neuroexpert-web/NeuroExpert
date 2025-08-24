/**
 * Authentication & Authorization для NeuroExpert API
 * JWT, API Keys, Role-based Access Control
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Конфигурация безопасности
 */
const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'neuroexpert-default-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  apiKeySecret: process.env.API_KEY_SECRET || 'api-key-secret',
  bcryptRounds: 12,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 минут
};

// Временное хранилище для заблокированных IP
const blockedIPs = new Map();
const loginAttempts = new Map();

// Предустановленные API ключи (в продакшене хранить в БД)
const API_KEYS = new Map([
  ['internal-analytics', {
    id: 'internal-analytics',
    name: 'Internal Analytics Service',
    permissions: ['analytics:write', 'analytics:read'],
    rateLimit: 1000,
    created: Date.now()
  }],
  ['dashboard-read', {
    id: 'dashboard-read',
    name: 'Dashboard Read Access',
    permissions: ['analytics:read'],
    rateLimit: 100,
    created: Date.now()
  }]
]);

/**
 * Генерация JWT токена
 */
export function generateJWT(payload, options = {}) {
  const defaultOptions = {
    expiresIn: AUTH_CONFIG.jwtExpiresIn,
    issuer: 'neuroexpert-api',
    audience: 'neuroexpert-client'
  };

  return jwt.sign(payload, AUTH_CONFIG.jwtSecret, { ...defaultOptions, ...options });
}

/**
 * Верификация JWT токена
 */
export function verifyJWT(token) {
  try {
    return jwt.verify(token, AUTH_CONFIG.jwtSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
}

/**
 * Верификация API ключа
 */
export function verifyAPIKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // Поиск ключа в предустановленных
  for (const [key, data] of API_KEYS) {
    if (apiKey === key) {
      return data;
    }
  }

  // Проверка хешированных ключей (для будущей реализации)
  return verifyHashedAPIKey(apiKey);
}

/**
 * Верификация хешированного API ключа
 */
function verifyHashedAPIKey(apiKey) {
  try {
    // Простая проверка формата
    if (apiKey.startsWith('nexp_')) {
      const keyData = decodeAPIKey(apiKey);
      return keyData;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Декодирование API ключа
 */
function decodeAPIKey(encodedKey) {
  try {
    // Удаляем префикс
    const keyPart = encodedKey.substring(5);
    
    // Простое декодирование (в продакшене использовать более сложную схему)
    const decoded = Buffer.from(keyPart, 'base64').toString('utf8');
    const [id, timestamp, permissions] = decoded.split(':');
    
    return {
      id,
      timestamp: parseInt(timestamp),
      permissions: permissions ? permissions.split(',') : [],
      rateLimit: 100
    };
  } catch {
    return null;
  }
}

/**
 * Генерация нового API ключа
 */
export function generateAPIKey(id, permissions = []) {
  const timestamp = Date.now();
  const keyData = `${id}:${timestamp}:${permissions.join(',')}`;
  const encoded = Buffer.from(keyData).toString('base64');
  
  return `nexp_${encoded}`;
}

/**
 * Хеширование пароля
 */
export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  
  return bcrypt.hash(password, AUTH_CONFIG.bcryptRounds);
}

/**
 * Проверка пароля
 */
export async function verifyPassword(password, hash) {
  if (!password || !hash) {
    return false;
  }
  
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/**
 * Проверка прав доступа
 */
export function hasPermission(userOrKey, requiredPermission) {
  if (!userOrKey || !requiredPermission) {
    return false;
  }

  const permissions = userOrKey.permissions || [];
  
  // Проверка точного совпадения
  if (permissions.includes(requiredPermission)) {
    return true;
  }
  
  // Проверка wildcard permissions
  const [resource, action] = requiredPermission.split(':');
  const wildcardPermission = `${resource}:*`;
  
  if (permissions.includes(wildcardPermission)) {
    return true;
  }
  
  // Проверка admin прав
  if (permissions.includes('*:*') || permissions.includes('admin')) {
    return true;
  }
  
  return false;
}

/**
 * Middleware для проверки аутентификации
 */
export function requireAuth(requiredPermissions = []) {
  return async (request) => {
    try {
      const authHeader = request.headers.get('authorization');
      const apiKey = request.headers.get('x-api-key');
      
      let user = null;
      
      // Проверка JWT токена
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        user = verifyJWT(token);
      }
      
      // Проверка API ключа
      if (!user && apiKey) {
        user = verifyAPIKey(apiKey);
      }
      
      if (!user) {
        return {
          authorized: false,
          error: 'Authentication required'
        };
      }
      
      // Проверка прав доступа
      for (const permission of requiredPermissions) {
        if (!hasPermission(user, permission)) {
          return {
            authorized: false,
            error: `Permission ${permission} required`
          };
        }
      }
      
      return {
        authorized: true,
        user
      };
      
    } catch (error) {
      return {
        authorized: false,
        error: error.message
      };
    }
  };
}

/**
 * Проверка попыток входа и блокировка IP
 */
export function checkLoginAttempts(ip) {
  const now = Date.now();
  
  // Проверка блокировки
  const blockData = blockedIPs.get(ip);
  if (blockData && now < blockData.until) {
    return {
      blocked: true,
      retryAfter: Math.ceil((blockData.until - now) / 1000),
      reason: 'Too many failed login attempts'
    };
  }
  
  // Очистка истекшей блокировки
  if (blockData && now >= blockData.until) {
    blockedIPs.delete(ip);
    loginAttempts.delete(ip);
  }
  
  return { blocked: false };
}

/**
 * Регистрация неудачной попытки входа
 */
export function recordFailedLogin(ip) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
  
  attempts.count++;
  attempts.lastAttempt = now;
  
  // Сброс счетчика через час
  if (now - attempts.firstAttempt > 60 * 60 * 1000) {
    attempts.count = 1;
    attempts.firstAttempt = now;
  }
  
  loginAttempts.set(ip, attempts);
  
  // Блокировка при превышении лимита
  if (attempts.count >= AUTH_CONFIG.maxLoginAttempts) {
    blockedIPs.set(ip, {
      until: now + AUTH_CONFIG.lockoutDuration,
      attempts: attempts.count
    });
    
    return {
      blocked: true,
      retryAfter: Math.ceil(AUTH_CONFIG.lockoutDuration / 1000)
    };
  }
  
  return { blocked: false, attemptsRemaining: AUTH_CONFIG.maxLoginAttempts - attempts.count };
}

/**
 * Регистрация успешного входа
 */
export function recordSuccessfulLogin(ip) {
  loginAttempts.delete(ip);
  blockedIPs.delete(ip);
}

/**
 * Создание сессии пользователя
 */
export function createUserSession(userData) {
  const sessionData = {
    userId: userData.id,
    username: userData.username,
    permissions: userData.permissions || [],
    roles: userData.roles || [],
    sessionId: generateSessionId(),
    createdAt: Date.now(),
    lastActivity: Date.now()
  };
  
  const token = generateJWT(sessionData);
  
  return {
    token,
    user: sessionData,
    expiresIn: AUTH_CONFIG.jwtExpiresIn
  };
}

/**
 * Генерация ID сессии
 */
function generateSessionId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `sess_${timestamp}_${random}`;
}

/**
 * Валидация пароля по требованиям безопасности
 */
export function validatePassword(password) {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { valid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password is too long (max 128 characters)');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Проверка на общие пароли
  const commonPasswords = [
    'password', '123456', 'qwerty', 'admin', 'letmein',
    'welcome', 'monkey', '1234567890', 'password123'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
}

/**
 * Расчет силы пароля
 */
function calculatePasswordStrength(password) {
  let score = 0;
  
  // Длина
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Типы символов
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z\d]/.test(password)) score += 1;
  
  // Разнообразие
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) score += 1;
  
  if (score <= 2) return 'weak';
  if (score <= 5) return 'medium';
  if (score <= 7) return 'strong';
  return 'very-strong';
}

/**
 * Очистка истекших сессий и блокировок
 */
export function cleanupExpiredSessions() {
  const now = Date.now();
  
  // Очистка блокировок
  for (const [ip, blockData] of blockedIPs) {
    if (now >= blockData.until) {
      blockedIPs.delete(ip);
    }
  }
  
  // Очистка старых попыток входа
  for (const [ip, attempts] of loginAttempts) {
    if (now - attempts.firstAttempt > 24 * 60 * 60 * 1000) { // 24 часа
      loginAttempts.delete(ip);
    }
  }
}

// Автоматическая очистка каждые 10 минут
setInterval(cleanupExpiredSessions, 10 * 60 * 1000);

/**
 * Получение статистики безопасности
 */
export function getSecurityStats() {
  return {
    blockedIPs: blockedIPs.size,
    activeAttempts: loginAttempts.size,
    apiKeys: API_KEYS.size,
    authConfig: {
      maxLoginAttempts: AUTH_CONFIG.maxLoginAttempts,
      lockoutDuration: AUTH_CONFIG.lockoutDuration,
      jwtExpiresIn: AUTH_CONFIG.jwtExpiresIn
    }
  };
}