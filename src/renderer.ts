import { list } from "./utils/formatting"

export function renderPRD(data: Record<string, unknown>): string {
  const goals = Array.isArray(data.goals) ? data.goals : []
  const nonGoals = Array.isArray(data.non_goals) ? data.non_goals : []
  const targetUsers = Array.isArray(data.target_users) ? data.target_users : []
  const coreFeatures = Array.isArray(data.core_features) ? data.core_features : []
  const nfr = Array.isArray(data.non_functional_requirements) ? data.non_functional_requirements : []
  const metrics = Array.isArray(data.success_metrics) ? data.success_metrics : []
  const assumptions = Array.isArray(data.assumptions) ? data.assumptions : []
  const questions = Array.isArray(data.open_questions) ? data.open_questions : []

  return `
# ${(data.product_name as string) ?? "Untitled Product"}

## 🎯 Product Vision
${(data.product_vision as string) ?? "_Not specified_"}

## ❓ Problem Statement
${(data.problem_statement as string) ?? "_Not specified_"}

## 🎯 Goals
${list(goals as string[])}

## 🚫 Non-Goals
${list(nonGoals as string[])}

## 👥 Target Users
${list(targetUsers as string[])}

## 🧩 Core Features
${list(coreFeatures as string[])}

## ⚙️ Non-Functional Requirements
${list(nfr as string[])}

## 📊 Success Metrics
${list(metrics as string[])}

## 📌 Assumptions
${list(assumptions as string[])}

## ❓ Open Questions
${list(questions as string[])}
`.trim()
}
