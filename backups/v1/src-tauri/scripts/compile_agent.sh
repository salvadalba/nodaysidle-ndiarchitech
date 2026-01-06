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
  "agent_profiles": [
    {
      "id": "claude_code",
      "title": "",
      "prompt_prefix": "",
      "run_style": ""
    },
    {
      "id": "gemini_cli",
      "title": "",
      "prompt_prefix": "",
      "run_style": ""
    },
    {
      "id": "opencode",
      "title": "",
      "prompt_prefix": "",
      "run_style": ""
    }
  ],
  "task_prompts": [
    {
      "task_title": "",
      "context": "",
      "inputs": [],
      "outputs": [],
      "acceptance_criteria": [],
      "prompts": {
        "claude_code": "",
        "gemini_cli": "",
        "opencode": ""
      }
    }
  ]
}
__SYS__
)"

USER_PROMPT="$(cat <<__USER__
INPUT:
$INPUT

TASK:
Generate "Agent Prompts" for CLI coding agents (Claude Code, Gemini CLI, OpenCode).

STRICT RULES:
- FILE-SCOPED: list exact files to create/modify (paths relative to repo root).
- STACK-LOCKED: if stack preset appears in input, repeat it and do not introduce alternatives.
- If the stack indicates Tauri local-first, DO NOT create a backend server. Use Tauri Rust commands and SQLite only.
- No invented dependencies. If proposing a library, label it OPTIONAL and justify it.
- No invented ports. Use defaults unless explicitly specified in input.
- Each prompt MUST end with a "VALIDATION" section.
- VALIDATION commands must use existing scripts from package.json only.
  - prefer: npm run typecheck, npm run build
  - if unsure, use: npm run build

OUTPUT STYLE:
- 1 task_prompts entry per task (do not merge tasks).
- Each prompts.<agent> must include:
  1) Goal (1 sentence)
  2) Files to touch (bullet list)
  3) Steps (numbered)
  4) Acceptance criteria (bullet list)
  5) VALIDATION (commands)

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
