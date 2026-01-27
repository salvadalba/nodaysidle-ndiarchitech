/**
 * TypeScript type definitions for all compiler output schemas
 * These match the JSON schemas defined in the bash compiler scripts
 */

// ============================================================================
// PRD (Product Requirements Document) Schema
// ============================================================================

export interface PRDData {
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

// ============================================================================
// ARD (Architecture Requirements Document) Schema
// ============================================================================

export interface FrontendArchitecture {
  framework: string
  state_management: string
  routing: string
  build_tooling: string
}

export interface BackendArchitecture {
  approach: string
  api_style: string
  services: string[]
}

export interface DataLayer {
  primary_store: string
  relationships: string
  migrations: string
}

export interface Infrastructure {
  hosting: string
  scaling_strategy: string
  ci_cd: string
}

export interface ARDData {
  system_overview: string
  architecture_style: string
  frontend_architecture: FrontendArchitecture
  backend_architecture: BackendArchitecture
  data_layer: DataLayer
  infrastructure: Infrastructure
  key_tradeoffs: string[]
  non_functional_requirements: string[]
}

// ============================================================================
// TRD (Technical Requirements Document) Schema
// ============================================================================

export interface APIContract {
  endpoint: string
  method: string
  description: string
}

export interface Module {
  name: string
  responsibility: string
  dependencies: string[]
}

export interface DataModelNote {
  entity: string
  fields: string[]
}

export interface ValidationRule {
  rule: string
  description: string
}

export interface PerformanceNote {
  metric: string
  target: string
}

export interface TestingStrategy {
  unit_tests: string
  integration_tests: string
  e2e_tests: string
}

export interface RolloutPlan {
  phase: string
  description: string
}

export interface TRDData {
  system_context: string
  api_contracts: APIContract[]
  modules: Module[]
  data_model_notes: DataModelNote[]
  validation_and_security: ValidationRule[]
  error_handling_strategy: string
  observability: string
  performance_notes: PerformanceNote[]
  testing_strategy: TestingStrategy
  rollout_plan: RolloutPlan[]
  open_questions: string[]
}

// ============================================================================
// TASKS (Agile Task Breakdown) Schema
// ============================================================================

export interface Epic {
  title: string
  user_stories: string[]
  acceptance_criteria: string[]
}

export interface TASKSData {
  project_name: string
  global_assumptions: string[]
  risks: string[]
  epics: Epic[]
  open_questions: string[]
}

// ============================================================================
// AGENT (CLI Agent Prompts) Schema
// ============================================================================

export interface GlobalRules {
  do: string[]
  dont: string[]
}

export interface TaskPrompt {
  context: string
  prompt: string
}

export interface AGENTData {
  project_name: string
  global_rules: GlobalRules
  task_prompts: TaskPrompt[]
}

// ============================================================================
// Union Type and Discriminators
// ============================================================================

export type CompilerData = PRDData | ARDData | TRDData | TASKSData | AGENTData

export type CompilerMode = "prd" | "ard" | "trd" | "tasks" | "agent"

/**
 * Type guard to check if data is PRD
 */
export function isPRD(data: CompilerData): data is PRDData {
  return "product_name" in data
}

/**
 * Type guard to check if data is ARD
 */
export function isARD(data: CompilerData): data is ARDData {
  return "system_overview" in data && "frontend_architecture" in data
}

/**
 * Type guard to check if data is TRD
 */
export function isTRD(data: CompilerData): data is TRDData {
  return "system_context" in data && "api_contracts" in data
}

/**
 * Type guard to check if data is TASKS
 */
export function isTASKS(data: CompilerData): data is TASKSData {
  return "project_name" in data && "epics" in data
}

/**
 * Type guard to check if data is AGENT
 */
export function isAGENT(data: CompilerData): data is AGENTData {
  return "project_name" in data && "global_rules" in data
}
