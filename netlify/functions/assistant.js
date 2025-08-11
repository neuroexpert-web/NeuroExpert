const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // CORS headers для всех ответов
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  // Обработка preflight OPTIONS запросов
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let question;
  try {
    const body = JSON.parse(event.body || '{}');
    question = body.question;
  } catch (parseError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured');
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: 'API key is not configured. Please contact support.' })
    };
  }
  
  if (!question || question.trim() === '') {
    return { 
      statusCode: 400, 
      headers,
      body: JSON.stringify({ error: 'Question is required and cannot be empty.' })
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
    
    // Добавляем контекст для более релевантных ответов
    const contextualPrompt = `Вы - AI-ассистент NeuroExpert, специализирующийся на цифровой трансформации, аудите и ROI-расчетах. 
    Отвечайте кратко, профессионально и по существу. 
    Вопрос пользователя: ${question}`;
    
    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        answer: text,
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Более детальная обработка ошибок
    let errorMessage = 'Failed to get response from AI assistant.';
    if (error.message && error.message.includes('API_KEY_INVALID')) {
      errorMessage = 'API key is invalid. Please contact support.';
    } else if (error.message && error.message.includes('QUOTA_EXCEEDED')) {
      errorMessage = 'Service temporarily unavailable due to high demand. Please try again later.';
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
    };
  }
};
