<p align="center">
  <img src="src-tauri/icons/logo.svg" width="100" alt="NDI Architech" />
</p>

<h1 align="center">NDI Architech</h1>

<p align="center">
  <strong>Describe your app in 2 sentences. Get a complete project folder. Run one command. Ship it.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/macOS-15+-111111?style=for-the-badge&logo=apple&logoColor=white" />
  <img src="https://img.shields.io/badge/Rust-1.75+-CE422B?style=for-the-badge&logo=rust&logoColor=white" />
  <img src="https://img.shields.io/badge/Tauri-2.0-FFC131?style=for-the-badge&logo=tauri&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Claude-AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white" />
</p>

<p align="center">
  <a href="#what-is-this">What Is This?</a>&ensp;&bull;&ensp;
  <a href="#the-pipeline">Pipeline</a>&ensp;&bull;&ensp;
  <a href="#compiler-modes">Modes</a>&ensp;&bull;&ensp;
  <a href="#chain-generation">Chain</a>&ensp;&bull;&ensp;
  <a href="#scaffold--build">Scaffold</a>&ensp;&bull;&ensp;
  <a href="#installation">Install</a>&ensp;&bull;&ensp;
  <a href="#architecture">Architecture</a>
</p>

---

## What Is This?

NDI Architech is a **documentation compiler for software projects**.

You type a plain English description of what you want to build. The compiler generates a complete set of interconnected project documents — product requirements, architecture, technical specs, implementation tasks, agent instructions, visual design briefs, and more.

Then it bundles everything into a project folder with a single `build.sh` script. Run it, and an AI agent builds your entire project from the generated specs.

**The full pipeline:**

```
"Build me a menu bar weather app for macOS"
        │
        ▼
   NDI Architech compiles 6 documents
        │
        ▼
   Exports a project folder:
   PRD.md, ARD.md, TRD.md, TASKS.md, AGENT.md, DESIGN.md,
   CLAUDE.md, build.sh
        │
        ▼
   $ bash build.sh
        │
        ▼
   Working project. Done.
```

**No templates. No forms. No API keys. No cloud.** Everything runs locally on your Mac through Claude CLI.

---

## The Pipeline

This is what makes NDI Architech different from a chatbot. It is not a conversation — it is a **compiler**.

### Step 1: You describe your idea

> "A SaaS dashboard for managing restaurant inventory, built with Next.js. Multi-tenant, Stripe billing, dark mode."

### Step 2: Chain Generation compiles 6 documents

Each document feeds its full output as context into the next:

```
PRD ──context──▶ ARD ──context──▶ TRD ──context──▶ TASKS ──context──▶ AGENT ──context──▶ DESIGN
```

The architecture knows about the product requirements. The technical specs know about the architecture. The implementation tasks know about the API contracts. Every document is aware of everything that came before it.

### Step 3: Export to Folder

Click export. You get a project folder:

```
my-project/
├── PRD.md          # Product requirements, goals, success metrics
├── ARD.md          # System architecture, tech decisions, trade-offs
├── TRD.md          # API contracts, data models, testing strategy
├── TASKS.md        # Epics and stories with acceptance criteria
├── AGENT.md        # AI agent instructions and coding rules
├── DESIGN.md       # Visual design brief with colors, typography, mood
├── CLAUDE.md       # Auto-generated project context file
└── build.sh        # One-command builder script
```

### Step 4: Build

```bash
cd my-project && bash build.sh
```

The `build.sh` script feeds all 6 documents to Claude CLI. Claude reads every spec, scaffolds the project, and implements every task. One command. Complete project.

---

## Compiler Modes

NDI Architech has **13 compiler modes** organized into four categories.

### Documentation Pipeline (6 modes)

These modes work independently or as a sequential **chain**:

| Mode | Output | What It Generates |
|:-----|:-------|:------------------|
| **PRD** | Product Requirements | Vision, goals, user personas, features, success metrics |
| **ARD** | Architecture Requirements | System design, component diagram, tech decisions, trade-offs |
| **TRD** | Technical Requirements | API contracts, data models, module specs, testing strategy |
| **TASKS** | Epics & Stories | Actionable backlog with acceptance criteria and dependencies |
| **AGENT** | Agent Instructions | Coding rules, do/don't lists, prompt templates for AI agents |
| **DESIGN** | Visual Design Brief | Color palette, typography, mood, layout, culturally-aware prompts |

### Business Intelligence (4 modes)

| Mode | Output | What It Generates |
|:-----|:-------|:------------------|
| **ADVISOR** | Strategic Advice | Business model analysis, go-to-market strategy, risk assessment |
| **AUDIT** | Technical Audit | Code quality, security, performance, and compliance review |
| **ANALYZE** | Market Analysis | Competitor landscape, market sizing, positioning strategy |
| **COMPETE** | Competitive Intel | Feature comparison, pricing analysis, differentiation opportunities |

### Creative AI Prompts (3 modes)

Each mode produces prompts optimized for specific AI generation tools:

| Mode | Output | Optimized For |
|:-----|:-------|:--------------|
| **IMAGE** | Image prompts | Midjourney, DALL-E, Stable Diffusion |
| **VIDEO** | Video prompts | Veo 3, Runway, Pika, Kling |
| **DESIGN** | Design prompts | Imagen 3, Minimax, Midjourney, DALL-E, SDXL |

---

## Chain Generation

The most powerful feature. Click **Chain** and watch six documents generate in sequence, each one building on everything before it.

```
PRD ──▶ ARD ──▶ TRD ──▶ TASKS ──▶ AGENT ──▶ DESIGN
```

**Why this matters:** A standalone PRD generator gives you requirements in a vacuum. NDI Architech's chain means your architecture is shaped by your requirements, your technical specs respect your architecture, your tasks reference actual API contracts, and your agent rules enforce actual coding decisions. Every document is grounded in the ones before it.

**Re-chain from any point.** Changed your mind about the architecture? Click "Re-chain from ARD" to regenerate TRD, TASKS, AGENT, and DESIGN without touching the PRD.

---

## Scaffold & Build

When you export a chain, NDI Architech auto-generates two extra files:

### CLAUDE.md

A project context file assembled from the chain output. Contains:
- Project name and stack (pulled from your selected preset)
- Key rules and constraints (from AGENT output)
- Design system values (colors, typography, mood from DESIGN output)
- Links to all generated documents
- Execution protocol

No LLM call needed — pure template derivation from the raw JSON.

### build.sh

A launcher script that:
1. Collects all `.md` documents in the folder
2. Feeds them to `claude --print` as a single context block
3. Instructs Claude to scaffold the project and implement every task

```bash
cd my-project && bash build.sh
```

One command. The AI agent reads your specs and builds the project.

---

## Verticals

Verticals are **industry-specific prompt overlays** that inject domain expertise into every document in the chain.

| Vertical | What It Adds |
|:---------|:-------------|
| **SaaS Dashboard** | Multi-tenancy, auth (SSO/OAuth2), Stripe billing, admin dashboard, GDPR/SOC2 |
| **Local-First** | CRDTs, offline-first storage, sync engine, end-to-end encryption, conflict resolution |
| **AI Tooling** | Local model management, MLX/llama.cpp backends, streaming responses, GPU detection |

Select a vertical and it enriches every chain step — the PRD gets domain requirements, the ARD gets specialized architecture patterns, the TRD gets relevant technical specs, the TASKS get domain-specific epics, and the AGENT gets specialized coding rules.

---

## DESIGN Mode — Cultural Intelligence

DESIGN mode is not a generic prompt generator. It is a **cultural design intelligence engine**.

You describe your business:
> "A tire company portfolio in Italy, 20 years old, trucks, they want to feel modern but show their history"

The AI infers everything: colors, typography, layout, mood, cultural aesthetic. A logo for a bakery in **Barcelona** feels fundamentally different from one in **Brooklyn** — and it will.

**What it generates:**
- Brand context with cultural notes
- Color palette with hex codes and rationale
- Typography direction
- AI prompts optimized for 5 different tools
- Layout mockup prompt
- 3 design variations
- Negative prompt (what to avoid)

**Cultural awareness** across 13+ regions: USA, UK, Germany, Italy, Spain, France, Japan, Scandinavia, Middle East, Latin America, Slovenia/Balkans, and more.

**Reference image upload** — drop an image and the app analyzes its colors, brightness, and temperature to ground the design direction.

---

## Stack Presets

11 pre-configured technology stacks. Select one and it constrains every generated document to that stack's patterns and best practices.

| Category | Preset | Stack |
|:---------|:-------|:------|
| **Native** | `swift-macos` | SwiftUI 6, SwiftData, CoreML |
| | `swift-macos-utility` | MenuBarExtra, global shortcuts |
| | `swift-ios` | SwiftUI 6, WidgetKit, App Intents |
| **Web** | `nextjs-fullstack` | App Router, Server Actions, Prisma |
| | `astro-site` | Zero JS, content collections |
| **Desktop** | `tauri-localfirst` | Rust + Web frontend, cross-platform |
| **Mobile** | `flutter-mobile` | iOS + Android, Material 3 |
| | `kotlin-android` | Jetpack Compose, Material 3 |
| **CLI** | `cli-tool` | Rust + clap, single binary |
| **Browser** | `minimal-browser` | Tauri + WebKitGTK + adblock-rust |
| **Realtime** | `realtime-app` | WebSockets, CRDTs, PartyKit |

---

## Features

| Feature | Description |
|:--------|:------------|
| **Chain Generation** | 6 documents generated in sequence with full context passing |
| **Re-chain** | Regenerate downstream documents from any point |
| **Scaffold Export** | Auto-generates `CLAUDE.md` + `build.sh` on export |
| **13 Compiler Modes** | Documentation, business intelligence, and creative AI prompts |
| **3 Industry Verticals** | SaaS, Local-First, AI Tooling domain expertise |
| **11 Stack Presets** | SwiftUI, Next.js, Tauri, Flutter, CLI tools, and more |
| **Dependency Graph** | D3-powered visualization of document relationships |
| **Project History** | SQLite-backed local storage of all generations |
| **Inline Editing** | Modify outputs before exporting |
| **CLI Tool** | Full functionality from the terminal |
| **Reference Image Analysis** | Client-side color extraction via Canvas API |

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

### Build & Run

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

1. Select a **Compiler Mode** (PRD, ARD, TASKS, IMAGE, ADVISOR, etc.)
2. For documentation modes: choose a **Stack Preset** and optional **Vertical**
3. Type your project idea
4. Click **Generate** (single), **Generate All** (all docs), or **Chain** (sequential with context)
5. **Export to Folder** to get the complete project package with `build.sh`

### CLI

```bash
# Single document
npx tsx src/cli.ts generate "Build a todo app" --mode prd --stack nextjs-fullstack

# Chain generation (all 6 docs in sequence)
npx tsx src/cli.ts chain "Build a menu bar app" --stack swift-macos-utility

# Creative modes
npx tsx src/cli.ts image "dragon flies above new york"
npx tsx src/cli.ts video "timelapse of sunrise over mountains"

# Stack management
npx tsx src/cli.ts stacks          # List all presets
npx tsx src/cli.ts stack cli-tool  # Show preset details
```

### Keyboard Shortcuts

| Shortcut | Action |
|:---------|:-------|
| `Cmd + Enter` | Generate |
| `Cmd + Shift + G` | Generate All |
| `Cmd + Shift + C` | Copy Output |
| `Cmd + S` | Save Output |
| `Cmd + E` | Toggle Edit Mode |

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

## Architecture

### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                         NDI Architech                          │
│                                                                │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────────┐  │
│  │  TypeScript   │───▶│     Rust     │───▶│  Bash Script    │  │
│  │   Frontend    │    │   (Tauri)    │    │  compile_*.sh   │  │
│  └──────┬───────┘    └──────────────┘    └───────┬─────────┘  │
│         │                                         │            │
│         │            ┌──────────────┐              │            │
│         │            │    SQLite    │              ▼            │
│         │            │  (History)   │     ┌──────────────┐     │
│         │            └──────────────┘     │  Claude CLI  │     │
│         │                                 │   (Local)    │     │
│         │                                 └──────┬───────┘     │
│         │                                        │             │
│         ◀──────── JSON ◀──── jq validate ◀───────┘             │
│                                                                │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │   Renderer   │───▶│   Markdown   │                          │
│  │  (per mode)  │    │   Output     │                          │
│  └──────────────┘    └──────────────┘                          │
│                                                                │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │   Scaffold   │───▶│ CLAUDE.md +  │  (on export)             │
│  │  Generator   │    │  build.sh    │                          │
│  └──────────────┘    └──────────────┘                          │
└────────────────────────────────────────────────────────────────┘
```

### How It Works

1. **User input** — TypeScript constructs a prompt with mode-specific instructions, stack constraints, and vertical overlays
2. **Tauri IPC** — Rust receives the command and spawns the corresponding bash script
3. **Bash script** — Pipes the prompt to `claude --print` with a strict JSON schema as the system prompt
4. **JSON validation** — `jq` validates the response; `awk` fallback extracts JSON if wrapped in prose
5. **Renderer** — Mode-specific TypeScript renderer converts JSON to copy-paste-ready markdown
6. **Chain context** — In chain mode, each step's output becomes the next step's input context
7. **Scaffold** — On export, raw JSON outputs are parsed to auto-generate `CLAUDE.md` and `build.sh`

### Project Structure

```
nodaysidle-ndiarchitech/
├── src/                              # TypeScript frontend
│   ├── app.ts                        # Main application logic
│   ├── main.ts                       # Entry point
│   ├── scaffold.ts                   # CLAUDE.md + build.sh generator
│   ├── verticals.ts                  # Industry vertical templates
│   ├── renderers/                    # Mode-specific formatters (11 renderers)
│   │   ├── renderARD.ts
│   │   ├── renderTRD.ts
│   │   ├── renderTASKS.ts
│   │   ├── renderAGENT.ts
│   │   ├── renderIMAGE.ts
│   │   ├── renderVIDEO.ts
│   │   ├── renderDESIGN.ts           # Cultural intelligence renderer
│   │   ├── renderADVISOR.ts
│   │   ├── renderAUDIT.ts
│   │   ├── renderANALYZE.ts
│   │   └── renderCOMPETE.ts
│   ├── renderer.ts                   # PRD markdown formatter
│   ├── compilerPrompt.ts             # Prompt construction
│   ├── stacks.ts                     # 11 tech stack presets
│   ├── graph.ts                      # D3 dependency visualization
│   ├── style.css                     # macOS dark theme
│   └── cli.ts                        # CLI entry point
├── src-tauri/                        # Rust backend
│   ├── src/main.rs                   # Tauri commands + mode dispatch
│   └── scripts/                      # Claude CLI wrappers (13 scripts)
│       ├── compile_prd.sh
│       ├── compile_ard.sh
│       ├── compile_trd.sh
│       ├── compile_tasks.sh
│       ├── compile_agent.sh
│       ├── compile_design.sh
│       ├── compile_image.sh
│       ├── compile_video.sh
│       ├── compile_advisor.sh
│       ├── compile_audit.sh
│       ├── compile_analyze.sh
│       ├── compile_compete.sh
│       └── llm_call.sh              # Shared Claude CLI wrapper
├── index.html
├── package.json
├── tsconfig.json                     # Browser code (Vite/Tauri)
└── tsconfig.node.json                # CLI code (Node.js)
```

---

## Scalability

NDI Architech is built to grow. Every mode is a self-contained bash script + TypeScript renderer pair. Adding a new mode takes 6 steps and zero refactoring.

### Adding a New Mode

1. **Create `compile_yourmode.sh`** — System prompt + JSON schema
2. **Create `renderYOURMODE.ts`** — JSON to markdown converter
3. **Add to `schemas.ts`** — Register for CLI
4. **Add to `main.rs`** — One line: `"yourmode" => "compile_yourmode.sh"`
5. **Add to `app.ts`** — Import renderer + add to renderers map
6. **Add to `index.html`** — One dropdown option

**No breaking changes.** Modes cannot affect each other. The architecture has scaled from 5 modes to 13 without a single refactor.

### Why This Scales

| Principle | Implementation |
|:----------|:---------------|
| **Isolation** | Each mode is a standalone script + renderer. Modes cannot break each other. |
| **Schema-first** | The bash script's JSON schema is the contract. Renderers read exactly what scripts produce. |
| **No shared state** | Chain mode passes context via text, not memory. |
| **Text pipeline** | Everything flows as text: prompt → bash → claude → JSON → markdown. No binary formats. |

---

## Design Philosophy

**Compiler, not chatbot.** This is not a conversation. It is a structured compilation pipeline with deterministic outputs.

**Text in, text out.** User text → structured JSON → formatted markdown → project folder → working code. No databases between steps, no complex state machines.

**Local-first.** Zero cloud dependencies. Claude runs on your machine. History lives in local SQLite. Nothing leaves your computer.

**Schema is contract.** The bash script's JSON schema defines the interface between script and renderer. This strictness catches integration errors at development time, not in production.

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
