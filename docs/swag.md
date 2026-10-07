# Reverse proxy SWAG

Le dépôt contient déjà `swag/benevo.subdomain.conf`. Il route le domaine vers le conteneur Compose `benevo-plus` sur son port interne 3000.

## Réseau Docker

SWAG et Bénévo+ doivent partager le réseau externe indiqué par `NETWORK_NAME` dans `docker-compose.yml` (par exemple `swag_default`). Le service `app` rejoint ce réseau sous le nom de conteneur `benevo-plus`; la base `benevo-plus-db` reste sur le réseau interne et n’a pas besoin d’être exposée à SWAG.

## Configuration du sous-domaine

Copier `swag/benevo.subdomain.conf` dans `swag/config/nginx/proxy-confs/`, puis adapter le domaine. Exemple basé sur la configuration fournie :

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name benevo.*;

    include /config/nginx/ssl.conf;
    client_max_body_size 5M;

    location / {
        include /config/nginx/proxy.conf;
        include /config/nginx/resolver.conf;
        set $upstream_app benevo-plus;
        set $upstream_port 3000;
        set $upstream_proto http;
        proxy_pass $upstream_proto://$upstream_app:$upstream_port;
    }
}
```

Le nom amont `benevo-plus` et le port `3000` sont ceux du Compose/Dockerfile. Ne pas remplacer l’amont par `localhost` : depuis SWAG, cela désignerait le conteneur SWAG lui-même.

## DNS et certificat

1. Créer un enregistrement DNS `A`/`AAAA` pour le sous-domaine vers l’hôte qui exécute SWAG.
2. Configurer la demande de certificat dans SWAG pour le domaine réel et vérifier que les ports 80/443 sont accessibles depuis Internet.
3. Remplacer `server_name benevo.*` si nécessaire par le nom exact utilisé par votre installation SWAG, puis recharger SWAG.

## URL Auth.js

Définir dans Portainer :

```dotenv
AUTH_URL=https://benevo.example.org
AUTH_TRUST_HOST=true
```

`AUTH_URL` doit être exactement l’URL HTTPS publique (même schéma, domaine et sans slash final) utilisée par SWAG et déclarée dans Google Cloud. Le projet utilise `AUTH_URL` et `AUTH_TRUST_HOST` dans son Compose/Auth.js ; aucun réglage `NEXTAUTH_URL` n’est requis par le code de production actuel.

L’URI Google correspondante est `https://benevo.example.org/api/auth/callback/google`. Voir [google-oauth.md](google-oauth.md).

## Diagnostic

- **502 Bad Gateway** : vérifier que `benevo-plus` est démarré, que SWAG et l’application partagent `NETWORK_NAME`, et que le port 3000 est utilisé.
- **Erreur OAuth / URL incorrecte** : vérifier `AUTH_URL`, le DNS, le certificat et l’URI de redirection Google.
- **Connexion impossible après redéploiement** : vérifier `AUTH_SECRET` et les logs de `benevo-plus`.

La configuration Next.js définit déjà des en-têtes de sécurité. Aucun réglage supplémentaire de trusted hosts n’est nécessaire dans `next.config.mjs`; `AUTH_TRUST_HOST=true` est toutefois requis pour l’exécution derrière ce reverse proxy dans la configuration Compose.
