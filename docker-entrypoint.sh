#!/bin/sh
set -eu

prisma_cli="/app/node_modules/prisma/build/index.js"
if [ ! -f "$prisma_cli" ]; then
  echo "[benevo+] Prisma CLI introuvable dans l’image ($prisma_cli) : image runner mal construite, arrêt." >&2
  exit 1
fi
if [ ! -d /app/node_modules/@prisma ] || [ ! -d /app/node_modules/.prisma ]; then
  echo "[benevo+] Runtime Prisma incomplet dans l’image (node_modules/@prisma ou node_modules/.prisma absent), arrêt." >&2
  exit 1
fi

# PostgreSQL may still be starting after a host reboot. Retry only errors that
# clearly indicate a database connection/readiness problem; CLI or schema
# errors must fail immediately instead of being misreported as PostgreSQL down.
max_attempts=30
attempt=1
echo "[benevo+] Synchronisation du schéma de base de données..."
while :; do
  prisma_output=$(mktemp)
  if node "$prisma_cli" db push --skip-generate >"$prisma_output" 2>&1; then
    cat "$prisma_output"
    rm -f "$prisma_output"
    break
  fi
  status=$?
  cat "$prisma_output" >&2
  if ! grep -Eq 'P1001|P1002|P1017|ECONNREFUSED|ECONNRESET|ETIMEDOUT|Connection refused|database system is starting up' "$prisma_output"; then
    echo "[benevo+] Prisma db push a échoué (erreur non liée à la disponibilité de PostgreSQL), arrêt immédiat." >&2
    rm -f "$prisma_output"
    exit "$status"
  fi
  rm -f "$prisma_output"
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "[benevo+] PostgreSQL indisponible après ${max_attempts} tentatives, arrêt." >&2
    exit 1
  fi
  echo "[benevo+] PostgreSQL n’est pas encore prêt (tentative ${attempt}/${max_attempts}), nouvel essai dans 2 s..." >&2
  attempt=$((attempt + 1))
  sleep 2
done

echo "[benevo+] Démarrage sur le port ${PORT:-3000}"
export HOSTNAME=0.0.0.0
exec node server.js
