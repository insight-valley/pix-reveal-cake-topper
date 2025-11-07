const CACHE_NAME = 'cake-topper-v2';
const STATIC_CACHE_NAME = 'cake-topper-static-v2';
const DYNAMIC_CACHE_NAME = 'cake-topper-dynamic-v2';

// Resources to cache immediately (only existing files)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/pwa-icons/icon-72x72.png',
  '/pwa-icons/icon-128x128.png',
  '/pwa-icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches and remove API endpoint caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Clean up any cached API endpoints (especially payment-status)
      return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return cache.keys().then((keys) => {
          return Promise.all(
            keys.map((request) => {
              const url = new URL(request.url);
              // Remove any cached API endpoints
              if (url.pathname.startsWith('/api/')) {
                console.log('Removing cached API endpoint:', url.pathname);
                return cache.delete(request);
              }
            })
          );
        });
      });
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Utility function to check if a URL scheme is cacheable
function isCacheableScheme(url) {
  const scheme = new URL(url).protocol;
  // Only cache http/https schemes, exclude chrome-extension, data, blob, etc.
  return scheme === 'http:' || scheme === 'https:';
}

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip caching for unsupported schemes (chrome-extension, data, blob, etc.)
  if (!isCacheableScheme(request.url)) {
    event.respondWith(fetch(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // Handle API requests - never cache payment status or polling endpoints
  const isPaymentStatusEndpoint = url.pathname.includes('/payment-status');
  const isPollingEndpoint = url.searchParams.has('_t'); // Timestamp param indicates polling
  
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/functions/') || url.hostname.includes('supabase')) {
    // For payment status and polling endpoints, always fetch fresh (network-only)
    if (isPaymentStatusEndpoint || isPollingEndpoint) {
      event.respondWith(fetch(request));
      return;
    }
    
    // For other API requests, use network-first strategy (only cache on offline)
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache failed API responses
          if (!response || response.status !== 200) {
            return response;
          }

          // Only cache if explicitly allowed (not payment-status)
          if (!isPaymentStatusEndpoint && !isPollingEndpoint) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              })
              .catch((error) => {
                console.warn('Failed to cache API response:', error);
              });
          }

          return response;
        })
        .catch(() => {
          // Only serve from cache if not payment-status endpoint
          if (!isPaymentStatusEndpoint && !isPollingEndpoint) {
            return caches.match(request);
          }
          // For payment-status, fail if offline (don't serve stale data)
          return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy (but never cache API endpoints)
  if (url.pathname.startsWith('/api/')) {
    // All API endpoints should bypass cache
    event.respondWith(fetch(request));
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              })
              .catch((error) => {
                console.warn('Failed to cache resource:', error, 'URL:', request.url);
              });

            return response;
          });
      })
  );
});

// Handle background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle offline actions when connection is restored
  }
});

// Handle push notifications (future feature)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/pwa-icons/icon-192x192.png',
      badge: '/pwa-icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver Topper',
          icon: '/pwa-icons/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/pwa-icons/icon-192x192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
