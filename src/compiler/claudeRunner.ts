import { spawn } from "child_process"
import { SCHEMAS, type CompilerMode } from "./schemas"
import { makeUserPrompt } from "../compilerPrompt"
import type { StackPreset } from "../stacks"

interface CompileOptions {
    mode: CompilerMode
    input: string
    stack?: StackPreset
}

interface CompileResult {
    success: boolean
    data?: Record<string, unknown>
    error?: string
    rawOutput?: string
}

/**
 * Extract JSON from Claude's output, handling markdown fences and surrounding text
 */
function extractJSON(output: string): string {
    // Remove markdown fences
    let clean = output
        .replace(/^```json\n?/gm, "")
        .replace(/^```\n?/gm, "")
        .replace(/```$/gm, "")
        .trim()

    // Try to parse directly
    try {
        JSON.parse(clean)
        return clean
    } catch {
        // Extract from first { to matching }
        let depth = 0
        let started = false
        let result = ""

        for (const char of clean) {
            if (char === "{") {
                depth++
                started = true
            }
            if (started) {
                result += char
            }
            if (char === "}" && started) {
                depth--
                if (depth === 0) break
            }
        }

        return result
    }
}

/**
 * Run the Claude CLI with the given prompt
 */
async function runClaude(systemPrompt: string, userPrompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const claude = spawn("claude", ["--print"], {
            env: {
                ...process.env,
                PATH: `${process.env.HOME}/.local/bin:${process.env.HOME}/bin:/opt/homebrew/bin:${process.env.PATH}`,
            },
        })

        let stdout = ""
        let stderr = ""

        claude.stdout.on("data", (data) => {
            stdout += data.toString()
        })

        claude.stderr.on("data", (data) => {
            stderr += data.toString()
        })

        claude.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`Claude exited with code ${code}: ${stderr}`))
            } else {
                resolve(stdout)
            }
        })

        claude.on("error", (err) => {
            reject(err)
        })

        // Send the prompt
        const fullPrompt = `SYSTEM:\n${systemPrompt}\n\nUSER:\n${userPrompt}`
        claude.stdin.write(fullPrompt)
        claude.stdin.end()
    })
}

/**
 * Compile a single mode
 */
export async function compile(options: CompileOptions): Promise<CompileResult> {
    const { mode, input, stack } = options
    const schema = SCHEMAS[mode]

    if (!schema) {
        return {
            success: false,
            error: `Unknown mode: ${mode}`,
        }
    }

    const userPrompt = makeUserPrompt(input, mode, stack)

    try {
        const rawOutput = await runClaude(schema.systemPrompt, userPrompt)
        const jsonStr = extractJSON(rawOutput)

        try {
            const data = JSON.parse(jsonStr)
            return {
                success: true,
                data,
                rawOutput,
            }
        } catch {
            return {
                success: false,
                error: `Invalid JSON from Claude (${mode})`,
                rawOutput,
            }
        }
    } catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : String(err),
        }
    }
}

/**
 * Compile all modes sequentially
 */
export async function compileAll(
    input: string,
    stack?: StackPreset,
    onProgress?: (mode: CompilerMode, status: "start" | "done" | "error") => void
): Promise<Map<CompilerMode, CompileResult>> {
    const modes: CompilerMode[] = ["prd", "ard", "trd", "tasks", "agent"]
    const results = new Map<CompilerMode, CompileResult>()

    for (const mode of modes) {
        onProgress?.(mode, "start")
        const result = await compile({ mode, input, stack })
        results.set(mode, result)
        onProgress?.(mode, result.success ? "done" : "error")
    }

    return results
}

/**
 * Chain compile: each output feeds into the next
 */
export async function compileChain(
    input: string,
    stack?: StackPreset,
    onProgress?: (mode: CompilerMode, status: "start" | "done" | "error") => void
): Promise<Map<CompilerMode, CompileResult>> {
    const modes: CompilerMode[] = ["prd", "ard", "trd", "tasks", "agent"]
    const results = new Map<CompilerMode, CompileResult>()

    let currentInput = input

    for (const mode of modes) {
        onProgress?.(mode, "start")
        const result = await compile({ mode, input: currentInput, stack })
        results.set(mode, result)

        if (result.success && result.data) {
            // Feed output to next mode
            currentInput = `${currentInput}\n\nPREVIOUS OUTPUT (${mode.toUpperCase()}):\n${JSON.stringify(result.data, null, 2)}`
            onProgress?.(mode, "done")
        } else {
            onProgress?.(mode, "error")
            break // Stop chain on error
        }
    }

    return results
}
