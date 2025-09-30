'use client';

import { useState } from 'react';

export default function CabinetSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация входа
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="cabinet-auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2>Вход в личный кабинет</h2>
            <p>Управляйте вашим бизнесом с помощью AI</p>
          </div>
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Запомнить меня</span>
              </label>
              <a href="#" className="forgot-password">Забыли пароль?</a>
            </div>
            
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
                    <circle cx="12" cy="12" r="10" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" />
                  </svg>
                  Вход...
                </>
              ) : (
                'Войти в кабинет'
              )}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Нет аккаунта? <a href="#">Зарегистрироваться</a></p>
            <div className="demo-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Для демо входа используйте любые данные</span>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .cabinet-auth-container {
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0a0f;
            padding: 20px;
          }
          
          .auth-card {
            width: 100%;
            max-width: 420px;
            background: rgba(30, 30, 45, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          }
          
          .auth-header {
            text-align: center;
            margin-bottom: 32px;
          }
          
          .auth-header svg {
            color: #8a2be2;
            margin-bottom: 16px;
          }
          
          .auth-header h2 {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
          }
          
          .auth-header p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 16px;
          }
          
          .auth-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .form-group label {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
          }
          
          .form-group input {
            height: 48px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0 16px;
            color: white;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          
          .form-group input:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.08);
            border-color: #8a2be2;
            box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.1);
          }
          
          .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }
          
          .form-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 8px 0;
          }
          
          .remember-me {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
          }
          
          .remember-me input {
            width: 18px;
            height: 18px;
            cursor: pointer;
          }
          
          .forgot-password {
            color: #8a2be2;
            text-decoration: none;
            font-size: 14px;
            transition: opacity 0.3s ease;
          }
          
          .forgot-password:hover {
            opacity: 0.8;
          }
          
          .auth-submit {
            height: 48px;
            background: #8a2be2;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 8px;
          }
          
          .auth-submit:hover:not(:disabled) {
            background: #7b1fa2;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
          }
          
          .auth-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          .spinner {
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .auth-footer {
            margin-top: 32px;
            text-align: center;
          }
          
          .auth-footer p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            margin-bottom: 16px;
          }
          
          .auth-footer a {
            color: #8a2be2;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s ease;
          }
          
          .auth-footer a:hover {
            opacity: 0.8;
          }
          
          .demo-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            background: rgba(138, 43, 226, 0.1);
            border: 1px solid rgba(138, 43, 226, 0.2);
            border-radius: 8px;
            color: #8a2be2;
            font-size: 13px;
            margin-top: 16px;
          }
        `}</style>
      </div>
    );
  }

  // Если пользователь аутентифицирован, показываем кабинет
  return (
    <div className="cabinet-workspace">
      <p style={{ textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.6)' }}>
        Личный кабинет загружается...
      </p>
    </div>
  );
}