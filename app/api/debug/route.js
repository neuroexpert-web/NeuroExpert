import { NextResponse } from 'next/server';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL: !!process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
    },
    apiKeys: {
      gemini: {
        GEMINI_API_KEY: {
          exists: !!process.env.GEMINI_API_KEY,
          length: process.env.GEMINI_API_KEY?.length || 0,
          startsWith: process.env.GEMINI_API_KEY?.substring(0, 7) || 'not set',
          format: process.env.GEMINI_API_KEY?.match(/^AIzaSy[\w-]+$/) ? 'valid' : 'invalid'
        },
        GOOGLE_GEMINI_API_KEY: {
          exists: !!process.env.GOOGLE_GEMINI_API_KEY,
          length: process.env.GOOGLE_GEMINI_API_KEY?.length || 0
        }
      },
      telegram: {
        TELEGRAM_BOT_TOKEN: {
          exists: !!process.env.TELEGRAM_BOT_TOKEN,
          length: process.env.TELEGRAM_BOT_TOKEN?.length || 0,
          format: process.env.TELEGRAM_BOT_TOKEN?.match(/^\d+:[\w-]+$/) ? 'valid' : 'invalid'
        },
        TELEGRAM_CHAT_ID: {
          exists: !!process.env.TELEGRAM_CHAT_ID,
          length: process.env.TELEGRAM_CHAT_ID?.length || 0,
          format: process.env.TELEGRAM_CHAT_ID?.match(/^-?\d+$/) ? 'valid' : 'invalid'
        }
      },
      analytics: {
        NEXT_PUBLIC_GA_ID: {
          exists: !!process.env.NEXT_PUBLIC_GA_ID,
          value: process.env.NEXT_PUBLIC_GA_ID || 'not set'
        }
      }
    },
    tests: {
      gemini: null,
      telegram: null
    }
  };

  // Test Gemini API
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent("Say 'API works' in exactly 2 words");
      const response = result.response;
      
      diagnostics.tests.gemini = {
        success: true,
        response: response.text(),
        apiKeyUsed: process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'GOOGLE_GEMINI_API_KEY'
      };
    } catch (error) {
      diagnostics.tests.gemini = {
        success: false,
        error: error.message,
        errorCode: error.code,
        apiKeyUsed: process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'GOOGLE_GEMINI_API_KEY'
      };
    }
  } else {
    diagnostics.tests.gemini = {
      success: false,
      error: 'No API key found'
    };
  }

  // Test Telegram
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      // Get bot info
      const botInfoResponse = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`
      );
      const botInfo = await botInfoResponse.json();
      
      diagnostics.tests.telegram = {
        botInfo: {
          success: botInfo.ok,
          username: botInfo.result?.username,
          error: botInfo.description
        },
        testMessage: null
      };
      
      // Try to send test message
      if (botInfo.ok) {
        const testResponse = await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: `🧪 Debug Test\n\nTime: ${new Date().toLocaleString('ru-RU')}\nEnvironment: ${process.env.VERCEL_ENV || 'local'}`,
              parse_mode: 'Markdown'
            })
          }
        );
        
        const testResult = await testResponse.json();
        diagnostics.tests.telegram.testMessage = {
          success: testResult.ok,
          error: testResult.description
        };
      }
    } catch (error) {
      diagnostics.tests.telegram = {
        success: false,
        error: error.message
      };
    }
  } else {
    diagnostics.tests.telegram = {
      success: false,
      error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID'
    };
  }

  // Add recommendations
  diagnostics.recommendations = [];
  
  if (!diagnostics.apiKeys.gemini.GEMINI_API_KEY.exists && !diagnostics.apiKeys.gemini.GOOGLE_GEMINI_API_KEY.exists) {
    diagnostics.recommendations.push('Add GEMINI_API_KEY to environment variables');
  }
  
  if (diagnostics.tests.gemini && !diagnostics.tests.gemini.success) {
    diagnostics.recommendations.push('Check if Gemini API key is valid and has proper permissions');
  }
  
  if (!diagnostics.apiKeys.telegram.TELEGRAM_BOT_TOKEN.exists) {
    diagnostics.recommendations.push('Add TELEGRAM_BOT_TOKEN from @BotFather');
  }
  
  if (!diagnostics.apiKeys.telegram.TELEGRAM_CHAT_ID.exists) {
    diagnostics.recommendations.push('Add TELEGRAM_CHAT_ID (your chat or channel ID)');
  }
  
  if (diagnostics.tests.telegram && diagnostics.tests.telegram.botInfo && !diagnostics.tests.telegram.botInfo.success) {
    diagnostics.recommendations.push('Check if Telegram bot token is correct');
  }

  return NextResponse.json(diagnostics, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}