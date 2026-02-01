export function renderVIDEO(data: Record<string, unknown>): string {
  // Output clean JSON - more universal for video generation tools
  const output = {
    title: (data.title as string) ?? "Untitled",
    scene: (data.scene_description as string) ?? "",
    subject_action: (data.subject_action as string) ?? "",
    environment: (data.environment as string) ?? "",
    duration: (data.duration as string) ?? "5 seconds",
    camera: {
      movement: (data.camera as any)?.movement ?? "static",
      angle: (data.camera as any)?.angle ?? "eye level",
      speed: (data.camera as any)?.speed ?? "normal"
    },
    motion: {
      subject: (data.motion as any)?.subject ?? "",
      background: (data.motion as any)?.background ?? "static",
      particles: (data.motion as any)?.particles ?? "none"
    },
    style: (data.style as string) ?? "cinematic",
    color_grade: (data.color_grade as string) ?? "natural",
    mood: (data.mood as string) ?? "",
    audio: {
      music_style: (data.audio as any)?.music_style ?? "",
      sfx: (data.audio as any)?.sfx ?? ""
    },
    tool_prompts: {
      veo: (data.tool_prompts as any)?.veo ?? "",
      runway: (data.tool_prompts as any)?.runway ?? "",
      pika: (data.tool_prompts as any)?.pika ?? "",
      kling: (data.tool_prompts as any)?.kling ?? ""
    }
  }

  return JSON.stringify(output, null, 2)
}
