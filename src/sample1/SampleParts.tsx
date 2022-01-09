import React from "react"
import { Wideline, generatePointsInterleaved } from "../Wideline"
import { HBox, VBox, Body } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"

export function SampleParts() {
   const points = React.useMemo(() => generatePointsInterleaved(5, 5, 2), [])

   return (
      <HBox>
         <VBox>
            <p>Show line, joins and caps in different color.</p>
            <p>Interesting for debugging the shader.</p>
         </VBox>
         <Body />
         <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
            <ambientLight intensity={1} />
            <group onClick={e => console.log(`Bam2: distance=${e.distance} index=${e.index}`)}>
               <Wideline
                  events={{ onClick: e => console.log(`Bam1: distance=${e.distance} index=${e.index}`) }}
                  points={points}
                  attr={{ color: "yellow", offals: "red", width: 0.5 }}
                  join={"Round"}
                  capsStart={"Round"}
                  capsEnd={"Square"}
               />
            </group>
         </ThreeCanvas>
      </HBox>
   )
}
