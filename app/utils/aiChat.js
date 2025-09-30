/**
 * AI Chat Utility
 * Утилита для управления диалогом с AI ассистентом
 */

export const openAIChat = (message) => {
  // Создаем кастомное событие для открытия чата
  const event = new CustomEvent('openAIChat', {
    detail: message ? { message } : null
  });
  
  // Отправляем событие
  window.dispatchEvent(event);
  
  // Отправляем аналитику
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'open_ai_chat', {
      event_category: 'engagement',
      event_label: message ? 'with_message' : 'direct_open',
      value: 1
    });
  }
};

// Предустановленные сообщения для разных сценариев
export const AI_CHAT_MESSAGES = {
  ROI_CALCULATION: 'Помогите рассчитать ROI для моего бизнеса',
  PRICING_INFO: 'Расскажите подробнее о стоимости внедрения',
  START_JOURNEY: 'С чего начать цифровизацию моего бизнеса?',
  CONTACT_SUPPORT: 'Нужна консультация по внедрению NeuroExpert',
  CUSTOM_SOLUTION: 'Нужно индивидуальное решение для моей компании',
  DEMO_REQUEST: 'Хочу посмотреть демо платформы',
  TECHNICAL_QUESTION: 'У меня технический вопрос по интеграции'
};

// Хелпер для быстрого открытия чата с предустановленным сообщением
export const openAIChatWithMessage = (messageType) => {
  const message = AI_CHAT_MESSAGES[messageType];
  if (message) {
    openAIChat(message);
  } else {
    console.warn(`Unknown message type: ${messageType}`);
    openAIChat();
  }
};