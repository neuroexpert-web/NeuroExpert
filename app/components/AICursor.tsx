'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from './NeonButton';
import FuturisticCard from './FuturisticCard';
import styles from './AICursor.module.css';

interface Selection {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  elementPath: string;
  annotation?: string;
  aiAnalysis?: string;
  timestamp: Date;
}

interface CursorPosition {
  x: number;
  y: number;
}

export default function AICursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const selectionRef = useRef<Selection | null>(null);

  // Обработка выделения текста
  const handleTextSelection = useCallback(() => {
    if (!isEnabled) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowTooltip(false);
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length < 3) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Позиция для tooltip
    setCursorPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });

    // Создаем объект выделения
    const newSelection: Selection = {
      id: Date.now().toString(),
      text: selectedText,
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      elementPath: getElementPath(range.startContainer),
      timestamp: new Date()
    };

    selectionRef.current = newSelection;
    setCurrentSelection(newSelection);
    setShowTooltip(true);
  }, [isEnabled]);

  // Получение пути к элементу
  const getElementPath = (node: Node): string => {
    const path: string[] = [];
    let current = node;

    while (current && current !== document.body) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as Element;
        const tagName = element.tagName.toLowerCase();
        const id = element.id ? `#${element.id}` : '';
        const className = element.className ? `.${element.className.split(' ')[0]}` : '';
        path.unshift(`${tagName}${id}${className}`);
      }
      current = current.parentNode as Node;
    }

    return path.join(' > ');
  };

  // AI анализ выделенного текста
  const analyzeSelection = async () => {
    if (!currentSelection) return;

    setIsAnalyzing(true);
    
    // Симуляция AI анализа
    setTimeout(() => {
      const analysis = `📊 Анализ AI: "${currentSelection.text}"
      
• Тип контента: ${currentSelection.text.includes('ROI') ? 'Бизнес-метрика' : 'Общий текст'}
• Важность: ${currentSelection.text.length > 50 ? 'Высокая' : 'Средняя'}
• Рекомендация: ${currentSelection.text.includes('300%') ? 'Ключевой показатель эффективности' : 'Требует дополнительного контекста'}
• Действия: Сохранить в базу знаний, создать задачу, экспортировать`;

      const updatedSelection = {
        ...currentSelection,
        aiAnalysis: analysis
      };

      setCurrentSelection(updatedSelection);
      setSelections(prev => [...prev, updatedSelection]);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Добавление аннотации
  const addAnnotation = (text: string) => {
    if (!currentSelection) return;

    const updatedSelection = {
      ...currentSelection,
      annotation: text
    };

    setCurrentSelection(updatedSelection);
    setSelections(prev => {
      const index = prev.findIndex(s => s.id === currentSelection.id);
      if (index !== -1) {
        const newSelections = [...prev];
        newSelections[index] = updatedSelection;
        return newSelections;
      }
      return [...prev, updatedSelection];
    });
  };

  // Экспорт выделений
  const exportSelections = () => {
    const data = {
      timestamp: new Date().toISOString(),
      selections: selections.map(s => ({
        text: s.text,
        annotation: s.annotation,
        aiAnalysis: s.aiAnalysis,
        path: s.elementPath,
        timestamp: s.timestamp
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuroexpert-cursor-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Визуальное выделение сохраненных фрагментов
  const highlightSelection = (selection: Selection) => {
    // Здесь можно добавить логику для визуального выделения на странице
    console.log('Highlighting:', selection);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('touchend', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('touchend', handleTextSelection);
    };
  }, [handleTextSelection]);

  // Клавиатурные сокращения
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (!isEnabled) return;

      // Ctrl/Cmd + Shift + A - включить анализ
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        analyzeSelection();
      }
      
      // Escape - закрыть tooltip
      if (e.key === 'Escape') {
        setShowTooltip(false);
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, [isEnabled, currentSelection]);

  return (
    <>
      {/* Панель управления курсором */}
      <motion.div
        className={styles.controlPanel}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <FuturisticCard variant="glass" className={styles.controlCard}>
          <div className={styles.controlHeader}>
            <h3 className={styles.controlTitle}>
              <span className={styles.icon}>🎯</span>
              AI Cursor Control
            </h3>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
              />
              <span className={styles.toggleSlider} />
            </label>
          </div>

          {isEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.controlContent}
            >
              <p className={styles.hint}>
                Выделите любой текст для AI-анализа
              </p>
              
              {selections.length > 0 && (
                <>
                  <div className={styles.stats}>
                    <span>Выделений: {selections.length}</span>
                    <span>Аннотаций: {selections.filter(s => s.annotation).length}</span>
                  </div>
                  
                  <NeonButton
                    variant="secondary"
                    size="small"
                    fullWidth
                    onClick={exportSelections}
                  >
                    Экспортировать данные
                  </NeonButton>
                </>
              )}
            </motion.div>
          )}
        </FuturisticCard>
      </motion.div>

      {/* Tooltip для выделения */}
      <AnimatePresence>
        {showTooltip && currentSelection && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y
            }}
          >
            <div className={styles.tooltipActions}>
              <button
                className={styles.tooltipButton}
                onClick={analyzeSelection}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? '⏳' : '🤖'} Анализ
              </button>
              <button
                className={styles.tooltipButton}
                onClick={() => {
                  const annotation = prompt('Добавить аннотацию:');
                  if (annotation) addAnnotation(annotation);
                }}
              >
                ✏️ Аннотация
              </button>
              <button
                className={styles.tooltipButton}
                onClick={() => {
                  navigator.clipboard.writeText(currentSelection.text);
                  setShowTooltip(false);
                }}
              >
                📋 Копировать
              </button>
            </div>

            {currentSelection.aiAnalysis && (
              <motion.div
                className={styles.analysisResult}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <pre>{currentSelection.aiAnalysis}</pre>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* История выделений */}
      <AnimatePresence>
        {isEnabled && selections.length > 0 && (
          <motion.div
            className={styles.historyPanel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <FuturisticCard variant="glass" className={styles.historyCard}>
              <h4 className={styles.historyTitle}>История выделений</h4>
              <div className={styles.historyList}>
                {selections.slice(-5).reverse().map((selection) => (
                  <motion.div
                    key={selection.id}
                    className={styles.historyItem}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => highlightSelection(selection)}
                  >
                    <p className={styles.historyText}>"{selection.text.substring(0, 50)}..."</p>
                    {selection.annotation && (
                      <p className={styles.historyAnnotation}>📝 {selection.annotation}</p>
                    )}
                    {selection.aiAnalysis && (
                      <span className={styles.historyBadge}>AI ✓</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </FuturisticCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}