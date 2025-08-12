// Service Worker for JD Marc Limited
// Provides offline functionality and performance optimizations

const CACHE_NAME = 'jdmarc-v1.0.0';
const STATIC_CACHE = 'jdmarc-static-v1.0.0';
const DYNAMIC_CACHE = 'jdmarc-dynamic-v1.0.0';
const IMAGE_CACHE = 'jdmarc-images-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
];

// Critical images to cache
const CRITICAL_IMAGES = [
  'https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6fe8dede446d44e5b3f61dac8e245b53?alt=media&token=2cd3aa20-e283-42dd-ad0a-b327725825be&apiKey=751ea84be0da437c8dd3f1bf04173189',
  'https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F850832a345244408ac37832fa5cb7097?format=webp&width=800',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache critical images
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('[SW] Caching critical images');
        return cache.addAll(CRITICAL_IMAGES);
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests and chrome-extension requests
  if (!url.origin.includes('localhost') && 
      !url.origin.includes('jdmarcng.com') && 
      !url.origin.includes('cdn.builder.io') && 
      !url.origin.includes('images.unsplash.com') &&
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com')) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === 'document') {
    event.respondWith(handleDocumentRequest(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(handleStaticAssetRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Image fetch failed:', error);
    // Return a placeholder image or empty response
    return new Response('', { status: 204, statusText: 'No Content' });
  }
}

// Handle document requests (HTML pages)
async function handleDocumentRequest(request) {
  try {
    // Network first for HTML documents to get fresh content
    const networkResponse = await fetch(request);
    
    // Cache the response
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Document fetch failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, return offline page
    return caches.match('/') || new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Handle static assets (JS, CSS) with cache-first strategy
async function handleStaticAssetRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Static asset fetch failed:', error);
    // Try to serve from cache
    return caches.match(request) || new Response('', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Handle dynamic requests (API calls, etc.)
async function handleDynamicRequest(request) {
  try {
    // Network first for dynamic content
    const networkResponse = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Dynamic request failed:', error);
    
    // Fallback to cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Return error response
    return new Response(JSON.stringify({ 
      error: 'Network unavailable',
      offline: true 
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(
      handleContactFormSync()
    );
  }
});

// Handle background sync for contact forms
async function handleContactFormSync() {
  try {
    // Retrieve queued form submissions from IndexedDB
    const submissions = await getQueuedSubmissions();
    
    for (const submission of submissions) {
      try {
        // Attempt to submit the form
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data),
        });
        
        if (response.ok) {
          // Remove from queue on success
          await removeQueuedSubmission(submission.id);
          console.log('[SW] Form submission synced successfully');
        }
      } catch (error) {
        console.log('[SW] Form submission sync failed:', error);
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

// IndexedDB helpers for offline form submissions
async function getQueuedSubmissions() {
  // This would integrate with IndexedDB to store/retrieve form submissions
  // Implementation depends on your form handling strategy
  return [];
}

async function removeQueuedSubmission(id) {
  // Remove submission from IndexedDB after successful sync
  console.log('[SW] Removing queued submission:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
    actions: [
      {
        action: 'view',
        title: 'View Project',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app to the specific URL
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    console.log('[SW] Notification dismissed');
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.urls)
    );
  }
});

// Cache additional URLs dynamically
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  return cache.addAll(urls);
}

// Periodic cleanup of old cache entries
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Remove entries older than 24 hours
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (responseDate < oneDayAgo) {
            await cache.delete(request);
            console.log('[SW] Cleaned up old cache entry:', request.url);
          }
        }
      }
    }
  } catch (error) {
    console.log('[SW] Cache cleanup failed:', error);
  }
}, 60 * 60 * 1000); // Run every hour

console.log('[SW] Service Worker loaded successfully');
