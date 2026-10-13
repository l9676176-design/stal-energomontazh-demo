#!/usr/bin/env sh
set -eu

REPOSITORY_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
python3 "$REPOSITORY_ROOT/tests/smoke/check_structure.py"
