# Bénévo+

Bénévo+ est une plateforme qui met en relation des bénévoles et les besoins des communautés : découverte de besoins, engagements, communautés et suivi des contributions.

## Stack

- **Next.js 15.1** avec React 19 et TypeScript
- **Auth.js / NextAuth 5 beta** avec Google OAuth et sessions en base
- **Prisma 5.22** et PostgreSQL 16
- **Tailwind CSS 3**
- Image Docker multi-stage `node:20-alpine`, sortie Next.js standalone
- SWAG comme reverse proxy TLS (configuration fournie dans `swag/`)

## Prérequis

- Node.js 20+
- PostgreSQL 16 (ou la stack Docker/Portainer fournie)
- Un client OAuth Google pour la connexion

## Développement local

```bash
npm install
cp .env.example .env
# Renseigner les valeurs dans .env
npx prisma generate
npm run db:push
npm run dev
```

L’application est disponible sur `http://localhost:3000`. `npm run db:push` synchronise le schéma Prisma avec la base indiquée par `DATABASE_URL`. Le script de démarrage Docker exécute également cette synchronisation automatiquement (`prisma db push --skip-generate`) avant de lancer Next.js.

Scripts utiles :

```bash
npm run build
npm run start
npm run lint
npm run typecheck
npm run db:studio
```

## Variables d’environnement

Les noms ci-dessous sont ceux présents dans `.env.example`, `docker-compose.yml`, `src/auth.ts`, Prisma et/ou le démarrage Docker. Utiliser des valeurs réelles uniquement dans l’environnement de déploiement, jamais dans Git.

| Variable | Rôle | Exemple sans secret |
|---|---|---|
| `AUTH_URL` | URL publique utilisée par Auth.js | `https://benevo.example.org` |
| `AUTH_SECRET` | Secret de chiffrement/signature des sessions Auth.js | `$(openssl rand -base64 32)` |
| `AUTH_TRUST_HOST` | Autorise l’application derrière le reverse proxy | `true` |
| `AUTH_GOOGLE_ID` | Client ID Google OAuth | `1234567890-xxx.apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | Secret du client Google OAuth | `remplacer-par-le-secret` |
| `ADMIN_EMAIL` | Adresse Google promue au rôle `ADMIN` à la connexion | `admin@example.org` |
| `DATABASE_URL` | URL Prisma PostgreSQL | `postgresql://benevo:mot-de-passe@db:5432/benevo?schema=public` |
| `POSTGRES_USER` | Utilisateur du conteneur PostgreSQL et valeur de connexion Docker | `benevo` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `remplacer-par-un-mot-de-passe-fort` |
| `POSTGRES_DB` | Nom de la base PostgreSQL | `benevo` |
| `NETWORK_NAME` | Nom du réseau Docker externe partagé avec SWAG | `swag_default` |

Dans Compose, `DATABASE_URL` est construite pour le service applicatif à partir de `POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB`. Si vous exécutez l’application hors Compose, définissez directement `DATABASE_URL`.

## Docker et Portainer

Le fichier `docker-compose.yml` définit `app` (`benevo-plus`) et `db` (`benevo-plus-db`). PostgreSQL persiste dans le volume nommé `db-data`; l’application écoute sur le port interne 3000 et est destinée à être jointe par SWAG sur le réseau Docker externe indiqué par `NETWORK_NAME`.

Voir le [guide Portainer](docs/portainer.md) et le [guide SWAG](docs/swag.md).

## Google OAuth

Voir [docs/google-oauth.md](docs/google-oauth.md) pour créer le client, déclarer les origines et l’URI de redirection.

## CI

`.github/workflows/ci.yml` s’exécute sur les pushes et pull requests vers `main`. Il installe les dépendances avec Node 20, génère Prisma, lance le lint, le typecheck et le build Next.js, puis construit l’image Docker sans la publier.

## Documentation

- [Google OAuth](docs/google-oauth.md)
- [Déploiement Portainer](docs/portainer.md)
- [Reverse proxy SWAG](docs/swag.md)
- [`.env.example`](.env.example)
- [`docker-compose.yml`](docker-compose.yml)
