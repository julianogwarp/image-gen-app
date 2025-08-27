

# Image Generation App — Project Structure and Front-end Stack


## Tech Stack
- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS (configured via `postcss.config.mjs`, `globals.css`)
- **Data/State**: @tanstack/react-query for mutations and state
- **UI Primitives**: Lightweight components in `src/components/ui/` (Button, Input, Skeleton, Spinner, Progress)
- **Image**: Custom `ImageReveal` with native `<img>` fallback
- **API Routes**: Next.js Route Handlers (e.g., download proxy)

## Project Structure
```text
image-gen-app/
├─ public/
│  └─ *.svg
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  └─ download/
│  │  │     └─ route.ts           # Proxies image and forces download
│  │  ├─ favicon.ico
│  │  ├─ globals.css              # Tailwind styles
│  │  ├─ layout.tsx               # Wraps with Providers (React Query)
│  │  └─ page.tsx                 # Split UI (controls + preview/gallery)
│  ├─ components/
│  │  ├─ Providers.tsx            # QueryClientProvider
│  │  ├─ PromptForm.tsx           # Prompt input + aspect selector + Generate
│  │  ├─ ImageReveal.tsx          # Robust image loader/reveal
│  │  ├─ Gallery.tsx              # Thumbnails, select & delete
│  │  └─ ui/
│  │     ├─ button.tsx
│  │     ├─ input.tsx
│  │     ├─ progress.tsx
│  │     ├─ skeleton.tsx
│  │     └─ spinner.tsx
│  ├─ lib/
│  │  └─ utils.ts
│  └─ services/
│     ├─ imageService.ts          # Mock image generator (picsum) + aspect
│     └─ useGenerateImage.ts      # TanStack Query mutation hook
├─ next.config.ts
├─ eslint.config.mjs
├─ postcss.config.mjs
├─ tsconfig.json
├─ package.json
└─ README.md
```

## Installation & Scripts
```bash
npm install
npm install @tanstack/react-query
npm run dev
```

Open http://localhost:3000

## Key Features
- **Generate with progress**: Uses a mutation with `onProgress(percent)` to drive a spinner and progress bar.
- **Aspect ratio selection**: Choose 1:1, 4:3, 3:4, 16:9, 9:16; service sizes the output accordingly.
- **Fixed preview box**: 512×512 container; images are contained without layout shifts.
- **Gallery**: Select to preview; delete to remove from history.
- **Download on hover**: Top-right button downloads via `/api/download?url=...` without navigating away.

## Notes
- The generator currently uses `picsum.photos` for demo purposes. Swap `generateImage()` with your backend/API.
- If you want React Query Devtools or a built-in FPS overlay, they can be added in dev-only mode.
