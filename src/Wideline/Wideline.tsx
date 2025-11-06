import React, { JSX } from "react"
import { Vector3 as FiberVector3, Euler } from "@react-three/fiber"
import {
   Color,
   ColorRepresentation,
   Vector2,
   Vector3,
   Matrix4,
   Ray,
   Raycaster,
   Intersection,
   Object3D,
   Box3,
   Sphere,
   BufferGeometry,
   Mesh,
} from "three"
import { Scheme, IGeometry, roundCapGeometry, squareCapGeometry, topCapGeometry, IScheme } from "./Scheme"
import { EventHandlers } from "@react-three/fiber/dist/declarations/src/core/events"

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
export type Caps = (typeof CapsList)[number]

/**
 * @public
 * Line join representation.
 */
export const JoinsList = ["None", "Bevel", "Miter", "Round"] as const

/**
 * @public
 * Line join representation.
 */
export type Joins = (typeof JoinsList)[number]

/**
 * @public
 * Line properties.
 */
export interface IWidelineProps {
   /** The shape of the line, some points. */
   points: Shape | Shape[]

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

   /** disable raycast options, could be useful for busy scenes to optimize cpu footprint (tons of lines) */
   noRaycast?: boolean

   /** show for debugging purpose the bounding sphere of the line */
   boundingSphere?: { color: ColorRepresentation; opacity: number }

   /** some core event handler like onClick() */
   events?: EventHandlers
}

/** @internal break in pointlist to cancatenate lines to be used as one */
const p0 = [[undefined, undefined, undefined]] as unknown as number[]

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

   // get an array of points (multiple line with one set of attrbibutes)
   const aPoints = React.useMemo(() => {
      const normalizeShape = (points: Shape) => {
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

      // props.points consists of: Shape | Shape[]
      if (props.points[0] instanceof Vector3 || typeof props.points[0] === "number")
         return normalizeShape(props.points as Shape)

      return props.points.map(p => normalizeShape(p as Shape).concat(p0)).flat()
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

      let position: number[][] = []

      const buildLine = (points: number[][]) => {
         // intermediate points to access current position (pointA) and next position (pointB), etc.
         const pointA: number[][] = []
         const pointB: number[][] = []
         const pointC: number[][] = []
         const pointD: number[][] = []
         // index is aleady an index array of number, to avoid number[][][] use a type instead
         type IndexAll = number[][]
         const indexAll: IndexAll[] = []
         const plength = points.length
         /** current index offset */
         let ofx = 0

         /** get a point at given index */
         const getPoint = (i: number) => {
            return points[Math.min(i, plength - 1)]
         }

         // loop vertices groups (body, caps, joins, custom)
         for (let ix = 0; ix < geo.vertices.length; ix++) {
            // prepare next index for current group
            const index: number[][] = []
            const vtx = geo.vertices[ix]
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
            pA: pointA,
            pB: pointB,
            pC: pointC,
            pD: pointD,
            idx: indexAll,
         }
      }

      const line = buildLine(aPoints)

      let start = 0
      let gcount = 0
      let cx: number[][] = []
      const materials = geo.shader
      const idx = line.idx
      if (idx.length !== materials.length) throw new Error("Vertices vs. Shader count error")

      // create material groups in the right order
      const groups: { start: number; count: number; materialIndex: number; seq: number }[] = []
      for (let i = 0; i < idx.length; i++) {
         const index = idx[i]
         materials[i].forEach((_, seq) => groups.push({ start, count: index.length * 3, materialIndex: gcount++, seq }))
         start += index.length * 3
         cx = cx.concat(index)
      }
      // sort by sequence
      groups.sort((a, b) => {
         if (a.seq > b.seq) return 1
         if (a.seq < b.seq) return -1
         return a.start - b.start
      })

      const fa = new Float32Array(line.pA.flat())
      const fb = new Float32Array(line.pB.flat())
      const fc = new Float32Array(line.pC.flat())
      const fd = new Float32Array(line.pD.flat())
      return {
         anyUpdate: Math.random(),
         position: position.flat(),
         cx: cx.flat(),
         fa,
         fb,
         fc,
         fd,
         groups,
         materials: materials.flat(),
      }
   }, [geo, aPoints])

   const mref = React.useRef<Mesh>(null)
   const [sphere, setSphere] = React.useState<JSX.Element | undefined>(undefined)

   const onUpdate = (geometry: BufferGeometry) => {
      const plength = aPoints.length
      const px = new Vector3()
      const ax: Vector3[] = []
      for (let i = 0; i < plength; i++) {
         px.fromArray(aPoints[i], 0)
         ax.push(px.clone())
      }

      const cSphere = () => {
         if (mref.current !== null) {
            const mesh = mref.current
            geometry.boundingSphere = new Sphere()
            geometry.boundingSphere.setFromPoints(ax)
            geometry.boundingSphere.applyMatrix4(mesh.matrix)

            if (props.boundingSphere) {
               const bs = geometry.boundingSphere
               const s = (
                  <mesh position={bs?.center}>
                     <sphereGeometry attach="geometry" args={[bs?.radius, 15, 15]} />
                     <meshStandardMaterial
                        attach="material"
                        color={props.boundingSphere.color}
                        transparent={true}
                        opacity={props.boundingSphere.opacity}
                     />
                  </mesh>
               )
               setSphere(s)
            }
         }
      }

      const cBox = () => {
         if (mref.current !== null) {
            const mesh = mref.current
            geometry.boundingBox = new Box3()
            geometry.boundingBox.setFromPoints(ax)
            geometry.boundingBox.applyMatrix4(mesh.matrix)
         }
      }

      geometry.computeBoundingSphere = cSphere
      geometry.computeBoundingBox = cBox
   }

   let raycast: ((raycaster: Raycaster, intersects: Intersection[]) => void) | undefined = undefined
   if (props.noRaycast !== true)
      raycast = React.useCallback((raycaster: Raycaster, intersects: Intersection[]) => {
         if (mref.current !== null) {
            const interRay = new Vector3()
            const matrixWorld = mref.current.matrixWorld

            const inverseMatrix = new Matrix4()
            inverseMatrix.copy(matrixWorld).invert()
            const ray = new Ray()
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix)

            // fast check bounding sphere first
            const geometry = mref.current.geometry
            if (geometry.boundingSphere === null) geometry.computeBoundingSphere()
            if (geometry.boundingSphere !== null && ray.intersectSphere(geometry.boundingSphere, interRay) === null)
               return

            const vStart = new Vector3()
            const vEnd = new Vector3()
            const interSegment = new Vector3()

            const width = attr.length > 0 && attr[0].width !== undefined ? attr[0].width : 1

            const plength = aPoints.length
            for (let i = 0; i < plength - 1; i++) {
               vStart.fromArray(aPoints[i], 0)
               vEnd.fromArray(aPoints[i + 1], 0)

               const precision = width / 2
               const precisionSq = precision * precision
               const distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment)
               if (distSq > precisionSq) continue

               interRay.applyMatrix4(matrixWorld) // Move back to world space for distance calculation
               const distance = raycaster.ray.origin.distanceTo(interRay)
               if (distance < raycaster.near || distance > raycaster.far) continue

               intersects.push({
                  distance: distance,
                  point: interSegment.clone().applyMatrix4(matrixWorld),
                  index: i,
                  face: null,
                  faceIndex: undefined,
                  object: mref.current as Object3D,
               })
               // break loop on first found intersection
               break
            }
         }
      }, [])

   return (
      <group>
         <mesh
            ref={mref}
            position={props.position}
            scale={props.scale}
            rotation={props.rotation}
            raycast={raycast}
            {...props.events}
         >
            <bufferGeometry key={val.anyUpdate} attach="geometry" groups={val.groups} onUpdate={onUpdate}>
               <bufferAttribute attach={"attributes-position"} args={[new Float32Array(val.position), 3]} />
               <bufferAttribute attach="index" args={[new Uint16Array(val.cx), 1]} />
               <bufferAttribute attach={"attributes-pointA"} args={[val.fa, 3]} />
               <bufferAttribute attach={"attributes-pointB"} args={[val.fb, 3]} />
               <bufferAttribute attach={"attributes-pointC"} args={[val.fc, 3]} />
               {/* pointD is only used by "strip" shader used when transparent */}
               {transparency && <bufferAttribute attach={"attributes-pointD"} args={[val.fd, 3]} />}
            </bufferGeometry>
            {val.materials.map((matProps, i) => (
               <shaderMaterial key={i + pkey} attach={`material-${i}`} {...matProps} defines={{ HAS_POSITION: 1 }} />
            ))}
         </mesh>
         {sphere}
      </group>
   )
}
