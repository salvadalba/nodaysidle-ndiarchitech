export type CompilerKind = "prd" | "ard" | "trd" | "tasks" | "agent"

export const COMPILERS: { id: CompilerKind; name: string; description: string }[] = [
    { id: "prd", name: "PRD", description: "Product Requirements Document" },
    { id: "ard", name: "ARD", description: "Architecture Requirements Doc" },
    { id: "trd", name: "TRD", description: "Technical Requirements Doc" },
    { id: "tasks", name: "TASKS", description: "Epics + tasks + acceptance criteria" },
    { id: "agent", name: "AGENT", description: "CLI-agent prompts (Claude/Gemini/OpenCode)" },
]