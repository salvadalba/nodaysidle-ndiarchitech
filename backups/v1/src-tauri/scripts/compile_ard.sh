#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

SYSTEM_PROMPT=$(cat <<'EOF'
You are a strict JSON generator.

MANDATORY RULES:
- Output ONLY valid JSON
- No markdown, no backticks, no prose
- Output must start with '{' and end with '}'
- Use the provided stack exactly if present
- Prefer simple architectures over complex ones
- If unsure, use empty strings/arrays

Return JSON that matches this schema EXACTLY:

{
  "system_overview": "",
  "architecture_style": "",
  "frontend_architecture": {
    "framework": "",
    "state_management": "",
    "routing": "",
    "build_tooling": ""
  },
  "backend_architecture": {
    "approach": "",
    "services": [],
    "api_style": ""
  },
  "data_layer": {
    "primary_store": "",
    "relationships": "",
    "migrations": ""
  },
  "infrastructure": {
    "hosting": "",
    "scaling_strategy": "",
    "ci_cd": ""
  },
  "key_tradeoffs": [],
  "non_functional_requirements": []
}
EOF
)

USER_PROMPT=$(cat <<EOF
INPUT:
$INPUT

TASK:
Generate an Architecture Requirements Document (ARD) using the schema above.
EOF
)

OUT=$(claude <<EOF
SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT
EOF
)

# strict JSON validation
if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required (brew install jq)" >&2
  exit 1
fi

# Clean potential markdown fences from the output
CLEAN_OUT=$(echo "$OUT" | sed 's/^```json//g' | sed 's/^```//g' | sed 's/```$//g')

echo "$CLEAN_OUT" | jq -e . >/dev/null 2>&1 || {
  echo "⚠️ INVALID JSON DETECTED (Validation Failed)"
  echo "Common causes: trailing commas, missing quotes, or comments."
  echo "You can likely still use this output for the next step."
  echo ""
}

echo "$CLEAN_OUT"
