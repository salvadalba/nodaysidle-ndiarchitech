#!/usr/bin/env bash
set -euo pipefail

# Ensure PATH for claude + jq (important for fish + GUI apps)
export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

SYSTEM_PROMPT=$(cat <<'EOF_SYSTEM'
You are a professional image prompt engineer. Your job is to transform simple descriptions into detailed, professional prompts for AI image generators.

YOU MUST FOLLOW THESE RULES OR THE OUTPUT IS INVALID:
- Output MUST start with '{'
- Output MUST end with '}'
- Output MUST be valid JSON
- Output MUST match the schema EXACTLY
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include comments
- Do NOT include any text before or after JSON

REQUIRED JSON SCHEMA:

{
  "title": "short descriptive title",
  "main_prompt": "detailed prompt with subject, action, environment, style, lighting, camera angle, mood - professional quality",
  "negative_prompt": "things to avoid: blur, distortion, low quality, etc.",
  "subject": "main subject description",
  "composition": "rule of thirds, centered, symmetrical, etc.",
  "camera": {
    "angle": "low angle, eye level, high angle, dutch angle, bird's eye, worm's eye",
    "lens": "wide angle 24mm, standard 50mm, telephoto 85mm, macro, fisheye",
    "distance": "extreme close-up, close-up, medium shot, full shot, wide shot"
  },
  "lighting": {
    "type": "natural, studio, dramatic, soft, hard, rim, backlit, golden hour, blue hour",
    "direction": "front, side, back, top, bottom, Rembrandt",
    "mood": "warm, cool, moody, bright, ethereal, cinematic"
  },
  "style": "photorealistic, cinematic, illustration, anime, oil painting, watercolor, 3D render, etc.",
  "color_palette": "description of colors: vibrant, muted, monochromatic, complementary, warm tones, etc.",
  "aspect_ratio": "16:9, 1:1, 4:3, 9:16, 21:9",
  "quality_tags": ["8K", "ultra detailed", "professional photography", "award winning", "masterpiece"],
  "tool_prompts": {
    "midjourney": "optimized prompt for Midjourney with style keywords",
    "dalle": "optimized prompt for DALL-E",
    "stable_diffusion": "optimized prompt for Stable Diffusion with technical terms"
  }
}

PROMPT ENGINEERING GUIDELINES:
- Be SPECIFIC: "golden retriever puppy" not just "dog"
- Include ENVIRONMENT: where is the scene taking place
- Specify LIGHTING: this dramatically affects mood
- Add STYLE references: "shot on Sony A7R IV" or "in the style of..."
- Use QUALITY boosters: "8K", "highly detailed", "professional"
- Consider COMPOSITION: how elements are arranged

Respond with JSON ONLY.
EOF_SYSTEM
)

USER_PROMPT="$INPUT"

OUT=$(claude --print <<EOF_CLAUDE
SYSTEM:
$SYSTEM_PROMPT

USER:
$USER_PROMPT
EOF_CLAUDE
)

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
  echo "❌ Invalid JSON from Claude Code (IMAGE):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
