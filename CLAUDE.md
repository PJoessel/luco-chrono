# LUCO CHRONO

Chrono de reprises pour la canne de combat (club Les Cannes du Luco). Pas de build, pas de dépendance : on ouvre `index.html` dans un navigateur, sur téléphone de préférence. L'app tient dans `index.html` (56 Ko, polices Barlow Condensed 600 et 800 en base64 dedans). À côté, seulement ce qui sert à l'installer (PWA) : `manifest.webmanifest`, `sw.js`, `icons/`.

Point de départ : `luco-chrono-hors-ligne (2).html` fourni par Pierre le 3/11/2026, copié tel quel en `index.html`. Le site du club est à part, dans `../cannes-du-luco`.

## Ce que fait l'app

- **Réglages** : nombre de reprises (1 à 20, 3 par défaut), durée d'une reprise (30 s à 3 min, pas de 30 s, 2:00 par défaut) et repos entre les reprises (« Non », puis 30 s à 3 min, pas de 30 s, 1:00 par défaut). Sauvés dans `localStorage` (clé `chrono-canne`, champs `n`, `d`, `r`).
- **Une couleur par état** (audit UX/UI du 3/11/2026, pour lire l'écran de loin) : **blanc = combat, rouge doux = fin (et 5 dernières secondes), bleu doux = repos, gris = pause. Le jaune est réservé aux boutons.** Pierre trouvait les couleurs vives « trop much » : garder des tons doux (`--rouge-doux #e06a60`, `--bleu #8ab4dc`, `--gris-clair #8f8f8f`). Le `--rouge` vif reste pour le bouton Arrêter. L'état est écrit dans `#run[data-etat]` (fonction `changerEtat`), le CSS en tire `--etat` pour le mot d'état, les chiffres et la barre.
- **Écran du chrono** : en haut une seule ligne (« 1re reprise / 3 »), au-dessus des chiffres un mot d'état en capitales (`#msg` : PAUSE, REPOS, FIN, TERMINÉ, vide pendant le combat), sous les chiffres une ligne grise (`#sous`, seulement le récap de fin), puis la barre et les boutons (hauteur fixe, ils ne bougent pas quand le texte change). Ordinaux « 1re, 2e ».
- **Combat** : chiffres blancs. Un ding par seconde sur les 5 dernières secondes (chiffres en rouge). À la fin : trois dings graves (`sonnerieFin`) et vibration. **Pas de flash** : Pierre veut que les sons (flash essayé puis retiré le 3/11/2026).
- **Pause** : chiffres gris qui clignotent doucement, PAUSE. **Pas de temps d'arrêt** : Pierre n'en veut pas (retirés le 3/11/2026, ni en pause ni à la fin).
- **Repos** : démarre tout seul après chaque reprise (sauf la dernière). Bleu, REPOS, en haut « Ensuite : 2e reprise / 3 ». À la fin, deux dings aigus (`depart`) et la reprise part toute seule. Pour couper le repos : **appui long de 1 s** sur « Lancer » (une ombre remplit le bouton), un appui court ne fait rien (évite un départ par erreur). Pas de pause pendant le repos.
- **Repos sur « Non »** : à la fin d'une reprise, FIN en rouge et un seul bouton « Lancer la 2e » (plus d'étape « Prêt »).
- **Fin d'assaut** : TERMINÉ en rouge doux, récap « 3 reprises de 2:00 ». « Arrêter » disparaît, « Nouvel assaut » prend toute la largeur et ramène aux réglages.
- **Arrêter** : confirmation « Arrêter l'assaut et revenir aux réglages ? » avec « Continuer » (jaune) et « Arrêter » (rouge).
- Écran d'ouverture : 0,5 s.
- Écran gardé allumé pendant l'assaut (Wake Lock). Sons fabriqués en Web Audio, aucun fichier son. **Que des dings** (fonction `cloche`) : Pierre ne veut pas de buzzer (retiré le 3/11/2026).
- **Toujours en portrait** (3/11/2026, demande de Pierre : pas de paysage). Si le téléphone est tourné, `orienter()` pose `tourne-g` ou `tourne-d` sur `<html>` selon l'angle, et le CSS tourne le `<body>` dans l'autre sens : la page reste collée au téléphone, comme une app bloquée en portrait. Toutes les tailles sont en `cqw`/`cqh` (le `body` est un conteneur `container-type: size`) pour être les mêmes une fois tourné : ne pas remettre de `vw`/`vh` dans le CSS de la page. Sur ordi (angle 0), rien ne tourne. Sens de rotation vérifié seulement en simulation, pas sur un vrai téléphone.

## Code

Remis au propre le 3/11/2026, sans changer le comportement (testé par de vrais clics : réglages, pause, temps d'arrêt, enchaînement des reprises, fin d'assaut).

- **Mise en page** : titre « LUCO CHRONO » centré. Chaque écran (`.screen`) fait au plus 560 px de large, centré (tablette, ordi), et c'est un conteneur `container-type: size` : les tailles en `cqw`/`cqh` suivent l'écran. Titre et intitulés grandissent avec l'écran (`clamp`). Réglages : intitulés centrés, 12 px au-dessus de leur réglage. Les + et − des cercles sont **dessinés en CSS** (`.step::before/::after`, le nom du bouton est dans `aria-label`) : avec les caractères de la police, ils tombaient sous le centre. Les valeurs (`.ctl .v`) sont remontées de 0,05em pour être au niveau du centre des cercles (mesuré : écart restant < 0,2 px). Tailles vérifiées le 3/11/2026 en 320×568, 375×812 et 768×1024 : rien ne déborde.
- Tout dans `index.html`. En tête : liens vers les icônes et le manifeste, réglages iPhone, puis les polices en base64 (2 lignes très longues dans le premier `<style>`, ne pas les toucher à la main). Polices **réduites** le 3/11/2026 avec `pyftsubset` (fonttools) : latin de base, Latin-1 (accents français), Œ œ Ÿ, guillemets et apostrophes typographiques, tirets, points de suspension, €, signe moins ; fonctions gardées : kern, tnum, liga, ccmp, locl. 22 Ko → 12 Ko chacune. Si un texte ajouté utilise un autre caractère, il s'affichera dans la police de secours : refaire le sous-ensemble depuis la police complète (github.com/jpt/barlow). Ensuite : CSS par écran, HTML commenté, puis le script.
- Script en sections : Réglages, Sons, Écran gardé allumé, Chrono, Boutons, Toujours en portrait, Hors ligne, Démarrage. Noms en français (`etat`, `reprise`, `finA`, `demarrerReprise`, `finirReprise`…).
- Couleurs en tokens sur `:root` : `--noir #000`, `--rouge #e10600`, `--jaune #ffd400`, `--blanc #fff`, `--gris #2a2a2a` (fond de barre), `--gris-clair #8f8f8f` (pause), `--bleu #8ab4dc` (repos), `--rouge-doux #e06a60` (fin). Thème sombre uniquement.
- Le temps se cale sur `Date.now()` (`finA`), pas sur le nombre de tops : pas de dérive. Les enchaînements automatiques (reprise → repos → reprise) partent pile de la fin précédente (`suite()`), sauf si l'app sortait de veille avec plus de 2 s de retard : on repart alors de maintenant, sans rattraper (pas de sons en rafale). Mesuré : repos de 30,002 s, reprise de 10,003 s. Les chiffres ne sont réécrits qu'au changement de seconde.
- États (`etat`) : `setup`, `run`, `paused`, `repos`, `between` (fin de reprise sans repos), `done`. Toujours passer par `changerEtat()`. Le gros bouton jaune (`#bPause`) change de rôle selon l'état. `dureeEnCours` = durée de ce qui tourne (reprise ou repos), pour la barre.
- Tester : `python3 -m http.server 8765` dans le dossier (config dans `.claude/launch.json`), puis http://localhost:8765. La durée de test de 10 s (constante `TEST`) sert à vérifier une reprise vite.

## Défauts repérés (relecture du 3/11/2026)

1. ~~Pas de temps de repos~~ : fait le 3/11/2026.
2. Mode test caché : sous 30 s, la durée passe à 10 s (constante `TEST`, jamais sauvée). Gardé pour l'instant, pratique pour tester.
3. ~~Pas installable~~ : PWA faite le 3/11/2026 (voir « Installation (PWA) »). APK écarté.
4. iPhone : le bouton silencieux coupe les sons, pas de vibration ; écran verrouillé = pas de son.
5. ~~Écran d'ouverture de 1,8 s~~ : réduit à 0,5 s le 3/11/2026.
6. ~~Code compressé~~ : fait le 3/11/2026.
7. ~~Temps d'arrêt affichés sur « Prêt »~~ : l'étape « Prêt » n'existe plus (3/11/2026).

## Relecture du 3/11/2026 (bugs et poids)

- Poids : `index.html` 82 → 56 Ko (polices réduites), icônes PNG 53 → 16 Ko (palette 256 couleurs avec Pillow, rendu identique). Site complet : environ 80 Ko.
- iPhone : `-webkit-user-select: none` (sinon l'appui long sélectionne du texte), son relancé si le contexte audio est « interrupted » (appel, veille) et au retour dans l'app, `dvh`/`dvw` pour la page tournée (100vh compte la barre d'adresse de Safari).
- Android : `contextmenu` bloqué et `touch-action: none` sur le bouton jaune, sinon l'appui long de 1 s pouvait être annulé par le menu du navigateur.
- Écran allumé pendant tout l'assaut, pause comprise (avant : seulement combat et repos au retour dans l'app), sans double demande.
- Réglages sauvés relus comme des nombres (une valeur abîmée ne casse plus rien).
- `sw.js` ne garde pas les réponses redirigées (elles ne peuvent pas resservir une ouverture de page). Manifeste : `id`.
- Testé : bornes des réglages, pause, repos, appui long, mode sans repos, arrêt, réglages abîmés, installation et hors ligne (Brave sans écran).

## Pistes

Pause pendant le repos (blessure, matériel), durée à la seconde, préréglages (entraînement, compétition), annonce vocale, historique des assauts.

## Installation (PWA)

Ajoutée le 3/11/2026. Hors ligne obligatoire (demande de Pierre).

- `manifest.webmanifest` : nom, `display: standalone`, `orientation: portrait` (respecté sur Android ; sur iPhone c'est le CSS « Toujours en portrait » qui fait le travail), fond et thème noirs, icônes.
- `icons/` : `icon.svg` (logo, coins arrondis), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (fond plein, logo réduit à 80 % pour ne pas être rogné par les icônes rondes d'Android), `apple-touch-icon.png` (180 px, fond plein : iOS arrondit lui-même). PNG générés depuis le SVG avec `qlmanage` (pas d'autre outil d'image sur le Mac).
- `sw.js` : met tous les fichiers en cache au premier passage, puis sert toujours le cache (marche en mode avion) et rafraîchit en arrière-plan : une modif de `index.html` arrive au lancement suivant, sans rien toucher. **Ajouter tout nouveau fichier à `FICHIERS` et changer `VERSION`.** Enregistré seulement sur un vrai site (pas en `file://`).
- Testé le 3/11/2026 dans un Brave sans écran (protocole DevTools, profil temporaire) : aucune erreur de manifeste ni d'installation, et l'app se recharge réseau coupé (par `/` et par `/index.html`). Le navigateur intégré de l'app Claude refuse les service workers : il ne sert pas à tester ça. Pas encore testé sur un vrai iPhone ou Android.

## Publication

- Code public sur GitHub : https://github.com/PJoessel/luco-chrono (branche `main`, créé le 3/11/2026). Licence MIT (`LICENSE`), police Barlow sous OFL (`OFL-Barlow.txt`, à garder tant que la police est intégrée). `README.md` en français, pour ceux qui veulent reprendre l'app pour leur club.
- Commits signés « Pierre Joëssel » avec l'adresse masquée GitHub (`32869915+PJoessel@users.noreply.github.com`, réglée dans le dépôt seulement).
- Site en ligne avec **GitHub Pages** (branche `main`, racine) : https://pjoessel.github.io/luco-chrono/ . Chaque push sur `main` met le site à jour en une minute environ. Le README donne ce lien et le mode d'installation iPhone / Android.
