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
- Prefer small, testable tasks
- Each task must have clear acceptance criteria
- If unsure, use empty strings/arrays

Return JSON that matches this schema EXACTLY:

{
  "project_name": "",
  "epics": [
    {
      "name": "",
      "goal": "",
      "tasks": [
        {
          "title": "",
          "description": "",
          "acceptance_criteria": [],
          "dependencies": [],
          "estimate": ""
        }
      ]
    }
  ],
  "global_assumptions": [],
  "risks": [],
  "open_questions": []
}
EOF
)

USER_PROMPT=$(cat <<EOF
INPUT:
$INPUT

TASK:
Generate an actionable task breakdown (epics + tasks) using the schema above.
Make tasks implementable by a solo developer using modern web tooling.
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
  echo "⚠️ INVALID JSON DETECTED (Validation Failed)" >&2
  echo "Common causes: trailing commas, missing quotes, or comments." >&2
  echo "You can likely still use this output for the next step." >&2
  echo "" >&2
}

echo "$CLEAN_OUT"
