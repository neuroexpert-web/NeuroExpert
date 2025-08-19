/**
 * Тестовый скрипт для проверки интеграции AI-агентов
 */

const testAIIntegration = async () => {
  console.log('🚀 Запуск тестирования AI-агентов...\n');

  // Ждем запуска сервера
  await new Promise(resolve => setTimeout(resolve, 5000));

  const testQueries = [
    {
      query: "Привет! Расскажи о себе и своих возможностях",
      context: { testMode: true }
    },
    {
      query: "Как мне улучшить обслуживание клиентов?",
      context: { requireCapabilities: ['analysis'] }
    },
    {
      query: "Проанализируй эффективность email-маркетинга",
      context: { requireCapabilities: ['analysis', 'long-context'] }
    }
  ];

  for (const test of testQueries) {
    console.log(`\n📝 Тестовый запрос: "${test.query}"`);
    console.log('⏳ Отправка запроса...');

    try {
      const response = await fetch('http://localhost:3000/api/ai-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-neuroexpert-csrf': '1'
        },
        body: JSON.stringify(test)
      });

      const data = await response.json();

      if (data.success) {
        console.log(`✅ Успешный ответ от агента: ${data.data.agent}`);
        console.log(`📊 Качество ответа: ${data.data.quality.score}%`);
        console.log(`⏱️ Время ответа: ${data.data.responseTime}ms`);
        console.log(`💬 Ответ: ${data.data.content.substring(0, 200)}...`);
        
        if (data.data.suggestions?.length > 0) {
          console.log('💡 Рекомендации по улучшению:');
          data.data.suggestions.forEach(s => console.log(`   - ${s}`));
        }
      } else {
        console.error(`❌ Ошибка: ${data.error}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка сети: ${error.message}`);
    }
  }

  console.log('\n\n📊 Получение метрик всех агентов...');
  
  try {
    const metricsResponse = await fetch('http://localhost:3000/api/ai-agent');
    const metricsData = await metricsResponse.json();
    
    if (metricsData.success) {
      console.log('\n🎯 Метрики агентов:');
      
      Object.entries(metricsData.data.agents).forEach(([agent, metrics]) => {
        console.log(`\n${agent.toUpperCase()}:`);
        console.log(`  • Удовлетворенность: ${metrics.satisfaction.avg}%`);
        console.log(`  • Точность: ${metrics.accuracy.avg}%`);
        console.log(`  • Среднее время ответа: ${metrics.responseTime.avg}ms`);
        console.log(`  • Всего взаимодействий: ${metrics.totalInteractions}`);
      });
      
      if (metricsData.data.summary.bestPerforming) {
        console.log(`\n🏆 Лучший агент: ${metricsData.data.summary.bestPerforming.agent} (${metricsData.data.summary.bestPerforming.satisfactionScore}%)`);
      }
    }
  } catch (error) {
    console.error('❌ Не удалось получить метрики:', error.message);
  }

  console.log('\n✅ Тестирование завершено!');
};

// Запуск тестирования
testAIIntegration().catch(console.error);