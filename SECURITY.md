# 🔒 Security Guidelines for NeuroExpert

## Overview

This document outlines the security measures implemented in the NeuroExpert project and provides guidelines for maintaining security.

## Recent Security Improvements

### 1. Admin Panel Authentication
- ✅ Removed hardcoded password from client-side code
- ✅ Implemented server-side authentication with JWT tokens
- ✅ Added bcrypt password hashing
- ✅ Token expiration and validation

### 2. Environment Variables
- ✅ All sensitive data moved to environment variables
- ✅ No default secrets in code
- ✅ Proper error handling when env vars are missing

### 3. API Security
- ✅ CORS properly configured
- ✅ Security headers in place
- ✅ Input validation on server endpoints

## Setup Instructions

### 1. Generate Admin Password Hash

```bash
node scripts/generate-password-hash.js
```

This will prompt you for a password and generate a bcrypt hash.

### 2. Environment Variables

Create a `.env` file with the following variables:

```env
# Security Keys (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
ADMIN_PASSWORD_HASH=$2a$10$YourGeneratedHashHere
SECRET_KEY=your-python-backend-secret-key

# API Keys
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
ANTHROPIC_API_KEY=your-claude-api-key

# Telegram Integration (Optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

### 3. Security Best Practices

#### For Developers:
1. **Never commit `.env` files** - They are gitignored for a reason
2. **Use strong passwords** - Minimum 12 characters with mixed case, numbers, and symbols
3. **Rotate secrets regularly** - Change JWT_SECRET and passwords every 90 days
4. **Review dependencies** - Run `npm audit` regularly
5. **Keep dependencies updated** - Use `npm update` to get security patches

#### For Deployment:
1. **Use HTTPS only** - Ensure all traffic is encrypted
2. **Set secure headers** - Already configured in `netlify.toml`
3. **Enable rate limiting** - Prevent brute force attacks
4. **Monitor logs** - Watch for suspicious activity
5. **Backup regularly** - Keep secure backups of data

### 4. Security Headers

The following security headers are configured:

```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: [configured]
```

### 5. Authentication Flow

1. User enters password in admin panel
2. Password sent to `/api/admin/auth` endpoint
3. Server validates against hashed password
4. JWT token returned on success
5. Token stored in localStorage
6. Token validated on each admin action

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email security concerns to: [security@neuroexpert.com]
3. Include detailed steps to reproduce
4. Allow 48 hours for initial response

## Security Checklist

- [ ] All environment variables set
- [ ] Strong admin password configured
- [ ] HTTPS enabled on production
- [ ] Dependencies up to date
- [ ] No console.logs with sensitive data
- [ ] API rate limiting configured
- [ ] Error messages don't leak sensitive info
- [ ] Regular security audits scheduled

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)