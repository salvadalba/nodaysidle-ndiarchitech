export function renderTRD(data: any): string {
  return `
# Technical Requirements Document

## 🧭 System Context
${data.system_context}

## 🔌 API Contracts
${renderApis(data.api_contracts)}

## 🧱 Modules
${renderModules(data.modules)}

## 🗃 Data Model Notes
${list(data.data_model_notes)}

## 🔐 Validation & Security
${list(data.validation_and_security)}

## 🧯 Error Handling Strategy
${data.error_handling_strategy}

## 🔭 Observability
- **Logging:** ${data.observability?.logging ?? ""}
- **Tracing:** ${data.observability?.tracing ?? ""}
- **Metrics:**
${list(data.observability?.metrics)}

## ⚡ Performance Notes
${list(data.performance_notes)}

## 🧪 Testing Strategy
### Unit
${list(data.testing_strategy?.unit)}
### Integration
${list(data.testing_strategy?.integration)}
### E2E
${list(data.testing_strategy?.e2e)}

## 🚀 Rollout Plan
${list(data.rollout_plan)}

## ❓ Open Questions
${list(data.open_questions)}
`.trim()
}

function list(items?: string[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map(i => `- ${i}`).join("\n")
}

function renderApis(apis?: any[]): string {
  if (!apis || apis.length === 0) return "_None_"
  return apis.map(a => `
### ${a.name}
- **Method:** ${a.method}
- **Path:** ${a.path}
- **Auth:** ${a.auth}
- **Request:** ${a.request}
- **Response:** ${a.response}
- **Errors:**
${list(a.errors)}
`.trim()).join("\n\n")
}

function renderModules(mods?: any[]): string {
  if (!mods || mods.length === 0) return "_None_"
  return mods.map(m => `
### ${m.name}
- **Responsibilities:**
${list(m.responsibilities)}
- **Interfaces:**
${list(m.interfaces)}
- **Depends on:**
${list(m.depends_on)}
`.trim()).join("\n\n")
}
