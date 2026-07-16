const CACHE_NAME = "unittogo-cache-v1";
const ASSETS_TO_CACHE = [
  "/favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle local GET requests
  if (event.request.method !== "GET") return;
  
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache static assets dynamically
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const isStaticAsset = url.pathname.startsWith("/_next/") || 
                              url.pathname.endsWith(".svg") || 
                              url.pathname.endsWith(".css") || 
                              url.pathname.endsWith(".js") ||
                              url.pathname.endsWith(".woff2");

        if (isStaticAsset) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      }).catch(() => {
        // Fallback for offline usage
        return caches.match("/");
      });
    })
  );
});
