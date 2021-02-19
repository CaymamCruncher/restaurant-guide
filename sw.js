clearCache();

const staticCache = 'restaurantCache-v1';


//checks for the install event and pushes sw and opens new cache
self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCache).then(function(cache){
      return cache.addAll([
        './index.html',
        './restaurant.html',
        './css',
				'./js',
        './data',
				'./img'
      ])
    })
  );
});

//on fetch returns items from the cache if no response then rejects no match
self.addEventListener('fetch', function(event){
	console.log('Service Worker is serving');
  event.respondWith(fromNetwork(event.request, 400).catch(function() {
		return fromCache(event.request);
	}));
	event.waitUntil(
		caches.open(staticCache).then(function(cache) {
			return fetch(event.request).then(function(response) {
				return cache.put(event.request, response);
			})
		})
	);
});
//on activate event clears the cache
self.addEventListener('activate', function(event){
  event.waitUntil(
    clearCache()
  );
});

function fromCache(request) {
	return caches.open(staticCache).then(function(cache) {
		return cache.match(request).then(function(matching) {
			return matching || Promise.reject('no-match');
		})
	})
}

function fromNetwork(request, timeout) {
	return new Promise(function(fulfill, reject) {
		let timeoutId = setTimeout(reject, timeout);

		fetch(request).then(function(response) {
			clearTimeout(timeoutId);
			fulfill(response);
		}, reject);
	});
}

//function for clearing the cache
function clearCache() {
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.filter(function(cacheName){
        if (cacheName.startsWith('restaurantCache-') && cacheName !== staticCache) {
					return cacheName;
        }
      }).map(function(cacheName) {
        return caches.delete(cacheName);
			})
		);
	});
}
