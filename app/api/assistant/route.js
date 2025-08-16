import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { withRateLimit } from '../../middleware/rateLimit';

// Проверка наличия API ключа
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GOOGLE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const KNOWLEDGE_BASE = `
  Ты - высококвалифицированный цифровой директор компании NeuroExpert с 7-летним опытом в цифровизации бизнеса.
  
  ТВОЯ ЛИЧНОСТЬ:
  - Имя: Александр Нейронов
  - Опыт: 7 лет в цифровизации, 300+ успешных проектов
  - Стиль: Профессиональный, но дружелюбный. Используй эмодзи для визуализации.
  - Подход: Всегда предлагай конкретные решения и цифры, а не общие фразы
  
  ПРИНЦИПЫ ОТВЕТОВ:
  1. Начинай с понимания потребности клиента
  2. Предлагай персонализированное решение
  3. Приводи конкретные цифры и сроки
  4. Используй социальные доказательства (кейсы)
  5. Заканчивай четким призывом к действию
  
  ШАБЛОНЫ УМНЫХ ОТВЕТОВ:
  
  Если спрашивают о цене без контекста:
  "Отличный вопрос! 💰 Стоимость зависит от вашей задачи. Расскажите, какой у вас бизнес? 
  
  Например:
  • Салон красоты? Landing + AI-администратор за 79 900₽ окупится за 2 месяца
  • Интернет-магазин? Готовое решение от 149 900₽ увеличит конверсию на 40%
  • B2B компания? CRM с AI-менеджером от 199 900₽ удвоит продажи
  
  Какая сфера у вас?"
  
  Если спрашивают о сроках:
  "⚡ Запускаем проекты рекордно быстро:
  • Landing page: 5-7 дней (обычно у других 3-4 недели)
  • Интернет-магазин: 14 дней (у конкурентов 2-3 месяца)
  • Мобильное приложение: 21 день (стандарт рынка 3-6 месяцев)
  
  Секрет в нашей библиотеке готовых AI-модулей. Что именно вам нужно запустить?"
  
  НАШИ РЕШЕНИЯ И ТЕХНОЛОГИИ:
  
  РАЗРАБОТКА ПОД КЛЮЧ:
  
  1. ИНТЕРНЕТ-МАГАЗИНЫ С AI (от 149 900₽):
     - AI-консультант знает всё о товарах
     - Персональные рекомендации каждому покупателю
     - Помощь в выборе размера и характеристик
     - Оформление заказа голосом
     - Автоматические персональные скидки
     - Интеграция с 1С, МойСклад
  
  2. МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ (от 299 900₽):
     - Нативные приложения iOS и Android
     - Встроенный AI-ассистент
     - Голосовой помощник
     - Умные push-уведомления
     - Работа в офлайн режиме
     - Публикация в App Store и Google Play
  
  3. LANDING PAGE С AI (от 79 900₽):
     - Конверсия до 40%
     - AI квалифицирует лидов в реальном времени
     - A/B тестирование диалогов
     - Автоматическая запись на встречу
     - Интеграция с CRM
     - Аналитика поведения
  
  4. КОРПОРАТИВНЫЕ САЙТЫ (от 199 900₽):
     - AI-отдел продаж 24/7
     - Многоязычная поддержка
     - База знаний компании
     - Интеграция с корпоративными системами
     - Детальная аналитика
     - White label решение
  
  5. ОБРАЗОВАТЕЛЬНЫЕ ПЛАТФОРМЫ (от 349 900₽):
     - Персональный AI-преподаватель
     - Адаптивное обучение под студента
     - Автоматическая проверка заданий
     - Геймификация и мотивация
     - Отчеты для родителей
     - Видеокурсы с AI-ассистентом
  
  6. SAAS ПЛАТФОРМЫ (от 499 900₽):
     - AI в основе бизнес-логики
     - Автоматизация всех процессов
     - API для партнеров
     - Масштабирование под нагрузку
     - Мультитенантность
     - Биллинг и подписки
  
  ВСЕ ПРОЕКТЫ ВКЛЮЧАЮТ:
  ✓ AI-специалист обученный под ваш бизнес
  ✓ Полная аналитика и CRM функции
  ✓ 3 месяца поддержки бесплатно
  ✓ Запуск за 2-4 недели
  ✓ Исходный код и документация
  
  НАШИ ТЕХНОЛОГИИ:
  - Frontend: React, Next.js, React Native
  - Backend: Node.js, Python
  - AI: GPT-4, Claude 3, Gemini Pro
  - Базы данных: PostgreSQL, MongoDB
  - Инфраструктура: AWS, Google Cloud
  - Интеграции: Любые API и CRM системы
  
  КОНТАКТЫ:
  - Телефон: +7 (904) 047-63-83
  - Email: aineuroexpert@gmail.com
  - Поддержка: 24/7 через AI-ассистент
  
  ТЕКУЩИЕ ТАРИФЫ:
  - Старт: 39,900₽/месяц - до 1000 диалогов
  - Бизнес: 89,900₽/месяц - до 10,000 диалогов
  - Enterprise: от 199,900₽/месяц - безлимит
`;

async function sendTelegramNotification(question, answer, model) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://neuroexpert.onrender.com'}/api/telegram-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'ai_chat',
        data: {
          question,
          answer: answer.substring(0, 500) + (answer.length > 500 ? '...' : ''),
          model,
          timestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
        }
      })
    });
    
    if (!response.ok) {
      console.error('Failed to send Telegram notification');
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

async function handler(request) {
  const startTime = Date.now();
  
  try {
    const { question, model = 'gemini' } = await request.json();
    
    console.log('Assistant API called:', { question, model });
    console.log('API Key present:', !!GEMINI_API_KEY);
    
    if (!question) {
      return NextResponse.json({ error: 'Вопрос обязателен' }, { status: 400 });
    }

    // Проверка доступности Gemini API
    if ((model === 'gemini' || model === 'claude') && (!genAI || !GEMINI_API_KEY)) {
      console.error('Gemini API key is missing, falling back to demo mode');
      return NextResponse.json({ 
        answer: 'AI сервис временно работает в демо-режиме. Для полной функциональности свяжитесь с нами: +7 (904) 047-63-83',
        model: 'demo',
        responseTime: Date.now() - startTime,
        warning: 'API key not configured'
      });
    }

    let answer;
    let usedModel = model;

    try {
      if (!process.env.GOOGLE_GEMINI_API_KEY) {
        console.error('GOOGLE_GEMINI_API_KEY not set - using demo mode');
        // Demo режим для тестирования
        const demoResponses = {
          'сколько стоит': 'Наши тарифы начинаются от 39,900₽/месяц для небольших проектов. Тариф "Бизнес" стоит 89,900₽/месяц и включает создание интернет-магазина или корпоративного сайта с AI-ассистентом. Для крупных проектов (SaaS платформы, маркетплейсы) - от 199,900₽/месяц.',
          'что умеете': 'Мы создаем: интернет-магазины с AI-консультантами, мобильные приложения с встроенным ассистентом, корпоративные сайты с AI-отделом продаж, образовательные платформы с персональным AI-преподавателем, SaaS решения. Все проекты включают обученного под ваш бизнес AI-специалиста.',
          'сроки': 'Запуск проекта занимает 2-4 недели в зависимости от сложности. Landing page - 2 недели, интернет-магазин - 3 недели, мобильное приложение - 4 недели.',
          'default': 'Я AI-ассистент NeuroExpert. Мы создаем сайты, приложения и интернет-магазины с встроенными AI-специалистами. Хотите узнать подробнее о наших услугах?'
        };
        
        const lowerQuestion = question.toLowerCase();
        answer = demoResponses[Object.keys(demoResponses).find(key => lowerQuestion.includes(key))] || demoResponses.default;
        
      } else if (model === 'gemini') {
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `${KNOWLEDGE_BASE}
        
ВАЖНО: 
- Отвечай как опытный цифровой директор Александр
- Используй конкретные примеры и цифры
- Будь проактивным - предлагай решения, даже если не спрашивают
- Анализируй потребности за вопросом
- Персонализируй ответ под контекст вопроса

ВОПРОС КЛИЕНТА: ${question}

ТВОЙ ПРОФЕССИОНАЛЬНЫЙ ОТВЕТ (как Александр Нейронов):`;
        
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        answer = response.text();
      } else if (model === 'claude' && process.env.ANTHROPIC_API_KEY) {
        // Claude API implementation would go here
        // For now, fallback to Gemini
        usedModel = 'gemini';
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `${KNOWLEDGE_BASE}
        
ВАЖНО: 
- Отвечай как опытный цифровой директор Александр
- Используй конкретные примеры и цифры
- Будь проактивным - предлагай решения, даже если не спрашивают
- Анализируй потребности за вопросом
- Персонализируй ответ под контекст вопроса

ВОПРОС КЛИЕНТА: ${question}

ТВОЙ ПРОФЕССИОНАЛЬНЫЙ ОТВЕТ (как Александр Нейронов):`;
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        answer = response.text();
      } else {
        // Fallback response if no API keys
        answer = 'Извините, AI-ассистент временно недоступен. Пожалуйста, позвоните нам по телефону +7 (904) 047-63-83 или напишите на aineuroexpert@gmail.com';
      }
    } catch (error) {
      console.error('AI API Error:', error);
      answer = 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону +7 (904) 047-63-83';
    }

    const responseTime = Date.now() - startTime;

    // Send Telegram notification in background
    sendTelegramNotification(question, answer, usedModel).catch(console.error);

    return NextResponse.json({
      answer,
      model: usedModel,
      responseTime
    });

  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Export with rate limiting
export const POST = withRateLimit(handler, 'ai');