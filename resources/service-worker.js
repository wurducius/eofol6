let CACHE_NAME = "cache",
  CACHE_VERSION = "v1",
  urlsToCache = ["@@SW_FILES_MARKER@@"]
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(`${CACHE_NAME}-${CACHE_VERSION}`).then((e) => e.addAll(urlsToCache)))
}),
  self.addEventListener("fetch", (t) => {
    t.respondWith(caches.match(t.request).then((e) => e || fetch(t.request)))
  })
