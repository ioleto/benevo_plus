# Déployer Bénévo+ avec Portainer

Le dépôt contient un `docker-compose.yml` prêt pour une Stack Portainer. Il construit l’image locale de l’application et lance PostgreSQL 16.

## 1. Préparer le réseau SWAG

Le Compose attend un réseau Docker **externe** dont le nom est fourni par `NETWORK_NAME` (exemple : `swag_default`). Ce réseau doit déjà exister et être partagé par SWAG et le conteneur `benevo-plus`.

## 2. Créer la stack

Dans Portainer :

1. **Stacks > Add stack**.
2. Choisir **Git repository**, indiquer le dépôt `https://github.com/ioleto/benevo_plus` et le chemin Compose `docker-compose.yml` ; ou choisir **Web editor** et coller le contenu du fichier du dépôt.
3. Dans la section des variables d’environnement, définir les variables listées ci-dessous. Ne pas saisir de secrets dans le dépôt.
4. Déployer la stack.

Variables nécessaires ou utilisées par le Compose :

```dotenv
AUTH_URL=https://benevo.example.org
AUTH_SECRET=<secret-fort>
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=<client-id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<secret-google>
ADMIN_EMAIL=admin@example.org
POSTGRES_USER=benevo
POSTGRES_PASSWORD=<mot-de-passe-fort>
POSTGRES_DB=benevo
NETWORK_NAME=swag_default
```

`DATABASE_URL` figure dans `.env.example`, mais le Compose la construit lui-même pour le service `app` à partir des trois variables `POSTGRES_*`; il n’est donc pas nécessaire de la redéfinir dans la Stack. Le service `app` utilise `db:5432` comme hôte interne.

## Persistance et première initialisation

- PostgreSQL utilise le volume nommé `db-data`, monté sur `/var/lib/postgresql/data`. Ne pas le supprimer lors d’une mise à jour.
- Le service `app` attend le healthcheck de PostgreSQL.
- Au démarrage, `docker-entrypoint.sh` lance `prisma db push --skip-generate`, puis `server.js`. La première synchronisation du schéma est donc automatique ; surveiller les logs de `benevo-plus`.
- Pour une synchronisation manuelle exceptionnelle, exécuter depuis le conteneur applicatif :

```bash
docker exec benevo-plus node node_modules/prisma/build/index.js db push --skip-generate
```

Le dépôt ne contient pas de dossier `prisma/migrations` : le déploiement actuel utilise `db push`, pas des migrations versionnées.

## Vérifier et exploiter la stack

Le Compose ne publie pas le port 3000 sur l’hôte : SWAG doit joindre `benevo-plus:3000` via le réseau partagé. Vérifier que le conteneur est sain puis consulter **Containers > benevo-plus > Logs** et **benevo-plus-db > Logs**.

## Mises à jour

1. Sauvegarder PostgreSQL (ou le volume selon la politique d’exploitation).
2. Dans la Stack, cliquer **Pull and redeploy** pour une source Git, ou mettre à jour le contenu de l’éditeur.
3. Conserver les mêmes variables et le volume `db-data`.
4. Contrôler les logs : le schéma est resynchronisé au démarrage, puis l’application écoute sur le port 3000.
5. Tester la page de connexion et `/api/health` derrière SWAG.
