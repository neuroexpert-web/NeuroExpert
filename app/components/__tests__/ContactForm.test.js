import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../ContactForm';

// Mock fetch для API вызовов
global.fetch = jest.fn();

describe('ContactForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('рендерит форму контактов', () => {
    render(<ContactForm />);
    
    expect(screen.getByPlaceholderText(/ваше имя/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\+7/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/опишите вашу задачу/i)).toBeInTheDocument();
    expect(screen.getByText(/отправить заявку/i)).toBeInTheDocument();
  });

  it('валидирует обязательные поля', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByText(/отправить заявку/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/пожалуйста, заполните все обязательные поля/i)).toBeInTheDocument();
    });
  });

  it('валидирует формат email', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByText(/отправить заявку/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/введите корректный email/i)).toBeInTheDocument();
    });
  });

  it('успешно отправляет форму с валидными данными', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<ContactForm />);
    
    // Заполняем форму
    fireEvent.change(screen.getByPlaceholderText(/ваше имя/i), {
      target: { value: 'Иван Иванов' }
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'ivan@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText(/\+7/i), {
      target: { value: '+79001234567' }
    });
    fireEvent.change(screen.getByPlaceholderText(/опишите вашу задачу/i), {
      target: { value: 'Тестовое сообщение' }
    });
    
    const submitButton = screen.getByText(/отправить заявку/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact-form', expect.any(Object));
      expect(screen.getByText(/заявка успешно отправлена/i)).toBeInTheDocument();
    });
  });

  it('обрабатывает ошибку при отправке', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<ContactForm />);
    
    // Заполняем форму
    fireEvent.change(screen.getByPlaceholderText(/ваше имя/i), {
      target: { value: 'Иван Иванов' }
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'ivan@example.com' }
    });
    
    const submitButton = screen.getByText(/отправить заявку/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/произошла ошибка/i)).toBeInTheDocument();
    });
  });
});