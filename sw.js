/* オフライン用 サービスワーカー
   アプリを更新したときは CACHE_NAME の数字を上げてください（v1 → v2） */
const CACHE_NAME = 'shugo-jutsugo-v1';
const FILES = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* 保存しておいたファイルをすぐ使い、通信できるときは裏で新しいものに入れ替える */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request, { ignoreSearch: true }).then(cached => {
        const network = fetch(event.request)
          .then(res => {
            if (res && res.ok && new URL(event.request.url).origin === location.origin) {
              cache.put(event.request, res.clone());
            }
            return res;
          })
          .catch(() => cached || cache.match('./index.html'));
        return cached || network;
      })
    )
  );
});
