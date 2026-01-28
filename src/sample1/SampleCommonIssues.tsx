import React from "react"
import { Wideline } from "../Wideline"
import { Box, Paragraph, Text } from "grommet"
import { ThreeCanvas } from "./ThreeCanvas"
import { useFrame } from "@react-three/fiber"
import { BufferGeometry, LineBasicMaterial, Line, Vector3, Group } from "three"

function RotatingLine() {
   const line = React.useMemo(() => {
      const geometry = new BufferGeometry().setFromPoints([
         new Vector3(-1.25, 0, 0),
         new Vector3(0, 1.25, 0),
         new Vector3(1.25, 0, 0),
      ])
      const material = new LineBasicMaterial({ color: "red" })
      return new Line(geometry, material)
   }, [])

   return <primitive object={line} />
}

function WidelineExample() {
   const widelineRef = React.useRef<Group>(null)
   useFrame((_, delta) => {
      if (widelineRef.current) {
         widelineRef.current.rotation.y += delta * 0.5
      }
   })

   return (
      <group ref={widelineRef}>
         <Wideline
            points={[-1.25, -0.5, 0, 1.0, 1.5, -0.25]}
            attr={[
               { color: "yellow", width: 0.5 },
               { color: "red", width: 0.3 },
            ]}
            join="Round"
            capsStart="Round"
            capsEnd="Round"
         />
      </group>
   )
}

export function SampleCommonIssues() {
   return (
      <Box direction="column" pad="small" gap="small">
         <Paragraph>Common issues when rendering lines in 3D scenes and how Wideline solves them.</Paragraph>
         <Paragraph>
            Wideline creates flat, 2.5D lines (not 3D pipes), ideal for UI overlays, street maps, or simple 3D lines.
         </Paragraph>
         <Box direction="column" gap="small">
            <Text size="small" color="dark-3">
               Note: Native Three.js lines are typically 1px thick and may not render consistently across devices.
               Wideline uses geometry for reliable thickness.
            </Text>
            <Box direction="row" gap="small" align="center">
               <Box>
                  <Text weight="bold">Problem: Native Three.js Line</Text>
                  <Text size="small">Thin lines that may not render consistently, no thickness, no joins.</Text>
                  <ThreeCanvas scale={2} height={"150px"}>
                     <ambientLight intensity={1} />
                     <RotatingLine />
                  </ThreeCanvas>
               </Box>
               <Box>
                  <Text weight="bold">Solution: Wideline</Text>
                  <Text size="small">Visible from all angles, configurable thickness, rounded joins.</Text>
                  <ThreeCanvas scale={2} height={"150px"}>
                     <ambientLight intensity={1} />
                     <WidelineExample />
                  </ThreeCanvas>
               </Box>
            </Box>
         </Box>
         <Box align="center">
            <ThreeCanvas height={"300px"}>
               <ambientLight intensity={1} />
               <pointLight position={[5, 5, 5]} />
               {/* Example 2.5D-Nature: Line on flat */}
               <Wideline
                  points={[-2, 0, 0, 0, 0, -2, 2, 0, 0]}
                  attr={{ color: "yellow", width: 0.5 }}
                  join="Round"
                  capsStart="Square"
                  capsEnd="Top"
               />
               {/* Some Lines performance */}
               {Array.from({ length: 10 }, (_, i) => (
                  <Wideline
                     key={i}
                     position={[0, 1, i * 0.2]}
                     points={[-5, 0, 0, 1, 0, 0, 5, 0, 0]}
                     join="Miter"
                     attr={{ color: `hsl(${i * 36}, 70%, 50%)`, width: 0.3 }}
                     opacity={0.4}
                  />
               ))}
            </ThreeCanvas>
         </Box>
      </Box>
   )
}
