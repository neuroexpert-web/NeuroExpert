export interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'ui' | 'functionality' | 'performance' | 'security' | 'api';
  priority: 'critical' | 'high' | 'medium' | 'low';
  automated: boolean;
  steps?: TestStep[];
}

export interface TestStep {
  id: string;
  action: string;
  expected: string;
  actual?: string;
  status?: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
}

export interface TestResult {
  testId: string;
  status: 'passed' | 'failed' | 'warning';
  duration: number;
  timestamp: Date;
  errors?: TestError[];
  screenshots?: string[];
}

export interface TestError {
  message: string;
  stack?: string;
  element?: string;
  screenshot?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  tests: TestCase[];
  config: TestConfig;
}

export interface TestConfig {
  browser: 'chrome' | 'firefox' | 'safari' | 'edge';
  viewport: { width: number; height: number };
  baseUrl: string;
  timeout: number;
  retries: number;
}