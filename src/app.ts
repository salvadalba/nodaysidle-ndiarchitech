import { STACK_PRESETS } from "./stacks"
import { VERTICALS } from "./verticals"
import { parseChainOutput, renderDependencyGraph } from "./graph"
import { makeUserPrompt } from "./compilerPrompt"
import { invoke } from "@tauri-apps/api/core"
import { renderPRD } from "./renderer"
import { renderARD } from "./renderers/renderARD"
import { renderTRD } from "./renderers/renderTRD"
import { renderTASKS } from "./renderers/renderTASKS"
import { renderAGENT } from "./renderers/renderAGENT"
import { renderIMAGE } from "./renderers/renderIMAGE"
import { renderVIDEO } from "./renderers/renderVIDEO"
import { renderDESIGN } from "./renderers/renderDESIGN"
import { renderADVISOR } from "./renderers/renderADVISOR"
import { renderAUDIT } from "./renderers/renderAUDIT"
import { renderANALYZE } from "./renderers/renderANALYZE"
import { renderCOMPETE } from "./renderers/renderCOMPETE"
import { generateClaudeMd, generateBuildSh } from "./scaffold"

import { save, open } from "@tauri-apps/plugin-dialog"
import { writeTextFile } from "@tauri-apps/plugin-fs"
import Database from "@tauri-apps/plugin-sql"

function isTauri(): boolean {
  return "__TAURI_INTERNALS__" in window
}

// Database instance
let db: Database | null = null
let dbReady = false

// Project history type
interface Project {
  id: number
  name: string
  input: string
  output: string
  mode: string
  stack: string
  created_at: string
  chain_outputs: string | null
}

// Chain state - persists per-step outputs after chain run
let chainOutputs: Record<string, string> = {}
let chainRawOutputs: Record<string, string> = {}
let isChainResult = false
let activeChainTab = "prd"
let editedTabs = new Set<string>()

// Elements - already present in index.html
const compilerSelect = document.getElementById("compiler") as HTMLInputElement
const compilerWrapper = document.getElementById("compiler-wrapper") as HTMLDivElement
const compilerDisplay = document.getElementById("compiler-display") as HTMLDivElement
const compilerOptions = document.getElementById("compiler-options") as HTMLDivElement
const stackSelect = document.getElementById("stack") as HTMLSelectElement
const inputEl = document.getElementById("input") as HTMLTextAreaElement
const outputEl = document.getElementById("output") as HTMLTextAreaElement
const generateBtn = document.getElementById("generate") as HTMLButtonElement

const copyOutputBtn = document.getElementById("copyOutput") as HTMLButtonElement
const copyAgentBtn = document.getElementById("copyAgent") as HTMLButtonElement
const saveOutputBtn = document.getElementById("saveOutput") as HTMLButtonElement
const generateAllBtn = document.getElementById("generateAll") as HTMLButtonElement
const chainGenerateBtn = document.getElementById("chainGenerate") as HTMLButtonElement
const exportFolderBtn = document.getElementById("exportFolder") as HTMLButtonElement
const toggleGraphBtn = document.getElementById("toggleGraph") as HTMLButtonElement
const graphView = document.getElementById("graphView") as HTMLDivElement
const graphSvg = document.getElementById("dependencyGraph") as unknown as SVGSVGElement
const progressBar = document.getElementById("progressBar") as HTMLDivElement
const statusEl = document.getElementById("status") as HTMLDivElement
const statTimeEl = document.getElementById("statTime") as HTMLSpanElement
const statTokensEl = document.getElementById("statTokens") as HTMLSpanElement
const saveProjectBtn = document.getElementById("saveProject") as HTMLButtonElement
const historyListEl = document.getElementById("historyList") as HTMLDivElement
const chainTabBar = document.getElementById("chainTabBar") as HTMLDivElement
const rechainBtn = document.getElementById("rechainBtn") as HTMLButtonElement
const verticalSelect = document.getElementById("vertical") as HTMLSelectElement
const verticalWrapper = document.getElementById("verticalWrapper") as HTMLDivElement
const analyzeFolderSection = document.getElementById("analyzeFolderSection") as HTMLDivElement
const analyzeFolderBtn = document.getElementById("analyzeFolderBtn") as HTMLButtonElement
const analyzeFolderPath = document.getElementById("analyzeFolderPath") as HTMLSpanElement
const auditChainNotice = document.getElementById("auditChainNotice") as HTMLDivElement
const competeUrlSection = document.getElementById("competeUrlSection") as HTMLDivElement
const competeUrlInput = document.getElementById("competeUrlInput") as HTMLInputElement

/** Always use Claude CLI — no provider switching needed */
function getLlmParams(): { llmProvider: string; llmModel: string; llmApiKey: string } {
  return { llmProvider: "claude", llmModel: "", llmApiKey: "" }
}

let selectedFolderPath = ""

// ---- Chain Tab Bar Functions ----
function showChainTabBar() {
  if (chainTabBar) chainTabBar.classList.remove("hidden")
  switchChainTab(MODES[0])
}

function hideChainTabBar() {
  if (chainTabBar) chainTabBar.classList.add("hidden")
  isChainResult = false
}

function switchChainTab(mode: string) {
  activeChainTab = mode
  chainTabBar?.querySelectorAll(".chain-tab").forEach(tab => {
    const tabEl = tab as HTMLElement
    tabEl.classList.toggle("active", tabEl.dataset.mode === mode)
  })
  if (chainOutputs[mode]) {
    outputEl.value = chainOutputs[mode]
  }
}

function setTabState(mode: string, state: "regenerating" | "done" | "error") {
  const tab = chainTabBar?.querySelector(`[data-mode="${mode}"]`) as HTMLElement
  if (!tab) return
  tab.classList.remove("regenerating")
  if (state === "regenerating") tab.classList.add("regenerating")
}

function setTabEdited(mode: string, edited: boolean) {
  const tab = chainTabBar?.querySelector(`[data-mode="${mode}"]`) as HTMLElement
  if (!tab) return
  tab.classList.toggle("edited", edited)
}

// ---- populate stack presets ----
if (stackSelect) {
  for (const stack of STACK_PRESETS) {
    const opt = document.createElement("option")
    opt.value = stack.id
    opt.textContent = `${stack.name} — ${stack.description}`
    stackSelect.appendChild(opt)
  }
}

// ---- Custom dropdown for Compiler Mode ----
if (compilerWrapper && compilerDisplay && compilerOptions) {
  // Toggle dropdown open/close
  compilerDisplay.addEventListener("click", () => {
    compilerWrapper.classList.toggle("open")
  })

  // Handle option selection
  compilerOptions.addEventListener("click", (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains("option")) {
      const value = target.dataset.value
      if (value) {
        // Update hidden input value
        compilerSelect.value = value

        // Update selected state
        compilerOptions.querySelectorAll(".option").forEach(opt => {
          opt.classList.remove("selected")
        })
        target.classList.add("selected")

        // Close dropdown
        compilerWrapper.classList.remove("open")

        // Trigger change event for updateCopyButtons
        compilerSelect.dispatchEvent(new Event("change"))
      }
    }
  })

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!compilerWrapper.contains(e.target as Node)) {
      compilerWrapper.classList.remove("open")
    }
  })
}



// ---- Stats helper ----
function updateStats(timeMs: number, outputText: string) {
  const timeSec = (timeMs / 1000).toFixed(1)
  const tokens = Math.round(outputText.length / 4) // ~4 chars per token estimate
  if (statTimeEl) statTimeEl.textContent = `⏱️ ${timeSec}s`
  if (statTokensEl) statTokensEl.textContent = `📊 ~${tokens} tokens`
}

// ---- UI helpers ----
function updateCopyButtons() {
  const mode = compilerSelect.value
  const isAgent = mode === "agent"
  const isMediaMode = mode === "image" || mode === "video" || mode === "design" || mode === "advisor" || mode === "audit" || mode === "analyze" || mode === "compete"

  // Toggle visibility of agent-specific buttons
  if (copyAgentBtn) copyAgentBtn.style.display = isAgent ? "inline-flex" : "none"

  // Hide stack selector and multi-generate buttons for image/video/design modes
  const stackWrapper = stackSelect?.parentElement
  if (stackWrapper) stackWrapper.style.display = isMediaMode ? "none" : "block"
  if (generateAllBtn) generateAllBtn.style.display = isMediaMode ? "none" : "inline-flex"
  if (chainGenerateBtn) chainGenerateBtn.style.display = isMediaMode ? "none" : "inline-flex"

  // Show/hide design image upload section
  const designImageSection = document.getElementById("designImageSection")
  if (designImageSection) designImageSection.style.display = mode === "design" ? "block" : "none"

  // Show/hide vertical selector (only for document modes: prd, ard, trd, tasks, agent)
  if (verticalWrapper) verticalWrapper.style.display = isMediaMode ? "none" : "block"

  // Show/hide analyze folder picker
  if (analyzeFolderSection) analyzeFolderSection.style.display = mode === "analyze" ? "block" : "none"

  // Show/hide compete URL input
  if (competeUrlSection) competeUrlSection.style.display = mode === "compete" ? "block" : "none"

  // Show/hide audit chain notice
  if (auditChainNotice) {
    auditChainNotice.style.display = (mode === "audit" && isChainResult && Object.keys(chainOutputs).length > 0) ? "flex" : "none"
  }
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

// Timeout wrapper for async operations
const GENERATION_TIMEOUT_MS = 240000 // 4 minutes

async function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMsg)), ms)
  )
  return Promise.race([promise, timeout])
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

    const startTime = Date.now()

    try {
      const selectedStack = STACK_PRESETS.find(s => s.id === stackSelect.value)
      const vertical = getSelectedVertical()

      // Build input text based on mode
      let inputText = inputEl.value

      if (compilerSelect.value === "design" && designImageAnalysis) {
        inputText += `\n\n${designImageAnalysis}`
      }

      // AUDIT: auto-feed chain output if available
      if (compilerSelect.value === "audit" && isChainResult && Object.keys(chainOutputs).length > 0) {
        const chainDocs = MODES.map(m =>
          chainOutputs[m] ? `=== ${MODE_NAMES[m]} ===\n${chainOutputs[m]}` : ""
        ).filter(Boolean).join("\n\n---\n\n")
        inputText = inputText
          ? `${inputText}\n\n--- CHAIN OUTPUT TO AUDIT ---\n${chainDocs}`
          : chainDocs
      }

      // ANALYZE: use folder path instead of text input
      if (compilerSelect.value === "analyze") {
        if (!selectedFolderPath) {
          throw new Error("Please select a project folder first using the folder picker.")
        }
        inputText = selectedFolderPath
      }

      // COMPETE: build payload with URL as first line (bash script uses head -1)
      let payload: string
      if (compilerSelect.value === "compete") {
        const url = competeUrlInput?.value?.trim()
        if (!url) {
          throw new Error("Please enter a competitor URL to analyze.")
        }
        const notes = inputText.trim()
        payload = `COMPILER: compete\n${url}${notes ? "\n" + notes : ""}`
      } else {
        const userPrompt = makeUserPrompt(
          inputText,
          compilerSelect.value,
          selectedStack,
          vertical
        )
        payload = `COMPILER: ${compilerSelect.value}\n${userPrompt}`
      }

      if (!isTauri()) {
        outputEl.value = "⚠️ Running in browser mode.\n\nUse `npx tauri dev` to generate outputs."
        throw new Error("Tauri not detected")
      }

      const raw = await withTimeout(
        invoke<string>("compile_prd", { input: payload, ...getLlmParams() }),
        GENERATION_TIMEOUT_MS,
        "Generation timed out after 4 minutes. Claude CLI may be unresponsive."
      )

      const clean = raw
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")

      let data: Record<string, unknown>
      try {
        data = JSON.parse(clean) as Record<string, unknown>
      } catch (e) {
        console.error("JSON Parse Error", e)
        const preview = clean.length > 500 ? clean.substring(0, 500) + "..." : clean
        throw new Error(`Invalid JSON from compiler:\n\n${preview}`)
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
        case "image":
          outputEl.value = renderIMAGE(data)
          break
        case "video":
          outputEl.value = renderVIDEO(data)
          break
        case "design":
          outputEl.value = renderDESIGN(data)
          break
        case "advisor":
          outputEl.value = renderADVISOR(data)
          break
        case "audit":
          outputEl.value = renderAUDIT(data)
          break
        case "analyze":
          outputEl.value = renderANALYZE(data)
          break
        case "compete":
          outputEl.value = renderCOMPETE(data)
          break
        default:
          outputEl.value = JSON.stringify(data, null, 2)
      }

      const elapsed = Date.now() - startTime
      updateStats(elapsed, outputEl.value)
      setStatus("Compilation Complete ✓")
      hideChainTabBar()

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
const MODES = ["prd", "ard", "trd", "tasks", "agent", "design"] as const
const MODE_NAMES: Record<string, string> = {
  prd: "PRD",
  ard: "ARD",
  trd: "TRD",
  tasks: "TASKS",
  agent: "AGENT",
  design: "DESIGN"
}

const renderers: Record<string, (data: any) => string> = {
  prd: renderPRD,
  ard: renderARD,
  trd: renderTRD,
  tasks: renderTASKS,
  agent: renderAGENT,
  image: renderIMAGE,
  video: renderVIDEO,
  design: renderDESIGN,
  advisor: renderADVISOR,
  audit: renderAUDIT,
  analyze: renderANALYZE,
  compete: renderCOMPETE
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
    const vertical = getSelectedVertical()

    try {
      for (const mode of MODES) {
        outputEl.value = `Generating ${MODE_NAMES[mode]}...`

        try {
          const userPrompt = makeUserPrompt(inputEl.value, mode, selectedStack, vertical)
          const payload = `COMPILER: ${mode}\n${userPrompt}`

          const raw = await invoke<string>("compile_prd", { input: payload, ...getLlmParams() })
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
        // Chain result: export each mode from chainOutputs directly
        if (isChainResult && Object.keys(chainOutputs).length > 0) {
          let exportCount = 0

          for (const mode of MODES) {
            if (chainOutputs[mode]) {
              const filename = `${MODE_NAMES[mode]}.md`
              const fullPath = `${folderPath}/${filename}`
              await writeTextFile(fullPath, chainOutputs[mode])
              exportCount++
            }
          }

          // Auto-generate CLAUDE.md + build.sh from chain data
          try {
            const selectedStack = STACK_PRESETS.find(s => s.id === stackSelect.value)
            const claudeMd = generateClaudeMd(chainRawOutputs, selectedStack)
            await writeTextFile(`${folderPath}/CLAUDE.md`, claudeMd)
            exportCount++

            // Derive project name for build.sh header
            let projName = "Untitled Project"
            if (chainRawOutputs.agent) {
              try { projName = JSON.parse(chainRawOutputs.agent).project_name ?? projName } catch {}
            }
            if (projName === "Untitled Project" && chainRawOutputs.prd) {
              try { projName = JSON.parse(chainRawOutputs.prd).product_name ?? JSON.parse(chainRawOutputs.prd).title ?? projName } catch {}
            }

            const buildSh = generateBuildSh(projName)
            await writeTextFile(`${folderPath}/build.sh`, buildSh)
            exportCount++
          } catch (scaffoldErr) {
            console.warn("Scaffold generation failed (non-fatal):", scaffoldErr)
          }

          setStatus(`Exported ${exportCount} files (incl. CLAUDE.md + build.sh) ✓`)
          return
        }

        // Generate All combined output: split by section headers
        const isCombined = content.includes("# PRD") && content.includes("# ARD")

        if (isCombined) {
          const sections = content.split(/\n\n---\n\n/)
          let exportCount = 0

          for (const section of sections) {
            const match = section.match(/^# (PRD|ARD|TRD|TASKS|AGENT|DESIGN)/)
            if (match) {
              const docType = match[1]
              const docContent = section.replace(/^# (PRD|ARD|TRD|TASKS|AGENT|DESIGN)\n\n/, "")
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

// ---- Chain Generate (PRD → ARD → TRD → TASKS → AGENT with auto-feeding) ----
if (chainGenerateBtn) {
  chainGenerateBtn.addEventListener("click", async () => {
    if (!isTauri()) {
      outputEl.value = "⚠️ Running in browser mode.\n\nUse `npx tauri dev` to generate outputs."
      return
    }

    chainGenerateBtn.disabled = true
    generateAllBtn.disabled = true
    generateBtn.disabled = true
    if (progressBar) progressBar.classList.add("active")

    const startTime = Date.now()
    const results: Record<string, string> = {}
    const selectedStack = STACK_PRESETS.find(s => s.id === stackSelect.value)
    const vertical = getSelectedVertical()

    // Start with user's original input
    let contextInput = inputEl.value

    try {
      for (const mode of MODES) {
        outputEl.value = `⛓️ Chain Mode: Generating ${MODE_NAMES[mode]}...`

        // Build input: original + accumulated context from previous outputs
        let chainInput = contextInput
        if (mode === "ard" && results.prd) {
          chainInput += `\n\n--- PRD OUTPUT ---\n${results.prd}`
        } else if (mode === "trd" && results.ard) {
          chainInput += `\n\n--- ARD OUTPUT ---\n${results.ard}`
        } else if (mode === "tasks" && results.trd) {
          chainInput += `\n\n--- TRD OUTPUT ---\n${results.trd}`
        } else if (mode === "agent" && results.tasks) {
          chainInput += `\n\n--- TASKS OUTPUT ---\n${results.tasks}`
        } else if (mode === "design" && results.agent) {
          chainInput += `\n\n--- AGENT OUTPUT ---\n${results.agent}`
        }

        const userPrompt = makeUserPrompt(chainInput, mode, selectedStack, vertical)
        const payload = `COMPILER: ${mode}\n${userPrompt}`

        try {
          const raw = await invoke<string>("compile_prd", { input: payload, ...getLlmParams() })
          const clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
          const data = JSON.parse(clean)
          const rendered = renderers[mode](data)
          results[mode] = rendered
          chainRawOutputs[mode] = clean
        } catch (err: any) {
          console.error(`${mode} failed:`, err)
          results[mode] = `⚠️ **${MODE_NAMES[mode]} Failed**\n\n\`\`\`\n${String(err.message || err)}\n\`\`\``
        }
      }

      // Store per-step outputs for tab bar
      chainOutputs = { ...results }
      isChainResult = true
      editedTabs.clear()

      // Combine all results
      const combined = MODES.map(mode =>
        `# ${MODE_NAMES[mode]}\n\n${results[mode]}`
      ).join("\n\n---\n\n")

      outputEl.value = combined

      // Show tab bar and switch to first tab
      showChainTabBar()

      const elapsed = Date.now() - startTime
      updateStats(elapsed, combined)
      setStatus("⛓️ Chain Complete ✓")

    } catch (err: any) {
      console.error(err)
      outputEl.value = `ERROR:\n${String(err.message || err)}`
      setStatus("Chain Failed", "warn")
    } finally {
      chainGenerateBtn.disabled = false
      generateAllBtn.disabled = false
      generateBtn.disabled = false
      if (progressBar) progressBar.classList.remove("active")
    }
  })
}

// ---- Project History (SQLite) ----
async function initDatabase() {
  if (!isTauri()) {
    console.warn("Not in Tauri environment, skipping DB init")
    return
  }
  try {
    console.log("[DB] Loading sqlite:nodaysidle.db...")
    db = await Database.load("sqlite:nodaysidle.db")
    console.log("[DB] Database loaded successfully")
    dbReady = true
    await refreshHistory()
    console.log("[DB] History refreshed, dbReady =", dbReady)
  } catch (err) {
    console.error("[DB] Failed to init database:", err)
    setStatus("Project history unavailable", "warn")
  }
}

async function saveProject() {
  console.log("[DB] Save clicked. dbReady =", dbReady, "db =", !!db)

  if (!db || !dbReady) {
    // Try to re-initialize if DB wasn't ready
    if (isTauri() && !db) {
      setStatus("Connecting to database...", "warn")
      try {
        db = await Database.load("sqlite:nodaysidle.db")
        dbReady = true
        console.log("[DB] Late init succeeded")
      } catch (err) {
        console.error("[DB] Late init failed:", err)
        setStatus("Database unavailable - cannot save", "warn")
        return
      }
    } else {
      setStatus("Database not available", "warn")
      return
    }
  }

  if (!outputEl.value.trim()) {
    setStatus("Nothing to save — generate first", "warn")
    return
  }

  const name = inputEl.value.trim().substring(0, 50) || "Untitled Project"
  const chainData = isChainResult ? JSON.stringify(chainOutputs) : null

  try {
    await db.execute(
      "INSERT INTO projects (name, input, output, mode, stack, chain_outputs) VALUES ($1, $2, $3, $4, $5, $6)",
      [name, inputEl.value, outputEl.value, compilerSelect.value, stackSelect.value, chainData]
    )
    setStatus("Project saved ✓")
    await refreshHistory()
  } catch (err: any) {
    console.error("[DB] Save failed:", err)
    setStatus(`Save failed: ${err?.message || err}`, "warn")
  }
}

async function loadProject(project: Project) {
  inputEl.value = project.input
  outputEl.value = project.output
  compilerSelect.value = project.mode
  stackSelect.value = project.stack

  // Update custom dropdown visual state
  if (compilerOptions) {
    compilerOptions.querySelectorAll(".option").forEach(opt => {
      opt.classList.remove("selected")
      if ((opt as HTMLElement).dataset.value === project.mode) {
        opt.classList.add("selected")
      }
    })
  }

  // Restore chain state if present
  if (project.chain_outputs) {
    try {
      chainOutputs = JSON.parse(project.chain_outputs)
      isChainResult = true
      activeChainTab = "prd"
      editedTabs.clear()
      showChainTabBar()
    } catch {
      hideChainTabBar()
    }
  } else {
    hideChainTabBar()
  }

  setStatus(`Loaded: ${project.name}`)
}

async function deleteProject(id: number) {
  if (!db) return

  try {
    await db.execute("DELETE FROM projects WHERE id = $1", [id])
    setStatus("Project deleted")
    await refreshHistory()
  } catch (err) {
    console.error("Delete failed:", err)
  }
}

async function refreshHistory() {
  if (!db || !historyListEl) return

  try {
    const projects = await db.select<Project[]>(
      "SELECT * FROM projects ORDER BY created_at DESC LIMIT 20"
    )

    if (projects.length === 0) {
      historyListEl.innerHTML = '<span class="history-empty">No saved projects</span>'
      return
    }

    historyListEl.innerHTML = projects.map(p => {
      const date = new Date(p.created_at).toLocaleDateString()
      return `
        <div class="history-item" data-id="${p.id}">
          <span class="history-item-name">${escapeHtml(p.name)}</span>
          <span class="history-item-date">${date}</span>
          <button class="history-item-delete" data-id="${p.id}">✕</button>
        </div>
      `
    }).join("")

    // Add click listeners for load
    historyListEl.querySelectorAll(".history-item").forEach(el => {
      el.addEventListener("click", async (e) => {
        const target = e.target as HTMLElement
        if (target.classList.contains("history-item-delete")) return

        const id = parseInt((el as HTMLElement).dataset.id || "0")
        const project = projects.find(p => p.id === id)
        if (project) loadProject(project)
      })
    })

    // Add click listeners for delete
    historyListEl.querySelectorAll(".history-item-delete").forEach(el => {
      el.addEventListener("click", async (e) => {
        e.stopPropagation()
        const id = parseInt((el as HTMLElement).dataset.id || "0")
        await deleteProject(id)
      })
    })
  } catch (err) {
    console.error("Failed to load history:", err)
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Quick template chips
document.querySelectorAll(".template-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const template = (chip as HTMLElement).dataset.template || ""
    inputEl.value = template
    inputEl.focus()
    // Place cursor at end of template text
    inputEl.setSelectionRange(template.length, template.length)
  })
})

// Save project button
if (saveProjectBtn) {
  saveProjectBtn.addEventListener("click", saveProject)
  console.log("[DB] Save button wired")
} else {
  console.warn("[DB] saveProjectBtn not found in DOM")
}

// ============================================================================
// INLINE EDITING
// ============================================================================

const toggleEditBtn = document.getElementById("toggleEdit") as HTMLButtonElement
const editIndicator = document.getElementById("editIndicator") as HTMLDivElement
const resetOutputBtn = document.getElementById("resetOutput") as HTMLButtonElement

let originalOutput: string = ""
let isEditing = false

function toggleEditMode() {
  isEditing = !isEditing

  if (isEditing) {
    // Enable editing
    originalOutput = outputEl.value
    outputEl.removeAttribute("readonly")
    toggleEditBtn?.classList.add("active")
    editIndicator?.classList.remove("hidden")
    setStatus("Editing enabled - make your changes")
  } else {
    // Disable editing — capture changes back to chain state if applicable
    if (isChainResult && activeChainTab) {
      chainOutputs[activeChainTab] = outputEl.value
      setTabEdited(activeChainTab, true)
    }
    outputEl.setAttribute("readonly", "")
    toggleEditBtn?.classList.remove("active")
    editIndicator?.classList.add("hidden")
  }
}

function resetOutput() {
  outputEl.value = originalOutput
  setStatus("Output reset to original")
}

if (toggleEditBtn) {
  toggleEditBtn.addEventListener("click", toggleEditMode)
}

if (resetOutputBtn) {
  resetOutputBtn.addEventListener("click", resetOutput)
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

// Detect platform
const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
const modKey = isMac ? "metaKey" : "ctrlKey"

document.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement
  const isInputField = target.tagName === "INPUT" ||
    (target.tagName === "TEXTAREA" && target.id !== "output") ||
    target.tagName === "SELECT" ||
    target.contentEditable === "true"

  // Cmd/Ctrl + Enter = Generate
  if (event[modKey] && event.key === "Enter" && !isInputField) {
    event.preventDefault()
    generateBtn?.click()
  }

  // Cmd/Ctrl + Shift + G = Generate All
  if (event[modKey] && event.shiftKey && event.key.toLowerCase() === "g" && !isInputField) {
    event.preventDefault()
    generateAllBtn?.click()
  }

  // Cmd/Ctrl + Shift + C = Copy Output
  if (event[modKey] && event.shiftKey && event.key.toLowerCase() === "c" && !isInputField) {
    event.preventDefault()
    copyOutputBtn?.click()
  }

  // Cmd/Ctrl + S = Save Output
  if (event[modKey] && event.key.toLowerCase() === "s" && !isInputField) {
    event.preventDefault()
    saveOutputBtn?.click()
  }

  // Cmd/Ctrl + E = Toggle Edit Mode
  if (event[modKey] && event.key.toLowerCase() === "e" && !isInputField) {
    event.preventDefault()
    toggleEditBtn?.click()
  }

  // Cmd/Ctrl + 1 = Focus Input
  if (event[modKey] && event.key === "1") {
    event.preventDefault()
    inputEl?.focus()
  }

  // Cmd/Ctrl + 2 = Focus Output
  if (event[modKey] && event.key === "2") {
    event.preventDefault()
    outputEl?.focus()
  }

  // Escape = Exit edit mode
  if (event.key === "Escape" && isEditing && !isInputField) {
    event.preventDefault()
    toggleEditMode()
  }
})

// ============================================================================
// CHAIN TAB BAR EVENT HANDLERS
// ============================================================================

if (chainTabBar) {
  chainTabBar.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest(".chain-tab") as HTMLElement
    if (target?.dataset.mode) {
      switchChainTab(target.dataset.mode)
    }
  })
}

async function rechainFrom(startMode: string) {
  const startIdx = MODES.indexOf(startMode as typeof MODES[number])
  if (startIdx < 0) return

  const selectedStack = STACK_PRESETS.find(s => s.id === stackSelect.value)
  const vertical = getSelectedVertical()

  generateBtn.disabled = true
  generateAllBtn.disabled = true
  chainGenerateBtn.disabled = true
  if (progressBar) progressBar.classList.add("active")

  try {
    for (let i = startIdx; i < MODES.length; i++) {
      const mode = MODES[i]
      setTabState(mode, "regenerating")
      outputEl.value = `⛓️ Re-chain: Regenerating ${MODE_NAMES[mode]}...`

      // Build context: original input + immediate predecessor's output
      let chainInput = inputEl.value
      if (i > 0) {
        const prevMode = MODES[i - 1]
        if (chainRawOutputs[prevMode]) {
          chainInput += `\n\n--- ${MODE_NAMES[prevMode]} OUTPUT ---\n${chainRawOutputs[prevMode]}`
        }
      }

      const userPrompt = makeUserPrompt(chainInput, mode, selectedStack, vertical)
      const payload = `COMPILER: ${mode}\n${userPrompt}`

      try {
        const raw = await invoke<string>("compile_prd", { input: payload, ...getLlmParams() })
        const clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
        const data = JSON.parse(clean)
        const rendered = renderers[mode](data)

        chainOutputs[mode] = rendered
        chainRawOutputs[mode] = clean
        setTabState(mode, "done")
        setTabEdited(mode, false)
      } catch (err: any) {
        console.error(`Re-chain ${mode} failed:`, err)
        chainOutputs[mode] = `⚠️ **${MODE_NAMES[mode]} Failed**\n\n\`\`\`\n${String(err.message || err)}\n\`\`\``
        setTabState(mode, "error")
      }
    }

    // Show the active tab's updated content
    switchChainTab(activeChainTab)
    setStatus("⛓️ Re-chain Complete ✓")
  } catch (err: any) {
    console.error(err)
    setStatus("Re-chain Failed", "warn")
  } finally {
    generateBtn.disabled = false
    generateAllBtn.disabled = false
    chainGenerateBtn.disabled = false
    if (progressBar) progressBar.classList.remove("active")
  }
}

if (rechainBtn) {
  rechainBtn.addEventListener("click", async () => {
    if (!isChainResult || !activeChainTab) return

    const currentIdx = MODES.indexOf(activeChainTab as typeof MODES[number])
    if (currentIdx < 0 || currentIdx >= MODES.length - 1) {
      setStatus("Nothing to re-chain after this step", "warn")
      return
    }

    rechainBtn.disabled = true
    await rechainFrom(MODES[currentIdx + 1])
    rechainBtn.disabled = false
  })
}

// Initialize database on load
initDatabase()
  .then(() => { if (dbReady) setStatus("Project history ready") })
  .catch((err) => setStatus(`DB init failed: ${err}`, "warn"))

// ============================================================================
// VERTICAL HELPER
// ============================================================================

function getSelectedVertical() {
  if (!verticalSelect || !verticalSelect.value) return undefined
  return VERTICALS.find(v => v.id === verticalSelect.value)
}

// ============================================================================
// ANALYZE MODE - Folder Picker
// ============================================================================

if (analyzeFolderBtn) {
  analyzeFolderBtn.addEventListener("click", async () => {
    try {
      const folderPath = await open({
        directory: true,
        title: "Select project folder to analyze"
      })

      if (folderPath && typeof folderPath === "string") {
        selectedFolderPath = folderPath
        if (analyzeFolderPath) {
          analyzeFolderPath.textContent = folderPath
          analyzeFolderPath.title = folderPath
        }
      }
    } catch (err) {
      console.error("Folder picker failed", err)
      setStatus("Failed to select folder", "warn")
    }
  })
}

// ============================================================================
// DESIGN MODE - Reference Image Upload
// ============================================================================

const designImageInput = document.getElementById("designImageInput") as HTMLInputElement
const designImageDrop = document.getElementById("designImageDrop") as HTMLDivElement
const designDropContent = document.getElementById("designDropContent") as HTMLDivElement
const designImagePreview = document.getElementById("designImagePreview") as HTMLDivElement
const designPreviewImg = document.getElementById("designPreviewImg") as HTMLImageElement
const designImageName = document.getElementById("designImageName") as HTMLSpanElement
const designImageClear = document.getElementById("designImageClear") as HTMLButtonElement

let designImageAnalysis: string = ""

// Analyze image using Canvas API for dominant colors
async function analyzeImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const size = 64 // Sample at small size for speed
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, size, size)

      const imageData = ctx.getImageData(0, 0, size, size)
      const pixels = imageData.data

      // Collect color samples
      let totalR = 0, totalG = 0, totalB = 0
      let bright = 0, dark = 0
      let warm = 0, cool = 0
      const colorCounts: Record<string, number> = {}
      const pixelCount = size * size

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]
        totalR += r; totalG += g; totalB += b

        // Brightness
        const lum = 0.299 * r + 0.587 * g + 0.114 * b
        if (lum > 128) bright++; else dark++

        // Temperature
        if (r > b) warm++; else cool++

        // Quantize to rough color buckets
        const qr = Math.round(r / 64) * 64
        const qg = Math.round(g / 64) * 64
        const qb = Math.round(b / 64) * 64
        const key = `rgb(${qr},${qg},${qb})`
        colorCounts[key] = (colorCounts[key] || 0) + 1
      }

      // Top 5 dominant colors
      const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([color, count]) => `${color} (${Math.round(count / pixelCount * 100)}%)`)

      const avgR = Math.round(totalR / pixelCount)
      const avgG = Math.round(totalG / pixelCount)
      const avgB = Math.round(totalB / pixelCount)

      const brightness = bright > dark ? "light" : "dark"
      const temperature = warm > cool ? "warm" : "cool"

      const analysis = [
        `REFERENCE IMAGE ANALYSIS:`,
        `- Filename: ${file.name}`,
        `- Dimensions: ${img.naturalWidth}x${img.naturalHeight}`,
        `- Overall brightness: ${brightness}`,
        `- Color temperature: ${temperature}`,
        `- Average color: rgb(${avgR},${avgG},${avgB})`,
        `- Dominant colors: ${sorted.join(", ")}`,
        `- Use these colors and mood as reference for the design direction.`
      ].join("\n")

      URL.revokeObjectURL(url)
      resolve(analysis)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve("")
    }

    img.src = url
  })
}

function showImagePreview(file: File) {
  const url = URL.createObjectURL(file)
  if (designPreviewImg) designPreviewImg.src = url
  if (designImageName) designImageName.textContent = file.name
  if (designDropContent) designDropContent.classList.add("hidden")
  if (designImagePreview) designImagePreview.classList.remove("hidden")
}

function clearImagePreview() {
  designImageAnalysis = ""
  if (designPreviewImg) designPreviewImg.src = ""
  if (designImageName) designImageName.textContent = ""
  if (designDropContent) designDropContent.classList.remove("hidden")
  if (designImagePreview) designImagePreview.classList.add("hidden")
  if (designImageInput) designImageInput.value = ""
}

async function handleImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    setStatus("Please select an image file", "warn")
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    setStatus("Image too large (max 10MB)", "warn")
    return
  }
  showImagePreview(file)
  designImageAnalysis = await analyzeImage(file)
}

if (designImageInput) {
  designImageInput.addEventListener("change", () => {
    const file = designImageInput.files?.[0]
    if (file) handleImageFile(file)
  })
}

if (designImageClear) {
  designImageClear.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    clearImagePreview()
  })
}

// Drag and drop
if (designImageDrop) {
  designImageDrop.addEventListener("dragover", (e) => {
    e.preventDefault()
    designImageDrop.classList.add("dragover")
  })
  designImageDrop.addEventListener("dragleave", () => {
    designImageDrop.classList.remove("dragover")
  })
  designImageDrop.addEventListener("drop", (e) => {
    e.preventDefault()
    designImageDrop.classList.remove("dragover")
    const file = e.dataTransfer?.files?.[0]
    if (file) handleImageFile(file)
  })
}

// ---- Dependency Graph Toggle ----
let isGraphVisible = false

if (toggleGraphBtn) {
  toggleGraphBtn.addEventListener("click", () => {
    isGraphVisible = !isGraphVisible

    if (isGraphVisible) {
      // Use chain data if available, otherwise fall back to textarea
      let content = ""
      if (isChainResult && Object.keys(chainOutputs).length > 0) {
        const MODES = ["prd", "ard", "trd", "tasks", "agent"] as const
        const MODE_HEADERS: Record<string, string> = { prd: "PRD", ard: "ARD", trd: "TRD", tasks: "TASKS", agent: "AGENT" }
        content = MODES
          .filter(m => chainOutputs[m])
          .map(m => `# ${MODE_HEADERS[m]}\n\n${chainOutputs[m]}`)
          .join("\n\n---\n\n")
      } else {
        content = outputEl.value
      }

      // Check if there's output to visualize
      if (!content.trim()) {
        setStatus("Generate Chain output first to view graph", "warn")
        isGraphVisible = false
        return
      }

      // Parse and render graph
      const data = parseChainOutput(content)

      if (data.nodes.length === 0) {
        setStatus("No graph data found in output", "warn")
        isGraphVisible = false
        return
      }

      outputEl.classList.add("hidden")
      graphView.classList.remove("hidden")
      toggleGraphBtn.classList.add("active")

      renderDependencyGraph(graphSvg, data, (node) => {
        setStatus(`${node.phase}: ${node.excerpt}`)
      })

      setStatus("🌳 Showing Dependency Graph")
    } else {
      outputEl.classList.remove("hidden")
      graphView.classList.add("hidden")
      toggleGraphBtn.classList.remove("active")
      setStatus("Back to text view")
    }
  })
}