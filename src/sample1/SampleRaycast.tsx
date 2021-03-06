import React from "react"
import { ThreeCanvas } from "./ThreeCanvas"
import { Box, Paragraph } from "grommet"
import { Logo, Wideline } from "../Wideline"
import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events"

export function SampleRaycast() {
   const [color, setColor] = React.useState("yellow")
   const [rotation, setRotation] = React.useState(0)
   const [rotation2, setRotation2] = React.useState(0)

   const myEvents: EventHandlers = {
      onPointerEnter: () => setColor("red"),
      onPointerLeave: () => setColor("yellow"),
      onClick: () => setRotation(rotation + 0.1),
   }

   return (
      <Box direction="column" align="center" pad="small">
         <Paragraph>
            Raycast the line geometry. OnPointerEnter/Leave adjust the color, onClick rotate the figure.
         </Paragraph>
         <ThreeCanvas width={"400px"} height={"200px"}>
            <ambientLight intensity={0.75} />
            <Wideline
               scale={4}
               rotation={[0, 0, rotation]}
               points={[-0.5, 0.5, -0.25, -0.5, 0, 0.5, 0.25, -0.5, 0.5, 0.5]}
               attr={{ color: color, width: 0.2 }}
               join={"Round"}
               capsStart={"Round"}
               capsEnd={"Top"}
               events={myEvents}
               boundingSphere={{ color: "pink", opacity: 0.25 }}
            />
            <Logo
               scale={2}
               rotation={[0, 0, rotation2]}
               position={[4, 2, 0.1]}
               onClick={() => setRotation2(rotation2 - 0.1)}
            />
            <Logo
               scale={2}
               rotation={[0, 0, rotation2]}
               position={[-4, -2, 0.1]}
               onClick={() => setRotation2(rotation2 + 0.1)}
            />
         </ThreeCanvas>
      </Box>
   )
}
