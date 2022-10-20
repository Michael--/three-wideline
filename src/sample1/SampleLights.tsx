import React from "react"
import { Logo, Wideline } from "../Wideline"
import { Box, Paragraph } from "grommet"
import { ThreeCanvas } from "./ThreeCanvas"
import { useFrame, GroupProps, MeshProps } from "@react-three/fiber"
import { Mesh, SpotLight } from "three"

function TiltLogo(props?: GroupProps) {
   const ref = React.useRef<Mesh>(null)
   const p = React.useRef(0)
   const d = React.useRef(-1)
   useFrame((_, delta) => {
      if (ref?.current !== null && d.current !== null) {
         if (p.current < -1 && d.current < 0) d.current = 1
         else if (p.current > 1 && d.current > 0) d.current = -1
         p.current += delta * d.current
         ref.current.rotation.x = p.current * 0.2
      }
   })
   return (
      <group ref={ref} {...props}>
         <Wideline
            points={[-0.5, 0.5, -0.25, -0.5, 0, 0.5, 0.25, -0.5, 0.5, 0.5]}
            attr={[
               { color: "black", width: 0.25 },
               { color: "white", width: 0.2 },
            ]}
            join={"Round"}
            capsStart={"Round"}
            capsEnd={"Top"}
         />
      </group>
   )
}

function MovingSpot() {
   const ref = React.useRef<SpotLight>(null)
   const p = React.useRef(0)
   const d = React.useRef(-1)
   useFrame((_, delta) => {
      if (ref?.current !== null && d.current !== null) {
         if (p.current < -1 && d.current < 0) d.current = 1
         else if (p.current > 1 && d.current > 0) d.current = -1
         p.current += delta * d.current
         ref.current.position.x = p.current * 20
         ref.current.position.y = p.current * 20
      }
   })
   return <spotLight ref={ref} intensity={15} position={[10, 10, 25]} angle={0.12} penumbra={0.1} color={"white"} />
}

export function Plane(
   props: MeshProps & {
      size: number
      color?: string | number
   },
) {
   return (
      <mesh {...props}>
         <planeGeometry attach="geometry" args={[props.size, props.size, 3, 8]} />
         <meshStandardMaterial attach="material" color={props.color} />
      </mesh>
   )
}

export function SampleLights() {
   return (
      <Box direction="column" pad="small">
         <Paragraph>Some lights used to show the correctness of face normal calculation.</Paragraph>
         <Box align="center">
            <ThreeCanvas width={"400px"} height={"200px"}>
               <ambientLight intensity={0.5} />
               <pointLight position={[3, -5, 3]} intensity={0.5} color={"yellow"} />
               <MovingSpot />
               <TiltLogo position={[-2.8, 0, 0.8]} scale={[5, 5, 3]} />
               <TiltLogo position={[2.8, 0, 0.85]} scale={[5, 5, 3]} />
               <Plane size={5} position={[-1, 1, 0]} color="purple" />
               <Plane size={5} position={[1, -1, -0.01]} color="green" />
               <Logo position={[2.5, -1, 3]} />
            </ThreeCanvas>
         </Box>
      </Box>
   )
}
