self.skipWaiting(); // force removal of old instantly
console.log('sw.js');

const cacheWhitelist = [];

// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request).then(function (response) {
//       // Cache hit - return response
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });

self.addEventListener('activate', function (event) {
  console.log('sw.js activated');
  // delete old caches when updating if needed
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      console.log('deleting caches :', cacheNames);
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
