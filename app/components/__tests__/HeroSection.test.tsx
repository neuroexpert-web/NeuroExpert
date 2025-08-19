import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '../HeroSection';

describe('HeroSection', () => {
  it('рендерит основные элементы секции', () => {
    render(<HeroSection />);
    
    // Проверяем наличие основных текстовых элементов
    expect(screen.getByText(/превратите ваш бизнес/i)).toBeInTheDocument();
    expect(screen.getByText(/в цифровую империю/i)).toBeInTheDocument();
  });

  it('отображает описание платформы', () => {
    render(<HeroSection />);
    
    expect(screen.getByText(/платформа neuroexpert/i)).toBeInTheDocument();
  });

  it('показывает статистику', () => {
    render(<HeroSection />);
    
    // Проверяем метрики
    expect(screen.getByText(/300%/)).toBeInTheDocument();
    expect(screen.getByText(/roi/i)).toBeInTheDocument();
    expect(screen.getByText(/500\+/)).toBeInTheDocument();
    expect(screen.getByText(/компаний/i)).toBeInTheDocument();
  });

  it('содержит CTA кнопки', () => {
    render(<HeroSection />);
    
    const ctaButtons = screen.getAllByRole('button');
    expect(ctaButtons).toHaveLength(2);
    
    expect(screen.getByText(/попробовать бесплатно/i)).toBeInTheDocument();
    expect(screen.getByText(/посмотреть демо/i)).toBeInTheDocument();
  });

  it('использует правильные стили для premium дизайна', () => {
    const { container } = render(<HeroSection />);
    
    // Проверяем наличие классов для анимаций и эффектов
    expect(container.querySelector('.hero-section')).toBeInTheDocument();
    expect(container.querySelector('.fade-in')).toBeInTheDocument();
  });
});