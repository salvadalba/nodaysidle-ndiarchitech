#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

SYSTEM_PROMPT="$(cat <<'__SYS__'
You are a strict JSON generator.

MANDATORY RULES:
- Output ONLY valid JSON
- No markdown, no backticks, no prose
- Output must start with '{' and end with '}'
- Prompts must be action-oriented, file-scoped, and testable
- If stack info is present in input, treat it as mandatory and forbid substitutions

SIZE LIMITS (CRITICAL):
- Maximum 5 task_prompts entries
- Maximum 5 items in step_instructions per task
- Maximum 8 items in files_to_create per task
- Maximum 5 items in do/dont arrays
- Keep descriptions SHORT and concise
- This is critical to prevent truncation

Return JSON that matches this schema EXACTLY:

{
  "project_name": "",
  "global_rules": {
    "do": [],
    "dont": []
  },
  "task_prompts": [
    {
      "task_title": "",
      "context": "",
      "role": "Expert ... Engineer",
      "goal_one_liner": "",
      "files_to_create": [],
      "files_to_modify": [],
      "step_instructions": [],
      "validation_cmd": ""
    }
  ]
}
__SYS__
)"

USER_PROMPT="$(cat <<__USER__
INPUT:
$INPUT

TASK:
Generate "Agent Prompts" data for CLI coding agents (Claude/Gemini/OpenCode).
Break it down into structured fields so the compiler can assemble it.

STRICT RULES:
- LIMIT to 5 task_prompts maximum (group related work into single tasks)
- FILE-SCOPED: list exact files to create/modify (paths relative to repo root).
- STACK-LOCKED: if stack preset appears in input, repeat it and do not introduce alternatives.
- If the stack indicates Tauri local-first, DO NOT create a backend server. Use Tauri Rust commands and SQLite only.
- Keep step_instructions to 5 steps maximum per task.
- VALIDATION commands: use npm run typecheck or npm run build

OUTPUT STYLE:
- 1 task_prompts entry per major task (MAX 5 TOTAL).
- 'step_instructions': Array of clear steps (MAX 5 per task).
- Keep all text concise to avoid truncation.

Do not ask questions. Make reasonable assumptions.
__USER__
)"

source "$(dirname "$0")/llm_call.sh"

FULL_PROMPT="SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT"

OUT="$(llm_call "$FULL_PROMPT")"

# Sanitize: remove markdown fences and trim whitespace
OUT="$(echo "$OUT" | sed 's/^```json//g' | sed 's/^```//g' | sed 's/```$//g' | sed 's/```//g')"
OUT="$(echo "$OUT" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

# Try to extract valid JSON even if there's surrounding text
if ! echo "$OUT" | jq -e . >/dev/null 2>&1; then
  # Extract JSON: find first { and last }, grab everything between
  FIRST_BRACE=$(echo "$OUT" | grep -n '{' | head -1 | cut -d: -f1)
  if [ -n "$FIRST_BRACE" ]; then
    # Get everything from first { to end, then use jq to parse
    EXTRACTED="$(echo "$OUT" | tail -n +"$FIRST_BRACE")"
    if echo "$EXTRACTED" | jq -e . >/dev/null 2>&1; then
      OUT="$EXTRACTED"
    else
      # Try awk to extract balanced braces
      EXTRACTED="$(echo "$OUT" | awk '
        BEGIN { depth=0; started=0; }
        /{/ {
          if (!started) started=1;
          depth+=gsub(/{/,"{");
        }
        started { print; depth-=gsub(/}/,"}"); }
        depth==0 && started { exit; }
      ')"
      if echo "$EXTRACTED" | jq -e . >/dev/null 2>&1; then
        OUT="$EXTRACTED"
      fi
    fi
  fi
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required (brew install jq)" >&2
  exit 1
fi

echo "$OUT" | jq -e . >/dev/null 2>&1 || {
  echo "❌ Invalid JSON from Claude Code (AGENT):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$OUT"

