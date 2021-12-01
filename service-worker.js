/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-638ae17';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./obsluhoval_jsem_anglickeho_krale_001.html","./obsluhoval_jsem_anglickeho_krale_002.html","./obsluhoval_jsem_anglickeho_krale_003.html","./obsluhoval_jsem_anglickeho_krale_005.html","./obsluhoval_jsem_anglickeho_krale_006.html","./obsluhoval_jsem_anglickeho_krale_007.html","./obsluhoval_jsem_anglickeho_krale_008.html","./obsluhoval_jsem_anglickeho_krale_009.html","./obsluhoval_jsem_anglickeho_krale_011.html","./resources.html","./resources/image001_fmt.png","./resources/image002_fmt.png","./resources/index.xml","./resources/kocka_fmt.png","./resources/obalka_obsluhoval_jsem__fmt.png","./resources/upoutavka_eknihy_fmt.png","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
