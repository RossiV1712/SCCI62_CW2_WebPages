var cacheName = 'RBVNews-PWA'; // The name of the cache
var filesToCache = [ // List all of the files that need to be cached
    '/',
    'index.html',
    'CSS/Styles.css',
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
    'JS/popper.min.js.map',
    'Images/TempImage.png',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'icon/icon-72x72.png',
    'icon/icon-96x96.png',
    'icon/icon-144x144.png',
    'icon/icon-192x192.png',
    'icon/icon-384x384.png',
    'icon/icon-512x512.png',
    'webfonts/fa-solid-900.woff2',
    'mstile-150x150.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'browserconfig.xml',
    'safari-pinned-tab.svg',
    'manifest.json'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) { // On the service worker event 'install' 
  e.waitUntil(
    caches.open(cacheName).then(function(cache) { // Open a cache with the given name and then
      return cache.addAll(filesToCache); // Add all the listed files to the cache
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) { // On the service worker event 'fetch'
  e.respondWith(
    caches.match(e.request).then(function(response) { // If there is a cache with that matches the requested one
      return response || fetch(e.request); // Return the files in the cache
    })
  );
});