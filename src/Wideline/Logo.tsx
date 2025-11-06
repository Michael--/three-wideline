import React from "react"
import { ThreeElements } from "@react-three/fiber"
import { Wideline } from "./Wideline"

type GroupProps = ThreeElements["group"]

/**
 * @public
 * Display the three-wideline logo as line drawn by itself.
 *
 * @param props - all possible three js group properties
 */
export function Logo(props?: GroupProps) {
   return (
      <group {...props}>
         <Wideline
            points={[-0.5, 0.5, -0.25, -0.5, 0, 0.5, 0.25, -0.5, 0.5, 0.5]}
            attr={[
               { color: "black", width: 0.25 },
               { color: "yellow", width: 0.2 },
               { color: "red", width: 0.15 },
            ]}
            join={"Round"}
            capsStart={"Round"}
            capsEnd={"Top"}
         />
      </group>
   )
}
