export function renderTASKS(data: any): string {
  const epics = Array.isArray(data.epics) ? data.epics : []

  return `
# Tasks Plan — ${data.project_name || "Unnamed Project"}

## 📌 Global Assumptions
${list(data.global_assumptions)}

## ⚠️ Risks
${list(data.risks)}

## 🧩 Epics
${epics.length ? epics.map(renderEpic).join("\n\n") : "_None_"}

## ❓ Open Questions
${list(data.open_questions)}
`.trim()
}

function renderEpic(epic: any): string {
  const tasks = Array.isArray(epic.tasks) ? epic.tasks : []
  return `
## ${epic.name || "Epic"}
**Goal:** ${epic.goal || ""}

${tasks.length ? tasks.map(renderTask).join("\n") : "_No tasks_"}
`.trim()
}

function renderTask(task: any): string {
  const ac = Array.isArray(task.acceptance_criteria) ? task.acceptance_criteria : []
  const deps = Array.isArray(task.dependencies) ? task.dependencies : []

  return `
### ✅ ${task.title || "Task"}${task.estimate ? ` (${task.estimate})` : ""}

${task.description || ""}

**Acceptance Criteria**
${list(ac)}

**Dependencies**
${list(deps)}
`.trim()
}

function list(items?: string[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map(i => `- ${i}`).join("\n")
}
