/**
 * AI Chat Utility
 * Утилита для управления диалогом с AI ассистентом
 */

export function openAIChat(message) {
  // Находим кнопку AI чата
  const aiButton = document.querySelector('.ai-float-button');

  if (aiButton) {
    // Кликаем по кнопке чтобы открыть чат
    aiButton.click();

    // Если передано сообщение, устанавливаем его в поле ввода
    if (message) {
      setTimeout(() => {
        const input = document.querySelector('input[placeholder*="вопрос"]');
        if (input) {
          input.value = message;
          // Триггерим событие изменения
          const event = new Event('input', { bubbles: true });
          input.dispatchEvent(event);
        }
      }, 500);
    }
  } else {
    console.warn('AI чат еще не загружен');
  }
}

// Предустановленные сообщения для разных сценариев
export const AI_CHAT_MESSAGES = {
  ROI_CALCULATION: 'Помогите рассчитать ROI для моего бизнеса',
  PRICING_INFO: 'Расскажите подробнее о стоимости внедрения',
  START_JOURNEY: 'С чего начать цифровизацию моего бизнеса?',
  CONTACT_SUPPORT: 'Нужна консультация по внедрению NeuroExpert',
  CUSTOM_SOLUTION: 'Нужно индивидуальное решение для моей компании',
  DEMO_REQUEST: 'Хочу посмотреть демо платформы',
  TECHNICAL_QUESTION: 'У меня технический вопрос по интеграции',
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
