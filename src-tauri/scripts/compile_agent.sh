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
- Prefer small batches of tasks per agent run (avoid mega-prompts)
- If stack info is present in input, treat it as mandatory and forbid substitutions

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
Instead of writing the full prompt, break it down into structured fields so the compiler can assemble it.

STRICT RULES:
- FILE-SCOPED: list exact files to create/modify (paths relative to repo root).
- STACK-LOCKED: if stack preset appears in input, repeat it and do not introduce alternatives.
- If the stack indicates Tauri local-first, DO NOT create a backend server. Use Tauri Rust commands and SQLite only.
- No invented dependencies. If proposing a library, label it OPTIONAL and justify it.
- No invented ports. Use defaults unless explicitly specified in input.
- VALIDATION commands must use existing scripts from package.json only.
  - prefer: npm run typecheck, npm run build
  - if unsure, use: npm run build

OUTPUT STYLE:
- 1 task_prompts entry per task.
- 'role': e.g. "Expert Backend Engineer" or "React Frontend Specialist"
- 'step_instructions': Array of clear, numbered steps (strings).
- 'files_to_create' / 'files_to_modify': Arrays of file paths.

Do not ask questions. Make reasonable assumptions.
__USER__
)"

OUT="$(claude <<EOF
SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT
EOF
)"

# Sanitize: output sometimes has triple backticks despite instructions
# Remove markdown code fences and trim whitespace
OUT="$(echo "$OUT" | sed 's/^```json//g' | sed 's/^```//g' | sed 's/```$//g' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"

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
