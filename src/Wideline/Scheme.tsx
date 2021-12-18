import { ShaderMaterialProps } from "@react-three/fiber"
import { Color, IUniform, DoubleSide, FrontSide } from "three"
import fragmentSimple from "!!raw-loader!./shader/simple.fs"
import vertexSimple from "!!raw-loader!./shader/simple.vs"
import vertexStrip from "!!raw-loader!./shader/strip.vs"
import vertexStripTerminal from "!!raw-loader!./shader/stripterminal.vs"
import vertexCaps from "!!raw-loader!./shader/caps.vs"
import vertexRoundJoin from "!!raw-loader!./shader/roundJoin.vs"
import vertexBevel from "!!raw-loader!./shader/bevel.vs"
import vertexMiter from "!!raw-loader!./shader/miter.vs"

export type Where = "Start" | "End"

export interface IVertices {
   index: number[]
   limited?: Where
}

export interface IScheme {
   color?: Color
   opacity?: number
   width?: number
}

export interface IGeometry {
   positions: number[][]
   cells: number[][]
}

export interface ISchemeGeometry {
   positions: number[]
   vertices: IVertices[]
   shader: ShaderMaterialProps[][]
}

export class Scheme {
   private data: ISchemeGeometry = {
      positions: [],
      vertices: [],
      shader: [],
   }

   public getScheme = () => this.data

   public simple = (props: IScheme[]) => {
      const geometry = boxGeometry()
      this.addGeometry(geometry)
      this.addUniforms(
         props.map(e => {
            return { props: e, vs: vertexSimple }
         }),
      )
   }

   public strip = (props: IScheme[]) => {
      this.stripMain(props)
      this.stripTerminal(props)
   }

   private stripMain = (props: IScheme[]) => {
      const geometry = boxGeometry()
      this.addGeometry(geometry)
      this.addUniforms(
         props.map(e => {
            return { props: e, vs: vertexStrip }
         }),
      )
   }

   private stripTerminal = (props: IScheme[]) => {
      const geometry = boxGeometry()
      this.addGeometry(geometry, "Start")
      this.addUniforms(
         props.map(e => {
            return { props: e, vs: vertexStripTerminal }
         }),
      )
   }

   public custom = (props: IScheme, geometry: IGeometry) => {
      this.addGeometry(geometry)
      this.addUniform(props, vertexSimple)
   }

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
      this.addUniforms(
         props.map(e => {
            return { props: e, vs: vertexBevel }
         }),
      )
   }

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
      this.addUniforms(
         props.map(e => {
            return { props: e, vs: vertexMiter }
         }),
      )
   }

   public addCap = (props: IScheme[], geometry: IGeometry | undefined, where: Where) => {
      if (geometry !== undefined) {
         this.addGeometry(geometry, where)
         const u = { dir: { value: where === "Start" ? -1.0 : 1.0 } }
         this.addUniforms(
            props.map(e => {
               return { props: e, vs: vertexCaps, u }
            }),
         )
      }
   }

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
      this.addUniforms(
         props.map(e => {
            return { props: e, vs: vertexRoundJoin, u }
         }),
      )
   }

   private addGeometry = (geometry: IGeometry, limited?: Where) => {
      const offset = this.data.positions.length / 3
      this.data.positions = this.data.positions.concat(geometry.positions.flat())
      const v = geometry.cells.flat().map(e => e + offset)
      this.data.vertices.push({ index: v, limited })
   }

   private sprops(
      props: IScheme,
      vs: string,
      u?: { [uniform: string]: IUniform },
      zlevel?: number,
   ): ShaderMaterialProps {
      return {
         uniforms: {
            width: { value: props.width ?? 1 },
            color: { value: props.color },
            opacity: { value: props.opacity ?? 1 },
            zlevel: { value: zlevel },
            ...u,
         },
         vertexShader: vs,
         fragmentShader: fragmentSimple,
         transparent: true,
         side: zlevel !== undefined && zlevel > 0 ? FrontSide : DoubleSide,
      }
   }

   private addUniform = (props: IScheme, vs: string, u?: { [uniform: string]: IUniform }) => {
      const sh = this.sprops(props, vs, u)
      this.data.shader.push([sh])
   }

   private addUniforms = (ux: { props: IScheme; vs: string; u?: { [uniform: string]: IUniform } }[]) => {
      const sh = ux.map((e, i) => this.sprops(e.props, e.vs, e.u, i * 0.0001))
      this.data.shader.push(sh)
   }
}

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
