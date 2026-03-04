# NODAYSIDLE User Guide

**Version 0.5.0** — AI-Powered Product Compiler

NODAYSIDLE turns a project idea into a complete set of product documents, creative briefs, and competitive intelligence — powered by Claude AI.

---

## Quick Start

1. Open **NODAYSIDLE** from `/Applications`
2. Select a **Compiler Mode** (what you want to generate)
3. Choose a **Tech Stack Preset** (your technology choices)
4. Type your project idea in the text area
5. Click **Generate Output**
6. Copy, save, or export the result

---

## Compiler Modes

### Core Documentation Chain

These 5 modes form a connected pipeline. Run them individually or use **Chain** to generate all 5 in sequence:

| Mode | What It Generates |
|------|------------------|
| **PRD** | Product Requirements Document — features, user stories, scope, milestones |
| **ARD** | Architecture Requirements — system design, components, data flow, infrastructure |
| **TRD** | Technical Requirements — APIs, data models, implementation details, schemas |
| **TASKS** | Epics + Tasks — agile backlog with stories, acceptance criteria, estimates |
| **AGENT** | CLI Agent Prompts — ready-to-paste prompts for Claude Code, Cursor, etc. |

### Creative Modes

| Mode | What It Generates |
|------|------------------|
| **IMAGE** | AI image generation prompts for Midjourney, DALL-E, Stable Diffusion |
| **VIDEO** | AI video generation prompts for Veo 3, Runway, Pika, Kling |
| **DESIGN** | Culturally-intelligent design direction with color palette, typography, and mockup prompts |

### Analysis Modes

| Mode | What It Generates |
|------|------------------|
| **ADVISOR** | Tech stack recommendation — ranks all presets by fit with reasoning |
| **AUDIT** | Quality and risk audit of your chain output — finds contradictions, gaps, risks |
| **ANALYZE** | Reverse-engineers an existing project folder into documentation |
| **COMPETE** | Competitive analysis — analyzes a product URL and generates a PRD to build something better |

---

## Tech Stack Presets

Choose the stack that matches your project. The compiler tailors all output to use these technologies specifically:

| Preset | Technologies |
|--------|-------------|
| **Native macOS App** | SwiftUI, AppKit, CoreData, CloudKit |
| **macOS Utility / Menu Bar App** | SwiftUI, MenuBarExtra, UserDefaults |
| **Next.js 15 Full Stack** | Next.js 15, React 19, Prisma, PostgreSQL |
| **Astro 5 Static Site** | Astro 5, MDX, Tailwind, Cloudflare |
| **Tauri 2 Desktop App** | Tauri 2, TypeScript, SQLite, Rust |
| **Native iOS App** | SwiftUI, SwiftData, CloudKit |
| **Native Android App** | Kotlin, Jetpack Compose, Room, Hilt |
| **Flutter Cross-Platform** | Flutter, Dart, Riverpod, Drift |
| **CLI Tool** | Node.js/Bun, Commander, Chalk |
| **Minimal Browser** | Vanilla HTML/CSS/JS, no framework |
| **Realtime Collaborative App** | Next.js, Liveblocks/Yjs, WebSockets |
| **Local LLM Runner (MLX)** | Swift, MLX, GGUF, Metal |

---

## Industry Verticals (Optional)

Verticals add industry-specific context to every mode:

| Vertical | Adds Context For |
|----------|-----------------|
| **SaaS Dashboard** | Multi-tenancy, billing tiers, analytics, team management |
| **Local-First Productivity** | Offline support, CRDTs, sync, local storage |
| **AI Tooling** | Model pipelines, prompt engineering, inference optimization |

Select "None" if your project does not fit a specific vertical.

---

## Buttons & Actions

### Generate Buttons

| Button | What It Does |
|--------|-------------|
| **Generate Output** | Runs the selected compiler mode once |
| **Generate All** | Runs PRD, ARD, TRD, TASKS, AGENT sequentially (output combined in textarea) |
| **Chain** | Runs the 5-step chain where each step feeds into the next (output in tabs) |

### Output Actions

| Button | What It Does |
|--------|-------------|
| **Copy MD** | Copies the current output as markdown to clipboard |
| **Save MD** | Opens a save dialog to save as a `.md` file |
| **Export to Folder** | Saves each chain tab as a separate `.md` file in a chosen folder |
| **Copy Agent Prompts** | (AGENT mode only) Copies just the prompt text for pasting into CLI tools |
| **Toggle Edit** | Enables inline editing of the output textarea (keyboard shortcut: Cmd+E) |
| **Toggle Graph** | Shows a D3 force-directed dependency graph of chain output |
| **Re-chain from here** | (Chain mode) Regenerates all steps after the current tab |

### Project History

| Button | What It Does |
|--------|-------------|
| **Save Current** | Saves the current input + output + mode to local SQLite database |
| **History items** | Click any saved project to restore its input, output, mode, and stack |

---

## Mode-Specific UI

Some modes show extra input fields:

- **ANALYZE** — Shows a "Select Project Folder" button. Pick a local project directory and the compiler will scan its structure, dependencies, and code patterns.

- **COMPETE** — Shows a "Competitor URL" text field. Paste a website URL (e.g., `https://linear.app`), App Store link, or GitHub URL. The compiler fetches and analyzes the product.

- **DESIGN** — Shows a "Reference Image" drag-and-drop zone. Upload an inspiration image and the compiler will analyze it as part of the design brief.

- **AUDIT** — If chain output exists from a previous Chain run, a notice appears: "Chain output detected — will audit your full chain." The audit cross-references all 5 documents for contradictions and gaps.

---

## Chain Generate Workflow

The Chain is the flagship feature. It builds a complete product spec in 5 steps:

```
PRD (requirements)
 └──▶ ARD (architecture) — receives PRD as context
       └──▶ TRD (technical) — receives PRD + ARD
             └──▶ TASKS (backlog) — receives PRD + ARD + TRD
                   └──▶ AGENT (prompts) — receives all above
```

After chain completes:
1. **Tab bar** appears above the output — click tabs to view each document
2. **Toggle Graph** shows a visual dependency map of all components across documents
3. **Export to Folder** saves 5 separate files: `PRD.md`, `ARD.md`, `TRD.md`, `TASKS.md`, `AGENT.md`
4. **Re-chain from here** lets you regenerate from a midpoint (e.g., keep PRD+ARD, redo TRD onward)

---

## Stats Bar

The header shows two stats after each generation:

- **Clock icon + time** — How long the generation took
- **Bar chart icon + tokens** — Token count used by Claude

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Cmd + E** | Toggle inline editing of output |
| **Cmd + Enter** | Generate output (same as clicking Generate) |

---

## Tips

- **Start with ADVISOR** if you are unsure which stack to use. It analyzes your idea and ranks all 12 presets.
- **Chain first, Audit second.** Run a full chain, then switch to AUDIT mode and generate to get a quality review of your entire spec.
- **COMPETE for inspiration.** Even if you are not building a competitor, analyzing an existing product gives you a feature checklist and market context.
- **Save often.** Click "Save Current" after each good generation. History persists between app launches.
- **Edit before exporting.** Use Cmd+E to toggle editing, refine the output, then export. The "Reset" button restores the original if you want to start over.
- **Use verticals when they fit.** They add significant depth (multi-tenancy patterns for SaaS, CRDT strategies for local-first, inference pipelines for AI tooling).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Output shows "Not specified" for many fields | Schema mismatch — likely a bug, please report |
| Generate button spins but no output appears | Check your internet connection; the compiler calls Claude API via CLI |
| "Script not found" error | The app bundle may be corrupt; re-run `npm run tauri:build` and reinstall |
| COMPETE shows empty competitor info | URL may be unreachable or behind a login wall; try a public URL |
| ANALYZE shows nothing | Make sure you selected a folder with actual code files (not an empty directory) |
| Graph doesn't render | Run Chain Generate first; the graph requires multi-document output |
| "Project history unavailable" in status bar | SQLite plugin failed to load; restart the app |
| Save button does nothing | Wait a few seconds after app launch for the database to initialize |

---

## Requirements

- **macOS** (Apple Silicon or Intel)
- **Claude CLI** installed and authenticated (`claude --print` must work in terminal)
- **Internet connection** for AI generation
- **curl** (pre-installed on macOS) for COMPETE mode URL fetching
