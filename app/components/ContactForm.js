'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false, message: '' });

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-neuroexpert-csrf': '1'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          loading: false,
          success: true,
          error: false,
          message: 'Спасибо! Мы свяжемся с вами в ближайшее время.'
        });
        setFormData({ name: '', phone: '' });
      } else {
        throw new Error(result.error || 'Ошибка отправки формы');
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Ошибка отправки. Попробуйте позже.'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="contact-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="contact-wrapper"
        >
          <div className="contact-header">
            <h2 className="contact-title">
              <span className="gradient-text">Начните цифровизацию</span> прямо сейчас
            </h2>
            <p className="contact-subtitle">
              Оставьте заявку и мы свяжемся с вами в течение 15 минут
            </p>
          </div>

          <form onSubmit={handleSubmit} className="simple-form">
            <div className="form-row">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ваше имя"
                className="form-input"
              />
              
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+7 (999) 123-45-67"
                className="form-input"
              />
            </div>

            <motion.button
              type="submit"
              className="submit-button"
              disabled={status.loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status.loading ? (
                <span>Отправка...</span>
              ) : (
                <span>Отправить заявку</span>
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {(status.success || status.error) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`status-message ${status.success ? 'success' : 'error'}`}
              >
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="trust-badges">
            <div className="badge">✓ Бесплатная консультация</div>
            <div className="badge">✓ Ответ в течение 15 минут</div>
            <div className="badge">✓ Без спама</div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .contact-section {
          background: #0a0a0a;
          color: white;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }

        .container {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .contact-wrapper {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
          text-align: center;
          max-width: 600px;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .contact-header {
          margin-bottom: 2rem;
        }

        .contact-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .gradient-text {
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .contact-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .simple-form {
          margin: 2rem 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .form-input:focus {
          border-color: rgba(153, 69, 255, 0.5);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(153, 69, 255, 0.1);
        }

        .submit-button {
          width: 100%;
          padding: 1.25rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(153, 69, 255, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .status-message {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 500;
        }

        .status-message.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        .status-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .badge {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 768px) {
          .contact-wrapper {
            padding: 2rem 1.5rem;
          }

          .contact-title {
            font-size: 2rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .trust-badges {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}