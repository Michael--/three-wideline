import React from "react"
import { Html } from "@react-three/drei"

type Vec3 = [number, number, number]

/**
 * Labels for line points based on interleaved XY points.
 */
export interface LineFeatureLabelsProps {
   /** Interleaved XY points: [x1, y1, x2, y2, ...]. */
   points: readonly number[]
   /**
    * Label text per point. Use empty string or undefined to hide a label.
    * The array index maps to the point index.
    */
   texts?: ReadonlyArray<string | undefined>
   /**
    * Optional offset per point. The array index maps to the point index.
    * Undefined means no offset for that point.
    */
   offsets?: ReadonlyArray<Vec3 | undefined>
   /** Optional inline styles for all labels. */
   style?: React.CSSProperties
}

const defaultStyle: React.CSSProperties = {
   fontSize: "12px",
   color: "#ffffff",
   backgroundColor: "rgba(0, 0, 0, 0.65)",
   padding: "2px 6px",
   borderRadius: "4px",
   whiteSpace: "nowrap",
   pointerEvents: "none",
}

/**
 * Render HTML labels for line points.
 * @param props - Component props.
 * @returns The label elements or null when points are invalid.
 */
export function LineFeatureLabels(props: LineFeatureLabelsProps): React.ReactElement | null {
   const { points, texts, offsets, style } = props
   const pointCount = Math.floor(points.length / 2)
   if (pointCount < 1) return null

   const labelData = React.useMemo(() => {
      const result: Array<{ position: Vec3; text?: string }> = []
      for (let i = 0; i < pointCount; i += 1) {
         const text = texts?.[i]
         if (!text) continue
         const offset = offsets?.[i]
         const x = points[i * 2] + (offset?.[0] ?? 0)
         const y = points[i * 2 + 1] + (offset?.[1] ?? 0)
         const z = offset?.[2] ?? 0
         result.push({ position: [x, y, z], text })
      }
      return result
   }, [points, pointCount, texts, offsets])

   if (labelData.length === 0) return null

   const mergedStyle = style ? { ...defaultStyle, ...style } : defaultStyle

   return (
      <>
         {labelData.map((label, index) => (
            <Html key={`label-${index}`} position={label.position} center transform={false} style={mergedStyle}>
               {label.text}
            </Html>
         ))}
      </>
   )
}
