// Тестовый скрипт для проверки интеграции промпта
// Запустить: node test-prompt-integration.js

async function testPromptIntegration() {
  console.log('🧪 Тестирование интеграции системного промпта v3.2...\n');
  
  const apiUrl = 'http://localhost:3000/api/assistant';
  
  // Тест 1: Первое сообщение (должен ответить как Управляющий)
  console.log('📝 Тест 1: Первое сообщение');
  try {
    const response1 = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-neuroexpert-csrf': 'browser'
      },
      body: JSON.stringify({
        userMessage: 'Привет',
        history: [],
        model: 'gemini'
      })
    });
    
    const data1 = await response1.json();
    console.log('✅ Ответ:', data1.reply?.substring(0, 200) + '...');
    console.log('✅ История обновлена:', !!data1.updated_history);
    console.log('✅ Модель:', data1.model);
    
    // Тест 2: Продолжение диалога с историей
    console.log('\n📝 Тест 2: Продолжение диалога');
    const response2 = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-neuroexpert-csrf': 'browser'
      },
      body: JSON.stringify({
        userMessage: 'Хочу увеличить продажи на 20%',
        history: data1.updated_history || [],
        model: 'gemini'
      })
    });
    
    const data2 = await response2.json();
    console.log('✅ Ответ:', data2.reply?.substring(0, 200) + '...');
    console.log('✅ Модель помнит контекст:', data2.reply?.includes('продаж') || data2.reply?.includes('20%'));
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
  
  // Тест 3: Проверка GET endpoint
  console.log('\n📝 Тест 3: Проверка загрузки промпта');
  try {
    const response3 = await fetch(apiUrl.replace('/assistant', '/assistant/test'));
    const data3 = await response3.json();
    console.log('✅ Промпт загружен:', data3.promptLength > 0);
    console.log('✅ Длина промпта:', data3.promptLength);
    console.log('✅ API ключ присутствует:', data3.env.hasGeminiKey);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Запускаем тест
console.log('🚀 Запуск тестов...');
console.log('⚠️  Убедитесь, что приложение запущено на localhost:3000\n');
testPromptIntegration();