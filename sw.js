/* Crate School Books - offline support.
 * Network first (so updates show up straight away), cache as the fallback when offline. */
const CACHE = "crate-books-v3";
const CORE = ["./", "index.html", "crate.html", "css/books.css", "js/core.js", "js/gens.js", "js/pages.js", "js/games.js", "js/reader.js",
  "books/maths.js", "books/english.js", "books/phonics.js", "books/hindi.js", "books/punjabi.js", "manifest.json", "icon.svg", "icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      if(res && (res.ok || res.type === "opaque")){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match("index.html")))
  );
});
