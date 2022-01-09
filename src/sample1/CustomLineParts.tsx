import React from "react"
import { Wideline, IGeometry, IScheme, generatePointsInterleaved, ICustom } from "../Wideline"
import { Box, Paragraph } from "grommet"
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
   const arrowScheme: IScheme = { color: new Color("green"), width: 0.25 }
   const arrow: ICustom = { scheme: arrowScheme, geometry: arrowGeometry }

   const points = React.useMemo(() => generatePointsInterleaved(5, 5, 1), [])
   return (
      <Box direction="column" pad="small">
         <Paragraph>1. Custom element on each line segment, custom caps.</Paragraph>
         <Paragraph>2. Custom element only.</Paragraph>
         <Box align="center">
            <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
               <ambientLight intensity={1} />
               <Wideline
                  position={[0, 0.75, 0]}
                  points={points}
                  attr={{ color: "yellow", width: 0.5 }}
                  join={"Round"}
                  capsStart={arrowGeometry}
                  capsEnd={arrowGeometry}
                  custom={[arrow]}
               />
               <Wideline
                  position={[0, -0.75, 0]}
                  points={points}
                  attr={[]} // empty attr exclude main line parts (as same as with opacity=0)
                  custom={[arrow]}
               />
            </ThreeCanvas>
         </Box>
      </Box>
   )
}
