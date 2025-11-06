import { describe, it, expect } from "vitest"
import { generatePointsInterleaved } from "../tools"

describe("generatePointsInterleaved", () => {
   it("should generate correct points for count 2", () => {
      const result = generatePointsInterleaved(2)
      expect(result).toEqual([-0.5, 0.5, 0.5, -0.5])
   })

   it("should generate correct points for count 3", () => {
      const result = generatePointsInterleaved(3)
      expect(result).toEqual([-0.5, 0.5, 0, -0.5, 0.5, 0.5])
   })

   it("should respect width and height", () => {
      const result = generatePointsInterleaved(2, 10, 20)
      expect(result).toEqual([-5, 10, 5, -10])
   })

   it("should enforce minimum count of 2", () => {
      const result = generatePointsInterleaved(1)
      expect(result).toEqual([-0.5, 0.5, 0.5, -0.5])
   })
})
