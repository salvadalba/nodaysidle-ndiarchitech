import { list } from "../utils/formatting"

export function renderTASKS(data: Record<string, unknown>): string {
  const epics = Array.isArray(data.epics) ? data.epics : []
  const globalAssumptions = Array.isArray(data.global_assumptions) ? data.global_assumptions : []
  const risks = Array.isArray(data.risks) ? data.risks : []
  const questions = Array.isArray(data.open_questions) ? data.open_questions : []

  return `
# Tasks Plan — ${(data.project_name as string) ?? "Unnamed Project"}

## 📌 Global Assumptions
${list(globalAssumptions as string[])}

## ⚠️ Risks
${list(risks as string[])}

## 🧩 Epics
${epics.length ? epics.map(renderEpic).join("\n\n") : "_None_"}

## ❓ Open Questions
${list(questions as string[])}
`.trim()
}

function renderEpic(epic: unknown): string {
  const e = epic as Record<string, unknown>
  const tasks = Array.isArray(e.tasks) ? e.tasks : []
  const title = (e.title as string) ?? (e.name as string) ?? "Epic"
  const goal = e.goal as string | undefined
  const userStories = Array.isArray(e.user_stories) ? e.user_stories : []
  const acceptanceCriteria = Array.isArray(e.acceptance_criteria) ? e.acceptance_criteria : []

  return `
## ${title}
${goal ? `**Goal:** ${goal}` : ""}

### User Stories
${list(userStories as string[])}

### Acceptance Criteria
${list(acceptanceCriteria as string[])}

${tasks.length ? tasks.map(renderTask).join("\n\n") : ""}
`.trim()
}

function renderTask(task: unknown): string {
  const t = task as Record<string, unknown>
  const ac = Array.isArray(t.acceptance_criteria) ? t.acceptance_criteria : []
  const deps = Array.isArray(t.dependencies) ? t.dependencies : []
  const title = (t.title as string) ?? "Task"
  const estimate = t.estimate as string | undefined
  const description = (t.description as string) ?? ""

  return `
### ✅ ${title}${estimate ? ` (${estimate})` : ""}

${description}

**Acceptance Criteria**
${list(ac as string[])}

**Dependencies**
${list(deps as string[])}
`.trim()
}
