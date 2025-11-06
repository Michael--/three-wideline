# Performance Monitoring

This document describes the performance monitoring features available in the Three.js Wideline component.

## Features

### Render Performance Monitoring

The `usePerformanceMonitor` hook automatically tracks render performance for React components:

```typescript
import { usePerformanceMonitor } from './Wideline/performance-utils'

function MyComponent() {
   usePerformanceMonitor("MyComponent", process.env.NODE_ENV === "development")

   return <div>...</div>
}
```

**Features:**

- Tracks render count and timing
- Calculates average, minimum, and maximum render times
- Warns about slow renders (>16.67ms, which is more than one frame at 60fps)
- Only active in development mode by default
- Stores last 100 measurements for trend analysis

### Memory Usage Monitoring

Monitor JavaScript heap memory usage:

```typescript
import { getMemoryUsage } from "./Wideline/performance-utils"

const memory = getMemoryUsage()
if (memory) {
   console.log(`Memory used: ${memory.usedMB}MB / ${memory.totalMB}MB`)
}
```

**Returns:**

- `used`: Used heap size in bytes
- `total`: Total heap size in bytes
- `limit`: Heap size limit in bytes
- `usedMB`, `totalMB`, `limitMB`: Formatted sizes in MB

### Function Benchmarking

Measure function execution performance:

```typescript
import { benchmark } from "./Wideline/performance-utils"

const result = benchmark("myFunction", () => myFunction(arg), 100, 10)
console.log(`Average time: ${result.avgTime}ms`)
console.log(`Result: ${result.result}`)
```

**Parameters:**

- `name`: Benchmark identifier
- `fn`: Function to benchmark
- `iterations`: Number of measurement iterations (default: 100)
- `warmupIterations`: Warmup iterations to stabilize performance (default: 10)

**Returns:**

- `result`: Return value from the last function execution
- `avgTime`: Average execution time in milliseconds
- `minTime`: Minimum execution time
- `maxTime`: Maximum execution time

## Integration

The Wideline component automatically includes performance monitoring in development mode:

```tsx
import { Wideline } from "./Wideline"

// Performance monitoring is automatically enabled in development
;<Wideline points={points} attr={attr} />
```

## Development vs Production

- **Development**: Full performance monitoring with console warnings
- **Production**: Monitoring disabled for optimal performance

## Browser Support

- **Render Performance**: All modern browsers
- **Memory Usage**: Chrome, Edge (performance.memory API)
- **Benchmarking**: All browsers with performance.now()

## Example Output

```
[Performance] Wideline: {
  renderCount: 5,
  currentRenderTime: "12.34ms",
  averageTime: "15.67ms",
  minTime: "8.90ms",
  maxTime: "23.45ms"
}
```

For slow renders (>16.67ms):

````
[Performance] Wideline: Slow render detected (23.45ms > 16.67ms)
```</content>
<parameter name="filePath">/Volumes/MR-SX5/projects/three-wideline/docs/PERFORMANCE.md
````
