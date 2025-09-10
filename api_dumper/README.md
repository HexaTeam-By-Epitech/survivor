# Database Migration Scripts

This directory contains scripts to help you migrate data between your local PostgreSQL database and the Docker PostgreSQL database.

## Scripts Overview

### 1. `export_local_db.sh`
Exports data from your local PostgreSQL `incubator` database to a `dump.sql` file.

**Usage:**
```bash
./api_dumper/export_local_db.sh
```

**What it does:**
- Connects to your local PostgreSQL database named `incubator`
- Uses the `incubator_user` credentials
- Creates a `dump.sql` file in the project root
- Includes `--clean` and `--if-exists` flags for safe importing

### 2. `import_to_docker.sh`
Imports data from `dump.sql` to the Docker PostgreSQL database.

**Usage:**
```bash
./api_dumper/import_to_docker.sh
```

**Prerequisites:**
- Docker containers must be running (`docker compose up -d`)
- `dump.sql` file must exist (run export script first)

**What it does:**
- Connects to the `survivor-db` Docker container
- Imports data into the `incubator` database
- Verifies the import by listing tables

### 3. `migrate_db.sh`
Combined script that runs both export and import in sequence.

**Usage:**
```bash
./api_dumper/migrate_db.sh
```

**What it does:**
- Runs `export_local_db.sh`
- Then runs `import_to_docker.sh`
- Provides status updates throughout the process

## Quick Start

1. **Start Docker services:**
   ```bash
   docker compose up -d
   ```

2. **Migrate your local database to Docker:**
   ```bash
   ./api_dumper/migrate_db.sh
   ```

That's it! Your local `incubator` database data will be migrated to the Docker database.

## Manual Process

If you prefer to run the commands manually (as you mentioned):

1. **Export from local database:**
   ```bash
   pg_dump -U incubator_user -d incubator > dump.sql
   ```

2. **Import to Docker database:**
   ```bash
   cat dump.sql | docker exec -i survivor-db psql -U incubator_user -d incubator
   ```

## Troubleshooting

### Error: "Database does not exist"
Make sure your local PostgreSQL has an `incubator` database and `incubator_user` user. You can create them using the `init_db.sh` script.

### Error: "Container not running"
Start the Docker services:
```bash
docker compose up -d
```

### Error: "Permission denied"
Make sure the scripts are executable:
```bash
chmod +x api_dumper/*.sh
```

### Error: "Authentication failed"
Check your PostgreSQL credentials in the `.env` file and ensure they match your local setup.

## Database Configuration

The scripts use these default configurations:

**Local Database:**
- Database: `incubator`
- User: `incubator_user`
- Connection: via local PostgreSQL

**Docker Database:**
- Container: `survivor-db`
- Database: `incubator`
- User: `incubator_user`
- Port: `5434` (mapped from container's `5432`)

## Files Generated

- `dump.sql` - The exported database dump file (created in project root)
- This file is safely reusable and can be version controlled if needed

## Notes

- The export script uses `--no-owner` and `--no-privileges` flags to ensure compatibility between different PostgreSQL setups
- The `--clean` flag ensures that existing data is properly replaced during import
- All scripts include error checking and will stop if any step fails
