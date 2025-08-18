import { NextResponse } from 'next/server';

export async function GET() {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  // Проверяем баланс через API (если такой endpoint существует)
  try {
    // Пробуем получить информацию об аккаунте
    const response = await fetch('https://api.anthropic.com/v1/organizations', {
      method: 'GET',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    if (!response.ok) {
      // Пробуем другой способ - отправить минимальный запрос
      const testResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'messages-2023-12-15'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1,
          messages: [{
            role: 'user', 
            content: 'a'
          }]
        })
      });

      const testData = await testResponse.json();
      
      return NextResponse.json({
        keyInfo: {
          length: ANTHROPIC_API_KEY.length,
          prefix: ANTHROPIC_API_KEY.substring(0, 20) + '...',
          format: ANTHROPIC_API_KEY.startsWith('sk-ant-') ? 'correct' : 'incorrect'
        },
        testResult: {
          status: testResponse.status,
          headers: Object.fromEntries(testResponse.headers.entries()),
          error: testData.error || null,
          type: testData.type || null
        }
      });
    }

    const data = await response.json();
    return NextResponse.json({ organizations: data });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      keyFormat: {
        hasCorrectPrefix: ANTHROPIC_API_KEY.startsWith('sk-ant-'),
        length: ANTHROPIC_API_KEY.length
      }
    });
  }
}