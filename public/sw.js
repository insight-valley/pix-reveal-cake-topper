const CACHE_NAME = 'cake-topper-v1';
const STATIC_CACHE_NAME = 'cake-topper-static-v1';
const DYNAMIC_CACHE_NAME = 'cake-topper-dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/pwa-icons/icon-192x192.png',
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

// Activate event - clean up old caches
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
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

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

  // Handle API requests
  if (url.pathname.startsWith('/functions/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache failed API responses
          if (!response || response.status !== 200) {
            return response;
          }

          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });

          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
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