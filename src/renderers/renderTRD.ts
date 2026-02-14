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
    // Handle both schema shapes: {name, method, path} and {endpoint, method, description}
    const title = (api.name as string) ?? (api.endpoint as string) ?? "Unknown Endpoint"
    const method = (api.method as string) ?? ""
    const path = (api.path as string) ?? ""
    const auth = (api.auth as string) ?? ""
    const description = (api.description as string) ?? ""
    const request = (api.request as string) ?? ""
    const response = (api.response as string) ?? ""
    const errors = Array.isArray(api.errors) ? api.errors : []

    const lines = [`### ${title}`]
    if (method) lines.push(`- **Method:** ${method}`)
    if (path) lines.push(`- **Path:** ${path}`)
    if (auth) lines.push(`- **Auth:** ${auth}`)
    if (description) lines.push(`- **Description:** ${description}`)
    if (request) lines.push(`- **Request:** ${request}`)
    if (response) lines.push(`- **Response:** ${response}`)
    if (errors.length > 0) lines.push(`- **Errors:** ${errors.join(", ")}`)

    return lines.join("\n")
  }).join("\n\n")
}

function renderModules(mods: unknown[]): string {
  if (mods.length === 0) return "_None_"
  return mods.map(m => {
    const mod = m as Record<string, unknown>
    const name = (mod.name as string) ?? "Unknown Module"
    // Handle both: responsibilities (array from script) and responsibility (string from old renderer)
    const responsibilities = Array.isArray(mod.responsibilities) ? mod.responsibilities as string[] : []
    const responsibility = (mod.responsibility as string) ?? ""
    const interfaces = Array.isArray(mod.interfaces) ? mod.interfaces as string[] : []
    // Handle both: depends_on (script schema) and dependencies (old renderer)
    const deps = Array.isArray(mod.depends_on) ? mod.depends_on as string[] :
                 Array.isArray(mod.dependencies) ? mod.dependencies as string[] : []

    const lines = [`### ${name}`]
    if (responsibility) {
      lines.push(`- **Responsibility:** ${responsibility}`)
    } else if (responsibilities.length > 0) {
      lines.push(`- **Responsibilities:**`)
      lines.push(list(responsibilities))
    }
    if (interfaces.length > 0) {
      lines.push(`- **Interfaces:**`)
      lines.push(list(interfaces))
    }
    if (deps.length > 0) {
      lines.push(`- **Dependencies:**`)
      lines.push(list(deps))
    }

    return lines.join("\n")
  }).join("\n\n")
}

function renderDataModelNotes(notes: unknown[]): string {
  if (notes.length === 0) return "_None_"
  // Handle both: array of strings or array of objects with entity/fields
  return notes.map(n => {
    if (typeof n === "string") return `- ${n}`
    const note = n as Record<string, unknown>
    const entity = (note.entity as string) ?? (note.name as string) ?? ""
    const fields = Array.isArray(note.fields) ? note.fields : []
    if (entity && fields.length > 0) {
      return `### ${entity}\n${list(fields as string[])}`
    } else if (entity) {
      return `- ${entity}`
    }
    return `- ${JSON.stringify(n)}`
  }).join("\n\n")
}

function renderValidationRules(rules: unknown[]): string {
  if (rules.length === 0) return "_None_"
  return rules.map(r => {
    if (typeof r === "string") return `- ${r}`
    const rule = r as Record<string, unknown>
    const name = (rule.rule as string) ?? (rule.name as string) ?? ""
    const desc = (rule.description as string) ?? ""
    if (name && desc) return `- **${name}:** ${desc}`
    if (name) return `- ${name}`
    if (desc) return `- ${desc}`
    return `- ${JSON.stringify(r)}`
  }).join("\n")
}

function renderPerformanceNotes(notes: unknown[]): string {
  if (notes.length === 0) return "_None_"
  return notes.map(n => {
    if (typeof n === "string") return `- ${n}`
    const note = n as Record<string, unknown>
    const metric = (note.metric as string) ?? (note.name as string) ?? ""
    const target = (note.target as string) ?? (note.value as string) ?? ""
    if (metric && target) return `- **${metric}:** ${target}`
    if (metric) return `- ${metric}`
    return `- ${JSON.stringify(n)}`
  }).join("\n")
}

function renderRolloutPlan(plan: unknown[]): string {
  if (plan.length === 0) return "_None_"
  return plan.map(p => {
    if (typeof p === "string") return `- ${p}`
    const phase = p as Record<string, unknown>
    const name = (phase.phase as string) ?? (phase.name as string) ?? "Phase"
    const desc = (phase.description as string) ?? ""
    if (desc) return `### ${name}\n${desc}`
    return `### ${name}`
  }).join("\n\n")
}
