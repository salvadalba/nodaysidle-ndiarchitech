export function renderANALYZE(data: Record<string, unknown>): string {
  const projectName = (data.project_name as string) ?? "Unknown Project"
  const stack = (data.detected_stack as any) ?? {}
  const prd = (data.inferred_prd as any) ?? {}
  const arch = (data.inferred_architecture as any) ?? {}
  const tasks = Array.isArray(data.inferred_tasks) ? data.inferred_tasks : []
  const fileStructure = (data.file_structure_summary as string) ?? ""
  const health = (data.health_indicators as any) ?? {}
  const recommendations = Array.isArray(data.recommendations) ? data.recommendations : []

  const lines: string[] = []

  lines.push(`# Project Analysis: ${projectName}`)
  lines.push("")

  // Detected Stack
  lines.push("## Detected Tech Stack")
  lines.push("")

  const stackSections = ["frontend", "backend", "database", "build_tools", "other"]
  for (const section of stackSections) {
    const items = Array.isArray(stack[section]) ? stack[section] : []
    if (items.length > 0) {
      lines.push(`**${section.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}:** ${items.join(", ")}`)
    }
  }
  lines.push("")
  lines.push("---")
  lines.push("")

  // Health Indicators
  lines.push("## Health Indicators")
  lines.push("")
  lines.push(`| Indicator | Status |`)
  lines.push(`|-----------|--------|`)
  lines.push(`| Tests | ${health.has_tests ? "✅ Yes" : "❌ No"} |`)
  lines.push(`| CI/CD | ${health.has_ci ? "✅ Yes" : "❌ No"} |`)
  lines.push(`| Documentation | ${health.has_docs ? "✅ Yes" : "❌ No"} |`)
  lines.push(`| Linting | ${health.has_linting ? "✅ Yes" : "❌ No"} |`)
  if (health.dependency_count !== undefined) {
    lines.push(`| Dependencies | ${health.dependency_count} |`)
  }
  lines.push("")
  lines.push("---")
  lines.push("")

  // Inferred PRD
  lines.push("## Inferred Product Requirements")
  lines.push("")
  if (prd.product_vision) {
    lines.push(`**Vision:** ${prd.product_vision}`)
    lines.push("")
  }
  if (Array.isArray(prd.core_features) && prd.core_features.length > 0) {
    lines.push("**Core Features:**")
    for (const f of prd.core_features) lines.push(`- ${f}`)
    lines.push("")
  }
  if (Array.isArray(prd.target_users) && prd.target_users.length > 0) {
    lines.push(`**Target Users:** ${prd.target_users.join(", ")}`)
    lines.push("")
  }
  lines.push("---")
  lines.push("")

  // Inferred Architecture
  lines.push("## Inferred Architecture")
  lines.push("")
  if (arch.pattern) {
    lines.push(`**Pattern:** ${arch.pattern}`)
    lines.push("")
  }
  if (Array.isArray(arch.components) && arch.components.length > 0) {
    lines.push("**Components:**")
    lines.push("")
    for (const comp of arch.components) {
      const c = comp as any
      lines.push(`- **${c.name ?? "?"}** — ${c.role ?? "unknown role"} *(${c.tech ?? ""})*`)
    }
    lines.push("")
  }
  if (arch.data_flow) {
    lines.push(`**Data Flow:** ${arch.data_flow}`)
    lines.push("")
  }
  lines.push("---")
  lines.push("")

  // Inferred Tasks
  if (tasks.length > 0) {
    lines.push("## Inferred Backlog")
    lines.push("")

    for (const epic of tasks) {
      const e = epic as any
      lines.push(`### ${e.epic ?? "Untitled Epic"}`)
      if (Array.isArray(e.tasks)) {
        for (const t of e.tasks) lines.push(`- [ ] ${t}`)
      }
      lines.push("")
    }

    lines.push("---")
    lines.push("")
  }

  // File Structure
  if (fileStructure) {
    lines.push("## File Structure")
    lines.push("")
    lines.push("```")
    lines.push(fileStructure)
    lines.push("```")
    lines.push("")
    lines.push("---")
    lines.push("")
  }

  // Recommendations
  if (recommendations.length > 0) {
    lines.push("## Recommendations")
    lines.push("")
    for (const r of recommendations) lines.push(`- ${r}`)
    lines.push("")
  }

  return lines.join("\n")
}
