import { list } from "../utils/formatting"

export function renderARD(data: Record<string, unknown>): string {
  const frontend = (data.frontend_architecture as Record<string, unknown>) ?? {}
  const backend = (data.backend_architecture as Record<string, unknown>) ?? {}
  const dataLayer = (data.data_layer as Record<string, unknown>) ?? {}
  const infra = (data.infrastructure as Record<string, unknown>) ?? {}
  const tradeoffs = Array.isArray(data.key_tradeoffs) ? data.key_tradeoffs : []
  const nfr = Array.isArray(data.non_functional_requirements) ? data.non_functional_requirements : []
  const services = Array.isArray(backend.services) ? backend.services : []

  return `
# Architecture Requirements Document

## 🧱 System Overview
${(data.system_overview as string) ?? "_Not specified_"}

## 🏗 Architecture Style
${(data.architecture_style as string) ?? "_Not specified_"}

## 🎨 Frontend Architecture
- **Framework:** ${(frontend.framework as string) ?? "_Not specified_"}
- **State Management:** ${(frontend.state_management as string) ?? "_Not specified_"}
- **Routing:** ${(frontend.routing as string) ?? "_Not specified_"}
- **Build Tooling:** ${(frontend.build_tooling as string) ?? "_Not specified_"}

## 🧠 Backend Architecture
- **Approach:** ${(backend.approach as string) ?? "_Not specified_"}
- **API Style:** ${(backend.api_style as string) ?? "_Not specified_"}
- **Services:**
${list(services as string[])}

## 🗄 Data Layer
- **Primary Store:** ${(dataLayer.primary_store as string) ?? "_Not specified_"}
- **Relationships:** ${(dataLayer.relationships as string) ?? "_Not specified_"}
- **Migrations:** ${(dataLayer.migrations as string) ?? "_Not specified_"}

## ☁️ Infrastructure
- **Hosting:** ${(infra.hosting as string) ?? "_Not specified_"}
- **Scaling Strategy:** ${(infra.scaling_strategy as string) ?? "_Not specified_"}
- **CI/CD:** ${(infra.ci_cd as string) ?? "_Not specified_"}

## ⚖️ Key Trade-offs
${list(tradeoffs as string[])}

## 📐 Non-Functional Requirements
${list(nfr as string[])}
`.trim()
}
