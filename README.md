# LUCO CHRONO

Chrono de reprises pour la **canne de combat**, fait au club Les Cannes du Luco. Pensé pour un téléphone posé au bord du tapis : gros chiffres, gros boutons, des sons pour chaque moment de l'assaut.

## Ce que fait l'app

- **Réglages** : nombre de reprises, durée d'une reprise, repos entre les reprises (ou pas de repos). Ils sont retenus d'une fois sur l'autre.
- **Combat** : compte à rebours en blanc, un ding par seconde sur les 5 dernières secondes, trois dings à la fin.
- **Repos** : démarre tout seul après chaque reprise, puis relance la suivante (deux dings aigus). Pour le couper, garder le doigt 1 seconde sur « Lancer ».
- **Pause** à tout moment pendant une reprise, **Arrêter** avec confirmation.
- Une couleur par état, lisible de loin : blanc = combat, rouge = fin, bleu = repos, gris = pause.
- L'écran reste allumé pendant l'assaut, et l'app reste en portrait même si on tourne le téléphone.
- **Marche sans réseau** : tout est dans un seul fichier, polices et sons compris.

## L'utiliser

Ouvrir `index.html` dans un navigateur, sur téléphone de préférence. Pas d'installation, pas de compte, rien à configurer.

Pour l'avoir sur son téléphone comme une vraie app, il faudra la version installable (PWA), en préparation.

## L'adapter pour ton club

Tout le projet tient dans **un seul fichier, `index.html`**, sans outil ni dépendance : on le modifie avec n'importe quel éditeur de texte et on recharge la page.

- **Couleurs** : en haut du fichier, dans `:root` (`--jaune`, `--rouge`, `--bleu`…).
- **Textes** : en français dans le HTML et dans le script (« Lancer », « Repos », « Terminé »…).
- **Réglages par défaut et limites** : dans le script, partie « Réglages » (`S = { n: 3, d: 120, r: 60 }`, en secondes).
- **Sons** : partie « Sons » du script. Ils sont fabriqués par le navigateur (Web Audio), il n'y a aucun fichier son. La fonction `cloche` fait un ding : on choisit sa note, sa durée et son volume.
- **Nom et logo** : « LUCO CHRONO » et son icône sont ceux de notre club. Si tu publies ta version, mets ton propre nom et ton logo (le titre dans le HTML, les icônes en base64 tout en haut du fichier).

Le fichier `CLAUDE.md` décrit le code et les choix faits en détail. Il sert aussi de point de départ si tu modifies l'app avec Claude.

### Tester en local

Ouvrir `index.html` suffit. Pour tester comme sur un vrai site :

```bash
python3 -m http.server 8765
```

puis ouvrir http://localhost:8765.

Astuce : en baissant la durée d'une reprise sous 30 s, on tombe sur une reprise de test de 10 s.

## Licence

- **Code** : licence MIT (voir `LICENSE`). Tu peux le reprendre, le modifier et le redistribuer librement, en gardant la mention d'auteur.
- **Police Barlow Condensed** (intégrée au fichier) : SIL Open Font License 1.1, © The Barlow Project Authors (voir `OFL-Barlow.txt`).
