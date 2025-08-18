import { NextResponse } from 'next/server';

export async function GET() {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // Самая простая модель
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Say "Hello, I am working!" in one sentence.'
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'Claude API error',
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      response: data.content[0].text,
      model: data.model
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Request failed',
      message: error.message,
      stack: error.stack
    });
  }
}