"use client";
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export function Gallery({
  images,
  onSelect,
  className,
  onDelete,
  preloadedUrls,
}: {
  images: string[];
  onSelect: (url: string) => void;
  className?: string;
  onDelete?: (url: string) => void;
  preloadedUrls?: Set<string>;
}) {
  const loadedSetRef = React.useRef<Set<number>>(new Set());
  const [loadedCount, setLoadedCount] = React.useState(0);
  const total = images.length;

  function markLoaded(idx: number) {
    const set = loadedSetRef.current;
    if (!set.has(idx)) {
      set.add(idx);
      setLoadedCount(set.size);
    }
  }

  // Check if an image URL is preloaded (main image finished loading)
  function isPreloaded(url: string): boolean {
    return preloadedUrls?.has(url) ?? false;
  }

  if (!images.length) return null;

  return (
    <div className={cn("grid gap-2", className)}>
      <h2 className="text-xs uppercase tracking-wider text-zinc-500">Recent</h2>

      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {images.map((url, i) => (
          <div
            key={url + i}
            onClick={() => onSelect(url)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(url);
              }
            }}
            className="group relative aspect-square overflow-hidden rounded border border-zinc-200 dark:border-zinc-800 outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 cursor-pointer"
            aria-label={`Select image ${i + 1}`}
          >
            {/* Delete button (top-right) */}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(url);
                }}
                className="absolute right-1 top-1 z-10 cursor-pointer rounded bg-background/80 p-1 text-zinc-600 ring-1 ring-zinc-200 transition hover:text-zinc-900 hover:ring-zinc-300 dark:text-zinc-400 dark:ring-zinc-700 dark:hover:text-zinc-100"
                aria-label={`Delete image ${i + 1}`}
                title="Delete"
              >
                {/* Trash icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M9 3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V5h3.25a.75.75 0 0 1 0 1.5h-.637l-1.03 12.008A2.75 2.75 0 0 1 13.84 21H10.16a2.75 2.75 0 0 1-2.742-2.492L6.39 6.5h-.64a.75.75 0 0 1 0-1.5H9V3.75ZM12.75 5V3.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25V5h3Zm-4.86 1.5.99 11.555a1.25 1.25 0 0 0 1.25 1.12h3.68a1.25 1.25 0 0 0 1.25-1.12L17.05 6.5H7.89Z"/>
                </svg>
              </button>
            )}
            {/* Skeleton placeholder under the image while it loads */}
            {!loadedSetRef.current.has(i) && <Skeleton className="absolute inset-0" />}
            <Image
              src={thumbnail(url)}
              alt="Previous image"
              width={256}
              height={256}
              className="relative h-full w-full object-cover transition-transform group-hover:scale-105"
              unoptimized
              priority={isPreloaded(url)} // Prioritize loading if main image finished
              onLoad={() => markLoaded(i)}
              onLoadingComplete={() => markLoaded(i)}
            />
            {!loadedSetRef.current.has(i) && !isPreloaded(url) && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full bg-background/70 p-2 ring-1 ring-zinc-200 dark:ring-zinc-800">
                  <Spinner className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function thumbnail(url: string) {
  // Use smaller size for grid when using picsum pattern
  return url.replace(/\/(\d+)\/(\d+)$/, "/256/256");
}
