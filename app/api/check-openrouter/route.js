import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.OPENROUTER_API_KEY || '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';
  
  try {
    // Простой тестовый запрос с минимальными параметрами
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key.trim()}`
      }
    });

    const data = await response.text();
    
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      keyUsed: key.substring(0, 20) + '...',
      response: data.substring(0, 500) + '...',
      recommendation: response.status === 401 
        ? 'Ключ недействителен. Создайте новый на https://openrouter.ai/keys' 
        : 'Ключ работает!'
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      keyUsed: key.substring(0, 20) + '...'
    });
  }
}