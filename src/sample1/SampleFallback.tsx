import React from "react"
import { Wideline } from "../Wideline"
import { Box, Paragraph } from "grommet"
import { ThreeCanvas } from "./ThreeCanvas"

export function SampleFallback() {
   return (
      <Box direction="column" pad="small">
         <Paragraph>Demonstration of graceful error handling with fallback component.</Paragraph>
         <Paragraph>Invalid props will show a red overlay in development mode.</Paragraph>
         <Box align="center">
            <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
               <ambientLight intensity={3} />
               {/* Valid line */}
               <Wideline
                  position={[-1, 0.5, 0]}
                  points={[-0.5, 0, 0, 0.5, 0, 0]}
                  attr={{ color: "green", width: 0.1 }}
               />
               {/* Invalid: missing attr prop - using type assertion to bypass TypeScript */}
               <Wideline position={[1, 0.5, 0]} points={[-0.5, 0, 0, 0.5, 0, 0]} attr={undefined as never} />
               {/* Invalid: invalid join - using type assertion */}
               <Wideline
                  position={[-1, -0.5, 0]}
                  points={[-0.5, 0, 0, 0.5, 0, 0]}
                  attr={{ color: "blue", width: 0.1 }}
                  join={"InvalidJoin" as never}
               />
               {/* Invalid: opacity out of range */}
               <Wideline
                  position={[1, -0.5, 0]}
                  points={[-0.5, 0, 0, 0.5, 0, 0]}
                  attr={{ color: "red", width: 0.1 }}
                  opacity={1.5}
               />
            </ThreeCanvas>
         </Box>
      </Box>
   )
}
