#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::Write;
use std::path::PathBuf;
use std::process::{Command, Stdio};

use tauri::Manager;

#[tauri::command]
fn compile_prd(app: tauri::AppHandle, input: String) -> Result<String, String> {
    // Parse the compiler mode from input (first line: "COMPILER: prd")
    let mode = input
        .lines()
        .next()
        .and_then(|line| line.strip_prefix("COMPILER: "))
        .unwrap_or("prd")
        .trim();

    // Map mode to script name
    let script_name = match mode {
        "prd" => "compile_prd.sh",
        "ard" => "compile_ard.sh",
        "trd" => "compile_trd.sh",
        "tasks" => "compile_tasks.sh",
        "agent" => "compile_agent.sh",
        "image" => "compile_image.sh",
        "video" => "compile_video.sh",
        "design" => "compile_design.sh",
        _ => "compile_prd.sh",
    };

    // Remove the COMPILER line from input before passing to script
    let script_input = input
        .lines()
        .skip(1)
        .collect::<Vec<_>>()
        .join("\n");

    // Use Tauri's resource resolver to find the script in the bundle
    let resource_path = app
        .path()
        .resource_dir()
        .map_err(|e| format!("Failed to get resource dir: {e}"))?
        .join(format!("scripts/{}", script_name));

    // If the file doesn't exist (e.g. sometimes in dev if not copied yet), fallback or let it fail clearly
    if !resource_path.exists() {
        // Fallback for dev mode if needed (though resources should work in dev too)
        // Try looking relative to current dir for dev convenience
        let cwd = std::env::current_dir().unwrap_or_default();
        let dev_path = cwd.join(format!("src-tauri/scripts/{}", script_name));
        if dev_path.exists() {
            return run_script(dev_path, script_input);
        }
        return Err(format!("Script not found: {} (checked {} and {})", script_name, resource_path.display(), dev_path.display()));
    }

    run_script(resource_path, script_input)
}

fn run_script(path: PathBuf, input: String) -> Result<String, String> {
    let mut child = Command::new("bash")
        .arg(path.to_string_lossy().to_string())
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn compiler: {}", e))?;

    {
        let stdin = child.stdin.as_mut().ok_or("Failed to open stdin")?;
        stdin
            .write_all(input.as_bytes())
            .map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(
                    "sqlite:nodaysidle.db",
                    vec![
                        tauri_plugin_sql::Migration {
                            version: 1,
                            description: "create projects table",
                            sql: "CREATE TABLE IF NOT EXISTS projects (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                name TEXT NOT NULL,
                                input TEXT NOT NULL,
                                output TEXT NOT NULL,
                                mode TEXT NOT NULL,
                                stack TEXT NOT NULL,
                                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                            );",
                            kind: tauri_plugin_sql::MigrationKind::Up,
                        },
                        tauri_plugin_sql::Migration {
                            version: 2,
                            description: "add chain_outputs column",
                            sql: "ALTER TABLE projects ADD COLUMN chain_outputs TEXT DEFAULT NULL;",
                            kind: tauri_plugin_sql::MigrationKind::Up,
                        },
                    ],
                )
                .build(),
        )
        .invoke_handler(tauri::generate_handler![compile_prd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
