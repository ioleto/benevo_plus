
## P0 — migrations et sauvegardes (terminé)

- Les déploiements utilisent désormais `prisma migrate deploy`, avec une migration initiale versionnée dans `prisma/migrations/`.
- Au premier démarrage d’une base existante issue de `prisma db push`, l’entrypoint détecte les tables sans `_prisma_migrations`, marque la migration initiale comme appliquée, puis déploie les migrations suivantes. Conserver `db-data` et faire une sauvegarde avant mise à jour.
- En développement : `npx prisma migrate dev --name nom-du-changement`, puis committer la migration. En production : `docker compose up -d --build` ; ne jamais utiliser `db push`.
- Le service `backup` crée chaque jour un dump PostgreSQL au format custom (`./backups`) et conserve 14 jours par défaut. Sauvegarde manuelle : `POSTGRES_PASSWORD=... ./scripts/backup-db.sh`.
- Restauration destructive après vérification du fichier : `CONFIRM_RESTORE=YES POSTGRES_PASSWORD=... ./scripts/restore-db.sh backups/benevo-...dump`. Faire d’abord un test sur une copie de l’environnement, vérifier les logs et les données, puis seulement restaurer la production.

### Test de restauration recommandé

1. Créer une base PostgreSQL temporaire isolée.
2. Restaurer un dump avec `CONFIRM_RESTORE=YES` en ciblant cette base (`POSTGRES_HOST`, `POSTGRES_DB`).
3. Lancer `prisma migrate deploy`, démarrer l’application et vérifier connexion, comptes, communautés et besoins.
4. Comparer les volumes de données et conserver le résultat daté du test.
