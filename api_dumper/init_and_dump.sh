#!/usr/bin/env bash
set -euo pipefail

# Initialize database
./clean_init.sh

# Setup Python venv
python3 -m venv venv || true
source venv/bin/activate

# Install system deps only if needed
dpkg -s libpq-dev python3-dev gcc >/dev/null 2>&1 || sudo apt update && sudo apt install libpq-dev python3-dev gcc -y

# Install Python deps
pip install --upgrade --no-cache-dir -r requirements.txt

# Run the dumper
python3 api_dumper.py
