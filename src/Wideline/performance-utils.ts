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
 * Performance monitoring hook for React components
 * Measures render time and detects performance regressions
 */
export function usePerformanceMonitor(componentName: string, enabled = true) {
   const renderCountRef = useRef(0)
   const lastRenderTimeRef = useRef<number>(0)
   const renderTimesRef = useRef<number[]>([])

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

         // Log performance metrics
         if (process.env.NODE_ENV === "development") {
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

            // Warn about slow renders
            if (renderTime > 16.67) {
               // More than one frame at 60fps
               console.warn(
                  `[Performance] ${componentName}: Slow render detected (${renderTime.toFixed(2)}ms > 16.67ms)`,
               )
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
 * Memory usage monitoring utility
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
 * Benchmark utility for measuring function performance
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
