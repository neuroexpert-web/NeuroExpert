import { POST } from '../assistant/route';
import { NextRequest } from 'next/server';

// Мокаем Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Тестовый ответ от Gemini AI')
        }
      })
    })
  }))
}));

// Мокаем rate limiting
jest.mock('../../middleware/rateLimit', () => ({
  rateLimitMiddleware: jest.fn().mockReturnValue(() => ({
    headers: {
      'X-RateLimit-Limit': '10',
      'X-RateLimit-Remaining': '9',
      'X-RateLimit-Reset': Date.now() + 60000
    }
  }))
}));

describe('Assistant API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_GEMINI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.GOOGLE_GEMINI_API_KEY;
  });

  describe('POST /api/assistant', () => {
    it('returns AI response for valid request', async () => {
      const request = new NextRequest('http://localhost:3000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Какой ROI я получу?',
          model: 'gemini',
          context: {}
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('answer');
      expect(data).toHaveProperty('context');
      expect(data).toHaveProperty('responseTime');
      expect(typeof data.answer).toBe('string');
    });

    it('returns 400 for missing question', async () => {
      const request = new NextRequest('http://localhost:3000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini',
          context: {}
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Вопрос обязателен');
    });

    it('handles rate limiting', async () => {
      // Мокаем превышение лимита
      const { rateLimitMiddleware } = require('../../middleware/rateLimit');
      rateLimitMiddleware.mockReturnValueOnce(() => 
        new Response(
          JSON.stringify({
            error: 'Too many requests',
            message: 'Rate limit exceeded. Try again in 60 seconds.',
            retryAfter: 60
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60'
            }
          }
        )
      );

      const request = new NextRequest('http://localhost:3000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Test question',
          model: 'gemini'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Too many requests');
      expect(response.headers.get('Retry-After')).toBe('60');
    });

    it('adds rate limit headers to successful response', async () => {
      const request = new NextRequest('http://localhost:3000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Test question',
          model: 'gemini'
        })
      });

      const response = await POST(request);

      expect(response.headers.get('X-RateLimit-Limit')).toBe('10');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('9');
      expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
    });

    it('handles API key missing', async () => {
      delete process.env.GOOGLE_GEMINI_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Test question',
          model: 'gemini'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('API key not configured');
    });

    it('processes context correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Сколько стоит цифровизация?',
          model: 'gemini',
          context: {
            industry: 'retail',
            companySize: 'medium',
            previousInteractions: 2
          }
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.context).toBeTruthy();
      expect(data.context.intent).toBeTruthy();
    });

    it('handles network errors gracefully', async () => {
      // Мокаем ошибку сети
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      GoogleGenerativeAI.mockImplementationOnce(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockRejectedValue(new Error('Network error'))
        })
      }));

      const request = new NextRequest('http://localhost:3000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'Test question',
          model: 'gemini'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Ошибка при обработке запроса');
    });
  });
});