#!/bin/sh
set -eu

# Compose démarre désormais l'app dès que le conteneur DB est lancé. PostgreSQL
# et/ou Prisma peuvent néanmoins rester indisponibles après un reboot. Boucler
# sans limite évite que le conteneur sorte définitivement sur une panne transitoire.
while :; do
  echo "[benevo+] Synchronisation du schéma de base de données..."
  if node node_modules/prisma/build/index.js db push --skip-generate; then
    break
  fi
  echo "[benevo+] PostgreSQL ou la migration n'est pas prête; nouvel essai dans 5 s..." >&2
  sleep 5
done

echo "[benevo+] Démarrage sur le port ${PORT:-3000}"
exec node server.js
