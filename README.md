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

* raycast
* check/adjust uv mapping
* multiple lines with one attribute set

## Repository
Github: [three-wideline](https://github.com/Michael--/three-wideline)

## Example
An running demo example from the repository is avaiable here [Wideline example](https://www.number10.de/sample1).

Samples at codesandbox:
* [logo](https://codesandbox.io/s/three-wideline-logo-u19je)
* [animated](https://codesandbox.io/s/three-wideline-animated-tue8d)
 

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
