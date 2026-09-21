/* Ledger — Service Worker for PWA install on Android */
const CACHE_VERSION = 'ledger-v1';
const CORE_CACHE = CACHE_VERSION + '-core';
const RUNTIME_CACHE = CACHE_VERSION + '-runtime';

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './site.js',
  './manifest.json',
  './favicon.svg',
  './favicon.ico',
  './favicon-96.png',
  './favicon-48.png',
  './favicon-192.png',
  './og-image.svg',
  './Ledger-logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => {
      return cache.addAll(CORE_ASSETS.map(u => new Request(u, {cache: 'reload'})));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => !k.startsWith(CACHE_VERSION)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigation: network first, fallback to cache
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html').then(r2 => r2 || caches.match('./'))))
    );
    return;
  }

  // Static assets: cache first, refresh in background
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => null);
      return cached || fetched;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
