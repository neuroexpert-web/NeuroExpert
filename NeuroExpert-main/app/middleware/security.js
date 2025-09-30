import { NextResponse } from 'next/server';

/**
 * Security middleware for input validation and sanitization
 */

// XSS protection - escape HTML entities
export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// SQL injection protection - basic sanitization
export function sanitizeSqlInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove SQL keywords and special characters
  return input
    .replace(/(['";\\])/g, '\\$1')
    .replace(/(\-\-|\/\*|\*\/|xp_|sp_|DROP|INSERT|DELETE|UPDATE|UNION|SELECT)/gi, '');
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (basic international format)
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

// Input validation rules
export const ValidationRules = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'Username must be 3-20 characters, alphanumeric with _ or -'
  },
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Zа-яА-Я\s'-]+$/,
    message: 'Name must be 2-50 characters, letters only'
  },
  message: {
    minLength: 10,
    maxLength: 1000,
    message: 'Message must be 10-1000 characters'
  }
};

// Validate input against rules
export function validateInput(value, rule) {
  if (!value) return { valid: false, error: 'Value is required' };
  
  const strValue = String(value);
  
  if (rule.minLength && strValue.length < rule.minLength) {
    return { valid: false, error: `Minimum length is ${rule.minLength}` };
  }
  
  if (rule.maxLength && strValue.length > rule.maxLength) {
    return { valid: false, error: `Maximum length is ${rule.maxLength}` };
  }
  
  if (rule.pattern && !rule.pattern.test(strValue)) {
    return { valid: false, error: rule.message || 'Invalid format' };
  }
  
  return { valid: true };
}

// CSRF token generation and validation
const csrfTokens = new Map();

export function generateCSRFToken(sessionId) {
  const token = crypto.randomUUID();
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 3600000 // 1 hour
  });
  return token;
}

export function validateCSRFToken(sessionId, token) {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) return false;
  if (stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return stored.token === token;
}

// Clean expired CSRF tokens
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expires < now) {
      csrfTokens.delete(key);
    }
  }
}, 300000); // Every 5 minutes

// Security headers middleware
export function securityHeaders(request) {
  const headers = new Headers(request.headers);
  
  // Security headers
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return headers;
}

// Main security middleware
export async function securityMiddleware(request) {
  // Add security headers
  const headers = securityHeaders(request);
  
  // For API routes, validate content type
  if (request.url.includes('/api/')) {
    const contentType = request.headers.get('content-type');
    
    // Only accept JSON for API endpoints
    if (request.method !== 'GET' && !contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type. Expected application/json' },
        { status: 400, headers }
      );
    }
  }
  
  return NextResponse.next({ headers });
}

// Helper to sanitize request body
export async function sanitizeRequestBody(request) {
  try {
    const body = await request.json();
    
    // Recursively sanitize all string values
    const sanitize = (obj) => {
      if (typeof obj === 'string') {
        return escapeHtml(obj);
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitize(value);
        }
        return sanitized;
      }
      return obj;
    };
    
    return sanitize(body);
  } catch (error) {
    return null;
  }
}