import { describe, it, expect } from "vitest"
import { Color } from "three"
import { Scheme, boxGeometry, roundCapGeometry, squareCapGeometry, topCapGeometry } from "./Scheme"

describe("roundCapGeometry", () => {
   it("should generate correct geometry for resolution 4", () => {
      const result = roundCapGeometry(4)
      expect(result.positions.length).toBe(6)
      expect(result.positions[0]).toEqual([0, 0, 0])
      expect(result.positions[1][0]).toBeCloseTo(0)
      expect(result.positions[1][1]).toBeCloseTo(-0.5)
      expect(result.positions[1][2]).toBe(0)
      expect(result.positions[2][0]).toBeCloseTo(0.3535533905932738)
      expect(result.positions[2][1]).toBeCloseTo(-0.35355339059327373)
      expect(result.positions[3]).toEqual([0.5, 0, 0])
      expect(result.positions[4][0]).toBeCloseTo(0.3535533905932738)
      expect(result.positions[4][1]).toBeCloseTo(0.35355339059327373)
      expect(result.positions[5][0]).toBeCloseTo(0)
      expect(result.positions[5][1]).toBeCloseTo(0.5)
      expect(result.cells).toEqual([
         [0, 1, 2],
         [0, 2, 3],
         [0, 3, 4],
         [0, 4, 5],
      ])
   })

   it("should handle resolution 1", () => {
      const result = roundCapGeometry(1)
      expect(result.positions.length).toBe(3)
      expect(result.positions[0]).toEqual([0, 0, 0])
      expect(result.positions[1][0]).toBeCloseTo(0)
      expect(result.positions[1][1]).toBeCloseTo(-0.5)
      expect(result.positions[2][0]).toBeCloseTo(0)
      expect(result.positions[2][1]).toBeCloseTo(0.5)
      expect(result.cells).toEqual([[0, 1, 2]])
   })
})

describe("Scheme helper geometries", () => {
   it("should build box geometry", () => {
      const geometry = boxGeometry()
      expect(geometry.positions).toHaveLength(4)
      expect(geometry.cells).toHaveLength(2)
      expect(geometry.cells[0]).toEqual([0, 1, 2])
   })

   it("should build square cap geometry", () => {
      const geometry = squareCapGeometry()
      expect(geometry.positions).toHaveLength(4)
      expect(geometry.cells).toEqual([
         [0, 1, 2],
         [0, 2, 3],
      ])
   })

   it("should build top cap geometry", () => {
      const geometry = topCapGeometry()
      expect(geometry.positions).toHaveLength(3)
      expect(geometry.cells).toEqual([[0, 1, 2]])
   })
})

describe("Scheme class", () => {
   it("should build simple geometry with shader uniforms", () => {
      const scheme = new Scheme()
      scheme.simple([{ color: new Color("red"), width: 2 }])
      const data = scheme.getScheme()
      expect(data.vertices).toHaveLength(1)
      expect(data.shader).toHaveLength(1)
      const shader = data.shader[0][0]
      expect(shader.uniforms.width.value).toBe(2)
      expect(shader.uniforms.opacity.value).toBe(1)
      expect(shader.transparent).toBe(false)
   })

   it("should mark shader transparent when requested", () => {
      const transparentScheme = new Scheme()
      transparentScheme.transparency = true
      transparentScheme.simple([{ color: new Color("white") }])
      expect(transparentScheme.getScheme().shader[0][0].transparent).toBe(true)

      const opacityScheme = new Scheme()
      opacityScheme.simple([{ color: new Color("white"), opacity: 0.3 }])
      expect(opacityScheme.getScheme().shader[0][0].transparent).toBe(true)
   })

   it("should build strip geometries and set limited flag for the first strip", () => {
      const scheme = new Scheme()
      scheme.strip([{ color: new Color("blue"), width: 1 }])
      const data = scheme.getScheme()
      expect(data.vertices).toHaveLength(2)
      expect(data.vertices[1].limited).toBe("Start")
      expect(data.shader).toHaveLength(2)
   })

   it("should allow custom geometry injection", () => {
      const scheme = new Scheme()
      const customGeometry = { positions: [[0, 0, 0]], cells: [[0, 0, 0]] }
      scheme.custom({ color: new Color("white") }, customGeometry)
      expect(scheme.getScheme().vertices).toContainEqual({
         index: customGeometry.cells,
         limited: undefined,
         position: customGeometry.positions,
      })
      expect(scheme.getScheme().shader).toHaveLength(1)
   })

   it("should add bevel and miter geometries", () => {
      const scheme = new Scheme()
      scheme.bevel([{ color: new Color("red") }])
      scheme.miter([{ color: new Color("red") }])
      const data = scheme.getScheme()
      expect(data.vertices[0].index).toHaveLength(1)
      expect(data.vertices[1].index).toHaveLength(2)
      expect(data.shader).toHaveLength(2)
   })

   it("should respect cap direction uniforms", () => {
      const scheme = new Scheme()
      scheme.addCap([{ color: new Color("white") }], squareCapGeometry(), "Start")
      scheme.addCap([{ color: new Color("white") }], squareCapGeometry(), "End")
      const shaders = scheme.getScheme().shader
      expect(shaders[0][0].uniforms.dir.value).toBe(-1)
      expect(shaders[1][0].uniforms.dir.value).toBe(1)
   })

   it("should build round joins with resolution uniform", () => {
      const scheme = new Scheme()
      scheme.roundJoin([{ color: new Color("green") }], 3)
      const data = scheme.getScheme()
      expect(data.vertices[0].position).toHaveLength(5)
      expect(data.shader[0][0].uniforms.resolution.value).toBe(3)
   })

   it("should reset stored scheme data", () => {
      const scheme = new Scheme()
      scheme.simple([{ color: new Color("red") }])
      scheme.reset()
      const empty = scheme.getScheme()
      expect(empty.vertices).toHaveLength(0)
      expect(empty.shader).toHaveLength(0)
   })
})
