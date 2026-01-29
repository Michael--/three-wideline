/* eslint-disable no-console */
import React from "react"
import { Wideline, generatePointsInterleaved } from "../Wideline"
import { ThreeCanvas } from "./ThreeCanvas"
import { Box, Paragraph } from "grommet"
import { LineFeatureLabels } from "./LineFeatureLabels"

export function SampleParts() {
   const points = React.useMemo(() => generatePointsInterleaved(5, 5, 2), [])
   const [eventsLog, setEventsLog] = React.useState<string[]>([])

   const addEvent = React.useCallback((message: string) => {
      setEventsLog(prev => [message, ...prev].slice(0, 5))
   }, [])

   return (
      <Box direction="column" pad="small">
         <Paragraph>Show line, joins and caps in different color. Interesting for debugging the shader.</Paragraph>
         <Box align="center">
            <ThreeCanvas scale={2} height={"200px"}>
               <ambientLight intensity={3} />
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
                  events={{
                     onClick: e => {
                        const message = `onClick(distance:${e.distance.toFixed(2)}, index=${e.index})`
                        console.log(message)
                        addEvent(message)
                     },
                  }}
                  points={points}
                  attr={{ color: "yellow", offals: "red", width: 0.5 }}
                  join={"Round"}
                  capsStart={"Round"}
                  capsEnd={"Square"}
               />
            </ThreeCanvas>
         </Box>
         <Box margin={{ top: "small" }} pad="xsmall" background="light-2" round="xsmall">
            <Paragraph margin="none">Events</Paragraph>
            {eventsLog.length === 0 ? (
               <Paragraph margin={{ top: "xsmall", bottom: "none" }}>No events yet.</Paragraph>
            ) : (
               eventsLog.map((message, index) => (
                  <Paragraph key={`${message}-${index}`} margin={{ top: "xsmall", bottom: "none" }}>
                     {message}
                  </Paragraph>
               ))
            )}
         </Box>
      </Box>
   )
}
