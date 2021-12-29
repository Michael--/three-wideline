import { ShaderMaterialProps } from "@react-three/fiber"
import { Color, IUniform, DoubleSide, FrontSide } from "three"
import vertexSimple from "./shader/simple.vs"
import vertexStrip from "./shader/strip.vs"
import vertexStripTerminal from "./shader/stripterminal.vs"
import vertexCaps from "./shader/caps.vs"
import vertexRoundJoin from "./shader/roundJoin.vs"
import vertexBevel from "./shader/bevel.vs"
import vertexMiter from "./shader/miter.vs"
import * as THREE from "three"

/** @internal Create vertices only at start or end of the line */
export type Where = "Start" | "End"

/** @internal Index array of vertices */
export interface IVertices {
   /** Index array */
   index: number[]
   /** Line limitations */
   limited?: Where
}

/**
 * @public
 * Scheme/Attribute of a shader segment.
 */
export interface IScheme {
   /** Color */
   color?: Color
   /** Opacity */
   opacity?: number
   /** Width */
   width?: number
}

/**
 * @public
 * Geometry definition on excatly one line part, which can be a line segment,
 * or for example a cap or join.
 */
export interface IGeometry {
   /** Position (x,y) list */
   positions: number[][]
   /** Cell definition, the vertices of the geometry */
   cells: number[][]
}

/**
 * @internal
 * Collection of geometry and its shader.
 */
export interface ISchemeGeometry {
   positions: number[]
   vertices: IVertices[]
   shader: ShaderMaterialProps[][]
}

/**
 * @internal
 * Contains line scheme geometry creator.
 * This is a toolset to create the needed meshs for a whole line representation.
 */
export class Scheme {
   private data: ISchemeGeometry = {
      positions: [],
      vertices: [],
      shader: [],
   }

   public transparency = false

   /** @internal Access to the created geometry and shader */
   public getScheme() {
      return this.data
   }

   /** @internal Reset memory, can be used instead creating new instance */
   public reset() {
      this.data = {
         positions: [],
         vertices: [],
         shader: [],
      }
   }

   /**
    * Create simple line segments.
    * A list of meshes like rectangles.
    * At the joins, the rectangles are overlapped.
    */
   public simple = (props: IScheme[]) => {
      const geometry = boxGeometry()
      this.addGeometry(geometry)
      this.addUniforms("simple", vertexSimple, props)
   }

   /**
    * Create advanced line segments. Instead rectangles trapezoids created.
    * At the joins, these meshes are not overlapped.
    * Strips are used to draw transparent lines.
    */
   public strip = (props: IScheme[]) => {
      this.stripMain(props)
      this.stripTerminal(props)
   }

   /** draw all strips except first element */
   private stripMain = (props: IScheme[]) => {
      const geometry = boxGeometry()
      this.addGeometry(geometry)
      this.addUniforms("strip", vertexStrip, props)
   }

   /** draw only the first strip element */
   private stripTerminal = (props: IScheme[]) => {
      const geometry = boxGeometry()
      this.addGeometry(geometry, "Start")
      this.addUniforms("terminal", vertexStripTerminal, props)
   }

   /** Add custom meshes */
   public custom = (props: IScheme, geometry: IGeometry) => {
      this.addGeometry(geometry)
      this.addUniforms("simple", vertexSimple, [props])
   }

   /** Add bevil joins. */
   public bevel = (props: IScheme[]) => {
      const geometry: IGeometry = {
         positions: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
         ],
         cells: [[0, 1, 2]],
      }

      this.addGeometry(geometry)
      this.addUniforms("bevel", vertexBevel, props)
   }

   /** Add miter joins. */
   public miter = (props: IScheme[]) => {
      const geometry: IGeometry = {
         positions: [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [0, 0, 0], // w=1 calculated by vertex shader
         ],
         cells: [
            [0, 1, 2],
            [0, 2, 3],
         ],
      }

      this.addGeometry(geometry)
      this.addUniforms("miter", vertexMiter, props)
   }

   /** Add a cap to the line */
   public addCap = (props: IScheme[], geometry: IGeometry | undefined, where: Where) => {
      if (geometry !== undefined) {
         this.addGeometry(geometry, where)
         const u = { dir: { value: where === "Start" ? -1.0 : 1.0 } }
         this.addUniforms("caps", vertexCaps, props, u)
      }
   }

   /** Add a round join */
   public roundJoin = (props: IScheme[], resolution: number) => {
      const roundJoinGeometry = (resolution: number): IGeometry => {
         const positions: number[][] = []
         const cells: number[][] = []

         for (let i = 0; i < resolution + 2; i++) positions.push([i, 0, 0])
         for (let i = 0; i < resolution; i++) cells.push([0, i + 1, i + 2])

         return {
            positions,
            cells,
         }
      }
      this.addGeometry(roundJoinGeometry(resolution))
      const u = { resolution: { value: resolution } }
      this.addUniforms("roundJoin", vertexRoundJoin, props, u)
   }

   /** Append a geometry to the result */
   private addGeometry = (geometry: IGeometry, limited?: Where) => {
      const offset = this.data.positions.length / 3
      this.data.positions = this.data.positions.concat(geometry.positions.flat())
      const v = geometry.cells.flat().map(e => e + offset)
      this.data.vertices.push({ index: v, limited })
   }

   /** create shader uniform */
   private sprops(
      props: IScheme,
      uname: string,
      part1: string,
      part2: string,
      u?: { [uniform: string]: IUniform },
      zlevel?: number,
   ): ShaderMaterialProps {
      const shader = THREE.ShaderLib["standard"]
      const uniforms = THREE.UniformsUtils.merge([shader.uniforms])

      return {
         uniforms: {
            ...uniforms,
            width: { value: props.width ?? 1 },
            ambientLightColor: { value: props.color },
            diffuse: { value: props.color },
            opacity: { value: props.opacity ?? 1 },
            zlevel: { value: zlevel },
            ...u,
         },
         onBeforeCompile: sh => {
            sh.vertexShader = part1 + sh.vertexShader.replace("#include <begin_vertex>", part2)
         },
         customProgramCacheKey: () => uname,
         vertexShader: shader.vertexShader,
         fragmentShader: shader.fragmentShader,
         transparent: this.transparency,
         side: zlevel !== undefined && zlevel > 0 ? FrontSide : DoubleSide,
         lights: true,
         //defines: { STANDARD: "", PHYSICAL: "" },
      }
   }

   /** add a list of shaders with its uniforms */
   private addUniforms = (uname: string, vs: string, props: IScheme[], u?: { [uniform: string]: IUniform }) => {
      // zlevel offset used to stack multiple line attribute, the minimial meaningful value depends on gl shader engine
      // may it could be nice to configure this value by user interface in some cases
      // if this value is to small, the gl render engine fall into z-fighting
      const levelOffset = 0.005

      // split vertex shader imported from file in 2 parts, 1: definition of vars, 2: shader part creating transformed position
      const split = vs.split("void main() {")
      if (split.length < 2) throw "shader content unexpected, can't split in 2 parts"
      const part1 = split[0]
      const part2 = split[1].substring(0, split[1].lastIndexOf("}"))

      const sh = props.map((e, i) => this.sprops(e, uname, part1, part2, u, i * levelOffset))
      this.data.shader.push(sh)
   }
}

/**
 * @internal
 * Create a simple mesh geometry consists of two triangles.
 * It look like a box or reactangle.
 */
export const boxGeometry = (): IGeometry => {
   return {
      positions: [
         [0, -0.5, 0],
         [1, -0.5, 0],
         [1, 0.5, 0],
         [0, 0.5, 0],
      ],
      cells: [
         [0, 1, 2],
         [0, 2, 3],
      ],
   }
}

/**
 * @internal
 * Geometry of the square cap
 */
export const squareCapGeometry = (): IGeometry => {
   return {
      positions: [
         [0, 0.5, 0],
         [0, -0.5, 0],
         [0.5, -0.5, 0],
         [0.5, 0.5, 0],
      ],
      cells: [
         [0, 1, 2],
         [0, 2, 3],
      ],
   }
}

/**
 * @internal
 * Geometry of the top cap
 */
export const topCapGeometry = (): IGeometry => {
   return {
      positions: [
         [0, 0.5, 0],
         [0, -0.5, 0],
         [1, 0, 0],
      ],
      cells: [[0, 1, 2]],
   }
}

/**
 * @internal
 * Geometry of the round cap
 */
export const roundCapGeometry = (resolution: number): IGeometry => {
   const positions = [[0, 0, 0]]
   for (let i = 0; i <= resolution; i++) {
      const theta = -0.5 * Math.PI + (Math.PI * i) / resolution
      positions.push([0.5 * Math.cos(theta), 0.5 * Math.sin(theta), 0])
   }
   const cells: number[][] = []
   for (let i = 0; i < resolution; i++) {
      cells.push([0, i + 1, i + 2])
   }
   return { positions, cells }
}
