var cacheName = 'RBVNews-PWA';
var filesToCache = [
    '/',
    'index.html',
    'CSS/Styles.css',
    'CSS/Colour1.css',
    'CSS/Colour2.css',
    'CSS/Colour3.css',
    'CSS/Colour4.css',
    'CSS/Colour5.css',
    'CSS/Colour6.css',
    'CSS/all.min.css',
    'CSS/bootstrap.min.css',
    'CSS/flickity.min.css',
    'CSS/SigmarOne.css',
    'JS/main.js',
    'JS/bootstrap.bundle.min.js',
    'JS/flickity.pkgd.min.js',
    'JS/index.umd.min.js',
    'JS/index.umd.min.js.map',
    'JS/jquery-3.4.1.min.js',
    'JS/popper.min.js',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'icon/icon-72x72.png',
    'icon/icon-96x96.png',
    'icon/icon-128x128.png',
    'icon/icon-144x144.png',
    'icon/icon-152x152.png',
    'icon/icon-192x192.png',
    'icon/icon-384x384.png',
    'icon/icon-512x512.png',
    'manifest1.json',
    'manifest2.json'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});