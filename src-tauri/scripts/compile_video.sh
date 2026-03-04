#!/usr/bin/env bash
set -euo pipefail

# Ensure PATH for claude + jq (important for fish + GUI apps)
export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

SYSTEM_PROMPT=$(cat <<'EOF_SYSTEM'
You are a professional video prompt engineer. Your job is to transform simple descriptions into detailed, professional prompts for AI video generators.

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
  "title": "short descriptive title",
  "scene_description": "detailed scene description - what is happening, where, who/what is involved",
  "subject_action": "what the main subject is doing - specific movements and actions",
  "environment": "detailed environment description - location, weather, time of day, atmosphere",
  "camera": {
    "movement": "static, pan left/right, tilt up/down, dolly in/out, tracking shot, crane, handheld, drone",
    "angle": "eye level, low angle, high angle, dutch angle, POV, over-the-shoulder",
    "speed": "slow, normal, fast, speed ramp, slow motion"
  },
  "motion": {
    "subject": "how the subject moves - walk, run, dance, fly, float, etc.",
    "background": "how background elements move - clouds, trees, crowds, traffic",
    "particles": "dust, rain, snow, sparks, leaves, confetti, none"
  },
  "duration": "suggested duration: 3-5 seconds, 5-10 seconds, etc.",
  "style": "cinematic, documentary, music video, commercial, film noir, sci-fi, fantasy",
  "color_grade": "warm, cool, desaturated, vibrant, teal and orange, monochrome",
  "mood": "epic, intimate, mysterious, joyful, melancholic, tense, peaceful",
  "audio": {
    "music_style": "orchestral, electronic, ambient, rock, jazz, none",
    "sfx": "ambient sounds, footsteps, wind, traffic, nature, none"
  },
  "tool_prompts": {
    "veo": "optimized prompt for Google Veo 3 - cinematic, natural motion, detailed scene description",
    "runway": "optimized prompt for Runway Gen-3 Alpha - focus on motion description",
    "pika": "optimized prompt for Pika Labs - concise and action-focused",
    "kling": "optimized prompt for Kling AI - detailed scene and motion"
  }
}

VIDEO PROMPT ENGINEERING GUIDELINES:
- MOTION IS KEY: Describe exactly how things move, not just what they are
- CAMERA MOVEMENT: This adds production value - specify how camera moves
- TIMING: Consider the duration and pacing of actions
- CONTINUITY: Ensure the motion makes sense physically
- STYLE CONSISTENCY: Match visual style with motion style
- KEEP IT ACHIEVABLE: Current AI video has 5-10 second limits

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
  echo "❌ Invalid JSON from Claude Code (VIDEO):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
