/* DBank service worker
   - Scope hanya folder DBank (./) -> tidak menyentuh situs lain di domain yang sama.
   - Halaman (index.html) selalu diambil dari jaringan dulu supaya update langsung terasa;
     cadangan offline dipakai hanya kalau jaringan putus.
   - Data (Google Apps Script) TIDAK PERNAH di-cache oleh service worker ini. */
const CACHE = "dbank-shell-v10";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./config.js",
  "./assets/logo-full.jpg",
  "./assets/logo-full.webp",
  "./assets/emblem-gold.webp",
  "./assets/gedung-desktop.webp",
  "./assets/gedung-mobile.webp",
  "./assets/emblem.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/favicon-64.png",
];
self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("dbank-") && k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener("fetch", (e)=>{
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;            // Apps Script, CDN, font: biarkan browser
  if(!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  // halaman & pengaturan selalu yang terbaru dari server (cadangan offline bila putus)
  if(req.mode === "navigate" || url.pathname.endsWith("/config.js")){
    e.respondWith(fetch(req).then(res=>{
      const copy = res.clone(); const k = req.mode === "navigate" ? "./index.html" : req;
      caches.open(CACHE).then(c=>c.put(k, copy)); return res;
    }).catch(()=>caches.match(req.mode === "navigate" ? "./index.html" : req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit=> hit || fetch(req).then(res=>{
    if(res.ok){ const copy = res.clone(); caches.open(CACHE).then(c=>c.put(req, copy)); }
    return res;
  })));
});
