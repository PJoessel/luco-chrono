# Travailler sur LUCO CHRONO

Règles entre Pierre et Vincent pour ne jamais casser l'app du club. Tout ce qui arrive sur la branche `main` part en ligne en une minute, sur les téléphones de tout le monde : `main` doit toujours marcher.

## La règle d'or : jamais directement sur `main`

1. Crée une branche pour chaque modif, avec un nom qui dit ce que tu fais :
   ```bash
   git switch main
   git pull
   git switch -c pause-pendant-repos
   ```
2. Fais tes modifs et tes commits sur cette branche. Des petits commits, un par idée, avec un message clair (« Pause possible pendant le repos », pas « modifs »).
3. Envoie la branche et ouvre une **Pull Request** sur GitHub :
   ```bash
   git push -u origin pause-pendant-repos
   ```
4. L'autre relit et teste. Ce n'est qu'une fois d'accord qu'on fusionne dans `main`.

La branche `main` est protégée : GitHub refuse un envoi direct dessus et demande une Pull Request.

## Avant d'ouvrir la Pull Request

- **Tester en vrai** : lance un petit serveur dans le dossier, puis ouvre http://localhost:8765.
  ```bash
  python3 -m http.server 8765
  ```
  Astuce : en baissant la durée d'une reprise sous 0:30, on tombe sur une reprise de test de 10 s.
- **Passer tous les états** : réglages, infos, combat, 5 dernières secondes (dings), pause, repos, appui long sur « Lancer », sans repos, fin d'assaut, « Arrêter » puis « Continuer ».
- **Regarder sur un petit écran** (320 px de large) : rien ne doit déborder ni passer à la ligne.
- **Changer `VERSION` en haut de `sw.js`** (par exemple `luco-chrono-12` → `luco-chrono-13`). Sans ça, les téléphones gardent l'ancienne version. Un fichier ajouté ou renommé va aussi dans la liste `FICHIERS`.
- La vérification automatique (onglet « Checks » de la Pull Request) doit être verte : elle contrôle que le code n'a pas d'erreur de syntaxe et que la version a bien changé.

## Ce qu'on ne touche pas sans en parler

- Les sons : que des dings, pas de buzzer.
- Les couleurs d'état (blanc combat, rouge doux fin, bleu doux repos, gris pause), le jaune réservé aux boutons.
- Les deux lignes de polices en base64 en haut de `index.html` (ne pas les modifier à la main).
- Le fichier `CLAUDE.md` décrit tous les choix déjà faits : le lire avant une grosse modif.

## Si quelque chose casse quand même

Chaque version publiée a une étiquette (`v1`, `v2`…) : ce sont nos sauvegardes. Pour annuler la dernière modif fusionnée, sans rien effacer :

```bash
git switch main
git pull
git revert HEAD
git push
```

Pour voir les versions sauvegardées : onglet **Releases** / **Tags** sur GitHub, ou `git tag` dans le terminal.

## Sauvegardes

- Tout l'historique est sur GitHub : rien n'est jamais perdu tant qu'on ne force pas un envoi (`git push --force` interdit).
- À chaque version publiée qui marche bien, on pose une étiquette :
  ```bash
  git tag -a v3 -m "Pause pendant le repos"
  git push origin v3
  ```
- Chacun garde aussi le dépôt sur son ordi (`git pull` régulièrement) : ça fait deux copies de plus.
