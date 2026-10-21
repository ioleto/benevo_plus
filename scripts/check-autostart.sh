#!/bin/sh
set -eu

# Diagnostic read-only pour un serveur Linux équipé de Docker Compose.
# Usage: ./scripts/check-autostart.sh [répertoire-du-projet]
ROOT=${1:-"$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"}
cd "$ROOT"

printf '%s\n' "== Docker / Compose =="
command -v docker || { echo "ERREUR: docker absent"; exit 1; }
docker compose version || { echo "ERREUR: plugin Docker Compose absent"; exit 1; }
for unit in docker containerd; do
  if command -v systemctl >/dev/null 2>&1; then
    printf '%s: ' "$unit"
    systemctl is-enabled "$unit" 2>/dev/null || true
    printf '%s actif: ' "$unit"
    systemctl is-active "$unit" 2>/dev/null || true
  else
    echo "systemd absent: impossible de vérifier $unit"
  fi
done

printf '%s\n' "== Compose config =="
docker compose config --quiet && echo "compose: OK"

printf '%s\n' "== Conteneurs et politiques de redémarrage =="
docker compose ps -a || true
for name in benevo-plus benevo-plus-db benevo-plus-cron; do
  if docker inspect "$name" >/dev/null 2>&1; then
    docker inspect -f '{{.Name}} restart={{.HostConfig.RestartPolicy.Name}} status={{.State.Status}} exit={{.State.ExitCode}} health={{if .State.Health}}{{.State.Health.Status}}{{else}}n/a{{end}}' "$name"
  else
    echo "$name: absent"
  fi
done

printf '%s\n' "== Service systemd Bénévo+ =="
if command -v systemctl >/dev/null 2>&1; then
  systemctl is-enabled benevo.service 2>/dev/null || true
  systemctl is-active benevo.service 2>/dev/null || true
  systemctl status benevo.service --no-pager 2>/dev/null | tail -20 || true
fi
