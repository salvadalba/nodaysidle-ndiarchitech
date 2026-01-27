/**
 * Error handling utilities for the PRD Compiler
 * Provides user-friendly error messages and recovery options
 */

/**
 * Custom error class for compiler-specific errors
 */
export class CompilerError extends Error {
  readonly userMessage: string
  readonly recoverable: boolean

  constructor(message: string, userMessage: string, recoverable = true) {
    super(message)
    this.name = "CompilerError"
    this.userMessage = userMessage
    this.recoverable = recoverable
  }
}

/**
 * Error types with their user-friendly messages
 */
export const ErrorMessages = {
  // Claude CLI errors
  CLAUDE_NOT_FOUND: new CompilerError(
    "Claude CLI not found",
    "Claude CLI is not installed or not in PATH. Install it with: npm install -g @anthropic-ai/claude",
    true
  ),
  CLAUDE_NOT_AUTHENTICATED: new CompilerError(
    "Claude CLI not authenticated",
    "Please run 'claude login' to authenticate with your Anthropic account.",
    true
  ),
  CLAUDE_TIMEOUT: new CompilerError(
    "Claude CLI request timed out",
    "The request took too long. Try again with a shorter input or check your connection.",
    true
  ),

  // JSON parsing errors
  INVALID_JSON: new CompilerError(
    "Invalid JSON output from Claude",
    "The AI returned invalid JSON. Please try again.",
    true
  ),
  MISSING_SCHEMA_FIELD: (field: string) => new CompilerError(
    `Missing required field: ${field}`,
    `The AI output is missing the "${field}" field. Please try regenerating.`,
    true
  ),

  // File system errors
  SAVE_FAILED: new CompilerError(
    "Failed to save file",
    "Could not write to the selected location. Check permissions and try again.",
    true
  ),
  LOAD_FAILED: new CompilerError(
    "Failed to load file",
    "Could not read the file. It may be corrupted or in an unsupported format.",
    true
  ),

  // Database errors
  DB_ERROR: new CompilerError(
    "Database error",
    "A database error occurred. The app may need to be restarted.",
    false
  ),

  // Input validation errors
  EMPTY_INPUT: new CompilerError(
    "Empty input",
    "Please enter a project description before generating.",
    true
  ),
  NO_STACK_SELECTED: new CompilerError(
    "No stack selected",
    "Please select a tech stack preset for better results.",
    false
  ),

  // Unknown errors
  UNKNOWN: (details: string) => new CompilerError(
    "An unknown error occurred",
    `Something went wrong: ${details}. Please try again.`,
    true
  ),
}

/**
 * Handle an error and return a user-friendly message
 * @param err - The error to handle
 * @returns Object with message and recoverable status
 */
export function handleError(err: unknown): { message: string; recoverable: boolean } {
  if (err instanceof CompilerError) {
    return { message: err.userMessage, recoverable: err.recoverable }
  }

  if (err instanceof Error) {
    // Check for known error patterns
    const msg = err.message.toLowerCase()

    if (msg.includes("claude") && msg.includes("not found")) {
      return { message: ErrorMessages.CLAUDE_NOT_FOUND.userMessage, recoverable: true }
    }
    if (msg.includes("auth") || msg.includes("unauthorized")) {
      return { message: ErrorMessages.CLAUDE_NOT_AUTHENTICATED.userMessage, recoverable: true }
    }
    if (msg.includes("timeout") || msg.includes("timed out")) {
      return { message: ErrorMessages.CLAUDE_TIMEOUT.userMessage, recoverable: true }
    }
    if (msg.includes("json") || msg.includes("parse")) {
      return { message: ErrorMessages.INVALID_JSON.userMessage, recoverable: true }
    }

    return { message: err.message, recoverable: true }
  }

  if (typeof err === "string") {
    return { message: err, recoverable: true }
  }

  return { message: ErrorMessages.UNKNOWN("unknown error").userMessage, recoverable: true }
}

/**
 * Log error for debugging while showing user-friendly message
 * @param err - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logError(err: unknown, context = ""): void {
  const prefix = context ? `[${context}] ` : ""
  console.error(`${prefix}Error:`, err)

  if (err instanceof Error && err.stack) {
    console.debug(err.stack)
  }
}
