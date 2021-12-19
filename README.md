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

Some details about the Wideline interface is under construction - stay tuned.

## Todo

* Support of three js shader lib
* Documentation
* Nested import path caused by repository folder structure

## Repository
Github: [three-wideline](https://github.com/Michael--/three-wideline)

## Example

How to draw the Wideline Logo as a three js line.
Be ensure to add <Logo/> into your three js Canvas created by [React Three Fiber](https://www.npmjs.com/package/@react-three/fiber).
An running demo example from the repository is avaiable here [Wideline example](https://number10.de).

```ts
import { Wideline, generatePointsInterleaved } from "./Wideline/dist/Wideline"

export function Logo() {
   const points = useMemo(() => generatePointsInterleaved(5), [])
   return (
      <Wideline
         scale={[1, 1, 1]}
         points={points}
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
```

Enjoy !
