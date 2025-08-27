"use client";
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  onLoaded?: () => void;
  fixed?: boolean; // if true, use fill in a fixed-size parent
};

export function ImageReveal({ src, alt, className, onLoaded, fixed = true }: Props) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  // Reset state when src changes
  React.useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  // Safety: if the load events don't fire for any reason, reveal after a short delay
  React.useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setLoaded(true), 1500);
    return () => clearTimeout(t);
  }, [loaded, src]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-zinc-200 dark:bg-zinc-900",
          loaded ? "opacity-0" : "opacity-100",
          "transition-opacity duration-700"
        )}
      />
      {!failed && fixed ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover",
            loaded ? "reveal-in" : "opacity-0 scale-95"
          )}
          onLoadingComplete={() => {
            setLoaded(true);
            onLoaded?.();
          }}
          onLoad={() => {
            setLoaded(true);
            onLoaded?.();
          }}
          onError={() => setFailed(true)}
          sizes="(min-width: 768px) 512px, 100vw"
          unoptimized
          priority
        />
      ) : !failed ? (
        <Image
          src={src}
          alt={alt}
          width={1024}
          height={1024}
          className={cn(
            "h-auto w-full object-cover",
            loaded ? "reveal-in" : "opacity-0 scale-95"
          )}
          onLoadingComplete={() => {
            setLoaded(true);
            onLoaded?.();
          }}
          onLoad={() => {
            setLoaded(true);
            onLoaded?.();
          }}
          onError={() => setFailed(true)}
          sizes="(min-width: 1024px) 768px, 100vw"
          unoptimized
          priority
        />
      ) : (
        // Fallback to native <img> if Next/Image fails for any reason
        <img
          src={src}
          alt={alt}
          className={cn(
            fixed ? "absolute inset-0 h-full w-full object-cover" : "h-auto w-full object-cover",
            loaded ? "reveal-in" : "opacity-0 scale-95"
          )}
          onLoad={() => {
            setLoaded(true);
            onLoaded?.();
          }}
        />
      )}
      {loaded && <div className="shine" aria-hidden />}
    </div>
  );
}
