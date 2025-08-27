This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
