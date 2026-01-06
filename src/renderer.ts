type PRDData = {
  product_name: string
  product_vision: string
  problem_statement: string
  goals: string[]
  non_goals: string[]
  target_users: string[]
  core_features: string[]
  non_functional_requirements: string[]
  success_metrics: string[]
  assumptions: string[]
  open_questions: string[]
}

export function renderPRD(prd: PRDData): string {
  return `
# ${prd.product_name}

## 🎯 Product Vision
${prd.product_vision}

## ❓ Problem Statement
${prd.problem_statement}

## 🎯 Goals
${list(prd.goals)}

## 🚫 Non-Goals
${list(prd.non_goals)}

## 👥 Target Users
${list(prd.target_users)}

## 🧩 Core Features
${list(prd.core_features)}

## ⚙️ Non-Functional Requirements
${list(prd.non_functional_requirements)}

## 📊 Success Metrics
${list(prd.success_metrics)}

## 📌 Assumptions
${list(prd.assumptions)}

## ❓ Open Questions
${list(prd.open_questions)}
`.trim()
}

function list(items?: string[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map(i => `- ${i}`).join("\n")
}

