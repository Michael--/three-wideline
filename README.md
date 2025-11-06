# three-wideline

A three js line implementation.

## Install

```
npm install three-wideline -S
```

## Documentation

The basic idea is very well documented here [Instanced Line Rendering Part I](https://wwwtyro.net/2019/11/18/instanced-lines.html) and here [Instanced Line Rendering Part II](https://wwwtyro.net/2021/10/01/instanced-lines-part-2.html).

This implementation get this idea and provide a class to use together with three js.
Most of the shader are reused here with small adjustments.

[API Reference](./markdown/three-wideline.wideline.md)

## Todo

- raycast
- check/adjust uv mapping
- multiple lines with one attribute set

## Repository

Github: [three-wideline](https://github.com/Michael--/three-wideline)

## Example

An running demo example from the repository is available here [Wideline example](https://www.number10.de/sample1).

Samples at codesandbox:

- [logo](https://codesandbox.io/s/three-wideline-logo-u19je)
- [animated](https://codesandbox.io/s/three-wideline-animated-tue8d)

How to draw the Wideline Logo as a three js line using typescript and react.

```ts
import React from "react"
import ReactDOM from "react-dom"
import { Canvas } from "@react-three/fiber"
import { Wideline } from "three-wideline"

function Logo() {
   return (
      <Wideline
         scale={[5, 5, 1]}
         points={[-0.5, 0.5, -0.25, -0.5, 0, 0.5, 0.25, -0.5, 0.5, 0.5]}
         attr={[
            { color: "black", width: 0.25 },
            { color: "yellow", width: 0.2 },
            { color: "red", width: 0.15 },
         ]}
         join={"Round"}
         capsStart={"Round"}
         capsEnd={"Top"}
      />
   )
}

ReactDOM.render(
   <Canvas style={{ backgroundColor: "grey", height: "400px" }}>
      <ambientLight intensity={0.75} />
      <Logo />
   </Canvas>,
   document.getElementById('root'),
)
```

Enjoy !

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
