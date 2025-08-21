#!/usr/bin/env node

// БЕЗОПАСНЫЙ ТЕСТ TELEGRAM - использует переменные окружения
require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function testTelegram() {
  console.log('🚀 Тестируем Telegram...\n');

  // Проверяем наличие переменных окружения
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('❌ Ошибка: Необходимо установить переменные окружения!');
    console.log('\nСоздайте файл .env со следующими переменными:');
    console.log('TELEGRAM_BOT_TOKEN=ваш_токен_бота');
    console.log('TELEGRAM_CHAT_ID=ваш_chat_id');
    console.log('\n⚠️  НИКОГДА не коммитьте .env файл в git!');
    process.exit(1);
  }

  // Маскируем токен для безопасности
  const maskedToken =
    TELEGRAM_BOT_TOKEN.substring(0, 10) +
    '...' +
    TELEGRAM_BOT_TOKEN.substring(TELEGRAM_BOT_TOKEN.length - 4);
  console.log(`📋 Используется токен: ${maskedToken}`);
  console.log(`📋 Chat ID: ${TELEGRAM_CHAT_ID}`);

  try {
    // 1. Проверяем бота
    console.log('\n1️⃣ Проверяю бота...');
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
          text: `✅ Тест уведомлений NeuroExpert

🔒 Безопасная версия (токен из переменных окружения)
⏰ Время: ${new Date().toLocaleString('ru-RU')}
🖥️ Окружение: ${process.env.NODE_ENV || 'development'}`,
        }),
      }
    );

    const result = await messageResponse.json();

    if (result.ok) {
      console.log('✅ УСПЕХ! Сообщение отправлено!');
      console.log('📱 Проверьте ваш Telegram!');
      console.log('\n🎉 Telegram интеграция работает корректно!');
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
    console.log('\n💡 Проверьте подключение к интернету');
  }
}

// Запускаем тест
if (require.main === module) {
  testTelegram();
}

module.exports = { testTelegram };
