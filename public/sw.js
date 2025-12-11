// Rise – Habit Tracker & Smart Sleep
// Production-Ready Service Worker for TWA Cold Start Optimization
// Fixes: White screen on first open from Play Store closed test

const CACHE_NAME = 'rise-cache-v1.0.2';

// Critical assets to precache for instant TWA load
const urlsToCache = [
  '/', // Cache root for instant load
  '/index.html',
  '/manifest.json',
  '/rise-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/shortcut-icon-96.png',
  '/shortcut-icon-192.png',
  // Main JS/CSS bundles - automatically updated by update-sw-bundles.js
  '/assets/index-Bznz0BtU.css',
  '/assets/index--704Vzg6.js',
];

// Install event — aggressively precache everything for cold start
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v1.0.2 - TWA cold start optimization');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching critical assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[SW] Precache complete, activating immediately');
        return self.skipWaiting(); // Activate immediately, no waiting
      })
      .catch((error) => {
        console.error('[SW] Precache failed:', error);
        // Continue anyway to avoid blocking
        return self.skipWaiting();
      })
  );
});

// Activate event — clean old caches and take control immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v1.0.2');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Taking control of all pages');
        return self.clients.claim(); // Take control of all pages immediately
      })
  );
});

// Fetch event — optimized for TWA cold start
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
  
  // Network-first for root/index.html (always get latest)
  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the new version
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, use cache
          console.log('[SW] Network failed for root, using cache');
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache-first for all assets (JS, CSS, images) - instant load
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Cache hit - return immediately for instant load
          return cachedResponse;
        }
        
        // Cache miss - fetch from network and cache
        return fetch(event.request)
          .then((response) => {
            // Only cache successful responses
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            // Return offline page or error response
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

// Handle messages from clients - support skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// Push notification support for habit reminders
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time to complete your habits!',
    icon: '/rise-icon.png',
    badge: '/rise-icon.png',
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

console.log('[SW] Rise Service Worker v1.0.2 loaded - TWA cold start optimized');
