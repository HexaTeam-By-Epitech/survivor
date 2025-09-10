#!/usr/bin/env bash
set -euo pipefail

ignore_dump=${1:-"false"}

## Remove old docker compose containers if any
docker compose down -v && docker rmi survivor-server survivor-client && docker rm -f survivor-server survivor-client || true
echo "✅ Anciennes instances Docker supprimées."

if [ "$ignore_dump" != "true" ]; then
    ## Run the API Dumper
    cd ./api_dumper
    ./init_and_dump.sh
    ## Return to root
    cd ..
    echo "✅ API Dumper terminé."
fi

rm -rf ./backend/node_modules ./frontend/node_modules ./backend/dist ./frontend/dist
echo "✅ Anciennes dépendances et builds supprimés."

## Build and run new docker compose containers
docker compose up --build -d
echo "✅ Nouvelles instances Docker démarrées."