# PRD Compiler + Cursor Integration Guide

> Turn your ideas into structured, well-planned apps using the PRD Compiler + Cursor combo.

---

## Quick Start (3 Steps)

```bash
# 1. Create project and copy cursor rules
mkdir ~/projects/my-app
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/my-app/

# 2. Generate docs (wait 2-5 min)
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain "YOUR IDEA HERE" --stack STACK_ID --output ~/projects/my-app/docs

# 3. Open Cursor and start building
cursor ~/projects/my-app
# Then Cmd+L → "Read the docs in ./docs/ and implement the app following TASKS.md"
```

---

## Available Stacks

| Stack ID | Best For | Example Prompt |
|----------|----------|----------------|
| `swift-macos` | Native macOS apps | "A Notion-like notes app for Mac" |
| `swift-macos-utility` | Menu bar utilities | "A clipboard manager in the menu bar" |
| `swift-ios` | iPhone/iPad apps | "A habit tracker with widgets" |
| `kotlin-android` | Native Android apps | "A meditation app for Android" |
| `flutter-mobile` | Cross-platform mobile | "A budgeting app for iOS and Android" |
| `nextjs-fullstack` | Web apps with backend | "A project management SaaS" |
| `astro-site` | Marketing sites, blogs | "A portfolio website with blog" |
| `tauri-localfirst` | Cross-platform desktop | "A markdown editor for Mac/Win/Linux" |
| `cli-tool` | Command-line tools | "A CLI to manage git worktrees" |
| `realtime-app` | Collaborative apps | "A multiplayer whiteboard" |
| `minimal-browser` | Custom browsers | "A minimal browser with ad blocking" |

---

## Stack-by-Stack Guide

### 🍎 swift-macos (Native macOS App)

**Perfect for:** Notes apps, productivity tools, creative software, utilities with rich UI

**Tech stack:**
- SwiftUI 6 + Swift 6
- SwiftData for persistence
- CloudKit for optional sync
- CoreML for on-device AI

**Example workflow:**

```bash
# Create project
mkdir ~/projects/bear-killer
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/bear-killer/

# Generate docs
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A notes app better than Bear: markdown editor, tags, folders, wiki-links, full-text search, focus mode, iCloud sync, beautiful minimal UI" \
  --stack swift-macos \
  --output ~/projects/bear-killer/docs

# Open in Cursor
cursor ~/projects/bear-killer
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement the app following TASKS.md. Create an Xcode project structure with SwiftUI."

---

### 🔧 swift-macos-utility (Menu Bar App)

**Perfect for:** Clipboard managers, system monitors, quick launchers, status bar tools

**Tech stack:**
- SwiftUI 6 + MenuBarExtra
- AppKit integration
- Global keyboard shortcuts
- UserDefaults/Keychain storage

**Example workflow:**

```bash
mkdir ~/projects/clipboard-pro
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/clipboard-pro/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A clipboard manager: lives in menu bar, stores clipboard history, search, favorites, keyboard shortcuts, syncs via iCloud" \
  --stack swift-macos-utility \
  --output ~/projects/clipboard-pro/docs

cursor ~/projects/clipboard-pro
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this menu bar app following TASKS.md. Use MenuBarExtra for the UI."

---

### 📱 swift-ios (Native iOS App)

**Perfect for:** iPhone apps, iPad apps, apps with widgets, Apple Watch companion

**Tech stack:**
- SwiftUI 6 + iOS 18
- SwiftData + CloudKit
- WidgetKit for home screen widgets
- App Intents for Siri/Shortcuts

**Example workflow:**

```bash
mkdir ~/projects/habit-tracker
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/habit-tracker/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A habit tracker: daily habits with streaks, reminders, home screen widget showing today's progress, statistics, iCloud sync" \
  --stack swift-ios \
  --output ~/projects/habit-tracker/docs

cursor ~/projects/habit-tracker
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this iOS app following TASKS.md. Include the WidgetKit extension."

---

### 🤖 kotlin-android (Native Android App)

**Perfect for:** Android-only apps, apps needing deep Android integration

**Tech stack:**
- Jetpack Compose + Material 3
- Kotlin 2 + Coroutines
- Room database
- Hilt for dependency injection

**Example workflow:**

```bash
mkdir ~/projects/meditation-android
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/meditation-android/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A meditation app: guided meditations, timer, breathing exercises, daily reminders, progress tracking, Material 3 design" \
  --stack kotlin-android \
  --output ~/projects/meditation-android/docs

cursor ~/projects/meditation-android
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this Android app following TASKS.md. Use Jetpack Compose with Material 3."

---

### 🦋 flutter-mobile (Cross-Platform Mobile)

**Perfect for:** Apps for both iOS and Android from one codebase

**Tech stack:**
- Flutter 3.24+ + Dart 3
- Material 3 + Cupertino widgets
- Riverpod state management
- Drift (SQLite) for local data

**Example workflow:**

```bash
mkdir ~/projects/budget-app
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/budget-app/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A budgeting app: track expenses, categories, monthly budgets, charts, recurring transactions, export to CSV, works offline" \
  --stack flutter-mobile \
  --output ~/projects/budget-app/docs

cursor ~/projects/budget-app
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this Flutter app following TASKS.md. Use Riverpod for state management."

---

### 🌐 nextjs-fullstack (Web App with Backend)

**Perfect for:** SaaS apps, dashboards, apps needing user auth and database

**Tech stack:**
- Next.js 15 + React 19
- Tailwind CSS 4 + shadcn/ui
- Server Actions + Prisma
- PostgreSQL + Auth.js

**Example workflow:**

```bash
mkdir ~/projects/project-manager
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/project-manager/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A project management app: workspaces, projects, tasks with drag-drop kanban, team members, due dates, comments, file attachments" \
  --stack nextjs-fullstack \
  --output ~/projects/project-manager/docs

cursor ~/projects/project-manager
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this Next.js app following TASKS.md. Use App Router, Server Actions, and Prisma."

---

### 🚀 astro-site (Static Website)

**Perfect for:** Marketing sites, portfolios, blogs, documentation, landing pages

**Tech stack:**
- Astro 5 + React islands
- Tailwind CSS 4
- Markdown/MDX content
- View Transitions API

**Example workflow:**

```bash
mkdir ~/projects/portfolio
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/portfolio/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A developer portfolio: hero section, projects showcase, blog with MDX, contact form, dark mode, smooth scroll animations" \
  --stack astro-site \
  --output ~/projects/portfolio/docs

cursor ~/projects/portfolio
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this Astro site following TASKS.md. Use Tailwind and View Transitions."

---

### 🖥️ tauri-localfirst (Cross-Platform Desktop)

**Perfect for:** Desktop apps for Mac/Windows/Linux, local-first apps, file-based tools

**Tech stack:**
- Tauri 2 + Rust backend
- Vite + React/TypeScript frontend
- SQLite with FTS5 search
- Native OS integrations

**Example workflow:**

```bash
mkdir ~/projects/markdown-editor
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/markdown-editor/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A markdown editor: file browser, live preview, syntax highlighting, vim mode, themes, export to PDF, works offline" \
  --stack tauri-localfirst \
  --output ~/projects/markdown-editor/docs

cursor ~/projects/markdown-editor
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this Tauri app following TASKS.md. Use React for the frontend."

---

### ⌨️ cli-tool (Command-Line Tool)

**Perfect for:** Developer tools, automation scripts, system utilities

**Tech stack:**
- Rust + clap for argument parsing
- indicatif for progress bars
- colored for terminal output
- Cross-platform binary

**Example workflow:**

```bash
mkdir ~/projects/git-worktree-cli
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/git-worktree-cli/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A CLI to manage git worktrees: create, list, switch, delete worktrees, fuzzy search, shell completions" \
  --stack cli-tool \
  --output ~/projects/git-worktree-cli/docs

cursor ~/projects/git-worktree-cli
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this Rust CLI following TASKS.md. Use clap for argument parsing."

---

### ⚡ realtime-app (Collaborative/Multiplayer)

**Perfect for:** Multiplayer apps, collaborative tools, live dashboards

**Tech stack:**
- React 19 + Tailwind
- PartyKit / Cloudflare Durable Objects
- Yjs CRDTs for sync
- WebSocket-first architecture

**Example workflow:**

```bash
mkdir ~/projects/whiteboard
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/whiteboard/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A collaborative whiteboard: real-time drawing, shapes, text, sticky notes, multiple cursors, presence indicators, rooms" \
  --stack realtime-app \
  --output ~/projects/whiteboard/docs

cursor ~/projects/whiteboard
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this realtime app following TASKS.md. Use PartyKit for WebSocket sync."

---

### 🌍 minimal-browser (Custom Browser)

**Perfect for:** Privacy-focused browsers, specialized browsing tools

**Tech stack:**
- Tauri 2 + WebView
- Rust + adblock-rust
- SQLite for bookmarks/history
- WebKitGTK/WebView2

**Example workflow:**

```bash
mkdir ~/projects/zen-browser
cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor ~/projects/zen-browser/

cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \
  "A minimal browser: tabs, URL bar, built-in ad blocker, bookmarks, history, keyboard shortcuts, no telemetry" \
  --stack minimal-browser \
  --output ~/projects/zen-browser/docs

cursor ~/projects/zen-browser
```

**Cursor prompt:**
> "Read the docs in ./docs/ and implement this browser following TASKS.md. Use Tauri with adblock-rust."

---

## Tips for Best Results

### 1. Be Specific in Your Idea

❌ Bad: "A notes app"

✅ Good: "A notes app with markdown editing, live preview, #tags, [[wiki-links]], full-text search, folder organization, focus mode, and iCloud sync"

### 2. Mention Key Differentiators

Tell the compiler what makes your app special:
- "better than Bear.app"
- "faster than Notion"
- "privacy-focused, no cloud"
- "works offline"

### 3. Let the Compiler Finish

The `chain` command takes 2-5 minutes. Don't interrupt it. You'll get 5 documents that build on each other.

### 4. Review Before Cursor Codes

After docs are generated, quickly scan:
- `PRD.md` - Is the vision correct?
- `ARD.md` - Does the architecture make sense?
- `TASKS.md` - Are the tasks in the right order?

### 5. Use the Right Cursor Prompt

Always start with:
> "Read the docs in ./docs/ and implement the app following TASKS.md"

Cursor will:
1. Read all 5 documents
2. Create a todo list from TASKS.md
3. Implement systematically

---

## Troubleshooting

### "Command timed out" in Cursor

The chain command takes too long for Cursor's timeout. Solution:

1. Run the compiler **in your terminal** (not through Cursor)
2. Wait for it to finish
3. Then tell Cursor to read the existing docs

### "Stack not found"

Check available stacks:
```bash
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts stacks
```

### Cursor ignores the docs

Make sure you copied the `.cursor/rules/` folder:
```bash
ls -la ~/projects/my-app/.cursor/rules/
# Should show prd-compiler.mdc
```

---

## Quick Reference Card

```bash
# List all stacks
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts stacks

# Show stack details
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts stack swift-macos

# Generate single doc (faster, ~30 sec)
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts generate "idea" --mode prd --stack swift-macos -o ./docs/PRD.md

# Generate all docs chained (2-5 min)
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain "idea" --stack swift-macos --output ./docs

# Generate image prompts
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts image "description"

# Generate video prompts
cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts video "description"
```

---

## Shell Alias (Optional)

Add to your `~/.zshrc` for quick project creation:

```bash
# Create new project with PRD Compiler + Cursor
new-project() {
  mkdir -p "$1"
  cp -r /Volumes/omarchyuser/projects/prd-compiler/cursor-template/.cursor "$1/"
  echo "✅ Created $1 with Cursor rules"
  echo "📝 Now run: cd /Volumes/omarchyuser/projects/prd-compiler && npx tsx src/cli.ts chain \"YOUR IDEA\" --stack STACK_ID --output $1/docs"
}
```

Usage:
```bash
new-project ~/projects/my-awesome-app
```

---

Made with ❤️ by your PRD Compiler
