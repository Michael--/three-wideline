import { useMemo } from "react"
import { Wideline, IGeometry, IScheme, generatePointsInterleaved } from "../Wideline"
import { HBox, Body } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"
import { Color } from "three"

export function CustomLineParts() {
   const arrowGeometry: IGeometry = {
      positions: [
         [0.5, -0.5, 0],
         [0.8, 0.0, 0],
         [0.5, 0.5, 0],
         [0.2, 0.0, 0],
      ],
      cells: [
         [0, 1, 2],
         [2, 3, 0],
      ],
   }
   const arrowScheme: IScheme = { color: new Color("blue"), width: 0.2 }
   const arrow = { scheme: arrowScheme, geometry: arrowGeometry }

   const points = useMemo(() => generatePointsInterleaved(5, 5, 2), [])
   return (
      <HBox>
         <h3>Custom element on each line segment</h3>
         <Body />
         <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
            <Wideline points={points} attr={{ color: "yellow", width: 0.5 }} join={"Round"} custom={[arrow]} />
         </ThreeCanvas>
      </HBox>
   )
}
