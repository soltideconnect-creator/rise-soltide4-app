// Rise – Habit Tracker & Smart Sleep
// Production-Ready Service Worker for TWA Cold Start Optimization
// v1.0.3 - Fixed white screen issue with resilient caching

const CACHE_NAME = 'rise-cache-v1.0.3';

// Critical assets to precache - only essential files to avoid blocking
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Optional assets - cache if available, don't block if missing
const optionalAssets = [
  '/rise-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/shortcut-icon-96.png',
  '/shortcut-icon-192.png',
];

// Install event — resilient precaching that won't cause white screen
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v1.0.3 - Resilient caching');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching critical assets');
        
        // Cache critical assets one by one, continue on failure
        const cachePromises = urlsToCache.map(url => {
          return cache.add(url).catch(error => {
            console.warn('[SW] Failed to cache:', url, error);
            // Don't throw, just log and continue
            return Promise.resolve();
          });
        });
        
        // Cache optional assets without blocking
        optionalAssets.forEach(url => {
          cache.add(url).catch(error => {
            console.warn('[SW] Optional asset not cached:', url);
          });
        });
        
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('[SW] Install complete, activating immediately');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Install failed:', error);
        // Still skip waiting to avoid blocking the app
        return self.skipWaiting();
      })
  );
});

// Activate event — clean old caches and take control immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v1.0.3');
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
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('[SW] Activation error:', error);
        // Still claim clients to avoid blocking
        return self.clients.claim();
      })
  );
});

// Fetch event — network-first strategy to avoid white screen
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
  
  // Network-first for all requests to ensure fresh content
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for offline use
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(error => {
              console.warn('[SW] Failed to cache response:', error);
            });
          });
        }
        return response;
      })
      .catch((error) => {
        console.warn('[SW] Network failed, trying cache:', error);
        // Network failed, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // No cache, return error page
            if (url.pathname === '/' || url.pathname === '/index.html') {
              return new Response(
                '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
                { 
                  status: 503, 
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'text/html' }
                }
              );
            }
            throw error;
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

console.log('[SW] Rise Service Worker v1.0.3 loaded - Resilient caching, no white screen');
