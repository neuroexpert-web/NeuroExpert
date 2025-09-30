'use client';

import { useState } from 'react';

export default function SimpleCabinet() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Простая проверка для демо
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="simple-cabinet-container">
        <div className="login-card">
          <div className="login-header">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8a2be2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2>Личный кабинет</h2>
            <p>Управляйте вашим бизнесом с помощью AI</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            <button type="submit" className="login-button">
              Войти в кабинет
            </button>
          </form>
          
          <div className="login-footer">
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
          .simple-cabinet-container {
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0a0f;
            padding: 20px;
          }

          .login-card {
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

          .login-header {
            text-align: center;
            margin-bottom: 32px;
          }

          .login-header svg {
            margin-bottom: 16px;
          }

          .login-header h2 {
            font-size: 28px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
          }

          .login-header p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 16px;
          }

          .login-form {
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

          .login-button {
            height: 48px;
            background: #8a2be2;
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 8px;
          }

          .login-button:hover {
            background: #7b1fa2;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
          }

          .login-footer {
            margin-top: 32px;
            text-align: center;
          }

          .login-footer p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            margin-bottom: 16px;
          }

          .login-footer a {
            color: #8a2be2;
            text-decoration: none;
          }

          .login-footer a:hover {
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
          }
        `}</style>
      </div>
    );
  }

  // Простой дашборд после входа
  return (
    <div className="cabinet-dashboard">
      <div className="dashboard-header">
        <h1>Добро пожаловать в личный кабинет!</h1>
        <p>Email: {email}</p>
        <button onClick={() => setIsLoggedIn(false)} className="logout-button">
          Выйти
        </button>
      </div>

      <div className="dashboard-content">
        <div className="widget-grid">
          <div className="dashboard-widget">
            <h3>Выручка за месяц</h3>
            <div className="widget-value">₽12.4M</div>
            <div className="widget-change positive">+24%</div>
          </div>
          
          <div className="dashboard-widget">
            <h3>Активные клиенты</h3>
            <div className="widget-value">3,847</div>
            <div className="widget-change positive">+12%</div>
          </div>
          
          <div className="dashboard-widget">
            <h3>Конверсия</h3>
            <div className="widget-value">4.2%</div>
            <div className="widget-change negative">-5%</div>
          </div>
          
          <div className="dashboard-widget">
            <h3>Средний чек</h3>
            <div className="widget-value">₽3,220</div>
            <div className="widget-change positive">+8%</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cabinet-dashboard {
          width: 100%;
          height: 100vh;
          background: #0a0a0f;
          color: white;
          padding: 40px;
          overflow-y: auto;
        }

        .dashboard-header {
          margin-bottom: 40px;
        }

        .dashboard-header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 20px;
        }

        .logout-button {
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-button:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .widget-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .dashboard-widget {
          background: rgba(30, 30, 45, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .dashboard-widget:hover {
          background: rgba(30, 30, 45, 0.5);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .dashboard-widget h3 {
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
        }

        .widget-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .widget-change {
          font-size: 14px;
          font-weight: 500;
        }

        .widget-change.positive {
          color: #10b981;
        }

        .widget-change.negative {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}