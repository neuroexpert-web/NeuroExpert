/**
 * Тест drag & drop функционала личного кабинета
 * Дата: 20.01.2025
 */

// Функция для эмуляции drag & drop
function testDragDrop() {
  console.log('🧪 Начинаем тестирование drag & drop...');
  
  // Находим все виджеты
  const widgets = document.querySelectorAll('.workspace-widget');
  console.log(`✅ Найдено виджетов: ${widgets.length}`);
  
  if (widgets.length === 0) {
    console.error('❌ Виджеты не найдены!');
    return false;
  }
  
  // Тестируем первый виджет
  const widget = widgets[0];
  const header = widget.querySelector('.widget-header');
  
  if (!header) {
    console.error('❌ Заголовок виджета не найден!');
    return false;
  }
  
  // Получаем начальную позицию
  const startPosition = {
    x: parseInt(widget.style.left) || 0,
    y: parseInt(widget.style.top) || 0
  };
  console.log(`📍 Начальная позиция: x=${startPosition.x}, y=${startPosition.y}`);
  
  // Эмулируем mousedown
  const mousedownEvent = new MouseEvent('mousedown', {
    clientX: startPosition.x + 50,
    clientY: startPosition.y + 10,
    bubbles: true
  });
  header.dispatchEvent(mousedownEvent);
  console.log('✅ MouseDown событие отправлено');
  
  // Эмулируем mousemove
  setTimeout(() => {
    const mousemoveEvent = new MouseEvent('mousemove', {
      clientX: startPosition.x + 200,
      clientY: startPosition.y + 100,
      bubbles: true
    });
    document.dispatchEvent(mousemoveEvent);
    console.log('✅ MouseMove событие отправлено');
    
    // Эмулируем mouseup
    setTimeout(() => {
      const mouseupEvent = new MouseEvent('mouseup', {
        bubbles: true
      });
      document.dispatchEvent(mouseupEvent);
      console.log('✅ MouseUp событие отправлено');
      
      // Проверяем новую позицию
      setTimeout(() => {
        const newPosition = {
          x: parseInt(widget.style.left) || 0,
          y: parseInt(widget.style.top) || 0
        };
        console.log(`📍 Новая позиция: x=${newPosition.x}, y=${newPosition.y}`);
        
        if (newPosition.x !== startPosition.x || newPosition.y !== startPosition.y) {
          console.log('✅ Drag & Drop работает корректно!');
          return true;
        } else {
          console.error('❌ Позиция не изменилась - drag & drop не работает');
          return false;
        }
      }, 100);
    }, 500);
  }, 100);
}

// Функция для проверки сохранения позиций
function testPositionSaving() {
  console.log('🧪 Проверяем сохранение позиций...');
  
  const savedSession = localStorage.getItem('workspace-session');
  if (savedSession) {
    const session = JSON.parse(savedSession);
    console.log('✅ Сессия найдена:', session);
    if (session.widgets && session.widgets.length > 0) {
      console.log('✅ Виджеты сохранены:', session.widgets.length);
      return true;
    }
  }
  console.error('❌ Сохраненная сессия не найдена');
  return false;
}

// Запускаем тесты при загрузке страницы
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('=== ТЕСТИРОВАНИЕ DRAG & DROP ===');
      testDragDrop();
      setTimeout(() => {
        testPositionSaving();
      }, 2000);
    }, 2000);
  });
}

// Экспорт для использования в консоли
if (typeof window !== 'undefined') {
  window.testDragDrop = testDragDrop;
  window.testPositionSaving = testPositionSaving;
}