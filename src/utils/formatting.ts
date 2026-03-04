/**
 * Shared formatting utilities for all document renderers
 * Eliminates code duplication across renderer files
 */

/**
 * Format an array of strings as a markdown bulleted list
 * @param items - Array of strings to format
 * @returns Markdown formatted list or "_None_" if empty
 */
export function list(items?: unknown[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map(i => {
    if (typeof i === "string") return `- ${i}`
    if (typeof i === "object" && i !== null) {
      const obj = i as Record<string, unknown>
      // Handle common LLM patterns: {name, description}, {title, details}, etc.
      const name = obj.name ?? obj.title ?? obj.feature ?? ""
      const desc = obj.description ?? obj.details ?? obj.summary ?? ""
      if (name && desc) return `- **${name}:** ${desc}`
      if (name) return `- ${name}`
      // Fallback: join all values
      return `- ${Object.values(obj).filter(Boolean).join(" — ")}`
    }
    return `- ${String(i)}`
  }).join("\n")
}

/**
 * Format an array of strings as a numbered list
 * @param items - Array of strings to format
 * @returns Markdown formatted numbered list or "_None_" if empty
 */
export function numberedList(items?: unknown[]): string {
  if (!items || items.length === 0) return "_None_"
  return items.map((i, idx) => {
    if (typeof i === "string") return `${idx + 1}. ${i}`
    if (typeof i === "object" && i !== null) {
      const obj = i as Record<string, unknown>
      const name = obj.name ?? obj.title ?? obj.feature ?? ""
      const desc = obj.description ?? obj.details ?? obj.summary ?? ""
      if (name && desc) return `${idx + 1}. **${name}:** ${desc}`
      if (name) return `${idx + 1}. ${name}`
      return `${idx + 1}. ${Object.values(obj).filter(Boolean).join(" — ")}`
    }
    return `${idx + 1}. ${String(i)}`
  }).join("\n")
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
