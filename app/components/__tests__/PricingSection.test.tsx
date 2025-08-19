import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PricingSection from '../PricingSection';

describe('PricingSection', () => {
  it('рендерит заголовок секции', () => {
    render(<PricingSection />);
    
    expect(screen.getByText(/выберите ваш план/i)).toBeInTheDocument();
  });

  it('отображает все тарифные планы', () => {
    render(<PricingSection />);
    
    // Проверяем наличие планов
    expect(screen.getByText(/стартовый/i)).toBeInTheDocument();
    expect(screen.getByText(/профессиональный/i)).toBeInTheDocument();
    expect(screen.getByText(/корпоративный/i)).toBeInTheDocument();
  });

  it('показывает цены для каждого плана', () => {
    render(<PricingSection />);
    
    // Проверяем наличие цен
    expect(screen.getByText(/₽/)).toBeInTheDocument();
    expect(screen.getByText(/месяц/i)).toBeInTheDocument();
  });

  it('отображает особенности каждого плана', () => {
    render(<PricingSection />);
    
    // Проверяем features
    expect(screen.getByText(/ai ассистент/i)).toBeInTheDocument();
    expect(screen.getByText(/аналитика/i)).toBeInTheDocument();
    expect(screen.getByText(/поддержка/i)).toBeInTheDocument();
  });

  it('содержит CTA кнопки для каждого плана', () => {
    render(<PricingSection />);
    
    const ctaButtons = screen.getAllByText(/выбрать план/i);
    expect(ctaButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('выделяет рекомендуемый план', () => {
    const { container } = render(<PricingSection />);
    
    // Проверяем наличие выделенного плана
    const recommendedPlan = container.querySelector('.recommended');
    expect(recommendedPlan).toBeInTheDocument();
  });
});