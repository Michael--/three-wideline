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

      it("should return null when window is undefined (SSR)", () => {
         const originalWindow = global.window
         delete (global as unknown as { window?: typeof window }).window

         const result = getMemoryUsage()
         expect(result).toBeNull()

         global.window = originalWindow
      })

      it("should calculate MB values correctly", () => {
         const result = getMemoryUsage()
         expect(result?.usedMB).toBe("0.95") // 1000000 / 1024 / 1024 ≈ 0.95
         expect(result?.totalMB).toBe("1.91") // 2000000 / 1024 / 1024 ≈ 1.91
         expect(result?.limitMB).toBe("4.77") // 5000000 / 1024 / 1024 ≈ 4.77
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

      it("should work with default parameters", () => {
         const mockFn = vi.fn(() => "test")
         const result = benchmark("test", mockFn)

         expect(result.result).toBe("test")
         expect(result.avgTime).toBeGreaterThan(0)
         expect(mockFn).toHaveBeenCalledTimes(110) // 10 warmup + 100 iterations
      })

      it("should handle zero iterations", () => {
         const mockFn = vi.fn(() => "test")
         expect(() => benchmark("test", mockFn, 0, 0)).toThrow("Benchmark failed")
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
