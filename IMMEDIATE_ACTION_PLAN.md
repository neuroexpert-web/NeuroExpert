# 🚀 План немедленных действий по исправлению

## 🔴 КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ (Сегодня)

### 1. Главная страница - Добавить обработчики кнопок
```javascript
// Файл: app/page.js

// БЫЛО:
<button className="cta-button">
  Начать бесплатно
</button>

// НУЖНО:
<button className="cta-button" onClick={() => router.push('/register')}>
  Начать бесплатно
</button>
```

### 2. PricingCalculator - Переписать на React
```javascript
// Файл: app/components/PricingCalculator.js

// БЫЛО: DOM манипуляции
const selectedPlan = document.querySelector('input[name="base-plan"]:checked');

// НУЖНО: React состояние
const [selectedPlan, setSelectedPlan] = useState('plan-start');
const [users, setUsers] = useState(10);
const [dataVolume, setDataVolume] = useState(100);
```

### 3. Личный кабинет - Восстановить Drag & Drop
```javascript
// Файл: app/components/workspace/WorkspaceLayout.js

// Вернуть полную версию вместо WorkspaceLayoutFixed
// Исправить проблемы с хуками
// Добавить throttle для производительности
```

## 🟡 ВАЖНЫЕ ИСПРАВЛЕНИЯ (Эта неделя)

### 1. Формы - Добавить валидацию
- ContactForm.js - валидация email, телефона
- Task Creation - проверка обязательных полей
- Единые сообщения об ошибках

### 2. Состояние приложения
- Добавить Context или Redux для глобального состояния
- Сохранение в localStorage
- Восстановление при перезагрузке

### 3. Обратная связь пользователю
- Loading индикаторы
- Success/Error уведомления
- Прогресс операций

## 📋 Чек-лист быстрых исправлений

### Главная страница (app/page.js)
- [ ] CTA кнопка → добавить onClick
- [ ] Refresh button → handleRefresh функция
- [ ] Фильтры → связать с состоянием
- [ ] Help icons → показывать тултипы
- [ ] Segment cards → исправить handleSegmentChange

### Калькуляторы
- [ ] PricingCalculator → полностью на React
- [ ] ROI Calculator → добавить валидацию
- [ ] Модальные окна → исправить z-index
- [ ] Результаты → возможность скачать PDF

### Личный кабинет
- [ ] Drag & Drop → восстановить
- [ ] Resize → включить обработчики
- [ ] Z-index → система управления
- [ ] Сохранение → localStorage

## 🛠️ Код для быстрого старта

### 1. Базовый обработчик кнопок
```javascript
const handleButtonClick = (action) => {
  setLoading(true);
  try {
    switch(action) {
      case 'start-free':
        router.push('/register');
        break;
      case 'refresh-data':
        fetchLatestData();
        break;
      // ... другие действия
    }
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 2. Компонент кнопки с состояниями
```javascript
const ActionButton = ({ onClick, children, variant = 'primary' }) => {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button 
      className={`btn btn-${variant} ${loading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

### 3. Форма с валидацией
```javascript
const ContactForm = () => {
  const [errors, setErrors] = useState({});
  
  const validate = (data) => {
    const errors = {};
    if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Неверный формат email';
    }
    if (!data.phone?.match(/^\+?[0-9]{10,15}$/)) {
      errors.phone = 'Неверный формат телефона';
    }
    return errors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const validationErrors = validate(data);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Отправка формы
    submitForm(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Поля формы с отображением ошибок */}
    </form>
  );
};
```

## 📊 Ожидаемый результат

После выполнения плана:
- ✅ 100% кнопок будут работать
- ✅ Калькуляторы станут полностью функциональными
- ✅ Личный кабинет получит полный функционал
- ✅ Формы будут валидироваться
- ✅ Пользователи увидят обратную связь

## ⏰ Временные оценки

- **Критические исправления**: 1-2 дня
- **Важные исправления**: 3-4 дня
- **Полная готовность**: 1 неделя

---

**Готов начать исправления!** 
Начинаем с критических?