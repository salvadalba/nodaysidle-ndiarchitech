import { STACK_PRESETS } from "./stacks"
import { makeUserPrompt } from "./compilerPrompt"
import { invoke } from "@tauri-apps/api/core"
import { renderPRD } from "./renderer"
import { renderARD } from "./renderers/renderARD"
import { renderTRD } from "./renderers/renderTRD"
import { renderTASKS } from "./renderers/renderTASKS"
import { renderAGENT } from "./renderers/renderAGENT"

console.log("PRD Compiler app loaded")

function isTauri(): boolean {
  return "__TAURI_INTERNALS__" in window
}

const root = document.getElementById("app")
if (!root) {
  throw new Error("Root #app not found")
}

root.innerHTML = `
  <h1>PRD Compiler</h1>

  <label>Compiler</label><br />
  <select id="compiler">
    <option value="prd">PRD — Product Requirements</option>
    <option value="ard">ARD — Architecture Requirements</option>
    <option value="trd">TRD — Technical Requirements</option>
    <option value="tasks">TASKS — Epics + tasks</option>
    <option value="agent">AGENT — CLI agent prompts</option>
  </select>

  <br /><br />

  <label>Stack preset</label><br />
  <select id="stack"></select>

  <br /><br />

  <label>Project input</label><br />
  <textarea id="input" rows="8" style="width: 100%;"></textarea>

  <hr style="margin: 16px 0; opacity: 0.2;" />

  <button id="generate">Generate</button>
  <button id="copyOutput" type="button">Copy Output</button>
  <button id="copyClaude" type="button">Copy Claude Prompts</button>
  <button id="copyGemini" type="button">Copy Gemini Prompts</button>
  <button id="copyOpenCode" type="button">Copy OpenCode Prompts</button>

  <div
    id="status"
    style="
      margin-top: 10px;
      font-family: ui-monospace, monospace;
      font-size: 12px;
      opacity: 0.85;
    "
  ></div>

  <br />

  <label>Output</label><br />
  <textarea id="output" rows="14" style="width: 100%;" readonly></textarea>
`

// ---- wire DOM elements ----
const compilerSelect = document.getElementById("compiler") as HTMLSelectElement
const stackSelect = document.getElementById("stack") as HTMLSelectElement
const inputEl = document.getElementById("input") as HTMLTextAreaElement
const outputEl = document.getElementById("output") as HTMLTextAreaElement
const generateBtn = document.getElementById("generate") as HTMLButtonElement

const copyOutputBtn = document.getElementById("copyOutput") as HTMLButtonElement
const copyClaudeBtn = document.getElementById("copyClaude") as HTMLButtonElement
const copyGeminiBtn = document.getElementById("copyGemini") as HTMLButtonElement
const copyOpenCodeBtn = document.getElementById("copyOpenCode") as HTMLButtonElement
const statusEl = document.getElementById("status") as HTMLDivElement

// ---- populate stack presets ----
for (const stack of STACK_PRESETS) {
  const opt = document.createElement("option")
  opt.value = stack.id
  opt.textContent = `${stack.name} — ${stack.description}`
  stackSelect.appendChild(opt)
}

// ---- UI helpers ----
function updateCopyButtons() {
  const isAgent = compilerSelect.value === "agent"
  copyClaudeBtn.style.display = isAgent ? "inline-block" : "none"
  copyGeminiBtn.style.display = isAgent ? "inline-block" : "none"
  copyOpenCodeBtn.style.display = isAgent ? "inline-block" : "none"
}

function setStatus(msg: string, kind: "ok" | "warn" = "ok") {
  statusEl.textContent = msg
  statusEl.style.color = kind === "ok" ? "#16a34a" : "#ca8a04"
  setTimeout(() => {
    if (statusEl.textContent === msg) statusEl.textContent = ""
  }, 2000)
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const ta = document.createElement("textarea")
  ta.value = text
  ta.style.position = "fixed"
  ta.style.left = "-9999px"
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  document.execCommand("copy")
  document.body.removeChild(ta)
}

function extractAgentBlocks(
  markdown: string,
  agentLabel: "Claude Code" | "Gemini CLI" | "OpenCode"
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

// ---- button behavior ----
compilerSelect.onchange = updateCopyButtons
updateCopyButtons()

outputEl.onclick = () => outputEl.select()

copyOutputBtn.onclick = async () => {
  if (!outputEl.value.trim()) return setStatus("Nothing to copy.", "warn")
  await copyText(outputEl.value)
  setStatus("Copied output ✓")
}

copyClaudeBtn.onclick = async () => {
  const text = extractAgentBlocks(outputEl.value, "Claude Code")
  if (!text) return setStatus("No Claude prompts found.", "warn")
  await copyText(text)
  setStatus("Copied Claude prompts ✓")
}

copyGeminiBtn.onclick = async () => {
  const text = extractAgentBlocks(outputEl.value, "Gemini CLI")
  if (!text) return setStatus("No Gemini prompts found.", "warn")
  await copyText(text)
  setStatus("Copied Gemini prompts ✓")
}

copyOpenCodeBtn.onclick = async () => {
  const text = extractAgentBlocks(outputEl.value, "OpenCode")
  if (!text) return setStatus("No OpenCode prompts found.", "warn")
  await copyText(text)
  setStatus("Copied OpenCode prompts ✓")
}

// ---- Generate ----
generateBtn.onclick = async () => {
  outputEl.value = "Generating…"

  const selectedStack = STACK_PRESETS.find(s => s.id === stackSelect.value)
  const userPrompt = makeUserPrompt(
    inputEl.value,
    compilerSelect.value,
    selectedStack
  )

  const payload = `COMPILER: ${compilerSelect.value}
${userPrompt}`

  if (!isTauri()) {
    outputEl.value =
      "⚠️ Running in browser mode.\n\nUse `npx tauri dev` to generate outputs."
    return
  }

  try {
    const raw = await invoke<string>("compile_prd", { input: payload })

    const clean = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")

    const data = JSON.parse(clean)

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
  } catch (err) {
    outputEl.value = `ERROR:\n${String(err)}`
  }
}