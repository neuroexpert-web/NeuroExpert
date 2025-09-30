import { NextResponse } from 'next/server';

export async function GET(request) {
  return testClaude();
}

export async function POST(request) {
  return testClaude();
}

async function testClaude() {
  // Пропускаем CSRF для тестового endpoint
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ 
      error: 'ANTHROPIC_API_KEY not set',
      hasKey: false 
    });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Say hello in one sentence'
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Claude API error',
        status: response.status,
        details: data
      });
    }

    return NextResponse.json({
      success: true,
      response: data.content[0].text,
      model: data.model
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Request failed',
      message: error.message
    });
  }
}