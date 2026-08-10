// Service Worker de HIGIENEX ERP
// L'ERP ja funciona sense connexió per naturalesa (totes les dades viuen
// al localStorage del navegador, sense servidor). Aquest Service Worker
// només assegura que el propi full de l'aplicació (l'HTML, el manifest i
// les icones) es puguin carregar encara que no hi hagi internet en obrir-lo.

const CACHE_NAME = 'higienex-erp-v1';
const PRECACHE_URLS = [
  './higienex_erp.html',
  './manifest-erp.json',
  './icons/icon-erp-192.png',
  './icons/icon-erp-512.png'
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
  if (req.method !== 'GET') return;

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./higienex_erp.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).catch(() => cached))
  );
});
