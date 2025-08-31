import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.OPENROUTER_API_KEY;
  
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