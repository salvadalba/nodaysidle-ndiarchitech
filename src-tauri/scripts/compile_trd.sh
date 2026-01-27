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

OUT=$(claude --print <<EOF
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

# Sanitize: remove markdown fences and trim whitespace
CLEAN_OUT=$(echo "$OUT" | sed 's/^```json//g' | sed 's/^```//g' | sed 's/```$//g' | sed 's/```//g')
CLEAN_OUT=$(echo "$CLEAN_OUT" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

# Try to extract valid JSON even if there's surrounding text
if ! echo "$CLEAN_OUT" | jq -e . >/dev/null 2>&1; then
  # Use jq to attempt parsing the raw output directly (handles nested objects properly)
  EXTRACTED=$(echo "$CLEAN_OUT" | jq -R -s 'try fromjson catch empty' 2>/dev/null)
  if [ -n "$EXTRACTED" ] && echo "$EXTRACTED" | jq -e . >/dev/null 2>&1; then
    CLEAN_OUT="$EXTRACTED"
  else
    # Fallback: Extract from first { to last } using awk for proper nesting
    EXTRACTED=$(echo "$CLEAN_OUT" | awk '
      BEGIN { depth=0; started=0; output="" }
      {
        for(i=1; i<=length($0); i++) {
          c = substr($0, i, 1)
          if (c == "{") { depth++; started=1 }
          if (started) output = output c
          if (c == "}" && started) { depth--; if (depth == 0) { print output; exit } }
        }
        if (started) output = output "\n"
      }
    ')
    if [ -n "$EXTRACTED" ] && echo "$EXTRACTED" | jq -e . >/dev/null 2>&1; then
      CLEAN_OUT="$EXTRACTED"
    fi
  fi
fi

echo "$CLEAN_OUT" | jq -e . >/dev/null 2>&1 || {
  echo "❌ Invalid JSON from Claude Code (TRD):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
