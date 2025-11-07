# three-wideline

<p align="center">
  <img src="./public/logo192.png" width="200" alt="three-wideline">
</p>

A powerful Three.js library for rendering wide lines with customizable attributes, joins, caps, and advanced features. Built for React Three Fiber, it provides an easy-to-use component for creating high-quality 2D lines in 3D space.

## Features

- **Customizable Attributes**: Set color, width, and opacity per segment
- **Line Joins**: Choose from Round, Bevel, Miter, or custom joins
- **Caps**: Start and end caps with options like Butt, Round, Square, Top
- **Transparency**: Optimized shaders for transparent lines
- **Custom Geometry**: Beta support for user-defined custom elements
- **Raycasting**: Optional raycasting for interaction
- **React Integration**: Seamless integration with React Three Fiber
- **TypeScript**: Full TypeScript support with strict typing

## Install

```bash
npm install three-wideline
```

## Quick Start

```tsx
import { Canvas } from "@react-three/fiber"
import { Wideline } from "three-wideline"

function MyLine() {
   return (
      <Wideline
         points={[-1, -1, 0, 1, 1, -1]}
         attr={{ color: "red", width: 0.2 }}
         join="Round"
         capsStart="Round"
         capsEnd="Square"
      />
   )
}

function App() {
   return (
      <Canvas>
         <MyLine />
      </Canvas>
   )
}
```

## Documentation

The core concept is based on instanced line rendering, well-documented in:

- [Instanced Line Rendering Part I](https://wwwtyro.net/2019/11/18/instanced-lines.html)
- [Instanced Line Rendering Part II](https://wwwtyro.net/2021/10/01/instanced-lines-part-2.html)

This library adapts these ideas into a reusable Three.js component with enhanced features.

[API Reference](./markdown/three-wideline.wideline.md)

## Examples

Live demo: [Wideline Example](https://www.number10.de/sample1)

CodeSandbox samples:

- [Logo Example](https://codesandbox.io/s/three-wideline-logo-u19je)
- [Animated Example](https://codesandbox.io/s/three-wideline-animated-tue8d)

## Repository

[GitHub: three-wideline](https://github.com/Michael--/three-wideline)

## Development

### Prerequisites

- Node.js >= 18
- pnpm

### Setup

```bash
pnpm install
```

### Development Commands

```bash
# Start development server with samples
pnpm start

# Run tests
pnpm test

# Build for production
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

### Recommended VS Code Extensions

This project includes recommended VS Code extensions in `.vscode/extensions.json`. Install them for the best development experience:

**Core Development:**

- [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter) - Auto import TypeScript modules
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatting
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - JavaScript/TypeScript linting

**Testing:**

- [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) - Test explorer for Vitest

**Three.js & React:**

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - CSS framework support

**Git & Productivity:**

- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) - Git history visualization
- [Todo Tree](https://marketplace.visualstudio.com/items?itemName=gruntfuggly.todo-tree) - Todo comments explorer

**File Support:**

- [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) - YAML file support
- [Markdownlint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-markdownlint) - Markdown linting

**Theme & Icons:**

- [VS Code Icons](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-icons) - File icons
- [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.material-theme) - Popular dark theme

### Testing

This project uses [Vitest](https://vitest.dev/) for testing. Tests are located in `src/**/*.test.tsx` files.

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run specific test file
pnpm test src/Wideline/Wideline.test.tsx
```

### Building

```bash
# Build samples for development
pnpm build

# Build library for distribution
pnpm dist
```

### Architecture

- **TypeScript/React** with strict typing
- **Three.js** for 3D rendering
- **Vite** for fast development and building
- **Vitest** for testing
- **ESLint + Prettier** for code quality
- **Husky** for git hooks
- **API Extractor** for documentation generation
