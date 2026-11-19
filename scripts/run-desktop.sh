#!/usr/bin/env bash
# Jalankan aplikasi desktop JavaFX.
#
# Konfigurasi DB dibaca dari environment atau dari scripts/.env.local (tidak ikut git).
# Contoh scripts/.env.local:
#   DB_USER=stockkeeping
#   DB_PASSWORD=isi_password
#   # opsional: DB_HOST, DB_PORT, DB_NAME, JAVA_HOME, MVN
#   # opsional: SHARED_INFRA_DIR=/path/ke/shared-infra  (menyalakan stack DB Docker dulu)
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -f scripts/.env.local ]; then
  set -a; . scripts/.env.local; set +a
fi

: "${DB_PASSWORD:?DB_PASSWORD belum diisi. Set lewat environment atau scripts/.env.local}"
export DB_HOST="${DB_HOST:-localhost}"
export DB_PORT="${DB_PORT:-3306}"
export DB_NAME="${DB_NAME:-inventory_db}"
export DB_USER="${DB_USER:-root}"
export DB_PASSWORD
MVN="${MVN:-$(command -v mvn || true)}"
[ -n "$MVN" ] || { echo "Maven tidak ditemukan. Pasang Maven atau set MVN=/path/ke/mvn"; exit 1; }

if [ -n "${SHARED_INFRA_DIR:-}" ]; then
  echo ">> Memastikan DB Docker jalan..."
  ( cd "$SHARED_INFRA_DIR" && docker compose up -d --pull never )
  for _ in $(seq 1 30); do
    [ "$(docker inspect -f '{{.State.Health.Status}}' shared-db 2>/dev/null)" = "healthy" ] && break
    sleep 1
  done
fi

echo ">> Menjalankan aplikasi (${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME})..."
exec "$MVN" -q -B javafx:run
