/**
 * @public
 * Generate a Zig-Zag line.
 * First points is left top.
 * The last point is right bottom for even count,
 * or right top for odd count.
 * @param count - How many points the line will have, must \>= 2.
 * @param width - The width of the virtual box the line are generated.
 * @param height - The height of the virtual box the line are generated.
 * @returns The coordinates of the line.
 */
export function generatePointsInterleaved(count: number, width?: number, height?: number) {
   count = Math.max(2, count)
   const xscale = width ? width * 0.5 : 0.5
   const yscale = height ? height * 0.5 : 0.5
   const stepx = (2 * xscale) / (count - 1)
   let y = yscale
   const result: number[] = []
   for (let x = 0; x < count; x++) {
      result.push(-xscale + x * stepx, y)
      y *= -1
   }
   return result
}
