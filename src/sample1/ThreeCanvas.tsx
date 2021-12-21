import { ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { HBox, Body } from "./Gui"

export function ThreeCanvas(props: {
   width?: number | string
   height?: number | string
   scale?: number
   children?: ReactNode
}) {
   const width = props.width ?? "400px"
   const height = props.height ?? width
   return (
      <HBox>
         <Canvas
            style={{
               backgroundColor: "#202020",
               width: width,
               height: height,
            }}
         >
            <group scale={[props.scale ?? 1, props.scale ?? 1, props.scale ?? 1]}>{props.children}</group>
         </Canvas>
         <Body style={{ paddingRight: "10px" }} />
      </HBox>
   )
}
