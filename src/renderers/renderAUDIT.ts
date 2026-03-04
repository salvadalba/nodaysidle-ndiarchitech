export function renderAUDIT(data: Record<string, unknown>): string {
  const summary = (data.summary as any) ?? {}
  const issues = Array.isArray(data.issues) ? data.issues : []
  const strengths = Array.isArray(data.strengths) ? data.strengths : []
  const recommendations = Array.isArray(data.recommendations) ? data.recommendations : []

  const lines: string[] = []

  lines.push("# Chain Audit Report")
  lines.push("")

  // Summary Card
  lines.push("## Summary")
  lines.push("")

  const grade = summary.overall_quality ?? "N/A"
  const total = summary.total_issues ?? issues.length
  const critical = summary.critical ?? 0
  const warning = summary.warning ?? 0
  const info = summary.info ?? 0

  lines.push(`**Overall Quality:** ${grade}`)
  lines.push(`**Total Issues:** ${total} — ${critical} critical, ${warning} warnings, ${info} info`)
  lines.push("")
  lines.push("---")
  lines.push("")

  // Issues
  if (issues.length > 0) {
    lines.push("## Issues Found")
    lines.push("")

    for (const issue of issues) {
      const i = issue as any
      const severity = (i.severity ?? "info").toUpperCase()
      const icon = severity === "CRITICAL" ? "🔴" : severity === "WARNING" ? "🟡" : "🔵"

      lines.push(`### ${icon} ${i.title ?? "Untitled Issue"}`)
      lines.push("")
      lines.push(`**Severity:** ${severity} | **Category:** ${i.category ?? "general"} | **Found in:** ${i.found_in ?? "unknown"}`)
      lines.push("")

      if (i.description) {
        lines.push(i.description)
        lines.push("")
      }

      if (i.suggestion) {
        lines.push(`> **Fix:** ${i.suggestion}`)
        lines.push("")
      }

      if (i.rechain_from && i.rechain_from !== "null") {
        lines.push(`*Re-chain from **${i.rechain_from.toUpperCase()}** to resolve*`)
        lines.push("")
      }
    }

    lines.push("---")
    lines.push("")
  }

  // Strengths
  if (strengths.length > 0) {
    lines.push("## Strengths")
    lines.push("")
    for (const s of strengths) lines.push(`- ✅ ${s}`)
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
