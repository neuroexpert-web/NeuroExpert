export type CursorMode = 'highlight' | 'annotate' | 'ai-analyze' | 'export';

export interface Position {
  x: number;
  y: number;
}

export interface Annotation {
  id: string;
  text: string;
  note: string;
  timestamp: string;
  url: string;
  position: Position;
  aiAnalysis: AIAnalysis | null;
}

export interface AIAnalysis {
  summary: string;
  keyPoints: string[];
  suggestions: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  category?: string;
}

export interface CursorOverlayProps {
  mode: CursorMode;
  selectedText: string;
  cursorPosition: Position;
  onModeChange: (mode: CursorMode) => void;
  onAnnotate: (note: string) => void;
  isLoading: boolean;
}

export interface AnnotationPanelProps {
  annotations: Annotation[];
  onDelete: (id: string) => void;
  onExport: (format: 'pdf' | 'csv' | 'json') => void;
  onClose: () => void;
}

export interface ExportModalProps {
  annotations: Annotation[];
  onClose: () => void;
}