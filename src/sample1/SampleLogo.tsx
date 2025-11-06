import React from "react"
import { Logo } from "../Wideline"
import { ThreeCanvas } from "./ThreeCanvas"
import { useFrame, ThreeElements } from "@react-three/fiber"
import { Mesh, Group } from "three"
import { Box, Paragraph } from "grommet"

type MeshProps = ThreeElements["mesh"]
type GroupProps = ThreeElements["group"]

function MeshBox(props: MeshProps) {
   const ref = React.useRef<Mesh>(null)

   useFrame((_, delta) => {
      if (ref?.current !== null) {
         ref.current.rotation.y += delta
         ref.current.rotation.x += delta * 0.2
      }
   })

   return (
      <mesh {...props} ref={ref}>
         <boxGeometry args={[1, 1, 1]} />
         <meshStandardMaterial color={"purple"} />
      </mesh>
   )
}

function MovingLogo(props?: GroupProps) {
   const ref = React.useRef<Group>(null)
   const p = React.useRef(0)
   useFrame((_, delta) => {
      if (ref?.current != null) {
         ref.current.rotation.y += delta
         p.current += delta
         ref.current.position.x = 1.5 * Math.sin(p.current * 0.5)
         ref.current.position.y = 2.5 * Math.sin(p.current)
      }
   })
   return (
      <group ref={ref} {...props}>
         <Logo />
      </group>
   )
}

export function SampleLogo() {
   return (
      <Box direction="column" pad="small">
         <Paragraph>Wideline Logo drawn itself in a tiny 3D world. Some directional lights are enabled.</Paragraph>
         <Box align="center">
            <ThreeCanvas width={"400px"} height={"200px"}>
               <ambientLight intensity={0.2} />
               <pointLight position={[0, -2, 3]} intensity={0.4} color={"yellow"} />
               <spotLight intensity={1.2} position={[2, 2, 10]} angle={0.2} penumbra={1} color={"lightblue"} />

               <MeshBox position={[1, 0, -1]} scale={[2, 2, 2]} />
               <MovingLogo position={[0, 0, 2]} scale={[2, 2, 1]} />
               <Logo position={[0, 0, -8]} scale={[12, 12, 1]} />
            </ThreeCanvas>
         </Box>
      </Box>
   )
}
