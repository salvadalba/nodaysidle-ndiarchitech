export function renderAGENT(data: any): string {
  const profiles = Array.isArray(data.agent_profiles) ? data.agent_profiles : []
  const tasks = Array.isArray(data.task_prompts) ? data.task_prompts : []

  return `
# Agent Prompts — ${data.project_name || "Unnamed Project"}

## 🧭 Global Rules

### ✅ Do
${list(data.global_rules?.do)}

### ❌ Don’t
${list(data.global_rules?.dont)}

## 🧰 Agent Profiles
${profiles.length ? profiles.map(renderProfile).join("\n\n") : "_None_"}

## 🧩 Task Prompts
${tasks.length ? tasks.map(renderTaskPrompt).join("\n\n---\n\n") : "_None_"}
`.trim()
}

function renderProfile(p: any): string {
  return `
### ${p.title || p.id}
**Run style:** ${p.run_style || ""}

**Prefix:**
\`\`\`
${p.prompt_prefix || ""}
\`\`\`
`.trim()
}

function renderTaskPrompt(t: any): string {
  return `
## ${t.task_title || "Task"}

**Context**
${t.context || ""}

**Inputs**
${list(t.inputs)}

**Outputs**
${list(t.outputs)}

**Acceptance Criteria**
${list(t.acceptance_criteria)}

### Claude Code (GLM 4.6)
\`\`\`
${t.prompts?.claude_code || ""}
\`\`\`

### Gemini CLI
\`\`\`
${t.prompts?.gemini_cli || ""}
\`\`\`

### OpenCode
\`\`\`
${t.prompts?.opencode || ""}
\`\`\`
`.trim()
}

function list(items?: string[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map(i => `- ${i}`).join("\n")
}
