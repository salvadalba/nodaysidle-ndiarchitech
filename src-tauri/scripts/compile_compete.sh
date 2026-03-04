#!/usr/bin/env bash
set -euo pipefail

# Ensure PATH for claude + jq + curl
export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

# Input: first line is the URL, rest is optional user notes
RAW_INPUT="$(cat)"
URL=$(echo "$RAW_INPUT" | head -1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
USER_NOTES=$(echo "$RAW_INPUT" | tail -n +2)

if [ -z "$URL" ]; then
  echo "No URL provided" >&2
  exit 1
fi

# ---- Fetch page content ----

PAGE_CONTENT=""
FETCH_ERROR=""

# Try to fetch the URL
HTTP_RESPONSE=$(curl -sL -w "\n%{http_code}" -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" --max-time 15 "$URL" 2>/dev/null) || FETCH_ERROR="curl failed"

if [ -z "$FETCH_ERROR" ]; then
  HTTP_CODE=$(echo "$HTTP_RESPONSE" | tail -1)
  PAGE_HTML=$(echo "$HTTP_RESPONSE" | sed '$d')

  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
    # Extract useful text: title, meta description, headings, paragraphs
    # Strip HTML tags, collapse whitespace, limit to ~4000 chars
    PAGE_TITLE=$(echo "$PAGE_HTML" | grep -oi '<title>[^<]*</title>' | head -1 | sed 's/<[^>]*>//g' || echo "Unknown")
    META_DESC=$(echo "$PAGE_HTML" | grep -oi 'meta[^>]*name="description"[^>]*content="[^"]*"' | head -1 | sed 's/.*content="//;s/".*//' || echo "")

    # Get visible text content (strip tags, limit size)
    BODY_TEXT=$(echo "$PAGE_HTML" | \
      sed 's/<script[^>]*>.*<\/script>//gi' | \
      sed 's/<style[^>]*>.*<\/style>//gi' | \
      sed 's/<[^>]*>//g' | \
      sed 's/&nbsp;/ /g; s/&amp;/\&/g; s/&lt;/</g; s/&gt;/>/g' | \
      tr -s '[:space:]' ' ' | \
      head -c 4000)

    PAGE_CONTENT="PAGE TITLE: $PAGE_TITLE
META DESCRIPTION: $META_DESC
PAGE CONTENT (truncated):
$BODY_TEXT"
  else
    FETCH_ERROR="HTTP $HTTP_CODE"
  fi
fi

# If fetch failed, still proceed — Claude can work with just the URL
if [ -n "$FETCH_ERROR" ]; then
  PAGE_CONTENT="FETCH FAILED ($FETCH_ERROR). Analyze based on the URL and your knowledge of this product."
fi

# ---- Detect URL type ----

URL_TYPE="website"
case "$URL" in
  *apps.apple.com*) URL_TYPE="app_store" ;;
  *play.google.com*) URL_TYPE="play_store" ;;
  *github.com*) URL_TYPE="github" ;;
  *producthunt.com*) URL_TYPE="product_hunt" ;;
esac

# ---- Build context for Claude ----

CONTEXT=$(cat <<EOF_CONTEXT
COMPETITIVE ANALYSIS TARGET:

URL: $URL
URL TYPE: $URL_TYPE
USER NOTES: $USER_NOTES

=== FETCHED PAGE DATA ===
$PAGE_CONTENT
EOF_CONTEXT
)

SYSTEM_PROMPT=$(cat <<'EOF_SYSTEM'
You are a ruthless competitive product strategist. Given a product URL and its page data, you must reverse-engineer what the product does, identify its weaknesses and market gaps, and generate a PRD for building a BETTER alternative.

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
1. Identify the product from the URL and page content
2. Determine what it does, who it serves, and how it makes money
3. Research (from your training data) common user complaints, missing features, and pain points
4. Identify market gaps and opportunities
5. Generate a complete PRD for a superior competing product

REQUIRED JSON SCHEMA:

{
  "competitor_name": "name of the competing product",
  "competitor_url": "the URL that was analyzed",
  "competitor_summary": "2-3 sentence summary of what this product does and who it serves",
  "strengths": ["list of 4-6 things the competitor does well"],
  "weaknesses": ["list of 4-6 pain points, missing features, or user complaints"],
  "market_gaps": ["list of 3-5 opportunities the competitor misses"],
  "improved_prd": {
    "product_name": "suggested name for the better alternative (be creative)",
    "product_vision": "compelling 2-sentence vision statement for the improved product",
    "target_audience": ["3-4 specific user personas this serves"],
    "core_features": [
      "feature description that directly addresses a competitor weakness — each as a plain string"
    ],
    "differentiators": ["3-4 things that make this version unique and better"],
    "tech_recommendations": ["2-3 suggested technologies or approaches"]
  },
  "competitive_advantages": [
    {
      "area": "Performance | UX | Features | Pricing | Privacy | Integration | AI",
      "current_gap": "what the competitor lacks or does poorly here",
      "our_approach": "how we solve it better, specifically"
    }
  ],
  "go_to_market": {
    "positioning": "one-line positioning statement (format: For [audience] who [need], [product] is [category] that [benefit])",
    "launch_strategy": "brief 2-3 sentence launch approach"
  }
}

ANALYSIS RULES:
- Be SPECIFIC, not generic — name actual features, actual complaints, actual technologies
- For weaknesses, draw from real user feedback patterns you know about
- For core_features, each must directly address a weakness or gap (not just nice-to-have)
- competitive_advantages should have 4-6 entries covering different areas
- If the URL is an App Store listing, focus on review complaints and rating issues
- If the URL is a GitHub repo, focus on issue tracker patterns and missing features
- If the URL is a website, focus on product positioning gaps and user experience issues
- product_name should be memorable and positioned against the competitor
- tech_recommendations should be modern and pragmatic, not bleeding edge

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
  echo "Invalid JSON from Claude Code (COMPETE):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
