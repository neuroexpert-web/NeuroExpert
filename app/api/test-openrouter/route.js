import { NextResponse } from 'next/server';

export async function GET() {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'No OpenRouter API key' }, { status: 500 });
  }

  try {
    // Тест 1: Проверка моделей
    const modelsResponse = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY.trim()}`,
        'HTTP-Referer': 'https://neuroexpert.vercel.app',
        'X-Title': 'NeuroExpert'
      }
    });

    const modelsData = await modelsResponse.json();
    
    // Тест 2: Простой запрос
    const testResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY.trim()}`,
        'HTTP-Referer': 'https://neuroexpert.vercel.app',
        'X-Title': 'NeuroExpert',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [{ role: 'user', content: 'Say "Hello"' }],
        max_tokens: 10
      })
    });

    const testData = await testResponse.json();

    return NextResponse.json({
      success: true,
      keyInfo: {
        length: OPENROUTER_API_KEY.length,
        prefix: OPENROUTER_API_KEY.substring(0, 20) + '...',
        hasSpaces: OPENROUTER_API_KEY !== OPENROUTER_API_KEY.trim()
      },
      modelsResponse: {
        status: modelsResponse.status,
        ok: modelsResponse.ok,
        data: modelsData
      },
      testResponse: {
        status: testResponse.status,
        ok: testResponse.ok,
        data: testData
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}