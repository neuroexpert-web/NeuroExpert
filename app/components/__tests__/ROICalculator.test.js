import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ROICalculator from '../ROICalculator';

describe('ROICalculator', () => {
  it('renders calculator title', () => {
    render(<ROICalculator />);
    // The title is split into parts, so we check for the heading
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('ROI')).toBeInTheDocument();
  });

  it('calculates ROI when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ROICalculator />);

    // Find and click calculate button
    const calculateButton = screen.getByText(/Рассчитать выгоду/i);
    expect(calculateButton).toBeInTheDocument();

    await user.click(calculateButton);

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText(/Результаты расчета/i)).toBeInTheDocument();
    });
  });

  it('allows changing business size', async () => {
    const user = userEvent.setup();
    render(<ROICalculator />);

    // Find business size select
    const businessSizeSelect = screen.getByLabelText(/Размер вашего бизнеса/i);

    // Change to medium
    await user.selectOptions(businessSizeSelect, 'medium');

    expect(businessSizeSelect.value).toBe('medium');
  });

  it('allows changing revenue input', async () => {
    const user = userEvent.setup();
    render(<ROICalculator />);

    // Find revenue input
    const revenueInput = screen.getByLabelText(/Текущая выручка/i);

    // Clear and type new value
    await user.clear(revenueInput);
    await user.type(revenueInput, '5000000');

    expect(revenueInput.value).toBe('5000000');
  });

  it('shows back button after calculation', async () => {
    const user = userEvent.setup();
    render(<ROICalculator />);

    // Calculate ROI
    const calculateButton = screen.getByText(/Рассчитать выгоду/i);
    await user.click(calculateButton);

    // Wait for results and find back button
    await waitFor(() => {
      const backButton = screen.getByText(/Назад/i);
      expect(backButton).toBeInTheDocument();
    });

    // Click back button
    const backButton = screen.getByText(/Назад/i);
    await user.click(backButton);

    // Check if form is shown again
    expect(screen.getByText(/Рассчитать выгоду/i)).toBeInTheDocument();
  });
});
