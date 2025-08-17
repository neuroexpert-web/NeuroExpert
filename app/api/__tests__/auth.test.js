import { POST, GET } from '../admin/auth/route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Мокаем rate limiting
jest.mock('../../../middleware/rateLimit', () => ({
  rateLimitMiddleware: jest.fn().mockReturnValue(() => ({
    headers: {
      'X-RateLimit-Limit': '5',
      'X-RateLimit-Remaining': '4',
      'X-RateLimit-Reset': Date.now() + 900000
    }
  }))
}));

describe('Admin Auth API Route', () => {
  const TEST_PASSWORD = 'test-password-123';
  const TEST_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 10);
  const JWT_SECRET = 'test-jwt-secret';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.ADMIN_PASSWORD_HASH = TEST_PASSWORD_HASH;
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.ADMIN_PASSWORD_HASH;
  });

  describe('POST /api/admin/auth', () => {
    it('returns JWT token for correct password', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: TEST_PASSWORD
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('expiresIn');
      
      // Проверяем валидность токена
      const decoded = jwt.verify(data.token, JWT_SECRET);
      expect(decoded).toHaveProperty('admin', true);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('returns 400 for missing password', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Password is required');
    });

    it('returns 401 for incorrect password', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'wrong-password'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid password');
    });

    it('handles rate limiting', async () => {
      // Мокаем превышение лимита
      const { rateLimitMiddleware } = require('../../../middleware/rateLimit');
      rateLimitMiddleware.mockReturnValueOnce(() => 
        new Response(
          JSON.stringify({
            error: 'Too many requests',
            message: 'Rate limit exceeded. Try again in 900 seconds.',
            retryAfter: 900
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '900'
            }
          }
        )
      );

      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: TEST_PASSWORD
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Too many requests');
      expect(response.headers.get('Retry-After')).toBe('900');
    });

    it('adds rate limit headers to response', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: TEST_PASSWORD
        })
      });

      const response = await POST(request);

      expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('4');
      expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
    });

    it('handles JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Internal server error');
    });
  });

  describe('GET /api/admin/auth', () => {
    it('validates correct JWT token', async () => {
      const validToken = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });

      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${validToken}`
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
    });

    it('rejects missing token', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'GET'
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.valid).toBe(false);
    });

    it('rejects invalid token', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.valid).toBe(false);
    });

    it('rejects expired token', async () => {
      const expiredToken = jwt.sign(
        { admin: true }, 
        JWT_SECRET, 
        { expiresIn: '-1h' } // Уже истек
      );

      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${expiredToken}`
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.valid).toBe(false);
    });

    it('handles malformed authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'GET',
        headers: {
          'Authorization': 'InvalidFormat'
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.valid).toBe(false);
    });
  });

  describe('Security', () => {
    it('does not expose password hash in errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'wrong-password'
        })
      });

      const response = await POST(request);
      const data = await response.json();
      const responseText = JSON.stringify(data);

      expect(responseText).not.toContain(TEST_PASSWORD_HASH);
      expect(responseText).not.toContain(TEST_PASSWORD);
    });

    it('does not expose JWT secret in errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });

      const response = await GET(request);
      const data = await response.json();
      const responseText = JSON.stringify(data);

      expect(responseText).not.toContain(JWT_SECRET);
    });
  });
});