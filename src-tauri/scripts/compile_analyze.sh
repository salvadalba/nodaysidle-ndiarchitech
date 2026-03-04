#!/usr/bin/env bash
set -euo pipefail

# Ensure PATH for claude + jq (important for fish + GUI apps)
export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

# Input is the folder path
FOLDER_PATH="$(cat)"
FOLDER_PATH=$(echo "$FOLDER_PATH" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

if [ ! -d "$FOLDER_PATH" ]; then
  echo "❌ Folder not found: $FOLDER_PATH" >&2
  exit 1
fi

# ---- Gather project metadata ----

# Directory tree (2 levels, excluding common junk)
TREE_OUTPUT=$(tree -L 2 -I 'node_modules|.git|dist|build|target|__pycache__|.venv|venv|.next|.nuxt|.turbo|.cache' "$FOLDER_PATH" 2>/dev/null | head -60 || ls -la "$FOLDER_PATH" | head -30)

# Read manifest files if they exist (with size limits)
read_if_exists() {
  local file="$FOLDER_PATH/$1"
  if [ -f "$file" ]; then
    head -"${2:-80}" "$file" 2>/dev/null
  else
    echo "NOT FOUND"
  fi
}

PKG_JSON=$(read_if_exists "package.json" 80)
CARGO_TOML=$(read_if_exists "Cargo.toml" 50)
PUBSPEC=$(read_if_exists "pubspec.yaml" 50)
REQUIREMENTS=$(read_if_exists "requirements.txt" 40)
GO_MOD=$(read_if_exists "go.mod" 40)
PYPROJECT=$(read_if_exists "pyproject.toml" 50)
GEMFILE=$(read_if_exists "Gemfile" 40)
DOCKERFILE=$(read_if_exists "Dockerfile" 30)
DOCKER_COMPOSE=$(read_if_exists "docker-compose.yml" 40)
TAURI_CONF=$(read_if_exists "src-tauri/tauri.conf.json" 40)
TSCONFIG=$(read_if_exists "tsconfig.json" 30)
README=$(read_if_exists "README.md" 60)

# Check for common config files
HAS_TESTS="false"
[ -d "$FOLDER_PATH/tests" ] || [ -d "$FOLDER_PATH/test" ] || [ -d "$FOLDER_PATH/__tests__" ] || [ -d "$FOLDER_PATH/spec" ] && HAS_TESTS="true"
# Also check for test in package.json scripts
echo "$PKG_JSON" | grep -q '"test"' 2>/dev/null && HAS_TESTS="true"

HAS_CI="false"
[ -d "$FOLDER_PATH/.github/workflows" ] || [ -f "$FOLDER_PATH/.gitlab-ci.yml" ] || [ -f "$FOLDER_PATH/.circleci/config.yml" ] || [ -f "$FOLDER_PATH/Jenkinsfile" ] && HAS_CI="true"

HAS_DOCS="false"
[ -d "$FOLDER_PATH/docs" ] || [ -f "$FOLDER_PATH/README.md" ] && HAS_DOCS="true"

HAS_LINTING="false"
[ -f "$FOLDER_PATH/.eslintrc" ] || [ -f "$FOLDER_PATH/.eslintrc.js" ] || [ -f "$FOLDER_PATH/.eslintrc.json" ] || [ -f "$FOLDER_PATH/eslint.config.js" ] || [ -f "$FOLDER_PATH/.prettierrc" ] || [ -f "$FOLDER_PATH/rustfmt.toml" ] || [ -f "$FOLDER_PATH/.swiftlint.yml" ] && HAS_LINTING="true"

# Count dependencies
DEP_COUNT=0
if [ "$PKG_JSON" != "NOT FOUND" ]; then
  DEP_COUNT=$(echo "$PKG_JSON" | jq '(.dependencies // {} | length) + (.devDependencies // {} | length)' 2>/dev/null || echo "0")
fi

# ---- Build context for Claude ----

CONTEXT=$(cat <<EOF_CONTEXT
ANALYZE THIS PROJECT FOLDER:

=== DIRECTORY STRUCTURE ===
$TREE_OUTPUT

=== package.json ===
$PKG_JSON

=== Cargo.toml ===
$CARGO_TOML

=== pubspec.yaml ===
$PUBSPEC

=== requirements.txt ===
$REQUIREMENTS

=== go.mod ===
$GO_MOD

=== pyproject.toml ===
$PYPROJECT

=== Gemfile ===
$GEMFILE

=== Dockerfile ===
$DOCKERFILE

=== docker-compose.yml ===
$DOCKER_COMPOSE

=== tauri.conf.json ===
$TAURI_CONF

=== tsconfig.json ===
$TSCONFIG

=== README.md ===
$README

=== HEALTH CHECKS ===
has_tests: $HAS_TESTS
has_ci: $HAS_CI
has_docs: $HAS_DOCS
has_linting: $HAS_LINTING
dependency_count: $DEP_COUNT
EOF_CONTEXT
)

SYSTEM_PROMPT=$(cat <<'EOF_SYSTEM'
You are a senior software architect reverse-engineering an existing project from its manifest files and folder structure. You must infer what this project does, its architecture, and generate documentation.

YOU MUST FOLLOW THESE RULES OR THE OUTPUT IS INVALID:
- Output MUST start with {
- Output MUST end with }
- Output MUST be valid JSON
- Output MUST match the schema EXACTLY
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include comments
- Do NOT include any text before or after JSON

ANALYSIS APPROACH:
1. Read the directory structure to understand the project layout
2. Read manifest files (package.json, Cargo.toml, etc.) to identify technologies
3. Read README for project description and purpose
4. Infer the architecture from folder organization and dependencies
5. Generate documentation that would help a new developer understand the project

REQUIRED JSON SCHEMA:

{
  "project_name": "inferred project name from package.json name or folder",
  "detected_stack": {
    "frontend": ["list of frontend technologies detected"],
    "backend": ["list of backend technologies detected"],
    "database": ["list of databases detected"],
    "build_tools": ["list of build tools detected"],
    "other": ["other notable technologies"]
  },
  "inferred_prd": {
    "product_vision": "1-2 sentence description of what this project appears to be and do",
    "core_features": ["list of major features inferred from code structure and README"],
    "target_users": ["types of users this project appears to serve"]
  },
  "inferred_architecture": {
    "pattern": "MVC | monolith | microservices | serverless | static-site | desktop-app | mobile-app | CLI | library | other",
    "components": [
      {
        "name": "component or module name",
        "role": "what this component does",
        "tech": "primary technology used"
      }
    ],
    "data_flow": "brief description of how data moves through the system"
  },
  "inferred_tasks": [
    {
      "epic": "epic name describing a major area of work",
      "tasks": ["specific task items for this epic"]
    }
  ],
  "file_structure_summary": "concise text describing key directories and their purposes",
  "health_indicators": {
    "has_tests": true,
    "has_ci": false,
    "has_docs": false,
    "has_linting": true,
    "dependency_count": 0
  },
  "recommendations": [
    "specific, actionable improvement suggestions based on what you see"
  ]
}

INFERENCE RULES:
- Be specific about technologies — name the actual libraries, not just "JavaScript framework"
- For inferred_tasks, generate what you think the NEXT steps should be (improvements, missing pieces), not what was already done
- health_indicators should use the values provided in the HEALTH CHECKS section
- recommendations should be prioritized: most impactful first
- If README is informative, use it heavily for product_vision and core_features
- If README is minimal, infer from code structure and dependencies

Respond with JSON ONLY.
EOF_SYSTEM
)

source "$(dirname "$0")/llm_call.sh"

FULL_PROMPT="SYSTEM:
$SYSTEM_PROMPT

USER:
$CONTEXT"

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
  echo "❌ Invalid JSON from Claude Code (ANALYZE):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
