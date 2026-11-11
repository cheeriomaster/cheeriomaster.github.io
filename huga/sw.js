/* 胡嘎游戏 · 离线缓存：联网时拿最新，断网时用上一次存的 */
const CACHE = "huga-v7";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(["./", "./index.html"])).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put("./index.html", copy));
        return r;
      })
      .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
  );
});
