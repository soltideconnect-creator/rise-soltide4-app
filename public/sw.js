// Rise – Habit Tracker & Smart Sleep
// Production-Ready Service Worker for TWA Cold Start Optimization
// v1.0.5 - Enhanced error handling and crash prevention

const CACHE_NAME = 'rise-cache-v1.0.5';
const OLD_CACHES = ['rise-cache-v1.0.4', 'rise-cache-v1.0.3', 'rise-cache-v1.0.2', 'rise-cache-v1.0.1', 'rise-cache-v1.0.0'];

// ============================================================================
// GLOBAL ERROR HANDLER FOR SERVICE WORKER
// ============================================================================
self.addEventListener('error', (event) => {
  console.error('🚨 [SW Error]', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    timestamp: new Date().toISOString()
  });
  
  // Prevent service worker from crashing
  event.preventDefault();
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 [SW Unhandled Rejection]', {
    reason: event.reason,
    timestamp: new Date().toISOString()
  });
  
  // Prevent service worker from crashing
  event.preventDefault();
});

console.log('[SW] Error handlers initialized');
// ============================================================================

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
  console.log('[SW] Installing v1.0.5 - Enhanced error handling');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[SW] Caching critical assets');
        
        // Cache critical assets one by one, continue on failure
        const cachePromises = urlsToCache.map(async (url) => {
          try {
            await cache.add(url);
            console.log('[SW] Cached:', url);
          } catch (error) {
            console.warn('[SW] Failed to cache:', url, error);
            // Don't throw, just log and continue
          }
        });
        
        // Cache optional assets without blocking
        optionalAssets.forEach(async (url) => {
          try {
            await cache.add(url);
            console.log('[SW] Cached optional:', url);
          } catch (error) {
            console.warn('[SW] Optional asset not cached:', url);
          }
        });
        
        await Promise.all(cachePromises);
        console.log('[SW] Install complete, activating immediately');
        await self.skipWaiting();
      } catch (error) {
        console.error('[SW] Install failed:', error);
        // Still skip waiting to avoid blocking the app
        await self.skipWaiting();
      }
    })()
  );
});

// Activate event — clean old caches aggressively and take control immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v1.0.5 - Cleaning old caches');
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        // Delete ALL old caches, including specific old versions
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              try {
                await caches.delete(cacheName);
              } catch (error) {
                console.warn('[SW] Failed to delete cache:', cacheName, error);
              }
            }
          })
        );
        
        console.log('[SW] Taking control of all pages');
        await self.clients.claim();
      } catch (error) {
        console.error('[SW] Activation error:', error);
        // Still claim clients to avoid blocking
        try {
          await self.clients.claim();
        } catch (claimError) {
          console.error('[SW] Failed to claim clients:', claimError);
        }
      }
    })()
  );
});

// Fetch event — network-first strategy with robust error handling
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
    (async () => {
      try {
        // Try network first
        const response = await fetch(event.request);
        
        // Cache successful responses for offline use
        if (response && response.status === 200) {
          try {
            const responseToCache = response.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, responseToCache);
          } catch (cacheError) {
            console.warn('[SW] Failed to cache response:', cacheError);
            // Don't throw, just log
          }
        }
        
        return response;
      } catch (networkError) {
        console.warn('[SW] Network failed, trying cache:', networkError);
        
        try {
          // Network failed, try cache
          const cachedResponse = await caches.match(event.request);
          
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', event.request.url);
            return cachedResponse;
          }
          
          // No cache, return offline page for HTML requests
          if (url.pathname === '/' || url.pathname === '/index.html' || event.request.headers.get('accept')?.includes('text/html')) {
            return new Response(
              `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline - Streak</title>
                <style>
                  * { margin: 0; padding: 0; box-sizing: border-box; }
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                  }
                  .container {
                    text-align: center;
                    max-width: 400px;
                  }
                  .icon { font-size: 64px; margin-bottom: 20px; }
                  h1 { font-size: 28px; margin-bottom: 12px; font-weight: 600; }
                  p { font-size: 16px; opacity: 0.9; margin-bottom: 24px; line-height: 1.5; }
                  button {
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                  }
                  button:active { transform: scale(0.95); }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="icon">📡</div>
                  <h1>You're Offline</h1>
                  <p>Please check your internet connection and try again.</p>
                  <button onclick="window.location.reload()">Try Again</button>
                </div>
              </body>
              </html>`,
              { 
                status: 503, 
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
              }
            );
          }
          
          // For other resources, return a generic error
          return new Response('Network error', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        } catch (cacheError) {
          console.error('[SW] Cache lookup failed:', cacheError);
          
          // Last resort: return a minimal error response
          return new Response('Service worker error', {
            status: 500,
            statusText: 'Internal Server Error',
            headers: { 'Content-Type': 'text/plain' }
          });
        }
      }
    })()
  );
});

// Handle messages from clients - support skipWaiting
self.addEventListener('message', (event) => {
  try {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      console.log('[SW] Received SKIP_WAITING message');
      self.skipWaiting();
    }
  } catch (error) {
    console.error('[SW] Message handler error:', error);
  }
});

// Push notification support for habit reminders
self.addEventListener('push', (event) => {
  try {
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
        .catch(error => {
          console.error('[SW] Failed to show notification:', error);
        })
    );
  } catch (error) {
    console.error('[SW] Push event error:', error);
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  try {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/')
        .catch(error => {
          console.error('[SW] Failed to open window:', error);
        })
    );
  } catch (error) {
    console.error('[SW] Notification click error:', error);
  }
});

console.log('[SW] Rise Service Worker v1.0.5 loaded - Enhanced error handling and crash prevention');
