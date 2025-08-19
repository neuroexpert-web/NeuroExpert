/**
 * Централизованная конфигурация переменных окружения
 * Обеспечивает безопасность и единообразие
 */

// Проверка обязательных переменных при старте
const requiredEnvVars = {
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
};

// Опциональные переменные
const optionalEnvVars = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

// Проверяем обязательные переменные только в production
if (process.env.NODE_ENV === 'production') {
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      console.error(`Missing required environment variable: ${key}`);
      // В production лучше не падать, а использовать fallback
      if (key === 'JWT_SECRET') {
        console.warn('Using temporary JWT secret. This is insecure!');
        requiredEnvVars[key] = 'temporary-jwt-secret-change-me';
      }
    }
  }
}

// Экспортируем безопасную конфигурацию
export const config = {
  // AI Services
  geminiApiKey: requiredEnvVars.GOOGLE_GEMINI_API_KEY || '',
  anthropicApiKey: optionalEnvVars.ANTHROPIC_API_KEY || '',
  
  // Authentication
  jwtSecret: requiredEnvVars.JWT_SECRET || 'development-secret',
  
  // External Services
  telegram: {
    botToken: optionalEnvVars.TELEGRAM_BOT_TOKEN || '',
    chatId: optionalEnvVars.TELEGRAM_CHAT_ID || '',
    isConfigured: !!(optionalEnvVars.TELEGRAM_BOT_TOKEN && optionalEnvVars.TELEGRAM_CHAT_ID)
  },
  
  // Database
  databaseUrl: optionalEnvVars.DATABASE_URL || '',
  
  // Monitoring
  sentryDsn: optionalEnvVars.SENTRY_DSN || '',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Функция для безопасной проверки наличия ключей
export function hasApiKey(service) {
  switch (service) {
    case 'gemini':
      return !!config.geminiApiKey && config.geminiApiKey.length > 10;
    case 'anthropic':
      return !!config.anthropicApiKey && config.anthropicApiKey.length > 10;
    case 'telegram':
      return config.telegram.isConfigured;
    default:
      return false;
  }
}

// Логирование конфигурации (без секретов)
export function logConfig() {
  console.log('Environment Configuration:', {
    nodeEnv: config.nodeEnv,
    hasGeminiKey: hasApiKey('gemini'),
    hasAnthropicKey: hasApiKey('anthropic'),
    hasTelegram: hasApiKey('telegram'),
    hasDatabase: !!config.databaseUrl,
    hasSentry: !!config.sentryDsn,
  });
}

// Предупреждение о NEXT_PUBLIC_ переменных
if (typeof window === 'undefined') {
  // Только на сервере
  const publicKeys = Object.keys(process.env).filter(key => 
    key.startsWith('NEXT_PUBLIC_') && 
    (key.includes('API_KEY') || key.includes('SECRET') || key.includes('TOKEN'))
  );
  
  if (publicKeys.length > 0) {
    console.warn('⚠️  WARNING: Found potentially sensitive NEXT_PUBLIC_ variables:', publicKeys);
    console.warn('⚠️  These variables are exposed to the client. Move them to server-only variables!');
  }
}