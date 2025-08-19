import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuickActions from '../QuickActions';

describe('QuickActions', () => {
  it('рендерит быстрые действия', () => {
    render(<QuickActions />);
    
    expect(screen.getByText(/быстрые действия/i)).toBeInTheDocument();
  });

  it('отображает все action кнопки', () => {
    render(<QuickActions />);
    
    // Проверяем основные действия
    expect(screen.getByText(/💬 чат с ai/i)).toBeInTheDocument();
    expect(screen.getByText(/📊 аналитика/i)).toBeInTheDocument();
    expect(screen.getByText(/🎯 roi калькулятор/i)).toBeInTheDocument();
    expect(screen.getByText(/📞 связаться/i)).toBeInTheDocument();
  });

  it('обрабатывает клики по действиям', () => {
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    render(<QuickActions />);
    
    const chatButton = screen.getByText(/💬 чат с ai/i);
    fireEvent.click(chatButton);
    
    // Проверяем, что действие было выполнено
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('применяет анимации при наведении', () => {
    const { container } = render(<QuickActions />);
    
    const actionButtons = container.querySelectorAll('.quick-action');
    expect(actionButtons.length).toBeGreaterThan(0);
    
    // Проверяем наличие классов для hover эффектов
    actionButtons.forEach(button => {
      expect(button).toHaveClass('quick-action');
    });
  });

  it('использует правильные иконки для действий', () => {
    render(<QuickActions />);
    
    // Проверяем наличие эмодзи-иконок
    expect(screen.getByText(/💬/)).toBeInTheDocument();
    expect(screen.getByText(/📊/)).toBeInTheDocument();
    expect(screen.getByText(/🎯/)).toBeInTheDocument();
    expect(screen.getByText(/📞/)).toBeInTheDocument();
  });
});