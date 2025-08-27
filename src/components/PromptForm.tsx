"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Aspect } from "@/services/imageService";

export function PromptForm({
  onSubmit,
  disabled,
  initialPrompt = "",
}: {
  onSubmit: (prompt: string, aspect: Aspect) => void;
  disabled?: boolean;
  initialPrompt?: string;
}) {
  const [prompt, setPrompt] = React.useState(initialPrompt);
  const [aspect, setAspect] = React.useState<Aspect>("1:1");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit(prompt.trim(), aspect);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <label htmlFor="prompt" className="sr-only">
        Prompt
      </label>
      <Input
        id="prompt"
        placeholder="Describe the image you want to create..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={disabled}
        className="flex-1"
        autoFocus
      />
      <label htmlFor="aspect" className="sr-only">
        Aspect
      </label>
      <select
        id="aspect"
        value={aspect}
        onChange={(e) => setAspect(e.target.value as Aspect)}
        disabled={disabled}
        className="h-10 rounded-md border border-zinc-300 bg-background px-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
        aria-label="Aspect ratio"
      >
        <option value="1:1">1:1</option>
        <option value="4:3">4:3</option>
        <option value="3:4">3:4</option>
        <option value="16:9">16:9</option>
        <option value="9:16">9:16</option>
      </select>
      <Button type="submit" disabled={disabled || !prompt.trim()}>
        Generate
      </Button>
    </form>
  );
}
