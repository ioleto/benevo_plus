# Bénévo+

Bénévo+ met en relation les bénévoles et les besoins de communautés locales.

## Communautés
La page `/app/communautes` explore uniquement les communautés publiques, affiche le nombre de membres, permet une recherche par nom/description et ville, et propose une carte OpenStreetMap sans clé API. Les coordonnées `latitude`/`longitude` sont optionnelles afin de conserver la compatibilité avec les données existantes. Appliquez le schéma avec `npm run db:push` après `npx prisma generate`.

La création et l’adhésion conservent le fonctionnement par code d’invitation. Les communautés privées restent accessibles uniquement depuis leurs parcours authentifiés existants.

## Développement
```bash
npm ci
npx prisma generate
npm run dev
```
Les variables d’environnement sont documentées dans `.env.example`. En production derrière un reverse proxy, configurez l’URL publique Auth.js (`AUTH_URL`) et `AUTH_TRUST_HOST=true`.

### Autocomplétion ville et carte
Les formulaires de communauté utilisent l’autocomplétion de `api-adresse.data.gouv.fr` pour enregistrer la ville et ses coordonnées. La carte est rendue avec Leaflet et les tuiles OpenStreetMap. Ces services externes sont à prendre en compte dans l’information RGPD (journalisation réseau, données de localisation et conditions d’utilisation d’OSM).

## Erreurs connues de la CI

### PR #31

- **Lint (`npm run lint`)** : les appels `require()` dans les scripts JavaScript Node (`scripts/baseline-migrations.js`) sont conservés pour l’exécution dans le conteneur et couverts par `eslint-disable` ; les variables inutilisées sont supprimées.

Cette section récapitule les problèmes rencontrés dans l’historique réel de la PR **#22** et leurs correctifs.

| Symptôme | Cause | Correctif | Prévention |
|---|---|---|---|
| Le build Docker/CI échoue lors de `npm ci`. | Le dépôt ne contient pas de `package-lock.json`, alors que `npm ci` l’exige. | La CI et le `Dockerfile` utilisent `npm install` (commit `994d712`, « Fix CI sans lock et dépendances Leaflet »). | Si le projet repasse à `npm ci`, générer puis committer `package-lock.json`. |
| Le schéma Prisma ne contient plus certaines tables ou certains champs. | `prisma/schema.prisma` a été écrasé ou réécrit par un placeholder ou une version tronquée. | Restaurer le schéma à l’identique de `main` et ajouter uniquement `latitude Float?` et `longitude Float?` sur `Community` (commits `25ea608`, `cfd4b50`, `82836336`). | Ne jamais réécrire le schéma entier : modifier uniquement les champs ajoutés et comparer avec le diff de `main` avant le push. |
| `npm run lint` échoue avec Next.js 15.5. | Le script appelait `next lint`, qui n’est plus supporté. | Remplacer le script par `eslint .` (commit `7a6048b`). | Vérifier que le script utilise la commande ESLint supportée par la version de Next.js du projet. |
| Les communautés créées ou modifiées n’apparaissent pas sur la carte. | Les coordonnées `latitude`/`longitude` n’étaient pas persistées dans `src/server/actions.ts`. | Restaurer les actions complètes et enregistrer les coordonnées à la création et à la modification de la communauté (commit `4af138f`). | Restaurer le fichier complet depuis `main` avant d’y ajouter une modification ; ne jamais pousser une version raccourcie. |
| Erreur TypeScript TS2345 dans `src/components/CommunityMap.tsx`. | `let map: { remove: () => void }` était incompatible avec le type attendu par Leaflet (`Map | LayerGroup`). | Utiliser le type officiel : `import type { Map as LeafletMap } from "leaflet"` (commit `3600b01`). | Utiliser les types officiels des bibliothèques (`@types/leaflet`) et lancer `npm run typecheck` en local avant le push. |

### Avertissements connus non bloquants

- `@next/next/no-img-element` peut signaler l’utilisation de `<img>`.
- `no-unused-vars` peut signaler `getSetting` ou `settingString` dans `actions.ts`.
- npm peut afficher une notice indiquant qu’une nouvelle version est disponible.

Ces avertissements ne bloquent pas la CI lorsqu’ils ne sont pas configurés comme des erreurs.

### Checklist avant push

```bash
npm run typecheck
npm run lint
npm run build
npx prisma validate
```

## Compléments issus des PR #1 à #21

Les entrées ci-dessous distinguent les échecs de validation explicitement signalés des régressions d’intégration qui ont nécessité un correctif. Les numéros de PR sont les références vérifiables dans l’historique ; aucune erreur n’est ajoutée lorsque la PR ne fournit pas de symptôme de CI/build.

| PR | Symptôme ou risque établi | Cause et correctif | Prévention |
|---|---|---|---|
| #7, #9, #10, #11, #12, #13, #14, #17, #18, #19, #20, #21 | Les validations locales `npm`/`npx` ne peuvent pas démarrer (`Cannot find module '../lib/cli.js'`) ou `npm ci` n’est pas exécutable. | Les descriptions de ces PR indiquent un exécutable npm cassé dans le sandbox et/ou l’absence de `package-lock.json`; la CI GitHub est la validation de référence. | Vérifier l’outil npm et le lockfile dans un environnement propre avant de conclure à une régression applicative. |
| #16 → #17 | Régression de marque : le header/menu ne conservait plus le rendu attendu du logo ou du libellé Bénévo+. | #16 remplace le logo du menu desktop par `/icon.svg`; #17 restaure la marque textuelle « Bénévo+ » dans les layouts tout en conservant l’icône du menu. | Vérifier les deux layouts et `UserMenu.tsx` ensemble; rechercher les occurrences de logo/cœur avant le build. |
| #17 | L’accès `/app/admin` pouvait répondre 404 pour l’administrateur configuré. | Le code ne lisait que `ADMIN_EMAILS`, alors que Compose et `.env.example` exposaient `ADMIN_EMAIL`; #17 centralise la compatibilité, normalise la comparaison et réévalue le rôle à chaque session. | Tester les deux noms de variable (`ADMIN_EMAIL` et `ADMIN_EMAILS`) et une adresse avec casse/espaces variables. |
| #19 → #21 | Deux en-têtes apparaissaient sur les routes connectées. | #19 avait ajouté un shell/header connecté dans le layout racine alors que `src/app/app/layout.tsx` en possédait déjà un; #21 supprime le doublon et conserve le header du layout `/app`. | Cartographier les layouts imbriqués et vérifier visuellement une route publique et une route `/app`. |
| #19 → #20 | Les styles globaux pouvaient disparaître après la modification du layout racine. | L’import de `globals.css` avait été perdu; #20 le restaure dans le layout racine et transmet les props attendues à `UserMenu`. | Après toute réécriture de layout, vérifier l’import CSS global et lancer le build Next.js. |
| #19 → #21/#22 | La déconnexion pouvait ne pas déclencher l’action serveur. | La fermeture du menu sur le `<form>` pouvait démonter le formulaire avant `signOut`; #21 déplace la fermeture sur le bouton après soumission. #22 confirme le correctif et durcit la gestion du clic extérieur. | Ne pas fermer/démonter le formulaire avant sa soumission; tester `action={logout}` avec un compte authentifié. |
| #11 → #13 | L’administration SMTP/notifications existait dans le code mais n’était pas toujours accessible depuis une navigation ou des vues dédiées. | #11 ajoute le centre admin et SMTP; #12 rend la configuration SMTP administrable; #13 ajoute les cartes/sections admin et conserve `requireAdmin()`. | Vérifier simultanément route, navigation, garde serveur et variables SMTP; reconstruire/redémarrer l’image après fusion. |
| #15 → #16 | Les changements Docker pouvaient ne pas être appliqués après redémarrage ou base PostgreSQL non prête. | #16 ajoute les politiques `restart`, l’attente/retry Prisma et le healthcheck/ordre de démarrage documentés dans la PR. | Valider `docker compose config`, tester un redémarrage à froid et attendre `service_healthy` avant `prisma db push`. |
| #1–#6, #8, #14, #15, #18, #19 | Aucun échec CI/build précis n’est établi par les informations de PR disponibles; plusieurs descriptions disent seulement que la validation locale n’a pas été exécutée ou que la PR est vide/WIP. | Ne pas transformer une validation non exécutée en erreur de compilation. Les checks réussis lorsqu’ils sont présents restent la preuve de référence. | Conserver la distinction entre échec observé, validation non exécutée et régression fonctionnelle. |

### Références de regroupement

- Les régressions de fichiers/layouts entiers sont documentées avec leurs correctifs dans les PR **#19–#22**; elles complètent l’erreur de fichier tronqué déjà listée ci-dessus.
- Les sujets récurrents « admin », « SMTP », « Docker/Compose » et « marque/header » sont regroupés par chaîne de régression plutôt que répétés comme des erreurs indépendantes.
- Les PR **#1** et **#2** ont des checks GitHub réussis dans l’historique consulté; cela ne constitue pas une preuve d’échec CI pour ces PR.
