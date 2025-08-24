// Админ-панель для управления контентом NeuroExpert v3.0
'use client';
import { useState, useEffect } from 'react';

function AdminPanel() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  const [content, setContent] = useState({
    faq: [],
    services: [],
    courses: [],
    testimonials: []
  });

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const response = await fetch('/api/admin/auth', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.valid) {
            setIsAuthorized(true);
            loadContent();
          } else {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_authorized');
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthorized(true);
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_authorized', 'true');
        loadContent();
      } else {
        alert('Неверный пароль');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Ошибка авторизации. Попробуйте позже.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('admin_authorized');
    localStorage.removeItem('admin_token');
    setPassword('');
  };

  const loadContent = () => {
    // Загружаем контент из localStorage (в реальном проекте - из API)
    const savedContent = localStorage.getItem('admin_content');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    } else {
      // Инициализируем начальный контент
      setContent({
        faq: [
          {
            id: 1,
            category: 'Общие',
            question: 'Что такое цифровизация бизнеса?',
            answer: 'Цифровизация — это процесс интеграции цифровых технологий во все сферы бизнеса.',
            popularity: 45,
            isActive: true
          },
          {
            id: 2,
            category: 'Малый бизнес',
            question: 'Сколько стоит базовая автоматизация?',
            answer: 'Базовая автоматизация для малого бизнеса начинается от 50,000₽.',
            popularity: 38,
            isActive: true
          }
        ],
        services: [
          {
            id: 1,
            title: 'Стартовый пакет',
            category: 'Малый бизнес',
            price: 150000,
            description: 'CRM + базовая автоматизация',
            isActive: true,
            features: ['CRM-система', 'Автоматизация продаж', 'Базовая аналитика']
          }
        ],
        courses: [
          {
            id: 1,
            title: 'Основы цифровизации',
            category: 'Начальный',
            duration: '5 мин',
            content: 'Изучите базовые принципы цифровизации',
            isActive: true
          }
        ],
        testimonials: [
          {
            id: 1,
            name: 'Алексей Иванов',
            company: 'ТехноСтарт',
            text: 'Отличное решение для автоматизации!',
            rating: 5,
            isActive: true
          }
        ]
      });
    }
  };

  const saveContent = () => {
    localStorage.setItem('admin_content', JSON.stringify(content));
    alert('Контент сохранен!');
  };

  const addItem = (type) => {
    const newItem = {
      id: Date.now(),
      isActive: true,
      ...getDefaultItem(type)
    };
    
    setContent(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }));
  };

  const getDefaultItem = (type) => {
    switch (type) {
      case 'faq':
        return {
          category: 'Общие',
          question: 'Новый вопрос',
          answer: 'Новый ответ',
          popularity: 0
        };
      case 'services':
        return {
          title: 'Новая услуга',
          category: 'Малый бизнес',
          price: 0,
          description: 'Описание услуги',
          features: []
        };
      case 'courses':
        return {
          title: 'Новый курс',
          category: 'Начальный',
          duration: '5 мин',
          content: 'Содержание курса'
        };
      case 'testimonials':
        return {
          name: 'Новый клиент',
          company: 'Компания',
          text: 'Отзыв',
          rating: 5
        };
      default:
        return {};
    }
  };

  const updateItem = (type, id, field, value) => {
    setContent(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const deleteItem = (type, id) => {
    if (confirm('Удалить этот элемент?')) {
      setContent(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      }));
    }
  };

  const exportContent = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'neuroexpert_content.json';
    link.click();
  };

  const importContent = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setContent(imported);
          alert('Контент импортирован!');
        } catch (error) {
          alert('Ошибка импорта файла');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="admin-panel">
        <div className="auth-form">
          <h2>🔐 Админ-панель NeuroExpert</h2>
          <input
            type="password"
            className="password-input"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button className="login-btn" onClick={handleLogin}>Войти</button>
        </div>


      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>
          <span>⚙️</span>
          <span>Панель управления NeuroExpert</span>
        </h1>
        <div className="admin-actions">
          <button onClick={exportContent} className="logout-btn">
            📤 Экспорт
          </button>
          <label className="logout-btn" style={{ cursor: 'pointer' }}>
            📥 Импорт
            <input
              type="file"
              accept=".json"
              onChange={importContent}
              style={{ display: 'none' }}
            />
          </label>
          <button onClick={saveContent} className="save-btn">
            💾 Сохранить
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Выход
          </button>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-tabs">
          {[
            { id: 'faq', label: '❓ FAQ', count: content.faq.length },
            { id: 'services', label: '🛍️ Услуги', count: content.services.length },
            { id: 'courses', label: '📚 Курсы', count: content.courses.length },
            { id: 'testimonials', label: '💬 Отзывы', count: content.testimonials.length }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="admin-content">
        <div className="content-header">
          <h2>
            {activeTab === 'faq' && '❓ Управление FAQ'}
            {activeTab === 'services' && '🛍️ Управление услугами'}
            {activeTab === 'courses' && '📚 Управление курсами'}
            {activeTab === 'testimonials' && '💬 Управление отзывами'}
          </h2>
          <button 
            onClick={() => addItem(activeTab)}
            className="add-btn"
          >
            ➕ Добавить
          </button>
        </div>

        <div className="items-list">
          {content[activeTab].map(item => (
            <div key={item.id} className="item-card">
              <div className="item-header">
                <span className="item-id">#{item.id}</span>
                <div className="item-controls">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) => updateItem(activeTab, item.id, 'isActive', e.target.checked)}
                    />
                    Активно
                  </label>
                  <button 
                    onClick={() => deleteItem(activeTab, item.id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {activeTab === 'faq' && (
                <div className="faq-fields">
                  <input
                    placeholder="Категория"
                    value={item.category}
                    onChange={(e) => updateItem(activeTab, item.id, 'category', e.target.value)}
                  />
                  <textarea
                    placeholder="Вопрос"
                    value={item.question}
                    onChange={(e) => updateItem(activeTab, item.id, 'question', e.target.value)}
                    rows={2}
                  />
                  <textarea
                    placeholder="Ответ"
                    value={item.answer}
                    onChange={(e) => updateItem(activeTab, item.id, 'answer', e.target.value)}
                    rows={3}
                  />
                  <input
                    type="number"
                    placeholder="Популярность"
                    value={item.popularity}
                    onChange={(e) => updateItem(activeTab, item.id, 'popularity', parseInt(e.target.value))}
                  />
                </div>
              )}

              {activeTab === 'services' && (
                <div className="service-fields">
                  <input
                    placeholder="Название"
                    value={item.title}
                    onChange={(e) => updateItem(activeTab, item.id, 'title', e.target.value)}
                  />
                  <input
                    placeholder="Категория"
                    value={item.category}
                    onChange={(e) => updateItem(activeTab, item.id, 'category', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Цена"
                    value={item.price}
                    onChange={(e) => updateItem(activeTab, item.id, 'price', parseInt(e.target.value))}
                  />
                  <textarea
                    placeholder="Описание"
                    value={item.description}
                    onChange={(e) => updateItem(activeTab, item.id, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="course-fields">
                  <input
                    placeholder="Название курса"
                    value={item.title}
                    onChange={(e) => updateItem(activeTab, item.id, 'title', e.target.value)}
                  />
                  <input
                    placeholder="Категория"
                    value={item.category}
                    onChange={(e) => updateItem(activeTab, item.id, 'category', e.target.value)}
                  />
                  <input
                    placeholder="Длительность"
                    value={item.duration}
                    onChange={(e) => updateItem(activeTab, item.id, 'duration', e.target.value)}
                  />
                  <textarea
                    placeholder="Содержание"
                    value={item.content}
                    onChange={(e) => updateItem(activeTab, item.id, 'content', e.target.value)}
                    rows={4}
                  />
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="testimonial-fields">
                  <input
                    placeholder="Имя клиента"
                    value={item.name}
                    onChange={(e) => updateItem(activeTab, item.id, 'name', e.target.value)}
                  />
                  <input
                    placeholder="Компания"
                    value={item.company}
                    onChange={(e) => updateItem(activeTab, item.id, 'company', e.target.value)}
                  />
                  <textarea
                    placeholder="Текст отзыва"
                    value={item.text}
                    onChange={(e) => updateItem(activeTab, item.id, 'text', e.target.value)}
                    rows={3}
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Рейтинг"
                    value={item.rating}
                    onChange={(e) => updateItem(activeTab, item.id, 'rating', parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>

      <style jsx>{`
        .admin-panel {
          width: 100%;
          min-height: 100vh;
          background: #0a0a0a;
          color: white;
          padding: 2rem 0;
        }

        .auth-form {
          max-width: 400px;
          margin: 100px auto;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .auth-form h2 {
          text-align: center;
          margin-bottom: 24px;
          font-size: 2rem;
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .password-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 16px;
          margin-bottom: 16px;
          transition: all 0.3s ease;
        }

        .password-input:focus {
          outline: none;
          border-color: rgba(153, 69, 255, 0.5);
          box-shadow: 0 0 0 3px rgba(153, 69, 255, 0.1);
          background: rgba(255, 255, 255, 0.08);
        }

        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(153, 69, 255, 0.3);
        }

        .admin-header {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(153, 69, 255, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 2rem;
        }

        .admin-header h1 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .admin-header h1 span {
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .admin-actions {
          display: flex;
          gap: 12px;
        }

        .admin-actions button,
        .admin-actions label {
          padding: 8px 16px;
          border-radius: 6px;
          border: 1px solid var(--accent);
          background: transparent;
          color: var(--accent);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .admin-actions button:hover,
        .admin-actions label:hover {
          background: var(--accent);
          color: #03101a;
        }

        .save-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
        }

        .admin-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0;
        }

        .tab-btn {
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          border: none;
          padding: 12px 24px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: transparent;
          transition: background 0.3s ease;
        }

        .tab-btn:hover {
          color: rgba(255, 255, 255, 0.9);
        }

        .tab-btn.active {
          color: white;
        }

        .tab-btn.active::after {
          background: linear-gradient(90deg, #9945FF 0%, #00D4FF 100%);
        }

        .admin-content {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .content-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
        }

        .add-btn {
          background: linear-gradient(135deg, #9945FF 0%, #00D4FF 100%);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(153, 69, 255, 0.3);
        }

        .items-list {
          display: grid;
          gap: 16px;
        }

        .item-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .item-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .item-id {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          font-family: monospace;
        }

        .item-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .toggle:hover {
          color: white;
        }

        .delete-btn {
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .delete-btn:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .faq-fields,
        .service-fields,
        .course-fields,
        .testimonial-fields {
          display: grid;
          gap: 12px;
        }

        .faq-fields input,
        .service-fields input,
        .course-fields input,
        .testimonial-fields input,
        .faq-fields textarea,
        .service-fields textarea,
        .course-fields textarea,
        .testimonial-fields textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 14px;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .faq-fields input::placeholder,
        .service-fields input::placeholder,
        .course-fields input::placeholder,
        .testimonial-fields input::placeholder,
        .faq-fields textarea::placeholder,
        .service-fields textarea::placeholder,
        .course-fields textarea::placeholder,
        .testimonial-fields textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .faq-fields input:focus,
        .service-fields input:focus,
        .course-fields input:focus,
        .testimonial-fields input:focus,
        .faq-fields textarea:focus,
        .service-fields textarea:focus,
        .course-fields textarea:focus,
        .testimonial-fields textarea:focus {
          outline: none;
          border-color: rgba(153, 69, 255, 0.5);
          box-shadow: 0 0 0 3px rgba(153, 69, 255, 0.1);
          background: rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 16px;
            padding: 1.5rem;
          }

          .admin-container {
            padding: 0 1.5rem;
          }

          .admin-actions {
            flex-wrap: wrap;
            width: 100%;
          }

          .save-btn,
          .logout-btn {
            flex: 1;
          }

          .admin-tabs {
            overflow-x: auto;
            gap: 0.5rem;
          }

          .tab-btn {
            padding: 10px 16px;
            white-space: nowrap;
          }

          .content-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .admin-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminPanel;
