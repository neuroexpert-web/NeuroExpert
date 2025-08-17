import { NextResponse } from 'next/server';

export async function GET() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  
  const diagnostics = {
    status: 'API Test Endpoint',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      hasGeminiKey: !!GEMINI_API_KEY,
      hasAnthropicKey: !!ANTHROPIC_API_KEY,
      geminiKeyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
      anthropicKeyLength: ANTHROPIC_API_KEY ? ANTHROPIC_API_KEY.length : 0,
    },
    recommendations: []
  };
  
  // Добавляем рекомендации
  if (!GEMINI_API_KEY && !ANTHROPIC_API_KEY) {
    diagnostics.recommendations.push({
      issue: 'No AI API keys found',
      solution: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to your environment variables',
      documentation: 'https://ai.google.dev/'
    });
  }
  
  if (GEMINI_API_KEY && GEMINI_API_KEY.length < 30) {
    diagnostics.recommendations.push({
      issue: 'GEMINI_API_KEY seems too short',
      solution: 'Make sure you copied the complete API key from Google AI Studio'
    });
  }
  
  // Проверяем доступность Gemini API
  if (GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Простой тестовый запрос
      const result = await model.generateContent("Say 'API test successful' in 3 words");
      const response = result.response;
      diagnostics.geminiTest = {
        success: true,
        response: response.text()
      };
    } catch (error) {
      diagnostics.geminiTest = {
        success: false,
        error: error.message
      };
      diagnostics.recommendations.push({
        issue: 'Gemini API test failed',
        solution: 'Check if your API key is valid and has proper permissions',
        error: error.message
      });
    }
  }
  
  return NextResponse.json(diagnostics, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}