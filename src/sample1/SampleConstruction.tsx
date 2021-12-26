import { useMemo, useState, CSSProperties } from "react"
import { IAttribute, Wideline, Joins, JoinsList, Caps, CapsList } from "../Wideline"
import { generatePointsInterleaved } from "../Wideline"
import { SketchPicker, RGBColor } from "react-color"
import { Popover, HBox, VBox, Body, Button, Checkbox } from "./Gui"
import { ThreeCanvas } from "./ThreeCanvas"
import Select from "react-select"

type JoinItem = {
   value: Joins
   label: string
}

type CapsItem = {
   value: Caps
   label: string
}

function toHexColor(c: RGBColor): string {
   const toHex = (v: number) => {
      const hex = v.toString(16)
      return hex.length == 1 ? "0" + hex : hex
   }
   return "#" + toHex(c.r) + toHex(c.g) + toHex(c.b)
}

export function SampleConstruction() {
   const [edges, setEdges] = useState(8)
   const [dimension, setDimension] = useState(5)
   const [width, setWidth] = useState(0.2)
   const [width2, setWidth2] = useState(0.1)
   const [second, setSecond] = useState(false)
   const [color1, setColor1] = useState<RGBColor>({ a: 1.0, r: 255, g: 0, b: 0 })
   const [color2, setColor2] = useState<RGBColor>({ a: 1.0, r: 255, g: 255, b: 0 })
   const [picker, setPicker] = useState({ show: -1, x: 0, y: 0 })

   const joinlist = useMemo(
      () =>
         JoinsList.map(e => {
            const a: JoinItem = { value: e, label: e }
            return a
         }),
      [],
   )
   const capslist = useMemo(
      () =>
         CapsList.map(e => {
            const a: CapsItem = { value: e, label: e }
            return a
         }),
      [],
   )
   const [join, setJoin] = useState(joinlist[1])
   const [capsStart, setCapsStart] = useState(capslist[0])
   const [capsEnd, setCapsEnd] = useState(capslist[0])

   const styleColor = (color: RGBColor): CSSProperties => {
      return {
         borderRadius: "4px",
         padding: "4px",
         backgroundColor: toHexColor(color),
         // color: e.g. inverse of color,
      }
   }

   const styleCover: CSSProperties = {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      border: "none",
   }

   const points = useMemo(() => generatePointsInterleaved(edges + 1, dimension), [edges, dimension])
   const attr = useMemo(() => {
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
      <HBox>
         <VBox>
            <h3>Adjust some features of the displayed line</h3>
            <HBox>
               <Button onClick={(x, y) => setPicker({ show: 0, x, y })}>
                  <p style={styleColor(color1)}>Color</p>
               </Button>
               {second && (
                  <Button onClick={(x, y) => setPicker({ show: 1, x, y })}>
                     <p style={styleColor(color2)}>Color2</p>
                  </Button>
               )}
               <Checkbox checked={second} onChange={c => setSecond(c)}>
                  <p>show 2nd Attribute</p>
               </Checkbox>
               {picker.show >= 0 ? (
                  <Popover x={picker.x} y={picker.y}>
                     <Button style={styleCover} onClick={(x, y) => setPicker({ show: -1, x, y })}></Button>
                     <SketchPicker
                        color={picker.show === 0 ? color1 : color2}
                        onChange={c => (picker.show === 0 ? setColor1(c.rgb) : setColor2(c.rgb))}
                     />
                  </Popover>
               ) : undefined}
               <Body />
            </HBox>
            <HBox>
               <p>Join</p>
               <Select value={join} onChange={e => setJoin({ ...join, ...e })} options={joinlist} />
               <p>Start</p>
               <Select value={capsStart} onChange={e => setCapsStart({ ...capsStart, ...e })} options={capslist} />
               <p>End</p>
               <Select value={capsEnd} onChange={e => setCapsEnd({ ...capsEnd, ...e })} options={capslist} />
               <Body />
            </HBox>
            <HBox>
               <VBox>
                  <HBox>
                     <Button onClick={() => setEdges(Math.min(edges + 1, 10))}>▲</Button>
                     <Button onClick={() => setEdges(Math.max(edges - 1, 1))}>▼</Button>
                     <p>Edges: {edges}</p>
                     <Body />
                  </HBox>
                  <HBox>
                     <Button onClick={() => setDimension(Math.min(dimension + 1, 5))}>▲</Button>
                     <Button onClick={() => setDimension(Math.max(dimension - 1, 1))}>▼</Button>
                     <p>Dimension: {dimension}</p>
                     <Body />
                  </HBox>
                  <HBox>
                     <Button onClick={() => setWidth(Math.min(width + 0.1, 1))}>▲</Button>
                     <Button onClick={() => setWidth(Math.max(width - 0.1, 0.1))}>▼</Button>
                     <p style={{ marginRight: "40px" }}>Width: {width.toFixed(1)}</p>
                     {second && (
                        <HBox>
                           <Button onClick={() => setWidth2(Math.min(width2 + 0.1, 1))}>▲</Button>
                           <Button onClick={() => setWidth2(Math.max(width2 - 0.1, 0.1))}>▼</Button>
                           <p style={{ marginRight: "40px" }}>Width2: {width2.toFixed(1)}</p>
                        </HBox>
                     )}
                     <p>Opacity: {(color1.a ?? 1.0).toFixed(1)}</p>
                  </HBox>
               </VBox>
               <Body />
            </HBox>
         </VBox>
         <Body />
         <ThreeCanvas scale={4} width={"600px"} height={"200px"}>
            <Wideline
               points={points}
               attr={attr}
               join={join.value}
               capsStart={capsStart.value}
               capsEnd={capsEnd.value}
               opacity={color1.a}
            />
         </ThreeCanvas>
      </HBox>
   )
}
