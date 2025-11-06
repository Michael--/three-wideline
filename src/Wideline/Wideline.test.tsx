import { describe, it, expect } from "vitest"
import { validateWidelineProps, normalizeShape } from "./internal-utils"
import { Vector2, Vector3 } from "three"
import { IAttribute } from "./Wideline"

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
