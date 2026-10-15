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

## Fonctionnalités

### Utilisateur et authentification

- Connexion via Google OAuth avec Auth.js/NextAuth et sessions persistées en base PostgreSQL. Le dépôt ne configure pas de fournisseur Apple.
- Attribution du rôle administrateur à partir de `ADMIN_EMAIL`; déconnexion depuis le menu utilisateur.
- Profil utilisateur : nom, e-mail, avatar, paramètres et export des données RGPD.

### Bénévolat et communautés

- Création, modification, consultation et suppression de besoins/missions.
- Besoins associés à une communauté, avec description, catégories, lieu, date, durée, capacité minimale et maximale.
- Récurrence des besoins (fréquence et bornes de récurrence) et suivi des besoins publiés dans « Mes besoins ».
- Découverte des besoins par cartes/swipes, engagement sur une mission, suivi dans « Mes engagements » et gestion des statuts.
- Communautés : liste, page de détail, création/gestion des paramètres et suppression réservée aux personnes autorisées.
- Discussions par mission : canaux de discussion associés aux missions et page « Mes discussions ».
- Badges et gamification des contributions, avec page de classement.

### Administration et e-mails

- Centre d’administration avec tableau de bord, gestion des utilisateurs, des besoins et des communautés.
- Suspension/réactivation des utilisateurs et suppression des communautés depuis les écrans d’administration.
- Paramètres d’administration, configuration/test SMTP et réglages des notifications e-mail.
- E-mails applicatifs et rappels planifiés via la route cron; les envois et erreurs sont journalisés dans le modèle `EmailLog`.

### Pages, API et expérience web

Pages publiques : `/`, `/connexion`, `/bienvenue`, `/cgu`, `/confidentialite`, `/cookies` et `/mentions-legales`. Pages authentifiées : `/app`, `/app/bienvenue`, `/app/profil`, `/app/besoins/nouveau`, `/app/besoins/[id]`, `/app/besoins/[id]/modifier`, `/app/mes-besoins`, `/app/mes-engagements`, `/app/communautes`, `/app/communautes/[id]`, `/app/communautes/[id]/parametres`, `/app/discussions` et `/app/classement`. Administration : `/app/admin`, `/app/admin/users`, `/app/admin/besoins`, `/app/admin/besoins/[id]` et `/admin`.

Routes API présentes : `/api/auth/[...nextauth]`, `/api/health`, `/api/cron/reminders`, `/api/me/export`, `/api/rgpd/export` et `/api/admin/settings`.

L’application est installable comme PWA via `public/manifest.webmanifest`, `public/icon.svg` et `public/sw.js`. Le service worker utilise un cache versionné et une stratégie réseau-avec-repli-hors-ligne pour les navigations.

### Modèle de données

Le schéma Prisma (`prisma/schema.prisma`) couvre notamment les utilisateurs, comptes/sessions Auth.js, communautés, membres de communautés, besoins récurrents, engagements, swipes, canaux/messages de discussion, badges et attributions de badges, notifications, paramètres SMTP et journaux d’e-mails. Les enums définissent les rôles, statuts et préférences utilisés par l’application.

### Variables d’environnement

En plus de `AUTH_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ADMIN_EMAIL` et `DATABASE_URL`, Compose utilise `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `NETWORK_NAME`, `CRON_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` et `SMTP_FROM_NAME`. Les valeurs obligatoires sont contrôlées par Compose; les secrets ne doivent pas être commités. `NETWORK_NAME` doit désigner le réseau Docker externe partagé avec SWAG.

### Structure du projet

- `src/app/` : pages App Router, pages légales, pages applicatives, administration et routes API.
- `src/components/` : menu utilisateur, inscription du service worker, SMTP et composants d’action.
- `src/server/` : actions serveur et attribution des badges.
- `src/lib/` : Prisma, session, validation, e-mail, administration et gamification.
- `src/auth.ts`, `prisma/schema.prisma`, `public/`, `Dockerfile`, `docker-compose.yml` et `docker-entrypoint.sh` : authentification, données, PWA et déploiement.

### Déploiement et redémarrage

Compose applique `restart: unless-stopped` à `app`, `cron` et `db`. PostgreSQL possède un healthcheck `pg_isready`; l’application attend `service_healthy` et son entrypoint retente `prisma db push` jusqu’à 30 fois avec un délai de 2 secondes. Le réseau externe SWAG doit exister avant le déploiement, par exemple `docker network create <NETWORK_NAME>` si nécessaire.

Sur l’hôte, activer Docker au démarrage (`sudo systemctl enable --now docker`), vérifier que Portainer démarre avec une politique de redémarrage, puis redéployer/recréer la stack depuis GitHub afin que Compose applique les nouvelles politiques et le nouvel entrypoint. Vérifier ensuite les logs `app` et `db` et l’endpoint `/api/health`.
