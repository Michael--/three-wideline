import { describe, it, expect } from "vitest"
import { validateWidelineProps, normalizeShape, createMaterialGroups, buildLine } from "./internal-utils"
import { Vector2, Vector3 } from "three"
import { IAttribute } from "./Wideline"
import type { IVertices } from "./Scheme"

describe("Wideline Validation", () => {
   it("validates correct props successfully", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: [{ color: "red", width: 0.1 }],
      })
      expect(result.isValid).toBe(true)
      expect(result.warnings).toHaveLength(0)
   })

   it("validates multiple points array", () => {
      const result = validateWidelineProps({
         points: [
            [0, 0, 0],
            [1, 1, 0],
            [2, 0, 0],
         ],
         attr: [{ color: "blue", width: 0.2 }],
      })
      expect(result.isValid).toBe(true)
   })

   it("validates join types", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: [{ color: "green", width: 0.1 }],
         join: "Round",
      })
      expect(result.isValid).toBe(true)
   })

   it("validates caps", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: [{ color: "purple", width: 0.1 }],
         capsStart: "Round",
         capsEnd: "Square",
      })
      expect(result.isValid).toBe(true)
   })

   it("validates opacity range", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: [{ color: "yellow", width: 0.1 }],
         opacity: 0.8,
      })
      expect(result.isValid).toBe(true)
   })

   it("allows empty attr arrays", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: [],
      })
      expect(result.isValid).toBe(true)
   })

   it("rejects missing attr prop", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: undefined as unknown as IAttribute,
      })
      expect(result.isValid).toBe(false)
      expect(result.warnings).toContain("Wideline: attr prop is required")
   })

   it("rejects invalid join type", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: [{ color: "red", width: 0.1 }],
         join: "InvalidJoin" as unknown as string,
      })
      expect(result.isValid).toBe(false)
      expect(result.warnings[0]).toContain('Wideline: invalid join "InvalidJoin"')
   })

   it("rejects invalid opacity", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: [{ color: "red", width: 0.1 }],
         opacity: 1.5,
      })
      expect(result.isValid).toBe(false)
      expect(result.warnings).toContain("Wideline: opacity must be between 0 and 1")
   })

   it("rejects empty points array", () => {
      const result = validateWidelineProps({
         points: [],
         attr: [{ color: "red", width: 0.1 }],
      })
      expect(result.isValid).toBe(false)
      expect(result.warnings).toContain("Wideline: points array cannot be empty")
   })

   it("rejects invalid caps", () => {
      const result = validateWidelineProps({
         points: [0, 0, 0, 1, 1, 0],
         attr: [{ color: "red", width: 0.1 }],
         capsStart: "InvalidCap" as unknown as string,
      })
      expect(result.isValid).toBe(false)
      expect(result.warnings[0]).toContain('Wideline: invalid capsStart "InvalidCap"')
   })
})

describe("normalizeShape", () => {
   it("should normalize Vector2 array", () => {
      const v1 = new Vector2(1, 2)
      const v2 = new Vector2(3, 4)
      const result = normalizeShape([v1, v2])
      expect(result).toEqual([
         [1, 2, 0],
         [3, 4, 0],
      ])
   })

   it("should normalize Vector3 array", () => {
      const v1 = new Vector3(1, 2, 3)
      const v2 = new Vector3(4, 5, 6)
      const result = normalizeShape([v1, v2])
      expect(result).toEqual([
         [1, 2, 3],
         [4, 5, 6],
      ])
   })

   it("should normalize number array", () => {
      const result = normalizeShape([1, 2, 3, 4, 5, 6])
      expect(result).toEqual([
         [1, 2, 0],
         [3, 4, 0],
         [5, 6, 0],
      ])
   })

   it("should handle empty array", () => {
      const result = normalizeShape([])
      expect(result).toEqual([])
   })

   it("should handle single point", () => {
      const result = normalizeShape([1, 2])
      expect(result).toEqual([[1, 2, 0]])
   })
})

describe("createMaterialGroups", () => {
   it("should create material groups from indices and materials", () => {
      const idx = [
         [
            [0, 1, 2],
            [3, 4, 5],
         ],
         [[6, 7, 8]],
      ]
      const materials = [[{}, {}], [{}]]
      const result = createMaterialGroups(idx, materials)
      expect(result).toEqual([
         { start: 0, count: 6, materialIndex: 0, seq: 0 },
         { start: 6, count: 3, materialIndex: 2, seq: 0 },
         { start: 0, count: 6, materialIndex: 1, seq: 1 },
      ])
   })

   it("should sort groups by sequence and start", () => {
      const idx = [[[0, 1, 2]], [[3, 4, 5]]]
      const materials = [[{}], [{}, {}]]
      const result = createMaterialGroups(idx, materials)
      expect(result).toEqual([
         { start: 0, count: 3, materialIndex: 0, seq: 0 },
         { start: 3, count: 3, materialIndex: 1, seq: 0 },
         { start: 3, count: 3, materialIndex: 2, seq: 1 },
      ])
   })
})

describe("buildLine", () => {
   it("should accumulate point data for unlimited vertex groups", () => {
      const points = [
         [0, 0, 0],
         [1, 0, 0],
         [2, 0, 0],
      ]

      const vertices: IVertices[] = [
         {
            position: [
               [0, 0, 0],
               [1, 0, 0],
            ],
            index: [[0, 1, 1]],
         },
      ]

      const { result, position } = buildLine(points, vertices)

      expect(position).toEqual([
         [0, 0, 0],
         [1, 0, 0],
         [0, 0, 0],
         [1, 0, 0],
      ])
      expect(result.idx).toEqual([
         [
            [0, 1, 1],
            [2, 3, 3],
         ],
      ])
      expect(result.pA).toEqual([
         [0, 0, 0],
         [0, 0, 0],
         [1, 0, 0],
         [1, 0, 0],
      ])
      expect(result.pB).toEqual([
         [1, 0, 0],
         [1, 0, 0],
         [2, 0, 0],
         [2, 0, 0],
      ])
      expect(result.pC).toEqual([
         [2, 0, 0],
         [2, 0, 0],
         [2, 0, 0],
         [2, 0, 0],
      ])
      expect(result.pD).toEqual([
         [2, 0, 0],
         [2, 0, 0],
         [2, 0, 0],
         [2, 0, 0],
      ])
   })

   it("should respect limited start and end vertex constraints", () => {
      const points = [
         [0, 0, 0],
         [1, 0, 0],
         [2, 0, 0],
         [3, 0, 0],
      ]

      const vertices: IVertices[] = [
         {
            position: [[0, 0, 0]],
            index: [[0, 0, 0]],
            limited: "Start",
         },
         {
            position: [[0, 0, 0]],
            index: [[0, 0, 0]],
            limited: "End",
         },
      ]

      const { result, position } = buildLine(points, vertices)

      expect(position).toEqual([
         [0, 0, 0],
         [0, 0, 0],
      ])
      expect(result.idx).toEqual([[[0, 0, 0]], [[1, 1, 1]]])
      expect(result.pA).toEqual([
         [0, 0, 0],
         [2, 0, 0],
      ])
      expect(result.pB).toEqual([
         [1, 0, 0],
         [3, 0, 0],
      ])
      expect(result.pC).toEqual([
         [2, 0, 0],
         [3, 0, 0],
      ])
      expect(result.pD).toEqual([
         [3, 0, 0],
         [3, 0, 0],
      ])
   })
})
