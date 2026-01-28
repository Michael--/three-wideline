---
title: Development
---

# Development

## Setup

```bash
pnpm install
```

## Local workflow

| Task                 | Command                                                      |
| -------------------- | ------------------------------------------------------------ |
| Start sample app     | `pnpm start` (runs `vite` with `src/sample1/vite.config.js`) |
| Build sample         | `pnpm build`                                                 |
| Bundle distributable | `pnpm dist`                                                  |
| Run lint             | `pnpm lint`                                                  |
| Run typecheck        | `pnpm typecheck`                                             |
| Run tests            | `pnpm test`                                                  |
| Run spellcheck       | `pnpm spellcheck`                                            |
| Build docs           | `pnpm docs:build`                                            |

## Documentation pipeline

- `typedoc --options typedoc.json` generates Markdown under `docs/api`. The config already hides source links and formats tables to match VitePress.
- `vitepress build docs` renders the documentation site in `docs/.vitepress/dist`; use `pnpm docs:preview` to inspect locally.

## Architecture notes

- **Three.js + React**: The component sits atop React Three Fiber and uses instanced geometry to draw wide lines with per-segment attributes.
- **Shaders**: Custom vertex and fragment shaders compute joins, caps, and offsets to keep the strokes anti-aliased.
- **Performance hooks**: The `usePerformanceMonitor` hook and `performance-utils` helpers collect render timing, heap usage, and benchmark data when running in development.
