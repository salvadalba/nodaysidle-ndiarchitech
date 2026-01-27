/**
 * Shared formatting utilities for all document renderers
 * Eliminates code duplication across renderer files
 */

/**
 * Format an array of strings as a markdown bulleted list
 * @param items - Array of strings to format
 * @returns Markdown formatted list or "_None_" if empty
 */
export function list(items?: string[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map(i => `- ${i}`).join("\n")
}

/**
 * Format an array of strings as a numbered list
 * @param items - Array of strings to format
 * @returns Markdown formatted numbered list or "_None_" if empty
 */
export function numberedList(items?: string[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map((i, idx) => `${idx + 1}. ${i}`).join("\n")
}

/**
 * Join array items with a separator, handling empty/undefined
 * @param items - Array of strings
 * @param separator - Separator string (default: ", ")
 * @returns Joined string or empty string
 */
export function join(items?: string[], separator = ", "): string {
  if (!items || items.length === 0) return ""
  return items.join(separator)
}

/**
 * Format a code block with syntax highlighting hint
 * @param code - Code content
 * @param language - Language for syntax highlighting (default: "text")
 * @returns Markdown fenced code block
 */
export function codeBlock(code: string, language = "text"): string {
  return `\`\`\`${language}\n${code}\n\`\`\``
}

/**
 * Create a markdown header with emoji
 * @param text - Header text without emoji
 * @param emoji - Emoji to prepend
 * @param level - Header level (1-6, default: 2)
 * @returns Formatted markdown header
 */
export function header(text: string, emoji: string, level = 2): string {
  const prefix = "#".repeat(level)
  return `${prefix} ${emoji} ${text}`
}
