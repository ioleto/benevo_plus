# Bénévo+

Bénévo+ est une plateforme francophone de mise en relation entre personnes ayant un besoin d’aide et bénévoles, dans des communautés (paroisses, associations…) ou dans l’espace public.

## Stack et architecture

- Next.js 15 App Router, React 19, TypeScript et Tailwind CSS 3.
- Auth.js/NextAuth 5 beta avec Google OAuth, Prisma Adapter et sessions PostgreSQL.
- Prisma 5.22 et PostgreSQL 16 ; image Docker multi-stage `node:20-alpine` en mode standalone.
- SWAG comme reverse proxy TLS ; PWA installable avec `public/manifest.webmanifest` et `public/sw.js`.
- Les pages sont sous `src/app`; les actions métier sous `src/server`; les contrôles et intégrations sous `src/lib`.

## Installation locale

Prérequis : Node.js 20+, PostgreSQL 16 (ou Docker), un client OAuth Google et un fichier `.env`.

```bash
npm ci
cp .env.example .env
# renseigner les secrets et DATABASE_URL
npx prisma generate
npx prisma db push
npm run dev
```

L’application démarre sur `http://localhost:3000`. Scripts : `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`, `npm run db:push` et `npm run db:studio`.

## Fonctionnalités

### Parcours utilisateur

- Accueil public, connexion Google, acceptation des CGU et consentement sensible optionnel.
- Profil (nom, prénom, ville, bio, avatar, visibilité au classement, préférences e-mail), déconnexion et export RGPD.
- Publication et modification de besoins : titre, description, catégorie, ville, date, nombre de places, minimum de places, récurrence (quotidienne, hebdomadaire, bimensuelle ou mensuelle) et date de fin.
- Découverte des besoins, engagement (« J’aide ! »), désengagement, discussion par mission et confirmation de réalisation.
- Mes besoins : suivi, modification et clôture. Mes engagements : état en cours ou terminé. Les points et badges récompensent les contributions.

### Communautés

Une communauté possède un nom, slug, description, ville, code d’invitation, visibilité publique/privée, exigence de code et validation des nouveaux membres. Les rôles sont `MEMBER`, `MANAGER` et `OWNER`. Les responsables approuvent les membres, changent les rôles, modèrent les besoins, régénèrent le code et peuvent supprimer la communauté selon leurs droits. Un besoin communautaire créé par un membre passe en `PENDING` ; un responsable peut le publier ou le refuser.

### Administration

Le centre d’administration permet de consulter les comptes, les besoins/missions, les communautés, les journaux d’e-mails, la configuration SMTP et les préférences de notification. Les administrateurs peuvent suspendre des utilisateurs, gérer les communautés et consulter les détails et discussions des besoins. Les routes sont `/app/admin`, `/app/admin/users`, `/app/admin/besoins`, `/app/admin/besoins/[id]`; `/admin` redirige vers le centre après contrôle d’accès.

### E-mails et rappels

SMTP peut être fourni par variables d’environnement ou enregistré dans le centre admin (la configuration en base est prioritaire). Les événements configurables sont : besoin publié/validé, mission acceptée, message reçu (désactivé, chaque message ou résumé), et rappel avant mission. Les envois et erreurs sont enregistrés dans `EmailLog`. Le conteneur `cron` appelle `/api/cron/reminders` toutes les cinq minutes avec `CRON_SECRET`.

### Pages et API

Pages publiques : `/`, `/connexion`, `/cgu`, `/confidentialite`, `/cookies`, `/mentions-legales`. Pages connectées : `/app`, `/app/bienvenue`, `/app/profil`, `/app/besoins/nouveau`, `/app/besoins/[id]`, `/app/besoins/[id]/modifier`, `/app/mes-besoins`, `/app/mes-engagements`, `/app/communautes`, `/app/communautes/[id]`, `/app/communautes/[id]/parametres`, `/app/discussions`, `/app/classement`.

API : `/api/auth/[...nextauth]`, `/api/health`, `/api/cron/reminders`, `/api/me/export`, `/api/rgpd/export` et `/api/admin/settings`.

Le service worker utilise le cache versionné `benevo-v2`, précache l’accueil, le manifeste et l’icône, et applique réseau-d’abord avec repli hors ligne pour les navigations. Les réponses API ne sont pas mises en cache.

## Modèle de données

Le schéma Prisma contient :

- `User` (identité, e-mail, rôle, profil, points, préférences et consentements), `Account`, `Session`, `VerificationToken` (Auth.js) ;
- `Community` (réglages et invitation) et `Membership` (rôle, approbation) ;
- `Need` (contenu, catégorie, dates, places, récurrence, points, auteur, communauté, statut), `Commitment` (participant et réalisation), `Swipe` ;
- `Message` (discussion d’un besoin), `UserBadge` ;
- `Setting` (SMTP et notifications) et `EmailLog` (destinataire, sujet, statut, erreur).

Les statuts de besoin sont `PENDING → PUBLISHED → DONE`, avec `REJECTED` et `CANCELLED` possibles. Un engagement est confirmé par l’auteur, un responsable communautaire ou un admin ; la confirmation attribue les points.

## Variables d’environnement

Copier `.env.example`. Ne jamais versionner de secret.

| Variable | Usage |
|---|---|
| `AUTH_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST` | URL publique et configuration Auth.js |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Client Google OAuth |
| `ADMIN_EMAIL` | Adresse(s) admin, séparées par des virgules |
| `ADMIN_EMAILS` | Ancien nom accepté en secours, séparé par des virgules |
| `DATABASE_URL` | URL PostgreSQL hors Compose |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Identifiants et base du conteneur PostgreSQL |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_FROM_NAME` | SMTP de secours si aucun réglage n’est enregistré en base |
| `CRON_SECRET` | Authentification de la route de rappels |
| `NETWORK_NAME` | Réseau Docker externe partagé avec SWAG |

L’adresse Google doit correspondre exactement à une adresse configurée, après trim et comparaison insensible à la casse. À chaque session et à chaque garde admin, le rôle est réévalué et promu si nécessaire.

## Docker, Portainer et redéploiement

`docker-compose.yml` définit `app`, `db` et `cron`. `db-data` persiste PostgreSQL. `app` dépend du healthcheck `pg_isready`, et `docker-entrypoint.sh` retente `prisma db push` jusqu’à disponibilité de la base. Les trois services ont `restart: unless-stopped`.

Dans Portainer : renseigner les variables, créer le réseau externe SWAG si nécessaire, puis **Update the stack / redeploy** avec l’option de recréation des conteneurs afin que l’image, l’entrypoint et les variables soient repris. Pour un changement de code, reconstruire l’image (`Pull and redeploy` ou build forcé), pas seulement redémarrer l’ancien conteneur. Vérifier les logs `db`, `app`, `cron` et `GET /api/health`.

## Dépannage

- **`/admin` affiche « Page introuvable »** : utiliser `/app/admin`, vérifier que l’utilisateur Google est connecté avec l’adresse configurée, puis vérifier `ADMIN_EMAIL` ou l’ancien `ADMIN_EMAILS` dans l’environnement du service `app`. Après modification, recréer le conteneur ; une nouvelle connexion/session réévalue et promeut le compte.
- **Les sous-pages admin sont introuvables** : elles sont sous `/app/admin/users` et `/app/admin/besoins` (avec `/app/admin/besoins/[id]`), pas sous `/admin/users`.
- **Les conteneurs ne redémarrent pas** : confirmer `restart: unless-stopped`, que Docker/Portainer démarre au boot, que le réseau `NETWORK_NAME` existe et que les variables obligatoires sont présentes. Lire `docker compose ps` et `docker compose logs app db`.
- **L’app boucle au démarrage** : contrôler la santé PostgreSQL, `POSTGRES_*`, `DATABASE_URL` et les logs de `prisma db push`.
- **OAuth échoue** : vérifier l’URL publique, `AUTH_SECRET`, `AUTH_TRUST_HOST` et l’URI Google `/api/auth/callback/google`.
- **E-mails absents** : vérifier la configuration SMTP dans `/app/admin`, le port/TLS, `SMTP_FROM`, les préférences et `EmailLog`.
- **Ancien logo/cache** : le service worker est `benevo-v2`; recharger après reconstruction et supprimer l’ancien cache si le navigateur conserve des assets.

## CI et roadmap

La CI installe les dépendances, génère Prisma, exécute lint, typecheck, build et construit l’image Docker. Améliorations suggérées : tests unitaires et E2E, migrations Prisma versionnées plutôt que `db push` en production, pagination/recherche de l’administration, véritable envoi des résumés e-mail, observabilité/alerting, limitation anti-abus, meilleure modération et gestion multilingue.

## Documentation complémentaire

- [Google OAuth](docs/google-oauth.md)
- [Déploiement Portainer](docs/portainer.md)
- [Reverse proxy SWAG](docs/swag.md)
- [`.env.example`](.env.example)
