import { useRef, useState } from "react"
import { Canvas, useFrame, MeshProps } from "@react-three/fiber"
import { Mesh } from "three"

function Box(props: MeshProps) {
   // This reference gives us direct access to the THREE.Mesh object
   const ref = useRef<Mesh | undefined>(undefined)
   // Hold state for hovered and clicked events
   const [hovered, hover] = useState(false)
   const [clicked, click] = useState(false)
   // Subscribe this component to the render-loop, rotate the mesh every frame
   useFrame(() => {
      if (ref.current !== undefined) ref.current.rotation.x += 0.01
   })
   // Return the view, these are regular Threejs elements expressed in JSX
   return (
      <mesh
         {...props}
         ref={ref}
         scale={clicked ? 1.5 : 1}
         onClick={() => click(!clicked)}
         onPointerOver={() => hover(true)}
         onPointerOut={() => hover(false)}
      >
         <boxGeometry args={[1, 1, 1]} />
         <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      </mesh>
   )
}

function Three() {
   return (
      <Canvas
         style={{
            border: "1px dashed yellow",
         }}
      >
         <ambientLight />
         <pointLight position={[10, 10, 10]} />
         <Box position={[-1.2, 0, 0]} />
         <Box position={[1.2, 0, 0]} />{" "}
      </Canvas>
   )
}

export default function Main() {
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
         <p>BLA</p>
         <Three />
         <p>BLA</p>
      </div>
   )
}
