export function renderAGENT(data: any): string {
  const tasks = Array.isArray(data.task_prompts) ? data.task_prompts : []

  return `
# Agent Prompts — ${data.project_name || "Unnamed Project"}

## 🧭 Global Rules

### ✅ Do
${list(data.global_rules?.do)}

### ❌ Don’t
${list(data.global_rules?.dont)}

## 🧩 Task Prompts
${tasks.length ? tasks.map(renderTaskPrompt).join("\n\n---\n\n") : "_None_"}
`.trim()
}

function renderTaskPrompt(t: any): string {
  // Construct the universal prompt from structured fields
  const filesCreate = list(t.files_to_create || [])
  const filesMod = list(t.files_to_modify || [])

  const stepsList = (Array.isArray(t.step_instructions) ? t.step_instructions : [])
    .map((s: string, i: number) => `${i + 1}. ${s}`)
    .join("\n")

  const constructedPrompt = `
ROLE: ${t.role || "Expert Engineer"}

GOAL: ${t.goal_one_liner || t.task_title}

CONTEXT: ${t.context || "None provided"}

FILES TO CREATE:
${filesCreate}

FILES TO MODIFY:
${filesMod}

DETAILED STEPS:
${stepsList || "_None_"}

VALIDATION:
${t.validation_cmd || "npm run build"}
`.trim()

  return `
## ${t.task_title || "Task"}

**Context**
${t.context || ""}

### Universal Agent Prompt
\`\`\`
${constructedPrompt}
\`\`\`
`.trim()
}

function list(items?: string[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map(i => `- ${i}`).join("\n")
}
