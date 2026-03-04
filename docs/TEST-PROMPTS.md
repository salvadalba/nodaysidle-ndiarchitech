# NODAYSIDLE v0.5.0 — Test Prompts

Use these prompts to smoke-test every compiler mode and stack preset combination.
Each test has: **Mode**, **Stack**, **Vertical** (if applicable), and the **prompt to paste**.

---

## Core Chain Modes (PRD → ARD → TRD → TASKS → AGENT)

### Test 1: PRD — Product Requirements
- **Stack:** Next.js 15 Full Stack
- **Vertical:** SaaS Dashboard
- **Prompt:**
```
A project management tool for freelance designers. Track client projects, invoices, deadlines, and deliverables. Kanban board view, time tracking, and PDF invoice generation. Stripe integration for payments.
```

### Test 2: ARD — Architecture Requirements
- **Stack:** Tauri 2 Desktop App
- **Vertical:** Local-First Productivity
- **Prompt:**
```
An offline-first markdown note editor with bidirectional linking, daily journals, graph view of connections, and local SQLite storage. Sync between devices via CRDTs when online.
```

### Test 3: TRD — Technical Requirements
- **Stack:** Native macOS App
- **Vertical:** AI Tooling
- **Prompt:**
```
A native macOS clipboard manager that uses on-device ML to auto-categorize clips (code, URLs, text, images), supports regex search, and has a global hotkey for quick paste. Stores last 10,000 clips in CoreData.
```

### Test 4: TASKS — Epics + Tasks
- **Stack:** Flutter Cross-Platform
- **Vertical:** None
- **Prompt:**
```
A habit tracker app with streaks, daily reminders, weekly/monthly analytics charts, social accountability groups, and widget support on both iOS and Android.
```

### Test 5: AGENT — CLI Agent Prompts
- **Stack:** CLI Tool
- **Vertical:** None
- **Prompt:**
```
A CLI tool that reads a GitHub repo URL, clones it, analyzes the codebase structure, and generates a CLAUDE.md file with project conventions, architecture notes, and coding style guidelines.
```

---

## Creative Modes

### Test 6: IMAGE — AI Image Prompts
- **Stack:** (any, not used)
- **Prompt:**
```
A sleek productivity app icon for macOS. Glass morphism style, dark background, a stylized compass or north star motif. Minimal, premium feel. Should look great at 1024x1024 and scale down to 16x16 cleanly.
```

### Test 7: VIDEO — AI Video Prompts
- **Stack:** (any, not used)
- **Prompt:**
```
A 15-second product launch trailer for a new AI writing assistant. Show a writer staring at a blank page, then the app UI appears and words flow effortlessly. Transition to a montage of different writing scenarios. End with the logo reveal on a dark gradient.
```

### Test 8: DESIGN — Cultural Design Prompts
- **Stack:** (any, not used)
- **Prompt:**
```
A fintech savings app targeting young professionals in Tokyo, Japan. The app helps users save toward travel goals with gamified progress. Needs to feel trustworthy but playful. Consider Japanese design sensibilities and typography.
```

---

## Analysis Modes

### Test 9: ADVISOR — Stack Recommendation
- **Stack:** (ignored — advisor recommends one)
- **Prompt:**
```
I want to build a real-time collaborative whiteboard app. Users can draw, add sticky notes, upload images, and see each other cursors live. Should work on web and iPad. Needs to handle 50+ concurrent users per board. I care most about low latency and smooth drawing performance.
```

### Test 10: AUDIT — Quality & Risk Audit
- **How to test:** Run Chain Generate first (PRD→AGENT) on any project, then switch to AUDIT mode and click Generate. It should auto-detect chain output.
- **Stack:** Next.js 15 Full Stack
- **Prompt (run Chain first with this):**
```
An AI-powered recipe app that generates meal plans based on dietary restrictions, available ingredients (from pantry photo scan), and budget. Includes grocery list generation and nutritional tracking.
```

### Test 11: ANALYZE — Reverse-Engineer Project
- **How to test:** Select ANALYZE mode, click "Select Project Folder", choose a project on your machine (e.g., the prd-compiler itself at `/Volumes/omarchyuser/projects/prd-compiler`).
- **Prompt (optional context):**
```
This is a Tauri desktop app that compiles product requirements documents using AI.
```

### Test 12: COMPETE — Build a Better X
- **Stack:** (any)
- **Test URLs to try:**
```
https://obsidian.md
```
```
https://linear.app
```
```
https://notion.so
```
- **Optional prompt (additional context):**
```
I think their mobile experience is weak and they are missing offline-first sync. I want to build something faster and more focused.
```

---

## Stack Preset Smoke Tests

Quick one-liner prompts to verify each stack preset compiles correctly with PRD mode:

| # | Stack Preset | Prompt |
|---|-------------|--------|
| 1 | Native macOS App | `A menubar weather app that shows 5-day forecast with animated icons` |
| 2 | macOS Utility / Menu Bar App | `A menu bar CPU/RAM monitor with temperature alerts and fan control` |
| 3 | Next.js 15 Full Stack | `A team retrospective board with anonymous voting and action items` |
| 4 | Astro 5 Static Site | `A developer portfolio with blog, project showcase, and RSS feed` |
| 5 | Tauri 2 Desktop App | `A local-first password manager with biometric unlock and TOTP support` |
| 6 | Native iOS App | `A dog walking tracker with GPS routes, photo journal, and vet reminders` |
| 7 | Native Android App | `A bus arrival time app with live GPS tracking and delay notifications` |
| 8 | Flutter Cross-Platform | `A split-the-bill app with receipt OCR scanning and Venmo integration` |
| 9 | CLI Tool | `A CLI that batch-renames files using AI-suggested names from content analysis` |
| 10 | Minimal Browser | `A browser extension that summarizes any article into 3 bullet points` |
| 11 | Realtime Collaborative App | `A live quiz game host platform for classrooms with leaderboards` |
| 12 | Local LLM Runner (MLX) | `A local chatbot that runs Llama 3 on Apple Silicon with RAG over local PDFs` |

---

## Chain Generate Test

**The big one — tests the full pipeline:**

1. Select **Next.js 15 Full Stack** + **SaaS Dashboard** vertical
2. Paste this prompt:
```
A multi-tenant analytics dashboard for e-commerce stores. Each store owner gets their own dashboard showing sales trends, customer segments, product performance, and inventory alerts. Real-time updates via WebSockets. Stripe billing for SaaS tiers (Free, Pro, Enterprise).
```
3. Click **Chain** button
4. Wait for all 5 phases (PRD → ARD → TRD → TASKS → AGENT)
5. Click through each tab to verify output
6. Click **Toggle Graph** to verify D3 visualization
7. Click **Export to Folder** to verify 5 separate .md files
8. Click **Save Current** to verify project history

---

## Generate All Test

1. Select any stack + prompt
2. Click **Generate All** (generates PRD, ARD, TRD, TASKS, AGENT sequentially)
3. Verify textarea shows all 5 sections separated by `---`
4. Click **Save MD** to verify file export

---

## What to Look For (Common Issues)

- **"Not specified" spam** → Schema mismatch between bash script and renderer
- **Empty output** → Script failed silently; check Console for errors
- **"Unknown Entity"** → Renderer field name doesn't match JSON key
- **Graph doesn't render** → Chain output missing `# PRD` headers (fixed in v0.5.0)
- **Save doesn't work** → DB init failed; check status bar for error message (fixed in v0.5.0)
- **COMPETE shows raw JSON** → curl failed to fetch URL; check internet connection
