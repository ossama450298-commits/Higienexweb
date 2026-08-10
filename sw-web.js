// Service Worker de HIGIENEX (web pública)
// Estratègia: "network first, cache fallback" per a la pàgina principal
// (així sempre es veu la versió més nova quan hi ha connexió, però
// segueix obrint-se si el mòbil es queda sense internet), i
// "cache first" per a les icones i el manifest, que no canvien sovint.

const CACHE_NAME = 'higienex-web-v1';
const PRECACHE_URLS = [
  './index.html',
  './manifest-web.json',
  './icons/icon-web-192.png',
  './icons/icon-web-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // no interferir amb POST (formularis, xat, EmailJS...)

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // Xarxa primer, per veure sempre la versió publicada més recent
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Recursos estàtics (icones, manifest): cache primer, xarxa com a reforç
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).catch(() => cached))
  );
});
