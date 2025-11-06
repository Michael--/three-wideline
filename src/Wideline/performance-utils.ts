import { useEffect, useRef } from "react"

interface PerformanceMemory {
   usedJSHeapSize: number
   totalJSHeapSize: number
   jsHeapSizeLimit: number
}

interface ExtendedPerformance extends Performance {
   memory?: PerformanceMemory
}

/**
 * @internal
 * Performance monitoring hook for React components
 * Measures render time and detects performance regressions
 * @param componentName - Name of the component being monitored
 * @param enabled - Whether monitoring is enabled (default: true)
 */
export function usePerformanceMonitor(componentName: string, enabled = true) {
   const renderCountRef = useRef(0)
   const lastRenderTimeRef = useRef<number>(0)
   const renderTimesRef = useRef<number[]>([])
   const slowRenderCountRef = useRef(0)

   useEffect(() => {
      if (!enabled || typeof window === "undefined") return

      const startTime = performance.now()
      renderCountRef.current++

      return () => {
         const endTime = performance.now()
         const renderTime = endTime - startTime

         renderTimesRef.current.push(renderTime)

         // Keep only last 100 measurements
         if (renderTimesRef.current.length > 100) {
            renderTimesRef.current.shift()
         }

         // Log performance metrics less frequently (every 30 renders or when significant changes occur)
         const shouldLog =
            renderCountRef.current % 30 === 0 ||
            renderTime > 30 || // Log very slow renders immediately
            (renderTime > 16.67 && slowRenderCountRef.current < 3) // Log first few slow renders

         if (shouldLog && process.env.NODE_ENV === "development") {
            const avgTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length
            const maxTime = Math.max(...renderTimesRef.current)
            const minTime = Math.min(...renderTimesRef.current)

            console.warn(`[Performance] ${componentName}:`, {
               renderCount: renderCountRef.current,
               currentRenderTime: `${renderTime.toFixed(2)}ms`,
               averageTime: `${avgTime.toFixed(2)}ms`,
               minTime: `${minTime.toFixed(2)}ms`,
               maxTime: `${maxTime.toFixed(2)}ms`,
            })
         }

         // Warn about slow renders less frequently
         if (renderTime > 16.67) {
            slowRenderCountRef.current++

            // Only warn every 10 slow renders to reduce noise
            if (slowRenderCountRef.current % 10 === 0 && process.env.NODE_ENV === "development") {
               const avgTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length
               console.warn(
                  `[Performance] ${componentName}: Multiple slow renders detected (avg: ${avgTime.toFixed(2)}ms, count: ${slowRenderCountRef.current})`,
               )
            }
         } else {
            // Reset slow render counter when we have fast renders
            if (slowRenderCountRef.current > 0) {
               slowRenderCountRef.current = Math.max(0, slowRenderCountRef.current - 1)
            }
         }

         lastRenderTimeRef.current = endTime
      }
   })

   return {
      renderCount: renderCountRef.current,
      averageRenderTime:
         renderTimesRef.current.length > 0
            ? renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length
            : 0,
      lastRenderTime: lastRenderTimeRef.current,
   }
}

/**
 * @internal
 * Memory usage monitoring utility
 * @returns Memory usage information or null if not available
 */
export function getMemoryUsage() {
   if (typeof window === "undefined") return null

   const perf = performance as ExtendedPerformance
   if (!perf.memory) return null

   return {
      used: perf.memory.usedJSHeapSize,
      total: perf.memory.totalJSHeapSize,
      limit: perf.memory.jsHeapSizeLimit,
      usedMB: (perf.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
      totalMB: (perf.memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
      limitMB: (perf.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
   }
}

/**
 * @internal
 * Benchmark utility for measuring function performance
 * @param name - Name of the benchmark
 * @param fn - Function to benchmark
 * @param iterations - Number of iterations to run (default: 100)
 * @param warmupIterations - Number of warmup iterations (default: 10)
 * @returns Benchmark results including result, average time, min time, and max time
 */
export function benchmark<T>(
   name: string,
   fn: () => T,
   iterations = 100,
   warmupIterations = 10,
): { result: T; avgTime: number; minTime: number; maxTime: number } {
   // Warmup
   for (let i = 0; i < warmupIterations; i++) {
      fn()
   }

   const times: number[] = []

   for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      const result = fn()
      const end = performance.now()
      times.push(end - start)

      // Return result from last iteration
      if (i === iterations - 1) {
         return {
            result,
            avgTime: times.reduce((a, b) => a + b, 0) / times.length,
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
         }
      }
   }

   throw new Error("Benchmark failed")
}
