import { list } from "../utils/formatting"

export function renderAGENT(data: Record<string, unknown>): string {
  const tasks = Array.isArray(data.task_prompts) ? data.task_prompts : []
  const rules = (data.global_rules as Record<string, unknown>) ?? {}
  const doRules = Array.isArray(rules.do) ? rules.do : []
  const dontRules = Array.isArray(rules.dont) ? rules.dont : []

  return `
# Agent Prompts — ${(data.project_name as string) ?? "Unnamed Project"}

## 🧭 Global Rules

### ✅ Do
${list(doRules as string[])}

### ❌ Don't
${list(dontRules as string[])}

## 🧩 Task Prompts
${tasks.length ? tasks.map(renderTaskPrompt).join("\n\n---\n\n") : "_None_"}
`.trim()
}

function renderTaskPrompt(t: unknown): string {
  const task = t as Record<string, unknown>
  const context = (task.context as string) ?? ""
  const prompt = (task.prompt as string) ?? ""
  const title = (task.task_title as string) ?? "Task"

  return `
## ${title}

**Context**
${context || "_Not specified_"}

### Universal Agent Prompt
\`\`\`
${prompt || "_No prompt generated_"}
\`\`\`
`.trim()
}
