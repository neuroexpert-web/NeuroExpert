// Тестовый скрипт для проверки улучшенного AI управляющего платформы
// Запустить: node test-enhanced-prompt.js

const testScenarios = [
  {
    name: "Первое знакомство",
    message: "Здравствуйте, я ищу решение для автоматизации продаж",
    expectedElements: ["Александр Нейронов", "15 лет", "50+ компаний", "какая сфера", "бизнес"]
  },
  {
    name: "Возражение по цене",
    message: "Звучит интересно, но боюсь это будет слишком дорого для нас",
    expectedElements: ["посчитаем", "окупится", "пилот", "ROI", "теряете"]
  },
  {
    name: "Нет времени",
    message: "У нас сейчас очень загруженный период, нет времени на внедрение новых систем",
    expectedElements: ["готовые решения", "2 недели", "минимум участия", "техническую часть"]
  },
  {
    name: "Скептицизм",
    message: "Мы уже пробовали разные AI решения, но они не дали результата",
    expectedElements: ["понимаю", "кейс", "результат", "отличается", "гарант"]
  },
  {
    name: "Запрос конкретики",
    message: "Можете показать конкретные примеры успешных внедрений в e-commerce?",
    expectedElements: ["FreshMarket", "156%", "продаж", "ROI", "конверсия"]
  }
];

async function testPrompt() {
  console.log('🧪 Тестирование улучшенного промпта AI управляющего платформы\n');
  console.log('=' .repeat(60));
  
  const apiUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-netlify-site.netlify.app/api/assistant'
    : 'http://localhost:3000/api/assistant';
  
  for (const scenario of testScenarios) {
    console.log(`\n📋 Сценарий: ${scenario.name}`);
    console.log(`💬 Сообщение: "${scenario.message}"`);
    console.log('-'.repeat(60));
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-neuroexpert-csrf': 'test'
        },
        body: JSON.stringify({
          userMessage: scenario.message,
          model: 'gemini',
          history: []
        })
      });
      
      if (!response.ok) {
        console.error(`❌ HTTP Error: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`\n🤖 Ответ AI управляющего:`);
      console.log(data.reply || data.answer);
      
      // Проверка ключевых элементов
      console.log(`\n✅ Проверка ключевых элементов:`);
      let passedChecks = 0;
      
      for (const element of scenario.expectedElements) {
        const found = (data.reply || data.answer || '').toLowerCase().includes(element.toLowerCase());
        console.log(`   ${found ? '✓' : '✗'} Содержит "${element}"`);
        if (found) passedChecks++;
      }
      
      const score = Math.round((passedChecks / scenario.expectedElements.length) * 100);
      console.log(`\n📊 Оценка качества ответа: ${score}%`);
      
      if (score >= 80) {
        console.log('   🟢 Отличный результат!');
      } else if (score >= 60) {
        console.log('   🟡 Хороший результат, но есть что улучшить');
      } else {
        console.log('   🔴 Требуется доработка промпта');
      }
      
    } catch (error) {
      console.error(`❌ Ошибка: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
  }
  
  console.log('\n✨ Тестирование завершено!\n');
}

// Дополнительный тест на профессионализм
async function testProfessionalism() {
  console.log('\n🎯 Тест на профессионализм и человечность\n');
  
  const complexQuery = `
    Добрый день! Мы средняя компания в сфере онлайн-образования, 
    около 5000 активных студентов. Сейчас у нас большая проблема с оттоком - 
    теряем около 40% студентов после первого месяца. Пробовали разные 
    решения, но ничего не помогает. Бюджет ограничен, да и команда 
    маленькая. Честно говоря, уже отчаялись. Может AI как-то поможет?
  `;
  
  console.log(`💬 Сложный запрос:\n${complexQuery}`);
  console.log('-'.repeat(60));
  
  // Здесь бы был реальный вызов API
  console.log('\n📝 Ожидаемые качества ответа:');
  console.log('   ✓ Эмпатия и понимание проблемы');
  console.log('   ✓ Конкретный релевантный кейс (SmartEdu)');
  console.log('   ✓ Пошаговый план решения');
  console.log('   ✓ Реалистичные ожидания по срокам и результатам');
  console.log('   ✓ Предложение начать с пилота');
  console.log('   ✓ Вопросы для уточнения контекста');
  console.log('   ✓ Теплый, но профессиональный тон');
}

// Запуск тестов
if (require.main === module) {
  console.log('🚀 Запуск тестирования улучшенного AI управляющего...\n');
  
  testPrompt()
    .then(() => testProfessionalism())
    .catch(error => {
      console.error('Критическая ошибка:', error);
      process.exit(1);
    });
}

module.exports = { testPrompt, testProfessionalism };