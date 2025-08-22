import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SmartFloatingAI from '../SmartFloatingAI';

// Mock fetch для API вызовов
global.fetch = jest.fn();

describe('SmartFloatingAI', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders AI assistant button', () => {
    render(<SmartFloatingAI />);
    const button = screen.getByRole('button', { name: /ai.*assistant/i });
    expect(button).toBeInTheDocument();
  });

  it('opens chat window when button is clicked', async () => {
    const user = userEvent.setup();
    render(<SmartFloatingAI />);

    const button = screen.getByRole('button', { name: /ai.*assistant/i });
    await user.click(button);

    expect(screen.getByPlaceholderText(/Задайте вопрос/i)).toBeInTheDocument();
  });

  it('sends message when user types and submits', async () => {
    const user = userEvent.setup();

    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: 'Это тестовый ответ от AI' }),
    });

    render(<SmartFloatingAI />);

    // Open chat
    const button = screen.getByRole('button', { name: /ai.*assistant/i });
    await user.click(button);

    // Type message
    const input = screen.getByPlaceholderText(/Задайте вопрос/i);
    await user.type(input, 'Тестовый вопрос');

    // Submit message
    const sendButton = screen.getByRole('button', { name: /отправить/i });
    await user.click(sendButton);

    // Check if API was called
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/assistant'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.stringContaining('Тестовый вопрос'),
      })
    );

    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Это тестовый ответ от AI')).toBeInTheDocument();
    });
  });

  it('shows error message when API fails', async () => {
    const user = userEvent.setup();

    // Mock failed API response
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<SmartFloatingAI />);

    // Open chat and send message
    const button = screen.getByRole('button', { name: /ai.*assistant/i });
    await user.click(button);

    const input = screen.getByPlaceholderText(/Задайте вопрос/i);
    await user.type(input, 'Test');

    const sendButton = screen.getByRole('button', { name: /отправить/i });
    await user.click(sendButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/ошибка|error/i)).toBeInTheDocument();
    });
  });

  it('closes chat when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SmartFloatingAI />);

    // Open chat
    const button = screen.getByRole('button', { name: /ai.*assistant/i });
    await user.click(button);

    // Find and click close button
    const closeButton = screen.getByRole('button', { name: /закрыть|close/i });
    await user.click(closeButton);

    // Check if chat is closed
    expect(screen.queryByPlaceholderText(/Задайте вопрос/i)).not.toBeInTheDocument();
  });
});
