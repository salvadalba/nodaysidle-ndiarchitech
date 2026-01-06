import { STACK_PRESETS } from "./stacks"
import { makeUserPrompt } from "./compilerPrompt"
import { invoke } from "@tauri-apps/api/core"
import { renderPRD } from "./renderer"
import { renderARD } from "./renderers/renderARD"
import { renderTRD } from "./renderers/renderTRD"
import { renderTASKS } from "./renderers/renderTASKS"
import { renderAGENT } from "./renderers/renderAGENT"
import { save, open } from "@tauri-apps/plugin-dialog"
import { writeTextFile } from "@tauri-apps/plugin-fs"

function isTauri(): boolean {
  return "__TAURI_INTERNALS__" in window
}

// Elements - already present in index.html
const compilerSelect = document.getElementById("compiler") as HTMLSelectElement
const stackSelect = document.getElementById("stack") as HTMLSelectElement
const inputEl = document.getElementById("input") as HTMLTextAreaElement
const outputEl = document.getElementById("output") as HTMLTextAreaElement
const generateBtn = document.getElementById("generate") as HTMLButtonElement

const copyOutputBtn = document.getElementById("copyOutput") as HTMLButtonElement
const copyAgentBtn = document.getElementById("copyAgent") as HTMLButtonElement
const saveOutputBtn = document.getElementById("saveOutput") as HTMLButtonElement
const generateAllBtn = document.getElementById("generateAll") as HTMLButtonElement
const exportFolderBtn = document.getElementById("exportFolder") as HTMLButtonElement
const progressBar = document.getElementById("progressBar") as HTMLDivElement
const statusEl = document.getElementById("status") as HTMLDivElement

// ---- populate stack presets ----
if (stackSelect) {
  for (const stack of STACK_PRESETS) {
    const opt = document.createElement("option")
    opt.value = stack.id
    opt.textContent = `${stack.name} — ${stack.description}`
    stackSelect.appendChild(opt)
  }
}

// ---- UI helpers ----
function updateCopyButtons() {
  const isAgent = compilerSelect.value === "agent"
  // Toggle visibility of agent-specific buttons
  if (copyAgentBtn) copyAgentBtn.style.display = isAgent ? "inline-flex" : "none"
}

let statusTimeout: number | undefined

function setStatus(msg: string, kind: "ok" | "warn" = "ok") {
  if (!statusEl) return
  statusEl.textContent = msg

  statusEl.classList.remove("warn")
  if (kind === "warn") statusEl.classList.add("warn")

  statusEl.classList.add("visible")

  if (statusTimeout) clearTimeout(statusTimeout)
  statusTimeout = setTimeout(() => {
    statusEl.classList.remove("visible")
  }, 3000) as unknown as number
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Clipboard write failed", err)
    // Fallback?
    const ta = document.createElement("textarea")
    ta.value = text
    ta.style.position = "fixed"
    ta.style.left = "-9999px"
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    try {
      document.execCommand("copy")
      document.body.removeChild(ta)
      return true
    } catch (e) {
      document.body.removeChild(ta)
      return false
    }
  }
}

function extractAgentBlocks(
  markdown: string,
  agentLabel: string
): string {
  const fence = "```"
  const pattern =
    "###\\s*" +
    agentLabel +
    "[\\s\\S]*?" +
    fence +
    "([\\s\\S]*?)" +
    fence

  const re = new RegExp(pattern, "g")

  const blocks: string[] = []
  let m: RegExpExecArray | null

  while ((m = re.exec(markdown)) !== null) {
    blocks.push(m[1].trim())
  }

  return blocks.join("\n\n---\n\n").trim()
}

// ---- Event Listeners ----
if (compilerSelect) {
  compilerSelect.addEventListener("change", updateCopyButtons)
  // Init state
  updateCopyButtons()
}

if (copyOutputBtn) {
  copyOutputBtn.addEventListener("click", async () => {
    if (!outputEl.value.trim()) return setStatus("Nothing to copy.", "warn")
    await copyText(outputEl.value)
    setStatus("Copied output ✓")
  })
}

if (copyAgentBtn) {
  copyAgentBtn.addEventListener("click", async () => {
    const text = extractAgentBlocks(outputEl.value, "Universal Agent Prompt")
    if (!text) return setStatus("No agent prompts found.", "warn")
    await copyText(text)
    setStatus("Copied Agent prompts ✓")
  })
}

if (saveOutputBtn) {
  saveOutputBtn.addEventListener("click", async () => {
    const content = outputEl.value.trim()
    if (!content) return setStatus("Nothing to save.", "warn")

    try {
      const filePath = await save({
        defaultPath: `${compilerSelect.value.toUpperCase()}_output.md`,
        filters: [{ name: "Markdown", extensions: ["md"] }]
      })

      if (filePath) {
        await writeTextFile(filePath, content)
        setStatus("Saved ✓")
      }
    } catch (err) {
      console.error("Save failed", err)
      setStatus("Save failed", "warn")
    }
  })
}

if (generateBtn) {
  generateBtn.addEventListener("click", async () => {
    // UI Loading state
    generateBtn.disabled = true
    const originalText = generateBtn.querySelector("span")?.textContent || "Generate"
    const spanEl = generateBtn.querySelector("span")
    if (spanEl) spanEl.textContent = "Compiling..."
    outputEl.value = "Generating..."
    outputEl.classList.add("pulse")
    if (progressBar) progressBar.classList.add("active")

    try {
      const selectedStack = STACK_PRESETS.find(s => s.id === stackSelect.value)
      const userPrompt = makeUserPrompt(
        inputEl.value,
        compilerSelect.value,
        selectedStack
      )

      const payload = `COMPILER: ${compilerSelect.value}
${userPrompt}`

      if (!isTauri()) {
        outputEl.value = "⚠️ Running in browser mode.\n\nUse `npx tauri dev` to generate outputs."
        // Fallback for demo/debug
        throw new Error("Tauri not detected")
      }

      const raw = await invoke<string>("compile_prd", { input: payload })

      const clean = raw
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")

      // Helper to safely parse
      let data: any
      try {
        data = JSON.parse(clean)
      } catch (e) {
        // If JSON parse fails, show raw output (handled by error block mostly, but user might want to see partials)
        console.error("JSON Parse Error", e)
        throw new Error("Received invalid JSON from compiler. Check console for raw output.")
      }

      switch (compilerSelect.value) {
        case "prd":
          outputEl.value = renderPRD(data)
          break
        case "ard":
          outputEl.value = renderARD(data)
          break
        case "trd":
          outputEl.value = renderTRD(data)
          break
        case "tasks":
          outputEl.value = renderTASKS(data)
          break
        case "agent":
          outputEl.value = renderAGENT(data)
          break
        default:
          outputEl.value = JSON.stringify(data, null, 2)
      }

      setStatus("Compilation Complete ✓")

    } catch (err: any) {
      console.error(err)
      outputEl.value = `ERROR:\n${String(err.message || err)}`
      setStatus("Compilation Failed", "warn")
    } finally {
      generateBtn.disabled = false
      const spanEl = generateBtn.querySelector("span")
      if (spanEl) spanEl.textContent = originalText
      outputEl.classList.remove("pulse")
      if (progressBar) progressBar.classList.remove("active")
    }
  })
}

// ---- Generate All (PRD + ARD + TRD + TASKS + AGENT) ----
const MODES = ["prd", "ard", "trd", "tasks", "agent"] as const
const MODE_NAMES: Record<string, string> = {
  prd: "PRD",
  ard: "ARD",
  trd: "TRD",
  tasks: "TASKS",
  agent: "AGENT"
}

const renderers: Record<string, (data: any) => string> = {
  prd: renderPRD,
  ard: renderARD,
  trd: renderTRD,
  tasks: renderTASKS,
  agent: renderAGENT
}

if (generateAllBtn) {
  generateAllBtn.addEventListener("click", async () => {
    if (!isTauri()) {
      outputEl.value = "⚠️ Running in browser mode.\n\nUse `npx tauri dev` to generate outputs."
      return
    }

    generateAllBtn.disabled = true
    generateBtn.disabled = true
    if (progressBar) progressBar.classList.add("active")

    const results: string[] = []
    const selectedStack = STACK_PRESETS.find(s => s.id === stackSelect.value)

    try {
      for (const mode of MODES) {
        outputEl.value = `Generating ${MODE_NAMES[mode]}...`

        try {
          const userPrompt = makeUserPrompt(inputEl.value, mode, selectedStack)
          const payload = `COMPILER: ${mode}\n${userPrompt}`

          const raw = await invoke<string>("compile_prd", { input: payload })
          const clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
          const data = JSON.parse(clean)
          const rendered = renderers[mode](data)

          results.push(`# ${MODE_NAMES[mode]}\n\n${rendered}`)
        } catch (err: any) {
          // If one mode fails, show error but continue with others
          console.error(`${mode} failed:`, err)
          results.push(`# ${MODE_NAMES[mode]}\n\n⚠️ **Generation Failed**\n\n\`\`\`\n${String(err.message || err)}\n\`\`\``)
        }
      }

      outputEl.value = results.join("\n\n---\n\n")
      setStatus("Generated All Documents ✓")
    } catch (err: any) {
      console.error(err)
      outputEl.value = `ERROR:\n${String(err.message || err)}`
      setStatus("Generation Failed", "warn")
    } finally {
      generateAllBtn.disabled = false
      generateBtn.disabled = false
      if (progressBar) progressBar.classList.remove("active")
    }
  })
}

// ---- Export to Folder ----
if (exportFolderBtn) {
  exportFolderBtn.addEventListener("click", async () => {
    const content = outputEl.value.trim()
    if (!content) return setStatus("Nothing to export.", "warn")

    try {
      const folderPath = await open({
        directory: true,
        title: "Select export folder"
      })

      if (folderPath && typeof folderPath === "string") {
        // Check if this is a combined "Generate All" output
        const isCombined = content.includes("# PRD") && content.includes("# ARD")

        if (isCombined) {
          // Split by section headers and save separately
          const sections = content.split(/\n---\n/)
          let exportCount = 0

          for (const section of sections) {
            const match = section.match(/^# (PRD|ARD|TRD|TASKS|AGENT)/)
            if (match) {
              const docType = match[1]
              const docContent = section.replace(/^# (PRD|ARD|TRD|TASKS|AGENT)\n\n/, "")
              const filename = `${docType}.md`
              const fullPath = `${folderPath}/${filename}`
              await writeTextFile(fullPath, docContent)
              exportCount++
            }
          }

          setStatus(`Exported ${exportCount} files ✓`)
        } else {
          // Single file export
          const filename = `${compilerSelect.value.toUpperCase()}.md`
          const fullPath = `${folderPath}/${filename}`
          await writeTextFile(fullPath, content)
          setStatus(`Exported to ${filename} ✓`)
        }
      }
    } catch (err) {
      console.error("Export failed", err)
      setStatus("Export failed", "warn")
    }
  })
}