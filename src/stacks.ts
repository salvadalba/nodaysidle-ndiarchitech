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
        ],
    },

    {
        id: "astro-site",
        name: "Astro 5 Static Site",
        description: "Lightning-fast marketing sites, portfolios, blogs, and docs",
        frontend: [
            "Astro 5",
            "React/Svelte islands (optional)",
            "Tailwind CSS 4",
            "View Transitions API",
        ],
        backend: ["Static (SSG)", "Hybrid SSR (optional)"],
        database: ["Astro Content Collections", "Markdown/MDX"],
        notes: [
            "Zero JS by default, islands for interactivity",
            "Built-in image optimization",
            "Perfect Lighthouse scores",
            "Netlify/Vercel/Cloudflare Pages deploy",
            "SEO and Open Graph meta built-in",
        ],
    },

    {
        id: "landing-page",
        name: "Modern Landing Page",
        description: "High-conversion landing page with animations and premium design",
        frontend: [
            "Vite 6",
            "TypeScript",
            "Vanilla CSS (custom properties)",
            "GSAP / Lenis (smooth scroll)",
            "View Transitions API",
        ],
        backend: ["None (static)", "Formspree/Netlify Forms (contact)"],
        database: ["None"],
        notes: [
            "No framework overhead, pure performance",
            "Scroll-triggered animations",
            "Intersection Observer for reveals",
            "CSS @layer for organization",
            "Dark mode with prefers-color-scheme",
            "Single HTML file deployment possible",
        ],
    },

    {
        id: "premium-webapp",
        name: "Premium Web App",
        description: "Design-first interactive web app with animations and glassmorphism",
        frontend: [
            "Vite 6",
            "React 19",
            "Tailwind CSS 4",
            "Framer Motion",
            "Radix UI primitives",
        ],
        backend: ["Hono (lightweight)", "Cloudflare Workers"],
        database: ["Turso (libSQL)", "D1 (Cloudflare)"],
        notes: [
            "Edge-first deployment",
            "Glassmorphism and blur effects",
            "Micro-interactions on every element",
            "60fps animations",
            "Mobile-responsive with touch gestures",
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
]