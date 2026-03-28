// ============================================
// Universal Hunt — Service Worker
// ============================================
// Caches the app shell so it works offline.
// Uses a "stale-while-revalidate" strategy for
// most assets and "cache-first" for static files.
// ============================================

const CACHE_NAME = 'universal-hunt-v1';

// Files that make up the core app shell
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// ── Install: pre-cache the app shell ────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  // Activate immediately instead of waiting
  self.skipWaiting();
});

// ── Activate: clean up old caches ───────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open pages immediately
  self.clients.claim();
});

// ── Fetch: serve from cache, update in background ──
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip mapbox tile requests (too large to cache)
  if (request.url.includes('mapbox.com') || request.url.includes('tiles.mapbox')) {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      // Fetch fresh copy in the background
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // Only cache successful responses
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed — return nothing (cached version handles it)
        });

      // Return cached version immediately, or wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
