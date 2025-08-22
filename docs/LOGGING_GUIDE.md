# 📝 Logging Guide for NeuroExpert

## Overview

This guide explains how to use the centralized logging system in the NeuroExpert project. We use a custom logger that provides structured logging with different levels, automatic production handling, and integration with external services.

## ❌ No Console.log!

**IMPORTANT**: Direct use of `console.log`, `console.error`, etc. is prohibited in the codebase. ESLint will throw an error if you try to use them.

## ✅ Using the Logger

### Basic Usage

```javascript
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('MyComponent');

// Different log levels
logger.error('Something went wrong', { userId: 123, error: err.message });
logger.warn('This might be a problem', { threshold: 100, current: 150 });
logger.info('User logged in', { userId: 123, email: 'user@example.com' });
logger.debug('Detailed debug info', { data: complexObject });
logger.trace('Very detailed trace info', { step: 1, details: data });
```

### Log Levels

- **ERROR**: Critical errors that need immediate attention
- **WARN**: Warning conditions that might become errors
- **INFO**: General informational messages
- **DEBUG**: Debug information (not shown in production by default)
- **TRACE**: Very detailed trace information

### Environment-based Logging

Set the `LOG_LEVEL` environment variable to control what gets logged:

```bash
LOG_LEVEL=DEBUG npm run dev  # Shows all logs including debug
LOG_LEVEL=INFO npm run dev   # Shows info, warn, and error (default)
LOG_LEVEL=ERROR npm run dev  # Only shows errors
```

### In Different Parts of the App

#### API Routes
```javascript
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('UserAPI');

export async function POST(req) {
  logger.info('User registration attempt', { ip: req.ip });
  
  try {
    // ... your code
    logger.info('User registered successfully', { userId: user.id });
  } catch (error) {
    logger.error('Registration failed', { 
      error: error.message, 
      stack: error.stack 
    });
  }
}
```

#### React Components
```javascript
import { createLogger } from '@/app/utils/logger';

const logger = createLogger('UserProfile');

export default function UserProfile({ userId }) {
  useEffect(() => {
    logger.debug('UserProfile mounted', { userId });
    
    return () => {
      logger.debug('UserProfile unmounted', { userId });
    };
  }, [userId]);
}
```

#### Serverless Functions
```javascript
const { createLogger } = require('../app/utils/logger');

const logger = createLogger('TelegramBot');

exports.handler = async (event) => {
  logger.info('Telegram webhook received', { 
    messageId: event.body.message_id 
  });
};
```

### Special Logger Methods

#### Performance Logging
```javascript
logger.time('fetchUserData');
// ... some operation
logger.timeEnd('fetchUserData'); // Automatically logs the duration
```

#### Metrics
```javascript
logger.metric('api.response.time', 125, 'ms');
logger.metric('users.active', 1523);
```

#### Security Events
```javascript
logger.security('failed-login-attempt', {
  ip: req.ip,
  email: attemptedEmail,
  timestamp: Date.now()
});
```

#### API Request/Response Logging
```javascript
logger.apiRequest('POST', '/api/users', { email: 'user@example.com' });
logger.apiResponse('POST', '/api/users', 201, 125); // status, duration in ms
```

### Production Features

In production (`NODE_ENV=production`):

1. **Structured JSON logs**: All logs are output as JSON for easy parsing
2. **No console output**: Console methods are overridden to use the logger
3. **External service integration**:
   - Critical errors are sent to Telegram (if configured)
   - Errors and warnings are sent to Sentry (if configured)

### Middleware Usage

For Express/Next.js middleware logging:

```javascript
import { loggerMiddleware } from '@/app/utils/logger';

// Automatically logs all requests and responses
app.use(loggerMiddleware);
```

## Best Practices

1. **Use appropriate log levels**: Don't use `error` for warnings or `info` for debug
2. **Include context**: Always include relevant data in the second parameter
3. **No sensitive data**: Never log passwords, tokens, or personal information
4. **Use structured data**: Pass objects rather than concatenating strings
5. **Be descriptive**: Use clear, actionable messages

### ❌ Bad
```javascript
console.log('Error: ' + error);
logger.info('User ' + userId + ' logged in');
logger.error('Failed'); // Too vague
```

### ✅ Good
```javascript
logger.error('Database connection failed', { 
  error: error.message, 
  host: dbHost,
  retries: retryCount 
});

logger.info('User authentication successful', { 
  userId, 
  method: 'oauth',
  provider: 'google' 
});
```

## Debugging Tips

1. **Enable debug logs locally**: Set `LOG_LEVEL=DEBUG` in your `.env.local`
2. **Filter by context**: Search logs by the component name
3. **Use trace for complex flows**: Trace level helps debug complex async operations
4. **Check production logs**: JSON format makes it easy to parse with tools

## Migration from console.log

If you're updating old code:

```javascript
// Old
console.log('Processing user', userId);
console.error('Failed to process', error);

// New
import { createLogger } from '@/app/utils/logger';
const logger = createLogger('UserProcessor');

logger.info('Processing user', { userId });
logger.error('Failed to process user', { 
  userId, 
  error: error.message,
  stack: error.stack 
});
```

Remember: The logger is your friend! It provides better debugging, monitoring, and production insights than console.log ever could.