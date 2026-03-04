export interface VerticalTemplate {
  id: string
  name: string
  description: string
  promptFragments: {
    prd?: string
    ard?: string
    trd?: string
    tasks?: string
    agent?: string
  }
}

export const VERTICALS: VerticalTemplate[] = [
  {
    id: "saas",
    name: "SaaS Dashboard",
    description: "Multi-tenant SaaS with auth, billing, and admin",
    promptFragments: {
      prd: "Include multi-tenancy requirements. Add user authentication (SSO, OAuth2), role-based access control, subscription billing (Stripe integration), admin dashboard with usage analytics, and team/org management. Consider onboarding flows and self-serve account management.",
      ard: "Architecture must support multi-tenant isolation (shared DB with tenant_id or schema-per-tenant). Include auth service, billing service, notification service, and admin service. Plan for horizontal scaling and tenant-level rate limiting. Include a job queue for async operations (email, billing webhooks).",
      trd: "Add GDPR/SOC2 compliance checklist. Define tenant isolation at database level. Specify Stripe webhook handling, subscription lifecycle events, and usage metering API. Include audit logging for all admin actions. Define rate limiting per tenant tier.",
      tasks: "Include auth setup (OAuth2/SSO provider integration) as first epic. Add billing integration epic (Stripe setup, webhook handlers, subscription management). Include admin dashboard epic (tenant management, usage analytics, user impersonation for support).",
      agent: "Agent should scaffold auth and billing first. Set up Stripe integration early. Include admin seeding scripts for development. Generate multi-tenant database migrations with tenant_id columns and row-level security policies."
    }
  },
  {
    id: "localfirst",
    name: "Local-First Productivity",
    description: "Offline-capable app with sync and encryption",
    promptFragments: {
      prd: "This is a local-first application. All data must work offline by default. Include conflict resolution strategy (CRDTs or OT). Add end-to-end encryption for user data. Sync should be seamless and invisible. Support export/import of all user data. Consider collaborative editing if multi-user.",
      ard: "Architecture must be local-first: all reads/writes hit local storage first. Use CRDTs (e.g., Yjs, Automerge) for conflict-free sync. Include a sync engine layer that handles online/offline transitions. Data must be encrypted at rest locally and in transit. Plan for peer-to-peer sync as fallback.",
      trd: "Specify CRDT library choice and conflict resolution semantics. Define the sync protocol (WebSocket for real-time, HTTP polling fallback). Detail local storage format (SQLite, IndexedDB, or custom). Specify encryption scheme (AES-256-GCM for data at rest, TLS 1.3 for transit). Define data migration strategy for schema changes.",
      tasks: "First epic: local storage engine with CRUD operations working fully offline. Second epic: sync engine with conflict resolution. Third epic: encryption layer (key management, at-rest encryption). Fourth epic: collaborative features if applicable.",
      agent: "Agent should set up local database first and verify offline CRUD works before adding sync. CRDT library should be integrated early. Test offline-first by disabling network during development. Generate encryption key management utilities."
    }
  },
  {
    id: "ai-tooling",
    name: "AI Tooling",
    description: "Local LLM integration, model management, streaming",
    promptFragments: {
      prd: "This is an AI-powered tool. Include local model management (download, load, switch models). Support streaming responses for real-time AI output. Consider GPU/MLX acceleration for Apple Silicon. Add prompt template management. Include usage tracking (tokens, latency). Plan for both local inference and API fallback (OpenAI, Anthropic).",
      ard: "Architecture must support pluggable AI backends: local inference (MLX, llama.cpp, Ollama) and cloud APIs (OpenAI, Anthropic). Include a model manager service for downloading, caching, and loading models. Streaming must flow from inference engine through to UI. Add a prompt/conversation storage layer. Consider memory management for large models.",
      trd: "Specify model loading and memory management strategy. Define the streaming protocol (SSE for cloud, custom for local). Detail model format support (GGUF, MLX, SafeTensors). Include GPU detection and fallback logic. Define the prompt template schema. Specify token counting and context window management.",
      tasks: "First epic: AI backend abstraction layer with local and cloud providers. Second epic: model manager (download, cache, load/unload). Third epic: streaming UI for real-time responses. Fourth epic: prompt template management and conversation history.",
      agent: "Agent should set up the AI abstraction layer first so backends can be swapped. Test with a small local model before optimizing. Include model download progress tracking. Generate streaming response handlers early."
    }
  }
]
