/**
 * Keyboard shortcuts for NDI PRD Compiler
 * Platform-aware shortcuts (macOS vs Windows/Linux)
 */

export interface Shortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  description: string
}

export interface ShortcutAction {
  shortcuts: Shortcut[]
  action: () => void
  description: string
}

// Detect platform
const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0

// Reserved for future use
const _modKey = isMac ? "metaKey" : "ctrlKey"
const _modSymbol = isMac ? "⌘" : "Ctrl"
void _modKey
void _modSymbol

/**
 * Format a shortcut for display in UI
 */
export function formatShortcut(shortcut: Shortcut): string {
  const parts: string[] = []

  if (shortcut.ctrlKey) parts.push(isMac ? "⌃" : "Ctrl")
  if (shortcut.metaKey) parts.push(isMac ? "⌘" : "Win")
  if (shortcut.shiftKey) parts.push(isMac ? "⇧" : "Shift")
  if (shortcut.altKey) parts.push(isMac ? "⌥" : "Alt")

  // Capitalize the key for display
  let keyDisplay = shortcut.key
  if (keyDisplay.length === 1) {
    keyDisplay = keyDisplay.toUpperCase()
  }

  parts.push(keyDisplay)
  return parts.join(isMac ? "" : "+")
}

/**
 * Check if an event matches a shortcut
 */
export function eventMatchesShortcut(event: KeyboardEvent, shortcut: Shortcut): boolean {
  const key = event.key.toLowerCase()
  const shortcutKey = shortcut.key.toLowerCase()

  return (
    key === shortcutKey &&
    !!shortcut.ctrlKey === event.ctrlKey &&
    !!shortcut.metaKey === event.metaKey &&
    !!shortcut.shiftKey === event.shiftKey &&
    !!shortcut.altKey === event.altKey
  )
}

/**
 * Register keyboard shortcuts
 */
export function registerShortcuts(actions: ShortcutAction[]): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Ignore shortcuts when typing in input fields (unless it's a specific action)
    const target = event.target as HTMLElement
    const isInputField = target.tagName === "INPUT" ||
                         target.tagName === "TEXTAREA" ||
                         target.tagName === "SELECT" ||
                         target.contentEditable === "true"

    for (const { shortcuts, action } of actions) {
      for (const shortcut of shortcuts) {
        if (eventMatchesShortcut(event, shortcut)) {
          // Allow some shortcuts to work in input fields
          const allowInInput = ["escape", "enter"].includes(shortcut.key.toLowerCase())

          if (!isInputField || allowInInput) {
            event.preventDefault()
            event.stopPropagation()
            action()
            return
          }
        }
      }
    }
  }

  document.addEventListener("keydown", handleKeyDown)

  // Return cleanup function
  return () => document.removeEventListener("keydown", handleKeyDown)
}

/**
 * Get platform-appropriate shortcut for an action
 */
export function getShortcut(keys: string[], shiftKey = false): Shortcut {
  const isModKey = keys.includes("mod")
  const hasShift = keys.includes("shift") || shiftKey

  return {
    key: isModKey ? (keys.find(k => k !== "mod" && k !== "shift") || "enter") : keys[0],
    ctrlKey: !isMac && isModKey,
    metaKey: isMac && isModKey,
    shiftKey: hasShift,
    description: ""
  }
}

/**
 * Export common shortcuts for easy reference
 */
export const CommonShortcuts = {
  generate: [getShortcut(["mod", "enter"])],
  generateAll: [getShortcut(["mod", "shift", "g"])],
  copy: [getShortcut(["mod", "shift", "c"])],
  save: [getShortcut(["mod", "s"])],
  focusInput: [getShortcut(["mod", "1"])],
  focusOutput: [getShortcut(["mod", "2"])],
  undo: [getShortcut(["mod", "z"])],
  redo: [getShortcut(["mod", "shift", "z"])],
  escape: [{ key: "escape" }],
  enter: [{ key: "enter" }]
}
