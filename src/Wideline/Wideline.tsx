import * as React from "react"
import { Vector3 as FiberVector3, Euler } from "@react-three/fiber"
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
export const JoinsList = ["None", "Bevel", "Miter", "Round"] as const

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

   /** Line local position. */
   position?: FiberVector3

   /** Line scale */
   scale?: FiberVector3

   /** Line rotation */
   rotation?: Euler
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
export function Wideline(props: IWidelineProps) {
   const attr = React.useMemo(() => {
      return props.attr instanceof Array ? props.attr : [props.attr]
   }, [props.attr])

   const transparency = React.useMemo(() => (props.opacity !== undefined ? props.opacity < 1 : false), [props.opacity])

   const pkey = React.useMemo(() => {
      return (
         props.points.length.toString() +
         attr.map(e => `${e.width}${e.color}${e.offals}`) +
         props.join +
         props.capsStart +
         props.capsEnd +
         props.custom?.length +
         (props.opacity !== undefined ? props.opacity.toFixed(2) : "")
      )
   }, [props.points, props.join, props.capsStart, props.capsEnd, props.custom, props.opacity, attr])

   const points = React.useMemo(() => {
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
      return normalizeShape(props.points)
   }, [props.points])

   const scheme = React.useMemo(() => new Scheme(), [])

   const geo = React.useMemo(() => {
      scheme.reset()
      const mainColor = (a: IAttribute) => new Color(a.color)
      const altColor = (a: IAttribute) => (a.offals === undefined ? mainColor(a) : new Color(a.offals))

      if (props.opacity !== undefined && props.opacity < 1)
         scheme.strip(attr.map(e => ({ color: mainColor(e), width: e.width, opacity: props.opacity })))
      else scheme.simple(attr.map(e => ({ color: mainColor(e), width: e.width })))

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
         const s = attr.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
         scheme.addCap(s, capgeo(props.capsStart), "Start")
      }
      if (props.capsEnd !== undefined && props.opacity !== 0) {
         const s = attr.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
         scheme.addCap(s, capgeo(props.capsEnd), "End")
      }

      if (props.opacity !== 0) {
         switch (props.join) {
            case "Bevel": {
               const s = attr.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
               scheme.bevel(s)
               break
            }
            case "Miter": {
               const s = attr.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
               scheme.miter(s)
               break
            }
            case "Round": {
               const s = attr.map(e => ({ color: altColor(e), width: e.width, opacity: props.opacity }))
               scheme.roundJoin(s, 10)
               break
            }
         }
      }
      props.custom?.forEach(e => scheme.custom(e.scheme, e.geometry))
      return scheme.getScheme()
   }, [pkey, attr])

   const val = React.useMemo(() => {
      scheme.transparency = transparency
      const plength = points.length / 3

      let position: number[] = []
      const pointA: number[] = []
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
      const normal = Array(position.length / 3)
         .fill("a")
         .map(() => [1, 1])
         .flat()
      return {
         anyUpdate: Math.random(),
         position,
         normal,
         cx,
         count,
         fa,
         offset: countPositions * 3,
         groups,
         materials: materials.flat(),
      }
   }, [geo, points])

   return (
      <mesh position={props.position} scale={props.scale} rotation={props.rotation}>
         <bufferGeometry key={val.anyUpdate} attach="geometry" groups={val.groups}>
            <bufferAttribute
               attachObject={["attributes", "position"]}
               count={val.position.length / 3}
               array={new Float32Array(val.position)}
               itemSize={3}
            />
            <bufferAttribute
               attachObject={["attributes", "normal"]}
               count={val.normal.length / 2}
               array={new Float32Array(val.normal)}
               itemSize={2}
            />
            <bufferAttribute attach="index" array={new Uint16Array(val.cx)} count={val.cx.length} itemSize={1} />
            <bufferAttribute attachObject={["attributes", "pointA"]} array={val.fa} itemSize={3} />
            <bufferAttribute
               attachObject={["attributes", "pointB"]}
               array={val.fa.slice(val.offset * 1)}
               itemSize={3}
            />
            <bufferAttribute
               attachObject={["attributes", "pointC"]}
               array={val.fa.slice(val.offset * 2)}
               itemSize={3}
            />
            {/* pointD is only used by "strip" shader used when transparent */}
            {transparency && (
               <bufferAttribute
                  attachObject={["attributes", "pointD"]}
                  array={val.fa.slice(val.offset * 3)}
                  itemSize={3}
               />
            )}
         </bufferGeometry>
         {val.materials.map((matProps, i) => (
            <shaderMaterial key={i + pkey} attachArray="material" {...matProps} />
         ))}
      </mesh>
   )
}
