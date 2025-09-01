/**
 * Мультиязычная поддержка для AI ассистента
 */

export const AI_LANGUAGES = {
  ru: {
    code: 'ru',
    name: 'Русский',
    flag: '🇷🇺',
    greeting: 'Здравствуйте! Я AI-управляющий NeuroExpert. Чем могу помочь?',
    placeholder: 'Напишите ваш вопрос...',
    voicePrompt: 'Говорите, я слушаю...',
    errorMessage: 'Извините, произошла ошибка. Попробуйте еще раз.',
    offlineMessage: 'Офлайн режим. Некоторые функции могут быть недоступны.',
    responses: {
      thinking: 'Думаю...',
      typing: 'Печатаю ответ...',
      listening: 'Слушаю вас...'
    }
  },
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    greeting: 'Hello! I\'m the AI Manager of NeuroExpert. How can I help you?',
    placeholder: 'Type your question...',
    voicePrompt: 'Speak, I\'m listening...',
    errorMessage: 'Sorry, an error occurred. Please try again.',
    offlineMessage: 'Offline mode. Some features may be unavailable.',
    responses: {
      thinking: 'Thinking...',
      typing: 'Typing response...',
      listening: 'Listening to you...'
    }
  },
  es: {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    greeting: '¡Hola! Soy el Gerente de IA de NeuroExpert. ¿En qué puedo ayudarte?',
    placeholder: 'Escribe tu pregunta...',
    voicePrompt: 'Habla, te escucho...',
    errorMessage: 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.',
    offlineMessage: 'Modo sin conexión. Algunas funciones pueden no estar disponibles.',
    responses: {
      thinking: 'Pensando...',
      typing: 'Escribiendo respuesta...',
      listening: 'Te escucho...'
    }
  },
  zh: {
    code: 'zh',
    name: '中文',
    flag: '🇨🇳',
    greeting: '您好！我是NeuroExpert的AI经理。有什么可以帮助您的吗？',
    placeholder: '请输入您的问题...',
    voicePrompt: '请说，我在听...',
    errorMessage: '抱歉，发生了错误。请再试一次。',
    offlineMessage: '离线模式。某些功能可能不可用。',
    responses: {
      thinking: '思考中...',
      typing: '正在输入回复...',
      listening: '正在听您说...'
    }
  }
};

export const detectUserLanguage = () => {
  if (typeof window === 'undefined') return 'ru';
  
  // Проверяем сохраненный язык
  const savedLang = localStorage.getItem('neuroexpert-language');
  if (savedLang && AI_LANGUAGES[savedLang]) {
    return savedLang;
  }
  
  // Определяем язык браузера
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0];
  
  // Возвращаем поддерживаемый язык или русский по умолчанию
  return AI_LANGUAGES[langCode] ? langCode : 'ru';
};

export const setUserLanguage = (langCode) => {
  if (AI_LANGUAGES[langCode]) {
    localStorage.setItem('neuroexpert-language', langCode);
    return true;
  }
  return false;
};

export const translatePrompt = (prompt, fromLang, toLang) => {
  // Здесь можно добавить интеграцию с API переводчика
  // Пока возвращаем оригинальный текст
  return prompt;
};

export const getAIPromptForLanguage = (language, userMessage) => {
  const lang = AI_LANGUAGES[language] || AI_LANGUAGES.ru;
  
  const systemPrompts = {
    ru: `Вы - AI управляющий NeuroExpert. Отвечайте на русском языке. 
         Будьте профессиональны, дружелюбны и полезны. 
         Фокусируйтесь на бизнес-решениях и автоматизации.`,
    
    en: `You are the AI Manager of NeuroExpert. Respond in English. 
         Be professional, friendly, and helpful. 
         Focus on business solutions and automation.`,
    
    es: `Eres el Gerente de IA de NeuroExpert. Responde en español. 
         Sé profesional, amigable y útil. 
         Concéntrate en soluciones empresariales y automatización.`,
    
    zh: `您是NeuroExpert的AI经理。请用中文回复。
         请保持专业、友好和乐于助人。
         专注于业务解决方案和自动化。`
  };
  
  return {
    systemPrompt: systemPrompts[language] || systemPrompts.ru,
    userMessage: userMessage,
    language: language
  };
};