#!/bin/sh
set -eu
[ "$#" -eq 1 ] || { echo "Usage: $0 backups/benevo-*.dump" >&2; exit 2; }
file=$1; [ -f "$file" ] || { echo "Fichier absent: $file" >&2; exit 1; }
case "${CONFIRM_RESTORE:-}" in YES) ;; *) echo "ATTENTION: restauration destructive. Exporter CONFIRM_RESTORE=YES pour confirmer." >&2; exit 1;; esac
: "${POSTGRES_USER:=benevo}"; : "${POSTGRES_DB:=benevo}"; : "${POSTGRES_PASSWORD:?Définir POSTGRES_PASSWORD}"
PGPASSWORD="$POSTGRES_PASSWORD" pg_restore --clean --if-exists --no-owner -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$file"
echo "Restauration terminée."
