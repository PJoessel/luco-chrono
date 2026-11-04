/* LUCO CHRONO : garde l'app en mémoire sur le téléphone pour qu'elle marche hors ligne.

   Au premier passage, tous les fichiers sont mis en cache. Ensuite l'app s'ouvre
   toujours depuis le cache (instantané, même en mode avion), et quand il y a du
   réseau le cache est rafraîchi en arrière-plan : la nouvelle version s'affiche
   au lancement suivant.

   Changer VERSION à chaque version publiée : les téléphones la prennent alors
   tout de suite (l'app se recharge sur l'écran des réglages, jamais pendant un
   assaut). Tout fichier ajouté ou renommé doit aussi aller dans FICHIERS. */

const VERSION = "luco-chrono-5";
const FICHIERS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

// On supprime les caches des anciennes versions
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  e.respondWith(
    caches.open(VERSION).then(async (cache) => {
      // ouverture de l'app (avec ou sans « index.html » dans l'adresse) : toujours la page en cache
      const cle = req.mode === "navigate" ? "./index.html" : req;
      const enCache = await cache.match(cle, { ignoreSearch: true });

      const reseau = fetch(req)
        .then((rep) => {
          // une réponse redirigée ne peut pas resservir une ouverture de page : on ne la garde pas
          if (rep.ok && !rep.redirected) cache.put(cle, rep.clone());
          return rep;
        })
        .catch(() => null);

      if (enCache) {
        e.waitUntil(reseau); // rafraîchit le cache en arrière-plan
        return enCache;
      }
      return (await reseau) || Response.error();
    })
  );
});
