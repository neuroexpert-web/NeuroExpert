import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SmartFloatingAI from '../SmartFloatingAI';

// Мокаем fetch для API вызовов
global.fetch = jest.fn();

// Мокаем localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('SmartFloatingAI Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering and UI', () => {
    it('renders floating AI button initially closed', () => {
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('ai-floating-button');
    });

    it('opens chat window when button is clicked', async () => {
      const user = userEvent.setup();
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Проверяем, что чат открылся
      expect(screen.getByText(/Александр Нейронов/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Задайте ваш вопрос/i)).toBeInTheDocument();
    });

    it('displays greeting message based on time of day', async () => {
      const user = userEvent.setup();
      
      // Мокаем время для утра
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01 09:00:00'));
      
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Проверяем утреннее приветствие
      await waitFor(() => {
        expect(screen.getByText(/Доброе утро/i)).toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });

    it('shows quick questions buttons', async () => {
      const user = userEvent.setup();
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Проверяем быстрые вопросы
      expect(screen.getByText('Сколько стоит цифровизация?')).toBeInTheDocument();
      expect(screen.getByText('Какой ROI я получу?')).toBeInTheDocument();
      expect(screen.getByText('Сколько времени займет?')).toBeInTheDocument();
      expect(screen.getByText('С чего начать?')).toBeInTheDocument();
    });
  });

  describe('Message Handling', () => {
    it('sends message and receives AI response', async () => {
      const user = userEvent.setup();
      
      // Мокаем успешный ответ от AI
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'Это тестовый ответ от AI ассистента',
          context: { intent: 'general' }
        })
      });
      
      render(<SmartFloatingAI />);
      
      // Открываем чат
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Вводим сообщение
      const input = screen.getByPlaceholderText(/Задайте ваш вопрос/i);
      await user.type(input, 'Тестовый вопрос');
      
      // Отправляем
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      await user.click(sendButton);
      
      // Проверяем, что сообщение пользователя отобразилось
      expect(screen.getByText('Тестовый вопрос')).toBeInTheDocument();
      
      // Проверяем индикатор загрузки
      expect(screen.getByText(/набирает ответ/i)).toBeInTheDocument();
      
      // Ждем ответ AI
      await waitFor(() => {
        expect(screen.getByText('Это тестовый ответ от AI ассистента')).toBeInTheDocument();
      });
      
      // Проверяем, что API был вызван правильно
      expect(fetch).toHaveBeenCalledWith('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Тестовый вопрос',
          model: 'gemini',
          context: expect.any(Object)
        })
      });
    });

    it('handles quick question click', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'Цифровизация стоит от 200 000 рублей',
          context: { intent: 'pricing' }
        })
      });
      
      render(<SmartFloatingAI />);
      
      // Открываем чат
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Кликаем на быстрый вопрос
      const quickQuestion = screen.getByText('Сколько стоит цифровизация?');
      await user.click(quickQuestion);
      
      // Проверяем, что вопрос отправился
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/assistant', expect.any(Object));
      });
    });

    it('handles API error gracefully', async () => {
      const user = userEvent.setup();
      
      // Мокаем ошибку API
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      render(<SmartFloatingAI />);
      
      // Открываем чат и отправляем сообщение
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      const input = screen.getByPlaceholderText(/Задайте ваш вопрос/i);
      await user.type(input, 'Тест ошибки');
      
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      await user.click(sendButton);
      
      // Проверяем сообщение об ошибке
      await waitFor(() => {
        expect(screen.getByText(/Извините, произошла ошибка/i)).toBeInTheDocument();
      });
    });
  });

  describe('Model Selection', () => {
    it('switches between Gemini and Claude models', async () => {
      const user = userEvent.setup();
      render(<SmartFloatingAI />);
      
      // Открываем чат
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Проверяем, что Gemini выбран по умолчанию
      const geminiButton = screen.getByRole('button', { name: /Gemini/i });
      expect(geminiButton).toHaveClass('active');
      
      // Переключаемся на Claude
      const claudeButton = screen.getByRole('button', { name: /Claude/i });
      await user.click(claudeButton);
      
      expect(claudeButton).toHaveClass('active');
      expect(geminiButton).not.toHaveClass('active');
    });

    it('sends correct model parameter with message', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: 'Claude response' })
      });
      
      render(<SmartFloatingAI />);
      
      // Открываем чат
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Переключаемся на Claude
      const claudeButton = screen.getByRole('button', { name: /Claude/i });
      await user.click(claudeButton);
      
      // Отправляем сообщение
      const input = screen.getByPlaceholderText(/Задайте ваш вопрос/i);
      await user.type(input, 'Test');
      
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      await user.click(sendButton);
      
      // Проверяем, что model: 'claude' был отправлен
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"model":"claude"')
        });
      });
    });
  });

  describe('Context and Personalization', () => {
    it('maintains conversation context', async () => {
      const user = userEvent.setup();
      
      // Первый ответ
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: 'Первый ответ' })
      });
      
      // Второй ответ
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: 'Второй ответ с учетом контекста' })
      });
      
      render(<SmartFloatingAI />);
      
      // Открываем чат
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Первое сообщение
      const input = screen.getByPlaceholderText(/Задайте ваш вопрос/i);
      await user.type(input, 'Первый вопрос');
      
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Первый ответ')).toBeInTheDocument();
      });
      
      // Второе сообщение
      await user.clear(input);
      await user.type(input, 'Второй вопрос');
      await user.click(sendButton);
      
      // Проверяем, что контекст передается
      await waitFor(() => {
        const lastCall = fetch.mock.calls[fetch.mock.calls.length - 1];
        const body = JSON.parse(lastCall[1].body);
        expect(body.context.previousInteractions).toBeGreaterThan(0);
      });
    });

    it('saves messages to localStorage', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ answer: 'Test response' })
      });
      
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      const input = screen.getByPlaceholderText(/Задайте ваш вопрос/i);
      await user.type(input, 'Test message');
      
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      await user.click(sendButton);
      
      await waitFor(() => {
        expect(screen.getByText('Test response')).toBeInTheDocument();
      });
      
      // Проверяем, что сообщения сохранились в localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'neuroexpert_chat_history',
        expect.any(String)
      );
    });
  });

  describe('Statistics and Analytics', () => {
    it('tracks message statistics', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ answer: 'Response' })
      });
      
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Отправляем несколько сообщений
      const input = screen.getByPlaceholderText(/Задайте ваш вопрос/i);
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      
      for (let i = 0; i < 3; i++) {
        await user.clear(input);
        await user.type(input, `Message ${i}`);
        await user.click(sendButton);
        
        await waitFor(() => {
          expect(screen.getByText('Response')).toBeInTheDocument();
        });
      }
      
      // Проверяем статистику
      expect(screen.getByText(/Всего вопросов: 3/i)).toBeInTheDocument();
    });

    it('displays satisfaction rating', async () => {
      const user = userEvent.setup();
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      // Проверяем отображение рейтинга удовлетворенности
      expect(screen.getByText(/95%/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SmartFloatingAI />);
      
      // Tab к кнопке и открытие через Enter
      await user.tab();
      await user.keyboard('{Enter}');
      
      // Проверяем, что чат открылся
      expect(screen.getByText(/Александр Нейронов/i)).toBeInTheDocument();
      
      // Tab к полю ввода
      await user.tab();
      await user.tab(); // Пропускаем кнопки моделей
      await user.tab();
      
      // Вводим текст и отправляем через Enter
      await user.type(screen.getByPlaceholderText(/Задайте ваш вопрос/i), 'Test{Enter}');
      
      // Проверяем, что сообщение отправилось
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('has proper ARIA labels', () => {
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      expect(button).toHaveAttribute('aria-label');
      
      // Открываем чат
      fireEvent.click(button);
      
      const chatWindow = screen.getByRole('region');
      expect(chatWindow).toHaveAttribute('aria-label', expect.stringContaining('AI'));
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles empty message submission', async () => {
      const user = userEvent.setup();
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      await user.click(sendButton);
      
      // Проверяем, что fetch не был вызван
      expect(fetch).not.toHaveBeenCalled();
    });

    it('handles rate limit error', async () => {
      const user = userEvent.setup();
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ 
          error: 'Too many requests',
          retryAfter: 60 
        })
      });
      
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      const input = screen.getByPlaceholderText(/Задайте ваш вопрос/i);
      await user.type(input, 'Test');
      
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      await user.click(sendButton);
      
      // Проверяем сообщение о превышении лимита
      await waitFor(() => {
        expect(screen.getByText(/Слишком много запросов/i)).toBeInTheDocument();
      });
    });

    it('handles network timeout', async () => {
      const user = userEvent.setup();
      
      // Создаем промис, который никогда не резолвится (имитация таймаута)
      fetch.mockImplementationOnce(() => new Promise(() => {}));
      
      render(<SmartFloatingAI />);
      
      const button = screen.getByRole('button', { name: /AI|Управляющий/i });
      await user.click(button);
      
      const input = screen.getByPlaceholderText(/Задайте ваш вопрос/i);
      await user.type(input, 'Test timeout');
      
      const sendButton = screen.getByRole('button', { name: /отправить/i });
      await user.click(sendButton);
      
      // Проверяем индикатор загрузки
      expect(screen.getByText(/набирает ответ/i)).toBeInTheDocument();
      
      // Здесь в реальном компоненте должен быть таймаут
      // Для теста просто проверяем, что индикатор остается
    });
  });
});