import React from "react"
import { Wideline, generatePointsInterleaved } from "../Wideline"
import { HBox, VBox, Body } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"

export function SampleMultiple() {
   const p1 = React.useMemo(() => generatePointsInterleaved(5, 5, 2), [])
   const p2 = React.useMemo(() => [-2, 1.5, -1, 1, 0, 1.5, 2, 1.3, 3, 1.5, 3, -1], [])
   const p3 = React.useMemo(() => [0, 0.1, 1.5, 0.5, 2.2, -0.5], [])
   const p4 = React.useMemo(() => [-2, -1.5, 2.2, -1.4], [])

   return (
      <HBox>
         <VBox>
            <p>One line containing some line parts.</p>
            <p>Both are interpreted as one, only one set of shaders are used.</p>
         </VBox>
         <Body />
         <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
            <ambientLight intensity={1} />
            <Wideline
               points={[p1, p2, p3, p4]}
               attr={{ color: "yellow", offals: "red", width: 0.3 }}
               join={"Round"}
               capsStart={"Top"}
               capsEnd={"Round"}
            />
         </ThreeCanvas>
      </HBox>
   )
}
