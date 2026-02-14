import { list, numberedList } from "../utils/formatting"

export function renderAGENT(data: Record<string, unknown>): string {
  const tasks = Array.isArray(data.task_prompts) ? data.task_prompts : []
  const rules = (data.global_rules as Record<string, unknown>) ?? {}
  const doRules = Array.isArray(rules.do) ? rules.do : []
  const dontRules = Array.isArray(rules.dont) ? rules.dont : []

  return `
# Agent Prompts — ${(data.project_name as string) ?? "Unnamed Project"}

## Global Rules

### Do
${list(doRules as string[])}

### Don't
${list(dontRules as string[])}

---

## Task Prompts
${tasks.length ? tasks.map((t, i) => renderTaskPrompt(t, i + 1)).join("\n\n---\n\n") : "_None_"}
`.trim()
}

function renderTaskPrompt(t: unknown, num: number): string {
  const task = t as Record<string, unknown>
  const title = (task.task_title as string) ?? "Task"
  const context = (task.context as string) ?? ""
  const role = (task.role as string) ?? ""
  const goal = (task.goal_one_liner as string) ?? ""
  const filesToCreate = Array.isArray(task.files_to_create) ? task.files_to_create as string[] : []
  const filesToModify = Array.isArray(task.files_to_modify) ? task.files_to_modify as string[] : []
  const steps = Array.isArray(task.step_instructions) ? task.step_instructions as string[] : []
  const validation = (task.validation_cmd as string) ?? ""

  return `
### Task ${num}: ${title}

**Role:** ${role || "_Not specified_"}
**Goal:** ${goal || "_Not specified_"}

**Context**
${context || "_Not specified_"}

**Files to Create**
${list(filesToCreate)}

**Files to Modify**
${list(filesToModify)}

**Steps**
${numberedList(steps)}

**Validation**
${validation ? `\`${validation}\`` : "_None_"}
`.trim()
}
