// ПРОСТОЙ ТЕСТ TELEGRAM - ЗАПУСТИТЕ ЭТОТ ФАЙЛ!

const TELEGRAM_BOT_TOKEN = 'ВАШ_ТОКЕН_ЗДЕСЬ'; // <-- ВСТАВЬТЕ СЮДА ВАШ ТОКЕН
const TELEGRAM_CHAT_ID = 'ВАШ_CHAT_ID_ЗДЕСЬ'; // <-- ВСТАВЬТЕ СЮДА ВАШ CHAT ID

async function testTelegram() {
  console.log('🚀 Тестируем Telegram...\n');
  
  // Проверяем, заполнены ли данные
  if (TELEGRAM_BOT_TOKEN === 'ВАШ_ТОКЕН_ЗДЕСЬ') {
    console.log('❌ ОШИБКА: Вставьте ваш токен бота в файл test-telegram-now.js!');
    console.log('👉 Откройте файл и замените ВАШ_ТОКЕН_ЗДЕСЬ на реальный токен\n');
    return;
  }
  
  if (TELEGRAM_CHAT_ID === 'ВАШ_CHAT_ID_ЗДЕСЬ') {
    console.log('❌ ОШИБКА: Вставьте ваш Chat ID в файл test-telegram-now.js!');
    console.log('👉 Откройте файл и замените ВАШ_CHAT_ID_ЗДЕСЬ на реальный ID\n');
    return;
  }
  
  try {
    // 1. Проверяем бота
    console.log('1️⃣ Проверяю бота...');
    const botResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const botInfo = await botResponse.json();
    
    if (!botInfo.ok) {
      console.log('❌ Токен бота неверный!');
      console.log('Ошибка:', botInfo.description);
      return;
    }
    
    console.log('✅ Бот найден:', '@' + botInfo.result.username);
    
    // 2. Отправляем тестовое сообщение
    console.log('\n2️⃣ Отправляю тестовое сообщение...');
    const messageResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: '✅ Тест уведомлений NeuroExpert работает!\n\nВремя: ' + new Date().toLocaleString('ru-RU')
        })
      }
    );
    
    const result = await messageResponse.json();
    
    if (result.ok) {
      console.log('✅ УСПЕХ! Сообщение отправлено!');
      console.log('📱 Проверьте ваш Telegram!');
      console.log('\n🎉 ВСЁ РАБОТАЕТ! Теперь добавьте эти переменные в Vercel:');
      console.log(`   TELEGRAM_BOT_TOKEN = ${TELEGRAM_BOT_TOKEN}`);
      console.log(`   TELEGRAM_CHAT_ID = ${TELEGRAM_CHAT_ID}`);
    } else {
      console.log('❌ Ошибка отправки:', result.description);
      
      if (result.error_code === 400) {
        console.log('\n💡 Возможные причины:');
        console.log('   - Неверный Chat ID');
        console.log('   - Бот не добавлен в чат');
        console.log('   - Если это канал, ID должен начинаться с @');
      }
    }
    
  } catch (error) {
    console.log('❌ Ошибка:', error.message);
  }
}

// Запускаем тест
testTelegram();