const CACHE_NAME = 'lab-camelot-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/home.html',
  '/curso-manguebeat.html',
  '/style.css',
  'https://i.postimg.cc/DwhQ6w6C/avenida-guararapes-300x203.jpg',
  'https://i.postimg.cc/28G3pjm9/matriz-de-santo-antonio-300x222.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
