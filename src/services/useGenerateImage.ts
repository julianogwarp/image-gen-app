"use client";
import { useMutation } from "@tanstack/react-query";
import { generateImage, type Aspect } from "@/services/imageService";

type Vars = {
  prompt: string;
  aspect?: Aspect;
  onProgress?: (p: number) => void;
};

export function useGenerateImage() {
  return useMutation({
    mutationFn: ({ prompt, aspect, onProgress }: Vars) =>
      generateImage({ prompt, aspect, onProgress }),
  });
}
