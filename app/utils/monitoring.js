// Простая система мониторинга ошибок для NeuroExpert
// Логирует ошибки и отправляет критические уведомления в Telegram

class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.telegramEnabled = !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID;
  }

  // Логирование ошибки
  async logError(error, context = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error',
      stack: error.stack,
      context,
      url: context.url || 'unknown',
      userAgent: context.userAgent || 'unknown',
      ip: context.ip || 'unknown'
    };

    // Добавляем в массив ошибок
    this.errors.unshift(errorData);
    
    // Ограничиваем размер массива
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Логируем в консоль
    console.error('[ERROR MONITOR]', errorData);

    // Отправляем критические ошибки в Telegram
    if (this.shouldNotify(error)) {
      await this.sendTelegramNotification(errorData);
    }

    // Сохраняем в лог файл (если нужно)
    if (process.env.NODE_ENV === 'production') {
      await this.saveToLogFile(errorData);
    }

    return errorData;
  }

  // Определяем, нужно ли отправлять уведомление
  shouldNotify(error) {
    // Критические ошибки, требующие немедленного внимания
    const criticalKeywords = [
      'database',
      'authentication',
      'payment',
      'security',
      'rate limit',
      'api key',
      'critical',
      'fatal'
    ];

    const message = (error.message || '').toLowerCase();
    return criticalKeywords.some(keyword => message.includes(keyword));
  }

  // Отправка уведомления в Telegram
  async sendTelegramNotification(errorData) {
    if (!this.telegramEnabled) return;

    const message = `
🚨 *КРИТИЧЕСКАЯ ОШИБКА В NEUROEXPERT*

📅 *Время:* ${new Date(errorData.timestamp).toLocaleString('ru-RU')}
❌ *Ошибка:* ${errorData.message}
📍 *URL:* ${errorData.url}
🔍 *Контекст:* ${JSON.stringify(errorData.context, null, 2)}

⚠️ Требуется немедленная проверка!
    `.trim();

    try {
      const response = await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        console.error('Failed to send Telegram notification');
      }
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
    }
  }

  // Сохранение в лог файл (заглушка)
  async saveToLogFile(errorData) {
    // В production можно подключить запись в файл или внешний сервис
    // Пока просто логируем факт попытки сохранения
    console.log('[ERROR MONITOR] Would save to log file:', errorData.timestamp);
  }

  // Получение статистики ошибок
  getStats() {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;

    const lastHour = this.errors.filter(e => 
      now - new Date(e.timestamp).getTime() < hour
    ).length;

    const lastDay = this.errors.filter(e => 
      now - new Date(e.timestamp).getTime() < day
    ).length;

    const byUrl = {};
    this.errors.forEach(e => {
      byUrl[e.url] = (byUrl[e.url] || 0) + 1;
    });

    return {
      total: this.errors.length,
      lastHour,
      lastDay,
      byUrl,
      latest: this.errors.slice(0, 10)
    };
  }

  // Очистка старых ошибок
  cleanup() {
    const day = 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - day;
    
    this.errors = this.errors.filter(e => 
      new Date(e.timestamp).getTime() > cutoff
    );
  }
}

// Singleton экземпляр
const errorMonitor = new ErrorMonitor();

// Глобальный обработчик ошибок для браузера
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorMonitor.logError(event.error || new Error(event.message), {
      url: window.location.href,
      userAgent: navigator.userAgent,
      type: 'window.error'
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorMonitor.logError(new Error(event.reason), {
      url: window.location.href,
      userAgent: navigator.userAgent,
      type: 'unhandledrejection'
    });
  });
}

// Периодическая очистка (каждый час)
if (typeof setInterval !== 'undefined') {
  setInterval(() => errorMonitor.cleanup(), 60 * 60 * 1000);
}

export default errorMonitor;