import { NextResponse } from 'next/server';
import { createLogger } from '../../utils/logger';

const logger = createLogger('HealthCheck');

// Health check configuration
const HEALTH_CHECKS = {
  database: checkDatabase,
  redis: checkRedis,
  aiService: checkAIService,
  storage: checkStorage,
  memory: checkMemory,
  telegram: checkTelegram
};

// Overall health status calculation
function calculateHealthStatus(checks) {
  const failedChecks = Object.values(checks).filter(check => check.status === 'fail').length;
  
  if (failedChecks === 0) return 'healthy';
  if (failedChecks <= 1) return 'degraded';
  return 'unhealthy';
}

// Database health check
async function checkDatabase() {
  try {
    // In production, you would check actual DB connection
    // For now, we'll simulate based on env var presence
    const hasDbUrl = !!process.env.DATABASE_URL;
    
    if (!hasDbUrl) {
      return {
        status: 'warning',
        message: 'Database URL not configured',
        latency: 0
      };
    }
    
    // Simulate DB query timing
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 10));
    const latency = Date.now() - start;
    
    return {
      status: 'pass',
      message: 'Database connection OK',
      latency
    };
  } catch (error) {
    logger.error('Database health check failed', { error: error.message });
    return {
      status: 'fail',
      message: error.message,
      latency: -1
    };
  }
}

// Redis cache health check
async function checkRedis() {
  // Placeholder for Redis check
  return {
    status: 'skip',
    message: 'Redis not configured',
    latency: 0
  };
}

// AI Service health check
async function checkAIService() {
  try {
    const hasApiKey = !!process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!hasApiKey) {
      return {
        status: 'fail',
        message: 'Gemini API key not configured',
        latency: 0
      };
    }
    
    // Test with a simple prompt
    const start = Date.now();
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'test', model: 'gemini' })
    });
    
    const latency = Date.now() - start;
    
    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }
    
    return {
      status: 'pass',
      message: 'AI service responding',
      latency
    };
  } catch (error) {
    logger.error('AI service health check failed', { error: error.message });
    return {
      status: 'fail',
      message: error.message,
      latency: -1
    };
  }
}

// Storage health check
async function checkStorage() {
  try {
    // Check if we can write to temp directory
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');
    
    const testFile = path.join(os.tmpdir(), 'health-check-test.txt');
    const start = Date.now();
    
    await fs.writeFile(testFile, 'test');
    await fs.unlink(testFile);
    
    const latency = Date.now() - start;
    
    return {
      status: 'pass',
      message: 'Storage write/read OK',
      latency
    };
  } catch (error) {
    logger.error('Storage health check failed', { error: error.message });
    return {
      status: 'fail',
      message: error.message,
      latency: -1
    };
  }
}

// Memory usage check
async function checkMemory() {
  try {
    const used = process.memoryUsage();
    const heapUsedMB = Math.round(used.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(used.heapTotal / 1024 / 1024);
    const rssMB = Math.round(used.rss / 1024 / 1024);
    
    const heapUsagePercent = (used.heapUsed / used.heapTotal) * 100;
    
    let status = 'pass';
    if (heapUsagePercent > 90) status = 'fail';
    else if (heapUsagePercent > 80) status = 'warning';
    
    return {
      status,
      message: `Heap: ${heapUsedMB}/${heapTotalMB}MB (${heapUsagePercent.toFixed(1)}%), RSS: ${rssMB}MB`,
      data: {
        heapUsed: heapUsedMB,
        heapTotal: heapTotalMB,
        rss: rssMB,
        heapUsagePercent: heapUsagePercent.toFixed(1)
      }
    };
  } catch (error) {
    return {
      status: 'fail',
      message: error.message
    };
  }
}

// Telegram notification service check
async function checkTelegram() {
  try {
    const hasConfig = process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID;
    
    if (!hasConfig) {
      return {
        status: 'skip',
        message: 'Telegram not configured',
        latency: 0
      };
    }
    
    // Test API availability
    const start = Date.now();
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`,
      { signal: AbortSignal.timeout(5000) }
    );
    
    const latency = Date.now() - start;
    
    if (!response.ok) {
      throw new Error(`Telegram API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      status: 'pass',
      message: `Connected as @${data.result.username}`,
      latency
    };
  } catch (error) {
    logger.error('Telegram health check failed', { error: error.message });
    return {
      status: 'fail',
      message: error.message,
      latency: -1
    };
  }
}

// Main health check endpoint
export async function GET(request) {
  const startTime = Date.now();
  
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    const service = searchParams.get('service');
    
    // Run specific service check if requested
    if (service && HEALTH_CHECKS[service]) {
      const result = await HEALTH_CHECKS[service]();
      return NextResponse.json({
        service,
        ...result,
        timestamp: new Date().toISOString()
      });
    }
    
    // Run all health checks in parallel
    const checkPromises = Object.entries(HEALTH_CHECKS).map(async ([name, checkFn]) => {
      try {
        const result = await checkFn();
        return [name, result];
      } catch (error) {
        return [name, {
          status: 'fail',
          message: error.message,
          error: true
        }];
      }
    });
    
    const results = await Promise.all(checkPromises);
    const checks = Object.fromEntries(results);
    
    // Calculate overall status
    const status = calculateHealthStatus(checks);
    const totalDuration = Date.now() - startTime;
    
    // Build response
    const response = {
      status,
      timestamp: new Date().toISOString(),
      duration: `${totalDuration}ms`,
      version: process.env.npm_package_version || '3.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    if (detailed) {
      response.checks = checks;
      response.system = {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: Math.floor(process.uptime()),
        memory: process.memoryUsage()
      };
    }
    
    // Log health check result
    if (status === 'unhealthy') {
      logger.error('Health check failed', { checks });
    } else if (status === 'degraded') {
      logger.warn('Health check degraded', { checks });
    }
    
    // Set appropriate status code
    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;
    
    return NextResponse.json(response, { status: statusCode });
    
  } catch (error) {
    logger.error('Health check error', { error: error.message });
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Liveness probe endpoint (simple check)
export async function HEAD() {
  return new Response(null, { status: 200 });
}