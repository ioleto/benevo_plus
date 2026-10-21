# Bénévo+

Bénévo+ met en relation des bénévoles et les besoins de communautés locales. L'application est une application Next.js (App Router) en TypeScript, authentifiée par Auth.js/Google, avec Prisma et PostgreSQL.

## Fonctionnalités

- inscription/connexion Auth.js avec Google et sessions persistées par Prisma ;
- profils et informations de contact des bénévoles ;
- communautés publiques et privées, création, code d'invitation, adhésion et gestion des membres ;
- exploration des communautés publiques par nom, description et ville ;
- carte Leaflet/OpenStreetMap des communautés publiques et des communautés privées que l'utilisateur a rejointes ou créées ;
- autocomplétion des villes via `api-adresse.data.gouv.fr`, avec latitude/longitude facultatives ;
- missions et besoins de bénévolat, candidatures/participation et suivi des statuts ;
- discussions/fil d'actualité liés aux communautés et aux missions ;
- événements récurrents, capacité et rappels ;
- administration : utilisateurs, communautés, missions, signalements et configuration SMTP ;
- envoi d'e-mails via SMTP, avec mot de passe chiffré par une clé dérivée d'`AUTH_SECRET` ;
- tâche périodique de rappels via le service Compose `cron` ;
- reverse proxy SWAG/HTTPS et réseau Docker externe configurable ;
- persistance PostgreSQL dans le volume Docker nommé `db-data`.

## Architecture

`src/app` contient les routes App Router, Server Actions et API. `src/components` contient les composants d'interface, `src/lib` les utilitaires (Prisma, e-mail, chiffrement) et `src/server` la logique serveur. Le modèle relationnel est dans `prisma/schema.prisma`. Le `Dockerfile` produit une image standalone Next.js ; `docker-entrypoint.sh` applique `prisma db push` puis lance `server.js`.

Les services sont : `app` (Next.js, port 3000), `db` (PostgreSQL 16), et `cron` (appel HTTP des rappels toutes les cinq minutes). Le volume `db-data` est indispensable. Ne pas supprimer le volume ni changer `AUTH_SECRET` : cela détruirait la persistance logique ou empêcherait de relire les secrets SMTP chiffrés.

## Variables d'environnement

Copier `.env.example` vers `.env` et renseigner les valeurs :

| Variable | Rôle |
|---|---|
| `AUTH_URL` | URL publique Auth.js, par exemple `https://benevo.example.fr` |
| `AUTH_SECRET` | secret stable et aléatoire ; obligatoire, ne jamais le régénérer entre déploiements |
| `AUTH_TRUST_HOST` | `true` derrière le reverse proxy |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | identifiants OAuth Google |
| `ADMIN_EMAIL` ou `ADMIN_EMAILS` | administrateur(s) autorisé(s) |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | identifiants PostgreSQL ; le mot de passe est obligatoire |
| `NETWORK_NAME` | nom du réseau Docker externe exposé par SWAG |
| `CRON_SECRET` | secret de l'API de rappels |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_FROM_NAME` | envoi d'e-mails ; les champs SMTP peuvent rester vides si l'e-mail n'est pas utilisé |

`DATABASE_URL` est construite par Compose à partir des variables PostgreSQL. En production, conserver le même fichier `.env` et le même `AUTH_SECRET`.

## Développement

```bash
npm ci
npx prisma generate
npm run dev
```

Scripts utiles : `npm run typecheck`, `npm run lint`, `npm run build`, `npm run db:push` et `npm run db:studio`. En développement, utiliser un PostgreSQL local et définir `DATABASE_URL`.

## Déploiement Docker

```bash
cp .env.example .env
# renseigner toutes les valeurs obligatoires
# créer au préalable le réseau externe, si SWAG l'utilise
docker network create <NETWORK_NAME> 2>/dev/null || true
docker compose up -d --build
docker compose ps
docker compose logs -f app
```

Ne pas utiliser `docker compose run` ou `docker run` pour la production : ces commandes créent un conteneur ponctuel et ne reprennent pas nécessairement la politique du service. Utiliser `docker compose up -d`, qui applique `restart: always` aux trois services.

## Autodémarrage après reboot

Le fichier `docker-compose.yml` utilise `restart: always` pour `app`, `db` et `cron`. L'application ne dépend plus de la réussite immédiate du healthcheck : elle démarre dès que PostgreSQL est lancé, puis `docker-entrypoint.sh` réessaie la connexion et `db push` toutes les cinq secondes. Cela couvre les courses de démarrage et les migrations temporairement impossibles.

Pour une garantie explicite au niveau de l'hôte :

```bash
sudo mkdir -p /opt/benevo-plus
sudo cp -a . /opt/benevo-plus/
sudo cp deploy/benevo.service /etc/systemd/system/benevo.service
sudo systemctl daemon-reload
sudo systemctl enable --now docker
sudo systemctl enable --now benevo.service
sudo systemctl status benevo.service docker
```

Adapter `WorkingDirectory` et le chemin de `docker` si nécessaire (`command -v docker`). Docker doit être installé comme service systemd classique ; avec Docker rootless ou Snap, l'unité et le chemin peuvent différer. Dans ce cas, activer le service utilisateur/rootless approprié et ajuster l'unité plutôt que de mélanger les contextes root et utilisateur.

Diagnostic non destructif :

```bash
chmod +x scripts/check-autostart.sh
./scripts/check-autostart.sh /opt/benevo-plus
docker compose ps -a
docker compose logs --tail=200 app db cron
```

Vérifier notamment `systemctl is-enabled docker`, `systemctl is-active docker`, la politique `always` affichée par `docker inspect`, les sorties non nulles (`exit`) et la santé PostgreSQL. Si `swag` est un réseau externe absent ou si une variable obligatoire manque, Compose ne peut pas créer les conteneurs : corriger `.env`/le réseau puis relancer `docker compose up -d`.

## Persistance et sauvegardes

`db-data` survit aux recréations de conteneurs mais ne remplace pas une sauvegarde. Exporter PostgreSQL régulièrement (`pg_dump`) et tester une restauration. Ne pas lancer `prisma db push --accept-data-loss` en production. Conserver `.env` hors Git et sauvegarder séparément `AUTH_SECRET`.

## Propositions issues de l'analyse (non implémentées)

Priorité **P0** — remplacer `prisma db push` par des migrations versionnées (`prisma migrate deploy`) et ajouter une sauvegarde/restauration testée ; `docker-entrypoint.sh`, `prisma/schema.prisma`.

Priorité **P1** — ajouter des tests automatisés des Server Actions/API (authentification, autorisation, adhésion, missions récurrentes et rappels) et un healthcheck HTTP de `app` ; `src/app/api`, `src/server`, `docker-compose.yml`.

Priorité **P1** — rendre le job `cron` observable et idempotent (journalisation, métriques, timeout explicite, gestion des réponses 4xx/5xx) ; `docker-compose.yml`, `src/app/api/cron`.

Priorité **P1** — valider et limiter les entrées d'autocomplétion/cartographie, documenter la politique de cache et les conditions OSM/Adresse ; `src/components`, `src/app/communautes`.

Priorité **P2** — améliorer l'accessibilité (clavier, focus, labels, contrastes, alternative à la carte) et l'état mobile de l'explorateur ; `src/components/CommunityMap*`, `src/app`, `src/app/globals.css`.

Priorité **P2** — ajouter pagination, filtres persistants et états vides/chargement cohérents aux listes d'administration, missions et discussions ; `src/app/admin`, `src/app/communautes`, `src/app/missions`.

Priorité **P2** — ajouter une interface de diagnostic administrateur (version, état SMTP, dernier rappel, statut DB sans exposer de secrets) ; `src/app/admin`, `src/components`.

Priorité **P3** — ajouter une stratégie de rétention/anonymisation RGPD pour comptes, coordonnées et événements ; `prisma/schema.prisma`, `src/server`.

## Documentation complémentaire

Voir `docs/google-oauth.md`, `docs/portainer.md` et `docs/swag.md` pour OAuth, Portainer et le reverse proxy.
