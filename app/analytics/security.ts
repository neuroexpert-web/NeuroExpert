/**
 * Security Manager for Analytics
 * Handles JWT, CSRF, rate limiting, and data privacy
 */

import { SecurityContext, RateLimitConfig } from './types';

export class SecurityManager {
  private rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();
  private csrfTokens: Set<string> = new Set();

  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    // Use browser-compatible random generation
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Server-side fallback
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    this.csrfTokens.add(token);
    
    // Clean old tokens (keep max 1000)
    if (this.csrfTokens.size > 1000) {
      const tokensArray = Array.from(this.csrfTokens);
      this.csrfTokens.delete(tokensArray[0]);
    }
    
    return token;
  }

  /**
   * Verify CSRF token
   */
  verifyCSRFToken(token: string): boolean {
    if (!token) return false;
    
    const isValid = this.csrfTokens.has(token);
    if (isValid) {
      // Single use tokens
      this.csrfTokens.delete(token);
    }
    
    return isValid;
  }

  /**
   * Check rate limit
   */
  checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      // Create new record
      this.rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    // Check if limit exceeded
    if (record.count >= config.maxRequests) {
      return false;
    }

    // Increment counter
    record.count++;
    return true;
  }

  /**
   * Anonymize IP address
   */
  anonymizeIP(ip: string): string {
    if (!ip) return '';
    
    // IPv4
    if (ip.includes('.')) {
      const parts = ip.split('.');
      parts[3] = '0'; // Zero out last octet
      return parts.join('.');
    }
    
    // IPv6
    if (ip.includes(':')) {
      const parts = ip.split(':');
      // Zero out last 4 groups for IPv6
      for (let i = 4; i < parts.length; i++) {
        parts[i] = '0';
      }
      return parts.join(':');
    }
    
    return ip;
  }

  /**
   * Sanitize event data for privacy
   */
  sanitizeEventData(data: any): any {
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'apiKey',
      'creditCard',
      'ssn',
      'email',
      'phone'
    ];

    const sanitized = { ...data };

    // Recursively sanitize objects
    const sanitizeObject = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;

      const result: any = Array.isArray(obj) ? [] : {};

      for (const [key, value] of Object.entries(obj)) {
        // Check if field is sensitive
        const isSensitive = sensitiveFields.some(field => 
          key.toLowerCase().includes(field.toLowerCase())
        );

        if (isSensitive) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }

      return result;
    };

    return sanitizeObject(sanitized);
  }

  /**
   * Hash user ID for privacy
   */
  async hashUserId(userId: string): Promise<string> {
    if (!userId) return '';
    
    const data = userId + (process.env.JWT_SECRET || 'default-secret');
    
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      // Browser environment
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    } else {
      // Simple hash for server/fallback
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).substring(0, 16);
    }
  }

  /**
   * Check Do Not Track header
   */
  respectsDoNotTrack(headers: Headers): boolean {
    const dnt = headers.get('dnt');
    return dnt === '1';
  }

  /**
   * Validate event origin
   */
  validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
    if (!origin) return false;
    
    return allowedOrigins.some(allowed => {
      if (allowed === '*') return true;
      if (allowed === origin) return true;
      
      // Check wildcard subdomains
      if (allowed.startsWith('*.')) {
        const domain = allowed.substring(2);
        return origin.endsWith(domain);
      }
      
      return false;
    });
  }

  /**
   * Generate session ID
   */
  generateSessionId(): string {
    const array = new Uint8Array(16);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Clean up old rate limit records
   */
  cleanupRateLimits(): void {
    const now = Date.now();
    
    for (const [key, record] of this.rateLimitStore.entries()) {
      if (now > record.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }
  }

  /**
   * Get security metrics
   */
  getMetrics(): {
    rateLimitRecords: number;
    activeCSRFTokens: number;
  } {
    return {
      rateLimitRecords: this.rateLimitStore.size,
      activeCSRFTokens: this.csrfTokens.size
    };
  }
}

// Export singleton instance
export const securityManager = new SecurityManager();

// Cleanup interval
if (typeof window === 'undefined') {
  setInterval(() => {
    securityManager.cleanupRateLimits();
  }, 60000); // Every minute
}