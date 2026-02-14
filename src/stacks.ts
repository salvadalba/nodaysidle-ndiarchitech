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
    // ═══════════════════════════════════════════════════════════════════════════
    // 🍎 macOS NATIVE APPS
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "swift-macos",
        name: "Native macOS App",
        description: "SwiftUI 6 macOS app with SwiftData, on-device ML, and premium design",
        frontend: [
            "SwiftUI 6",
            ".ultraThinMaterial / .regularMaterial",
            "matchedGeometryEffect",
            "PhaseAnimator",
            "TimelineView",
        ],
        backend: ["Swift 6", "Structured Concurrency (async/await)", "Observation framework"],
        database: ["SwiftData", "CloudKit (optional sync)"],
        notes: [
            "macOS 15+ (Sequoia) target",
            "CoreML + NaturalLanguage for on-device AI",
            "Metal shaders for visual effects",
            "Menu bar + Settings scene support",
            "Local-first architecture, no server required",
            "NSWindow customization for premium feel",
        ],
    },

    {
        id: "swift-macos-utility",
        name: "macOS Utility / Menu Bar App",
        description: "Lightweight menu bar utility with keyboard shortcuts and system integration",
        frontend: ["SwiftUI 6", "MenuBarExtra", "Settings scene"],
        backend: ["Swift 6", "AppKit integration", "LaunchAgent"],
        database: ["UserDefaults", "JSON files", "Keychain"],
        notes: [
            "Runs in menu bar, no dock icon",
            "Global keyboard shortcuts via Carbon/AddingMachine",
            "Accessibility API for system control",
            "Login item support",
            "Sandboxed for App Store or notarized for direct distribution",
        ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🌐 WEB DESIGN & DEVELOPMENT
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "nextjs-fullstack",
        name: "Next.js 15 Full Stack",
        description: "Production SaaS with App Router, Server Actions, and Prisma",
        frontend: [
            "Next.js 15 (App Router)",
            "React 19",
            "Tailwind CSS 4",
            "shadcn/ui",
            "Framer Motion",
        ],
        backend: ["Server Actions", "Route Handlers", "Middleware"],
        database: ["PostgreSQL", "Prisma ORM", "Redis (caching)"],
        notes: [
            "React Server Components by default",
            "Partial prerendering for dynamic + static",
            "Vercel or self-hosted deployment",
            "Auth.js for authentication",
            "next/image for optimized images",
            "Glassmorphism and blur effects optional",
            "Micro-interactions and 60fps animations",
        ],
    },

    {
        id: "astro-site",
        name: "Astro 5 Static Site",
        description: "Lightning-fast marketing sites, portfolios, blogs, landing pages, and docs",
        frontend: [
            "Astro 5",
            "React/Svelte islands (optional)",
            "Tailwind CSS 4",
            "View Transitions API",
            "GSAP / Lenis (smooth scroll)",
        ],
        backend: ["Static (SSG)", "Hybrid SSR (optional)", "Formspree/Netlify Forms"],
        database: ["Astro Content Collections", "Markdown/MDX"],
        notes: [
            "Zero JS by default, islands for interactivity",
            "Built-in image optimization",
            "Perfect Lighthouse scores",
            "Netlify/Vercel/Cloudflare Pages deploy",
            "SEO and Open Graph meta built-in",
            "Scroll-triggered animations with Intersection Observer",
            "Dark mode with prefers-color-scheme",
        ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🖥️ DESKTOP APPS (CROSS-PLATFORM)
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "tauri-localfirst",
        name: "Tauri 2 Desktop App",
        description: "Cross-platform desktop app with Rust backend and web frontend",
        frontend: [
            "Vite 6",
            "TypeScript",
            "React or Vanilla",
            "Tailwind CSS 4",
        ],
        backend: ["Tauri 2", "Rust commands", "IPC bridge"],
        database: ["SQLite (rusqlite)", "FTS5 for search"],
        notes: [
            "Local-first: no server, no network required",
            "Native OS integrations via Rust plugins",
            "App bundle size < 10MB",
            "Auto-updater built-in",
            "macOS/Windows/Linux from single codebase",
        ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 📱 MOBILE APPS
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "swift-ios",
        name: "Native iOS App",
        description: "SwiftUI 6 iOS/iPadOS app with SwiftData and modern design",
        frontend: ["SwiftUI 6", "UIKit (bridging)", "Core Animation"],
        backend: ["Swift 6", "Structured Concurrency", "Observation"],
        database: ["SwiftData", "CloudKit (sync)"],
        notes: [
            "iOS 18+ target",
            "CoreML for on-device AI",
            "WidgetKit for home screen widgets",
            "App Intents for Shortcuts/Siri",
            "App Store distribution",
        ],
    },

    {
        id: "kotlin-android",
        name: "Native Android App",
        description: "Jetpack Compose Android app with Material 3 design",
        frontend: ["Jetpack Compose", "Material 3", "Compose Navigation"],
        backend: ["Kotlin 2", "Coroutines", "Hilt (DI)"],
        database: ["Room", "DataStore"],
        notes: [
            "Android 14+ target (API 34)",
            "ML Kit for on-device AI",
            "MVVM with ViewModel",
            "Gradle Kotlin DSL",
            "Play Store distribution",
        ],
    },

    {
        id: "flutter-mobile",
        name: "Flutter Cross-Platform",
        description: "Single codebase for iOS + Android with Material 3",
        frontend: ["Flutter 3.24+", "Material 3", "Cupertino widgets"],
        backend: ["Dart 3", "Riverpod", "Dio"],
        database: ["Drift (SQLite)", "Isar", "SharedPreferences"],
        notes: [
            "Single codebase for iOS + Android",
            "Hot reload development",
            "Platform channels for native code",
            "Firebase optional",
        ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ CLI TOOLS
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "cli-tool",
        name: "CLI Tool",
        description: "Command-line utility with argument parsing and rich terminal output",
        frontend: ["None"],
        backend: ["Rust", "clap (args)", "indicatif (progress)", "colored (output)"],
        database: ["JSON/TOML config", "SQLite (optional)"],
        notes: [
            "Single binary distribution",
            "Shell completions (bash/zsh/fish)",
            "Cross-platform (macOS/Windows/Linux)",
            "Homebrew/cargo install distribution",
            "No runtime dependencies",
        ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🌐 BROWSER
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "minimal-browser",
        name: "Minimal Browser",
        description: "Lightweight Rust browser with built-in adblock",
        frontend: ["Tauri 2 WebView", "Minimal UI (HTML/CSS)", "URL bar + tabs"],
        backend: ["Rust", "adblock-rust (Brave's engine)", "WebView2/WebKitGTK"],
        database: ["SQLite (bookmarks/history)", "JSON config"],
        notes: [
            "Sub-50MB binary size",
            "Built-in adblock, no extensions needed",
            "Privacy-focused: no telemetry",
            "WebKitGTK on Linux (Arch), WebKit on macOS, WebView2 on Windows",
            "Google Search API for address bar suggestions",
        ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚡ REALTIME & COLLABORATION
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "realtime-app",
        name: "Realtime Collaborative App",
        description: "Multiplayer/collaborative apps with live sync",
        frontend: [
            "React 19",
            "Tailwind CSS 4",
            "Zustand",
            "Framer Motion",
        ],
        backend: ["PartyKit", "Cloudflare Durable Objects"],
        database: ["Yjs (CRDT)", "Redis", "PostgreSQL"],
        notes: [
            "WebSocket-first architecture",
            "Optimistic UI updates",
            "Conflict-free sync with CRDTs",
            "Presence indicators",
            "Edge-deployed for low latency",
        ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 🤖 AI & LOCAL INFERENCE
    // ═══════════════════════════════════════════════════════════════════════════

    {
        id: "mlx-llm-runner",
        name: "Local LLM Runner (MLX)",
        description: "Native macOS app for running AI models locally on Apple Silicon",
        frontend: [
            "SwiftUI 6",
            "Markdown rendering (swift-markdown-ui)",
            "Syntax highlighting",
            "StreamingText view",
        ],
        backend: [
            "Swift 6",
            "MLX Swift (apple/mlx-swift)",
            "Structured Concurrency (async/await)",
            "Observation framework",
        ],
        database: [
            "SwiftData (conversations, settings)",
            "File system (model storage ~/Models/)",
        ],
        notes: [
            "macOS 15+ target, Apple Silicon required (M1/M2/M3/M4)",
            "MLX uses unified memory — 16GB RAM can run 7B-13B models",
            "Minimal UI: single window, no heavy frameworks, low memory footprint",
            "Stream tokens to UI for responsive chat experience",
            "Download models from Hugging Face (MLX format)",
            "Support popular models: Llama 3, Mistral, Qwen, Phi",
            "Local-first: no internet required after model download",
            "100% private — no data leaves the device",
            "Lightweight SwiftUI — avoid animations and effects that consume RAM",
            "Lazy loading for conversation history",
        ],
    },
]