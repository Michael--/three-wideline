import { useMemo } from "react"
import { GroupProps } from "@react-three/fiber"
import { Color, ColorRepresentation, Vector2, Vector3 } from "three"
import { Scheme, IVertices, IGeometry, roundCapGeometry, squareCapGeometry, topCapGeometry, IScheme } from "./Scheme"

/**
 * @public
 * Shape point definition.
 */
export type Shape = Vector3[] | Vector2[] | number[]

/**
 * @public
 * Appearing of the line, mainly width and color.
 */
export interface IAttribute {
   /** The main color of the line */
   color?: ColorRepresentation
   /** Show some inner parts with an alternative color, e.g. miter, bevel ... */
   offals?: ColorRepresentation
   /** The with of the line */
   width?: number
}

/**
 * @public
 * Custom element definition
 */
export interface ICustom {
   /** How it appear */
   scheme: IScheme
   /** The user defined geometry */
   geometry: IGeometry
}

/**
 * @public
 * Line cap representation.
 */
export const CapsList = ["Butt", "Round", "Square", "Top"] as const

/**
 * @public
 * Line cap representation.
 */
export type Caps = typeof CapsList[number]

/**
 * @public
 * Line join representation.
 */
export const JoinsList = ["Bevel", "Miter", "Round"] as const

/**
 * @public
 * Line join representation.
 */
export type Joins = typeof JoinsList[number]

/**
 * @public
 * Line properties.
 */
export interface IWidelineProps {
   /** The shape of the line, some points. */
   points: Shape
   /** The line attribute, use an array to draw multiple lines with same geometry. */
   attr: IAttribute | IAttribute[]
   /** Line opacity, is less than 1, the line is transparent. Optimized shader are used in that case. */
   opacity?: number
   /** Which joins are used */
   join?: Joins
   /** The start cap of the line */
   capsStart?: Caps | IGeometry
   /** The end cap of the line */
   capsEnd?: Caps | IGeometry
   /** A user defined custom element for any segment of the line @beta */
   custom?: ICustom[]
}

/**
 * @public
 * Displayed a 2D-Line as indexed mesh, whereby the mesh consists of the determined line options.
 * A geometry is calculated which are drawn by several vertex shader.
 *
 * @example Line between 2 points with default attributes (white, width=1).
 * ```
 * <Wideline points={[-1, -1, 1, 1]} attr={{}} />
 * ```
 *
 * @example Line between 3 points (red, width=0.2, round join).
 * ```
 * <Wideline points={[-1, -1, 0, 1, 1, -1]} attr={{ color: "red", width: 0.2 }} join="Round" />
 * ```
 */
export function Wideline(props: GroupProps & IWidelineProps) {
   const attr = useMemo(() => {
      const scheme = new Scheme()
      const mainColor = (a: IAttribute) => new Color(a.color)
      const altColor = (a: IAttribute) => (a.offals === undefined ? mainColor(a) : new Color(a.offals))

      const ar = props.attr instanceof Array ? props.attr : [props.attr]

      if (props.opacity !== undefined) {
         if (props.opacity > 0)
            scheme.strip(ar.map(e => ({ color: mainColor(e), width: e.width, opacity: props.opacity })))
      } else {
         scheme.simple(ar.map(e => ({ color: mainColor(e), width: e.width })))
      }

      const capgeo = (c: Caps | IGeometry): IGeometry | undefined => {
         if (typeof c !== "string") return c
         switch (c) {
            case "Round":
               return roundCapGeometry(10)
            case "Square":
               return squareCapGeometry()
            case "Top":
               return topCapGeometry()
         }

         return undefined
      }

      if (props.capsStart !== undefined && props.opacity !== 0) {
         const s = ar.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
         scheme.addCap(s, capgeo(props.capsStart), "Start")
      }
      if (props.capsEnd !== undefined && props.opacity !== 0) {
         const s = ar.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
         scheme.addCap(s, capgeo(props.capsEnd), "End")
      }

      if (props.opacity !== 0) {
         switch (props.join) {
            case "Bevel": {
               const s = ar.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
               scheme.bevel(s)
               break
            }
            case "Miter": {
               const s = ar.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
               scheme.miter(s)
               break
            }
            case "Round": {
               const s = ar.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
               scheme.roundJoin(s, 10)
               break
            }
         }
      }
      props.custom?.forEach(e => scheme.custom(e.scheme, e.geometry))

      const normalizeShape = (points: Shape) => {
         const linePoints: number[] = []
         if (points[0] instanceof Vector2) {
            for (let j = 0; j < points.length; j++) {
               const p = points[j] as Vector2
               linePoints.push(p.x, p.y, 0)
            }
         } else if (points[0] instanceof Vector3) {
            for (let j = 0; j < points.length; j++) {
               const p = points[j] as Vector3
               linePoints.push(p.x, p.y, p.z)
            }
         } else {
            const p = points as number[]
            for (let j = 0; j < p.length; j += 2) {
               linePoints.push(p[j], p[j + 1], 0)
            }
         }
         return linePoints
      }

      const points = normalizeShape(props.points)
      const plength = points.length / 3

      let position: number[] = []
      const pointA: number[] = []
      const geo = scheme.getScheme()
      const countPositions = geo.positions.length / 3
      const vertices: IVertices[] = []
      for (let i = 0; i < geo.vertices.length; i++) vertices.push({ index: [], limited: geo.vertices[i].limited })

      /** get a point at given index */
      const getPoint = (i: number) => {
         return { px: points[i * 3 + 0], py: points[i * 3 + 1], pz: points[i * 3 + 1] }
      }
      for (let i = 0; i < plength; i++) {
         const { px, py, pz } = getPoint(i)
         // add much points as needed
         for (let n = 0; n < countPositions; n++) pointA.push(px, py, pz)

         if (i >= plength - 1) {
            // append some for 'pointC', 'pointD'
            for (let n = 0; n < countPositions * 2; n++) pointA.push(px, py, pz)
         }

         if (i < plength - 1) {
            position = position.concat(geo.positions)
            geo.vertices.map((v, j) => {
               v.index.forEach(e => {
                  switch (vertices[j].limited) {
                     case "Start":
                        if (i === 0) vertices[j].index.push(e + i * countPositions)
                        break
                     case "End":
                        if (i === plength - 2) vertices[j].index.push(e + i * countPositions)
                        break
                     case undefined:
                        vertices[j].index.push(e + i * countPositions)
                        break
                  }
               })
            })
         }
      }

      let start = 0
      let gcount = 0
      let cx: number[] = []
      const materials = geo.shader
      if (vertices.length !== materials.length) throw new Error("Vertices vs. Shader count error")

      // create material groups in the right order
      const groups: { start: number; count: number; materialIndex: number; seq: number }[] = []
      for (let i = 0; i < vertices.length; i++) {
         const e = vertices[i]
         materials[i].forEach((_, seq) => groups.push({ start, count: e.index.length, materialIndex: gcount++, seq }))
         start += e.index.length
         cx = cx.concat(e.index)
      }
      // sort by sequence
      groups.sort((a, b) => {
         if (a.seq > b.seq) return 1
         if (a.seq < b.seq) return -1
         return a.start - b.start
      })
      const count = plength * countPositions
      const fa = new Float32Array(pointA)
      const key = Math.random()
      return { key, position, cx, count, fa, offset: countPositions * 3, groups, materials: materials.flat() }
   }, [props])

   return (
      <group key={attr.key} {...props}>
         <mesh>
            <bufferGeometry attach="geometry" groups={attr.groups}>
               <bufferAttribute
                  attachObject={["attributes", "position"]}
                  count={attr.position.length / 3}
                  array={new Float32Array(attr.position)}
                  itemSize={3}
               />
               <bufferAttribute attach="index" array={new Uint16Array(attr.cx)} count={attr.cx.length} itemSize={1} />
               <bufferAttribute attachObject={["attributes", "pointA"]} array={attr.fa} itemSize={3} />
               <bufferAttribute
                  attachObject={["attributes", "pointB"]}
                  array={attr.fa.slice(attr.offset * 1)}
                  itemSize={3}
               />
               <bufferAttribute
                  attachObject={["attributes", "pointC"]}
                  array={attr.fa.slice(attr.offset * 2)}
                  itemSize={3}
               />
               <bufferAttribute
                  attachObject={["attributes", "pointD"]}
                  array={attr.fa.slice(attr.offset * 3)}
                  itemSize={3}
               />
            </bufferGeometry>
            {attr.materials.map((matProps, i) => (
               <shaderMaterial key={i} attachArray="material" {...matProps} />
            ))}
         </mesh>
      </group>
   )
}
