/* CHRONO CANNE : garde l'app en mémoire sur le téléphone pour qu'elle marche hors ligne.

   Au premier passage, tous les fichiers sont mis en cache. Ensuite l'app s'ouvre
   toujours depuis le cache (instantané, même en mode avion). Seule la page est
   rafraîchie en arrière-plan quand il y a du réseau ; icônes et manifeste ne sont
   retéléchargés qu'avec une nouvelle VERSION.

   Changer VERSION à chaque version publiée : les téléphones la prennent alors
   tout de suite (l'app se recharge sur l'écran des réglages, jamais pendant un
   assaut). Tout fichier ajouté ou renommé doit aussi aller dans FICHIERS. */

const VERSION = "luco-chrono-22";
const FICHIERS = [
  "./index.html", // ouvrir « / » sert aussi cette copie (voir fetch)
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  // cache: "reload" : vrai téléchargement, sinon le navigateur peut resservir l'ancienne page (gardée 10 min)
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS.map((f) => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
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
      const page = req.mode === "navigate";
      const cle = page ? "./index.html" : req;
      const enCache = await cache.match(cle, { ignoreSearch: true });

      // icônes et manifeste ne changent qu'avec VERSION (cache refait à l'installation) :
      // servis depuis le cache sans les retélécharger à chaque lancement
      if (enCache && !page) return enCache;

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
