// Service Worker de HIGIENEX (web pública)
// ============================================================
// Estratègia: "xarxa primer, caché com a reserva" per a TOT
// (abans només ho feia per a l'HTML; els fitxers .js com i18n.js
// es quedaven en caché per sempre i mai s'actualitzaven, encara
// que jo pugés una versió nova — per això algú amb l'app ja
// instal·lada no veia els últims canvis). Ara sempre s'intenta
// la xarxa primer; només si no hi ha connexió es fa servir la
// còpia guardada, perquè l'app segueixi obrint-se offline.

const CACHE_NAME = 'higienex-web-v3'; // ← versió pujada expressament per
                                       //   forçar que qui ja tenia l'app
                                       //   instal·lada descarti la caché vella
const PRECACHE_URLS = [
  './index.html',
  './i18n.js',
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

  // Xarxa primer per a TOT (HTML, JS, JSON, icones): si hi ha connexió,
  // sempre es veu la versió publicada més recent. Si falla (sense
  // internet), es fa servir la còpia guardada perquè l'app segueixi
  // funcionant offline.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => {
          if (cached) return cached;
          const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
          return isHTML ? caches.match('./index.html') : undefined;
        })
      )
  );
});
