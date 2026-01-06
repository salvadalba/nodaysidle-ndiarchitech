export interface StackPreset {
    id: string
    name: string
    description: string
    frontend: string[]
    backend: string[]
    database: string[]
    notes?: string[]
}

export const STACK_PRESETS: StackPreset[] = [
    {
        id: "modern-web",
        name: "Modern Web App",
        description: "General-purpose modern web application",
        frontend: ["React", "Tailwind CSS"],
        backend: ["Node.js", "REST API"],
        database: ["PostgreSQL"],
    },
    {
        id: "content-platform",
        name: "Content Platform / CMS",
        description: "Blogs, publishing platforms, content-heavy apps",
        frontend: ["Next.js", "Tailwind CSS"],
        backend: ["Node.js", "Headless CMS"],
        database: ["PostgreSQL"],
        notes: ["SEO-first", "Server-side rendering preferred"],
    },
    {
        id: "ml-lite",
        name: "ML / Recommendation Engine (Lightweight)",
        description: "Simple ML or rule-based recommendation systems",
        frontend: ["React"],
        backend: ["Python API", "FastAPI"],
        database: ["PostgreSQL"],
        notes: ["Content-based recommendations only"],
    },

    // ✅ Recommended preset for your current Tauri + Vite tool
    {
        id: "tauri-localfirst",
        name: "Tauri Local-First",
        description: "Tauri + Vite app with Rust commands and SQLite (no server)",
        frontend: ["Vite", "TypeScript", "Vanilla DOM UI (current)", "Tailwind CSS (optional)"],
        backend: ["Tauri (Rust commands)"],
        database: ["SQLite (rusqlite + FTS5)"],
        notes: [
            "Local-first: no Express, no Postgres, no ports",
            "Use Tauri commands for CRUD + search",
            "Use SQLite FTS5 for full-text search",
        ],
    },
    {
        id: "realtime-collab",
        name: "Realtime Collaboration",
        description: "Multiplayer apps using Websockets",
        frontend: ["React", "Tailwind CSS", "Zustand"],
        backend: ["Node.js", "Socket.io"],
        database: ["Redis (ephemeral)", "PostgreSQL (persistent)"],
        notes: ["Optimistic UI updates", "Websocket events over REST"],
    },
]