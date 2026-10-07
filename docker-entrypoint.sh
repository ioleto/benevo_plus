#!/bin/sh
set -e
echo "[benevo+] Synchronisation du schéma de base de données..."
node node_modules/prisma/build/index.js db push --skip-generate
echo "[benevo+] Démarrage sur le port ${PORT:-3000}"
exec node server.js
