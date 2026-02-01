# NDI Architech

**Transform a 2-sentence idea into production-ready documentation in seconds.**

A native macOS desktop app + CLI powered by Rust + Tauri that generates comprehensive product documentation using Claude AI. From PRD to deployment-ready agent prompts, plus AI image and video prompt generation — fully local, blazingly fast.

![macOS](https://img.shields.io/badge/macOS-15+-black?style=flat-square&logo=apple)
![Rust](https://img.shields.io/badge/Rust-1.75+-orange?style=flat-square&logo=rust)
![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)

---

## What It Does

### Product Documentation (PRD Mode)

**Input:** A simple project description (2-5 sentences)

**Output:** Five interconnected documents:

| Document | Purpose |
|----------|---------|
| **PRD** | Product Requirements — vision, goals, features, success metrics |
| **ARD** | Architecture Requirements — system design, tech decisions, trade-offs |
| **TRD** | Technical Requirements — API contracts, modules, data models, testing |
| **TASKS** | Epics & Stories — actionable development tasks with acceptance criteria |
| **AGENT** | CLI Prompts — copy-paste prompts for Claude/Cursor/Copilot |

### AI Image Prompts (IMAGE Mode)

**Input:** Simple description like "dragon flies above new york"

**Output:** Professional prompts optimized for:
- **Midjourney** — with style keywords and parameters
- **DALL-E** — detailed natural language prompts
- **Stable Diffusion** — technical terms and weights

Includes: composition, camera angle, lens, lighting, style, color palette, negative prompts.

### AI Video Prompts (VIDEO Mode)

**Input:** Simple description like "timelapse of sunrise over mountains"

**Output:** Professional prompts optimized for:
- **Google Veo 3** — cinematic, natural motion
- **Runway Gen-3** — motion-focused descriptions
- **Pika Labs** — concise action prompts
- **Kling AI** — detailed scene and motion

Includes: camera movement, subject motion, duration, color grading, mood, audio suggestions.

---

## Features

- **Chain Generation** — Each document feeds context to the next (PRD → ARD → TRD → TASKS → AGENT)
- **11 Tech Stack Presets** — SwiftUI, Next.js, Tauri, Flutter, CLI tools, and more
- **Image/Video Prompt Generation** — Professional AI art prompts from simple descriptions
- **CLI Tool** — Generate documentation from the command line
- **Dependency Graph** — D3-powered visualization of document relationships
- **Project History** — SQLite-backed local storage of all generations
- **Inline Editing** — Modify outputs directly before exporting
- **Export Options** — Save as individual markdown files or copy to clipboard

---

## Tech Stack

```
┌─────────────────────────────────────────────────────┐
│  Frontend         │  TypeScript + Vite              │
│  UI               │  Vanilla CSS (macOS Dark Theme) │
│  Desktop          │  Tauri 2 (Rust)                 │
│  CLI              │  Commander.js + Ora + Chalk     │
│  AI               │  Claude CLI                     │
│  Database         │  SQLite                         │
│  Visualization    │  D3.js                          │
└─────────────────────────────────────────────────────┘
```

---

## Installation

### Prerequisites

- **macOS 15+** (Sequoia)
- **Rust** (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- **Node.js 20+** (`brew install node`)
- **Claude CLI** (`npm install -g @anthropic-ai/claude-code` + `claude login`)
- **jq** (`brew install jq`)

### Build from Source

```bash
# Clone
git clone https://github.com/salvadalba/nodaysidle-ndiarchitech.git
cd nodaysidle-ndiarchitech

# Install dependencies
npm install

# Development
npm run tauri:dev

# Production build
npm run tauri:build

# Install to /Applications
cp -r src-tauri/target/release/bundle/macos/NDI.app /Applications/
```

---

## Usage

### Desktop App

1. Select a **Compiler Mode**:
   - PRD, ARD, TRD, TASKS, AGENT — for product documentation
   - IMAGE — for AI image prompts
   - VIDEO — for AI video prompts

2. For PRD modes: Choose a **Tech Stack** preset
3. Enter your project idea or prompt
4. Click **Generate** or press `Cmd + Enter`

### Chain Generation

Click **Chain** to generate all 5 PRD documents in sequence, where each document builds on the previous one's context.

### CLI Tool

```bash
# Run from project directory
cd /path/to/nodaysidle-ndiarchitech

# List all stack presets
npx tsx src/cli.ts stacks

# Show stack details
npx tsx src/cli.ts stack cli-tool

# Generate single document
npx tsx src/cli.ts generate "Build a todo app" --mode prd --stack nextjs-fullstack

# Generate all documents
npx tsx src/cli.ts generate-all "Build a browser" --stack minimal-browser --output ./docs

# Chain generate (PRD → ARD → TRD → Tasks → Agent)
npx tsx src/cli.ts chain "Build a menu bar app" --stack swift-macos-utility

# Generate image prompts
npx tsx src/cli.ts image "dragon flies above new york"

# Generate video prompts
npx tsx src/cli.ts video "timelapse of sunrise over mountains"
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd + Enter` | Generate |
| `Cmd + Shift + G` | Generate All |
| `Cmd + Shift + C` | Copy Output |
| `Cmd + S` | Save Output |
| `Cmd + E` | Toggle Edit Mode |
| `Cmd + 1` | Focus Input |
| `Cmd + 2` | Focus Output |
| `Escape` | Exit Edit Mode |

---

## Stack Presets

### Native Apps
- **Native macOS App** (`swift-macos`) — SwiftUI 6, SwiftData, CoreML
- **macOS Utility / Menu Bar** (`swift-macos-utility`) — MenuBarExtra, global shortcuts
- **Native iOS App** (`swift-ios`) — SwiftUI 6, WidgetKit, App Intents

### Web
- **Next.js 15 Full Stack** (`nextjs-fullstack`) — App Router, Server Actions, Prisma
- **Astro 5 Static Site** (`astro-site`) — Zero JS, content collections, landing pages

### Desktop
- **Tauri 2 Desktop App** (`tauri-localfirst`) — Rust + Web frontend, cross-platform

### Mobile
- **Flutter Cross-Platform** (`flutter-mobile`) — iOS + Android
- **Native Android** (`kotlin-android`) — Jetpack Compose, Material 3

### CLI & Browser
- **CLI Tool** (`cli-tool`) — Rust + clap, single binary distribution
- **Minimal Browser** (`minimal-browser`) — Tauri + WebKitGTK + adblock-rust

### Real-time
- **Realtime Collaborative** (`realtime-app`) — WebSockets, CRDTs, PartyKit

---

## Project Structure

```
nodaysidle-ndiarchitech/
├── src/                          # TypeScript frontend
│   ├── app.ts                    # Main application logic
│   ├── cli.ts                    # CLI entry point
│   ├── compiler/                 # Compilation core
│   │   ├── index.ts              # Exports
│   │   ├── claudeRunner.ts       # Claude CLI execution
│   │   └── schemas.ts            # JSON schemas for all modes
│   ├── renderer.ts               # PRD markdown formatter
│   ├── renderers/                # Document formatters
│   │   ├── renderARD.ts
│   │   ├── renderTRD.ts
│   │   ├── renderTASKS.ts
│   │   ├── renderAGENT.ts
│   │   ├── renderIMAGE.ts        # Image prompt formatter
│   │   └── renderVIDEO.ts        # Video prompt formatter
│   ├── stacks.ts                 # Tech stack presets
│   ├── compilerPrompt.ts         # Prompt construction
│   ├── graph.ts                  # D3 dependency visualization
│   └── utils/                    # Shared utilities
├── src-tauri/                    # Rust backend
│   ├── src/main.rs               # Tauri commands
│   └── scripts/                  # Claude CLI wrappers
│       ├── compile_prd.sh
│       ├── compile_ard.sh
│       ├── compile_trd.sh
│       ├── compile_tasks.sh
│       ├── compile_agent.sh
│       ├── compile_image.sh
│       └── compile_video.sh
├── index.html                    # Entry point
├── STACKS.md                     # Stack presets guide
└── package.json
```

---

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  TypeScript │────▶│    Rust     │────▶│  Claude CLI │
│   Frontend  │     │   (Tauri)   │     │   (Local)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   ▼                   │
       │            ┌─────────────┐            │
       │            │   SQLite    │            │
       │            │  (History)  │            │
       │            └─────────────┘            │
       │                                       │
       ◀───────────────────────────────────────┘
                    JSON Response
```

1. User enters project idea + selects mode/stack
2. TypeScript constructs prompt and calls Tauri command
3. Rust spawns bash script with Claude CLI
4. Claude generates structured JSON
5. Bash validates JSON with `jq`
6. TypeScript renders markdown/JSON and displays output

---

## Example Outputs

### Image Prompt Example

**Input:** `dragon flies above new york`

**Output:**
```json
{
  "title": "Dragon Soaring Over New York City Skyline",
  "prompt": "A majestic dragon with iridescent scales soaring gracefully above the New York City skyline at golden hour...",
  "tool_prompts": {
    "midjourney": "majestic iridescent dragon soaring above New York City skyline, Empire State Building visible, golden hour lighting --ar 16:9 --v 6",
    "dalle": "A highly detailed photorealistic image of a large fantasy dragon...",
    "stable_diffusion": "(masterpiece, best quality, ultra detailed, 8K), photorealistic dragon with iridescent scales..."
  }
}
```

### Video Prompt Example

**Input:** `car chase through tokyo at night`

**Output:**
```json
{
  "title": "Nighttime Tokyo Street Chase",
  "scene": "High-speed car chase through neon-lit Tokyo streets...",
  "camera": {
    "movement": "tracking shot following the lead car",
    "angle": "low angle",
    "speed": "fast with speed ramping"
  },
  "tool_prompts": {
    "veo": "Cinematic tracking shot of a sports car racing through neon-lit Tokyo streets...",
    "runway": "Fast-paced car chase, tracking shot, neon reflections on wet pavement...",
    "kling": "Night chase scene in Tokyo, camera follows speeding car..."
  }
}
```

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## License

MIT

---

<p align="center">
  <strong>Built with Rust, TypeScript, and Claude AI</strong><br>
  <sub>NODAYSIDLE. Ship faster.</sub>
</p>
