/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Type declaration for Service Worker
declare const self: ServiceWorkerGlobalScope;

// Type declaration for Service Worker


// Cleanup old caches
cleanupOutdatedCaches();

// Take control immediately
self.skipWaiting();
clientsClaim();

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache Supabase API
registerRoute(
  ({ url }) => url.origin.includes('supabase.co'),
  new NetworkFirst({
    cacheName: 'supabase-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 menit
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

// Cache external images (CDN, dll)
registerRoute(
  ({ url, request }) => 
    url.origin !== self.location.origin && // External domain
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'external-images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 hari
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200] // CORS might return opaque response (0)
      })
    ]
  })
);

// Cache local images
registerRoute(
  ({ url, request }) => 
    url.origin === self.location.origin && 
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'local-images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 hari
      })
    ]
  })
);

// Cache fonts and CSS
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);

// Cache scripts (JS bundles)
registerRoute(
  ({ request }) => request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'scripts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60 // 1 hari
      })
    ]
  })
);

// Handle navigation (SPA routing)
const navigationRoute = new NavigationRoute(
  async ({ event }) => {
    try {
      // Try network first
      const response = await fetch((event as FetchEvent).request);
      return response;
    } catch (error) {
      // Fallback to cache
      const cache = await caches.open('workbox-precache-v2-' + self.location.origin + '/');
      const cachedResponse = await cache.match('/index.html');
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Last resort: try any cache
      const allCaches = await caches.keys();
      for (const cacheName of allCaches) {
        const cache = await caches.open(cacheName);
        const match = await cache.match('/index.html');
        if (match) return match;
      }
      
      return Response.error();
    }
  },
  {
    denylist: [/^\/api/, /\.[^\/]+$/] // Exclude API routes and file extensions
  }
);

registerRoute(navigationRoute);

// Listen for messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle fetch errors gracefully
self.addEventListener('fetch', (event: FetchEvent) => {
  // Ignore chrome extensions
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
});