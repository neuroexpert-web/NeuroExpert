/**
 * Advanced Security System for NeuroExpert v3.2
 * Система продвинутой безопасности корпоративного уровня
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';

// Security interfaces
interface SecurityEvent {
  type: 'login_attempt' | 'suspicious_activity' | 'data_access' | 'api_abuse' | 'injection_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ip: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: number;
}

interface ThreatIntelligence {
  ip: string;
  reputation: number; // -100 to 100
  country: string;
  isTor: boolean;
  isVPN: boolean;
  isProxy: boolean;
  threatTypes: string[];
  lastSeen: number;
}

interface SecurityPolicy {
  passwordPolicy: PasswordPolicy;
  sessionPolicy: SessionPolicy;
  accessPolicy: AccessPolicy;
  encryptionPolicy: EncryptionPolicy;
  auditPolicy: AuditPolicy;
}

// Advanced Security Manager
class AdvancedSecuritySystem {
  private static instance: AdvancedSecuritySystem;
  private rateLimiters: Map<string, any> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private threatIntelligence: Map<string, ThreatIntelligence> = new Map();
  private encryptionKeys: Map<string, Buffer> = new Map();
  private securityPolicy: SecurityPolicy;
  private anomalyDetector: SecurityAnomalyDetector;

  constructor() {
    this.initializeSecurityPolicy();
    this.initializeRateLimiters();
    this.initializeEncryption();
    this.anomalyDetector = new SecurityAnomalyDetector();
    this.startSecurityMonitoring();
  }

  static getInstance(): AdvancedSecuritySystem {
    if (!AdvancedSecuritySystem.instance) {
      AdvancedSecuritySystem.instance = new AdvancedSecuritySystem();
    }
    return AdvancedSecuritySystem.instance;
  }

  // Initialize security policies
  private initializeSecurityPolicy() {
    this.securityPolicy = {
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        preventReuse: 5,
        lockoutThreshold: 5,
        lockoutDuration: 30 * 60 * 1000 // 30 minutes
      },
      sessionPolicy: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        refreshThreshold: 2 * 60 * 60 * 1000, // 2 hours
        requireReauth: true,
        secureCookies: true,
        sameSite: 'strict'
      },
      accessPolicy: {
        maxFailedAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        requireMFA: false, // Can be enabled per user
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
        ipWhitelist: process.env.IP_WHITELIST?.split(',') || []
      },
      encryptionPolicy: {
        algorithm: 'aes-256-gcm',
        keyRotationInterval: 30 * 24 * 60 * 60 * 1000, // 30 days
        hashRounds: 12,
        saltLength: 16
      },
      auditPolicy: {
        logAllAccess: true,
        retentionPeriod: 365 * 24 * 60 * 60 * 1000, // 1 year
        realTimeMonitoring: true,
        alertThresholds: {
          failedLogins: 10,
          suspiciousActivity: 5,
          dataExfiltration: 1
        }
      }
    };
  }

  // Initialize rate limiters
  private initializeRateLimiters() {
    // Login attempts
    this.rateLimiters.set('login', new RateLimiterMemory({
      keyGenerator: (req) => req.ip,
      points: 5, // Number of attempts
      duration: 900, // Per 15 minutes
      blockDuration: 900, // Block for 15 minutes
    }));

    // API calls
    this.rateLimiters.set('api', new RateLimiterMemory({
      keyGenerator: (req) => `${req.ip}_${req.userId || 'anonymous'}`,
      points: 1000, // Number of requests
      duration: 3600, // Per hour
      blockDuration: 3600, // Block for 1 hour
    }));

    // Password reset
    this.rateLimiters.set('password_reset', new RateLimiterMemory({
      keyGenerator: (req) => req.ip,
      points: 3, // Number of attempts
      duration: 3600, // Per hour
      blockDuration: 3600, // Block for 1 hour
    }));

    // File uploads
    this.rateLimiters.set('upload', new RateLimiterMemory({
      keyGenerator: (req) => req.userId || req.ip,
      points: 10, // Number of uploads
      duration: 3600, // Per hour
      blockDuration: 1800, // Block for 30 minutes
    }));
  }

  // Initialize encryption
  private initializeEncryption() {
    // Generate master key if not exists
    const masterKey = process.env.MASTER_ENCRYPTION_KEY || this.generateEncryptionKey();
    this.encryptionKeys.set('master', Buffer.from(masterKey, 'hex'));

    // Generate data encryption keys
    this.rotateEncryptionKeys();
  }

  // Advanced authentication
  async authenticateUser(credentials: {
    email?: string;
    username?: string;
    password: string;
    mfaToken?: string;
    ip: string;
    userAgent: string;
  }): Promise<AuthenticationResult> {
    const startTime = Date.now();

    try {
      // Rate limiting check
      await this.checkRateLimit('login', { ip: credentials.ip });

      // Threat intelligence check
      const threatLevel = await this.assessThreatLevel(credentials.ip, credentials.userAgent);
      if (threatLevel > 80) {
        throw new SecurityError('High threat level detected', 'THREAT_DETECTED');
      }

      // Find user
      const user = await this.findUser(credentials.email || credentials.username);
      if (!user) {
        await this.recordSecurityEvent({
          type: 'login_attempt',
          severity: 'medium',
          ip: credentials.ip,
          userAgent: credentials.userAgent,
          details: { reason: 'user_not_found', identifier: credentials.email || credentials.username },
          timestamp: Date.now()
        });
        throw new SecurityError('Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // Check account status
      if (user.locked && user.lockedUntil > Date.now()) {
        throw new SecurityError('Account temporarily locked', 'ACCOUNT_LOCKED');
      }

      // Verify password
      const passwordValid = await this.verifyPassword(credentials.password, user.hashedPassword);
      if (!passwordValid) {
        await this.handleFailedLogin(user.id, credentials.ip);
        throw new SecurityError('Invalid credentials', 'INVALID_CREDENTIALS');
      }

      // MFA verification if required
      if (user.mfaEnabled && !credentials.mfaToken) {
        return {
          success: false,
          requiresMFA: true,
          mfaChallenge: await this.generateMFAChallenge(user.id)
        };
      }

      if (user.mfaEnabled && credentials.mfaToken) {
        const mfaValid = await this.verifyMFA(user.id, credentials.mfaToken);
        if (!mfaValid) {
          throw new SecurityError('Invalid MFA token', 'INVALID_MFA');
        }
      }

      // Generate secure session
      const session = await this.createSecureSession(user, {
        ip: credentials.ip,
        userAgent: credentials.userAgent,
        threatLevel
      });

      // Record successful login
      await this.recordSecurityEvent({
        type: 'login_attempt',
        severity: 'low',
        userId: user.id,
        ip: credentials.ip,
        userAgent: credentials.userAgent,
        details: { success: true, mfaUsed: user.mfaEnabled },
        timestamp: Date.now()
      });

      // Reset failed attempts
      await this.resetFailedAttempts(user.id);

      return {
        success: true,
        user: this.sanitizeUser(user),
        session,
        authenticationTime: Date.now() - startTime
      };

    } catch (error) {
      await this.recordSecurityEvent({
        type: 'login_attempt',
        severity: 'high',
        ip: credentials.ip,
        userAgent: credentials.userAgent,
        details: { error: error.message, code: error.code },
        timestamp: Date.now()
      });

      throw error;
    }
  }

  // Advanced password security
  async hashPassword(password: string): Promise<string> {
    // Validate password strength
    const strength = this.calculatePasswordStrength(password);
    if (strength < 80) {
      throw new SecurityError('Password does not meet security requirements', 'WEAK_PASSWORD');
    }

    // Generate salt and hash
    const salt = await bcrypt.genSalt(this.securityPolicy.passwordPolicy.hashRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  // Data encryption
  encrypt(data: string | Buffer, keyName: string = 'master'): EncryptionResult {
    const key = this.encryptionKeys.get(keyName);
    if (!key) {
      throw new SecurityError('Encryption key not found', 'KEY_NOT_FOUND');
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.securityPolicy.encryptionPolicy.algorithm, key);
    
    cipher.setAAD(Buffer.from(keyName, 'utf8'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      keyName
    };
  }

  // Data decryption
  decrypt(encryptionResult: EncryptionResult): string {
    const key = this.encryptionKeys.get(encryptionResult.keyName);
    if (!key) {
      throw new SecurityError('Decryption key not found', 'KEY_NOT_FOUND');
    }

    const decipher = crypto.createDecipher(
      this.securityPolicy.encryptionPolicy.algorithm,
      key
    );
    
    decipher.setAuthTag(Buffer.from(encryptionResult.authTag, 'hex'));
    decipher.setAAD(Buffer.from(encryptionResult.keyName, 'utf8'));

    let decrypted = decipher.update(encryptionResult.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // Input validation and sanitization
  validateAndSanitizeInput(input: any, type: 'email' | 'username' | 'password' | 'text' | 'html'): string {
    if (!input || typeof input !== 'string') {
      throw new SecurityError('Invalid input type', 'INVALID_INPUT');
    }

    // Basic XSS prevention
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');

    // SQL injection prevention
    sanitized = sanitized.replace(/['";\\]/g, '');

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
          throw new SecurityError('Invalid email format', 'INVALID_EMAIL');
        }
        break;
      
      case 'username':
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        if (!usernameRegex.test(sanitized)) {
          throw new SecurityError('Invalid username format', 'INVALID_USERNAME');
        }
        break;
      
      case 'password':
        // Password validation handled separately
        break;
      
      case 'html':
        // More aggressive HTML sanitization
        sanitized = this.sanitizeHTML(sanitized);
        break;
    }

    return sanitized;
  }

  // Threat intelligence
  async assessThreatLevel(ip: string, userAgent: string): Promise<number> {
    let threatLevel = 0;

    // Check cached threat intelligence
    const cached = this.threatIntelligence.get(ip);
    if (cached) {
      threatLevel += (100 - cached.reputation) / 2;
      if (cached.isTor) threatLevel += 30;
      if (cached.isVPN) threatLevel += 15;
      if (cached.isProxy) threatLevel += 10;
    }

    // User agent analysis
    if (this.isSuspiciousUserAgent(userAgent)) {
      threatLevel += 20;
    }

    // Geolocation check (if available)
    const geoRisk = await this.assessGeolocationRisk(ip);
    threatLevel += geoRisk;

    // Behavioral analysis
    const behaviorRisk = await this.assessBehavioralRisk(ip);
    threatLevel += behaviorRisk;

    return Math.min(threatLevel, 100);
  }

  // Security monitoring
  async detectAnomalies(): Promise<SecurityAnomaly[]> {
    const anomalies: SecurityAnomaly[] = [];

    // Analyze recent security events
    const recentEvents = this.securityEvents.filter(
      event => Date.now() - event.timestamp < 3600000 // Last hour
    );

    // Failed login spike
    const failedLogins = recentEvents.filter(
      event => event.type === 'login_attempt' && event.details.success === false
    );
    
    if (failedLogins.length > this.securityPolicy.auditPolicy.alertThresholds.failedLogins) {
      anomalies.push({
        type: 'failed_login_spike',
        severity: 'high',
        description: `${failedLogins.length} failed login attempts in the last hour`,
        affectedIPs: [...new Set(failedLogins.map(e => e.ip))],
        timestamp: Date.now()
      });
    }

    // Suspicious activity patterns
    const suspiciousEvents = recentEvents.filter(
      event => event.severity === 'high' || event.severity === 'critical'
    );
    
    if (suspiciousEvents.length > this.securityPolicy.auditPolicy.alertThresholds.suspiciousActivity) {
      anomalies.push({
        type: 'suspicious_activity',
        severity: 'critical',
        description: `${suspiciousEvents.length} suspicious events detected`,
        details: suspiciousEvents.map(e => ({ type: e.type, ip: e.ip })),
        timestamp: Date.now()
      });
    }

    return anomalies;
  }

  // Security reporting
  async generateSecurityReport(timeRange: { start: number; end: number }): Promise<SecurityReport> {
    const events = this.securityEvents.filter(
      event => event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
    );

    const report = {
      timeRange,
      totalEvents: events.length,
      eventsByType: this.groupEventsByType(events),
      eventsBySeverity: this.groupEventsBySeverity(events),
      topThreatIPs: this.getTopThreatIPs(events),
      securityMetrics: {
        averageThreatLevel: this.calculateAverageThreatLevel(events),
        blockedAttempts: events.filter(e => e.type === 'login_attempt' && !e.details.success).length,
        successfulLogins: events.filter(e => e.type === 'login_attempt' && e.details.success).length,
        anomaliesDetected: events.filter(e => e.severity === 'critical').length
      },
      recommendations: await this.generateSecurityRecommendations(events),
      timestamp: Date.now()
    };

    return report;
  }

  // Key rotation
  async rotateEncryptionKeys(): Promise<void> {
    const newKey = this.generateEncryptionKey();
    const keyName = `key_${Date.now()}`;
    
    this.encryptionKeys.set(keyName, Buffer.from(newKey, 'hex'));
    
    // Schedule old key removal
    setTimeout(() => {
      // Keep at least 2 keys for backward compatibility
      if (this.encryptionKeys.size > 2) {
        const oldestKey = Array.from(this.encryptionKeys.keys())[0];
        this.encryptionKeys.delete(oldestKey);
      }
    }, this.securityPolicy.encryptionPolicy.keyRotationInterval);
  }

  // Start security monitoring
  private startSecurityMonitoring() {
    // Check for anomalies every 5 minutes
    setInterval(async () => {
      const anomalies = await this.detectAnomalies();
      if (anomalies.length > 0) {
        await this.handleSecurityAnomalies(anomalies);
      }
    }, 5 * 60 * 1000);

    // Rotate keys daily
    setInterval(async () => {
      await this.rotateEncryptionKeys();
    }, 24 * 60 * 60 * 1000);

    // Clean up old events weekly
    setInterval(() => {
      this.cleanupOldEvents();
    }, 7 * 24 * 60 * 60 * 1000);
  }

  // Helper methods would be implemented here...
  private generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async recordSecurityEvent(event: SecurityEvent): Promise<void> {
    this.securityEvents.push(event);
    
    // Send to external SIEM if configured
    if (process.env.SIEM_ENDPOINT) {
      await this.sendToSIEM(event);
    }
  }

  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    
    // Length
    strength += Math.min(password.length * 2, 25);
    
    // Character variety
    if (/[a-z]/.test(password)) strength += 5;
    if (/[A-Z]/.test(password)) strength += 5;
    if (/[0-9]/.test(password)) strength += 5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    
    // Patterns
    if (!/(.)\1{2,}/.test(password)) strength += 10; // No repeated characters
    if (!/123|abc|qwe/i.test(password)) strength += 10; // No common sequences
    
    return Math.min(strength, 100);
  }
}

// Security error class
class SecurityError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

// Export singleton instance
export const advancedSecurity = AdvancedSecuritySystem.getInstance();
export { SecurityError };
export default advancedSecurity;