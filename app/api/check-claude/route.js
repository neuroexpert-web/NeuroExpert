import { NextResponse } from 'next/server';

export async function GET() {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'No API key' });
  }

  // Проверяем разные модели Claude
  const models = [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-2.1',
    'claude-2.0',
    'claude-instant-1.2',
  ];

  const results = [];

  for (const model of models) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 10,
          messages: [
            {
              role: 'user',
              content: 'Hi',
            },
          ],
        }),
      });

      const data = await response.json();

      results.push({
        model: model,
        status: response.status,
        works: response.ok,
        error: data.error?.message || null,
      });
    } catch (e) {
      results.push({
        model: model,
        status: 'error',
        works: false,
        error: e.message,
      });
    }
  }

  return NextResponse.json({
    apiKeyLength: ANTHROPIC_API_KEY.length,
    apiKeyPrefix: ANTHROPIC_API_KEY.substring(0, 15) + '...',
    results: results,
  });
}
