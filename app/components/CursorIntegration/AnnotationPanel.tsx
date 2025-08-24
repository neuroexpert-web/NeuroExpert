'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnnotationPanelProps } from './types';
import styles from './CursorIntegration.module.css';

export default function AnnotationPanel({
  annotations,
  onDelete,
  onExport,
  onClose
}: AnnotationPanelProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className={styles.annotationPanel}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <div className={styles.annotationPanelHeader}>
        <h3 className={styles.annotationPanelTitle}>
          Аннотации ({annotations.length})
        </h3>
        <div className={styles.annotationPanelActions}>
          <button
            className={styles.actionButton}
            onClick={() => onExport('pdf')}
            title="Экспорт в PDF"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4h12v12H4V4z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 10h4M8 12h4M8 14h2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => onExport('csv')}
            title="Экспорт в CSV"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 3h14v14H3V3z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 7h14M7 3v14M13 3v14" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button
            className={styles.actionButton}
            onClick={onClose}
            title="Закрыть панель"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.annotationsList}>
        <AnimatePresence>
          {annotations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.emptyState}
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--platinum-500)'
              }}
            >
              <p>Нет сохраненных аннотаций</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Выделите текст на странице и добавьте заметку
              </p>
            </motion.div>
          ) : (
            annotations.map((annotation, index) => (
              <motion.div
                key={annotation.id}
                className={styles.annotationItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.annotationText}>
                  "{annotation.text}"
                </div>
                <div className={styles.annotationNote}>
                  {annotation.note}
                </div>
                
                {annotation.aiAnalysis && (
                  <div className={styles.aiAnalysisSection}>
                    <div className={styles.aiAnalysisHeader}>
                      <span className={styles.aiIcon}>🤖</span>
                      <span>AI Анализ</span>
                    </div>
                    <p className={styles.aiSummary}>{annotation.aiAnalysis.summary}</p>
                    {annotation.aiAnalysis.keyPoints.length > 0 && (
                      <ul className={styles.aiKeyPoints}>
                        {annotation.aiAnalysis.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}
                    <div className={styles.aiMeta}>
                      {annotation.aiAnalysis.sentiment && (
                        <span className={`${styles.sentiment} ${styles[annotation.aiAnalysis.sentiment]}`}>
                          {annotation.aiAnalysis.sentiment === 'positive' ? '😊' : 
                           annotation.aiAnalysis.sentiment === 'negative' ? '😟' : '😐'}
                        </span>
                      )}
                      {annotation.aiAnalysis.category && (
                        <span className={styles.category}>
                          #{annotation.aiAnalysis.category}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className={styles.annotationMeta}>
                  <span>{formatDate(annotation.timestamp)}</span>
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(annotation.id)}
                  >
                    Удалить
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}