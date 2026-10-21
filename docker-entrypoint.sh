#!/bin/sh
set -eu
prisma_cli="/app/node_modules/prisma/build/index.js"
[ -f "$prisma_cli" ] || { echo "[benevo+] Prisma CLI introuvable" >&2; exit 1; }
[ -d /app/node_modules/@prisma ] && [ -d /app/node_modules/.prisma ] || { echo "[benevo+] Runtime Prisma incomplet" >&2; exit 1; }

# Retry indefinitely while PostgreSQL is starting. Before the first deploy, safely
# baseline databases created by the former db push workflow.
while :; do
  output=$(mktemp)
  if node "$prisma_cli" migrate deploy >"$output" 2>&1; then cat "$output"; rm -f "$output"; break; fi
  status=$?; cat "$output" >&2
  if ! grep -Eq 'P1001|P1002|P1017|ECONNREFUSED|ECONNRESET|ETIMEDOUT|Connection refused|database system is starting up' "$output"; then
    rm -f "$output"; exit "$status"
  fi
  rm -f "$output"; echo "[benevo+] PostgreSQL indisponible, nouvel essai dans 2 s..." >&2; sleep 2
done

echo "[benevo+] Démarrage sur le port ${PORT:-3000}"
export HOSTNAME=0.0.0.0
exec node server.js
