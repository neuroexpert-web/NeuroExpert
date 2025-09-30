'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SmartCustomerChat.module.css';

export default function SmartCustomerChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Здравствуйте! Я ваш персональный AI-консультант. Чем могу помочь?',
      agent: 'system',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: input,
          conversationId,
          agentPreference: selectedAgent,
          context: {
            customerChat: true,
            tone: 'friendly',
            language: 'ru'
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.data.content,
          agent: data.data.agent,
          quality: data.data.quality.score,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, aiMessage]);
        setConversationId(data.data.conversationId);

        // Показываем уведомление о качестве, если оно низкое
        if (data.data.quality.score < 70) {
          showQualityNotification(data.data.suggestions);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте повторить запрос.',
        agent: 'system',
        error: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const showQualityNotification = (suggestions) => {
    // Здесь можно показать уведомление о низком качестве ответа
    console.log('Quality suggestions:', suggestions);
  };

  const quickActions = [
    { icon: '💡', text: 'Как улучшить продажи?', action: 'improve_sales' },
    { icon: '🎯', text: 'Анализ целевой аудитории', action: 'analyze_audience' },
    { icon: '📊', text: 'Статистика и отчеты', action: 'show_stats' },
    { icon: '🤝', text: 'Работа с клиентами', action: 'customer_service' }
  ];

  const handleQuickAction = (action) => {
    const actionTexts = {
      improve_sales: 'Как мне улучшить продажи и увеличить конверсию?',
      analyze_audience: 'Помоги проанализировать мою целевую аудиторию',
      show_stats: 'Покажи статистику по работе с клиентами',
      customer_service: 'Дай советы по улучшению обслуживания клиентов'
    };

    setInput(actionTexts[action] || '');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <h3>🤖 AI Консультант</h3>
          <span className={styles.status}>
            {loading ? '💬 Печатает...' : '🟢 Онлайн'}
          </span>
        </div>
        <button 
          className={styles.settingsButton}
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div className={styles.settings}>
          <h4>Выбор AI-агента:</h4>
          <div className={styles.agentButtons}>
            <button 
              className={selectedAgent === null ? styles.selected : ''}
              onClick={() => setSelectedAgent(null)}
            >
              🎲 Авто
            </button>
            <button 
              className={selectedAgent === 'gemini' ? styles.selected : ''}
              onClick={() => setSelectedAgent('gemini')}
            >
              🌟 Gemini
            </button>
            <button 
              className={selectedAgent === 'claude' ? styles.selected : ''}
              onClick={() => setSelectedAgent('claude')}
            >
              🧠 Claude
            </button>
            <button 
              className={selectedAgent === 'openai' ? styles.selected : ''}
              onClick={() => setSelectedAgent('openai')}
            >
              🤖 GPT-4
            </button>
          </div>
        </div>
      )}

      <div className={styles.messagesContainer}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`${styles.message} ${styles[message.role]}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className={styles.messageContent}>
                {message.content}
              </div>
              <div className={styles.messageFooter}>
                <span className={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
                {message.agent && message.agent !== 'system' && (
                  <span className={styles.agentBadge}>
                    {message.agent}
                  </span>
                )}
                {message.quality && (
                  <span 
                    className={styles.qualityBadge}
                    style={{ 
                      color: message.quality >= 80 ? '#4CAF50' : 
                             message.quality >= 60 ? '#FFC107' : '#F44336'
                    }}
                  >
                    {message.quality}%
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className={styles.typingIndicator}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.quickActions}>
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            className={styles.quickAction}
            onClick={() => handleQuickAction(action.action)}
            disabled={loading}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionText}>{action.text}</span>
          </button>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Задайте ваш вопрос..."
          rows={1}
          disabled={loading}
        />
        <button
          className={styles.sendButton}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : '📤'}
        </button>
      </div>

      <div className={styles.footer}>
        <p>💡 Совет: Используйте конкретные вопросы для лучших результатов</p>
      </div>
    </div>
  );
}