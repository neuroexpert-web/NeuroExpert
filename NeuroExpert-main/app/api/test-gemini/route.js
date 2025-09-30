import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ 
      error: 'GOOGLE_GEMINI_API_KEY not set',
      hasKey: false 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    
    const result = await model.generateContent("Say 'Hello, Gemini is working!' in one sentence.");
    const response = result.response;
    const text = response.text();
    
    return NextResponse.json({
      success: true,
      response: text,
      model: 'gemini-1.5-pro-latest',
      keyLength: GEMINI_API_KEY.length
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Gemini API error',
      message: error.message,
      keyExists: true,
      keyLength: GEMINI_API_KEY.length
    });
  }
}