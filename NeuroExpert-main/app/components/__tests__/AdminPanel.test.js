import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminPanel from '../AdminPanel';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('AdminPanel', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('renders login form when not authorized', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<AdminPanel />);
    
    expect(screen.getByPlaceholderText(/Введите пароль/i)).toBeInTheDocument();
    expect(screen.getByText(/Войти/i)).toBeInTheDocument();
  });

  it('makes API call for authorization with correct password', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Mock successful auth response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        token: 'test-jwt-token',
        expiresIn: 86400 
      })
    });
    
    render(<AdminPanel />);
    
    // Type password
    const passwordInput = screen.getByPlaceholderText(/Введите пароль/i);
    await user.type(passwordInput, 'test-password');
    
    // Click login
    const loginButton = screen.getByText(/Войти/i);
    await user.click(loginButton);
    
    // Check if API was called
    expect(fetch).toHaveBeenCalledWith('/api/admin/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: 'test-password' }),
    });
    
    // Wait for auth to complete
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('admin_token', 'test-jwt-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('admin_authorized', 'true');
    });
  });

  it('shows error alert on wrong password', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Mock failed auth response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' })
    });
    
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    
    render(<AdminPanel />);
    
    // Type password and submit
    const passwordInput = screen.getByPlaceholderText(/Введите пароль/i);
    await user.type(passwordInput, 'wrong-password');
    
    const loginButton = screen.getByText(/Войти/i);
    await user.click(loginButton);
    
    // Check if error alert was shown
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Неверный пароль');
    });
    
    alertMock.mockRestore();
  });

  it('checks token validity on mount', async () => {
    localStorageMock.getItem.mockReturnValue('existing-token');
    
    // Mock token validation response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ valid: true, role: 'admin' })
    });
    
    render(<AdminPanel />);
    
    // Check if token validation API was called
    expect(fetch).toHaveBeenCalledWith('/api/admin/auth', {
      headers: {
        'Authorization': 'Bearer existing-token'
      }
    });
  });

  it('logs out and clears storage', async () => {
    const user = userEvent.setup();
    localStorageMock.getItem.mockReturnValue('test-token');
    
    // Mock successful token validation
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ valid: true, role: 'admin' })
    });
    
    render(<AdminPanel />);
    
    // Wait for admin panel to load
    await waitFor(() => {
      expect(screen.getByText(/Выйти/i)).toBeInTheDocument();
    });
    
    // Click logout
    const logoutButton = screen.getByText(/Выйти/i);
    await user.click(logoutButton);
    
    // Check if storage was cleared
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('admin_authorized');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('admin_token');
  });
});