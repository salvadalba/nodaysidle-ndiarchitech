# NDI Architech

**Transform a 2-sentence idea into production-ready documentation in seconds.**

A native macOS desktop app powered by Rust + Tauri that generates comprehensive product documentation using Claude AI. From PRD to deployment-ready agent prompts — fully local, blazingly fast.

![macOS](https://img.shields.io/badge/macOS-15+-black?style=flat-square&logo=apple)
![Rust](https://img.shields.io/badge/Rust-1.75+-orange?style=flat-square&logo=rust)
![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)

---

## What It Does

**Input:** A simple project description (2-5 sentences)

**Output:** Five interconnected documents:

| Document | Purpose |
|----------|---------|
| **PRD** | Product Requirements — vision, goals, features, success metrics |
| **ARD** | Architecture Requirements — system design, tech decisions, trade-offs |
| **TRD** | Technical Requirements — API contracts, modules, data models, testing |
| **TASKS** | Epics & Stories — actionable development tasks with acceptance criteria |
| **AGENT** | CLI Prompts — copy-paste prompts for Claude/Cursor/Copilot |

---

## Features

- **Chain Generation** — Each document feeds context to the next (PRD → ARD → TRD → TASKS → AGENT)
- **15+ Tech Stack Presets** — SwiftUI, Next.js, Tauri, Flutter, and more
- **Project Roulette** — Generate random startup ideas instantly
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
│  AI               │  Claude CLI                     │
│  Database         │  SQLite                         │
│  Visualization    │  D3.js                          │
└─────────────────────────────────────────────────────┘
```

---

## Screenshots

*Native macOS dark theme with glassmorphism and SF fonts*

```
┌──────────────────────────────────────────────────────────────┐
│  ●  ●  ●                    NDI ARCHITECH                    │
├────────────────────────────┬─────────────────────────────────┤
│  ▼ Compiler Mode           │                                 │
│  ┌─────────────────────┐   │  # Product Requirements         │
│  │ PRD                 │   │                                 │
│  │ ARD                 │   │  ## Product Vision              │
│  │ TRD                 │   │  A revolutionary app that...    │
│  │ TASKS               │   │                                 │
│  │ AGENT               │   │  ## Goals                       │
│  └─────────────────────┘   │  - Goal 1                       │
│                            │  - Goal 2                       │
│  ▼ Tech Stack              │                                 │
│  ┌─────────────────────┐   │  ## Core Features               │
│  │ Native macOS App    │   │  - Feature 1                    │
│  └─────────────────────┘   │  - Feature 2                    │
│                            │                                 │
│  ┌─────────────────────┐   │                                 │
│  │ Your idea here...   │   │                                 │
│  │                     │   │                                 │
│  └─────────────────────┘   │                                 │
│                            │                                 │
│  [Generate] [Chain] [Dice] │        [Copy] [Save] [Export]   │
└────────────────────────────┴─────────────────────────────────┘
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

### Basic Generation

1. Select a **Compiler Mode** (PRD, ARD, TRD, TASKS, or AGENT)
2. Choose a **Tech Stack** preset
3. Enter your project idea
4. Click **Generate** or press `Cmd + Enter`

### Chain Generation

Click **Chain** to generate all 5 documents in sequence, where each document builds on the previous one's context.

### Project Roulette

Click the dice button to generate a random startup idea and automatically start chain generation.

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
- **Native macOS App** — SwiftUI 6, SwiftData, CoreML
- **macOS Utility / Menu Bar** — MenuBarExtra, global shortcuts
- **Native iOS App** — SwiftUI 6, WidgetKit, App Intents
- **Tauri Desktop App** — Rust + Web frontend

### Web
- **Next.js 15 Full Stack** — App Router, Server Actions, Prisma
- **Astro 5 Static Site** — Zero JS, content collections
- **Premium Web App** — Glassmorphism, edge-first

### Mobile
- **Flutter Cross-Platform** — iOS + Android
- **Native Android** — Jetpack Compose, Material 3

### Real-time
- **Realtime Collaborative** — WebSockets, CRDTs, PartyKit

---

## Project Structure

```
nodaysidle-ndiarchitech/
├── src/                          # TypeScript frontend
│   ├── app.ts                    # Main application logic
│   ├── renderer.ts               # PRD markdown formatter
│   ├── renderers/                # Document formatters
│   ├── stacks.ts                 # Tech stack presets
│   ├── graph.ts                  # D3 dependency visualization
│   ├── roulette.ts               # Random idea generator
│   ├── types/                    # TypeScript interfaces
│   └── utils/                    # Shared utilities
├── src-tauri/                    # Rust backend
│   ├── src/main.rs               # Tauri commands
│   └── scripts/                  # Claude CLI wrappers
├── index.html                    # Entry point
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
6. TypeScript renders markdown and displays output

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
  <sub>No days idle. Ship faster.</sub>
</p>
