// AquaRoute Sovereign AI - Service Worker
const CACHE_NAME = 'aquaroute-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Do not intercept non-GET or cross-origin API calls like localhost Ollama
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  
  if (url.origin !== self.location.origin) {
    // Let external requests (e.g. Ollama localhost or external APIs) proceed directly
    return;
  }

  // Network-first strategy for HTML pages, cache-first for static assets
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match('/');
        return cachedResponse || new Response('Offline - AquaRoute App Shell', {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
        );
      })
    );
  }
});
