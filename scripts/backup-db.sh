#!/bin/sh
set -eu
: "${POSTGRES_USER:=benevo}"
: "${POSTGRES_DB:=benevo}"
: "${POSTGRES_PASSWORD:?Définir POSTGRES_PASSWORD}"
backup_dir=${BACKUP_DIR:-./backups}
mkdir -p "$backup_dir"
file="$backup_dir/benevo-$(date -u +%Y%m%dT%H%M%SZ).dump"
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f "$file"
find "$backup_dir" -type f -name 'benevo-*.dump' -mtime +"${BACKUP_RETENTION_DAYS:-14}" -delete
echo "Sauvegarde créée: $file"
