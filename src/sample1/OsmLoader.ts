// ---- types ---------------------------------------------------------------

type LonLat = [lon: number, lat: number]
type XY = [x: number, y: number]

type OverpassNode = { lat: number; lon: number }
type OverpassWay = {
   type: "way"
   id: number
   tags?: Record<string, string>
   geometry: OverpassNode[]
}

export type RoadFeature = {
   type: "Feature"
   properties: { id: number; highway: string; name: string | null }
   geometry: { type: "LineString"; coordinates: XY[] } // projected XY (meters, WebMercator)
}

export type RoadGeoJSON = {
   type: "FeatureCollection"
   features: RoadFeature[]
}

export type Triplet = {
   A: XY // previous point
   B: XY // current point
   C: XY // next point
   highway: string
   name: string | null
   width: number // suggested width by highway class
}

export type LoadRoadsParams = {
   /** Center point [lat, lon] and radius in meters */
   center: [lat: number, lon: number]
   /** Radius in meters from center point */
   radius: number
   /** Only include these highway classes; omit for all */
   highway?: string[]
   /** Overpass timeout seconds (default 25) */
   timeoutSec?: number
}

// ---- cache ---------------------------------------------------------------

/**
 * Simple in-memory cache for Overpass API responses
 */
const overpassCache = new Map<string, { geojson: RoadGeoJSON; triplets: Triplet[] }>()

/**
 * Generate cache key from request parameters
 */
function getCacheKey(params: LoadRoadsParams): string {
   const { center, radius, highway } = params
   const hwKey = highway?.sort().join(",") || "all"
   return `${center[0].toFixed(4)},${center[1].toFixed(4)},${radius},${hwKey}`
}

// ---- utils ---------------------------------------------------------------

// Simple WebMercator projection (lon/lat -> meters)
function webMercator([lon, lat]: LonLat): XY {
   const R = 6378137
   const x = ((lon * Math.PI) / 180) * R
   const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * R
   return [x, y]
}

// Suggested width/color mapping per highway class (tune as you like)
export function styleForHighway(h: string) {
   switch (h) {
      case "motorway":
         return { width: 14, colorA: "#ffffff", colorB: "#d9534f" }
      case "trunk":
         return { width: 12, colorA: "#ffffff", colorB: "#f0ad4e" }
      case "primary":
         return { width: 10, colorA: "#ffffff", colorB: "#f0ad4e" }
      case "secondary":
         return { width: 9, colorA: "#ffffff", colorB: "#5bc0de" }
      case "tertiary":
         return { width: 8, colorA: "#ffffff", colorB: "#5bc0de" }
      case "residential":
         return { width: 6, colorA: "#ffffff", colorB: "#999999" }
      case "service":
         return { width: 5, colorA: "#ffffff", colorB: "#bbbbbb" }
      case "cycleway":
      case "path":
      case "footway":
         return { width: 3, colorA: "#ffffff", colorB: "#77dd77" }
      default:
         return { width: 2, colorA: "#aaaaaa", colorB: "#555555" }
   }
}

// Convert LineString coords to A/B/C triplets for wide-line shaders
export function lineToTriplets(coords: XY[], highway: string, name: string | null): Triplet[] {
   const out: Triplet[] = []
   if (coords.length < 3) return out
   const w = styleForHighway(highway).width
   for (let i = 1; i < coords.length - 1; i++) {
      const A = coords[i - 1]
      const B = coords[i]
      const C = coords[i + 1]
      out.push({ A, B, C, highway, name, width: w })
   }
   return out
}

// ---- main loader ---------------------------------------------------------

/**
 * Fetch roads from Overpass in a bbox and return projected GeoJSON + A/B/C triplets.
 * Browser-friendly (uses fetch), no external deps.
 */
export async function loadRoadsFromOverpass(
   params: LoadRoadsParams,
): Promise<{ geojson: RoadGeoJSON; triplets: Triplet[] }> {
   // Check cache first
   const cacheKey = getCacheKey(params)
   const cached = overpassCache.get(cacheKey)
   if (cached) {
      return cached
   }

   const { center, radius, highway, timeoutSec = 25 } = params

   // Calculate bbox from center and radius
   // Account for latitude distortion (1 degree lat ≈ 111km everywhere, but lon varies by cos(lat))
   const [lat, lon] = center
   const latOffset = radius / 111000 // meters to degrees latitude
   const lonOffset = radius / (111000 * Math.cos((lat * Math.PI) / 180)) // meters to degrees longitude, corrected for latitude

   const minLat = lat - latOffset
   const maxLat = lat + latOffset
   const minLon = lon - lonOffset
   const maxLon = lon + lonOffset

   // Build Overpass query
   // Example core: way["highway"](minLat,minLon,maxLat,maxLon);
   const hwFilter = highway?.length
      ? `["highway"~"^(${highway.map(h => h.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")).join("|")})$"]`
      : '["highway"]'

   const query = `[out:json][timeout:${timeoutSec}];way${hwFilter}(${minLat},${minLon},${maxLat},${maxLon});out tags geom;`
   const url = `https://overpass-api.de/api/interpreter`

   // Use POST instead of GET for better reliability
   const res = await fetch(url, {
      method: "POST",
      body: query,
      headers: {
         "Content-Type": "application/x-www-form-urlencoded",
      },
   })

   if (!res.ok) {
      const txt = await res.text().catch(() => "")
      throw new Error(`Overpass error ${res.status}: ${txt.slice(0, 300)}`)
   }
   const data = await res.json()

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const ways: OverpassWay[] = (data.elements || []).filter((e: any) => e.type === "way")

   const features: RoadFeature[] = ways.map(w => {
      const coordsLonLat: LonLat[] = w.geometry.map(g => [g.lon, g.lat])
      const coordsXY: XY[] = coordsLonLat.map(webMercator)
      return {
         type: "Feature",
         properties: {
            id: w.id,
            highway: w.tags?.highway ?? "unknown",
            name: w.tags?.name ?? null,
         },
         geometry: { type: "LineString", coordinates: coordsXY },
      }
   })

   const geojson: RoadGeoJSON = { type: "FeatureCollection", features }

   // Build A/B/C triplets across all features
   const triplets: Triplet[] = []
   for (const f of features) {
      triplets.push(...lineToTriplets(f.geometry.coordinates, f.properties.highway, f.properties.name))
   }

   const result = { geojson, triplets }

   // Store in cache (only after successful response)
   overpassCache.set(cacheKey, result)

   return result
}

export async function sampleUsage() {
   // Hamburg inner city (500m radius around Rathaus)
   const { geojson, triplets } = await loadRoadsFromOverpass({
      center: [53.5511, 9.9937], // Hamburg Rathaus
      radius: 500,
      highway: ["motorway", "trunk", "primary", "secondary", "tertiary", "residential", "service"], // optional
      timeoutSec: 25,
   })

   // Use-case 1: draw with your wide-line shader using triplets
   //for (const t of triplets) {
   // feed t.A, t.B, t.C + t.width into your geometry/attributes
   //}

   // Use-case 2: debug as plain lines from geojson.features[*].geometry.coordinates
   // eslint-disable-next-line no-console
   console.log("features:", geojson.features.length, "triplets:", triplets.length)
}
