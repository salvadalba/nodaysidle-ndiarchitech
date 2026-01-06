# 🛠️ Tech Stack Preset Cheatsheet

Quick reference for choosing the right stack in your PRD Compiler.

---

## 📊 Stack Overview

| Preset | Best For | Deploys To | Needs Server? |
|--------|----------|------------|---------------|
| **Modern Web App** | SaaS, dashboards, web apps | Vercel/Railway | ✅ Yes |
| **Content Platform** | Blogs, docs, portfolios | Vercel | ✅ Yes (SSR) |
| **ML Lite** | Recommendations, AI features | Railway/Render | ✅ Yes (Python) |
| **Tauri Local-First** | Desktop apps, offline tools | `.app` / `.exe` | ❌ No |
| **Realtime Collab** | Chat, multiplayer, live updates | Railway | ✅ Yes (WebSocket) |

---

## 🎯 When to Use Each

### 🌐 Modern Web App

```
Use when: Building a typical web application
```

- **Examples**: SaaS dashboard, admin panel, e-commerce, booking system
- **Stack**: React + Node.js + PostgreSQL
- **Deploys**: Vercel (frontend) + Railway/Render (backend)
- **Good for**: Most web projects that need user auth, CRUD, API

---

### 📝 Content Platform / CMS

```
Use when: Content is king, SEO matters
```

- **Examples**: Blog, documentation site, news site, portfolio
- **Stack**: Next.js + Headless CMS + PostgreSQL
- **Deploys**: Vercel (full-stack)
- **Good for**: When Google indexing matters, static pages + dynamic content
- **Key feature**: Server-side rendering (SSR), fast page loads

---

### 🤖 ML / Recommendation Engine (Lite)

```
Use when: Need Python/AI but keep it simple
```

- **Examples**: Product recommendations, content suggestions, similarity search
- **Stack**: React + FastAPI (Python) + PostgreSQL
- **Deploys**: Railway/Render (Python backend)
- **Good for**: Adding AI/ML features without going overboard
- **Note**: For heavy ML, consider cloud ML services instead

---

### 🖥️ Tauri Local-First

```
Use when: Building a DESKTOP app that works offline
```

- **Examples**: Note-taking app, local tools, productivity apps, this PRD Compiler!
- **Stack**: Vite + TypeScript + Tauri (Rust) + SQLite
- **Deploys**: `.app` (macOS), `.exe` (Windows), `.deb` (Linux)
- **Good for**: Privacy-focused, no cloud, fast native apps
- **Key feature**: NO SERVER needed, data stays local

---

### ⚡ Realtime Collaboration

```
Use when: Multiple users need live updates
```

- **Examples**: Chat app, multiplayer game, collaborative editor, live dashboard
- **Stack**: React + Socket.io + Redis + PostgreSQL
- **Deploys**: Railway (WebSocket-capable)
- **Good for**: When users need to see each other's changes instantly
- **Key feature**: WebSockets for real-time bidirectional communication

---

## 🔄 Decision Flowchart

```
Is it a desktop app?
├─ YES → Tauri Local-First
└─ NO → Continue...

Does it need real-time features (chat, live updates)?
├─ YES → Realtime Collab
└─ NO → Continue...

Is SEO/content the main focus?
├─ YES → Content Platform
└─ NO → Continue...

Does it need Python/ML?
├─ YES → ML Lite
└─ NO → Modern Web App
```

---

## 💡 Pro Tips

| Tip | Why |
|-----|-----|
| **Start with Modern Web App** | It's the safest default for most projects |
| **Use Tauri for privacy** | No server = no data breaches |
| **Content Platform for portfolios** | SSR = better Google rankings |
| **Realtime only if needed** | WebSockets add complexity |
| **ML Lite over heavy ML** | Keep it simple unless you really need GPUs |

---

## 🚫 Common Mistakes

| Mistake | What to do instead |
|---------|---------------------|
| Using Realtime for a simple CRUD app | Use Modern Web App |
| Using ML stack without AI features | Use Modern Web App |
| Building a web app when desktop makes sense | Use Tauri Local-First |
| Using Content Platform for an interactive app | Use Modern Web App |

---

*Created for nodaysidle PRD Compiler* 🔴⚫
