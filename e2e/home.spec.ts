import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/NeuroExpert/);
  });

  test('has main heading', async ({ page }) => {
    const heading = page.getByRole('heading', { 
      name: /AI Audit Platform|NeuroExpert/i 
    });
    await expect(heading).toBeVisible();
  });

  test('ROI Calculator is functional', async ({ page }) => {
    // Navigate to calculator section
    const calculatorSection = page.locator('#calculator');
    await calculatorSection.scrollIntoViewIfNeeded();
    
    // Should have calculate button
    const calculateButton = page.getByRole('button', { 
      name: /рассчитать выгоду/i 
    });
    await expect(calculateButton).toBeVisible();
    
    // Click calculate
    await calculateButton.click();
    
    // Should show results
    await expect(page.getByText(/результаты расчета/i)).toBeVisible();
  });

  test('AI Assistant opens and responds', async ({ page }) => {
    // Find and click AI assistant button
    const aiButton = page.getByRole('button', { 
      name: /ai.*assistant|помощник/i 
    });
    await aiButton.click();
    
    // Chat should open
    const chatInput = page.getByPlaceholder(/задайте вопрос/i);
    await expect(chatInput).toBeVisible();
    
    // Type a question
    await chatInput.fill('Что такое NeuroExpert?');
    
    // Send message
    const sendButton = page.getByRole('button', { name: /отправить/i });
    await sendButton.click();
    
    // Should show response (with timeout for API)
    await expect(page.locator('.ai-message')).toBeVisible({ timeout: 10000 });
  });

  test('Navigation menu works', async ({ page }) => {
    // Check main navigation items
    const navItems = [
      'Калькулятор ROI',
      'AI Ассистент',
      'FAQ'
    ];
    
    for (const item of navItems) {
      const navLink = page.getByText(item);
      await expect(navLink).toBeVisible();
    }
  });

  test('Contact form validation', async ({ page }) => {
    // Find contact form
    const contactForm = page.locator('.contact-form').first();
    await contactForm.scrollIntoViewIfNeeded();
    
    // Try to submit empty form
    const submitButton = contactForm.getByRole('button', { 
      name: /отправить/i 
    });
    await submitButton.click();
    
    // Should show validation errors
    await expect(page.getByText(/обязательное поле|required/i)).toBeVisible();
  });

  test('Responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile menu should be visible
    const mobileMenuButton = page.getByRole('button', { 
      name: /menu|меню/i 
    });
    
    // Some elements should adapt
    const hero = page.locator('.hero-section');
    await expect(hero).toBeVisible();
  });
});