import { useMemo } from "react"
import { Wideline } from "../Wideline"
import { HBox, Body } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"

export function SampleParts() {
   const points = useMemo(() => {
      return [
         [1, 0.5],
         [1, -1],
         [2, 0.75],
         [4, 1],
         [5.0, 0],
         [4.1, 0.2],
      ].flat()
   }, [])

   return (
      <HBox>
         <h3>Show parts of line in different color</h3>
         <Body />
         <ThreeCanvas scale={2} width={"400px"} height={"200px"}>
            <Wideline
               position={[-3, 0, 0]}
               points={points}
               scale={[1, 1, 1]}
               attr={{
                  color: "yellow",
                  offals: "red",
                  width: 0.5,
               }}
               join={"Round"}
               capsStart={"Round"}
               capsEnd={"Square"}
            />
         </ThreeCanvas>
      </HBox>
   )
}
