import React from "react"
import { Wideline } from "../Wideline"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Box, Paragraph, Text, Button, Spinner } from "grommet"
import { styleForHighway, type RoadGeoJSON, loadRoadsFromOverpass } from "./OsmLoader"

/**
 * City presets with center coordinates and radius
 */
const CITY_PRESETS = {
   Hamburg: { center: [53.5511, 9.9937] as [number, number], radius: 500, name: "Hamburg" },
   Berlin: { center: [52.52, 13.405] as [number, number], radius: 500, name: "Berlin" },
   Munich: { center: [48.1374, 11.5755] as [number, number], radius: 400, name: "Munich" },
}

/**
 * Flight controls component that smoothly moves the camera target through the map
 */
function FlightControls() {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const controlsRef = React.useRef<any>(null)

   useFrame(state => {
      if (controlsRef.current) {
         const t = state.clock.elapsedTime * 0.1
         // Move target in a figure-8 pattern for interesting flight path
         const x = Math.sin(t) * 15
         const y = Math.sin(t * 2) * 10
         controlsRef.current.target.set(x, y, 0)
         controlsRef.current.update()
      }
   })

   return (
      <OrbitControls
         ref={controlsRef}
         enablePan={true}
         enableZoom={true}
         enableRotate={true}
         minDistance={3}
         maxDistance={20}
         maxPolarAngle={Math.PI / 2.2}
         target={[0, 0, 0]}
      />
   )
}

/**
 * Douglas-Peucker line simplification algorithm
 * @param points - Array of [x, y] coordinates
 * @param epsilon - Tolerance (larger = more aggressive simplification)
 * @returns Simplified array of coordinates
 */
function douglasPeucker(points: [number, number][], epsilon: number): [number, number][] {
   if (points.length <= 2) return points
   // Find point with maximum distance from line between first and last
   let maxDistance = 0
   let maxIndex = 0
   const start = points[0]
   const end = points[points.length - 1]

   for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], start, end)
      if (distance > maxDistance) {
         maxDistance = distance
         maxIndex = i
      }
   }

   // If max distance is greater than epsilon, recursively simplify
   if (maxDistance > epsilon) {
      const left = douglasPeucker(points.slice(0, maxIndex + 1), epsilon)
      const right = douglasPeucker(points.slice(maxIndex), epsilon)
      return [...left.slice(0, -1), ...right]
   } else {
      return [start, end]
   }
}

/**
 * Calculate perpendicular distance from point to line
 * @param point - Point to measure
 * @param lineStart - Line start
 * @param lineEnd - Line end
 * @returns Distance
 */
function perpendicularDistance(
   point: [number, number],
   lineStart: [number, number],
   lineEnd: [number, number],
): number {
   const [x, y] = point
   const [x1, y1] = lineStart
   const [x2, y2] = lineEnd

   const dx = x2 - x1
   const dy = y2 - y1

   if (dx === 0 && dy === 0) {
      // Line is a point
      return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2)
   }

   const numerator = Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1)
   const denominator = Math.sqrt(dx ** 2 + dy ** 2)
   return numerator / denominator
}

/**
 * Calculate center and scale factor from GeoJSON bounds
 * @param geojson - Road data
 * @returns Center point and scale factor
 */
function calculateCenterAndScale(geojson: RoadGeoJSON): { center: [number, number]; scale: number } {
   let minX = Infinity
   let maxX = -Infinity
   let minY = Infinity
   let maxY = -Infinity

   geojson.features.forEach(feature => {
      feature.geometry.coordinates.forEach(([x, y]) => {
         minX = Math.min(minX, x)
         maxX = Math.max(maxX, x)
         minY = Math.min(minY, y)
         maxY = Math.max(maxY, y)
      })
   })

   const centerX = (minX + maxX) / 2
   const centerY = (minY + maxY) / 2
   const width = maxX - minX
   const height = maxY - minY
   const maxDim = Math.max(width, height)

   // WebMercator coords are in meters, scale to fit in ~40 units viewport
   // For a small area (500m-1000m), we want to scale down
   const scale = maxDim > 0 ? 40 / maxDim : 1

   return { center: [centerX, centerY], scale }
}

export const SampleStreets = () => {
   const [geojson, setGeojson] = React.useState<RoadGeoJSON | null>(null)
   const [selectedCity, setSelectedCity] = React.useState<keyof typeof CITY_PRESETS>("Hamburg")
   const [loading, setLoading] = React.useState(false)
   const [error, setError] = React.useState<string | null>(null)

   // Get current radius from selected city preset
   const radius = React.useMemo(() => CITY_PRESETS[selectedCity].radius, [selectedCity])

   const centerAndScale = React.useMemo(() => {
      if (!geojson) return { center: [0, 0] as [number, number], scale: 1 }
      const result = calculateCenterAndScale(geojson)

      // Debug output
      console.warn("Bounds and scale:", {
         center: result.center,
         scale: result.scale,
         sampleWidth: 10 * result.scale, // What a 10m road becomes
      })

      return result
   }, [geojson])

   /**
    * Get unique highway types from loaded data, sorted by hierarchy
    */
   const highwayTypes = React.useMemo(() => {
      if (!geojson) return []

      // Extract unique highway types
      const uniqueTypes = new Set(geojson.features.map(f => f.properties.highway))

      // Define hierarchy for sorting (lower index = drawn first, higher on top)
      const hierarchy = [
         "path",
         "footway",
         "cycleway",
         "service",
         "residential",
         "unclassified",
         "tertiary",
         "secondary",
         "primary",
         "trunk",
         "motorway",
      ]

      // Sort by hierarchy, but include all types found in data
      return Array.from(uniqueTypes).sort((a, b) => {
         const indexA = hierarchy.indexOf(a)
         const indexB = hierarchy.indexOf(b)
         // If type is in hierarchy, use its index, otherwise put at end
         const orderA = indexA >= 0 ? indexA : 999
         const orderB = indexB >= 0 ? indexB : 999
         return orderA - orderB
      })
   }, [geojson])

   /**
    * Get Z-offset for a highway type based on its position in the hierarchy
    */
   const getZOffset = React.useCallback(
      (hwType: string) => {
         const index = highwayTypes.indexOf(hwType)
         return index >= 0 ? index * 0.001 : 0
      },
      [highwayTypes],
   )

   /**
    * Load city data from Overpass API
    */
   const loadCity = React.useCallback(async (city: keyof typeof CITY_PRESETS) => {
      setLoading(true)
      setError(null)
      setSelectedCity(city)

      const preset = CITY_PRESETS[city]

      try {
         const { geojson: data } = await loadRoadsFromOverpass({
            center: preset.center,
            radius: preset.radius,
            // Don't specify highway types - load all roads
            timeoutSec: 25,
         })

         console.warn("Loaded data:", {
            features: data.features.length,
            city: preset.name,
            radius: preset.radius,
         })

         // Convert to same format as static data (already in WebMercator, but center it)
         const allCoords = data.features.flatMap(f => f.geometry.coordinates)
         const centerX = allCoords.reduce((sum, [x]) => sum + x, 0) / allCoords.length
         const centerY = allCoords.reduce((sum, [, y]) => sum + y, 0) / allCoords.length

         const centeredData: RoadGeoJSON = {
            type: "FeatureCollection",
            features: data.features.map(f => ({
               ...f,
               geometry: {
                  type: "LineString",
                  coordinates: f.geometry.coordinates.map(([x, y]) => [x - centerX, y - centerY]),
               },
            })),
         }

         setGeojson(centeredData)
      } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to load data")
         console.error("Error loading roads:", err)
      } finally {
         setLoading(false)
      }
   }, [])

   // Camera distance based on radius
   const cameraDistance = React.useMemo(() => {
      return Math.max(15, radius * 0.003)
   }, [radius])

   // Load default city on mount
   React.useEffect(() => {
      loadCity("Hamburg")
   }, [loadCity])

   return (
      <Box direction="column" pad="small" gap="small">
         <Paragraph margin="none">
            <strong>Street Atlas:</strong> Demonstrates the original use-case for Wideline - rendering map views with
            real OpenStreetMap data. Streets are drawn in hierarchical layers using Wideline's dual-color feature (white
            center with colored border) for realistic intersection visualization. Use mouse to orbit, zoom and pan the
            drone camera view.
         </Paragraph>

         <Box direction="row" gap="small" align="center" wrap>
            <Text size="small" weight="bold">
               City: {CITY_PRESETS[selectedCity].name}
            </Text>
            {Object.keys(CITY_PRESETS).map(city => (
               <Button
                  key={city}
                  label={city}
                  onClick={() => loadCity(city as keyof typeof CITY_PRESETS)}
                  disabled={loading}
                  primary={selectedCity === city}
                  size="small"
               />
            ))}
            {loading && <Spinner size="small" />}
         </Box>

         {error && (
            <Box background="status-error" pad="small" round="small">
               <Text size="small" color="white">
                  {error}
               </Text>
            </Box>
         )}

         <Box align="center">
            <Canvas
               camera={{
                  position: [-cameraDistance * 0.7, -cameraDistance, cameraDistance * 0.35],
                  up: [0, 0, 1],
                  fov: 50,
               }}
               style={{
                  backgroundColor: "#1A1A1A",
                  width: "800px",
                  height: "600px",
               }}
            >
               <ambientLight intensity={0.5} />
               <directionalLight position={[10, -10, 10]} intensity={2.0} />
               <hemisphereLight args={["#ffffff", "#404040", 0.3]} />

               <FlightControls />

               {/* Ground plane */}
               <mesh position={[0, 0, -0.1]}>
                  <planeGeometry args={[200, 200]} />
                  <meshStandardMaterial color="#5F5F5F" />
               </mesh>

               {/* Render streets from OSM data */}
               {geojson && (
                  <group>
                     {/* Draw in reverse hierarchy order so motorways appear on top */}
                     {highwayTypes.map(hwType => {
                        const filtered = geojson.features.filter(f => f.properties.highway === hwType)
                        return filtered.map(feature => {
                           const style = styleForHighway(feature.properties.highway)

                           // Skip streets with too few points
                           if (feature.geometry.coordinates.length < 2) return null

                           // First, convert WebMercator coords to scene coords
                           const sceneCoords: [number, number][] = feature.geometry.coordinates.map(([x, y]) => [
                              (x - centerAndScale.center[0]) * centerAndScale.scale,
                              (y - centerAndScale.center[1]) * centerAndScale.scale,
                           ])

                           // Then apply Douglas-Peucker simplification on scene coordinates
                           // Epsilon in scene units (not meters!)
                           const epsilon = 0.02
                           const simplified = douglasPeucker(sceneCoords, epsilon)

                           // Get Z-offset based on highway hierarchy
                           const z = getZOffset(feature.properties.highway)
                           const points = simplified.flatMap(([x, y]) => [x, y])

                           // Need at least 2 points after simplification
                           if (points.length < 4) return null

                           // Width: style.width is in meters (3-14), scale it appropriately
                           const width = style.width * centerAndScale.scale

                           return (
                              <group position={[0, 0, z]}>
                                 <Wideline
                                    key={`${hwType}-${feature.properties.id}`}
                                    points={points}
                                    attr={[
                                       { color: style.colorA, width: width * 1 },
                                       { color: style.colorB, width: width * 0.8 },
                                    ]}
                                    join="Miter"
                                    capsStart="Butt"
                                    capsEnd="Butt"
                                 />
                              </group>
                           )
                        })
                     })}
                  </group>
               )}
            </Canvas>
         </Box>

         {geojson && (
            <Box pad={{ horizontal: "small" }} gap="xsmall">
               <Text size="small" weight="bold">
                  Loaded: {geojson.features.length} streets | Scale: {centerAndScale.scale.toExponential(2)} | Avg
                  points:{" "}
                  {(
                     geojson.features.reduce((sum, f) => sum + f.geometry.coordinates.length, 0) /
                     geojson.features.length
                  ).toFixed(1)}
               </Text>
               <Box direction="row" gap="medium" wrap>
                  {highwayTypes.map(hwType => {
                     const count = geojson.features.filter(f => f.properties.highway === hwType).length
                     if (count === 0) return null
                     const style = styleForHighway(hwType)
                     return (
                        <Box key={hwType} direction="row" align="center" gap="xsmall">
                           <Box
                              width="30px"
                              height="4px"
                              background={style.colorA}
                              style={{ border: `2px solid ${style.colorB}`, borderRadius: "2px" }}
                           />
                           <Text size="small">
                              {hwType} ({count})
                           </Text>
                        </Box>
                     )
                  })}
               </Box>
            </Box>
         )}
      </Box>
   )
}
