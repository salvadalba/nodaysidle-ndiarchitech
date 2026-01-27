import { list } from "../utils/formatting"

export function renderTRD(data: Record<string, unknown>): string {
  const testing = (data.testing_strategy as Record<string, unknown>) ?? {}
  const observability = (data.observability as Record<string, unknown>) ?? {}
  const apis = Array.isArray(data.api_contracts) ? data.api_contracts : []
  const modules = Array.isArray(data.modules) ? data.modules : []
  const dataModelNotes = Array.isArray(data.data_model_notes) ? data.data_model_notes : []
  const validationRules = Array.isArray(data.validation_and_security) ? data.validation_and_security : []
  const perfNotes = Array.isArray(data.performance_notes) ? data.performance_notes : []
  const rolloutPlan = Array.isArray(data.rollout_plan) ? data.rollout_plan : []
  const questions = Array.isArray(data.open_questions) ? data.open_questions : []

  return `
# Technical Requirements Document

## 🧭 System Context
${(data.system_context as string) ?? "_Not specified_"}

## 🔌 API Contracts
${renderApis(apis)}

## 🧱 Modules
${renderModules(modules)}

## 🗃 Data Model Notes
${renderDataModelNotes(dataModelNotes)}

## 🔐 Validation & Security
${renderValidationRules(validationRules)}

## 🧯 Error Handling Strategy
${(data.error_handling_strategy as string) ?? "_Not specified_"}

## 🔭 Observability
- **Logging:** ${(observability.logging as string) ?? "_Not specified_"}
- **Tracing:** ${(observability.tracing as string) ?? "_Not specified_"}
- **Metrics:**
${list(Array.isArray(observability.metrics) ? observability.metrics as string[] : [])}

## ⚡ Performance Notes
${renderPerformanceNotes(perfNotes)}

## 🧪 Testing Strategy
### Unit
${list(Array.isArray(testing.unit) ? testing.unit as string[] : [])}
### Integration
${list(Array.isArray(testing.integration) ? testing.integration as string[] : [])}
### E2E
${list(Array.isArray(testing.e2e) ? testing.e2e as string[] : [])}

## 🚀 Rollout Plan
${renderRolloutPlan(rolloutPlan)}

## ❓ Open Questions
${list(questions as string[])}
`.trim()
}

function renderApis(apis: unknown[]): string {
  if (apis.length === 0) return "_None_"
  return apis.map(a => {
    const api = a as Record<string, unknown>
    return `
### ${(api.endpoint as string) ?? (api.name as string) ?? "Unknown Endpoint"}
- **Method:** ${(api.method as string) ?? "_Not specified_"}
- **Description:** ${(api.description as string) ?? "_Not specified_"}
`.trim()
  }).join("\n\n")
}

function renderModules(mods: unknown[]): string {
  if (mods.length === 0) return "_None_"
  return mods.map(m => {
    const mod = m as Record<string, unknown>
    const deps = Array.isArray(mod.dependencies) ? mod.dependencies : []
    return `
### ${(mod.name as string) ?? "Unknown Module"}
- **Responsibility:** ${(mod.responsibility as string) ?? "_Not specified_"}
- **Dependencies:**
${list(deps as string[])}
`.trim()
  }).join("\n\n")
}

function renderDataModelNotes(notes: unknown[]): string {
  if (notes.length === 0) return "_None_"
  return notes.map(n => {
    const note = n as Record<string, unknown>
    const fields = Array.isArray(note.fields) ? note.fields : []
    return `
### ${(note.entity as string) ?? "Unknown Entity"}
${list(fields as string[])}
`.trim()
  }).join("\n\n")
}

function renderValidationRules(rules: unknown[]): string {
  if (rules.length === 0) return "_None_"
  return rules.map(r => {
    const rule = r as Record<string, unknown>
    return `- **${(rule.rule as string) ?? "Rule"}:** ${(rule.description as string) ?? "_Not specified_"}`
  }).join("\n")
}

function renderPerformanceNotes(notes: unknown[]): string {
  if (notes.length === 0) return "_None_"
  return notes.map(n => {
    const note = n as Record<string, unknown>
    return `- **${(note.metric as string) ?? "Metric"}:** ${(note.target as string) ?? "_Not specified_"}`
  }).join("\n")
}

function renderRolloutPlan(plan: unknown[]): string {
  if (plan.length === 0) return "_None_"
  return plan.map(p => {
    const phase = p as Record<string, unknown>
    return `
### ${(phase.phase as string) ?? "Phase"}
${(phase.description as string) ?? "_Not specified_"}
`.trim()
  }).join("\n\n")
}
