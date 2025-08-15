'use client';
import { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: ''
  });
  
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPhone = (phone) => {
    // Удаляем все нецифровые символы
    const cleaned = phone.replace(/\D/g, '');
    // Форматируем номер
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return phone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.name || !formData.phone) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Пожалуйста, заполните обязательные поля'
      });
      return;
    }

    setStatus({ loading: true, success: false, error: false, message: '' });

    try {
      setStatus({ loading: true, success: false, error: false, message: '' });
      
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Отправляем уведомление в Telegram
        await fetch('/.netlify/functions/telegram-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'contact_form',
            data: {
              ...formData,
              phone: formatPhone(formData.phone)
            }
          })
        });

        setStatus({
          loading: false,
          success: true,
          error: false,
          message: 'Спасибо! Мы свяжемся с вами в течение 15 минут.'
        });

        // Очищаем форму
        setFormData({
          name: '',
          phone: '',
          email: '',
          company: '',
          message: ''
        });

        // Отправляем событие в аналитику
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'form_submit', {
            form_type: 'contact',
            company: formData.company || 'not_specified'
          });
        }
      } else {
        throw new Error(result.error || 'Ошибка отправки');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам.'
      });
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="section-header">
          <h2>Готовы начать <span className="gradient-text">цифровизацию</span>?</h2>
          <p>Оставьте заявку и получите бесплатную консультацию</p>
        </div>

        <div className="contact-content">
          <div className="contact-benefits">
            <h3>Что вы получите:</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">📊</span>
                <div>
                  <strong>Аудит текущих процессов</strong>
                  <p>Анализ узких мест и точек роста</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">💡</span>
                <div>
                  <strong>План цифровизации</strong>
                  <p>Пошаговая стратегия внедрения</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">💰</span>
                <div>
                  <strong>Расчет ROI</strong>
                  <p>Точные цифры окупаемости</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">🎯</span>
                <div>
                  <strong>Демо платформы</strong>
                  <p>Покажем возможности на ваших данных</p>
                </div>
              </li>
            </ul>

            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-details">
                  <span className="contact-label">Телефон</span>
                  <a href="tel:+79040476383" className="contact-value">+7 (904) 047-63-83</a>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <a href="mailto:aineuroexpert@gmail.com" className="contact-value">aineuroexpert@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ivan@company.ru"
                />
              </div>
              <div className="form-group">
                <label htmlFor="company">Компания</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="ООО Рога и копыта"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Сообщение</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Расскажите о вашем проекте..."
                rows="4"
              />
            </div>

            <button 
              type="submit" 
              className={`btn-primary submit-btn ${status.loading ? 'loading' : ''}`}
              disabled={status.loading}
            >
              {status.loading ? (
                <>
                  <span className="spinner"></span>
                  Отправляем...
                </>
              ) : (
                <>
                  📤 Отправить заявку
                </>
              )}
            </button>

            {status.message && (
              <div className={`form-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? '✅' : '⚠️'} {status.message}
              </div>
            )}

            <p className="form-disclaimer">
              Нажимая кнопку, вы соглашаетесь с <a href="/privacy">политикой конфиденциальности</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}