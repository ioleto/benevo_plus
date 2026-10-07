# Google OAuth pour Bénévo+

Ce guide configure le fournisseur Google utilisé par Auth.js dans `src/auth.ts`.

## 1. Créer le client Google

1. Ouvrir [Google Cloud Console](https://console.cloud.google.com/).
2. Sélectionner ou créer un projet.
3. Dans **APIs et services > Écran de consentement OAuth**, choisir le type adapté (en général **Externe**), renseigner le nom de l’application et l’adresse e-mail de support, puis enregistrer les informations demandées.
4. Dans **APIs et services > Identifiants**, choisir **Créer des identifiants > ID client OAuth**.
5. Choisir **Application Web** et donner un nom explicite au client.

## 2. Déclarer les URL

Pour un déploiement HTTPS sur `https://benevo.example.org` :

- **Origines JavaScript autorisées** : `https://benevo.example.org`
- **URI de redirection autorisée** : `https://benevo.example.org/api/auth/callback/google`

Le callback correspond à la route Auth.js exposée sous `/api/auth` et au fournisseur `Google` déclaré dans `src/auth.ts`. Remplacer le domaine par le domaine public réel, sans slash final. Pour un développement local, ajouter séparément :

- origine : `http://localhost:3000`
- redirection : `http://localhost:3000/api/auth/callback/google`

Ne pas utiliser une URL interne Docker (`http://app:3000`) dans Google Cloud : Google doit pouvoir joindre l’URL publique du navigateur.

## 3. Renseigner l’environnement

Copier `.env.example` puis compléter :

```dotenv
AUTH_URL=https://benevo.example.org
AUTH_SECRET=<secret-fort-genere-localement>
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=<client-id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<secret-du-client>
ADMIN_EMAIL=admin@example.org
```

`ADMIN_EMAIL` n’est pas une information Google OAuth : il indique quelle adresse, lorsqu’elle se connecte, reçoit le rôle applicatif `ADMIN`. `AUTH_SECRET` et `AUTH_GOOGLE_SECRET` sont des secrets et ne doivent pas être commités.

Pour Docker Compose, renseigner aussi les variables PostgreSQL et `NETWORK_NAME` décrites dans le [README](../README.md). Auth.js utilise `AUTH_URL`; il doit être exactement le même domaine HTTPS que celui déclaré côté Google et côté SWAG.

## 4. Vérifier

Après redémarrage de l’application, ouvrir `/connexion`, choisir Google et vérifier que le navigateur revient sur Bénévo+. En cas de `redirect_uri_mismatch`, comparer caractère par caractère le domaine, le protocole, le chemin `/api/auth/callback/google` et l’absence de slash final.
