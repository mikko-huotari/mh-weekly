// MH Weekly PWA service worker.
// Intentionally network-only: it registers a fetch handler (so Chrome treats
// the site as installable) but never caches. The site sits behind Cloudflare
// Access (Email OTP), so caching responses would serve stale/unauthorized
// content. Every request falls through to the network unchanged.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => { /* passthrough: no respondWith → network */ });
