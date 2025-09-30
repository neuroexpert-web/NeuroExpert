const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 10000; // Render использует переменную PORT

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Добавляем заголовки для правильной работы
      res.setHeader('X-Powered-By', 'NeuroExpert');
      
      // Кэширование статических ресурсов
      if (req.url.startsWith('/_next/static') || req.url.startsWith('/static')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      
      // Обработка CSS файлов
      if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
      
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Security: Log configuration status only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('> Configuration status:', {
        GEMINI_API: !!process.env.GOOGLE_GEMINI_API_KEY,
        TELEGRAM: !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID
      });
    }
  });
});