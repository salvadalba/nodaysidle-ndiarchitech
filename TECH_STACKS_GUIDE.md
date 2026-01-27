# NDI - Tech Stack Presets Guide

Complete guide for choosing the right tech stack preset for your project.

---

## Table of Contents

1. [Web Applications](#web-applications)
2. [Mobile & Cross-Platform](#mobile--cross-platform)
3. [Desktop & Native](#desktop--native)
4. [Backend & APIs](#backend--apis)
5. [Specialized Use Cases](#specialized-use-cases)

---

## Web Applications

### Modern Web App
**Best for:** General-purpose web apps, SPA prototypes

**Stack:** React + Tailwind CSS + Node.js + PostgreSQL

**Choose when:**
- You need a standard, battle-tested stack
- Team is familiar with React ecosystem
- Building a typical CRUD web application

**Avoid when:**
- You need SSR for SEO
- Building real-time features

---

### Content Platform / CMS
**Best for:** Blogs, documentation sites, SEO-focused content platforms

**Stack:** Next.js + Headless CMS + PostgreSQL

**Choose when:**
- SEO is critical (blogs, marketing sites)
- Content editors need to manage pages
- Server-side rendering required

**Avoid when:**
- Building highly interactive dashboards
- Real-time collaboration features

---

### Next.js 15 Full Stack ⭐ NEW
**Best for:** Modern SaaS applications with full-stack type safety

**Stack:** Next.js 15 (App Router) + React 19 + tRPC + Prisma + PostgreSQL

**Choose when:**
- Building a SaaS product in 2025
- Want end-to-end type safety (no API code generation)
- Need server components for performance
- Planning Vercel deployment

**Key advantages:**
- RSC reduces client-side JavaScript
- tRPC eliminates API boilerplate
- Prisma provides excellent DX

**Avoid when:**
- You need microservices architecture
- Team has no Next.js experience

---

### Remix Full Stack ⭐ NEW
**Best for:** Web apps with progressive enhancement and form-heavy workflows

**Stack:** Remix + React + Tailwind CSS

**Choose when:**
- Building forms-heavy applications
- Want progressive enhancement (works without JS)
- Need nested routing capabilities
- Prefer conventional web forms over complex state management

**Key advantages:**
- No client-side state needed for most features
- Built-in form handling
- Excellent loading states UX

**Avoid when:**
- Building complex client-side only features
- Need real-time updates (WebSockets)

---

### Astro Static Site ⭐ NEW
**Best for:** Marketing sites, blogs, documentation - content-focused sites

**Stack:** Astro + React/Vue islands + Tailwind CSS

**Choose when:**
- Building content-heavy sites (blogs, docs, landing pages)
- SEO is critical but interactivity is minimal
- Want fastest possible Time to Interactive
- Happy with static HTML for most pages

**Key advantages:**
- Zero JavaScript by default
- Island architecture for interactive components
- Best performance scores out of the box

**Avoid when:**
- Building highly interactive dashboards
- Need server-side API routes

---

### SvelteKit App ⭐ NEW
**Best for:** Lightweight web apps with minimal bundle size

**Stack:** Svelte 5 + SvelteKit + SQLite

**Choose when:**
- Want smallest possible bundle sizes
- Building performant consumer web apps
- Team prefers reactive programming without virtual DOM overhead
- Need server-side rendering optional

**Key advantages:**
- True reactivity (no virtual DOM diffing)
- Compile-time framework (runs at runtime is tiny)
- Great for mobile/constrained devices

**Avoid when:**
- Large enterprise with existing React codebase
- Need extensive plugin ecosystem

---

### Nuxt 3 Full Stack ⭐ NEW
**Best for:** Vue.js ecosystem projects with full-stack capabilities

**Stack:** Nuxt 3 + Vue 3 + Supabase

**Choose when:**
- Team prefers Vue over React
- Building in Vue ecosystem
- Need auto-imports for components/composables
- Want SSR with minimal configuration

**Key advantages:**
- Auto-imports (no import statements needed)
- File-based routing
- Great Vue 3 Composition API support

**Avoid when:**
- Team has no Vue experience
- Need React-specific libraries

---

### Qwik City Resumable ⭐ NEW
**Best for:** Performance-critical apps requiring instant page loads

**Stack:** Qwik + Qwik City + PostgreSQL

**Choose when:**
- Building performance-critical applications
- Want instant page loads without hydration
- Building large-scale apps with many interactive components
- Accept learning curve for resumability paradigm

**Key advantages:**
- Resumability (no hydration needed)
- Fine-grained lazy loading (only code for interaction loads)
- Best Time to Interactive scores

**Avoid when:**
- Small/simple projects (overkill)
- Team unwilling to learn new paradigm

---

### Django + Vue ⭐ NEW
**Best for:** Traditional monolithic web applications

**Stack:** Vue 3 + Django REST + PostgreSQL

**Choose when:**
- Building traditional web applications
- Team prefers Python backend
- Want proven MVC architecture
- Need Django's built-in admin interface

**Key advantages:**
- Django's ORM and admin panel
- JWT authentication built-in
- Batteries included for most web app needs

**Avoid when:**
- Building real-time features
- Need microservices architecture

---

### Go + htmx ⭐ NEW
**Best for:** Minimalist web apps with hypermedia-driven UI

**Stack:** htmx + Alpine.js + Go stdlib + PostgreSQL

**Choose when:**
- Want minimal JavaScript
- Building CRUD apps with server-rendered HTML
- Prefer simple deployment (single binary)
- Team likes Go or wants to avoid Node.js ecosystem complexity

**Key advantages:**
- No build step for frontend
- Single binary deployment
- Low latency server-rendered updates
- Simple to reason about

**Avoid when:**
- Building rich client-side applications
- Need complex interactive UIs

---

---

## Mobile & Cross-Platform

### Flutter (Cross-Platform)
**Best for:** Apps that need to run on both iOS and Android from single codebase

**Stack:** Flutter + Dart + Riverpod + Drift (SQLite)

**Choose when:**
- Building mobile apps for both platforms
- Want near-native performance
- Team accepts Dart learning curve
- Need hot reload for fast development

**Avoid when:**
- Building web-first applications
- Need access to very platform-specific features

---

### Swift (iOS) / Swift (macOS) / Kotlin (Android)
**Best for:** Native mobile or desktop apps with platform-specific features

**Stack:** Native Swift/Kotlin with platform frameworks

**Choose when:**
- Targeting single platform (iOS or Android)
- Need best possible performance and platform integration
- Building apps requiring deep OS integration
- Want best developer experience for that platform

**Avoid when:**
- Need cross-platform with limited budget
- Rapid prototyping across platforms

---

---

## Desktop & Native

### Tauri Local-First
**Best for:** Desktop apps (macOS/Windows/Linux) with local data storage

**Stack:** Tauri + Rust + SQLite

**Choose when:**
- Building desktop applications
- Want local-first (no server, works offline)
- Need Rust performance for critical operations
- Want small bundle sizes compared to Electron

**Key advantages:**
- Much smaller than Electron apps
- Rust backend for performance-critical code
- Cross-platform from single codebase

**Avoid when:**
- Building primarily web applications
- Team has no Rust experience

---

### CLI Tool (Rust)
**Best for:** Command-line utilities and developer tools

**Stack:** Rust + clap + tokio

**Choose when:**
- Building CLI tools for developers
- Performance is critical
- Want single binary distribution
- Building system tools

**Avoid when:**
- Building GUI applications
- Need rapid prototyping (Rust has longer compile times)

---

### Chrome Extension
**Best for:** Browser extensions that enhance web browsing

**Stack:** TypeScript/React + Service Worker + chrome.storage

**Choose when:**
- Building browser extensions
- Need content script injection
- Want cross-browser compatibility

**Avoid when:**
- Building full web applications
- Need desktop capabilities

---

---

## Backend & APIs

### API Backend (Node.js)
**Best for:** REST/GraphQL API servers without frontend

**Stack:** Node.js + Express/Fastify + PostgreSQL + Prisma

**Choose when:**
- Building API-first backend
- Multiple clients will consume the API
- Need OpenAPI/Swagger documentation
- Building microservices

**Avoid when:**
- Need real-time features
- Building simple CRUD (overkill)

---

---

## Real-Time & Collaboration

### Realtime Collab
**Best for:** Apps with WebSockets and multi-user real-time features

**Stack:** React + Socket.io + Node.js + Redis + PostgreSQL

**Choose when:**
- Building chat applications
- Multiplayer games
- Collaborative editing tools
- Need real-time updates across clients

**Key advantages:**
- Optimistic UI updates
- WebSockets for instant updates
- Redis for ephemeral state

**Avoid when:**
- Building traditional CRUD apps
- Real-time features not needed

---

### Elixir + Phoenix ⭐ NEW
**Best for:** Fault-tolerant real-time applications

**Stack:** Phoenix LiveView + Elixir + PostgreSQL

**Choose when:**
- Building real-time applications (chat, presence, collaboration)
- Need fault tolerance and high availability
- Want interactive UIs without writing JavaScript
- Building scalable backend systems

**Key advantages:**
- Real-time by default (channels)
- LiveView for interactivity without JavaScript
- Fault-tolerant distributed systems
- Excellent concurrency model

**Avoid when:**
- Team has no Elixir/Phoenix experience
- Need traditional MVC patterns

---

---

## AI & Machine Learning

### ML / Recommendation Engine
**Best for:** Simple ML or rule-based recommendation systems

**Stack:** React + Python API + FastAPI + PostgreSQL

**Choose when:**
- Building recommendation engines
- Need Python ML ecosystem
- Simple ML models (not deep learning training)

**Avoid when:**
- Building training infrastructure
- Need GPU-based model training

---

### Rust Full Stack (Leptos + Axum) ⭐ NEW
**Best for:** Performance-critical apps where Rust everywhere is acceptable

**Stack:** Leptos (Wasm) + Axum + PostgreSQL + sqlx

**Choose when:**
- Building performance-critical applications
- Team knows and likes Rust
- Want full-stack with same language
- Need memory safety without garbage collection pauses

**Key advantages:**
- Full-stack Rust (no language switching)
- Islands architecture
- SSR + CSR hybrid
- Excellent performance

**Avoid when:**
- Team has no Rust experience
- Rapid prototyping needed (Rust has longer dev cycle)

---

### SolidStart App ⭐ NEW
**Best for:** Reactive applications with fine-grained reactivity

**Stack:** SolidJS + SolidStart + SQLite/Turso

**Choose when:**
- Want reactive programming without virtual DOM overhead
- Need fine-grained reactivity
- Building streaming SSR applications
- Prefer signals over hooks/recontext

**Key advantages:**
- No virtual DOM overhead
- Fine-grained reactivity (only what changes re-renders)
- Streaming SSR
- Excellent performance

**Avoid when:**
- Large React ecosystem dependencies needed
- Team unfamiliar with reactive paradigm

---

## Quick Decision Guide

| Use Case | Recommended Stack |
|----------|------------------|
| SaaS product (2025) | **Next.js 15 Full Stack** |
| SEO-focused content site | **Astro Static Site** |
| Form-heavy web app | **Remix Full Stack** |
| Real-time collaboration | **Elixir + Phoenix** |
| Mobile (iOS + Android) | **Flutter** |
| Desktop app (cross-platform) | **Tauri Local-First** |
| CLI tool | **Rust CLI** |
| Performance is critical | **Qwik City** or **Rust Full Stack** |
| Minimal JS preferred | **Go + htmx** |
| Vue ecosystem | **Nuxt 3** |
| Browser extension | **Chrome Extension** |
| Python ML backend | **ML Lite** |
| API-only backend | **API Backend** |
| Team knows React | **Modern Web App** or **Next.js 15** |
| Team knows Vue | **Nuxt 3** |
| Team knows Python | **Django + Vue** |

---

## Complexity Level

**Beginner-Friendly:**
- Modern Web App (React)
- Content Platform (Next.js)
- API Backend (Node.js)
- Chrome Extension
- Django + Vue

**Intermediate:**
- Tauri Local-First
- Flutter
- Remix Full Stack
- SvelteKit App
- Nuxt 3

**Advanced:**
- Rust Full Stack (Leptos + Axum)
- Qwik City Resumable
- Elixir + Phoenix
- Realtime Collab
- ML Lite (Python API integration)

---

## Notes

- All stacks are production-ready and suitable for building real applications
- Choose based on your team's expertise and project requirements
- Consider long-term maintenance when selecting a stack
- When in doubt, **Next.js 15 Full Stack** is a safe default for most SaaS applications in 2025
