export function renderADVISOR(data: Record<string, unknown>): string {
  const recs = Array.isArray(data.recommendations) ? data.recommendations : []
  const analysis = (data.analysis as any) ?? {}
  const topPick = (data.top_pick_summary as string) ?? ""

  const lines: string[] = []

  lines.push("# Stack Advisor Report")
  lines.push("")

  // Top Pick Summary
  if (topPick) {
    lines.push(`> **Top Pick:** ${topPick}`)
    lines.push("")
  }

  // Analysis Summary
  lines.push("## Project Analysis")
  if (analysis.detected_platform) lines.push(`**Platform:** ${analysis.detected_platform}`)
  if (analysis.complexity_level) lines.push(`**Complexity:** ${analysis.complexity_level}`)
  if (analysis.team_note) lines.push(`**Team:** ${analysis.team_note}`)
  if (Array.isArray(analysis.detected_requirements) && analysis.detected_requirements.length > 0) {
    lines.push(`**Requirements:** ${analysis.detected_requirements.join(", ")}`)
  }
  lines.push("")
  lines.push("---")
  lines.push("")

  // Recommendations
  lines.push("## Recommendations")
  lines.push("")

  for (let i = 0; i < recs.length; i++) {
    const rec = recs[i] as any
    const medal = i === 0 ? "1st" : i === 1 ? "2nd" : i === 2 ? "3rd" : `${i + 1}th`
    const score = rec.match_score ?? 0
    const bar = renderScoreBar(score)

    lines.push(`### ${medal} — ${rec.preset_name ?? "Unknown"}`)
    lines.push(`**Preset:** \`${rec.preset_id ?? "?"}\` | **Match:** ${score}% ${bar}`)
    lines.push("")

    if (rec.reasoning) {
      lines.push(rec.reasoning)
      lines.push("")
    }

    if (Array.isArray(rec.strengths) && rec.strengths.length > 0) {
      lines.push("**Strengths:**")
      for (const s of rec.strengths) lines.push(`- ${s}`)
      lines.push("")
    }

    if (Array.isArray(rec.tradeoffs) && rec.tradeoffs.length > 0) {
      lines.push("**Tradeoffs:**")
      for (const t of rec.tradeoffs) lines.push(`- ${t}`)
      lines.push("")
    }

    if (rec.design_note && rec.design_note !== "null") {
      lines.push(`**Design Synergy:** ${rec.design_note}`)
      lines.push("")
    }

    if (i === 0) {
      lines.push(`> To use this preset: select **${rec.preset_name}** from the Tech Stack dropdown, then generate your documents.`)
      lines.push("")
    }

    if (i < recs.length - 1) {
      lines.push("---")
      lines.push("")
    }
  }

  return lines.join("\n")
}

function renderScoreBar(score: number): string {
  const filled = Math.round(score / 10)
  const empty = 10 - filled
  return "[" + "█".repeat(filled) + "░".repeat(empty) + "]"
}
