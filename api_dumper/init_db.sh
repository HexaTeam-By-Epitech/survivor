#!/usr/bin/env sh
set -euo pipefail

# --- Config ---
DB_NAME="incubator"
DB_USER="incubator_user"
DB_PASS=$(openssl rand -base64 12)
# In Docker network, the database service is accessible via the service name
DB_HOST="db"
DB_PORT="5432"
# Use the postgres default user and password from environment
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="${BASE_POSTGRES_PASSWORD:-postgres}"

# Set PGPASSWORD for non-interactive psql commands
export PGPASSWORD="$POSTGRES_PASSWORD"

SQL_SCHEMA=$(find . -type f -name "*.sql" 2>/dev/null | head -n 1 || echo "")
if [ -z "$SQL_SCHEMA" ]; then
    SQL_SCHEMA="../db_schemes/temp.sql"
fi
echo "Initialisation de la base de données PostgreSQL... Via le schéma : $SQL_SCHEMA"

# Wait for database to be ready
echo "Attente de la disponibilité de la base de données..."
until psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d postgres -c '\q' 2>/dev/null; do
    echo "En attente de PostgreSQL..."
    sleep 2
done
echo "✅ Base de données accessible."

# --- Création user ---
echo "Création de l'utilisateur PostgreSQL..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
echo "✅ Utilisateur prêt."

# --- Création DB ---
echo "Création de la base de données..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
echo "✅ Base de données prête."
# --- Privilèges ---
psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# --- Import schema SQL ---
if [ -f "$SQL_SCHEMA" ]; then
    echo "Import du schéma SQL depuis $SQL_SCHEMA..."
    
    # Importer le schéma directement
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d "$DB_NAME" -f "$SQL_SCHEMA"
    
    echo "✅ Schéma SQL appliqué."

    # --- Assigner toutes les tables, séquences et fonctions à l'utilisateur ---
    echo "Assignation de tous les objets à $DB_USER..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d "$DB_NAME" -c "DO \$\$ DECLARE r RECORD; BEGIN
        FOR r IN SELECT tablename FROM pg_tables WHERE schemaname='public' LOOP
            EXECUTE format('ALTER TABLE %I OWNER TO %I;', r.tablename, '$DB_USER');
        END LOOP;
        FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema='public' LOOP
            EXECUTE format('ALTER SEQUENCE %I OWNER TO %I;', r.sequence_name, '$DB_USER');
        END LOOP;
        FOR r IN SELECT routine_name FROM information_schema.routines WHERE routine_schema='public' AND routine_type='FUNCTION' LOOP
            EXECUTE format('ALTER FUNCTION %I() OWNER TO %I;', r.routine_name, '$DB_USER');
        END LOOP;
    END \$\$;"
    echo "✅ Propriétés transférées à $DB_USER."
else
    echo "[WARN] Fichier SQL '$SQL_SCHEMA' introuvable, aucune table créée."
fi

# --- Mise à jour .env ---
ENV_FILE="shared/.env"
mkdir -p shared
[ ! -f "$ENV_FILE" ] && touch "$ENV_FILE"

# Supprime les anciennes variables PostgreSQL si elles existent
sed -i '/^DB_NAME=/d;/^DB_USER=/d;/^DB_PASSWORD=/d;/^DB_HOST=/d;/^DB_PORT=/d' "$ENV_FILE"

# Ajoute les nouvelles
cat >> "$ENV_FILE" <<EOF
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"
EOF

echo "✅ .env mis à jour avec les infos PostgreSQL.
Random password généré pour l'utilisateur '$DB_USER' : trouvable dans '$ENV_FILE'."
echo "Base de données initialisée et prête à l'emploi !"