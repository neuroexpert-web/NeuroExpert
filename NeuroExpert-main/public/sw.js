// Service Worker для NeuroExpert PWA
// Версия: 1.0.0

const CACHE_VERSION = 'v1';
const CACHE_NAME = `neuroexpert-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Критические ресурсы для offline работы
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/fonts/inter-var.woff2',
  '/styles/critical.css',
];

// Стратегии кэширования
const CACHE_STRATEGIES = {
  // Статические ресурсы - Cache First
  static: [
    /\.(?:js|css|woff2?)$/,
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/,
  ],
  // Изображения - Cache First с обновлением
  images: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /^https:\/\/api\.dicebear\.com/,
  ],
  // API запросы - Network First
  api: [
    /\/api\//,
    /^https:\/\/generativelanguage\.googleapis\.com/,
  ],
  // HTML страницы - Network First
  documents: [
    /\.html$/,
    /\/$/,
  ],
};

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Обработка fetch запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем не-GET запросы
  if (request.method !== 'GET') return;

  // Пропускаем chrome-extension
  if (url.protocol === 'chrome-extension:') return;

  // Определяем стратегию кэширования
  const strategy = getStrategy(url, request);
  
  event.respondWith(
    strategy(request).catch(() => {
      // Fallback для offline
      if (request.destination === 'document') {
        return caches.match('/offline.html');
      }
      return new Response('Offline', { status: 503 });
    })
  );
});

// Определение стратегии по URL
function getStrategy(url, request) {
  // Проверяем статические ресурсы
  if (CACHE_STRATEGIES.static.some(pattern => pattern.test(url.href))) {
    return cacheFirst;
  }
  
  // Проверяем изображения
  if (CACHE_STRATEGIES.images.some(pattern => pattern.test(url.href))) {
    return staleWhileRevalidate;
  }
  
  // Проверяем API
  if (CACHE_STRATEGIES.api.some(pattern => pattern.test(url.href))) {
    return networkFirst;
  }
  
  // По умолчанию для документов
  return networkFirst;
}

// Cache First стратегия (для статических ресурсов)
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network First стратегия (для API и HTML)
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale While Revalidate стратегия (для изображений)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cached || fetchPromise;
}

// Обработка push уведомлений
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Background Sync для offline действий
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  // Синхронизация offline сообщений
  const cache = await caches.open('offline-queue');
  const requests = await cache.keys();
  
  return Promise.all(
    requests.map(async request => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        console.error('Sync failed:', error);
      }
    })
  );
}