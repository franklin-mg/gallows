const CACHE_NAME = 'letterfall-v1';
const ASSETS = [
  './',
  './index.html',
  './the_gallows.html',
  './manifest.json',
  'https://cdn-icons-png.flaticon.com/512/3565/3565507.png'
];

// Instalación y almacenamiento en caché
self.addEventListener('install', event => {
  console.log('[Service Worker] Estado: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cacheando archivos estáticos...');
        return cache.addAll(ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Instalación completada con éxito.');
        return self.skipWaiting();
      })
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', event => {
  console.log('[Service Worker] Estado: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Ahora está listo para manejar peticiones.');
      return self.clients.claim();
    })
  );
});

// Estrategia Cache First (usar caché y si no hay, ir a red)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Cargando desde caché:', event.request.url);
          return response;
        }
        console.log('[Service Worker] Solicitando a la red:', event.request.url);
        return fetch(event.request);
      })
  );
});
