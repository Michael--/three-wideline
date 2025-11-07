import React from "react"
import { Canvas, type CameraProps } from "@react-three/fiber"
import * as THREE from "three"

export function ThreeCanvas(props: {
   width?: number | string
   height?: number | string
   scale?: number
   camera?: CameraProps
   backgroundColor?: string
   children?: React.ReactNode
}) {
   const width = props.width
   const height = props.height // ?? "400px"
   return (
      <Canvas
         camera={props.camera}
         style={{
            backgroundColor: props.backgroundColor ?? "#202020",
            ...(width !== undefined && { width }),
            ...(height !== undefined && { height }),
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
