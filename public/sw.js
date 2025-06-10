// Enhanced Service Worker for English Project PWA
const CACHE_VERSION = "2.0.0";
const CACHE_NAME = `english-project-v${CACHE_VERSION}`;
const STATIC_CACHE = `english-project-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `english-project-dynamic-v${CACHE_VERSION}`;
const IMAGE_CACHE = `english-project-images-v${CACHE_VERSION}`;
const FONT_CACHE = `english-project-fonts-v${CACHE_VERSION}`;

// Cache duration settings (in milliseconds)
const CACHE_DURATIONS = {
  static: 30 * 24 * 60 * 60 * 1000, // 30 days
  dynamic: 7 * 24 * 60 * 60 * 1000, // 7 days
  images: 14 * 24 * 60 * 60 * 1000, // 14 days
  fonts: 365 * 24 * 60 * 60 * 1000, // 1 year
};

// Resources to cache immediately
const STATIC_ASSETS = [
  "/",
  "/blog/",
  "/about/",
  "/categories/",
  "/levels/",
  "/manifest.json",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html",
  // Critical CSS and JS files
  "/src/styles/main.css",
];

// Network-first resources (always try network first)
const NETWORK_FIRST_PATTERNS = [/\/api\//, /\/blog\/.*\.json$/, /\/search/];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  /\.(?:woff2|woff|ttf|eot)$/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
];

// Stale-while-revalidate resources
const STALE_WHILE_REVALIDATE_PATTERNS = [
  /\/blog\//,
  /\/categories\//,
  /\/levels\//,
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log(`Service Worker v${CACHE_VERSION}: Installing...`);

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static assets", error);
      })
  );

  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log(`Service Worker v${CACHE_VERSION}: Activating...`);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== IMAGE_CACHE &&
            cacheName !== FONT_CACHE
          ) {
            console.log("Service Worker: Deleting old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Utility function to determine cache strategy
function getCacheStrategy(request) {
  const url = request.url;

  if (NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(url))) {
    return "network-first";
  }

  if (CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(url))) {
    return "cache-first";
  }

  if (STALE_WHILE_REVALIDATE_PATTERNS.some((pattern) => pattern.test(url))) {
    return "stale-while-revalidate";
  }

  return "network-first"; // Default strategy
}

// Utility function to get appropriate cache name
function getCacheName(request) {
  const url = request.url;

  if (/\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/.test(url)) {
    return IMAGE_CACHE;
  }

  if (/\.(?:woff2|woff|ttf|eot)$/.test(url) || /fonts\.g/.test(url)) {
    return FONT_CACHE;
  }

  return DYNAMIC_CACHE;
}

// Network-first strategy
async function networkFirst(request) {
  const cacheName = getCacheName(request);

  try {
    const response = await fetch(request);

    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || createOfflineResponse(request);
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cacheName = getCacheName(request);
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Check if cache is expired
    const cacheTime = await getCacheTime(request);
    const maxAge = getCacheMaxAge(request);

    if (cacheTime && Date.now() - cacheTime < maxAge) {
      return cachedResponse;
    }
  }

  try {
    const response = await fetch(request);

    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
      await setCacheTime(request);
    }

    return response;
  } catch (error) {
    return cachedResponse || createOfflineResponse(request);
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cacheName = getCacheName(request);
  const cachedResponse = await caches.match(request);

  // Fetch in the background and update cache
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.status === 200) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => null);

  return (
    cachedResponse || (await fetchPromise) || createOfflineResponse(request)
  );
}

// Cache time utilities
async function getCacheTime(request) {
  try {
    const cache = await caches.open("cache-timestamps");
    const response = await cache.match(request.url);
    if (response) {
      return parseInt(await response.text());
    }
  } catch (error) {
    console.error("Error getting cache time:", error);
  }
  return null;
}

async function setCacheTime(request) {
  try {
    const cache = await caches.open("cache-timestamps");
    const timestamp = Date.now().toString();
    const response = new Response(timestamp);
    await cache.put(request.url, response);
  } catch (error) {
    console.error("Error setting cache time:", error);
  }
}

function getCacheMaxAge(request) {
  const url = request.url;

  if (/\.(?:woff2|woff|ttf|eot)$/.test(url) || /fonts\.g/.test(url)) {
    return CACHE_DURATIONS.fonts;
  }

  if (/\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/.test(url)) {
    return CACHE_DURATIONS.images;
  }

  if (STATIC_ASSETS.includes(new URL(url).pathname)) {
    return CACHE_DURATIONS.static;
  }

  return CACHE_DURATIONS.dynamic;
}

// Create offline response
function createOfflineResponse(request) {
  if (request.destination === "document") {
    return (
      caches.match("/offline.html") ||
      caches.match("/") ||
      new Response(
        `
             <!DOCTYPE html>
             <html>
               <head>
                 <title>Offline - English Project</title>
                 <meta name="viewport" content="width=device-width, initial-scale=1">
                 <style>
                   body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                          text-align: center; padding: 50px 20px; background: #f8fafc; }
                   .offline-container { max-width: 400px; margin: 0 auto; }
                   .offline-icon { font-size: 4rem; margin-bottom: 20px; }
                   h1 { color: #1e293b; margin-bottom: 10px; }
                   p { color: #64748b; line-height: 1.6; }
                   .retry-btn { background: #3b82f6; color: white; border: none; 
                               padding: 12px 24px; border-radius: 8px; cursor: pointer; 
                               font-size: 16px; margin-top: 20px; }
                 </style>
               </head>
               <body>
                 <div class="offline-container">
                   <div class="offline-icon">📚</div>
                   <h1>You're Offline</h1>
                   <p>It looks like you're not connected to the internet. Check your connection and try again.</p>
                   <button class="retry-btn" onclick="location.reload()">Try Again</button>
                 </div>
               </body>
             </html>
           `,
        {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }
      )
    );
  }

  if (request.destination === "image") {
    return new Response(
      `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect fill="#f1f5f9" width="200" height="200"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="16" fill="#64748b">
          Image unavailable offline
        </text>
      </svg>
    `,
      {
        status: 200,
        headers: { "Content-Type": "image/svg+xml" },
      }
    );
  }

  return new Response("Content unavailable offline", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

// Enhanced fetch event handler
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith("http")) {
    return;
  }

  const strategy = getCacheStrategy(event.request);

  event.respondWith(
    (async () => {
      switch (strategy) {
        case "network-first":
          return await networkFirst(event.request);
        case "cache-first":
          return await cacheFirst(event.request);
        case "stale-while-revalidate":
          return await staleWhileRevalidate(event.request);
        default:
          return await networkFirst(event.request);
      }
    })()
  );
});

// Enhanced background sync
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Sync any pending data, update caches, etc.
      Promise.all([updateCriticalResources(), cleanupExpiredCaches()])
    );
  }
});

// Update critical resources
async function updateCriticalResources() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const criticalUrls = ["/", "/blog/", "/manifest.json"];

    await Promise.all(
      criticalUrls.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.log(`Failed to update ${url}:`, error);
        }
      })
    );
  } catch (error) {
    console.error("Error updating critical resources:", error);
  }
}

// Cleanup expired caches
async function cleanupExpiredCaches() {
  try {
    const cacheNames = [DYNAMIC_CACHE, IMAGE_CACHE];

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const cacheTime = await getCacheTime(request);
        const maxAge = getCacheMaxAge(request);

        if (cacheTime && Date.now() - cacheTime > maxAge) {
          await cache.delete(request);
          console.log(`Deleted expired cache entry: ${request.url}`);
        }
      }
    }
  } catch (error) {
    console.error("Error cleaning up expired caches:", error);
  }
}

// Enhanced push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");

  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      data = { title: "English Project", body: event.data.text() };
    }
  }

  const options = {
    body: data.body || "New English lesson available! 📚",
    icon: "/icon-192.png",
    badge: "/favicon.svg",
    vibrate: [100, 50, 100],
    requireInteraction: false,
    silent: false,
    data: {
      url: data.url || "/",
      timestamp: Date.now(),
    },
    actions: [
      {
        action: "open",
        title: "Open Lesson",
        icon: "/favicon.svg",
      },
      {
        action: "close",
        title: "Dismiss",
        icon: "/favicon.svg",
      },
    ],
    tag: "english-project-notification",
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "English Project", options)
  );
});

// Enhanced notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked", event);

  event.notification.close();

  if (event.action === "open" || !event.action) {
    const url = event.notification.data?.url || "/";

    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        // Open new window/tab if not found
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Enhanced message handler
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "content-sync") {
    event.waitUntil(updateCriticalResources());
  }
});

console.log(`Service Worker v${CACHE_VERSION}: Script loaded`);
