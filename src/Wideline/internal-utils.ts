import { Vector2, Vector3 } from "three"
import { ThreeElements } from "@react-three/fiber"
import { IVertices } from "./Scheme"

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

/**
 * @internal
 * Result of buildLine function
 */
export interface BuildLineResult {
   pA: number[][]
   pB: number[][]
   pC: number[][]
   pD: number[][]
   idx: number[][][]
}

/**
 * @internal
 * Builds line geometry data from points and vertices
 */
export const buildLine = (
   points: number[][],
   geoVertices: IVertices[],
): { result: BuildLineResult; position: number[][] } => {
   // intermediate points to access current position (pointA) and next position (pointB), etc.
   const pointA: number[][] = []
   const pointB: number[][] = []
   const pointC: number[][] = []
   const pointD: number[][] = []
   // index is already an index array of number, to avoid number[][][] use a type instead
   type IndexAll = number[][]
   const indexAll: IndexAll[] = []
   const plength = points.length
   let position: number[][] = []
   /** current index offset */
   let ofx = 0

   /** get a point at given index */
   const getPoint = (i: number) => {
      return points[Math.min(i, plength - 1)]
   }

   // loop vertices groups (body, caps, joins, custom)
   for (let ix = 0; ix < geoVertices.length; ix++) {
      // prepare next index for current group
      const index: number[][] = []
      const vtx = geoVertices[ix]
      const countPositions = vtx.position.length

      // add only one line part (body, etc.)
      const add = (i: number) => {
         if (i < plength - 1) {
            position = position.concat(vtx.position)
            vtx.index.forEach(e => index.push([e[0] + ofx, e[1] + ofx, e[2] + ofx]))
            ofx += countPositions
            // add much points as needed
            for (let n = 0; n < countPositions; n++) {
               pointA.push(getPoint(i))
               pointB.push(getPoint(i + 1))
               pointC.push(getPoint(i + 2))
               pointD.push(getPoint(i + 3))
            }
         }
      }

      // loop over all points, add needed line parts (for any segment, or only for start/end)
      for (let i = 0; i < plength; i++) {
         switch (vtx.limited) {
            case "Start": {
               const atStart = i === 0 || (i > 0 && getPoint(i - 1)[0] === undefined)
               if (atStart) add(i)
               break
            }

            case "End": {
               const atEnd = i === plength - 2 || (i < plength - 2 && getPoint(i + 2)[0] === undefined)
               if (atEnd) add(i)
               break
            }

            default:
               add(i)
               break
         }
      }
      indexAll.push(index)
   }

   return {
      result: {
         pA: pointA,
         pB: pointB,
         pC: pointC,
         pD: pointD,
         idx: indexAll,
      },
      position,
   }
}

/**
 * @internal
 * Geometry data returned by useMemo in Wideline component
 */
export interface LineGeometryData {
   anyUpdate: number
   position: number[]
   cx: number[]
   fa: Float32Array
   fb: Float32Array
   fc: Float32Array
   fd: Float32Array
   groups: MaterialGroup[]
   materials: ShaderMaterialProps[]
}
