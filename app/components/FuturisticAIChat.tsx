'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from './NeonButton';
import AILoader from './AILoader';
import FuturisticCard from './FuturisticCard';
import styles from './FuturisticAIChat.module.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function FuturisticAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я ваш AI управляющий директор. Как я могу помочь вам увеличить прибыль?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: '📈', text: 'Увеличить продажи' },
    { icon: '🤖', text: 'Автоматизация процессов' },
    { icon: '💰', text: 'Рассчитать экономию' },
    { icon: '🎯', text: 'KPI и метрики' }
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Симуляция ответа AI
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Анализирую ваш запрос... Для увеличения эффективности вашего бизнеса рекомендую начать с автоматизации ключевых процессов. Это позволит сократить затраты на 30% и увеличить производительность на 45%.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className={styles.floatingButton}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <NeonButton
          variant="secondary"
          size="large"
          pulse
          onClick={() => setIsOpen(!isOpen)}
          className={styles.chatButton}
        >
          <span className={styles.chatIcon}>🤖</span>
        </NeonButton>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <FuturisticCard variant="glass" className={styles.chatCard}>
              {/* Header */}
              <div className={styles.chatHeader}>
                <div className={styles.headerInfo}>
                  <div className={styles.aiAvatar}>
                    <span>🤖</span>
                  </div>
                  <div>
                    <h3 className={styles.aiName}>AI Директор</h3>
                    <p className={styles.aiStatus}>
                      <span className={styles.statusDot} />
                      Онлайн • Готов помочь
                    </p>
                  </div>
                </div>
                <button
                  className={styles.closeButton}
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className={styles.messagesContainer}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`${styles.message} ${styles[message.sender]}`}
                    initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.messageContent}>
                      <p>{message.text}</p>
                      <span className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className={styles.typingIndicator}>
                    <AILoader variant="pulse" size="small" text="" />
                    <span>AI набирает ответ...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className={styles.quickActions}>
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    className={styles.quickAction}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setInput(action.text)}
                  >
                    <span>{action.icon}</span>
                    <span>{action.text}</span>
                  </motion.button>
                ))}
              </div>

              {/* Input */}
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Введите ваш вопрос..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <NeonButton
                  variant="primary"
                  size="small"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2 10L8 4V8H14V12H8V16L2 10Z" fill="currentColor" transform="rotate(180 10 10)" />
                  </svg>
                </NeonButton>
              </div>
            </FuturisticCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}