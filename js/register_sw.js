navigator.serviceWorker.register('/sw.js').then(registerServiceWorker);

function registerServiceWorker(sw) {
  if (sw.waiting) {
    console.log('Service Worker is waiting');
    return;
  }

  if (sw.installing) {
    trackInstalling(sw.installing);
    return;
  }

  //checks if there was an update
  sw.addEventListener('updatefound', function() {
    console.log('New Service Worker was Found!');
    trackInstalling(sw.installing);
  });
}

function trackInstalling(worker) {
  worker.addEventListener('statechange', function() {
    if (worker.state === 'installed') {
      console.log('New Service Worker was installed');
    }
  });
}
