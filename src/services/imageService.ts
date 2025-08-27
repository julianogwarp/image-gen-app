export type Aspect = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

export type GenerateParams = {
  prompt: string;
  aspect?: Aspect;
  onProgress?: (percent: number) => void;
};

export type GenerateResult = {
  url: string;
};

// Mock service that simulates latency and returns a deterministic image per prompt.
export async function generateImage({ prompt, aspect = "1:1", onProgress }: GenerateParams): Promise<GenerateResult> {
  const total = 2000 + Math.random() * 1200; // 2-3.2s total
  const start = Date.now();
  let percent = 0;

  // Emit progress up to 90% while waiting
  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      percent = Math.min(90, Math.floor((elapsed / total) * 100));
      onProgress?.(percent);
      if (elapsed >= total) {
        clearInterval(interval);
        resolve();
      }
    }, 120);
  });

  const seed = encodeURIComponent(prompt.trim() || "creative");
  // Determine dimensions based on aspect; keep the longer side at ~1024 for quality
  function dims(a: Aspect): { w: number; h: number } {
    switch (a) {
      case "1:1":
        return { w: 1024, h: 1024 };
      case "4:3":
        return { w: 1024, h: Math.round((3 / 4) * 1024) };
      case "3:4":
        return { w: Math.round((3 / 4) * 1024), h: 1024 };
      case "16:9":
        return { w: 1024, h: Math.round((9 / 16) * 1024) };
      case "9:16":
        return { w: Math.round((9 / 16) * 1024), h: 1024 };
      default:
        return { w: 1024, h: 1024 };
    }
  }
  const { w, h } = dims(aspect);
  const url = `https://picsum.photos/seed/${seed}/${w}/${h}`;
  onProgress?.(100);
  return { url };
}
