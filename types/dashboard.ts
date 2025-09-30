/**
 * TypeScript контракты для Dashboard API
 * NeuroExpert Visual Studio
 */

// ==========================================
// БАЗОВЫЕ ТИПЫ
// ==========================================

export interface ApiResponse<T> {
  status: "ok" | "error";
  data?: T;
  meta?: Record<string, any>;
  links?: Record<string, string>;
  error?: {
    code: string;
    message: string;
  };
}

export interface TimeRange {
  from: string; // ISO8601
  to: string;   // ISO8601
}

export interface Filters {
  env?: 'dev' | 'stage' | 'prod';
  project?: string;
  version?: string;
  segment?: string[];
  service?: string;
}

// ==========================================
// SLO / OVERVIEW TYPES
// ==========================================

export interface SLOOverview {
  target: number;
  actual: number;
  errorBudgetUsedPct: number;
  period: string;
  units: string;
}

export interface UptimeMetrics {
  last1h: number;
  last24h: number;
  last30d: number;
  units: string;
}

export interface TrafficOverview {
  usersOnline: number;
  sessions: number;
  conversionRate: number;
  units: string;
}

export interface ErrorsOverview {
  rate: number;
  topIssues: string[];
  units: string;
}

export interface PerformanceOverview {
  p95: number;
  p99: number;
  units: string;
}

export interface MetricsOverview {
  slo: SLOOverview;
  uptime: UptimeMetrics;
  traffic: TrafficOverview;
  errors: ErrorsOverview;
  performance: PerformanceOverview;
}

// ==========================================
// TRAFFIC TYPES
// ==========================================

export interface TrafficPoint {
  t: string; // ISO8601
  usersOnline: number;
  events: number;
}

export interface FunnelStep {
  step: string;
  count: number;
}

export interface TrafficData {
  timeseries: TrafficPoint[];
  funnel: FunnelStep[];
  eventsMap: Record<string, string>;
}

// ==========================================
// ERRORS TYPES
// ==========================================

export interface ErrorIssue {
  key: string;
  title: string;
  events: number;
  users: number;
  release?: string;
}

export interface ErrorsBySeverity {
  fatal: number;
  error: number;
  warning: number;
}

export interface TransactionMetrics {
  p95: number;
  p99: number;
  throughput: number;
}

export interface ErrorsData {
  topIssues: ErrorIssue[];
  bySeverity: ErrorsBySeverity;
  transactions: TransactionMetrics;
}

// ==========================================
// APM TYPES
// ==========================================

export interface RoutePerf {
  name: string;
  p95: number;
  p99: number;
  rps: number;
  errorRate: number;
}

export interface APMData {
  routes: RoutePerf[];
}

// ==========================================
// LOGS TYPES
// ==========================================

export interface LogHit {
  ts: string;
  service: string;
  severity: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  msg: string;
  traceId?: string;
}

export interface LogSearchFilters {
  env?: string;
  service?: string;
  severity?: string[];
}

export interface LogSearchRequest {
  query: string;
  filters: LogSearchFilters;
  page: number;
  size: number;
}

export interface LogSearchData {
  hits: LogHit[];
}

// ==========================================
// UX SESSIONS TYPES
// ==========================================

export interface UXSession {
  id: string;
  startedAt: string;
  durationSec: number;
  errors: number;
  funnelStep?: string;
}

export interface UXSessionsData {
  sessions: UXSession[];
}

// ==========================================
// ROI TYPES
// ==========================================

export interface ROIMetric {
  value: number;
  deltaPct?: number;
  currency?: string;
  units?: string;
}

export interface ROISummary {
  leads: ROIMetric;
  revenue: ROIMetric;
  cac: ROIMetric;
  conversion: ROIMetric;
  savings: ROIMetric;
}

// ==========================================
// SYSTEM METRICS TYPES
// ==========================================

export interface DiskMetrics {
  mount: string;
  usedPct: number;
  iops: number;
  latencyMs: number;
}

export interface NetworkMetrics {
  inMbps: number;
  outMbps: number;
  errors: number;
}

export interface HostMetrics {
  cpuPct: number;
  ramUsedPct: number;
  disk: DiskMetrics[];
  net: NetworkMetrics;
}

export interface AppMetrics {
  rps: number;
  latencyMs: {
    p50: number;
    p95: number;
    p99: number;
  };
  errorRatePct: number;
  queues: {
    requests: number;
  };
}

export interface DBMetrics {
  connections: number;
  slowQueries: number;
  cacheHitPct: number;
  replicationLagSec: number;
}

export interface BuildInfo {
  version: string;
  uptimeSec: number;
}

export interface SystemMetrics {
  host: HostMetrics;
  app: AppMetrics;
  db: DBMetrics;
  build: BuildInfo;
}

// ==========================================
// REALTIME EVENTS
// ==========================================

export interface RealtimeEvent {
  type: 'heartbeat' | 'alert' | 'metricUpdate';
  data: any;
  timestamp: string;
}

export interface AlertEvent {
  source: string;
  level: 'info' | 'warn' | 'error' | 'critical';
  title: string;
  service: string;
  env: string;
  ts: string;
  fingerprint: string;
}

// ==========================================
// USER ROLES
// ==========================================

export type UserRole = 'Admin' | 'Manager' | 'Client';

export interface DashboardFilters extends Filters {
  timeRange: TimeRange;
  refreshInterval?: number;
  liveMode?: boolean;
}

// ==========================================
// WIDGET CONFIGURATION
// ==========================================

export interface WidgetConfig {
  id: string;
  type: 'slo' | 'traffic' | 'errors' | 'apm' | 'logs' | 'ux' | 'roi' | 'system' | 'business' | 'site-health' | 'yandex' | 'google' | 'leads' | 'seo' | 'social' | 'email';
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  refreshInterval: number;
  visible: boolean;
  pinned?: boolean;
}

export interface DashboardLayout {
  userId: string;
  widgets: WidgetConfig[];
  globalFilters: DashboardFilters;
  theme: 'light' | 'dark';
  savedPresets: Record<string, DashboardFilters>;
}
