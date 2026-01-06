#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use std::io::Write;
use std::path::PathBuf;

#[tauri::command]
fn compile_prd(input: String) -> Result<String, String> {
  // Get path to the running executable
  let exe_path = std::env::current_exe()
    .map_err(|e| format!("Failed to get exe path: {e}"))?;

  // In dev mode this looks like:
  // src-tauri/target/debug/app
  let app_root = exe_path
    .parent() // debug/
    .and_then(|p| p.parent()) // target/
    .and_then(|p| p.parent()) // src-tauri/
    .ok_or("Failed to resolve src-tauri directory")?;

  let script_path: PathBuf = app_root.join("scripts/compile.sh");

  let mut child = Command::new("bash")
    .arg(script_path.to_string_lossy().to_string())
    .stdin(Stdio::piped())
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .map_err(|e| format!("Failed to spawn compiler: {}", e))?;

  {
    let stdin = child.stdin.as_mut().ok_or("Failed to open stdin")?;
    stdin.write_all(input.as_bytes()).map_err(|e| e.to_string())?;
  }

  let output = child.wait_with_output().map_err(|e| e.to_string())?;

  if !output.status.success() {
    return Err(String::from_utf8_lossy(&output.stderr).to_string());
  }

  Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![compile_prd])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
