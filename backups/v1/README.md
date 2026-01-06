# 🚀 PRD Compiler

**PRD Compiler** is a powerful desktop application offering a streamlined workflow to generate comprehensive **Product Requirements Documents (PRDs)** from a simple project idea.

Built with **Tauri**, **TypeScript**, and **Rust**, it leverages the **Claude CLI** to intelligently expand your concepts into structured, professional documentation.

![PRD Compiler](https://i.imgur.com/your-screenshot-placeholder.png)

## ✨ Features

- **⚡ Instant PRD Generation**: Turn a 2-sentence idea into a full-blown PRD in seconds.
- **🛠️ Stack Presets**: Choose from predefined tech stacks (Modern Web, Content Platform, ML Lite) to tailor the technical requirements.
- **🖥️ Native Performance**: Runs locally on your machine using Tauri's lightweight architecture.
- **🤖 AI-Powered**: Uses your local authenticated `claude` CLI for high-quality, context-aware generation.

## ⚙️ Prerequisites

Before running the app, ensure you have the following installed:

1. **Node.js** & **npm**
2. **Rust & Cargo** (Required for Tauri)
3. **Claude CLI**:
    - This app depends on the `claude` command being available in your terminal.
    - Make sure you are authenticated (`claude login` or equivalent setup).

## 🚀 Getting Started

1. **Clone the repository**:

    ```bash
    git clone https://github.com/salvadalba/nodaysidle-prd-generator.git
    cd nodaysidle-prd-generator
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the application**:

    ```bash
    npx tauri dev
    ```

## 🏗️ Tech Stack

- **Frontend**: TypeScript, Vite, Vanilla CSS
- **Core**: Tauri (Rust)
- **AI Engine**: Claude CLI (Anthropic)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*Built with ❤️ by [salvadalba](https://github.com/salvadalba)*
