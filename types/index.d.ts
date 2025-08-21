// Global type definitions for NeuroExpert

export interface User {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  disabled?: boolean;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expiresIn: number;
}

export interface ROIFormData {
  industry: 'retail' | 'production' | 'it' | 'finance' | 'construction' | 'medicine' | 'logistics' | 'services' | 'other';
  employeeCount: 'up10' | 'from11to50' | 'from51to250' | 'over250';
  investment: number;
}

export interface ROIResults {
  roi: number;
  profit: number;
  savings?: number;
  growth?: number;
  payback?: number;
}

export interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
}

export interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  duration?: number;
  error?: string;
  details?: any;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold?: number;
  status?: 'good' | 'warning' | 'critical';
}