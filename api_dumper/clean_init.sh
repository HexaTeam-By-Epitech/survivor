#!/usr/bin/env bash
set -euo pipefail

# --- Clean init ---
./reset_db.sh
./init_db.sh
