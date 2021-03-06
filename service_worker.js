var CACHE = 'v1';

// On install, cache some resource.
self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function(evt) {
  //console.log('The service worker is serving the asset.');
  // Try network and if it fails, go for the cached copy.
  if(evt.request.url.indexOf('http://')===0) {
    return false;
  } else {
    evt.respondWith(fromCache(evt.request).catch(function(){
        return fromNetwork(evt.request);
    }));
  }
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
        './',
        './index.php',
        './index.html',
        './stylesheets/screen.css?v=4',
        './fonts/style.css',
        './javascript/jquery.history.js',
        './javascript/jquery.js',
        './javascript/controller.js',
        './javascript/app.js?v=22',
        './service_worker.js?v=22',
        './images/arrow1.png',
        './images/arrow2.png',
        './images/maintips.png',
        './fonts/fonts/icomoon.ttf?1w02bs',
        './fonts/fonts/icomoon.woff?1w02bs',
        './fonts/fonts/icomoon.svg?1w02bs#icomoon'
    ]);
  });
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request) {
  return new Promise(function (fulfill, reject) {
    // Reject in case of timeout.
    // Fulfill in case of success.
    fetch(request).then(function (response) {
      console.log('got from internet: '+request.url);
      fulfill(response);
    // Reject also if network fetch rejects.
    }, reject);
  });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if(matching) {
        return matching;
      } else {
        return Promise.reject('no-match');
      }
    });
  });
}

