---
title: three-wideline
---

# three-wideline

Wide line rendering for Three.js and React Three Fiber.

## Getting started

Install the package with your preferred package manager, then render a line with the `Wideline` component:

```bash
pnpm add three-wideline
```

```tsx
import { Canvas } from "@react-three/fiber"
import { Wideline } from "three-wideline"

function Scene() {
   const points = [-1, -1, 0, 1, 1, -1]
   const attr = { color: "red", width: 0.2 }

   return (
      <Canvas>
         <Wideline points={points} attr={attr} join="Round" capsStart="Round" capsEnd="Square" />
      </Canvas>
   )
}
```

## Documentation

The docs site lives under VitePress; the API reference is generated with TypeDoc and shipped inside `docs/api`.

- [Performance Monitoring](PERFORMANCE.md)
- [Open API Reference](/api/)

## Samples & demos

Run `pnpm start` to serve the local sample (`build/sample1`). The live demo and Codesandbox examples in the README demonstrate the animated and logo galleries.
