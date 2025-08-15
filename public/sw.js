// Service Worker для NeuroExpert PWA
const CACHE_NAME = 'neuroexpert-v1';
const RUNTIME_CACHE = 'neuroexpert-runtime';

// Ресурсы для предварительного кэширования
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/offline.html'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Стратегия кэширования
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем запросы к внешним API
  if (url.origin !== location.origin) {
    return;
  }

  // Пропускаем POST запросы и API вызовы
  if (request.method !== 'GET' || url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/')) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Возвращаем из кэша и обновляем в фоне
        event.waitUntil(
          fetch(request).then(response => {
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
          }).catch(() => {})
        );
        return cachedResponse;
      }

      // Если нет в кэше, загружаем из сети
      return fetch(request).then(response => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseClone = response.clone();
        
        // Кэшируем только важные ресурсы
        if (shouldCache(request)) {
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }

        return response;
      }).catch(() => {
        // Возвращаем офлайн страницу для навигационных запросов
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

// Определяем что кэшировать
function shouldCache(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Кэшируем статические ресурсы
  return pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?)$/i) ||
         pathname.startsWith('/_next/static/') ||
         pathname === '/';
}

// Обработка push уведомлений (для будущего)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от NeuroExpert',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('NeuroExpert', options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});