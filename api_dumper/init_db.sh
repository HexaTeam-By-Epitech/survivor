#!/bin/sh
set -eu
IS_DOCKER="${IS_DOCKER:-false}"

# Helper function to run psql with correct user context
run_psql() {
    user="$1"
    db="$2"
    shift 2
    if [ "$IS_DOCKER" = "true" ]; then
        echo "Running psql as user: $user on db: $db (docker)"
        PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$user" -d "$db" "$@"
    else
        echo "Running sudo -u postgres psql on db: $db (local)"
        sudo -u postgres psql -d "$db" "$@"
    fi
}

# --- Config ---
DB_NAME="incubator"
DB_USER="incubator_user"
DB_PASS=$(openssl rand -base64 12 | tr -d '/:@')

# In Docker network, the database service is accessible via the service name
DB_HOST="db"
[ "$IS_DOCKER" = "false" ] && DB_HOST="localhost"
DB_PORT="5432"

# Use the postgres default user and password from environment
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="${BASE_POSTGRES_PASSWORD:-postgres}"

# Set PGPASSWORD for non-interactive psql commands
export PGPASSWORD="$POSTGRES_PASSWORD"
SQL_SCHEMA=$(find . -type f -name "*.sql" 2>/dev/null | head -n 1 || echo "")
[ "$IS_DOCKER" = "false" ] && SQL_SCHEMA=$(find /home/ -type f -name "jeb-incubator-db.sql" 2>/dev/null | head -n 1 || echo "")
if [ -z "$SQL_SCHEMA" ]; then
    SQL_SCHEMA="../db_schemes/jeb-incubator-db.sql"
fi
sudo cp "$SQL_SCHEMA" /tmp/jeb-incubator-db.sql
SQL_SCHEMA="/tmp/jeb-incubator-db.sql"

echo "Initialisation de la base de données PostgreSQL... Via le schéma : $SQL_SCHEMA"

echo "DEBUG: trying to connect host=$DB_HOST user=$POSTGRES_USER pass=$POSTGRES_PASSWORD"

if [ "$IS_DOCKER" = "true" ]; then
# Wait for database to be ready
    echo "Attente de la disponibilité de la base de données..."
    until run_psql "$POSTGRES_USER" postgres -c '\q' 2>/dev/null; do
        echo "En attente de PostgreSQL..."
        sleep 2
    done
    echo "✅ Base de données accessible."
fi

echo "✅ Utilisateur prêt."

# --- Création user ---
echo "Création de l'utilisateur PostgreSQL..."
run_psql "$POSTGRES_USER" postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
run_psql "$POSTGRES_USER" postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
echo "✅ Utilisateur prêt."


# --- Création DB ---
echo "Création de la base de données..."
run_psql "$POSTGRES_USER" postgres -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
run_psql "$POSTGRES_USER" postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
echo "✅ Base de données prête."
# --- Privilèges ---
run_psql "$POSTGRES_USER" postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"


# --- Import schema SQL ---
if [ -f "$SQL_SCHEMA" ]; then
    echo "Import du schéma SQL depuis $SQL_SCHEMA..."
    # Importer le schéma directement
    if [ "$IS_DOCKER" = "true" ]; then
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$POSTGRES_USER" -d "$DB_NAME" -f "$SQL_SCHEMA"
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
    else
        echo "Assignation de tous les objets à $DB_USER..."
        sudo -u postgres psql -d "$DB_NAME" -f "$SQL_SCHEMA"
        sudo -u postgres psql -d "$DB_NAME" -c "DO \$\$ DECLARE r RECORD; BEGIN
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
    fi
    echo "✅ Schéma SQL appliqué."
    echo "✅ Propriétés transférées à $DB_USER."
else
    echo "[WARN] Fichier SQL '$SQL_SCHEMA' introuvable, aucune table créée."
fi

# --- Mise à jour .env ---
ENV_FILE=".env"
ENV_PATH="shared"
[ "$IS_DOCKER" = "false" ] && ENV_PATH="."

mkdir -p "$ENV_PATH"
if [ ! -f "$ENV_PATH/$ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
    cp "$ENV_FILE" "$ENV_PATH/$ENV_FILE"
fi
[ ! -f "$ENV_PATH/$ENV_FILE" ] && touch "$ENV_PATH/$ENV_FILE"

echo "Mise à jour du fichier $ENV_PATH/$ENV_FILE avec les infos PostgreSQL..."

# Récupération de la clé API existante
API_KEY=$(grep -E '^API_KEY=' "$ENV_PATH/$ENV_FILE" | cut -d '=' -f2- || echo "")
[ -z "$API_KEY" ] && echo "Aucune clé API trouvée, sortie..." && exit 1

# Supprime les anciennes variables PostgreSQL si elles existent
sed -i '/^DB_NAME=/d;/^DB_USER=/d;/^DB_PASSWORD=/d;/^DB_HOST=/d;/^DB_PORT=/d;/^DATABASE_URL=/d;/^API_KEY=/d;' "$ENV_PATH/$ENV_FILE"

# Ajoute les nouvelles
cat >> "$ENV_PATH/$ENV_FILE" <<EOF
API_KEY=$API_KEY
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"
EOF

# Copie le fichier .env à la racine si en Docker
[ "$IS_DOCKER" = "true" ] &&
cp "$ENV_PATH/$ENV_FILE" /.env

# Copie le fichier .env dans le dossier racine du projet .. si en local
[ "$IS_DOCKER" = "false" ] &&
cp "$ENV_PATH/$ENV_FILE" ../.env

echo "✅ .env mis à jour avec les infos PostgreSQL.
Random password généré pour l'utilisateur '$DB_USER' : trouvable dans '$ENV_FILE'."
echo "Base de données initialisée et prête à l'emploi !"