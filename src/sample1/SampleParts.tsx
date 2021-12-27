import * as React from "react"
import { Wideline, generatePointsInterleaved } from "../Wideline"
import { HBox, Body } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"

export function SampleParts() {
   const points = React.useMemo(() => generatePointsInterleaved(5, 5, 2), [])

   return (
      <HBox>
         <h3>Show line, joins and caps in different color</h3>
         <Body />
         <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
            <Wideline
               points={points}
               attr={{ color: "yellow", offals: "red", width: 0.5 }}
               join={"Round"}
               capsStart={"Round"}
               capsEnd={"Square"}
            />
         </ThreeCanvas>
      </HBox>
   )
}
