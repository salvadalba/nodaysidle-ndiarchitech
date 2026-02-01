#!/usr/bin/env node
import { Command } from "commander"
import ora from "ora"
import chalk from "chalk"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

import { compile, compileAll, compileChain, type CompilerMode } from "./compiler"
import { STACK_PRESETS } from "./stacks"
import { renderPRD } from "./renderer"
import { renderARD } from "./renderers/renderARD"
import { renderTRD } from "./renderers/renderTRD"
import { renderTASKS } from "./renderers/renderTASKS"
import { renderAGENT } from "./renderers/renderAGENT"
import { renderIMAGE } from "./renderers/renderIMAGE"
import { renderVIDEO } from "./renderers/renderVIDEO"

const RENDERERS: Record<CompilerMode, (data: Record<string, unknown>) => string> = {
    prd: renderPRD,
    ard: renderARD,
    trd: renderTRD,
    tasks: renderTASKS,
    agent: renderAGENT,
    image: renderIMAGE,
    video: renderVIDEO,
}

const MODE_NAMES: Record<CompilerMode, string> = {
    prd: "Product Requirements Document",
    ard: "Architecture Requirements Document",
    trd: "Technical Requirements Document",
    tasks: "Tasks Breakdown",
    agent: "Agent Prompts",
    image: "Image Prompt",
    video: "Video Prompt",
}

const program = new Command()

program
    .name("prd")
    .description("PRD Compiler - Generate product documentation from ideas")
    .version("0.3.0")

// List stacks command
program
    .command("stacks")
    .description("List all available stack presets")
    .action(() => {
        console.log(chalk.bold("\nAvailable Stack Presets:\n"))
        for (const stack of STACK_PRESETS) {
            console.log(chalk.cyan(`  ${stack.id}`))
            console.log(chalk.gray(`    ${stack.name} - ${stack.description}\n`))
        }
    })

// Stack details command
program
    .command("stack <id>")
    .description("Show details for a specific stack preset")
    .action((id: string) => {
        const stack = STACK_PRESETS.find((s) => s.id === id)
        if (!stack) {
            console.error(chalk.red(`Stack not found: ${id}`))
            console.log(chalk.gray("Run 'prd stacks' to see available presets"))
            process.exit(1)
        }

        console.log(chalk.bold(`\n${stack.name}\n`))
        console.log(chalk.gray(stack.description))
        console.log()
        console.log(chalk.cyan("Frontend:"), stack.frontend.join(", "))
        console.log(chalk.cyan("Backend:"), stack.backend.join(", "))
        console.log(chalk.cyan("Database:"), stack.database.join(", "))
        if (stack.notes?.length) {
            console.log(chalk.cyan("\nNotes:"))
            stack.notes.forEach((n) => console.log(chalk.gray(`  - ${n}`)))
        }
        console.log()
    })

// Generate single mode
program
    .command("generate <input>")
    .description("Generate a single document type")
    .option("-m, --mode <mode>", "Compiler mode (prd, ard, trd, tasks, agent, image, video)", "prd")
    .option("-s, --stack <stack>", "Stack preset ID (not used for image/video)")
    .option("-o, --output <file>", "Output file path")
    .option("--json", "Output raw JSON instead of markdown")
    .action(async (input: string, options) => {
        const mode = options.mode as CompilerMode
        if (!["prd", "ard", "trd", "tasks", "agent", "image", "video"].includes(mode)) {
            console.error(chalk.red(`Invalid mode: ${mode}`))
            process.exit(1)
        }

        const stack = options.stack
            ? STACK_PRESETS.find((s) => s.id === options.stack)
            : undefined
        if (options.stack && !stack) {
            console.error(chalk.red(`Stack not found: ${options.stack}`))
            process.exit(1)
        }

        const spinner = ora(`Generating ${MODE_NAMES[mode]}...`).start()

        const result = await compile({ mode, input, stack })

        if (!result.success) {
            spinner.fail(chalk.red(`Failed: ${result.error}`))
            process.exit(1)
        }

        spinner.succeed(chalk.green(`Generated ${MODE_NAMES[mode]}`))

        const output = options.json
            ? JSON.stringify(result.data, null, 2)
            : RENDERERS[mode](result.data!)

        if (options.output) {
            writeFileSync(options.output, output)
            console.log(chalk.gray(`Saved to ${options.output}`))
        } else {
            console.log("\n" + output)
        }
    })

// Generate all modes
program
    .command("generate-all <input>")
    .description("Generate all document types")
    .option("-s, --stack <stack>", "Stack preset ID")
    .option("-o, --output <dir>", "Output directory")
    .option("--json", "Output raw JSON instead of markdown")
    .action(async (input: string, options) => {
        const stack = options.stack
            ? STACK_PRESETS.find((s) => s.id === options.stack)
            : undefined
        if (options.stack && !stack) {
            console.error(chalk.red(`Stack not found: ${options.stack}`))
            process.exit(1)
        }

        console.log(chalk.bold("\nGenerating all documents...\n"))

        const results = await compileAll(input, stack, (mode, status) => {
            if (status === "start") {
                process.stdout.write(chalk.gray(`  ${MODE_NAMES[mode]}... `))
            } else if (status === "done") {
                process.stdout.write(chalk.green("done\n"))
            } else {
                process.stdout.write(chalk.red("failed\n"))
            }
        })

        if (options.output) {
            if (!existsSync(options.output)) {
                mkdirSync(options.output, { recursive: true })
            }

            for (const [mode, result] of results) {
                if (result.success) {
                    const ext = options.json ? "json" : "md"
                    const filename = `${mode.toUpperCase()}.${ext}`
                    const content = options.json
                        ? JSON.stringify(result.data, null, 2)
                        : RENDERERS[mode](result.data!)
                    writeFileSync(join(options.output, filename), content)
                }
            }
            console.log(chalk.gray(`\nSaved to ${options.output}/`))
        } else {
            for (const [mode, result] of results) {
                if (result.success) {
                    console.log(chalk.bold(`\n--- ${MODE_NAMES[mode]} ---\n`))
                    console.log(RENDERERS[mode](result.data!))
                }
            }
        }
    })

// Chain generate
program
    .command("chain <input>")
    .description("Chain generate (each output feeds into the next)")
    .option("-s, --stack <stack>", "Stack preset ID")
    .option("-o, --output <dir>", "Output directory")
    .option("--json", "Output raw JSON instead of markdown")
    .action(async (input: string, options) => {
        const stack = options.stack
            ? STACK_PRESETS.find((s) => s.id === options.stack)
            : undefined
        if (options.stack && !stack) {
            console.error(chalk.red(`Stack not found: ${options.stack}`))
            process.exit(1)
        }

        console.log(chalk.bold("\nChain generating (PRD → ARD → TRD → Tasks → Agent)...\n"))

        const results = await compileChain(input, stack, (mode, status) => {
            if (status === "start") {
                process.stdout.write(chalk.gray(`  ${MODE_NAMES[mode]}... `))
            } else if (status === "done") {
                process.stdout.write(chalk.green("done\n"))
            } else {
                process.stdout.write(chalk.red("failed\n"))
            }
        })

        if (options.output) {
            if (!existsSync(options.output)) {
                mkdirSync(options.output, { recursive: true })
            }

            for (const [mode, result] of results) {
                if (result.success) {
                    const ext = options.json ? "json" : "md"
                    const filename = `${mode.toUpperCase()}.${ext}`
                    const content = options.json
                        ? JSON.stringify(result.data, null, 2)
                        : RENDERERS[mode](result.data!)
                    writeFileSync(join(options.output, filename), content)
                }
            }
            console.log(chalk.gray(`\nSaved to ${options.output}/`))
        } else {
            for (const [mode, result] of results) {
                if (result.success) {
                    console.log(chalk.bold(`\n--- ${MODE_NAMES[mode]} ---\n`))
                    console.log(RENDERERS[mode](result.data!))
                }
            }
        }
    })

// Image prompt generation (shortcut)
program
    .command("image <input>")
    .description("Generate professional image prompts for AI generators")
    .option("-o, --output <file>", "Output file path")
    .action(async (input: string, options) => {
        const spinner = ora("Generating image prompts...").start()

        const result = await compile({ mode: "image", input })

        if (!result.success) {
            spinner.fail(chalk.red(`Failed: ${result.error}`))
            process.exit(1)
        }

        spinner.succeed(chalk.green("Generated image prompts"))

        const output = renderIMAGE(result.data!)

        if (options.output) {
            writeFileSync(options.output, output)
            console.log(chalk.gray(`Saved to ${options.output}`))
        } else {
            console.log("\n" + output)
        }
    })

// Video prompt generation (shortcut)
program
    .command("video <input>")
    .description("Generate professional video prompts for AI generators (Veo 3, Runway, Kling)")
    .option("-o, --output <file>", "Output file path")
    .action(async (input: string, options) => {
        const spinner = ora("Generating video prompts...").start()

        const result = await compile({ mode: "video", input })

        if (!result.success) {
            spinner.fail(chalk.red(`Failed: ${result.error}`))
            process.exit(1)
        }

        spinner.succeed(chalk.green("Generated video prompts"))

        const output = renderVIDEO(result.data!)

        if (options.output) {
            writeFileSync(options.output, output)
            console.log(chalk.gray(`Saved to ${options.output}`))
        } else {
            console.log("\n" + output)
        }
    })

program.parse()
