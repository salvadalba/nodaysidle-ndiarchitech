#!/usr/bin/env bash
# llm_call.sh — Universal LLM wrapper for NODAYSIDLE compiler scripts
# Source this file and call: llm_call "full prompt text"
# Provider is set via LLM_PROVIDER env var (default: claude)

llm_call() {
  local prompt="$1"

  local provider="${LLM_PROVIDER:-claude}"

  case "$provider" in
    claude)
      # Parse SYSTEM/USER markers for proper --system-prompt usage
      local sys_content=""
      local usr_content=""

      if echo "$prompt" | grep -q '^SYSTEM:'; then
        sys_content=$(echo "$prompt" | sed -n '/^SYSTEM:/,/^USER:/p' | sed '1d;$d')
        usr_content=$(echo "$prompt" | sed -n '/^USER:/,$p' | sed '1d')
      else
        usr_content="$prompt"
      fi

      # Anchor: append JSON-only reminder if json schema is active (recency bias helps)
      if [ -n "${LLM_JSON_SCHEMA:-}" ]; then
        usr_content="${usr_content}

CRITICAL: Your ENTIRE response must be a single JSON object. Start with { and end with }. No prose, no markdown, no explanations. ONLY valid JSON."
      fi

      # Use --print --max-turns 1 for single-shot completion.
      # NOTE: We intentionally avoid --output-format json and --json-schema here.
      # Those flags create a multi-turn agent loop with internal tool calls that
      # consumes multiple turns and often fails with error_max_turns.
      # Instead, we rely on prompt-level JSON enforcement (the CRITICAL anchor above)
      # which produces clean JSON in a single turn reliably.
      local claude_args=(--print --max-turns 2)

      if [ -n "$sys_content" ]; then
        claude_args+=(--system-prompt "$sys_content")
      fi

      # Run Claude CLI from /tmp to avoid project context (CLAUDE.md, MEMORY.md)
      # contaminating the response. CWD determines what context Claude reads.
      local result
      result=$(cd /tmp && echo "$usr_content" | claude "${claude_args[@]}" 2>/dev/null)
      local claude_exit=$?

      if [ $claude_exit -ne 0 ] || [ -z "$result" ]; then
        echo "Claude CLI failed (exit $claude_exit)" >&2
        echo "$result" >&2
        exit 1
      fi

      echo "$result"
      ;;

    glm)
      # GLM (Zhipu AI) via OpenAI-compatible API
      local api_url="${LLM_API_URL:-https://api.z.ai/api/coding/paas/v4/chat/completions}"
      local model="${LLM_MODEL:-glm-5}"
      local api_key="${LLM_API_KEY:-}"

      if [ -z "$api_key" ]; then
        echo "ERROR: GLM API key not set. Add your key in Settings." >&2
        exit 1
      fi

      # Split system/user if prompt contains SYSTEM:/USER: markers
      local sys_content=""
      local usr_content=""

      if echo "$prompt" | grep -q '^SYSTEM:'; then
        sys_content=$(echo "$prompt" | sed -n '/^SYSTEM:/,/^USER:/p' | sed '1d;$d')
        usr_content=$(echo "$prompt" | sed -n '/^USER:/,$p' | sed '1d')
      else
        usr_content="$prompt"
      fi

      local sys_json
      local usr_json
      sys_json=$(printf '%s' "$sys_content" | jq -Rs .)
      usr_json=$(printf '%s' "$usr_content" | jq -Rs .)

      local messages
      if [ -n "$sys_content" ]; then
        messages="[{\"role\":\"system\",\"content\":$sys_json},{\"role\":\"user\",\"content\":$usr_json}]"
      else
        messages="[{\"role\":\"user\",\"content\":$usr_json}]"
      fi

      local response
      response=$(curl -s --max-time 120 -X POST "$api_url" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $api_key" \
        -d "{\"model\":\"$model\",\"messages\":$messages,\"max_tokens\":8192,\"temperature\":0.3,\"response_format\":{\"type\":\"json_object\"}}")

      # Extract content from response
      local content
      content=$(echo "$response" | jq -r '.choices[0].message.content // empty')

      if [ -z "$content" ]; then
        local err_msg
        err_msg=$(echo "$response" | jq -r '.error.message // empty')
        if [ -n "$err_msg" ]; then
          echo "GLM API error: $err_msg" >&2
        else
          echo "GLM API returned empty response" >&2
          echo "Raw: $response" >&2
        fi
        exit 1
      fi

      echo "$content"
      ;;

    openai)
      # OpenAI API
      local api_url="${LLM_API_URL:-https://api.openai.com/v1/chat/completions}"
      local model="${LLM_MODEL:-gpt-4o}"
      local api_key="${LLM_API_KEY:-}"

      if [ -z "$api_key" ]; then
        echo "ERROR: OpenAI API key not set." >&2
        exit 1
      fi

      local sys_content=""
      local usr_content=""

      if echo "$prompt" | grep -q '^SYSTEM:'; then
        sys_content=$(echo "$prompt" | sed -n '/^SYSTEM:/,/^USER:/p' | sed '1d;$d')
        usr_content=$(echo "$prompt" | sed -n '/^USER:/,$p' | sed '1d')
      else
        usr_content="$prompt"
      fi

      local sys_json usr_json
      sys_json=$(printf '%s' "$sys_content" | jq -Rs .)
      usr_json=$(printf '%s' "$usr_content" | jq -Rs .)

      local messages
      if [ -n "$sys_content" ]; then
        messages="[{\"role\":\"system\",\"content\":$sys_json},{\"role\":\"user\",\"content\":$usr_json}]"
      else
        messages="[{\"role\":\"user\",\"content\":$usr_json}]"
      fi

      local response
      response=$(curl -s --max-time 120 -X POST "$api_url" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $api_key" \
        -d "{\"model\":\"$model\",\"messages\":$messages,\"max_tokens\":8192,\"temperature\":0.3,\"response_format\":{\"type\":\"json_object\"}}")

      local content
      content=$(echo "$response" | jq -r '.choices[0].message.content // empty')
      if [ -z "$content" ]; then
        echo "OpenAI API returned empty response" >&2
        echo "Raw: $response" >&2
        exit 1
      fi
      echo "$content"
      ;;

    ollama)
      # Local Ollama
      local model="${LLM_MODEL:-llama3.1}"
      echo "$prompt" | ollama run "$model"
      ;;

    custom)
      # Custom OpenAI-compatible endpoint
      local api_url="${LLM_API_URL:-http://localhost:11434/v1/chat/completions}"
      local model="${LLM_MODEL:-default}"
      local api_key="${LLM_API_KEY:-}"

      local usr_json
      usr_json=$(printf '%s' "$prompt" | jq -Rs .)

      local auth_header=""
      if [ -n "$api_key" ]; then
        auth_header="-H \"Authorization: Bearer $api_key\""
      fi

      local response
      response=$(curl -s --max-time 120 -X POST "$api_url" \
        -H "Content-Type: application/json" \
        ${api_key:+-H "Authorization: Bearer $api_key"} \
        -d "{\"model\":\"$model\",\"messages\":[{\"role\":\"user\",\"content\":$usr_json}],\"max_tokens\":8192,\"temperature\":0.7}")

      echo "$response" | jq -r '.choices[0].message.content // empty'
      ;;

    *)
      echo "Unknown LLM provider: $provider" >&2
      exit 1
      ;;
  esac
}
