import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ROICalculator from '../ROICalculator';

// Мокаем fetch для API вызовов
global.fetch = jest.fn();

// Мокаем framer-motion для тестов
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => children,
}));

describe('ROICalculator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering and UI', () => {
    it('renders calculator title with gradient text', () => {
      render(<ROICalculator />);
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(screen.getByText('ROI')).toBeInTheDocument();
      expect(screen.getByText('Калькулятор')).toBeInTheDocument();
    });

    it('renders all form fields with correct initial values', () => {
      render(<ROICalculator />);
      
      // Проверяем размер бизнеса
      const businessSizeSelect = screen.getByLabelText(/Размер вашего бизнеса/i);
      expect(businessSizeSelect).toHaveValue('small');
      
      // Проверяем отрасль
      const industrySelect = screen.getByLabelText(/Отрасль/i);
      expect(industrySelect).toHaveValue('retail');
      
      // Проверяем выручку
      const revenueInput = screen.getByLabelText(/Текущая выручка/i);
      expect(revenueInput).toHaveValue('1000000');
      
      // Проверяем бюджет
      const budgetInput = screen.getByLabelText(/Бюджет на цифровизацию/i);
      expect(budgetInput).toHaveValue('200000');
    });

    it('displays currency formatting correctly', () => {
      render(<ROICalculator />);
      
      const revenueInput = screen.getByLabelText(/Текущая выручка/i);
      const budgetInput = screen.getByLabelText(/Бюджет на цифровизацию/i);
      
      // Проверяем, что есть символ валюты
      expect(screen.getAllByText('₽').length).toBeGreaterThan(0);
    });
  });

  describe('Form Interactions', () => {
    it('updates business size when changed', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const businessSizeSelect = screen.getByLabelText(/Размер вашего бизнеса/i);
      
      // Меняем на средний бизнес
      await user.selectOptions(businessSizeSelect, 'medium');
      expect(businessSizeSelect.value).toBe('medium');
      
      // Меняем на крупный бизнес
      await user.selectOptions(businessSizeSelect, 'large');
      expect(businessSizeSelect.value).toBe('large');
    });

    it('updates industry when changed', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const industrySelect = screen.getByLabelText(/Отрасль/i);
      
      // Проверяем все опции
      await user.selectOptions(industrySelect, 'services');
      expect(industrySelect.value).toBe('services');
      
      await user.selectOptions(industrySelect, 'production');
      expect(industrySelect.value).toBe('production');
      
      await user.selectOptions(industrySelect, 'it');
      expect(industrySelect.value).toBe('it');
      
      await user.selectOptions(industrySelect, 'other');
      expect(industrySelect.value).toBe('other');
    });

    it('validates revenue input', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const revenueInput = screen.getByLabelText(/Текущая выручка/i);
      
      // Очищаем и вводим новое значение
      await user.clear(revenueInput);
      await user.type(revenueInput, '5000000');
      expect(revenueInput.value).toBe('5000000');
      
      // Проверяем, что принимает только числа
      await user.clear(revenueInput);
      await user.type(revenueInput, 'abc');
      expect(revenueInput.value).toBe('');
    });

    it('validates budget input', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const budgetInput = screen.getByLabelText(/Бюджет на цифровизацию/i);
      
      // Изменяем бюджет
      await user.clear(budgetInput);
      await user.type(budgetInput, '500000');
      expect(budgetInput.value).toBe('500000');
    });
  });

  describe('ROI Calculation', () => {
    it('calculates ROI with default values', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      // Ждем появления результатов
      await waitFor(() => {
        expect(screen.getByText(/Результаты расчета/i)).toBeInTheDocument();
      });
      
      // Проверяем, что показаны все метрики
      expect(screen.getByText(/ROI/)).toBeInTheDocument();
      expect(screen.getByText(/Экономия/i)).toBeInTheDocument();
      expect(screen.getByText(/Рост выручки/i)).toBeInTheDocument();
      expect(screen.getByText(/Окупаемость/i)).toBeInTheDocument();
    });

    it('calculates different ROI for different business sizes', async () => {
      const user = userEvent.setup();
      
      // Тест для малого бизнеса
      const { rerender } = render(<ROICalculator />);
      
      let calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Результаты расчета/i)).toBeInTheDocument();
      });
      
      // Сохраняем ROI для малого бизнеса
      const smallBusinessROI = screen.getByText(/320%/); // Ожидаемый ROI для малого бизнеса
      expect(smallBusinessROI).toBeInTheDocument();
      
      // Возвращаемся к форме
      const backButton = screen.getByText(/Назад/i);
      await user.click(backButton);
      
      // Меняем на крупный бизнес
      const businessSizeSelect = screen.getByLabelText(/Размер вашего бизнеса/i);
      await user.selectOptions(businessSizeSelect, 'large');
      
      // Пересчитываем
      calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        const largeBusinessROI = screen.getByText(/600%/); // Ожидаемый ROI для крупного бизнеса
        expect(largeBusinessROI).toBeInTheDocument();
      });
    });

    it('shows animation when displaying results', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      // Проверяем наличие анимированных элементов
      await waitFor(() => {
        const resultCards = screen.getAllByTestId(/result-card/i);
        expect(resultCards.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Results Display', () => {
    it('formats numbers correctly in results', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        // Проверяем форматирование чисел с разделителями тысяч
        const formattedNumbers = screen.getAllByText(/\d{1,3}(\s\d{3})*/);
        expect(formattedNumbers.length).toBeGreaterThan(0);
      });
    });

    it('shows recommendations based on results', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        // Проверяем наличие рекомендаций
        expect(screen.getByText(/Рекомендации/i)).toBeInTheDocument();
        expect(screen.getByText(/Автоматизация/i)).toBeInTheDocument();
      });
    });

    it('allows going back to form from results', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      // Рассчитываем
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Результаты расчета/i)).toBeInTheDocument();
      });
      
      // Возвращаемся
      const backButton = screen.getByText(/Назад/i);
      await user.click(backButton);
      
      // Проверяем, что форма снова показана
      expect(screen.getByLabelText(/Размер вашего бизнеса/i)).toBeInTheDocument();
      expect(screen.getByText(/Рассчитать выгоду/i)).toBeInTheDocument();
    });
  });

  describe('Integration Features', () => {
    it('shows contact CTA in results', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        // Проверяем наличие призыва к действию
        expect(screen.getByText(/Получить персональный расчет/i)).toBeInTheDocument();
        expect(screen.getByText(/Обсудить проект/i)).toBeInTheDocument();
      });
    });

    it('preserves form data when going back', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      // Меняем значения
      const businessSizeSelect = screen.getByLabelText(/Размер вашего бизнеса/i);
      await user.selectOptions(businessSizeSelect, 'medium');
      
      const revenueInput = screen.getByLabelText(/Текущая выручка/i);
      await user.clear(revenueInput);
      await user.type(revenueInput, '3000000');
      
      // Рассчитываем
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Результаты расчета/i)).toBeInTheDocument();
      });
      
      // Возвращаемся
      const backButton = screen.getByText(/Назад/i);
      await user.click(backButton);
      
      // Проверяем, что значения сохранились
      expect(screen.getByLabelText(/Размер вашего бизнеса/i).value).toBe('medium');
      expect(screen.getByLabelText(/Текущая выручка/i).value).toBe('3000000');
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers correctly', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const revenueInput = screen.getByLabelText(/Текущая выручка/i);
      await user.clear(revenueInput);
      await user.type(revenueInput, '999999999999');
      
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Результаты расчета/i)).toBeInTheDocument();
        // Проверяем, что большие числа отображаются корректно
        expect(screen.queryByText(/NaN/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Infinity/)).not.toBeInTheDocument();
      });
    });

    it('handles zero budget gracefully', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const budgetInput = screen.getByLabelText(/Бюджет на цифровизацию/i);
      await user.clear(budgetInput);
      await user.type(budgetInput, '0');
      
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      // Должна показаться ошибка или минимальный бюджет
      await waitFor(() => {
        expect(screen.queryByText(/минимальный бюджет/i)).toBeInTheDocument();
      });
    });

    it('handles negative numbers by converting to positive', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const revenueInput = screen.getByLabelText(/Текущая выручка/i);
      await user.clear(revenueInput);
      await user.type(revenueInput, '-1000000');
      
      // Проверяем, что отрицательное число преобразовано в положительное
      expect(revenueInput.value).toBe('1000000');
    });
  });

  describe('Performance', () => {
    it('calculates results quickly', async () => {
      const user = userEvent.setup();
      render(<ROICalculator />);
      
      const startTime = performance.now();
      
      const calculateButton = screen.getByText(/Рассчитать выгоду/i);
      await user.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Результаты расчета/i)).toBeInTheDocument();
      });
      
      const endTime = performance.now();
      const calculationTime = endTime - startTime;
      
      // Расчет должен занимать менее 1 секунды
      expect(calculationTime).toBeLessThan(1000);
    });
  });
});