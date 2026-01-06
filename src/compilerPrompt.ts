import type { StackPreset } from "./stacks"

export type CompilerMode = "prd" | "ard" | "trd" | "tasks" | "agent"

export function makeUserPrompt(
  input: string,
  mode: string,
  stack?: StackPreset
) {
  let taskInstruction = "Populate the PRD schema for a modern web application."

  switch (mode) {
    case "ard":
      taskInstruction =
        "Generate an Architecture Requirements Document (ARD) that describes the system architecture."
      break
    case "trd":
      taskInstruction =
        "Generate a Technical Requirements Document (TRD) detailing APIs, data models, and implementation specifics."
      break
    case "tasks":
      taskInstruction =
        "Break down the project into Epics and granular Tasks suitable for an agile backlog."
      break
    case "agent":
      taskInstruction =
        "Generate CLI agent prompts (Claude, Gemini, etc.) to scaffold this project."
      break
  }

  return `
INPUT:
${input}

${
  stack
    ? `
STACK PRESET (MANDATORY):
Frontend: ${stack.frontend.join(", ")}
Backend: ${stack.backend.join(", ")}
Database: ${stack.database.join(", ")}
Notes: ${stack.notes?.join(", ") ?? "None"}
`
    : ""
}

TASK:
${taskInstruction}

RULES:
- Use the provided stack exactly
- Do not introduce alternative technologies
- Prefer simplicity over extensibility
`
}