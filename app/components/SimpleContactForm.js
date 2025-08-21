'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SimpleContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false, message: '' });

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-neuroexpert-csrf': '1',
        },
        body: JSON.stringify({
          ...formData,
          email: '', // Пустое значение для совместимости с API
          company: '',
          message: 'Быстрая заявка',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: 'Спасибо! Мы перезвоним вам в течение 15 минут.',
        });
        setFormData({ name: '', phone: '' });

        // Сбрасываем статус через 5 секунд
        setTimeout(() => {
          setStatus({ loading: false, success: false, error: false, message: '' });
        }, 5000);
      } else {
        throw new Error(result.error || 'Ошибка отправки формы');
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Ошибка отправки. Попробуйте позже.',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Форматирование телефона
  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Если пользователь стирает символы, не форматируем
    if (value.length < formData.phone.length) {
      setFormData((prev) => ({ ...prev, phone: value }));
      return;
    }
    // Форматируем только при вводе
    const formatted = formatPhone(value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  return (
    <div className="simple-contact-form">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {status.success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="success-message"
          >
            <div className="success-icon">✅</div>
            <h3>Заявка отправлена!</h3>
            <p>{status.message}</p>
          </motion.div>
        ) : (
          <>
            <div className="form-header">
              <h3>Оставьте заявку</h3>
              <p>Мы перезвоним в течение 15 минут</p>
            </div>

            <div className="form-fields">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ваше имя"
                  required
                  className="form-input"
                  disabled={status.loading}
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 123-45-67"
                  required
                  className="form-input"
                  disabled={status.loading}
                  pattern="[\+]?[0-9\s\-\(\)]+"
                />
              </div>
            </div>

            {status.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {status.message}
              </motion.div>
            )}

            <button type="submit" className="submit-button" disabled={status.loading}>
              {status.loading ? (
                <span className="loading">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </span>
              ) : (
                <>
                  <span>Отправить заявку</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>

            <div className="form-footer">
              <p>Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
            </div>
          </>
        )}
      </motion.form>

      <style jsx>{`
        .simple-contact-form {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .form-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 8px 0;
        }

        .form-header p {
          color: var(--muted);
          font-size: 16px;
          margin: 0;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          color: var(--text);
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--gold);
          box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-button {
          width: 100%;
          padding: 18px 32px;
          font-size: 18px;
          font-weight: 600;
          color: var(--noir-900);
          background: linear-gradient(135deg, var(--gold) 0%, #ffed4e 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 215, 0, 0.4);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-icon {
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .submit-button:hover:not(:disabled) .button-icon {
          transform: translateX(4px);
        }

        .loading {
          display: flex;
          gap: 4px;
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          background: var(--noir-900);
          border-radius: 50%;
          animation: loading-bounce 1.4s infinite ease-in-out both;
        }

        .loading-dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .loading-dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes loading-bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .success-message {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .success-message h3 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 12px 0;
        }

        .success-message p {
          color: var(--muted);
          font-size: 16px;
          margin: 0;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .form-footer {
          text-align: center;
          margin-top: 16px;
        }

        .form-footer p {
          color: var(--muted);
          font-size: 12px;
          margin: 0;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .simple-contact-form {
            max-width: 100%;
          }

          .form-input {
            font-size: 16px; /* Предотвращаем зум на iOS */
          }

          .submit-button {
            font-size: 16px;
            padding: 16px 24px;
          }
        }
      `}</style>
    </div>
  );
}
