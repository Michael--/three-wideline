import { describe, it, expect } from "vitest"
import { roundCapGeometry } from "./Scheme"

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
