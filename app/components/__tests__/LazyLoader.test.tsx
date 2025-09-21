/**
 * Tests for LazyLoader component
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createLazyComponent, LazyOnScroll, usePrefetch } from '../optimized/LazyLoader';

// Mock component for testing
const MockComponent = ({ text = 'Test Component' }: { text?: string }) => (
  <div data-testid="mock-component">{text}</div>
);

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock requestIdleCallback
window.requestIdleCallback = jest.fn((callback) => {
  setTimeout(callback, 0);
  return 1;
});

describe('LazyLoader', () => {
  describe('createLazyComponent', () => {
    it('should create a lazy component that loads successfully', async () => {
      const LazyMockComponent = createLazyComponent(
        () => Promise.resolve({ default: MockComponent })
      );

      render(<LazyMockComponent text="Lazy Loaded" />);

      // Should show loading initially
      expect(screen.getByText('Загрузка...')).toBeInTheDocument();

      // Should show component after loading
      await waitFor(() => {
        expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        expect(screen.getByText('Lazy Loaded')).toBeInTheDocument();
      });
    });

    it('should show custom loading fallback', async () => {
      const customFallback = <div data-testid="custom-loading">Custom Loading...</div>;
      
      const LazyMockComponent = createLazyComponent(
        () => Promise.resolve({ default: MockComponent }),
        { fallback: customFallback }
      );

      render(<LazyMockComponent />);

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    it('should handle loading errors with error boundary', async () => {
      const LazyMockComponent = createLazyComponent(
        () => Promise.reject(new Error('Failed to load component'))
      );

      render(<LazyMockComponent />);

      await waitFor(() => {
        expect(screen.getByText('Ошибка загрузки компонента')).toBeInTheDocument();
        expect(screen.getByText('Failed to load component')).toBeInTheDocument();
      });
    });

    it('should show custom error fallback', async () => {
      const CustomErrorFallback = ({ error }: { error: Error }) => (
        <div data-testid="custom-error">Custom Error: {error.message}</div>
      );

      const LazyMockComponent = createLazyComponent(
        () => Promise.reject(new Error('Custom error')),
        { errorFallback: CustomErrorFallback }
      );

      render(<LazyMockComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('custom-error')).toBeInTheDocument();
        expect(screen.getByText('Custom Error: Custom error')).toBeInTheDocument();
      });
    });
  });

  describe('usePrefetch', () => {
    it('should prefetch components using requestIdleCallback', () => {
      const mockImportFn1 = jest.fn(() => Promise.resolve({ default: MockComponent }));
      const mockImportFn2 = jest.fn(() => Promise.resolve({ default: MockComponent }));

      const TestComponent = () => {
        const { prefetch } = usePrefetch([mockImportFn1, mockImportFn2]);
        
        React.useEffect(() => {
          prefetch();
        }, [prefetch]);

        return <div>Test</div>;
      };

      render(<TestComponent />);

      expect(window.requestIdleCallback).toHaveBeenCalled();
    });

    it('should fallback to setTimeout when requestIdleCallback is not available', () => {
      // Temporarily remove requestIdleCallback
      const originalRequestIdleCallback = window.requestIdleCallback;
      delete (window as any).requestIdleCallback;

      const mockImportFn = jest.fn(() => Promise.resolve({ default: MockComponent }));
      jest.spyOn(global, 'setTimeout');

      const TestComponent = () => {
        const { prefetch } = usePrefetch([mockImportFn]);
        
        React.useEffect(() => {
          prefetch();
        }, [prefetch]);

        return <div>Test</div>;
      };

      render(<TestComponent />);

      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 100);

      // Restore requestIdleCallback
      window.requestIdleCallback = originalRequestIdleCallback;
    });
  });

  describe('LazyOnScroll', () => {
    it('should render placeholder initially', () => {
      render(
        <LazyOnScroll>
          <div data-testid="scroll-content">Scroll Content</div>
        </LazyOnScroll>
      );

      // Should show placeholder initially
      const placeholder = document.querySelector('.h-32.bg-gray-100.animate-pulse');
      expect(placeholder).toBeInTheDocument();
      
      // Should not show content initially
      expect(screen.queryByTestId('scroll-content')).not.toBeInTheDocument();
    });

    it('should render content when visible', async () => {
      // Mock IntersectionObserver to trigger intersection
      const mockObserver = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };

      const mockIntersectionObserver = jest.fn((callback) => {
        // Simulate intersection
        setTimeout(() => {
          callback([{ isIntersecting: true }]);
        }, 100);
        return mockObserver;
      });

      window.IntersectionObserver = mockIntersectionObserver;

      render(
        <LazyOnScroll threshold={0.5} rootMargin="100px">
          <div data-testid="scroll-content">Scroll Content</div>
        </LazyOnScroll>
      );

      // Should observe element
      expect(mockObserver.observe).toHaveBeenCalled();

      // Should show content after intersection
      await waitFor(() => {
        expect(screen.getByTestId('scroll-content')).toBeInTheDocument();
      });

      // Should disconnect observer after showing content
      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe('Pre-configured lazy components', () => {
    it('should export pre-configured lazy components', () => {
      const { LazyPricingCalculator, LazyAnalyticsDashboard, LazyContactForm } = require('../optimized/LazyLoader');
      
      expect(LazyPricingCalculator).toBeDefined();
      expect(LazyAnalyticsDashboard).toBeDefined();
      expect(LazyContactForm).toBeDefined();
    });
  });
});

// Performance tests
describe('LazyLoader Performance', () => {
  it('should not block main thread during lazy loading', async () => {
    const startTime = performance.now();
    
    const LazyMockComponent = createLazyComponent(
      () => new Promise(resolve => {
        setTimeout(() => resolve({ default: MockComponent }), 100);
      })
    );

    render(<LazyMockComponent />);
    
    const loadingTime = performance.now() - startTime;
    
    // Should not block for more than 50ms
    expect(loadingTime).toBeLessThan(50);
  });

  it('should handle multiple lazy components efficiently', async () => {
    const components = Array.from({ length: 10 }, (_, i) => 
      createLazyComponent(
        () => Promise.resolve({ default: () => <div>Component {i}</div> })
      )
    );

    const startTime = performance.now();
    
    render(
      <div>
        {components.map((Component, i) => (
          <Component key={i} />
        ))}
      </div>
    );

    const renderTime = performance.now() - startTime;
    
    // Should render multiple components efficiently
    expect(renderTime).toBeLessThan(100);
  });
});