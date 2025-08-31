import { NextResponse } from 'next/server';

export async function GET() {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ 
      error: 'OPENROUTER_API_KEY не установлен',
      hint: 'Добавьте ключ в Vercel Environment Variables'
    }, { status: 500 });
  }

  try {
    // Пробуем разные варианты запроса
    const tests = [
      {
        name: 'Test 1: GPT-3.5-turbo с базовыми настройками',
        config: {
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello' }],
        }
      },
      {
        name: 'Test 2: Auto model',
        config: {
          model: 'openrouter/auto',
          messages: [{ role: 'user', content: 'Hello' }],
        }
      }
    ];

    const results = [];

    for (const test of tests) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY.trim()}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://neuroexpert.vercel.app',
            'X-Title': 'NeuroExpert'
          },
          body: JSON.stringify(test.config)
        });

        const responseText = await response.text();
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch {
          responseData = responseText;
        }

        results.push({
          test: test.name,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          response: responseData
        });
      } catch (error) {
        results.push({
          test: test.name,
          error: error.message
        });
      }
    }

    // Проверяем сам ключ
    const keyInfo = {
      length: OPENROUTER_API_KEY.length,
      prefix: OPENROUTER_API_KEY.substring(0, 10),
      suffix: OPENROUTER_API_KEY.substring(OPENROUTER_API_KEY.length - 4),
      hasWhitespace: OPENROUTER_API_KEY !== OPENROUTER_API_KEY.trim(),
      format: OPENROUTER_API_KEY.match(/^sk-or-v\d+-[a-f0-9]{64}$/) ? 'valid' : 'invalid'
    };

    return NextResponse.json({ 
      keyInfo,
      results,
      recommendation: 'Проверьте, что ключ добавлен в Vercel без лишних пробелов и символов'
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}