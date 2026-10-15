# Bénévo+

Bénévo+ est une plateforme francophone de mise en relation entre personnes ayant un besoin d’aide et bénévoles, dans des communautés ou dans l’espace public.

## Fonctionnalités

- Auth.js/Google OAuth, profils (nom, prénom, avatar, ville, bio), consentements et export RGPD.
- Publication et modification de besoins : titre, description, catégorie, ville, date, places minimum/maximum, communauté et récurrence.
- Découverte, engagement (« J’aide ! »), désengagement, discussion, confirmation de réalisation, points et badges.
- **Mes besoins** : participants inscrits consultables dans un popover (noms et avatars, état vide), compteur de vues, bouton crayon d’édition et bouton corbeille confirmé.
- Le bouton corbeille conserve l’action métier existante : il clôture le besoin (`status = DONE`) et ne supprime pas définitivement la donnée.
- Communautés (membres, rôles MEMBER/MANAGER/OWNER, modération) et centre d’administration.

## Pages et API

Pages publiques : `/`, `/connexion`, `/cgu`, `/confidentialite`, `/cookies`, `/mentions-legales`.
Pages connectées : `/app`, `/app/bienvenue`, `/app/profil`, `/app/besoins/nouveau`, `/app/besoins/[id]`, `/app/besoins/[id]/modifier`, `/app/mes-besoins`, `/app/mes-engagements`, `/app/communautes`, `/app/discussions`, `/app/classement`, `/app/admin`.
API : `/api/auth/[...nextauth]`, `/api/health`, `/api/cron/reminders`, `/api/me/export`, `/api/rgpd/export`, `/api/admin/settings`.

## Schéma et déploiement

Prisma 5/PostgreSQL contient notamment `Need`, `Commitment`, `User`, `Community`, `Membership`, `Message`, `Swipe`, `UserBadge`, `Setting` et `EmailLog`. `Need.viewCount Int @default(0)` compte les ouvertures du détail par les utilisateurs autres que l’auteur. Les inscriptions sont des `Commitment` et leur liste est chargée côté serveur dans Mes besoins, uniquement pour l’auteur connecté. Le déploiement applique le schéma avec `prisma db push`.

## Installation

Node.js 20+, PostgreSQL ou Docker, OAuth Google et `.env` configuré :

```bash
npm ci
npx prisma generate
npx prisma db push
npm run dev
```

Scripts de contrôle : `npm run lint`, `npm run typecheck`, `npm run build`. Ne jamais versionner les secrets. Voir `docs/` et `.env.example` pour le déploiement, OAuth et reverse proxy.
