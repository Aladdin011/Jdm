// Service Worker for JD Marc Limited
// Provides offline functionality and performance optimizations

const CACHE_NAME = "builder-aura-v1.0.0";
const STATIC_CACHE = "builder-aura-static-v1.0.0";
const DYNAMIC_CACHE = "builder-aura-dynamic-v1.0.0";
const IMAGE_CACHE = "builder-aura-images-v1.0.0";

// Static assets to cache (avoid CRA paths; keep only assets that exist)
const STATIC_ASSETS = ["./manifest.json", "./favicon.ico"];

// Critical images to cache
const CRITICAL_IMAGES = [
  "https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6fe8dede446d44e5b3f61dac8e245b53?alt=media&token=2cd3aa20-e283-42dd-ad0a-b327725825be&apiKey=751ea84be0da437c8dd3f1bf04173189",
  "https://cdn.builder.io/api/v1/image/assets%2Fb9e926f9dca9498f8a0f99f9f9792da7%2F850832a345244408ac37832fa5cb7097?format=webp&width=800",
];

// Install event - cache static assets (resilient)
self.addEventListener("install", (event) => {
  console.log("[SW] Install event");

  const safeAddAll = async (cacheName, urls) => {
    const cache = await caches.open(cacheName);
    const results = await Promise.allSettled(
      (urls || []).map((u) => {
        try {
          const isAbsolute = /^https?:\/\//.test(u);
          const sameOrigin = isAbsolute ? u.startsWith(self.location.origin) : true;
          const req = isAbsolute && !sameOrigin ? new Request(u, { mode: "no-cors" }) : new Request(u);
          return cache.add(req);
        } catch (err) {
          console.warn("[SW] Skipping invalid URL:", u, err);
          return Promise.resolve();
        }
      }),
    );
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
      console.warn(`[SW] ${cacheName} addAll failures:`, failed.length);
    }
  };

  event.waitUntil(
    (async () => {
      console.log("[SW] Caching static assets");
      await safeAddAll(STATIC_CACHE, STATIC_ASSETS);
      console.log("[SW] Caching critical images");
      await safeAddAll(IMAGE_CACHE, CRITICAL_IMAGES);
      console.log("[SW] Installation complete");
      await self.skipWaiting();
    })(),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate event");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("[SW] Activation complete");
        // Take control of all pages immediately
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and chrome-extension requests
  if (
    !url.origin.includes("localhost") &&
    !url.origin.includes("builder-aura-field.onrender.com") &&
    !url.origin.includes("cdn.builder.io") &&
    !url.origin.includes("images.unsplash.com")
  ) {
    return;
  }

  // In dev, bypass Vite HMR and module requests entirely to avoid interference
  // This checks common Vite dev patterns: /@vite, ?t= timestamp, and .ts/.tsx source paths
  const isViteDevModule =
    url.pathname.startsWith("/@vite") ||
    url.searchParams.has("t") ||
    url.pathname.endsWith(".ts") ||
    url.pathname.endsWith(".tsx");
  if (isViteDevModule) {
    return; // Let the network handle dev modules without SW caching
  }

  // Handle different types of requests
  if (request.destination === "image") {
    event.respondWith(handleImageRequest(request));
  } else if (request.destination === "document") {
    event.respondWith(handleDocumentRequest(request));
  } else if (
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(handleStaticAssetRequest(request));
  } else if (request.destination === "font") {
    // Treat font files similar to static assets
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
    console.log("[SW] Image fetch failed:", error);
    // Return a placeholder image or empty response
    return new Response("", { status: 204, statusText: "No Content" });
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
    console.log("[SW] Document fetch failed, trying cache:", error);

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If no cache and app is in subfolder, try relative index.html
    return (
      caches.match("index.html") ||
      new Response("Offline", {
        status: 503,
        statusText: "Service Unavailable",
      })
    );
  }
}

// Handle static assets (JS, CSS) with cache-first strategy
async function handleStaticAssetRequest(request) {
  try {
    // Prefer network-first to avoid serving stale dev or invalidated assets
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    // Fallback to cache if network fails
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("", { status: 503, statusText: "Service Unavailable" });
  } catch (error) {
    console.log("[SW] Static asset fetch failed:", error);
    // Try to serve from cache
    return (
      caches.match(request) ||
      new Response("", {
        status: 503,
        statusText: "Service Unavailable",
      })
    );
  }
}

// Handle dynamic requests (API calls, etc.)
async function handleDynamicRequest(request) {
  try {
    // Network first for dynamic content
    const networkResponse = await fetch(request);

    // Cache successful GET requests
    if (request.method === "GET" && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Dynamic request failed:", error);

    // Fallback to cache for GET requests
    if (request.method === "GET") {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Return error response
    return new Response(
      JSON.stringify({
        error: "Network unavailable",
        offline: true,
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Background sync for form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form") {
    event.waitUntil(handleContactFormSync());
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
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission.data),
        });

        if (response.ok) {
          // Remove from queue on success
          await removeQueuedSubmission(submission.id);
          console.log("[SW] Form submission synced successfully");
        }
      } catch (error) {
        console.log("[SW] Form submission sync failed:", error);
      }
    }
  } catch (error) {
    console.log("[SW] Background sync failed:", error);
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
  console.log("[SW] Removing queued submission:", id);
}

// Push notification handling
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/",
    },
    actions: [
      {
        action: "view",
        title: "View Project",
        icon: "/icons/view-icon.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/dismiss-icon.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    // Open the app to the specific URL
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else if (event.action === "dismiss") {
    // Just close the notification
    console.log("[SW] Notification dismissed");
  } else {
    // Default action - open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handling for communication with main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    event.waitUntil(cacheUrls(event.data.urls));
  }
});

// Cache additional URLs dynamically
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const results = await Promise.allSettled(
      (urls || []).map((u) => {
        try {
          const isAbsolute = /^https?:\/\//.test(u);
          const sameOrigin = isAbsolute ? u.startsWith(self.location.origin) : true;
          const req = isAbsolute && !sameOrigin ? new Request(u, { mode: "no-cors" }) : new Request(u);
          return cache.add(req);
        } catch (err) {
          console.warn("[SW] Skipping invalid URL:", u, err);
          return Promise.resolve();
        }
      }),
    );
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
      console.warn(`[SW] DYNAMIC_CACHE addAll failures:`, failed.length);
    }
  } catch (e) {
    console.warn("[SW] cacheUrls failed:", e);
  }
}

// Periodic cleanup of old cache entries
setInterval(
  async () => {
    try {
      const cache = await caches.open(DYNAMIC_CACHE);
      const requests = await cache.keys();

      // Remove entries older than 24 hours
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const dateHeader = response.headers.get("date");
          if (dateHeader) {
            const responseDate = new Date(dateHeader).getTime();
            if (responseDate < oneDayAgo) {
              await cache.delete(request);
              console.log("[SW] Cleaned up old cache entry:", request.url);
            }
          }
        }
      }
    } catch (error) {
      console.log("[SW] Cache cleanup failed:", error);
    }
  },
  60 * 60 * 1000,
); // Run every hour

console.log("[SW] Service Worker loaded successfully");
