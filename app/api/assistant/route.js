import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

const KNOWLEDGE_BASE = `
  NeuroExpert - платформа AI-ассистентов нового поколения.
  
  МЫ НЕ ПРОСТО AI-ЧАТ! Мы создаем полноценные цифровые решения:
  
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

export async function POST(request) {
  const startTime = Date.now();
  
  try {
    const { question, model = 'gemini' } = await request.json();
    
    console.log('Assistant API called:', { question, model });
    console.log('API Key present:', !!process.env.GOOGLE_GEMINI_API_KEY);
    
    if (!question) {
      return NextResponse.json({ error: 'Вопрос обязателен' }, { status: 400 });
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
        
        const prompt = `${KNOWLEDGE_BASE}\n\nВОПРОС КЛИЕНТА: ${question}\n\nОТВЕТ:`;
        
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        answer = response.text();
      } else if (model === 'claude' && process.env.ANTHROPIC_API_KEY) {
        // Claude API implementation would go here
        // For now, fallback to Gemini
        usedModel = 'gemini';
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `${KNOWLEDGE_BASE}\n\nВОПРОС КЛИЕНТА: ${question}\n\nОТВЕТ:`;
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