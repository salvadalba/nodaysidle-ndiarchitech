<p align="center">
  <img src="src-tauri/icons/logo.svg" width="80" alt="NDI Architech" />
</p>

<h1 align="center">NDI Architech</h1>

<p align="center">
  <strong>From a 2-sentence idea to production-ready documentation in seconds.</strong><br/>
  <sub>8 compiler modes. 11 stack presets. One prompt is all it takes.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/macOS-15+-111111?style=for-the-badge&logo=apple&logoColor=white" />
  <img src="https://img.shields.io/badge/Rust-1.75+-CE422B?style=for-the-badge&logo=rust&logoColor=white" />
  <img src="https://img.shields.io/badge/Tauri-2.0-FFC131?style=for-the-badge&logo=tauri&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Claude-AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white" />
</p>

<p align="center">
  <a href="#installation">Install</a>&ensp;&bull;&ensp;
  <a href="#compiler-modes">Modes</a>&ensp;&bull;&ensp;
  <a href="#chain-generation">Chain</a>&ensp;&bull;&ensp;
  <a href="#cli-tool">CLI</a>&ensp;&bull;&ensp;
  <a href="#architecture">Architecture</a>&ensp;&bull;&ensp;
  <a href="#scalability">Scalability</a>
</p>

---

## The Idea

You describe a project in plain English. NDI Architech compiles it into structured, interconnected documentation — ready for development, review, or handoff. No templates. No forms. Just your idea and an AI compiler.

**One input. Eight output modes. Fully local. Blazingly fast.**

---

## Compiler Modes

### Product Documentation Pipeline

Five modes that work independently or as a **chain** where each document feeds context to the next:

| Mode | Output | What It Generates |
|:-----|:-------|:------------------|
| **PRD** | Product Requirements | Vision, goals, features, success metrics, target users |
| **ARD** | Architecture Requirements | System design, tech decisions, trade-offs, infrastructure |
| **TRD** | Technical Requirements | API contracts, modules, data models, testing strategy |
| **TASKS** | Epics & Stories | Actionable backlog items with acceptance criteria |
| **AGENT** | CLI Prompts | Copy-paste prompts for Claude, Cursor, Copilot |

### Creative AI Prompts

Three modes for AI-generated media, each producing tool-optimized prompts:

| Mode | Output | Tools |
|:-----|:-------|:------|
| **IMAGE** | Image generation prompts | Midjourney, DALL-E, Stable Diffusion |
| **VIDEO** | Video generation prompts | Veo 3, Runway, Pika, Kling |
| **DESIGN** | Culturally-intelligent design prompts | Imagen 3, Minimax, Midjourney, DALL-E, Stable Diffusion XL |

---

## Chain Generation

The most powerful feature. Click **Chain** and watch five documents generate in sequence:

```
PRD ──context──▶ ARD ──context──▶ TRD ──context──▶ TASKS ──context──▶ AGENT
```

Each step receives the full output of the previous step as context. The ARD knows about the PRD's features. The TRD knows about the ARD's architecture. The TASKS know about the TRD's API contracts. The AGENT prompts know about everything.

**Re-chain from any point.** Changed the TRD? Click "Re-chain from here" to regenerate TASKS and AGENT without touching PRD or ARD.

---

## DESIGN Mode — Cultural Intelligence Engine

DESIGN mode is not a generic prompt generator. It is a **cultural design intelligence engine**.

You describe your business:
> "A tire company portfolio in Italy, 20 years old, trucks, they want to feel modern but show their history"

The AI infers everything else: colors, typography, layout, mood, cultural aesthetic. A logo for a bakery in **Barcelona** should feel fundamentally different from one in **Brooklyn** — and it will.

**What it generates:**
- Brand context with cultural notes
- Color palette with hex codes and rationale
- Typography direction
- Design prompt optimized for 5 AI tools
- Layout mockup prompt (paste into any AI tool for a wireframe)
- 3 design variations
- Negative prompt (what to avoid)

**Cultural awareness** across 13+ regions: USA, UK, Germany, Italy, Spain, France, Japan, Scandinavia, Middle East, Latin America, Slovenia/Balkans, and more.

**Optional reference image upload** — drop an image and the app analyzes its colors, brightness, and temperature to ground the AI's design direction.

---

## Features

| Feature | Description |
|:--------|:------------|
| **Chain Generation** | PRD → ARD → TRD → TASKS → AGENT with full context passing |
| **Re-chain** | Regenerate downstream documents from any point |
| **11 Stack Presets** | SwiftUI, Next.js, Tauri, Flutter, CLI tools, and more |
| **Dependency Graph** | D3-powered visualization of document relationships |
| **Project History** | SQLite-backed local storage of all generations |
| **Inline Editing** | Modify outputs before exporting |
| **Export to Folder** | Save each chain step as individual markdown files |
| **CLI Tool** | Full functionality from the command line |
| **Reference Image Analysis** | Client-side color extraction via Canvas API |

---

## Tech Stack

```
Frontend ─────────── TypeScript + Vite
UI ───────────────── Vanilla CSS (macOS Dark Theme)
Desktop Shell ────── Tauri 2 (Rust)
AI Engine ────────── Claude CLI (local)
CLI Interface ────── Commander.js + Ora + Chalk
Database ─────────── SQLite (via Tauri plugin)
Visualization ────── D3.js
```

**Zero cloud dependencies.** Claude runs locally via the CLI. No API keys. No server. No telemetry.

---

## Installation

### Prerequisites

| Dependency | Install |
|:-----------|:--------|
| macOS 15+ | Sequoia or later |
| Rust | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Node.js 20+ | `brew install node` |
| Claude CLI | `npm install -g @anthropic-ai/claude-code && claude login` |
| jq | `brew install jq` |

### Build & Install

```bash
git clone https://github.com/salvadalba/nodaysidle-ndiarchitech.git
cd nodaysidle-ndiarchitech
npm install

# Development
npm run tauri:dev

# Production build + install
npm run tauri:build
cp -r src-tauri/target/release/bundle/macos/NDI.app /Applications/
```

---

## Usage

### Desktop App

1. Select a **Compiler Mode** (PRD, ARD, TRD, TASKS, AGENT, IMAGE, VIDEO, or DESIGN)
2. For documentation modes: choose a **Tech Stack** preset
3. Enter your project idea
4. **Generate** (single mode), **Generate All** (all 5 docs), or **Chain** (sequential with context)

### Keyboard Shortcuts

| Shortcut | Action |
|:---------|:-------|
| `Cmd + Enter` | Generate |
| `Cmd + Shift + G` | Generate All |
| `Cmd + Shift + C` | Copy Output |
| `Cmd + S` | Save Output |
| `Cmd + E` | Toggle Edit Mode |
| `Cmd + 1` / `Cmd + 2` | Focus Input / Output |

---

## CLI Tool

Full compiler functionality from the terminal:

```bash
# Single document
npx tsx src/cli.ts generate "Build a todo app" --mode prd --stack nextjs-fullstack

# All 5 documents
npx tsx src/cli.ts generate-all "Build a browser" --stack minimal-browser --output ./docs

# Chain generation
npx tsx src/cli.ts chain "Build a menu bar app" --stack swift-macos-utility

# Creative modes
npx tsx src/cli.ts image "dragon flies above new york"
npx tsx src/cli.ts video "timelapse of sunrise over mountains"

# Stack management
npx tsx src/cli.ts stacks          # List all presets
npx tsx src/cli.ts stack cli-tool  # Show preset details
```

---

## Stack Presets

<table>
<tr><th>Category</th><th>Preset</th><th>Stack</th></tr>
<tr><td rowspan="3"><strong>Native</strong></td>
<td><code>swift-macos</code></td><td>SwiftUI 6, SwiftData, CoreML</td></tr>
<tr><td><code>swift-macos-utility</code></td><td>MenuBarExtra, global shortcuts</td></tr>
<tr><td><code>swift-ios</code></td><td>SwiftUI 6, WidgetKit, App Intents</td></tr>

<tr><td rowspan="2"><strong>Web</strong></td>
<td><code>nextjs-fullstack</code></td><td>App Router, Server Actions, Prisma</td></tr>
<tr><td><code>astro-site</code></td><td>Zero JS, content collections</td></tr>

<tr><td><strong>Desktop</strong></td>
<td><code>tauri-localfirst</code></td><td>Rust + Web frontend, cross-platform</td></tr>

<tr><td rowspan="2"><strong>Mobile</strong></td>
<td><code>flutter-mobile</code></td><td>iOS + Android, Material 3</td></tr>
<tr><td><code>kotlin-android</code></td><td>Jetpack Compose, Material 3</td></tr>

<tr><td rowspan="2"><strong>CLI & Browser</strong></td>
<td><code>cli-tool</code></td><td>Rust + clap, single binary</td></tr>
<tr><td><code>minimal-browser</code></td><td>Tauri + WebKitGTK + adblock-rust</td></tr>

<tr><td><strong>Realtime</strong></td>
<td><code>realtime-app</code></td><td>WebSockets, CRDTs, PartyKit</td></tr>
</table>

---

## Architecture

### Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                        NDI Architech                         │
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────────┐ │
│  │  TypeScript  │───▶│    Rust     │───▶│   Bash Script    │ │
│  │   Frontend   │    │   (Tauri)   │    │  compile_*.sh    │ │
│  └──────┬──────┘    └─────────────┘    └────────┬─────────┘ │
│         │                                        │           │
│         │           ┌─────────────┐              │           │
│         │           │   SQLite    │              ▼           │
│         │           │  (History)  │      ┌──────────────┐   │
│         │           └─────────────┘      │  Claude CLI  │   │
│         │                                │   (Local)    │   │
│         │                                └──────┬───────┘   │
│         │                                       │           │
│         ◀──────── JSON ◀──── jq validate ◀──────┘           │
│                                                              │
│  ┌─────────────┐                                             │
│  │  Renderer   │──▶ Markdown Output                          │
│  │  (per mode) │                                             │
│  └─────────────┘                                             │
└──────────────────────────────────────────────────────────────┘
```

### How It Works

1. **User input** → TypeScript constructs a prompt with mode-specific instructions and stack constraints
2. **Tauri IPC** → Rust receives the command and spawns the corresponding bash script
3. **Bash script** → Pipes the prompt to `claude --print` with a strict JSON schema as the system prompt
4. **JSON validation** → `jq` validates the response; `awk` fallback extracts JSON if wrapped in prose
5. **Renderer** → Mode-specific TypeScript renderer converts JSON to copy-paste-ready markdown
6. **Chain context** → In chain mode, each renderer's output becomes the next step's input context

### Project Structure

```
nodaysidle-ndiarchitech/
├── src/                              # TypeScript frontend
│   ├── app.ts                        # Main application logic (1100+ lines)
│   ├── main.ts                       # Entry point
│   ├── compiler/                     # Compilation core
│   │   ├── schemas.ts                # JSON schemas for all 8 modes
│   │   ├── claudeRunner.ts           # Claude CLI execution (Node.js)
│   │   └── index.ts                  # Exports
│   ├── renderers/                    # Mode-specific formatters
│   │   ├── renderARD.ts
│   │   ├── renderTRD.ts
│   │   ├── renderTASKS.ts
│   │   ├── renderAGENT.ts
│   │   ├── renderIMAGE.ts
│   │   ├── renderVIDEO.ts
│   │   └── renderDESIGN.ts           # Cultural intelligence renderer
│   ├── renderer.ts                   # PRD markdown formatter
│   ├── compilerPrompt.ts             # Prompt construction
│   ├── stacks.ts                     # 11 tech stack presets
│   ├── graph.ts                      # D3 dependency visualization
│   ├── style.css                     # macOS dark theme (1000+ lines)
│   └── cli.ts                        # CLI entry point
├── src-tauri/                        # Rust backend
│   ├── src/main.rs                   # Tauri commands + mode dispatch
│   └── scripts/                      # Claude CLI wrappers
│       ├── compile_prd.sh
│       ├── compile_ard.sh
│       ├── compile_trd.sh
│       ├── compile_tasks.sh
│       ├── compile_agent.sh
│       ├── compile_image.sh
│       ├── compile_video.sh
│       └── compile_design.sh         # Cultural intelligence engine
├── index.html                        # Single-page entry
├── package.json
├── tsconfig.json                     # Browser code (Vite/Tauri)
└── tsconfig.node.json                # CLI code (Node.js)
```

---

## Scalability

NDI Architech is built to grow. The architecture makes adding new compiler modes trivial.

### Adding a New Mode

Every mode follows the same pattern. To add a new one:

1. **Create `compile_yourmode.sh`** — Define the system prompt and JSON schema
2. **Create `renderYOURMODE.ts`** — Convert JSON to markdown
3. **Add to `schemas.ts`** — Register the schema for the CLI path
4. **Add to `main.rs`** — One line: `"yourmode" => "compile_yourmode.sh"`
5. **Add to `app.ts`** — Import renderer + add to the renderers map
6. **Add to `index.html`** — One dropdown option

**That's it.** No refactoring. No breaking changes. Each mode is fully self-contained.

### Why This Scales

| Principle | Implementation |
|:----------|:---------------|
| **Isolation** | Each mode is a standalone bash script + renderer pair. Modes cannot break each other. |
| **Schema-first** | The bash script's JSON schema is the source of truth. The renderer reads exactly what the script produces. |
| **No shared state** | Modes share no runtime state. Chain mode passes context via text, not memory. |
| **Dual runtime** | Desktop (Tauri/Rust) and CLI (Node.js) share the same schemas but run independently. |
| **Text pipeline** | Everything flows as text: prompt → bash → claude → JSON → markdown. No binary formats, no serialization complexity. |

### Scaling Dimensions

**More modes** — Add IMAGE, VIDEO, DESIGN without touching PRD/ARD/TRD. Each mode is ~150 lines of bash + ~130 lines of TypeScript.

**More stacks** — Stack presets are a single TypeScript object in `stacks.ts`. Add a preset, it appears in the dropdown.

**More AI tools** — Each mode's `tool_prompts` object can grow independently. Adding a new AI tool means adding one field to the schema and one section to the renderer.

**More chain steps** — The chain array in `app.ts` is configurable. New documentation modes can be inserted at any point in the chain.

---

## Design Philosophy

**Functionality over aesthetics.** The app exists to compile documentation, not to look pretty. Every UI element serves the pipeline.

**Text in, text out.** The entire system is a text transformation pipeline. User text → structured JSON → formatted markdown. No databases between steps, no complex state machines, no over-engineering.

**Local-first.** Zero cloud dependencies. Claude runs on your machine. History lives in local SQLite. Nothing leaves your computer.

**Schema is contract.** The bash script's JSON schema defines the interface. If the renderer expects `responsibilities` but the script returns `responsibility`, the output breaks. This strictness is intentional — it catches integration errors at development time, not in production.

---

## Contributing

Contributions welcome. Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-mode`)
3. Follow the existing patterns (bash script + renderer + schema)
4. Test with `npm run tauri:dev`
5. Open a Pull Request

---

## License

MIT

---

<p align="center">
  <sub><strong>NODAYSIDLE</strong>&ensp;&mdash;&ensp;Ship faster.</sub>
</p>
