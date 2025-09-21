/**
 * Performance Analytics API Endpoint
 * Collects and stores performance metrics from the client
 */

import { NextResponse } from 'next/server';
import { createLogger } from '../../../utils/logger';

const logger = createLogger('PerformanceAPI');

// In-memory storage for demo (replace with database in production)
const performanceMetrics = new Map();

export async function POST(request) {
  try {
    const { eventType, data } = await request.json();
    
    // Validate input
    if (!eventType || !data) {
      return NextResponse.json(
        { error: 'Missing eventType or data' },
        { status: 400 }
      );
    }

    // Create metric record
    const metric = {
      id: generateId(),
      eventType,
      data,
      timestamp: Date.now(),
      userAgent: request.headers.get('user-agent'),
      ip: getClientIP(request),
      url: data.url || 'unknown'
    };

    // Store metric
    performanceMetrics.set(metric.id, metric);
    
    // Log important metrics
    if (eventType === 'web_vital' && data.rating === 'poor') {
      logger.warn(`Poor Web Vital detected: ${data.name} = ${data.value}`, {
        metric: data.name,
        value: data.value,
        url: data.url
      });
    }

    // Process specific metric types
    switch (eventType) {
      case 'web_vital':
        await processWebVital(metric);
        break;
      case 'slow_resource':
        await processSlowResource(metric);
        break;
      case 'user_interaction':
        await processUserInteraction(metric);
        break;
      case 'navigation_timing':
        await processNavigationTiming(metric);
        break;
    }

    // Clean up old metrics (keep last 1000)
    if (performanceMetrics.size > 1000) {
      const oldestEntries = Array.from(performanceMetrics.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, performanceMetrics.size - 1000);
      
      oldestEntries.forEach(([id]) => performanceMetrics.delete(id));
    }

    return NextResponse.json({ success: true, id: metric.id });

  } catch (error) {
    logger.error('Performance API error', { error: error.message });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 100;
    const timeframe = searchParams.get('timeframe') || '1h';

    // Calculate time threshold
    const timeThreshold = Date.now() - getTimeframeMs(timeframe);

    // Filter metrics
    let metrics = Array.from(performanceMetrics.values())
      .filter(metric => metric.timestamp >= timeThreshold)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    if (type) {
      metrics = metrics.filter(metric => metric.eventType === type);
    }

    // Calculate summary statistics
    const summary = calculateSummary(metrics);

    return NextResponse.json({
      metrics,
      summary,
      count: metrics.length,
      timeframe
    });

  } catch (error) {
    logger.error('Performance API GET error', { error: error.message });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function getTimeframeMs(timeframe) {
  const timeframes = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };
  
  return timeframes[timeframe] || timeframes['1h'];
}

async function processWebVital(metric) {
  const { data } = metric;
  
  // Check if metric exceeds thresholds
  const thresholds = {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    FCP: 1800,
    INP: 200,
    TTFB: 800
  };

  const threshold = thresholds[data.name];
  if (threshold && data.value > threshold) {
    // Could trigger alerts or notifications here
    logger.info(`Performance threshold exceeded: ${data.name} = ${data.value} (threshold: ${threshold})`);
  }
}

async function processSlowResource(metric) {
  const { data } = metric;
  
  // Track slow resources for optimization
  logger.info(`Slow resource detected: ${data.resource} (${data.value}ms)`);
}

async function processUserInteraction(metric) {
  // Track user interaction patterns
  // Could be used for UX optimization
}

async function processNavigationTiming(metric) {
  const { data } = metric;
  
  // Track navigation performance
  if (data.value > 3000) { // Slow navigation
    logger.warn(`Slow navigation detected: ${data.name} = ${data.value}ms`);
  }
}

function calculateSummary(metrics) {
  const summary = {
    webVitals: {},
    slowResources: [],
    averageLoadTime: 0,
    totalMetrics: metrics.length
  };

  // Group by metric type
  const groupedMetrics = metrics.reduce((groups, metric) => {
    if (!groups[metric.eventType]) {
      groups[metric.eventType] = [];
    }
    groups[metric.eventType].push(metric);
    return groups;
  }, {});

  // Calculate Web Vitals averages
  if (groupedMetrics.web_vital) {
    const webVitals = groupedMetrics.web_vital.reduce((vitals, metric) => {
      const name = metric.data.name;
      if (!vitals[name]) {
        vitals[name] = [];
      }
      vitals[name].push(metric.data.value);
      return vitals;
    }, {});

    Object.entries(webVitals).forEach(([name, values]) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      summary.webVitals[name] = {
        average: Math.round(average),
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });
  }

  // Track slow resources
  if (groupedMetrics.slow_resource) {
    summary.slowResources = groupedMetrics.slow_resource
      .map(metric => ({
        resource: metric.data.resource,
        duration: metric.data.value,
        type: metric.data.type
      }))
      .slice(0, 10); // Top 10 slow resources
  }

  return summary;
}