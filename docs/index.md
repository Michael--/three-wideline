---
layout: home
title: three-wideline

hero:
   name: three-wideline
   text: Wide line rendering for Three.js and React Three Fiber
   image:
      src: /logo.svg
      alt: three-wideline logo
   actions:
      - theme: brand
        text: Get Started
        link: /getting-started
      - theme: alt
        text: View API
        link: /api/

features:
   - icon: ⚡
     title: High Performance
     details: Optimized shader-based rendering for smooth wide lines
   - icon: 🎨
     title: Advanced Styling
     details: Full control over colors, widths, caps, and joins
   - icon: 📊
     title: Performance Monitoring
     details: Built-in diagnostics for render and memory analysis
   - icon: 🔧
     title: Developer Friendly
     details: Full TypeScript support with comprehensive API documentation
---

## Architecture Overview

Here's how `three-wideline` integrates into your Three.js and React Three Fiber setup:

```mermaid
graph TD
    A[React Component] --> B[Wideline Props: points, attr, join, caps]
    B --> C[Geometry Generation]
    C --> D[Instanced Mesh]
    D --> E[Custom Shader]
    E --> F[Three.js Scene Rendering]
    F --> G[Wide Lines with Joins/Caps]
```

## Guide Overview

- [Getting Started](getting-started) — Installation and sample usage
- [Features](features) — Rendering, caps, joins, and shader highlights
- [Performance Monitoring](PERFORMANCE.md) — Render and memory diagnostics
- [Development](development) — Tests, linting, docs, and build commands

## API Reference

The [API reference](/api/) is generated with TypeDoc and covers all available exports and types.

## Samples & Demos

Run `pnpm start` to serve the local sample. The README contains live Wideline examples and CodeSandbox links.
