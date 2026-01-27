#!/usr/bin/env bash
set -euo pipefail

# Ensure PATH for claude + jq (important for fish + GUI apps)
export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

SYSTEM_PROMPT=$(cat <<'EOF_SYSTEM'
You are a strict JSON generator.

YOU MUST FOLLOW THESE RULES OR THE OUTPUT IS INVALID:
- Output MUST start with '{'
- Output MUST end with '}'
- Output MUST be valid JSON
- Output MUST match the schema EXACTLY
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include comments
- Do NOT include any text before or after JSON
- If unsure, use empty strings or empty arrays
- If you violate these rules, you have FAILED the task

REQUIRED JSON SCHEMA:

{
  "product_name": "",
  "product_vision": "",
  "problem_statement": "",
  "goals": [],
  "non_goals": [],
  "target_users": [],
  "core_features": [],
  "non_functional_requirements": [],
  "success_metrics": [],
  "assumptions": [],
  "open_questions": []
}

Respond with JSON ONLY.
EOF_SYSTEM
)

# The TypeScript app runs the prompt construction logic now.
# We treat stdin as the ready-to-go User Prompt.
USER_PROMPT="$INPUT"

OUT=$(claude --print <<EOF_CLAUDE
SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT
EOF_CLAUDE
)

# ---- HARD JSON VALIDATION ----
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

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required (brew install jq)" >&2
  exit 1
fi

echo "$CLEAN_OUT" | jq -e . >/dev/null 2>&1 || {
  echo "❌ Invalid JSON from Claude Code (PRD):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
