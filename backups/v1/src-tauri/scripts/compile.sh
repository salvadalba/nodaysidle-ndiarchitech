#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

# Extract "COMPILER: xyz" (case-insensitive-ish)
KIND="$(printf "%s\n" "$INPUT" | sed -n 's/^COMPILER:[[:space:]]*//p' | head -n 1 | tr '[:upper:]' '[:lower:]')"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Clean input so child scripts don't see the "COMPILER: ..." header
CLEAN_INPUT="$(printf "%s\n" "$INPUT" | sed '/^COMPILER:/d')"

case "$KIND" in
  prd)   bash "$SCRIPT_DIR/compile_prd.sh"   <<<"$CLEAN_INPUT" ;;
  ard)   bash "$SCRIPT_DIR/compile_ard.sh"   <<<"$CLEAN_INPUT" ;;
  trd)   bash "$SCRIPT_DIR/compile_trd.sh"   <<<"$CLEAN_INPUT" ;;
  tasks) bash "$SCRIPT_DIR/compile_tasks.sh" <<<"$CLEAN_INPUT" ;;
  agent) bash "$SCRIPT_DIR/compile_agent.sh" <<<"$CLEAN_INPUT" ;;
  *)
    echo "Unknown COMPILER kind: '$KIND' (expected prd|ard|trd|tasks|agent)" >&2
    exit 1
    ;;
esac