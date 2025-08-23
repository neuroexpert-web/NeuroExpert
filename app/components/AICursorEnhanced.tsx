'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from './NeonButton';
import FuturisticCard from './FuturisticCard';
import AILoader from './AILoader';
import { analytics } from '../utils/analytics';
import styles from './AICursorEnhanced.module.css';

interface Selection {
  id: string;
  text: string;
  context: string;
  elementPath: string;
  annotation?: string;
  aiAnalysis?: {
    summary: string;
    category: string;
    importance: number;
    actions: string[];
    relatedTopics: string[];
  };
  timestamp: Date;
  pageUrl: string;
}

interface AICommand {
  type: 'analyze' | 'summarize' | 'translate' | 'explain' | 'generate';
  label: string;
  icon: string;
  prompt?: string;
}

const AI_COMMANDS: AICommand[] = [
  { type: 'analyze', label: 'Анализ', icon: '🔍' },
  { type: 'summarize', label: 'Резюме', icon: '📝' },
  { type: 'translate', label: 'Перевод', icon: '🌐' },
  { type: 'explain', label: 'Объяснить', icon: '💡' },
  { type: 'generate', label: 'Генерация', icon: '✨' }
];

export default function AICursorEnhanced() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [showCommand, setShowCommand] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandPosition, setCommandPosition] = useState({ x: 0, y: 0 });
  const [activeCommand, setActiveCommand] = useState<AICommand | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Загрузка сохраненных выделений
  useEffect(() => {
    const savedSelections = localStorage.getItem('ai-cursor-selections');
    if (savedSelections) {
      setSelections(JSON.parse(savedSelections));
    }
  }, []);

  // Сохранение выделений
  useEffect(() => {
    if (selections.length > 0) {
      localStorage.setItem('ai-cursor-selections', JSON.stringify(selections));
    }
  }, [selections]);

  // Обработка выделения текста
  const handleTextSelection = useCallback(() => {
    if (!isEnabled) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowCommand(false);
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length < 3) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Получаем контекст вокруг выделения
    const container = range.commonAncestorContainer.parentElement;
    const context = container?.textContent?.substring(
      Math.max(0, range.startOffset - 100),
      Math.min(container.textContent.length, range.endOffset + 100)
    ) || '';

    // Позиция для команд
    setCommandPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });

    // Создаем объект выделения
    const newSelection: Selection = {
      id: Date.now().toString(),
      text: selectedText,
      context: context,
      elementPath: getElementPath(range.startContainer),
      timestamp: new Date(),
      pageUrl: window.location.href
    };

    setCurrentSelection(newSelection);
    setShowCommand(true);
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

  // Обработка AI команд
  const handleAICommand = async (command: AICommand) => {
    if (!currentSelection) return;

    setActiveCommand(command);
    setIsProcessing(true);
    const startTime = Date.now();

    // Отслеживаем начало команды
    analytics.trackCursorSelection(currentSelection.text, command.type);

    try {
      const response = await fetch('/api/ai-cursor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: command.type,
          text: currentSelection.text,
          context: currentSelection.context,
          customPrompt: customPrompt,
          language: 'ru'
        })
      });

      const data = await response.json();

      if (data.success) {
        const updatedSelection: Selection = {
          ...currentSelection,
          aiAnalysis: {
            summary: data.result.summary,
            category: data.result.category || 'general',
            importance: data.result.importance || 5,
            actions: data.result.actions || [],
            relatedTopics: data.result.relatedTopics || []
          }
        };

        setCurrentSelection(updatedSelection);
        setSelections(prev => [...prev, updatedSelection]);
        
        // Отслеживаем успешный анализ
        analytics.trackAIAnalysis(command.type, true, Date.now() - startTime);
        
        // Отправляем в Telegram
        await fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `🎯 AI Cursor Analysis\n\nText: ${currentSelection.text}\n\nResult: ${data.result.summary}`
          })
        });
      }
    } catch (error) {
      console.error('AI command error:', error);
      // Отслеживаем ошибку
      analytics.trackAIAnalysis(command.type, false, Date.now() - startTime);
      analytics.trackError(error as Error, 'ai_cursor_command');
    } finally {
      setIsProcessing(false);
      setShowCommand(false);
    }
  };

  // Создание задачи из выделения
  const createTask = async () => {
    if (!currentSelection) return;

    const task = {
      title: `Задача из выделения: ${currentSelection.text.substring(0, 50)}...`,
      description: currentSelection.aiAnalysis?.summary || currentSelection.text,
      priority: currentSelection.aiAnalysis?.importance || 5,
      tags: currentSelection.aiAnalysis?.relatedTopics || [],
      source: currentSelection.pageUrl
    };

    // Здесь можно интегрировать с системой управления задачами
    console.log('Creating task:', task);
    
    // Показываем уведомление
    const notification = document.createElement('div');
    notification.className = styles.notification;
    notification.textContent = '✅ Задача создана';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Визуальное выделение на странице
  const highlightOnPage = (selection: Selection) => {
    const elements = document.querySelectorAll(selection.elementPath);
    elements.forEach(el => {
      const text = el.textContent || '';
      if (text.includes(selection.text)) {
        const highlighted = text.replace(
          selection.text,
          `<mark class="${styles.highlightMark}">${selection.text}</mark>`
        );
        el.innerHTML = highlighted;
      }
    });
  };

  // Очистка выделений
  const clearSelections = () => {
    setSelections([]);
    localStorage.removeItem('ai-cursor-selections');
    
    // Удаляем все подсветки
    document.querySelectorAll(`.${styles.highlightMark}`).forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
      }
    });
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('touchend', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('touchend', handleTextSelection);
    };
  }, [handleTextSelection]);

  return (
    <>
      {/* Главная панель управления */}
      <motion.div
        className={styles.mainPanel}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <FuturisticCard variant="neon" glowColor="blue" className={styles.mainCard}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h2 className={styles.title}>
                <span className={styles.logo}>🎯</span>
                AI Cursor Pro
              </h2>
              <span className={styles.version}>v2.0</span>
            </div>
            
            <motion.button
              className={`${styles.powerButton} ${isEnabled ? styles.active : ''}`}
              onClick={() => setIsEnabled(!isEnabled)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v10M16.2 7.8A6 6 0 1 1 7.8 7.8" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
            </motion.button>
          </div>

          <AnimatePresence>
            {isEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={styles.content}
              >
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>{selections.length}</span>
                    <span className={styles.statLabel}>Выделений</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>
                      {selections.filter(s => s.aiAnalysis).length}
                    </span>
                    <span className={styles.statLabel}>Анализов</span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statValue}>
                      {selections.filter(s => s.annotation).length}
                    </span>
                    <span className={styles.statLabel}>Заметок</span>
                  </div>
                </div>

                <div className={styles.actions}>
                  <NeonButton
                    variant="primary"
                    size="small"
                    fullWidth
                    onClick={() => {
                      const data = {
                        timestamp: new Date().toISOString(),
                        selections: selections,
                        stats: {
                          total: selections.length,
                          analyzed: selections.filter(s => s.aiAnalysis).length,
                          annotated: selections.filter(s => s.annotation).length
                        }
                      };
                      
                      const blob = new Blob([JSON.stringify(data, null, 2)], { 
                        type: 'application/json' 
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ai-cursor-data-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Экспортировать данные
                  </NeonButton>
                  
                  <NeonButton
                    variant="danger"
                    size="small"
                    onClick={clearSelections}
                  >
                    Очистить все
                  </NeonButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FuturisticCard>
      </motion.div>

      {/* Командная панель */}
      <AnimatePresence>
        {showCommand && currentSelection && (
          <motion.div
            className={styles.commandPanel}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{
              left: commandPosition.x,
              top: commandPosition.y
            }}
          >
            {isProcessing ? (
              <div className={styles.processingCard}>
                <AILoader variant="pulse" size="small" text="Обработка..." />
              </div>
            ) : (
              <>
                <div className={styles.commandGrid}>
                  {AI_COMMANDS.map((command) => (
                    <motion.button
                      key={command.type}
                      className={styles.commandButton}
                      onClick={() => handleAICommand(command)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className={styles.commandIcon}>{command.icon}</span>
                      <span className={styles.commandLabel}>{command.label}</span>
                    </motion.button>
                  ))}
                </div>
                
                <div className={styles.commandFooter}>
                  <input
                    type="text"
                    className={styles.promptInput}
                    placeholder="Дополнительные инструкции..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && activeCommand) {
                        handleAICommand(activeCommand);
                      }
                    }}
                  />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Боковая панель с историей */}
      <AnimatePresence>
        {isEnabled && selections.length > 0 && (
          <motion.div
            className={styles.sidePanel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <FuturisticCard variant="glass" className={styles.historyCard}>
              <h3 className={styles.historyTitle}>
                История анализа
                <span className={styles.historyCount}>{selections.length}</span>
              </h3>
              
              <div className={styles.historyList}>
                {selections.slice(-10).reverse().map((selection) => (
                  <motion.div
                    key={selection.id}
                    className={styles.historyItem}
                    whileHover={{ x: -5 }}
                    onClick={() => highlightOnPage(selection)}
                  >
                    <div className={styles.historyHeader}>
                      <span className={styles.historyTime}>
                        {new Date(selection.timestamp).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {selection.aiAnalysis && (
                        <span className={styles.historyBadge}>
                          AI {selection.aiAnalysis.category}
                        </span>
                      )}
                    </div>
                    
                    <p className={styles.historyText}>
                      "{selection.text.substring(0, 80)}..."
                    </p>
                    
                    {selection.aiAnalysis && (
                      <div className={styles.historyAnalysis}>
                        <p>{selection.aiAnalysis.summary}</p>
                        <div className={styles.historyActions}>
                          {selection.aiAnalysis.actions.slice(0, 2).map((action, i) => (
                            <span key={i} className={styles.actionChip}>
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.historyFooter}>
                      <button
                        className={styles.historyAction}
                        onClick={(e) => {
                          e.stopPropagation();
                          createTask();
                        }}
                      >
                        📋 Создать задачу
                      </button>
                      <button
                        className={styles.historyAction}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(selection.text);
                        }}
                      >
                        📑 Копировать
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FuturisticCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Стили для подсветки */}
      <style jsx global>{`
        .${styles.highlightMark} {
          background: linear-gradient(
            90deg,
            rgba(0, 217, 255, 0.3),
            rgba(189, 0, 255, 0.3)
          );
          padding: 2px 4px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .${styles.highlightMark}:hover {
          background: linear-gradient(
            90deg,
            rgba(0, 217, 255, 0.5),
            rgba(189, 0, 255, 0.5)
          );
          box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }
      `}</style>
    </>
  );
}