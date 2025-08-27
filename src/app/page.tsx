"use client";
import * as React from "react";
import { PromptForm } from "@/components/PromptForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ImageReveal } from "@/components/ImageReveal";
import { Progress } from "@/components/ui/progress";
import { Gallery } from "@/components/Gallery";
import { useGenerateImage } from "@/services/useGenerateImage";
import { Button } from "@/components/ui/button";
import type { Aspect } from "@/services/imageService";

export default function Home() {
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<string[]>([]);
  const generateMutation = useGenerateImage();
  const loading = generateMutation.isPending;

  async function onGenerate(prompt: string, aspect: Aspect) {
    setError(null);
    setProgress(0);
    setImageUrl(null);
    try {
      const res = await generateMutation.mutateAsync({
        prompt,
        aspect,
        onProgress: (p: number) => setProgress(p),
      });
      setImageUrl(res.url);
      setHistory((h) => [res.url, ...h].slice(0, 24));
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="h-screen w-full">

      <main className="grid lg:grid-cols-2 gap-0 h-full overflow-hidden">
        {/* Left: Controls */}
        <section className="h-full overflow-y-auto p-6 sm:p-10">
          <div className="max-w-xl space-y-4">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 sm:p-4 sticky top-6 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <PromptForm onSubmit={onGenerate} disabled={loading} />
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</div>
            )}

            {/* Tips area (placeholder for future) */}
            <div className="hidden md:block border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
              <h2 className="text-sm font-medium mb-2">Tips</h2>
              <ul className="text-sm text-zinc-500 space-y-1">
                <li>Use clear style hints: “charcoal sketch”, “high contrast”.</li>
                <li>Add subject and mood: “city skyline, moody, fog”.</li>
                <li>Iterate: tweak words to explore variations.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Right: Output */}
        <section className="h-full overflow-y-auto p-6 sm:p-10 border-l border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6 items-center">
            {/* Fixed preview 512x512 */}
            <div className="group relative h-[512px] w-[512px] max-w-full aspect-square rounded-xl border border-zinc-200 dark:border-zinc-800">
              {loading && (
                <>
                  <Skeleton className="absolute inset-0" />
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="w-full max-w-xs text-center space-y-3 bg-background/70 rounded-xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-800">
                      <div className="flex items-center justify-center gap-3">
                        <Spinner className="h-5 w-5" />
                        <span className="text-sm">Generating… {progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  </div>
                </>
              )}

              {!loading && !imageUrl && (
                <div className="absolute inset-0 grid place-items-center text-zinc-500">
                  <p className="text-sm">Your image will appear here</p>
                </div>
              )}

              {!loading && imageUrl && (
                <>
                  <ImageReveal src={imageUrl} alt="Generated image" className="h-full w-full" fixed />
                  <div className="pointer-events-none absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <a
                      href={`/api/download?url=${encodeURIComponent(imageUrl)}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto"
                      aria-label="Download image"
                      title="Download"
                    >
                      <Button variant="secondary" size="sm" className="h-8 px-2">
                        {/* Download icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                          <path d="M12 3.75a.75.75 0 0 1 .75.75v8.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V4.5a.75.75 0 0 1 .75-.75Z"/>
                          <path d="M4.5 15.75a.75.75 0 0 1 .75.75v1.5A1.5 1.5 0 0 0 6.75 19.5h10.5a1.5 1.5 0 0 0 1.5-1.5v-1.5a.75.75 0 0 1 1.5 0v1.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3v-1.5a.75.75 0 0 1 .75-.75Z"/>
                        </svg>
                      </Button>
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Gallery */}
            <Gallery
              images={history}
              onSelect={(url) => setImageUrl(url)}
              onDelete={(url) => {
                setHistory((prev) => prev.filter((u) => u !== url));
                setImageUrl((curr) => (curr === url ? "" : curr));
              }}
              className="w-full"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
