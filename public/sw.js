// Rise – Habit Tracker & Smart Sleep
// Service Worker for PWA and Offline Support

const CACHE_NAME = 'rise-v1.4.0';
const RUNTIME_CACHE = 'rise-runtime-v1.4.0';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/rise-icon.png',
  '/shortcut-icon-96.png',
  '/shortcut-icon-192.png',
  '/screenshot-1.png',
  '/screenshot-2.png',
  '/screenshot-3.png',
  '/screenshot-4.png'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network First for app files, Cache First for images
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  const isAppFile = url.pathname.endsWith('.html') || 
                    url.pathname.endsWith('.js') || 
                    url.pathname.endsWith('.css') ||
                    url.pathname === '/' ||
                    url.pathname.startsWith('/assets/');
  
  const isImage = url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/);

  // Network First strategy for app files (HTML, JS, CSS)
  if (isAppFile) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the new version
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Cache First strategy for images
  if (isImage) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for habit data (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-habits') {
    event.waitUntil(syncHabits());
  }
});

async function syncHabits() {
  // Placeholder for future sync functionality
  console.log('[Service Worker] Background sync triggered');
}

// Push notification support (optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time to rise!',
    icon: '/favicon.png',
    badge: '/favicon.png',
    vibrate: [200, 100, 200],
    tag: 'rise-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Rise – Habit Tracker', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[Service Worker] Loaded successfully');
