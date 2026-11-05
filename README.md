# LUCO CHRONO

Chrono de reprises pour la **canne de combat**, créé par **Pierre Joëssel et Vincent Prunier** au club Les Cannes du Luco. Pensé pour un téléphone posé au bord du tapis : gros chiffres, gros boutons, des sons pour chaque moment de l'assaut.

👉 **Ouvrir l'app : https://pjoessel.github.io/luco-chrono/**

## Ce que fait l'app

- **Réglages** : nombre de reprises, durée d'une reprise, repos entre les reprises (ou pas de repos). Ils sont retenus d'une fois sur l'autre.
- **Combat** : compte à rebours en blanc, un ding par seconde sur les 5 dernières secondes, trois dings à la fin.
- **Repos** : démarre tout seul après chaque reprise, puis relance la suivante (deux dings aigus). Pour le couper, garder le doigt 1 seconde sur « Lancer ».
- **Pause** à tout moment pendant une reprise, **Arrêter** avec confirmation.
- Une **page d'infos** (le « i » en haut des réglages) : mode d'emploi, réglages du téléphone pour bien entendre les sons, installation.
- Une couleur par état, lisible de loin : blanc = combat, rouge = fin, bleu = repos, gris = pause.
- L'écran reste allumé pendant l'assaut, et l'app reste en portrait même si on tourne le téléphone.
- **S'installe comme une app** sur iPhone et Android, et **marche sans réseau** une fois installée.

## L'installer sur son téléphone

Pas besoin de store : l'app s'installe depuis le navigateur. Il faut du réseau la première fois, ensuite elle marche **en mode avion**.

### iPhone (Safari)

1. Ouvrir **https://pjoessel.github.io/luco-chrono/** dans **Safari**.
2. Appuyer sur le bouton **Partager** (le carré avec une flèche vers le haut).
3. Choisir **« Sur l'écran d'accueil »**, puis **« Ajouter »**.
4. L'icône LUCO CHRONO apparaît sur l'écran d'accueil : l'app s'ouvre en plein écran.

⚠️ Sur iPhone, le **bouton silencieux** coupe aussi les sons de l'app : le désactiver avant un assaut.

### Android (Chrome)

1. Ouvrir **https://pjoessel.github.io/luco-chrono/** dans **Chrome**.
2. Appuyer sur le menu **⋮** en haut à droite.
3. Choisir **« Installer l'application »** (ou **« Ajouter à l'écran d'accueil »** selon la version), puis confirmer.
4. L'icône LUCO CHRONO apparaît avec les autres apps.

### Mises à jour

Rien à faire : quand l'app est ouverte avec du réseau, elle récupère la nouvelle version et se recharge toute seule sur l'écran des réglages (jamais pendant un assaut).

### Sans installer

Le lien marche aussi directement dans le navigateur, sur téléphone ou sur ordi.

## L'adapter pour ton club

Toute l'app tient dans **un seul fichier, `index.html`**, sans outil ni dépendance : on le modifie avec n'importe quel éditeur de texte et on recharge la page. À côté, il n'y a que ce qui sert à l'installer : `manifest.webmanifest` (nom, icônes), `sw.js` (le hors ligne) et le dossier `icons/`.

- **Couleurs** : en haut du fichier, dans `:root` (`--jaune`, `--rouge`, `--bleu`…).
- **Textes** : en français dans le HTML et dans le script (« Lancer », « Repos », « Terminé »…).
- **Réglages par défaut et limites** : dans le script, partie « Réglages » (`S = { n: 3, d: 120, r: 60 }`, en secondes).
- **Sons** : partie « Sons » du script. Ils sont fabriqués par le navigateur (Web Audio), il n'y a aucun fichier son. La fonction `cloche` fait un ding : on choisit sa note, sa durée et son volume.
- **Nom et logo** : « LUCO CHRONO » et son icône sont ceux de notre club. Si tu publies ta version, mets ton propre nom et ton logo : le titre dans `index.html`, le nom dans `manifest.webmanifest`, et les images du dossier `icons/`.
- **Après chaque modif publiée** : changer `VERSION` en haut de `sw.js` (par exemple `luco-chrono-4`). Les téléphones prennent alors la nouvelle version dès qu'ils sont sur l'écran des réglages (jamais pendant un assaut). Un fichier ajouté ou renommé doit aussi aller dans la liste `FICHIERS`, pour marcher hors ligne.

Le fichier `CLAUDE.md` décrit le code et les choix faits en détail. Il sert aussi de point de départ si tu modifies l'app avec Claude.

### Le mettre en ligne

Le plus simple : forker ce dépôt sur GitHub, puis activer **GitHub Pages** (Settings → Pages → branche `main`, dossier `/ (root)`). Le site est en ligne une minute après, à l'adresse `ton-pseudo.github.io/luco-chrono`, en https (obligatoire pour l'installation sur téléphone).

### Tester en local

Ouvrir `index.html` suffit pour l'app. Pour tester aussi l'installation et le hors ligne, il faut passer par un petit serveur :

```bash
python3 -m http.server 8765
```

puis ouvrir http://localhost:8765.

Astuce : en baissant la durée d'une reprise sous 30 s, on tombe sur une reprise de test de 10 s.

## Licence

- **Code** : licence MIT (voir `LICENSE`). © 2026 Pierre Joëssel et Vincent Prunier. Tu peux le reprendre, le modifier et le redistribuer librement, en gardant la mention des auteurs.
- **Police Barlow Condensed** (intégrée au fichier) : SIL Open Font License 1.1, © The Barlow Project Authors (voir `OFL-Barlow.txt`).
- **Police Anton** (intégrée au fichier, réduite, avec le « 1 » élargi à la largeur des autres chiffres) : SIL Open Font License 1.1, © The Anton Project Authors (voir `OFL-Anton.txt`).
