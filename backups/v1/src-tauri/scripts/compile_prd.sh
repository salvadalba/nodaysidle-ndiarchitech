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

OUT=$(claude <<EOF_CLAUDE
SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT
EOF_CLAUDE
)

# ---- HARD JSON VALIDATION ----
# Clean potential markdown fences from the output
CLEAN_OUT=$(echo "$OUT" | sed 's/^```json//g' | sed 's/^```//g' | sed 's/```$//g')

echo "$CLEAN_OUT" | jq -e . >/dev/null 2>&1 || {
  echo "⚠️ INVALID JSON DETECTED (Validation Failed)"
  echo "Common causes: trailing commas, missing quotes, or comments."
  echo "You can likely still use this output for the next step."
  echo ""
}

echo "$CLEAN_OUT"
