import { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { Vector2, Color } from "three"
import { Wideline } from "./Wideline"

function generatePointsInterleaved(count: number, width?: number, height?: number) {
   const xscale = width ? width * 0.5 : 0.5
   const yscale = height ? height * 0.5 : 0.5
   const stepx = (2 * xscale) / count
   let y = yscale
   const result: number[] = []
   for (let x = 0; x < count; x++) {
      result.push(-xscale + x * stepx, y)
      y *= -1
   }
   return result
}

function Three() {
   const p4 = useMemo(() => generatePointsInterleaved(4), [])
   const p6 = useMemo(() => generatePointsInterleaved(6), [])
   const p6f = useMemo(() => generatePointsInterleaved(6, 3, 1), [])

   const lines = useMemo(() => {
      const arrowGeometry = {
         positions: [
            [0.2, -0.5, 0],
            [0.8, 0.0, 0],
            [0.2, 0.5, 0],
         ],
         cells: [[0, 1, 2]],
      }
      const myArrow = { scheme: { color: new Color("blue"), width: 0.1 }, geometry: arrowGeometry }

      return [-1, 1].map((e, i) => (
         <group key={i}>
            <Wideline
               position={[e * 2, 2, 0]}
               points={p4}
               opacity={i === 0 ? undefined : 0.5}
               attr={{
                  color: "red",
                  width: 0.2,
               }}
               join={"Miter"}
               capsStart={"Round"}
               capsEnd={"Square"}
               custom={[myArrow]}
            />
            <Wideline
               position={[e * 2, 0, 0]}
               points={p6}
               opacity={i === 0 ? undefined : 0.5}
               attr={{
                  color: "green",
                  width: 0.2,
               }}
               join={"Bevel"}
               capsStart={"Round"}
               capsEnd={"Square"}
            />
            <Wideline
               position={[e * 2.5 - 3, -2.1, 0]}
               points={[
                  new Vector2(1, 0),
                  new Vector2(1, -1),
                  new Vector2(2, 0.75),
                  new Vector2(4, 1),
                  new Vector2(5.0, 0),
                  new Vector2(4.1, 0.4),
               ]}
               scale={[1, 1, 1]}
               opacity={i === 0 ? undefined : 0.5}
               attr={{
                  color: "yellow",
                  offals: "red",
                  width: 0.5,
               }}
               join={"Round"}
               capsStart={"Round"}
               capsEnd={"Square"}
            />
         </group>
      ))
   }, [])

   return (
      <Canvas
         style={{
            border: "1px dashed yellow",
         }}
      >
         <ambientLight />
         <pointLight position={[10, 10, 10]} />
         {lines}
         <Wideline
            position={[0, 1, 0]}
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]}
            points={p6f}
            attr={[
               {
                  color: "pink",
                  width: 0.2,
               },
               {
                  color: "brown",
                  //offals: "yellow",
                  width: 0.15,
               },
            ]}
            join={"Round"}
            capsStart={"Top"}
            capsEnd={"Top"}
         />
      </Canvas>
   )
}

export function Main() {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            border: "5px dashed green",
         }}
      >
         <p>BLA</p>
         <Three />
      </div>
   )
}
