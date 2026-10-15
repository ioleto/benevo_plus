#!/bin/sh
set -eu

# PostgreSQL may still be starting after a host reboot. Keep the container alive
# long enough for the database to accept connections instead of exiting once.
max_attempts=30
attempt=1
echo "[benevo+] Synchronisation du schéma de base de données..."
until node node_modules/prisma/build/index.js db push --skip-generate; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "[benevo+] PostgreSQL indisponible après ${max_attempts} tentatives, arrêt." >&2
    exit 1
  fi
  echo "[benevo+] PostgreSQL n’est pas encore prêt (tentative ${attempt}/${max_attempts}), nouvel essai dans 2 s..." >&2
  attempt=$((attempt + 1))
  sleep 2
done

echo "[benevo+] Démarrage sur le port ${PORT:-3000}"
exec node server.js
