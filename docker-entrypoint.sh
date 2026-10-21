#!/bin/sh
set -eu
prisma_cli="/app/node_modules/prisma/build/index.js"
[ -f "$prisma_cli" ] || { echo "[benevo+] Prisma CLI introuvable" >&2; exit 1; }
[ -d /app/node_modules/@prisma ] && [ -d /app/node_modules/.prisma ] || { echo "[benevo+] Runtime Prisma incomplet" >&2; exit 1; }
while :; do
  output=$(mktemp)
  if node scripts/baseline-migrations.js >"$output" 2>&1 && node "$prisma_cli" migrate deploy >>"$output" 2>&1; then cat "$output"; rm -f "$output"; break; fi
  status=$?; cat "$output" >&2
  if ! grep -Eq 'P1001|P1002|P1017|ECONNREFUSED|ECONNRESET|ETIMEDOUT|Connection refused|database system is starting up' "$output"; then rm -f "$output"; exit "$status"; fi
  rm -f "$output"; echo "[benevo+] PostgreSQL indisponible, nouvel essai dans 2 s..." >&2; sleep 2
done
export HOSTNAME=0.0.0.0
exec node server.js
