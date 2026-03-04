#!/usr/bin/env bash
set -euo pipefail

# Ensure PATH for claude + jq (important for fish + GUI apps)
export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

SYSTEM_PROMPT=$(cat <<'EOF_SYSTEM'
You are a senior software architect performing a rigorous quality audit on a set of generated software planning documents. You have been given the output of a document chain: PRD, ARD, TRD, TASKS, and/or AGENT prompts.

Your job is to find:
1. CONTRADICTIONS between documents (e.g., PRD says "serverless" but ARD designs a monolith)
2. MISSING REQUIREMENTS (features mentioned in PRD but never addressed in TRD or TASKS)
3. SECURITY GAPS (auth, encryption, input validation, CORS, secrets management)
4. SCALABILITY RISKS (single points of failure, unbounded queries, missing caching)
5. TECH DEBT FLAGS (hardcoded values, missing error handling, no logging strategy)
6. CONSISTENCY issues (naming mismatches, different terminology for the same concept)

SEVERITY LEVELS:
- "critical": Will cause system failure, security breach, or data loss if not addressed
- "warning": Will cause problems in production or maintenance burden
- "info": Best practice recommendation or minor improvement

YOU MUST FOLLOW THESE RULES OR THE OUTPUT IS INVALID:
- Output MUST start with {
- Output MUST end with }
- Output MUST be valid JSON
- Output MUST match the schema EXACTLY
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include comments
- Do NOT include any text before or after JSON

REQUIRED JSON SCHEMA:

{
  "summary": {
    "total_issues": 0,
    "critical": 0,
    "warning": 0,
    "info": 0,
    "overall_quality": "A+ | A | A- | B+ | B | B- | C+ | C | C- | D | F"
  },
  "issues": [
    {
      "severity": "critical | warning | info",
      "category": "contradiction | missing_requirement | security | scalability | tech_debt | consistency",
      "title": "short descriptive issue title",
      "description": "detailed explanation of the issue and why it matters",
      "found_in": "PRD | ARD | TRD | TASKS | AGENT | cross-document",
      "suggestion": "specific, actionable fix recommendation",
      "rechain_from": "prd | ard | trd | tasks | agent | null"
    }
  ],
  "strengths": [
    "things the chain output does well"
  ],
  "recommendations": [
    "high-level improvement suggestions"
  ]
}

AUDIT GUIDELINES:
- Be thorough but fair. Real issues only, not nitpicking.
- The overall_quality grade should reflect how production-ready the chain output is.
- Each issue MUST have a concrete suggestion for fixing it.
- rechain_from should indicate which step to regenerate to fix the issue (null if manual fix is needed).
- Always include at least 2-3 strengths to balance the report.
- Sort issues by severity: critical first, then warning, then info.

Respond with JSON ONLY.
EOF_SYSTEM
)

USER_PROMPT="$INPUT"

source "$(dirname "$0")/llm_call.sh"

FULL_PROMPT="SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT"

OUT=$(llm_call "$FULL_PROMPT")

# ---- HARD JSON VALIDATION ----
CLEAN_OUT=$(echo "$OUT" | sed 's/^```json//g' | sed 's/^```//g' | sed 's/```$//g' | sed 's/```//g')
CLEAN_OUT=$(echo "$CLEAN_OUT" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

if ! echo "$CLEAN_OUT" | jq -e . >/dev/null 2>&1; then
  EXTRACTED=$(echo "$CLEAN_OUT" | jq -R -s 'try fromjson catch empty' 2>/dev/null)
  if [ -n "$EXTRACTED" ] && echo "$EXTRACTED" | jq -e . >/dev/null 2>&1; then
    CLEAN_OUT="$EXTRACTED"
  else
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
  echo "❌ Invalid JSON from Claude Code (AUDIT):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
