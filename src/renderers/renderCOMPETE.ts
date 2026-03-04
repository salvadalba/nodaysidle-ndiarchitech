export function renderCOMPETE(data: Record<string, unknown>): string {
  const name = (data.competitor_name as string) ?? "Unknown Competitor"
  const url = (data.competitor_url as string) ?? ""
  const summary = (data.competitor_summary as string) ?? ""
  const strengths = Array.isArray(data.strengths) ? data.strengths : []
  const weaknesses = Array.isArray(data.weaknesses) ? data.weaknesses : []
  const gaps = Array.isArray(data.market_gaps) ? data.market_gaps : []
  const prd = (data.improved_prd as any) ?? {}
  const advantages = Array.isArray(data.competitive_advantages) ? data.competitive_advantages : []
  const gtm = (data.go_to_market as any) ?? {}

  const lines: string[] = []

  // ---- Competitive Analysis Section ----
  lines.push(`# Competitive Analysis: ${name}`)
  if (url) lines.push(`> Source: ${url}`)
  lines.push("")

  if (summary) {
    lines.push("## Competitor Summary")
    lines.push("")
    lines.push(summary)
    lines.push("")
  }

  if (strengths.length > 0) {
    lines.push("## Strengths (What They Do Well)")
    lines.push("")
    for (const s of strengths) lines.push(`- ${s}`)
    lines.push("")
  }

  if (weaknesses.length > 0) {
    lines.push("## Weaknesses & Pain Points")
    lines.push("")
    for (const w of weaknesses) lines.push(`- ${w}`)
    lines.push("")
  }

  if (gaps.length > 0) {
    lines.push("## Market Gaps")
    lines.push("")
    for (const g of gaps) lines.push(`- ${g}`)
    lines.push("")
  }

  lines.push("---")
  lines.push("")

  // ---- Improved PRD Section ----
  const productName = (prd.product_name as string) ?? "Better Alternative"
  lines.push(`# Build a Better ${name}: ${productName}`)
  lines.push("")

  if (prd.product_vision) {
    lines.push("## Product Vision")
    lines.push("")
    lines.push(prd.product_vision)
    lines.push("")
  }

  const audience = Array.isArray(prd.target_audience) ? prd.target_audience : []
  if (audience.length > 0) {
    lines.push("## Target Audience")
    lines.push("")
    for (const a of audience) lines.push(`- ${a}`)
    lines.push("")
  }

  const features = Array.isArray(prd.core_features) ? prd.core_features : []
  if (features.length > 0) {
    lines.push("## Core Features")
    lines.push("")
    for (let i = 0; i < features.length; i++) {
      lines.push(`${i + 1}. ${features[i]}`)
    }
    lines.push("")
  }

  const diffs = Array.isArray(prd.differentiators) ? prd.differentiators : []
  if (diffs.length > 0) {
    lines.push("## Differentiators")
    lines.push("")
    for (const d of diffs) lines.push(`- ${d}`)
    lines.push("")
  }

  // ---- Competitive Advantages Table ----
  if (advantages.length > 0) {
    lines.push("## Competitive Advantages")
    lines.push("")
    lines.push("| Area | Current Gap | Our Approach |")
    lines.push("|------|-------------|--------------|")
    for (const adv of advantages) {
      const a = adv as any
      lines.push(`| ${a.area ?? ""} | ${a.current_gap ?? ""} | ${a.our_approach ?? ""} |`)
    }
    lines.push("")
  }

  const techRecs = Array.isArray(prd.tech_recommendations) ? prd.tech_recommendations : []
  if (techRecs.length > 0) {
    lines.push("## Tech Recommendations")
    lines.push("")
    for (const t of techRecs) lines.push(`- ${t}`)
    lines.push("")
  }

  // ---- Go-to-Market ----
  if (gtm.positioning || gtm.launch_strategy) {
    lines.push("---")
    lines.push("")
    lines.push("## Go-to-Market")
    lines.push("")
    if (gtm.positioning) lines.push(`**Positioning:** ${gtm.positioning}`)
    if (gtm.launch_strategy) {
      lines.push("")
      lines.push(`**Launch Strategy:** ${gtm.launch_strategy}`)
    }
    lines.push("")
  }

  return lines.join("\n")
}
