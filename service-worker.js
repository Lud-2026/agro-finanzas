const CACHE_NAME = 'agro-finanzas-v1';

// Solo archivos que realmente existen en el proyecto.
const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Solo se maneja GET; otros métodos pasan directo a la red.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((respuestaCacheada) => {
      if (respuestaCacheada) return respuestaCacheada;

      return fetch(event.request)
        .then((respuestaRed) => {
          // Si la respuesta es válida, se guarda una copia para uso futuro sin conexión.
          if (respuestaRed && respuestaRed.status === 200) {
            const copia = respuestaRed.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          }
          return respuestaRed;
        })
        .catch(() => {
          // Sin conexión y sin copia en caché: si se pedía una página, se muestra el shell.
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
