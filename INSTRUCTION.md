# nodaysidle - User Instructions

## What is nodaysidle?

A **PRD Compiler** that transforms your project idea into complete documentation using AI:

- **PRD** - Product Requirements Document
- **ARD** - Architecture Requirements Document
- **TRD** - Technical Requirements Document
- **TASKS** - Epics + User Stories + Tasks
- **AGENT** - AI Agent Prompts for coding assistants

---

## Quick Start

1. **Select Tech Stack Preset** - Choose the stack that matches your project
2. **Enter Project Idea** - Describe what you want to build
3. **Generate** - Click "Generate Output" for single doc, or:
   - **Generate All** - All 5 docs at once
   - **⛓️ Chain** - Smart chained generation (each doc feeds into next)
4. **Export** - Save to folder as separate `.md` files

---

## Tech Stack Presets

| Preset | Best For |
|--------|----------|
| **Modern Web App** | React + Node + PostgreSQL sites |
| **Content Platform** | Blogs, CMS, SEO-focused |
| **ML Lite** | Recommendation engines |
| **Tauri Local-First** | Desktop apps (macOS/Win/Linux) |
| **Realtime Collab** | Chat, multiplayer, WebSockets |
| **Native Swift (macOS)** | macOS menu bar apps, CoreML |
| **Native Android (Kotlin)** | Android APKs, Jetpack Compose |
| **Native Swift (iOS)** | iPhone/iPad apps |
| **Flutter** | Cross-platform mobile |
| **CLI Tool (Rust)** | Command-line utilities |
| **Chrome Extension** | Browser extensions |
| **API Backend** | REST/GraphQL servers |

---

## Features

### 📁 Project History

- Auto-saves your compilations
- Click to reload any past project
- Delete old entries

### 📚 Templates

- Pre-filled examples per stack
- Quick-start your ideas

### ⏱️ Stats Display

- Generation time
- Estimated token count

### ⛓️ Chain Mode

- PRD → ARD → TRD → TASKS → AGENT
- Each step feeds into the next
- More coherent documentation

---

## Tips

1. **Be specific** - "A note-taking app" vs "A markdown note app with folder organization, full-text search, and tag filtering"

2. **Match your stack** - Choose the right preset for faster, more focused output

3. **Use Chain Mode** - For complete projects, chain mode creates more coherent docs

4. **Export to Folder** - After "Generate All", export creates 5 separate `.md` files

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Generate | Click button |
| Copy Output | Click "Copy MD" |
| Save | Click "Save MD" |

---

## Requirements

- **macOS** (native app)
- **Claude CLI** installed (`claude` command available)
- **jq** installed (`brew install jq`)

---

## Troubleshooting

### "Invalid JSON from Claude"

- Try again - sometimes Claude truncates long outputs
- Use a more specific preset
- Simplify your project description

### "Tauri not detected"

- Run with `npx tauri dev` for development

### Save/Export fails

- Check file permissions
- Try a different folder

---

Built with 🔴⚫ by nodaysidle
