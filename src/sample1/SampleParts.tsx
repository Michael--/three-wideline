/* eslint-disable no-console */
import React from "react"
import { Wideline, generatePointsInterleaved } from "../Wideline"
import { ThreeCanvas } from "./ThreeCanvas"
import { Box, Paragraph } from "grommet"
import { LineFeatureLabels } from "./LineFeatureLabels"

export function SampleParts() {
   const points = React.useMemo(() => generatePointsInterleaved(5, 5, 2), [])

   return (
      <Box direction="column" pad="small">
         <Paragraph>Show line, joins and caps in different color. Interesting for debugging the shader.</Paragraph>
         <Box align="center">
            <ThreeCanvas scale={2} height={"200px"}>
               <ambientLight intensity={3} />
               <group onClick={e => console.log(`Bam2: distance=${e.distance} index=${e.index}`)}>
                  <LineFeatureLabels
                     points={[...points, 3, 0]} // Add extra Z for last point
                     texts={["Start Cap", "Join", "Join", "Join", "End Cap", "Line Segments"]}
                     offsets={[
                        [-0.5, 0.6, 0.01],
                        [0, -0.5, 0.01],
                        [0, 0.5, 0.01],
                        [0, -0.5, 0.01],
                        [0.5, 0.6, 0.01],
                        undefined,
                     ]}
                  />
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
         </Box>
      </Box>
   )
}
