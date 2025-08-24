'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CursorOverlayProps } from './types';
import styles from './CursorIntegration.module.css';

export default function CursorOverlay({
  mode,
  selectedText,
  cursorPosition,
  onModeChange,
  onAnnotate,
  isLoading
}: CursorOverlayProps) {
  const [showAnnotationInput, setShowAnnotationInput] = useState(false);
  const [annotationText, setAnnotationText] = useState('');

  const handleAnnotationSubmit = () => {
    if (annotationText.trim()) {
      onAnnotate(annotationText);
      setAnnotationText('');
      setShowAnnotationInput(false);
    }
  };

  useEffect(() => {
    if (selectedText && mode === 'annotate') {
      setShowAnnotationInput(true);
    }
  }, [selectedText, mode]);

  return (
    <>
      {/* Панель режимов */}
      <motion.div 
        className={styles.modePanel}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <button
          className={`${styles.modeButton} ${mode === 'highlight' ? styles.active : ''}`}
          onClick={() => onModeChange('highlight')}
          title="Режим выделения (Ctrl+Shift+H)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 2.5L17.5 7.5L7.5 17.5H2.5V12.5L12.5 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Выделение
        </button>
        
        <button
          className={`${styles.modeButton} ${mode === 'annotate' ? styles.active : ''}`}
          onClick={() => onModeChange('annotate')}
          title="Режим аннотаций (Ctrl+Shift+A)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5H17M3 10H17M3 15H12" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="16" cy="15" r="2" fill="currentColor"/>
          </svg>
          Аннотации
        </button>
        
        <button
          className={`${styles.modeButton} ${mode === 'ai-analyze' ? styles.active : ''}`}
          onClick={() => onModeChange('ai-analyze')}
          title="AI анализ"
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L12 8H18L13 11.5L15 17.5L10 14L5 17.5L7 11.5L2 8H8L10 2Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          {isLoading ? 'Анализ...' : 'AI Анализ'}
        </button>
        
        <button
          className={`${styles.modeButton} ${mode === 'export' ? styles.active : ''}`}
          onClick={() => onModeChange('export')}
          title="Экспорт (Ctrl+Shift+E)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2V14M10 14L6 10M10 14L14 10M3 17H17" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Экспорт
        </button>
      </motion.div>

      {/* Визуальный маркер выделения */}
      <AnimatePresence>
        {selectedText && (
          <motion.div
            className={styles.selectionMarker}
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className={styles.markerContent}>
              <span className={styles.selectedTextPreview}>
                "{selectedText.substring(0, 50)}{selectedText.length > 50 ? '...' : ''}"
              </span>
              
              {mode === 'highlight' && (
                <div className={styles.highlightActions}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => onModeChange('annotate')}
                  >
                    💬 Добавить заметку
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => onModeChange('ai-analyze')}
                  >
                    🤖 AI анализ
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Поле ввода аннотации */}
      <AnimatePresence>
        {showAnnotationInput && selectedText && (
          <motion.div
            className={styles.annotationInput}
            style={{
              left: Math.min(cursorPosition.x - 150, window.innerWidth - 320),
              top: cursorPosition.y + 40
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <textarea
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              placeholder="Добавьте заметку к выделенному тексту..."
              className={styles.annotationTextarea}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnnotationSubmit();
                }
                if (e.key === 'Escape') {
                  setShowAnnotationInput(false);
                  setAnnotationText('');
                }
              }}
            />
            <div className={styles.annotationActions}>
              <button
                className={styles.submitButton}
                onClick={handleAnnotationSubmit}
                disabled={!annotationText.trim()}
              >
                Сохранить
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowAnnotationInput(false);
                  setAnnotationText('');
                }}
              >
                Отмена
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Индикатор загрузки AI */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className={styles.aiLoadingIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.loadingSpinner} />
            <span>Claude анализирует текст...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}