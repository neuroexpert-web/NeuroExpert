import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PremiumHero from '../PremiumHero';

// Mock для динамических импортов
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (() => {
    const DynamicComponent = () => null;
    DynamicComponent.displayName = 'LoadableComponent';
    DynamicComponent.preload = jest.fn();
    return DynamicComponent;
  })
}));

describe('PremiumHero', () => {
  it('рендерит основные элементы hero секции', () => {
    render(<PremiumHero />);
    
    // Проверяем заголовок
    expect(screen.getByText(/neuroexpert/i)).toBeInTheDocument();
    
    // Проверяем подзаголовок
    expect(screen.getByText(/ai-решения для вашего бизнеса/i)).toBeInTheDocument();
    
    // Проверяем кнопки CTA
    expect(screen.getByText(/начать сейчас/i)).toBeInTheDocument();
    expect(screen.getByText(/узнать больше/i)).toBeInTheDocument();
  });

  it('показывает анимированные метрики', () => {
    render(<PremiumHero />);
    
    // Проверяем наличие метрик
    expect(screen.getByText(/roi/i)).toBeInTheDocument();
    expect(screen.getByText(/клиентов/i)).toBeInTheDocument();
    expect(screen.getByText(/экономия времени/i)).toBeInTheDocument();
  });

  it('обрабатывает клик по кнопке "Начать сейчас"', () => {
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    
    render(<PremiumHero />);
    
    const startButton = screen.getByText(/начать сейчас/i);
    fireEvent.click(startButton);
    
    // Проверяем, что был вызван скролл
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('применяет premium стили', () => {
    const { container } = render(<PremiumHero />);
    
    // Проверяем наличие premium классов
    expect(container.querySelector('.premium-hero')).toBeInTheDocument();
    expect(container.querySelector('.glass-card')).toBeInTheDocument();
  });

  it('отображает градиентный текст для заголовка', () => {
    const { container } = render(<PremiumHero />);
    
    const gradientText = container.querySelector('.gradient-text');
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveTextContent(/neuroexpert/i);
  });
});