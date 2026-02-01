import type { StackPreset } from "./stacks"

export type CompilerMode = "prd" | "ard" | "trd" | "tasks" | "agent" | "image" | "video"

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
    case "image":
      taskInstruction =
        "Generate a detailed, professional image generation prompt. Include composition, camera angle, lens, lighting, style, color palette, and tool-specific prompts for Midjourney, DALL-E, and Stable Diffusion."
      break
    case "video":
      taskInstruction =
        "Generate a detailed video generation prompt. Include scene description, camera movement, subject motion, duration, visual style, color grading, mood, audio suggestions, and tool-specific prompts for Veo 3, Runway, Pika, and Kling."
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