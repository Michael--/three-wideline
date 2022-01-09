import React from "react"
import { Canvas } from "@react-three/fiber"

export function ThreeCanvas(props: {
   width?: number | string
   height?: number | string
   scale?: number
   children?: React.ReactNode
}) {
   const width = props.width ?? "400px"
   const height = props.height ?? width
   return (
      <Canvas
         style={{
            backgroundColor: "#202020",
            width: width,
            height: height,
         }}
      >
         <group scale={[props.scale ?? 1, props.scale ?? 1, props.scale ?? 1]}>{props.children}</group>
      </Canvas>
   )
}
