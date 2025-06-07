// Service Worker for SAFE MOM PWA
const CACHE_NAME = 'safemom-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'emergency-sync') {
    event.waitUntil(handleEmergencySync());
  }
  if (event.tag === 'checkin-sync') {
    event.waitUntil(handleCheckinSync());
  }
});

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'You have a new message',
    icon: './icon-192.png',
    badge: './icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: './icon-96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: './icon-96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SAFE MOM', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// Helper functions for background sync
async function handleEmergencySync() {
  try {
    // In a real app, this would sync emergency data
    console.log('Emergency sync completed');
  } catch (error) {
    console.error('Emergency sync failed:', error);
  }
}

async function handleCheckinSync() {
  try {
    // In a real app, this would sync check-in data
    console.log('Check-in sync completed');
  } catch (error) {
    console.error('Check-in sync failed:', error);
  }
} 