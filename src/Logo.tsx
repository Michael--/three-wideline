import { useMemo } from "react"
import { Wideline } from "./Wideline"
import { generatePointsInterleaved } from "./Wideline"

export function Logo() {
   const points = useMemo(() => generatePointsInterleaved(5), [])
   return (
      <Wideline
         scale={[1, 1, 1]}
         points={points}
         attr={[
            { color: "black", width: 0.25 },
            { color: "yellow", width: 0.2 },
            { color: "red", width: 0.15 },
         ]}
         join={"Round"}
         capsStart={"Round"}
         capsEnd={"Top"}
      />
   )
}
