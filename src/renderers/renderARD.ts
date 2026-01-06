export function renderARD(data: any): string {
  return `
# Architecture Requirements Document

## 🧱 System Overview
${data.system_overview}

## 🏗 Architecture Style
${data.architecture_style}

## 🎨 Frontend Architecture
- **Framework:** ${data.frontend_architecture.framework}
- **State Management:** ${data.frontend_architecture.state_management}
- **Routing:** ${data.frontend_architecture.routing}
- **Build Tooling:** ${data.frontend_architecture.build_tooling}

## 🧠 Backend Architecture
- **Approach:** ${data.backend_architecture.approach}
- **API Style:** ${data.backend_architecture.api_style}
- **Services:**
${list(data.backend_architecture.services)}

## 🗄 Data Layer
- **Primary Store:** ${data.data_layer.primary_store}
- **Relationships:** ${data.data_layer.relationships}
- **Migrations:** ${data.data_layer.migrations}

## ☁️ Infrastructure
- **Hosting:** ${data.infrastructure.hosting}
- **Scaling Strategy:** ${data.infrastructure.scaling_strategy}
- **CI/CD:** ${data.infrastructure.ci_cd}

## ⚖️ Key Trade-offs
${list(data.key_tradeoffs)}

## 📐 Non-Functional Requirements
${list(data.non_functional_requirements)}
`.trim()
}

function list(items?: string[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map(i => `- ${i}`).join("\n")
}
