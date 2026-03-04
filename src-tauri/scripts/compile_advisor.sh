#!/usr/bin/env bash
set -euo pipefail

# Ensure PATH for claude + jq (important for fish + GUI apps)
export PATH="$HOME/.local/bin:$HOME/bin:/opt/homebrew/bin:$PATH"

INPUT="$(cat)"

SYSTEM_PROMPT=$(cat <<'EOF_SYSTEM'
You are a senior technical architect and stack advisor. Given a project idea or PRD, you analyze the requirements and recommend the BEST matching tech stack preset from the 12 available options below.

YOU MUST FOLLOW THESE RULES OR THE OUTPUT IS INVALID:
- Output MUST start with {
- Output MUST end with }
- Output MUST be valid JSON
- Output MUST match the schema EXACTLY
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include comments
- Do NOT include any text before or after JSON

AVAILABLE STACK PRESETS (you must rank from these ONLY):

1. swift-macos — "Native macOS App"
   SwiftUI 6 macOS app with SwiftData, on-device ML, and premium design.
   Frontend: SwiftUI 6, .ultraThinMaterial / .regularMaterial, matchedGeometryEffect, PhaseAnimator, TimelineView
   Backend: Swift 6, Structured Concurrency (async/await), Observation framework
   Database: SwiftData, CloudKit (optional sync)
   Notes: macOS 15+ target, CoreML + NaturalLanguage for on-device AI, Metal shaders, menu bar + settings support, local-first architecture

2. swift-macos-utility — "macOS Utility / Menu Bar App"
   Lightweight menu bar utility with keyboard shortcuts and system integration.
   Frontend: SwiftUI 6, MenuBarExtra, Settings scene
   Backend: Swift 6, AppKit integration, LaunchAgent
   Database: UserDefaults, JSON files, Keychain
   Notes: Runs in menu bar no dock icon, global keyboard shortcuts, accessibility API, login item support, sandboxed

3. nextjs-fullstack — "Next.js 15 Full Stack"
   Production SaaS with App Router, Server Actions, and Prisma.
   Frontend: Next.js 15 (App Router), React 19, Tailwind CSS 4, shadcn/ui, Framer Motion
   Backend: Server Actions, Route Handlers, Middleware
   Database: PostgreSQL, Prisma ORM, Redis (caching)
   Notes: RSC by default, partial prerendering, Vercel or self-hosted, Auth.js, glassmorphism optional

4. astro-site — "Astro 5 Static Site"
   Lightning-fast marketing sites, portfolios, blogs, landing pages, and docs.
   Frontend: Astro 5, React/Svelte islands (optional), Tailwind CSS 4, View Transitions API, GSAP / Lenis
   Backend: Static (SSG), Hybrid SSR (optional), Formspree/Netlify Forms
   Database: Astro Content Collections, Markdown/MDX
   Notes: Zero JS by default, built-in image optimization, perfect Lighthouse, SEO built-in

5. tauri-localfirst — "Tauri 2 Desktop App"
   Cross-platform desktop app with Rust backend and web frontend.
   Frontend: Vite 6, TypeScript, React or Vanilla, Tailwind CSS 4
   Backend: Tauri 2, Rust commands, IPC bridge
   Database: SQLite (rusqlite), FTS5 for search
   Notes: Local-first no server, native OS integrations via Rust, bundle < 10MB, auto-updater, macOS/Windows/Linux

6. swift-ios — "Native iOS App"
   SwiftUI 6 iOS/iPadOS app with SwiftData and modern design.
   Frontend: SwiftUI 6, UIKit (bridging), Core Animation
   Backend: Swift 6, Structured Concurrency, Observation
   Database: SwiftData, CloudKit (sync)
   Notes: iOS 18+ target, CoreML, WidgetKit, App Intents for Shortcuts/Siri

7. kotlin-android — "Native Android App"
   Jetpack Compose Android app with Material 3 design.
   Frontend: Jetpack Compose, Material 3, Compose Navigation
   Backend: Kotlin 2, Coroutines, Hilt (DI)
   Database: Room, DataStore
   Notes: Android 14+ target, ML Kit, MVVM, Gradle Kotlin DSL

8. flutter-mobile — "Flutter Cross-Platform"
   Single codebase for iOS + Android with Material 3.
   Frontend: Flutter 3.24+, Material 3, Cupertino widgets
   Backend: Dart 3, Riverpod, Dio
   Database: Drift (SQLite), Isar, SharedPreferences
   Notes: Single codebase iOS + Android, hot reload, platform channels

9. cli-tool — "CLI Tool"
   Command-line utility with argument parsing and rich terminal output.
   Frontend: None
   Backend: Rust, clap (args), indicatif (progress), colored (output)
   Database: JSON/TOML config, SQLite (optional)
   Notes: Single binary, shell completions, cross-platform, Homebrew/cargo install

10. minimal-browser — "Minimal Browser"
    Lightweight Rust browser with built-in adblock.
    Frontend: Tauri 2 WebView, Minimal UI (HTML/CSS), URL bar + tabs
    Backend: Rust, adblock-rust (Brave engine), WebView2/WebKitGTK
    Database: SQLite (bookmarks/history), JSON config
    Notes: Sub-50MB, built-in adblock, privacy-focused, no telemetry

11. realtime-app — "Realtime Collaborative App"
    Multiplayer/collaborative apps with live sync.
    Frontend: React 19, Tailwind CSS 4, Zustand, Framer Motion
    Backend: PartyKit, Cloudflare Durable Objects
    Database: Yjs (CRDT), Redis, PostgreSQL
    Notes: WebSocket-first, optimistic UI, conflict-free CRDT sync, presence, edge-deployed

12. mlx-llm-runner — "Local LLM Runner (MLX)"
    Native macOS app for running AI models locally on Apple Silicon.
    Frontend: SwiftUI 6, Markdown rendering, Syntax highlighting, StreamingText view
    Backend: Swift 6, MLX Swift (apple/mlx-swift), Structured Concurrency, Observation
    Database: SwiftData (conversations, settings), File system (model storage)
    Notes: macOS 15+ Apple Silicon, MLX unified memory, stream tokens, Hugging Face models, 100% private

ANALYSIS RULES:
- Analyze the input for: platform (desktop/web/mobile/cli), key requirements, complexity, team size
- Rank ALL presets that score above 50% match
- Top recommendation should have clear reasoning
- Be honest about tradeoffs — no preset is perfect for everything
- If the project could go multiple directions, highlight the top 2-3 as close contenders
- Consider DESIGN mode synergy: does this preset pair well with brand/design workflows?

REQUIRED JSON SCHEMA:

{
  "recommendations": [
    {
      "preset_id": "the preset id string",
      "preset_name": "the human-readable name",
      "match_score": 94,
      "reasoning": "2-3 sentence explanation of why this preset fits",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "tradeoffs": ["tradeoff 1", "tradeoff 2"],
      "design_note": "how this pairs with DESIGN mode for brand/visual work, or null if not relevant"
    }
  ],
  "analysis": {
    "detected_platform": "desktop | web | mobile | cli | multi-platform",
    "detected_requirements": ["requirement1", "requirement2"],
    "complexity_level": "mvp | standard | complex",
    "team_note": "assessment of team size and skill requirements"
  },
  "top_pick_summary": "1-2 sentence compelling summary of why the #1 recommendation is the best choice"
}

SORTING RULES:
- recommendations array MUST be sorted by match_score descending (highest first)
- Only include presets with match_score >= 40
- Include at least 3 recommendations, up to 6
- The top recommendation should have a match_score of 80+ if there is a clear fit

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
  echo "❌ Invalid JSON from Claude Code (ADVISOR):" >&2
  echo "----- RAW OUTPUT -----" >&2
  echo "$CLEAN_OUT" >&2
  echo "----------------------" >&2
  exit 1
}

echo "$CLEAN_OUT"
