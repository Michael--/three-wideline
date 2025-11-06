import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { usePerformanceMonitor, getMemoryUsage, benchmark } from "./performance-utils"

// Mock performance.memory API
const mockMemory = {
   usedJSHeapSize: 1000000,
   totalJSHeapSize: 2000000,
   jsHeapSizeLimit: 5000000,
}

beforeEach(() => {
   ;(window.performance as unknown as { memory: typeof mockMemory }).memory = mockMemory
})

afterEach(() => {
   delete (window.performance as unknown as { memory?: typeof mockMemory }).memory
})

describe("Performance Utilities", () => {
   describe("getMemoryUsage", () => {
      it("should return memory usage when available", () => {
         const result = getMemoryUsage()
         expect(result?.used).toBe(1000000)
         expect(result?.total).toBe(2000000)
         expect(result?.limit).toBe(5000000)
         expect(result?.usedMB).toMatch(/^\d+\.\d{2}$/)
         expect(result?.totalMB).toMatch(/^\d+\.\d{2}$/)
         expect(result?.limitMB).toMatch(/^\d+\.\d{2}$/)
      })

      it("should return null when performance.memory is not available", () => {
         delete (window.performance as unknown as { memory?: typeof mockMemory }).memory

         const result = getMemoryUsage()
         expect(result).toBeNull()
      })
   })

   describe("benchmark", () => {
      it("should benchmark a function correctly", () => {
         const mockFn = vi.fn(() => 42)
         const result = benchmark("test", mockFn, 10, 5)

         expect(result.result).toBe(42)
         expect(result.avgTime).toBeGreaterThan(0)
         expect(result.minTime).toBeGreaterThanOrEqual(0)
         expect(result.maxTime).toBeGreaterThanOrEqual(result.minTime)
         expect(mockFn).toHaveBeenCalledTimes(15) // 5 warmup + 10 iterations
      })

      it("should throw error if iterations don't complete", () => {
         const mockFn = vi.fn(() => {
            throw new Error("Test error")
         })

         expect(() => benchmark("test", mockFn, 1, 0)).toThrow("Test error")
      })
   })

   describe("usePerformanceMonitor", () => {
      it("should be defined", () => {
         expect(usePerformanceMonitor).toBeDefined()
      })

      // Note: Hook testing would require React Testing Library
      // This is a basic smoke test for now
   })
})
