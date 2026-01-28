---
title: Features
---

# Features

## Customizable attributes

The `attr` object can define color, width, opacity, and other per-segment metadata. Mix static values and attribute lists to animate attributes without rebuilding the geometry.

## Line joins and caps

Choose from built-in joins (`Round`, `Bevel`, `Miter`) and caps (`Butt`, `Round`, `Square`, `Top`). The shader computes the right vertices for each combination, so you can mimic SVG-style polylines inside Three.js scenes.

```mermaid
graph TD
    A[Line Segment] --> B{Join Type}
    B -->|Round| C[Curved Connection]
    B -->|Bevel| D[Flat Cut]
    B -->|Miter| E[Sharp Point]
    A --> F{Cap Type}
    F -->|Butt| G[Flat End]
    F -->|Round| H[Curved End]
    F -->|Square| I[Extended Flat]
    F -->|Top| J[Pointed End]
```

## Transparency and shader quality

Shaders are optimized for transparent strokes. Depth sorting and blending behave consistently across segments, letting you build layered canvases with crisp antialiased edges.

```mermaid
graph LR
    A[Input Points & Attr] --> B[Vertex Generation]
    B --> C[Instancing for Segments]
    C --> D[Shader Application]
    D --> E[Depth Sorting]
    E --> F[Blending & Antialiasing]
    F --> G[Rendered Wide Lines]
```

## Custom geometry and raycasting

Advanced users can supply custom geometry definitions for bespoke line shapes, while the optional raycasting support makes the lines interactive without extra effort.

## React integration

`Wideline` wraps the heavy logic in a React component that works inside `<Canvas>` from `@react-three/fiber`. The hooks and utilities play well with suspense, hooks, and modern React patterns.

## TypeScript-first

The project is shipped with full TypeScript declarations, ensuring every utility and prop is strongly typed. The generated API documentation helps you navigate the available interfaces, aliases, and helper functions.
