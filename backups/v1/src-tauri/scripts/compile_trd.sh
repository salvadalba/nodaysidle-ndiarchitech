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
- Prefer simple, implementable designs
- If unsure, use empty strings/arrays

Return JSON that matches this schema EXACTLY:

{
  "system_context": "",
  "api_contracts": [
    {
      "name": "",
      "method": "",
      "path": "",
      "auth": "",
      "request": "",
      "response": "",
      "errors": []
    }
  ],
  "modules": [
    {
      "name": "",
      "responsibilities": [],
      "interfaces": [],
      "depends_on": []
    }
  ],
  "data_model_notes": [],
  "validation_and_security": [],
  "error_handling_strategy": "",
  "observability": {
    "logging": "",
    "metrics": [],
    "tracing": ""
  },
  "performance_notes": [],
  "testing_strategy": {
    "unit": [],
    "integration": [],
    "e2e": []
  },
  "rollout_plan": [],
  "open_questions": []
}
EOF
)

USER_PROMPT=$(cat <<EOF
INPUT:
$INPUT

TASK:
Generate a Technical Requirements Document (TRD) using the schema above.
Keep API contracts and modules concrete and implementable.
EOF
)

OUT=$(claude <<EOF
SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT
EOF
)

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
