/**
 * GraphQL API Endpoint for NeuroExpert v3.2
 * Unified API layer with advanced capabilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildSchema, graphql } from 'graphql';
import { advancedSecurity } from '@/app/utils/advanced-security';
import { analyticsMLEngine } from '@/app/utils/analytics-ml-engine';
import { aiSystemV2 } from '@/app/utils/ai-system-v2';
import { performanceOptimizer } from '@/app/utils/performance-optimizer';

// GraphQL Schema Definition
const schema = buildSchema(`
  type Query {
    # Analytics queries
    getAnalytics(timeRange: String!, filters: AnalyticsFilters): AnalyticsData
    getRealTimeMetrics: RealTimeMetrics
    getUserBehavior(userId: String!): UserBehaviorPattern
    getABTestResults(testId: String!): ABTestResults
    
    # AI queries
    getChatResponse(message: String!, context: ChatContext): AIResponse
    getPersonalizedRecommendations(userId: String!): [Recommendation]
    getAIInsights(type: String!): [AIInsight]
    
    # Security queries
    getSecurityReport(timeRange: TimeRange!): SecurityReport
    getThreatIntelligence(ip: String!): ThreatIntelligence
    
    # Performance queries
    getPerformanceMetrics: PerformanceMetrics
    getOptimizationSuggestions: [OptimizationSuggestion]
    
    # Business queries
    getBusinessMetrics(period: String!): BusinessMetrics
    getConversionFunnel: ConversionFunnel
    getCustomerSegments: [CustomerSegment]
  }

  type Mutation {
    # Analytics mutations
    trackEvent(event: EventInput!): TrackingResult
    createABTest(test: ABTestInput!): ABTest
    updateUserSegment(userId: String!, segment: String!): UpdateResult
    
    # AI mutations
    sendMessage(input: MessageInput!): ChatResponse
    trainAIModel(modelName: String!, data: [TrainingData!]!): TrainingResult
    updatePersonality(userId: String!, traits: PersonalityTraits!): UpdateResult
    
    # Security mutations
    reportSecurityEvent(event: SecurityEventInput!): SecurityEventResult
    updateSecurityPolicy(policy: SecurityPolicyInput!): UpdateResult
    
    # Performance mutations
    optimizeResource(resourceId: String!): OptimizationResult
    clearCache(pattern: String): ClearCacheResult
  }

  type Subscription {
    # Real-time subscriptions
    realTimeMetrics: RealTimeMetrics
    userActivity: UserActivity
    securityAlerts: SecurityAlert
    systemHealth: SystemHealth
    aiConversation(conversationId: String!): AIMessage
  }

  # Input types
  input AnalyticsFilters {
    dateFrom: String
    dateTo: String
    segment: String
    source: String
    device: String
  }

  input ChatContext {
    conversationId: String
    userId: String
    sessionData: String
  }

  input EventInput {
    type: String!
    userId: String
    properties: String
    timestamp: String
  }

  input MessageInput {
    content: String!
    userId: String!
    conversationId: String
    attachments: [String]
  }

  input TimeRange {
    start: String!
    end: String!
  }

  # Output types
  type AnalyticsData {
    pageViews: Int
    sessions: Int
    users: Int
    conversions: Int
    revenue: Float
    trends: [TrendPoint]
    insights: [Insight]
  }

  type RealTimeMetrics {
    activeUsers: Int
    currentPageViews: Int
    liveConversions: Int
    systemLoad: Float
    timestamp: String
  }

  type AIResponse {
    content: String!
    confidence: Float
    sources: [String]
    followUpQuestions: [String]
    metadata: String
  }

  type SecurityReport {
    totalEvents: Int
    threatLevel: String
    blockedAttempts: Int
    recommendations: [String]
    timeline: [SecurityEvent]
  }

  type PerformanceMetrics {
    loadTime: Float
    bundleSize: Int
    cacheHitRate: Float
    errorRate: Float
    webVitals: WebVitals
  }

  type WebVitals {
    lcp: Float
    fid: Float
    cls: Float
    fcp: Float
    ttfb: Float
  }

  type TrendPoint {
    timestamp: String!
    value: Float!
  }

  type Insight {
    type: String!
    title: String!
    description: String!
    impact: String!
    actionable: Boolean!
  }

  type SecurityEvent {
    type: String!
    severity: String!
    timestamp: String!
    details: String
  }

  type TrackingResult {
    success: Boolean!
    eventId: String
    message: String
  }

  type UpdateResult {
    success: Boolean!
    message: String
  }

  # Additional types would be defined here...
`);

// GraphQL Resolvers
const rootValue = {
  // Analytics resolvers
  getAnalytics: async ({ timeRange, filters }: { timeRange: string; filters?: any }) => {
    try {
      const data = await analyticsMLEngine.getAnalyticsData({
        timeRange,
        filters: filters || {}
      });
      
      return {
        pageViews: data.pageViews,
        sessions: data.sessions,
        users: data.users,
        conversions: data.conversions,
        revenue: data.revenue,
        trends: data.trends,
        insights: data.insights
      };
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  },

  getRealTimeMetrics: async () => {
    try {
      const metrics = await analyticsMLEngine.getRealTimeDashboardData();
      
      return {
        activeUsers: metrics.metrics.activeUsers,
        currentPageViews: metrics.metrics.pageViews,
        liveConversions: metrics.metrics.conversions,
        systemLoad: metrics.metrics.performance.cpu,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get real-time metrics: ${error.message}`);
    }
  },

  getUserBehavior: async ({ userId }: { userId: string }) => {
    try {
      const behavior = await analyticsMLEngine.analyzeUserBehavior(userId);
      return behavior;
    } catch (error) {
      throw new Error(`Failed to get user behavior: ${error.message}`);
    }
  },

  // AI resolvers
  getChatResponse: async ({ message, context }: { message: string; context?: any }) => {
    try {
      const response = await aiSystemV2.generateResponse(
        context?.userId || 'anonymous',
        message,
        {
          context: context?.sessionData ? JSON.parse(context.sessionData) : undefined,
          taskType: 'conversational'
        }
      );
      
      return {
        content: response.content,
        confidence: response.metadata?.confidence || 0.9,
        sources: response.metadata?.sources || [],
        followUpQuestions: response.recommendations?.map(r => r.question) || [],
        metadata: JSON.stringify(response.metadata)
      };
    } catch (error) {
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  },

  getPersonalizedRecommendations: async ({ userId }: { userId: string }) => {
    try {
      const recommendations = await aiSystemV2.getPersonalizedRecommendations(userId);
      return recommendations;
    } catch (error) {
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  },

  // Security resolvers
  getSecurityReport: async ({ timeRange }: { timeRange: any }) => {
    try {
      const report = await advancedSecurity.generateSecurityReport({
        start: new Date(timeRange.start).getTime(),
        end: new Date(timeRange.end).getTime()
      });
      
      return {
        totalEvents: report.totalEvents,
        threatLevel: report.securityMetrics.averageThreatLevel.toString(),
        blockedAttempts: report.securityMetrics.blockedAttempts,
        recommendations: report.recommendations,
        timeline: report.eventsByType
      };
    } catch (error) {
      throw new Error(`Failed to get security report: ${error.message}`);
    }
  },

  // Performance resolvers
  getPerformanceMetrics: async () => {
    try {
      const metrics = performanceOptimizer.getMetrics();
      
      return {
        loadTime: metrics.page_load_time || 0,
        bundleSize: metrics.bundle_size || 0,
        cacheHitRate: metrics.cache_hit / (metrics.cache_hit + metrics.cache_miss) || 0,
        errorRate: metrics.error_rate || 0,
        webVitals: {
          lcp: metrics.lcp || 0,
          fid: metrics.fid || 0,
          cls: metrics.cls || 0,
          fcp: metrics.fcp || 0,
          ttfb: metrics.ttfb || 0
        }
      };
    } catch (error) {
      throw new Error(`Failed to get performance metrics: ${error.message}`);
    }
  },

  // Mutation resolvers
  trackEvent: async ({ event }: { event: any }) => {
    try {
      await analyticsMLEngine.processEvent({
        type: event.type,
        userId: event.userId,
        properties: event.properties ? JSON.parse(event.properties) : {},
        timestamp: event.timestamp ? new Date(event.timestamp).getTime() : Date.now(),
        priority: 'medium'
      });
      
      return {
        success: true,
        eventId: `event_${Date.now()}`,
        message: 'Event tracked successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to track event: ${error.message}`
      };
    }
  },

  sendMessage: async ({ input }: { input: any }) => {
    try {
      const response = await aiSystemV2.generateResponse(
        input.userId,
        input.content,
        {
          taskType: 'conversational',
          context: input.conversationId ? { conversationId: input.conversationId } : undefined
        }
      );
      
      return {
        content: response.content,
        conversationId: response.metadata?.conversationId,
        timestamp: new Date().toISOString(),
        metadata: JSON.stringify(response.metadata)
      };
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  },

  reportSecurityEvent: async ({ event }: { event: any }) => {
    try {
      await advancedSecurity.recordSecurityEvent({
        type: event.type,
        severity: event.severity,
        ip: event.ip,
        userAgent: event.userAgent,
        details: event.details ? JSON.parse(event.details) : {},
        timestamp: Date.now()
      });
      
      return {
        success: true,
        eventId: `security_${Date.now()}`,
        message: 'Security event recorded'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to record security event: ${error.message}`
      };
    }
  }
};

// Rate limiting for GraphQL
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
};

// Main GraphQL handler
export async function POST(request: NextRequest) {
  try {
    // Security checks
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Rate limiting
    try {
      await advancedSecurity.checkRateLimit('api', { ip });
    } catch (error) {
      return NextResponse.json(
        { errors: [{ message: 'Rate limit exceeded' }] },
        { status: 429 }
      );
    }
    
    // Parse request body
    const { query, variables, operationName } = await request.json();
    
    // Validate query
    if (!query) {
      return NextResponse.json(
        { errors: [{ message: 'Query is required' }] },
        { status: 400 }
      );
    }
    
    // Execute GraphQL query
    const result = await graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables,
      operationName
    });
    
    // Log successful request
    console.log(`GraphQL request from ${ip}: ${operationName || 'anonymous'}`);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('GraphQL error:', error);
    
    return NextResponse.json(
      { 
        errors: [{ 
          message: 'Internal server error',
          extensions: { 
            code: 'INTERNAL_ERROR',
            timestamp: new Date().toISOString()
          }
        }] 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for GraphQL playground in development
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { message: 'GraphQL playground is only available in development' },
      { status: 404 }
    );
  }
  
  const playgroundHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>NeuroExpert GraphQL Playground</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
    </head>
    <body>
      <div id="root"></div>
      <script src="https://cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
    </body>
    </html>
  `;
  
  return new Response(playgroundHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
}