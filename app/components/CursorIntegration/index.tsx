'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import CursorOverlay from './CursorOverlay';
import AnnotationPanel from './AnnotationPanel';
import { CursorMode, Annotation } from './types';
import { useCursorAPI } from './hooks/useCursorAPI';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './CursorIntegration.module.css';

// Динамический импорт для тяжелых компонентов
const ExportModal = dynamic(() => import('./ExportModal'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Загрузка...</div>
});

export default function CursorIntegration() {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<CursorMode>('highlight');
  const [annotations, setAnnotations] = useLocalStorage<Annotation[]>('neuroexpert-annotations', []);
  const [selectedText, setSelectedText] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const { analyzeWithClaude, isLoading } = useCursorAPI();

  // Обработка выделения текста
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (text.length > 0) {
      setSelectedText(text);
      
      // Получаем координаты выделения
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setCursorPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  }, []);

  // Создание аннотации
  const createAnnotation = useCallback(async (text: string, note: string) => {
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text,
      note,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      position: cursorPosition,
      aiAnalysis: null
    };

    // Если включен режим AI, отправляем на анализ
    if (mode === 'ai-analyze' && !isLoading) {
      const analysis = await analyzeWithClaude(text, note);
      newAnnotation.aiAnalysis = analysis;
    }

    setAnnotations([...annotations, newAnnotation]);
    setSelectedText('');
  }, [annotations, cursorPosition, mode, analyzeWithClaude, isLoading, setAnnotations]);

  // Удаление аннотации
  const deleteAnnotation = useCallback((id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  }, [annotations, setAnnotations]);

  // Экспорт аннотаций
  const exportAnnotations = useCallback((format: 'pdf' | 'csv' | 'json') => {
    // Логика экспорта будет реализована в ExportModal
    setShowExport(true);
  }, []);

  // Горячие клавиши
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + C - включить/выключить курсор
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setIsActive(!isActive);
      }
      
      // Ctrl/Cmd + Shift + H - режим выделения
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        setMode('highlight');
      }
      
      // Ctrl/Cmd + Shift + A - режим аннотаций
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setMode('annotate');
      }
      
      // Ctrl/Cmd + Shift + E - экспорт
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setShowExport(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive]);

  // Слушатель выделения текста
  useEffect(() => {
    if (isActive) {
      document.addEventListener('mouseup', handleTextSelection);
      document.addEventListener('touchend', handleTextSelection);
      
      return () => {
        document.removeEventListener('mouseup', handleTextSelection);
        document.removeEventListener('touchend', handleTextSelection);
      };
    }
  }, [isActive, handleTextSelection]);

  if (!isActive) {
    return (
      <button
        className={styles.activateButton}
        onClick={() => setIsActive(true)}
        aria-label="Активировать курсор для аннотаций"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path 
            d="M3 21h18M3 18h18M3 15h12M3 12h12M3 9h18M3 6h18M3 3h18" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <circle cx="20" cy="13" r="3" fill="#6366f1" />
        </svg>
        <span className={styles.tooltip}>Курсор Claude (Ctrl+Shift+C)</span>
      </button>
    );
  }

  return (
    <>
      <CursorOverlay
        mode={mode}
        selectedText={selectedText}
        cursorPosition={cursorPosition}
        onModeChange={setMode}
        onAnnotate={(note) => createAnnotation(selectedText, note)}
        isLoading={isLoading}
      />
      
      <AnnotationPanel
        annotations={annotations}
        onDelete={deleteAnnotation}
        onExport={exportAnnotations}
        onClose={() => setIsActive(false)}
      />
      
      {showExport && (
        <ExportModal
          annotations={annotations}
          onClose={() => setShowExport(false)}
        />
      )}
    </>
  );
}