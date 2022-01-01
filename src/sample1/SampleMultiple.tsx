import React from "react"
import { Wideline, generatePointsInterleaved } from "../Wideline"
import { HBox, VBox, Body } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"

export function SampleMultiple() {
   const p1 = React.useMemo(() => generatePointsInterleaved(5, 5, 2), [])
   const p2 = React.useMemo(() => [0, -1, -1, 1, 0, 1.5, 2, 1], [])

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
               points={[p1, p2]}
               attr={{ color: "yellow", offals: "red", width: 0.3 }}
               join={"Round"}
               capsStart={"Round"}
               capsEnd={"Square"}
            />
         </ThreeCanvas>
      </HBox>
   )
}
