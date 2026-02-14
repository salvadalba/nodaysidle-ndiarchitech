export function renderDESIGN(data: Record<string, unknown>): string {
  const title = (data.title as string) ?? "Untitled Design Brief"
  const designType = (data.design_type as string) ?? "brand_identity"

  const ctx = (data.brand_context as any) ?? {}
  const dir = (data.design_direction as any) ?? {}
  const palette = dir.color_palette ?? {}

  const mainPrompt = (data.main_prompt as string) ?? ""
  const negativePrompt = (data.negative_prompt as string) ?? ""
  const refNotes = (data.reference_notes as string) ?? "No reference image provided"
  const layoutMockup = (data.layout_mockup as string) ?? ""

  const variations = Array.isArray(data.variations) ? data.variations : []
  const tools = (data.tool_prompts as any) ?? {}
  const mockups = Array.isArray(data.mockup_suggestions) ? data.mockup_suggestions : []

  const lines: string[] = []

  lines.push(`# ${title}`)
  lines.push(`**Type:** ${designType.replace(/_/g, " ")}`)
  lines.push("")

  // Brand Context
  lines.push("## Brand Context")
  if (ctx.industry) lines.push(`**Industry:** ${ctx.industry}`)
  if (ctx.market) lines.push(`**Market:** ${ctx.market}`)
  if (ctx.target_audience) lines.push(`**Audience:** ${ctx.target_audience}`)
  if (ctx.brand_personality) lines.push(`**Personality:** ${ctx.brand_personality}`)
  if (ctx.cultural_notes) {
    lines.push("")
    lines.push(`### Cultural Notes`)
    lines.push(ctx.cultural_notes)
  }
  lines.push("")

  // Design Direction
  lines.push("## Design Direction")
  if (dir.style) lines.push(`**Style:** ${dir.style}`)
  if (dir.mood) lines.push(`**Mood:** ${dir.mood}`)
  if (dir.composition) lines.push(`**Composition:** ${dir.composition}`)
  if (dir.typography_style) lines.push(`**Typography:** ${dir.typography_style}`)
  lines.push("")

  // Color Palette
  lines.push("### Color Palette")
  if (palette.primary) lines.push(`- **Primary:** ${palette.primary}`)
  if (palette.secondary) lines.push(`- **Secondary:** ${palette.secondary}`)
  if (palette.accent) lines.push(`- **Accent:** ${palette.accent}`)
  if (palette.background) lines.push(`- **Background:** ${palette.background}`)
  if (palette.rationale) {
    lines.push("")
    lines.push(`> ${palette.rationale}`)
  }
  lines.push("")

  // Reference Notes
  if (refNotes && refNotes !== "No reference image provided") {
    lines.push("## Reference Image Analysis")
    lines.push(refNotes)
    lines.push("")
  }

  lines.push("---")
  lines.push("")

  // Main Design Prompt
  lines.push("## Design Prompt (Universal)")
  lines.push("```")
  lines.push(mainPrompt)
  lines.push("```")
  lines.push("")

  // Negative Prompt
  if (negativePrompt) {
    lines.push("## Negative Prompt")
    lines.push("```")
    lines.push(negativePrompt)
    lines.push("```")
    lines.push("")
  }

  lines.push("---")
  lines.push("")

  // Tool-Specific Prompts
  const toolEntries: [string, string][] = [
    ["Google Imagen 3", tools.google_imagen],
    ["Minimax", tools.minimax],
    ["Midjourney v6", tools.midjourney],
    ["DALL-E 3", tools.dalle],
    ["Stable Diffusion XL", tools.stable_diffusion],
  ]

  for (const [name, prompt] of toolEntries) {
    if (prompt) {
      lines.push(`## ${name}`)
      lines.push("```")
      lines.push(prompt)
      lines.push("```")
      lines.push("")
    }
  }

  lines.push("---")
  lines.push("")

  // Layout Mockup
  if (layoutMockup) {
    lines.push("## Layout Mockup Prompt")
    lines.push("```")
    lines.push(layoutMockup)
    lines.push("```")
    lines.push("*Copy this into any AI image tool to generate a sketch showing logo placement, brand positioning, and visual hierarchy.*")
    lines.push("")
  }

  // Variations
  if (variations.length > 0) {
    lines.push("## Variations")
    for (let i = 0; i < variations.length; i++) {
      lines.push(`### ${i + 1}. ${variations[i]}`)
      lines.push("")
    }
  }

  // Mockup Suggestions
  if (mockups.length > 0) {
    lines.push("## Suggested Mockups")
    for (const m of mockups) {
      lines.push(`- ${m}`)
    }
    lines.push("")
  }

  return lines.join("\n")
}
