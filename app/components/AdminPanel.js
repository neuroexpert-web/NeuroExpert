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
    testimonials: [],
  });

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          const response = await fetch('/api/admin/auth', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
            answer:
              'Цифровизация — это процесс интеграции цифровых технологий во все сферы бизнеса.',
            popularity: 45,
            isActive: true,
          },
          {
            id: 2,
            category: 'Малый бизнес',
            question: 'Сколько стоит базовая автоматизация?',
            answer: 'Базовая автоматизация для малого бизнеса начинается от 50,000₽.',
            popularity: 38,
            isActive: true,
          },
        ],
        services: [
          {
            id: 1,
            title: 'Стартовый пакет',
            category: 'Малый бизнес',
            price: 150000,
            description: 'CRM + базовая автоматизация',
            isActive: true,
            features: ['CRM-система', 'Автоматизация продаж', 'Базовая аналитика'],
          },
        ],
        courses: [
          {
            id: 1,
            title: 'Основы цифровизации',
            category: 'Начальный',
            duration: '5 мин',
            content: 'Изучите базовые принципы цифровизации',
            isActive: true,
          },
        ],
        testimonials: [
          {
            id: 1,
            name: 'Алексей Иванов',
            company: 'ТехноСтарт',
            text: 'Отличное решение для автоматизации!',
            rating: 5,
            isActive: true,
          },
        ],
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
      ...getDefaultItem(type),
    };

    setContent((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }));
  };

  const getDefaultItem = (type) => {
    switch (type) {
      case 'faq':
        return {
          category: 'Общие',
          question: 'Новый вопрос',
          answer: 'Новый ответ',
          popularity: 0,
        };
      case 'services':
        return {
          title: 'Новая услуга',
          category: 'Малый бизнес',
          price: 0,
          description: 'Описание услуги',
          features: [],
        };
      case 'courses':
        return {
          title: 'Новый курс',
          category: 'Начальный',
          duration: '5 мин',
          content: 'Содержание курса',
        };
      case 'testimonials':
        return {
          name: 'Новый клиент',
          company: 'Компания',
          text: 'Отзыв',
          rating: 5,
        };
      default:
        return {};
    }
  };

  const updateItem = (type, id, field, value) => {
    setContent((prev) => ({
      ...prev,
      [type]: prev[type].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const deleteItem = (type, id) => {
    if (confirm('Удалить этот элемент?')) {
      setContent((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== id),
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
      <div className="admin-login">
        <div className="login-form">
          <h2>🔐 Админ-панель NeuroExpert</h2>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Войти</button>
        </div>

        <style jsx>{`
          .admin-login {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
          }

          .login-form {
            background: var(--card);
            padding: 40px;
            border-radius: 16px;
            border: 2px solid var(--accent);
            text-align: center;
            min-width: 300px;
          }

          .login-form h2 {
            margin: 0 0 24px 0;
            color: var(--text);
          }

          .login-form input {
            width: 100%;
            padding: 12px;
            margin-bottom: 16px;
            border: 1px solid rgba(125, 211, 252, 0.3);
            border-radius: 8px;
            background: rgba(125, 211, 252, 0.05);
            color: var(--text);
            font-size: 16px;
          }

          .login-form button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--accent), var(--accent-hover));
            color: #03101a;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
          }

          .login-form button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(125, 211, 252, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>⚙️ Админ-панель NeuroExpert</h1>
        <div className="admin-actions">
          <button onClick={exportContent} className="export-btn">
            📤 Экспорт
          </button>
          <label className="import-btn">
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

      <div className="admin-tabs">
        {[
          { id: 'faq', label: '❓ FAQ', count: content.faq.length },
          { id: 'services', label: '🛍️ Услуги', count: content.services.length },
          { id: 'courses', label: '📚 Курсы', count: content.courses.length },
          { id: 'testimonials', label: '💬 Отзывы', count: content.testimonials.length },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
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
          <button onClick={() => addItem(activeTab)} className="add-btn">
            ➕ Добавить
          </button>
        </div>

        <div className="items-list">
          {content[activeTab].map((item) => (
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
                  <button onClick={() => deleteItem(activeTab, item.id)} className="delete-btn">
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
                    onChange={(e) =>
                      updateItem(activeTab, item.id, 'popularity', parseInt(e.target.value))
                    }
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
                    onChange={(e) =>
                      updateItem(activeTab, item.id, 'price', parseInt(e.target.value))
                    }
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
                    onChange={(e) =>
                      updateItem(activeTab, item.id, 'rating', parseInt(e.target.value))
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .admin-panel {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: var(--background);
          z-index: 2000;
          overflow-y: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid var(--accent);
          background: var(--card);
        }

        .admin-header h1 {
          margin: 0;
          color: var(--text);
        }

        .admin-actions {
          display: flex;
          gap: 8px;
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
          background: linear-gradient(135deg, #22c55e, #16a34a) !important;
          color: white !important;
          border-color: #22c55e !important;
        }

        .logout-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626) !important;
          color: white !important;
          border-color: #ef4444 !important;
        }

        .admin-tabs {
          display: flex;
          background: var(--card);
          padding: 0 24px;
          border-bottom: 1px solid rgba(125, 211, 252, 0.2);
        }

        .tab {
          padding: 12px 16px;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .tab.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }

        .tab:hover {
          color: var(--text);
        }

        .admin-content {
          padding: 24px;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .content-header h2 {
          margin: 0;
          color: var(--text);
        }

        .add-btn {
          background: linear-gradient(135deg, var(--accent), var(--accent-hover));
          color: #03101a;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(125, 211, 252, 0.4);
        }

        .items-list {
          display: grid;
          gap: 16px;
        }

        .item-card {
          background: var(--card);
          border: 1px solid rgba(125, 211, 252, 0.2);
          border-radius: 12px;
          padding: 16px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .item-id {
          color: var(--muted);
          font-size: 12px;
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
          color: var(--text);
          font-size: 12px;
          cursor: pointer;
        }

        .delete-btn {
          background: transparent;
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .delete-btn:hover {
          background: #ef4444;
          color: white;
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
          padding: 8px 12px;
          border: 1px solid rgba(125, 211, 252, 0.3);
          border-radius: 6px;
          background: rgba(125, 211, 252, 0.05);
          color: var(--text);
          font-size: 14px;
          resize: vertical;
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
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.2);
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 16px;
          }

          .admin-actions {
            flex-wrap: wrap;
          }

          .admin-tabs {
            overflow-x: auto;
          }

          .content-header {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminPanel;
