import type { StackPreset } from "./stacks"

export type CompilerMode = "prd" | "ard" | "trd" | "tasks" | "agent" | "image" | "video" | "design"

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
    case "design":
      taskInstruction =
        "Generate a culturally-intelligent design prompt. Detect the user's market/region from context and adapt the design direction accordingly. Include brand context, color palette with hex codes, typography direction, layout mockup prompt, 3 variations, and tool-specific prompts for Google Imagen 3, Minimax, Midjourney, DALL-E 3, and Stable Diffusion XL."
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