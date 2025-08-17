// Типы для компонентов ROI калькулятора
export interface ROIFormData {
  businessSize: 'small' | 'medium' | 'large';
  industry: 'retail' | 'services' | 'production' | 'it' | 'other';
  revenue: number;
  budget: number;
}

export interface ROIResults {
  roi: number;
  savings: number;
  growth: number;
  payback: number;
}

// Типы для API ответов
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Типы для компонентов
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Глобальные типы для window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    ym?: (...args: any[]) => void;
  }
}