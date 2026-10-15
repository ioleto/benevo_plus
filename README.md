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
