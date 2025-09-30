import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('shows login form when not authorized', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to admin panel
    const adminLink = page.getByText(/админ|admin/i);
    await adminLink.click();
    
    // Should show password input
    const passwordInput = page.getByPlaceholder(/введите пароль/i);
    await expect(passwordInput).toBeVisible();
    
    // Should have login button
    const loginButton = page.getByRole('button', { name: /войти/i });
    await expect(loginButton).toBeVisible();
  });

  test('rejects invalid password', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to admin panel
    const adminLink = page.getByText(/админ|admin/i);
    await adminLink.click();
    
    // Enter wrong password
    const passwordInput = page.getByPlaceholder(/введите пароль/i);
    await passwordInput.fill('wrong-password');
    
    // Click login
    const loginButton = page.getByRole('button', { name: /войти/i });
    await loginButton.click();
    
    // Should show error
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Неверный пароль');
      await dialog.accept();
    });
  });

  test('successful login with valid credentials', async ({ page }) => {
    // Mock the API response for successful auth
    await page.route('/api/admin/auth', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'test-jwt-token',
            expiresIn: 86400
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            valid: true,
            role: 'admin'
          })
        });
      }
    });

    await page.goto('/');
    
    // Navigate to admin panel
    const adminLink = page.getByText(/админ|admin/i);
    await adminLink.click();
    
    // Enter password
    const passwordInput = page.getByPlaceholder(/введите пароль/i);
    await passwordInput.fill('test-password');
    
    // Click login
    const loginButton = page.getByRole('button', { name: /войти/i });
    await loginButton.click();
    
    // Should show admin interface
    await expect(page.getByText(/панель администратора/i)).toBeVisible();
    
    // Should have logout button
    const logoutButton = page.getByRole('button', { name: /выйти/i });
    await expect(logoutButton).toBeVisible();
  });

  test('logout functionality', async ({ page }) => {
    // Setup authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
      localStorage.setItem('admin_authorized', 'true');
    });

    // Mock token validation
    await page.route('/api/admin/auth', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          valid: true,
          role: 'admin'
        })
      });
    });

    await page.goto('/');
    
    // Navigate to admin panel
    const adminLink = page.getByText(/админ|admin/i);
    await adminLink.click();
    
    // Should be logged in
    await expect(page.getByText(/панель администратора/i)).toBeVisible();
    
    // Click logout
    const logoutButton = page.getByRole('button', { name: /выйти/i });
    await logoutButton.click();
    
    // Should show login form again
    const passwordInput = page.getByPlaceholder(/введите пароль/i);
    await expect(passwordInput).toBeVisible();
  });

  test('persists login state across page reloads', async ({ page }) => {
    // Setup authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('admin_token', 'test-token');
      localStorage.setItem('admin_authorized', 'true');
    });

    // Mock token validation
    await page.route('/api/admin/auth', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          valid: true,
          role: 'admin'
        })
      });
    });

    await page.goto('/');
    
    // Navigate to admin panel
    const adminLink = page.getByText(/админ|admin/i);
    await adminLink.click();
    
    // Should be logged in
    await expect(page.getByText(/панель администратора/i)).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Should still be logged in
    await expect(page.getByText(/панель администратора/i)).toBeVisible();
  });
});