#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::Write;
use std::path::PathBuf;
use std::process::{Command, Stdio};

use tauri::Manager;

#[tauri::command]
fn compile_prd(app: tauri::AppHandle, input: String) -> Result<String, String> {
    // Use Tauri's resource resolver to find the script in the bundle
    let resource_path = app
        .path()
        .resource_dir()
        .map_err(|e| format!("Failed to get resource dir: {e}"))?
        .join("scripts/compile.sh");

    // If the file doesn't exist (e.g. sometimes in dev if not copied yet), fallback or let it fail clearly
    if !resource_path.exists() {
        // Fallback for dev mode if needed (though resources should work in dev too)
        // Try looking relative to current dir for dev convenience
        let cwd = std::env::current_dir().unwrap_or_default();
        let dev_path = cwd.join("src-tauri/scripts/compile.sh");
        if dev_path.exists() {
            return run_script(dev_path, input);
        }
    }

    run_script(resource_path, input)
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
        .invoke_handler(tauri::generate_handler![compile_prd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
