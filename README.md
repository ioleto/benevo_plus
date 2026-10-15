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
