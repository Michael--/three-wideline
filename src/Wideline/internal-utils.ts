import { Vector2, Vector3 } from "three"
import { ThreeElements } from "@react-three/fiber"

type ShaderMaterialProps = ThreeElements["shaderMaterial"]

/** @internal Shape type definition */
export type Shape = Vector2[] | Vector3[] | number[]

/**
 * @internal
 * Normalizes a single shape to number[][] format
 */
export const normalizeShape = (points: Shape): number[][] => {
   const linePoints: number[][] = []
   if (points[0] instanceof Vector2) {
      for (let j = 0; j < points.length; j++) {
         const p = points[j] as Vector2
         linePoints.push([p.x, p.y, 0])
      }
   } else if (points[0] instanceof Vector3) {
      for (let j = 0; j < points.length; j++) {
         const p = points[j] as Vector3
         linePoints.push([p.x, p.y, p.z])
      }
   } else {
      const p = points as number[]
      for (let j = 0; j < p.length; j += 2) {
         linePoints.push([p[j], p[j + 1], 0])
      }
   }
   return linePoints
}

/**
 * @internal
 * Material group definition
 */
export interface MaterialGroup {
   start: number
   count: number
   materialIndex: number
   seq: number
}

/**
 * @internal
 * Creates material groups from indices and materials
 */
export const createMaterialGroups = (idx: number[][][], materials: ShaderMaterialProps[][]): MaterialGroup[] => {
   let start = 0
   let gcount = 0
   const groups: MaterialGroup[] = []

   for (let i = 0; i < idx.length; i++) {
      const index = idx[i]
      materials[i].forEach((_, seq) => {
         groups.push({ start, count: index.length * 3, materialIndex: gcount++, seq })
      })
      start += index.length * 3
   }

   // Sort by sequence
   groups.sort((a, b) => {
      if (a.seq > b.seq) return 1
      if (a.seq < b.seq) return -1
      return a.start - b.start
   })

   return groups
}
