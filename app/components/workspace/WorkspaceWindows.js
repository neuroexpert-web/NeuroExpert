'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from './WorkspaceContext';

export default function WorkspaceWindows() {
  const { windows, activeWindow, setActiveWindow, closeWindow, updateWindow } = useWorkspace();
  const [draggingWindow, setDraggingWindow] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingWindow, setResizingWindow] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Функция для обработки запросов к AI поддержке
  const handleSupportQuery = async (windowId, query) => {
    if (!query || !query.trim()) return;

    const chatContainer = document.getElementById(`chat-${windowId}`);
    const typingIndicator = document.getElementById(`typing-${windowId}`);
    
    if (!chatContainer) return;

    // Добавляем сообщение пользователя
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-content">
        <p>${query}</p>
      </div>
    `;
    chatContainer.appendChild(userMessage);

    // Показываем индикатор печатания
    if (typingIndicator) {
      typingIndicator.style.display = 'flex';
    }

    // Прокручиваем к последнему сообщению
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
      // Отправляем запрос к AI с контекстом поддержки
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          context: 'support',
          systemPrompt: `Ты — Специалист технической поддержки NeuroExpert, хорошо знакомый с основными модулями платформы.

🎯 ТВОЯ РОЛЬ: Проактивно решаешь задачи клиентов и максимизируешь value от использования платформы.

🏗️ ЭКОСИСТЕМА NEUROEXPERT (8 модулей):
1. AnalyticsDashboard - живая аналитика, real-time WebSocket, KPI, фильтры
2. ROICalculator - расчет окупаемости, сценарное моделирование, отчеты  
3. AI Управляющий - multi-context responses, Gemini API, conversation management
4. SolutionsManager - каталог решений, модульная архитектура, интеграции
5. SecuritySection - enterprise безопасность, compliance, audit logs
6. CRMAnalytics - интеграции CRM (Битрикс24, amoCRM, HubSpot), автоматизация
7. WorkspaceLayout - личный кабинет, multi-window interface, collaboration
8. Enterprise Support - техподдержка 24/7, knowledge base, professional services

💡 АЛГОРИТМ ПОМОЩИ:
1. Быстрая диагностика → В каком модуле проблема? Что происходит? Когда началось?
2. Техническое решение → Пошаговые инструкции + проверка + оптимизация
3. Проактивная помощь → Дополнительные рекомендации и полезные функции

🔧 ЧАСТЫЕ КЕЙСЫ:
- Интеграции: API ключи, field mapping, синхронизация данных
- Аналитика: tracking коды, фильтры, WebSocket connections
- Производительность: cache, CDN, browser optimization
- Безопасность: 2FA, access control, compliance

🎭 СТИЛЬ: Дружелюбный эксперт, конкретные решения, обучающий подход. 
Каждый ответ содержит actionable steps и предвосхищает дополнительные вопросы.`
        }),
      });

      const data = await response.json();
      
      // Скрываем индикатор печатания
      if (typingIndicator) {
        typingIndicator.style.display = 'none';
      }

      if (data.success) {
        // Добавляем ответ AI
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.innerHTML = `
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <p>${data.response.replace(/\n/g, '<br>')}</p>
            ${generateQuickActions(query, windowId)}
          </div>
        `;
        chatContainer.appendChild(aiMessage);
      } else {
        // Показываем ошибку
        const errorMessage = document.createElement('div');
        errorMessage.className = 'ai-message';
        errorMessage.innerHTML = `
          <div class="message-avatar">⚠️</div>
          <div class="message-content">
            <p>Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз или обратитесь к администратору.</p>
            <div class="quick-actions">
              <button class="quick-btn contact-support">
                📧 Написать в поддержку
              </button>
              <button class="quick-btn" data-query="Помощь с настройкой" data-window-id="${windowId}">
                🔧 Общая помощь
              </button>
            </div>
          </div>
        `;
        chatContainer.appendChild(errorMessage);
      }
    } catch (error) {
      console.error('Support AI Error:', error);
      
      // Скрываем индикатор печатания
      if (typingIndicator) {
        typingIndicator.style.display = 'none';
      }

      // Показываем fallback ответ
      const fallbackMessage = document.createElement('div');
      fallbackMessage.className = 'ai-message';
      fallbackMessage.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <p>Сейчас AI помощник недоступен, но я могу предложить несколько полезных ресурсов:</p>
          <div class="quick-actions">
            <button class="quick-btn open-docs">
              📚 База знаний
            </button>
            <button class="quick-btn open-faq">
              ❓ Частые вопросы
            </button>
            <button class="quick-btn contact-support">
              📧 Email поддержка
            </button>
            <button class="quick-btn open-telegram">
              💬 Telegram чат
            </button>
          </div>
        </div>
      `;
      chatContainer.appendChild(fallbackMessage);
    }

    // Прокручиваем к последнему сообщению
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  };

  // Генерация контекстных быстрых действий  
  const generateQuickActions = (query, windowId) => {
    const lowerQuery = query.toLowerCase();
    let actions = '';

    if (lowerQuery.includes('интеграц') || lowerQuery.includes('подключ')) {
      actions = `
        <div class="quick-actions">
          <button class="quick-btn" data-query="Как подключить CRM?" data-window-id="${windowId}">
            🔗 Подключение CRM
          </button>
          <button class="quick-btn" data-query="Настройка API ключей" data-window-id="${windowId}">
            🔑 API ключи
          </button>
        </div>`;
    } else if (lowerQuery.includes('аналитик') || lowerQuery.includes('данн')) {
      actions = `
        <div class="quick-actions">
          <button class="quick-btn" data-query="Почему не показываются данные аналитики?" data-window-id="${windowId}">
            📊 Проблемы с данными
          </button>
          <button class="quick-btn" data-query="Как настроить отчеты?" data-window-id="${windowId}">
            📈 Настройка отчетов
          </button>
        </div>`;
    } else if (lowerQuery.includes('производ') || lowerQuery.includes('медлен')) {
      actions = `
        <div class="quick-actions">
          <button class="quick-btn" data-query="Оптимизация производительности" data-window-id="${windowId}">
            ⚡ Оптимизация
          </button>
          <button class="quick-btn" data-query="Проверка системных требований" data-window-id="${windowId}">
            💻 Системные требования
          </button>
        </div>`;
    }

    return actions;
  };

  // Event delegation для quick buttons
  useEffect(() => {
    const handleQuickBtnClick = (e) => {
      if (e.target.classList.contains('quick-btn')) {
        // Support chat queries
        const query = e.target.getAttribute('data-query');
        const windowId = e.target.getAttribute('data-window-id');
        if (query && windowId) {
          handleSupportQuery(parseInt(windowId), query);
          return;
        }

        // Special actions
        if (e.target.classList.contains('contact-support')) {
          window.location.href = 'mailto:support@neuroexpert.ai';
        } else if (e.target.classList.contains('open-docs')) {
          window.open('/docs', '_blank');
        } else if (e.target.classList.contains('open-faq')) {
          window.open('/faq', '_blank');
        } else if (e.target.classList.contains('open-telegram')) {
          window.open('https://t.me/neuroexpert_support', '_blank');
        }
      }
    };

    document.addEventListener('click', handleQuickBtnClick);
    return () => document.removeEventListener('click', handleQuickBtnClick);
  }, []);

  const handleWindowMouseDown = (e, windowId) => {
    const window = windows.find(w => w.id === windowId);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    });
    setDraggingWindow(windowId);
    setActiveWindow(windowId);
  };

  const handleResizeMouseDown = (e, windowId) => {
    e.stopPropagation();
    const window = windows.find(w => w.id === windowId);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    });
    setResizingWindow(windowId);
  };

  const handleMouseMove = (e) => {
    if (draggingWindow) {
      updateWindow(draggingWindow, {
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }
      });
    } else if (resizingWindow) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      updateWindow(resizingWindow, {
        size: {
          width: Math.max(300, resizeStart.width + deltaX),
          height: Math.max(200, resizeStart.height + deltaY)
        }
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingWindow(null);
    setResizingWindow(null);
  };

  useEffect(() => {
    if (draggingWindow || resizingWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingWindow, resizingWindow, dragOffset, resizeStart]);

  const renderWindowContent = (window) => {
    switch (window.type) {
      case 'analytics':
        return (
          <div className="window-content analytics">
            <h2>Аналитика в реальном времени</h2>
            <div className="analytics-grid">
              <div className="metric-card">
                <h3>Конверсия</h3>
                <div className="metric-value">3.8%</div>
                <div className="metric-chart">📈</div>
              </div>
              <div className="metric-card">
                <h3>Средний чек</h3>
                <div className="metric-value">15,420₽</div>
                <div className="metric-chart">📊</div>
              </div>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="window-content tasks">
            <h2>Управление задачами</h2>
            <div className="task-list">
              <div className="task-item">
                <input type="checkbox" id="task1" />
                <label htmlFor="task1">Проверить отчеты за квартал</label>
                <span className="task-priority high">Высокий</span>
              </div>
              <div className="task-item">
                <input type="checkbox" id="task2" />
                <label htmlFor="task2">Обновить документацию API</label>
                <span className="task-priority medium">Средний</span>
              </div>
            </div>
            {window.data?.mode === 'create' && (
              <form className="task-form">
                <input type="text" placeholder="Название задачи" />
                <textarea placeholder="Описание"></textarea>
                <button type="submit">Создать задачу</button>
              </form>
            )}
          </div>
        );
      
      case 'documents':
        return (
          <div className="window-content documents">
            <h2>Документы</h2>
            <div className="document-list">
              <div className="document-item">
                <span className="doc-icon">📄</span>
                <div className="doc-info">
                  <h4>Отчет Q4 2024.pdf</h4>
                  <p>Обновлен: 2 дня назад</p>
                </div>
                <button className="doc-action">Скачать</button>
              </div>
              <div className="document-item">
                <span className="doc-icon">📊</span>
                <div className="doc-info">
                  <h4>Аналитика продаж.xlsx</h4>
                  <p>Обновлен: 1 неделю назад</p>
                </div>
                <button className="doc-action">Открыть</button>
              </div>
            </div>
          </div>
        );
      
      case 'support':
        return (
          <div className="window-content support">
            <div className="support-header">
              <h2>🤖 AI Поддержка</h2>
              <p>Умный помощник NeuroExpert готов решить ваши вопросы</p>
            </div>
            
            <div className="ai-support-chat">
              <div className="chat-messages" id={`chat-${window.id}`}>
                <div className="ai-message">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <p>Привет! Я AI помощник поддержки NeuroExpert. Как могу помочь?</p>
                    <div className="quick-actions">
                      <button 
                        className="quick-btn"
                        data-query="Как настроить интеграции?"
                        data-window-id={window.id}
                      >
                        🔗 Настройка интеграций
                      </button>
                      <button 
                        className="quick-btn"
                        data-query="Проблемы с аналитикой"
                        data-window-id={window.id}
                      >
                        📊 Проблемы с аналитикой
                      </button>
                      <button 
                        className="quick-btn"
                        data-query="Как улучшить производительность?"
                        data-window-id={window.id}
                      >
                        ⚡ Производительность
                      </button>
                      <button 
                        className="quick-btn"
                        data-query="Вопросы по безопасности"
                        data-window-id={window.id}
                      >
                        🔒 Безопасность
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="chat-input-container">
                <div className="typing-indicator" id={`typing-${window.id}`} style={{display: 'none'}}>
                  <span>AI печатает</span>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="chat-input-wrapper">
                  <input 
                    type="text" 
                    className="chat-input"
                    placeholder="Опишите вашу проблему или задайте вопрос..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSupportQuery(window.id, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button 
                    className="send-btn"
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('.chat-input');
                      if (input.value.trim()) {
                        handleSupportQuery(window.id, input.value);
                        input.value = '';
                      }
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <style jsx>{`
              .support-header {
                text-align: center;
                padding: 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 20px;
              }

              .support-header h2 {
                color: #9945ff;
                margin-bottom: 8px;
                font-size: 20px;
              }

              .support-header p {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                margin: 0;
              }

              .ai-support-chat {
                display: flex;
                flex-direction: column;
                height: calc(100% - 120px);
              }

              .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 0 20px;
                margin-bottom: 20px;
              }

              .ai-message {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
                animation: slideInLeft 0.3s ease;
              }

              .user-message {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
                flex-direction: row-reverse;
                animation: slideInRight 0.3s ease;
              }

              .message-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: linear-gradient(135deg, #9945ff, #7c3aed);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
              }

              .user-message .message-avatar {
                background: linear-gradient(135deg, #06b6d4, #0891b2);
              }

              .message-content {
                flex: 1;
                background: rgba(153, 69, 255, 0.1);
                border: 1px solid rgba(153, 69, 255, 0.2);
                border-radius: 12px;
                padding: 16px;
                color: white;
              }

              .user-message .message-content {
                background: rgba(6, 182, 212, 0.1);
                border-color: rgba(6, 182, 212, 0.2);
              }

              .message-content p {
                margin: 0 0 12px 0;
                line-height: 1.5;
              }

              .quick-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-top: 16px;
              }

              .quick-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 8px 12px;
                color: rgba(255, 255, 255, 0.8);
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
              }

              .quick-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
                color: white;
                transform: translateY(-1px);
              }

              .chat-input-container {
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding: 16px 20px;
              }

              .typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
                margin-bottom: 12px;
              }

              .typing-dots {
                display: flex;
                gap: 4px;
              }

              .typing-dots span {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #9945ff;
                animation: typingBounce 1.4s infinite ease-in-out;
              }

              .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
              .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

              .chat-input-wrapper {
                display: flex;
                gap: 12px;
                align-items: center;
              }

              .chat-input {
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 12px 16px;
                color: white;
                font-size: 14px;
                outline: none;
                transition: all 0.2s ease;
              }

              .chat-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
              }

              .chat-input:focus {
                border-color: #9945ff;
                box-shadow: 0 0 0 3px rgba(153, 69, 255, 0.1);
              }

              .send-btn {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: linear-gradient(135deg, #9945ff, #7c3aed);
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
              }

              .send-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(153, 69, 255, 0.3);
              }

              @keyframes slideInLeft {
                from {
                  opacity: 0;
                  transform: translateX(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }

              @keyframes slideInRight {
                from {
                  opacity: 0;
                  transform: translateX(20px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }

              @keyframes typingBounce {
                0%, 80%, 100% {
                  transform: scale(0);
                }
                40% {
                  transform: scale(1);
                }
              }
            `}</style>
          </div>
        );
      
      default:
        return (
          <div className="window-content default">
            <h2>{window.title}</h2>
            <p>Содержимое окна {window.type}</p>
          </div>
        );
    }
  };

  return (
    <>
      {windows.map(window => (
        <div
          key={window.id}
          className={`workspace-window ${window.minimized ? 'minimized' : ''} ${window.maximized ? 'maximized' : ''} ${activeWindow === window.id ? 'active' : ''}`}
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height,
            zIndex: activeWindow === window.id ? 1000 : window.zIndex
          }}
          onMouseDown={() => setActiveWindow(window.id)}
        >
          <div 
            className="window-header"
            onMouseDown={(e) => handleWindowMouseDown(e, window.id)}
          >
            <h3 className="window-title">{window.title}</h3>
            <div className="window-controls">
              <button 
                className="window-control minimize"
                onClick={() => updateWindow(window.id, { minimized: !window.minimized })}
                aria-label="Свернуть"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 12h8" strokeWidth="2"/>
                </svg>
              </button>
              <button 
                className="window-control maximize"
                onClick={() => updateWindow(window.id, { maximized: !window.maximized })}
                aria-label={window.maximized ? "Восстановить" : "Развернуть"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                </svg>
              </button>
              <button 
                className="window-control close"
                onClick={() => closeWindow(window.id)}
                aria-label="Закрыть"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="window-body">
            {renderWindowContent(window)}
          </div>
          {!window.maximized && (
            <div 
              className="resize-handle"
              onMouseDown={(e) => handleResizeMouseDown(e, window.id)}
            ></div>
          )}
        </div>
      ))}
    </>
  );
}