'use client';
import { useState, useEffect, useRef } from 'react';

export default function SmartFloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  // История сообщений хранится в localStorage -> диалог не пропадает после перезагрузки
  const [messages, setMessages] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('ai_messages') || '[]');
    } catch {
      return [];
    }
  });
  const [context, setContext] = useState({
    industry: null,
    companySize: null,
    urgency: null,
    previousInteractions: 0,
    userProfile: {},
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude'); // 'gemini' или 'claude' - Claude по умолчанию
  const [mode, setMode] = useState('chat'); // 'chat', 'calculator', 'demo', 'consultation'
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('ai_onboarding_completed');
  });
  const messagesEndRef = useRef(null);

  // Сохраняем сообщения при каждом изменении
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Автоскролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Приветственное сообщение при первом открытии
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: `Привет! 👋 Я AI-помощник NeuroExpert.
        
Я могу помочь вам:
• 📊 Рассчитать ROI от внедрения наших решений
• 🎯 Подобрать оптимальный план для вашего бизнеса
• 💡 Ответить на вопросы о наших продуктах
• 📅 Записать вас на демо

Просто опишите вашу задачу или выберите один из режимов в меню выше!`,
        sender: 'assistant',
        timestamp: new Date(),
        model: 'system',
        interactive: true,
        options: [
          { label: '📊 Рассчитать ROI', action: 'roi' },
          { label: '🎯 Подобрать план', action: 'plan' },
          { label: '📅 Записаться на демо', action: 'demo' },
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    // Временный ответ для демонстрации
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        text: 'Спасибо за ваш вопрос! Наша команда свяжется с вами в ближайшее время для предоставления подробной информации.',
        sender: 'assistant',
        timestamp: new Date(),
        model: selectedModel,
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
      setIsTyping(false);
    }, 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('ai_messages');
    setContext({
      industry: null,
      companySize: null,
      urgency: null,
      previousInteractions: 0,
      userProfile: {},
    });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Добавляем системное сообщение о смене режима
    const modeMessages = {
      chat: 'Переключен в режим общения. Задавайте любые вопросы!',
      calculator: 'Открыт калькулятор ROI. Давайте рассчитаем вашу выгоду!',
      demo: 'Режим демонстрации. Хотите записаться на персональную презентацию?',
      consultation: 'Режим консультации. Расскажите о вашем бизнесе, и я подберу решение.',
    };

    const systemMessage = {
      id: Date.now(),
      text: modeMessages[newMode],
      sender: 'assistant',
      timestamp: new Date(),
      model: 'system',
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleOptionClick = (action) => {
    switch (action) {
      case 'roi':
        handleModeChange('calculator');
        break;
      case 'plan':
        handleModeChange('consultation');
        break;
      case 'demo':
        handleModeChange('demo');
        break;
    }
  };

  return (
    <>
      {/* Кнопка открытия чата */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`ai-float-button fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
        }`}
        style={{
          boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 40px rgba(102,126,234,0.4)',
        }}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-8 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 40px rgba(102,126,234,0.2)',
          }}
        >
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">AI Ассистент NeuroExpert</h3>
              <button
                onClick={handleClearChat}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title="Очистить чат"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* Выбор режима */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => handleModeChange('chat')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  mode === 'chat' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                💬 Чат
              </button>
              <button
                onClick={() => handleModeChange('calculator')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  mode === 'calculator'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                📊 ROI
              </button>
              <button
                onClick={() => handleModeChange('demo')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  mode === 'demo' ? 'bg-white text-purple-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                🎬 Демо
              </button>
              <button
                onClick={() => handleModeChange('consultation')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  mode === 'consultation'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                💡 Консультация
              </button>
            </div>
          </div>

          {/* Область сообщений */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white shadow-md text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>

                  {/* Интерактивные опции */}
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option.action)}
                          className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                    {message.model && ` • ${message.model}`}
                  </div>
                </div>
              </div>
            ))}

            {/* Индикатор печатания */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white shadow-md p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Форма ввода */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'calculator'
                    ? 'Сколько у вас сотрудников?'
                    : mode === 'demo'
                      ? 'Когда вам удобно провести демо?'
                      : mode === 'consultation'
                        ? 'Расскажите о вашем бизнесе...'
                        : 'Введите ваш вопрос...'
                }
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Выбор модели */}
            <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="model"
                  value="claude"
                  checked={selectedModel === 'claude'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mr-1"
                />
                Claude 3
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="model"
                  value="gemini"
                  checked={selectedModel === 'gemini'}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="mr-1"
                />
                Gemini Pro
              </label>
            </div>
          </form>
        </div>
      )}

      {/* Онбординг */}
      {showOnboarding && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Добро пожаловать в AI-ассистент! 🎉</h3>
            <div className="space-y-3 text-gray-600">
              <p>Наш умный помощник может:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Рассчитать ROI для вашего бизнеса</li>
                <li>Помочь выбрать подходящий тариф</li>
                <li>Ответить на технические вопросы</li>
                <li>Записать вас на демонстрацию</li>
              </ul>
              <p className="font-medium">
                💡 Совет: Попробуйте разные режимы работы в верхней панели чата!
              </p>
            </div>
            <button
              onClick={() => {
                setShowOnboarding(false);
                localStorage.setItem('ai_onboarding_completed', 'true');
              }}
              className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Понятно, начать общение
            </button>
          </div>
        </div>
      )}
    </>
  );
}
