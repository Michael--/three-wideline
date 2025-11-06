import React from "react"
import { IAttribute, Wideline, JoinsList, CapsList } from "../Wideline"
import { generatePointsInterleaved } from "../Wideline"
import { SketchPicker, RGBColor } from "react-color"
import { Box, Paragraph, DropButton, Text, CheckBox, Select, RangeInput } from "grommet"
import { ThreeCanvas } from "./ThreeCanvas"

function toHexColor(c: RGBColor): string {
   const toHex = (v: number) => {
      const hex = v.toString(16)
      return hex.length == 1 ? "0" + hex : hex
   }
   return "#" + toHex(c.r) + toHex(c.g) + toHex(c.b)
}

export function SampleConstruction() {
   const [edges, setEdges] = React.useState(8)
   const [width, setWidth] = React.useState(0.2)
   const [width2, setWidth2] = React.useState(0.1)
   const [second, setSecond] = React.useState(false)
   const [color1, setColor1] = React.useState<RGBColor>({ a: 1.0, r: 255, g: 0, b: 0 })
   const [color2, setColor2] = React.useState<RGBColor>({ a: 1.0, r: 255, g: 255, b: 0 })
   const [vx, setVx] = React.useState({ running: true, x: 0 })

   const joinlist = React.useMemo(() => JoinsList.map(e => e), [])
   const capslist = React.useMemo(() => CapsList.map(e => e), [])
   const [join, setJoin] = React.useState(joinlist[1])
   const [capsStart, setCapsStart] = React.useState(capslist[0])
   const [capsEnd, setCapsEnd] = React.useState(capslist[0])

   React.useEffect(() => {
      if (vx.running) {
         const t = setInterval(() => {
            // Force a simple animation.
            // As implemented it causes a lot of redraws with new geometry.
            // I can accept as a demo.
            setVx(v => ({ running: true, x: v.x + 0.025 }))
         }, 50)
         return () => {
            clearInterval(t)
         }
      }
   }, [vx.running])

   const points = React.useMemo(
      () => generatePointsInterleaved(edges + 1, Math.cos(vx.x) * 5, Math.cos(vx.x / 2.5)),
      [edges, vx.x],
   )
   const attr = React.useMemo(() => {
      const attr: IAttribute[] = [
         {
            color: toHexColor(color1),
            width: width,
         },
      ]
      if (second) {
         attr.push({
            color: toHexColor(color2),
            width: width2,
         })
      }
      return attr
   }, [second, color1, color2, width, width2])

   return (
      <Box direction="column" pad="small" gap="small">
         <Paragraph>Adjust some features of the displayed line.</Paragraph>
         <Box gap="small">
            <Box direction="row" gap="small">
               <DropButton
                  primary
                  color={toHexColor(color1)}
                  dropAlign={{ top: "bottom" }}
                  dropContent={<SketchPicker color={color1} onChange={c => setColor1(c.rgb)} />}
                  label={"Color"}
               />
               {second && (
                  <DropButton
                     primary
                     color={toHexColor(color2)}
                     dropAlign={{ top: "bottom" }}
                     dropContent={<SketchPicker color={color2} onChange={c => setColor2(c.rgb)} />}
                     label={"Color2"}
                  />
               )}
               <CheckBox
                  checked={second}
                  label="show 2nd Attribute"
                  onChange={event => setSecond(event.target.checked)}
               />
            </Box>
            <Box direction="row" gap="small" align="center">
               <Select options={joinlist} value={join} onChange={({ option }) => setJoin(option)} />
               <Text>Join</Text>
            </Box>
            <Box direction="row" gap="small" align="center">
               <Select options={capslist} value={capsStart} onChange={({ option }) => setCapsStart(option)} />
               <Text>Caps Start</Text>
            </Box>
            <Box direction="row" gap="small" align="center">
               <Select options={capslist} value={capsEnd} onChange={({ option }) => setCapsEnd(option)} />
               <Text>Caps End</Text>
            </Box>
            <Box direction="row" gap="small" align="center">
               <RangeInput value={edges} min={1} max={25} onChange={e => setEdges(+e.target.value)} />
               <Text>Edges</Text>
               <Text>{edges}</Text>
            </Box>
            <Box direction="row" gap="small" align="center">
               <RangeInput value={width * 100} min={0} max={100} onChange={e => setWidth(+e.target.value / 100)} />
               <Text>Width</Text>
               <Text>{width.toFixed(2)}</Text>
            </Box>
            {second && (
               <Box direction="row" gap="small" align="center">
                  <RangeInput value={width2 * 100} min={0} max={100} onChange={e => setWidth2(+e.target.value / 100)} />
                  <Text>Width2</Text>
                  <Text>{width2.toFixed(2)}</Text>
               </Box>
            )}
            <Text>Opacity: {(color1.a ?? 1.0).toFixed(1)}</Text>
            <CheckBox
               checked={vx.running}
               label="Animation"
               onChange={event => setVx({ ...vx, running: event.target.checked })}
            />
         </Box>
         <ThreeCanvas scale={4} width={"600px"} height={"200px"}>
            <ambientLight intensity={3} />
            <Wideline
               points={points}
               attr={attr}
               join={join}
               capsStart={capsStart}
               capsEnd={capsEnd}
               opacity={color1.a}
            />
         </ThreeCanvas>
      </Box>
   )
}
