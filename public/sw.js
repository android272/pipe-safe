self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pipe-safe-cache').then((cache) => {
      return cache.addAll([
        '/pipe-safe/',
        '/pipe-safe/index.html',
        '/pipe-safe/assets/index-FP0AvaFm.js',
        '/pipe-safe/assets/index-Cc7c7WDe.css',
        '/pipe-safe/safe.svg',
        '/pipe-safe/warning.svg',
        '/pipe-safe/error.svg',
        '/pipe-safe/not-safe.svg'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});