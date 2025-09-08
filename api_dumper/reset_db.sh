#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
DB_NAME="incubator"
DB_USER="incubator_user"

# --- Fonction helper ---
function drop_if_exists() {
    local type=$1
    local name=$2
    if [ "$type" == "db" ]; then
        if sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$name'" | grep -q 1; then
            echo "Suppression de la DB $name..."
            sudo -u postgres psql -c "DROP DATABASE $name;"
            echo "✅ DB supprimée."
        fi
    elif [ "$type" == "user" ]; then
        if sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$name'" | grep -q 1; then
            echo "Suppression de l'utilisateur $name..."
            sudo -u postgres psql -c "DROP USER $name;"
            echo "✅ Utilisateur supprimé."
        fi
    fi
}

# --- Cleanup ---
drop_if_exists "db" "$DB_NAME"
drop_if_exists "user" "$DB_USER"

echo "✅ Reset terminé."
