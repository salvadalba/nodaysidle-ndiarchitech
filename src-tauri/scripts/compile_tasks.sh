#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

SYSTEM_PROMPT=$(cat <<'EOF'
You are a strict JSON generator.

MANDATORY RULES:
- Output ONLY valid JSON — nothing else
- No markdown, no backticks, no prose, no explanations
- Output must start with { and end with }
- NEVER break out of JSON to add commentary or instructions
- If output would be too long, REDUCE the number of tasks — do NOT add prose
- Prefer small, testable tasks with clear acceptance criteria
- If unsure, use empty strings or empty arrays

SIZE LIMITS (strictly enforced):
- Maximum 6 epics
- Maximum 5 tasks per epic (30 tasks total max)
- Keep descriptions concise (1-2 sentences)
- Keep acceptance_criteria to 2-4 items per task
- Keep open_questions to max 5 items
- Keep risks to max 5 items

Return JSON matching this schema EXACTLY:

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

# The TypeScript app runs the prompt construction logic now.
# We treat stdin as the ready-to-go User Prompt.
USER_PROMPT="$INPUT"

source "$(dirname "$0")/llm_call.sh"

# Export JSON schema for Claude --json-schema flag (forces valid JSON output)
export LLM_JSON_SCHEMA='{"type":"object","properties":{"project_name":{"type":"string"},"epics":{"type":"array","maxItems":6,"items":{"type":"object","properties":{"name":{"type":"string"},"goal":{"type":"string"},"tasks":{"type":"array","maxItems":5,"items":{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"acceptance_criteria":{"type":"array","items":{"type":"string"}},"dependencies":{"type":"array","items":{"type":"string"}},"estimate":{"type":"string"}},"required":["title","description","acceptance_criteria","dependencies","estimate"]}}},"required":["name","goal","tasks"]}},"global_assumptions":{"type":"array","items":{"type":"string"}},"risks":{"type":"array","maxItems":5,"items":{"type":"string"}},"open_questions":{"type":"array","maxItems":5,"items":{"type":"string"}}},"required":["project_name","epics","global_assumptions","risks","open_questions"]}'

FULL_PROMPT="SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT"

OUT=$(llm_call "$FULL_PROMPT")

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

# JSON repair: if still invalid, try to close truncated JSON
if ! echo "$CLEAN_OUT" | jq -e . >/dev/null 2>&1; then
  # Strip any trailing prose (non-JSON text after the last ] or })
  REPAIR=$(echo "$CLEAN_OUT" | sed -n '/^{/,/^$/p' | head -500)
  if [ -z "$REPAIR" ]; then
    REPAIR="$CLEAN_OUT"
  fi
  # Count unclosed brackets and close them
  OPEN_BRACES=$(echo "$REPAIR" | tr -cd '{' | wc -c | tr -d ' ')
  CLOSE_BRACES=$(echo "$REPAIR" | tr -cd '}' | wc -c | tr -d ' ')
  OPEN_BRACKETS=$(echo "$REPAIR" | tr -cd '[' | wc -c | tr -d ' ')
  CLOSE_BRACKETS=$(echo "$REPAIR" | tr -cd ']' | wc -c | tr -d ' ')
  NEED_BRACKETS=$((OPEN_BRACKETS - CLOSE_BRACKETS))
  NEED_BRACES=$((OPEN_BRACES - CLOSE_BRACES))
  # Remove trailing comma if present
  REPAIR=$(echo "$REPAIR" | sed 's/,[[:space:]]*$//')
  # Append missing closers
  SUFFIX=""
  while [ "$NEED_BRACKETS" -gt 0 ]; do
    SUFFIX="${SUFFIX}]"
    NEED_BRACKETS=$((NEED_BRACKETS - 1))
  done
  while [ "$NEED_BRACES" -gt 0 ]; do
    SUFFIX="${SUFFIX}}"
    NEED_BRACES=$((NEED_BRACES - 1))
  done
  REPAIR="${REPAIR}${SUFFIX}"
  if echo "$REPAIR" | jq -e . >/dev/null 2>&1; then
    CLEAN_OUT="$REPAIR"
    echo "⚠️ JSON was truncated — auto-repaired by closing unclosed brackets" >&2
  fi
fi

echo "$CLEAN_OUT" | jq -e . >/dev/null 2>&1 || {
  echo "❌ Invalid JSON from Claude Code (TASKS):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
