/**
 * Service Worker для NeuroExpert PWA
 * Версия: 1.0.0
 * Дата: 20.01.2025
 */

const CACHE_NAME = 'neuroexpert-v1';
const DYNAMIC_CACHE = 'neuroexpert-dynamic-v1';

// Список ресурсов для кеширования
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/_next/static/css/app/globals.css',
  // Добавьте другие статические ресурсы по мере необходимости
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('[SW] Failed to precache:', error);
      })
  );
  
  // Активировать немедленно
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Взять контроль над всеми клиентами
  self.clients.claim();
});

// Обработка fetch запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Игнорируем не-GET запросы
  if (request.method !== 'GET') {
    return;
  }
  
  // Игнорируем запросы к внешним доменам
  if (!url.origin.includes('localhost') && !url.origin.includes('neuroexpert')) {
    return;
  }
  
  // Стратегия Network First для API запросов
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirst(request)
    );
    return;
  }
  
  // Стратегия Cache First для статических ресурсов
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      cacheFirst(request)
    );
    return;
  }
  
  // Стратегия Network First с fallback для остальных
  event.respondWith(
    networkFirst(request)
  );
});

// Cache First стратегия
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network request failed:', error);
    return caches.match('/offline.html');
  }
}

// Network First стратегия
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Network error', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Проверка статических ресурсов
function isStaticAsset(pathname) {
  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', 
    '.svg', '.gif', '.webp', '.woff', '.woff2'
  ];
  
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Обработка push уведомлений
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от NeuroExpert',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
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
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Синхронизация в фоне
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Здесь можно отправить накопленную аналитику
  console.log('[SW] Syncing analytics data...');
}