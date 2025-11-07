import React from "react"
import { ThreeCanvas } from "./ThreeCanvas"
import { Box, Paragraph } from "grommet"
import { Logo, Wideline } from "../Wideline"
import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events"

export function SampleRaycast() {
   const [color, setColor] = React.useState("yellow")
   const [rotation, setRotation] = React.useState(0)
   const [rotation2, setRotation2] = React.useState(0)

   // Debounce color changes to prevent rapid state updates
   const [debouncedColor, setDebouncedColor] = React.useState("yellow")
   const colorTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

   React.useEffect(() => {
      if (colorTimeoutRef.current) {
         clearTimeout(colorTimeoutRef.current)
      }
      colorTimeoutRef.current = setTimeout(() => {
         setDebouncedColor(color)
      }, 16) // ~60fps debounce

      return () => {
         if (colorTimeoutRef.current) {
            clearTimeout(colorTimeoutRef.current)
         }
      }
   }, [color])

   // Memoize event handlers to prevent recreation on every render
   const myEvents = React.useMemo<EventHandlers>(
      () => ({
         onPointerEnter: () => setColor("red"),
         onPointerLeave: () => setColor("yellow"),
         onClick: () => setRotation(prev => prev + 0.1),
      }),
      [],
   )

   // Memoize Logo click handlers
   const handleLogo1Click = React.useCallback(() => {
      setRotation2(prev => prev - 0.1)
   }, [])

   const handleLogo2Click = React.useCallback(() => {
      setRotation2(prev => prev + 0.1)
   }, [])

   return (
      <Box direction="column" align="center" pad="small">
         <Paragraph>
            Raycast the line geometry. OnPointerEnter/Leave adjust the color, onClick rotate the figure.
         </Paragraph>
         <ThreeCanvas height={"200px"}>
            <ambientLight intensity={2.5} />
            <Wideline
               scale={4}
               rotation={[0, 0, rotation]}
               points={[-0.5, 0.5, -0.25, -0.5, 0, 0.5, 0.25, -0.5, 0.5, 0.5]}
               attr={{ color: debouncedColor, width: 0.2 }}
               join={"Round"}
               capsStart={"Round"}
               capsEnd={"Top"}
               events={myEvents}
               boundingSphere={{ color: "pink", opacity: 0.25 }}
            />
            <Logo scale={2} rotation={[0, 0, rotation2]} position={[4, 2, 0.1]} onClick={handleLogo1Click} />
            <Logo scale={2} rotation={[0, 0, rotation2]} position={[-4, -2, 0.1]} onClick={handleLogo2Click} />
         </ThreeCanvas>
      </Box>
   )
}
