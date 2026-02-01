export function renderIMAGE(data: Record<string, unknown>): string {
  // Output clean JSON - more universal for image generation tools
  const output = {
    title: (data.title as string) ?? "Untitled",
    prompt: (data.main_prompt as string) ?? "",
    negative_prompt: (data.negative_prompt as string) ?? "blurry, low quality, distorted, deformed, ugly, bad anatomy",
    style: (data.style as string) ?? "photorealistic",
    aspect_ratio: (data.aspect_ratio as string) ?? "16:9",
    camera: {
      angle: (data.camera as any)?.angle ?? "eye level",
      lens: (data.camera as any)?.lens ?? "50mm",
      distance: (data.camera as any)?.distance ?? "medium shot"
    },
    lighting: {
      type: (data.lighting as any)?.type ?? "natural",
      direction: (data.lighting as any)?.direction ?? "front",
      mood: (data.lighting as any)?.mood ?? "neutral"
    },
    color_palette: (data.color_palette as string) ?? "",
    quality_tags: Array.isArray(data.quality_tags) ? data.quality_tags : ["high quality", "detailed"],
    tool_prompts: {
      midjourney: (data.tool_prompts as any)?.midjourney ?? "",
      dalle: (data.tool_prompts as any)?.dalle ?? "",
      stable_diffusion: (data.tool_prompts as any)?.stable_diffusion ?? ""
    }
  }

  return JSON.stringify(output, null, 2)
}
