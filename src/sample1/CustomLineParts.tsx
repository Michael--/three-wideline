import { useMemo } from "react"
import { Wideline, IGeometry, IScheme, generatePointsInterleaved, ICustom } from "../Wideline"
import { HBox, Body } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"
import { Color } from "three"

export function CustomLineParts() {
   const arrowGeometry: IGeometry = {
      positions: [
         [0.5, -0.5, 0],
         [1, 0.0, 0],
         [0.5, 0.5, 0],
         [0, 0.0, 0],
      ],
      cells: [
         [0, 1, 2],
         [2, 3, 0],
      ],
   }
   const arrowScheme: IScheme = { color: new Color("blue"), width: 0.25 }
   const arrow: ICustom = { scheme: arrowScheme, geometry: arrowGeometry }

   const points = useMemo(() => generatePointsInterleaved(5, 5, 2), [])
   return (
      <HBox>
         <h3>Custom element on each line segment, custom caps</h3>
         <Body />
         <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
            <Wideline
               points={points}
               attr={{ color: "yellow", width: 0.5 }}
               join={"Round"}
               capsStart={arrowGeometry}
               capsEnd={arrowGeometry}
               custom={[arrow]}
            />
         </ThreeCanvas>
      </HBox>
   )
}
