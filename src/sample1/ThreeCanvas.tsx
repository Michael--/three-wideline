import React from "react"
import { Canvas, type CameraProps } from "@react-three/fiber"
import * as THREE from "three"

export function ThreeCanvas(props: {
   width?: number | string
   height?: number | string
   scale?: number
   camera?: CameraProps
   children?: React.ReactNode
}) {
   const width = props.width ?? "400px"
   const height = props.height ?? width
   return (
      <Canvas
         camera={props.camera}
         style={{
            backgroundColor: "#202020",
            width: width,
            height: height,
         }}
         gl={{
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
            toneMapping: THREE.ACESFilmicToneMapping,
         }}
      >
         <group scale={[props.scale ?? 1, props.scale ?? 1, props.scale ?? 1]}>{props.children}</group>
      </Canvas>
   )
}
